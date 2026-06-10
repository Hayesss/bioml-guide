#!/usr/bin/env python3
"""Build remaining Stage 2-4 topics with Feynman learning content."""

import json, sys

with open('public/data/topics.json', 'r') as f:
    data = json.load(f)

existing = {t['key'] for t in data['topics']}

def add(key, name, stage, typ, diff, sections):
    if key in existing:
        print(f"  SKIP (exists): {key}")
        return
    data['topics'].append({
        'key': key, 'name': name, 'stage': stage, 'type': typ,
        'difficulty': diff, 'prerequisites': [], 'sections': sections
    })
    existing.add(key)

def A(c): return {'type':'analogy','icon':'🤔','title':'一句话理解','content':c}
def C(c): return {'type':'concept','icon':'📖','title':'核心概念','content':c}
def H(c): return {'type':'how','icon':'🔧','title':'工作原理','content':c}
def B(c): return {'type':'bio','icon':'🧬','title':'生物信息学应用','content':c}
def CD(c,o=''): return {'type':'code','icon':'💻','title':'动手试试','code':c,'output':o}
def Q(qs): return {'type':'check','icon':'✅','title':'检验你的理解','questions':qs}
def MQ(q, opts, ans, exp):
    return {'q':q,'options':opts,'answer':ans,'explanation':exp}

# ============ STAGE 2 ML ============
add('stage-2-ml-svm','支持向量机 (SVM)',2,'ml','中级',[
    A('<p><strong>SVM就像在两类数据之间画一条"最宽的安全隔离带"。</strong>想象两边分别是癌症患者和健康人的基因数据点，SVM不仅画一条线分开它们，还要让这条线离两边的点都尽可能远——这样新来的患者数据才能被最可靠地分类。</p>'),
    C('<p>SVM通过寻找<strong>最优超平面</strong>（在高维空间中的"分割线"）来分类。关键技巧是<strong>核函数(kernel trick)</strong>——当数据在原空间线性不可分时，通过核函数将数据映射到高维空间，在那里它们就线性可分了。常用核：线性核、RBF核（最常用）、多项式核。</p><p>SVM在高维小样本数据上表现优异——这正是生物信息学中很多场景的特点（如20000个基因×50个样本）。</p>'),
    B('<ul><li>🧬 <strong>蛋白质亚细胞定位预测：</strong>基于氨基酸组成特征预测蛋白质在细胞的哪个位置</li><li>🔬 <strong>基因表达分类：</strong>区分不同癌症亚型的基因表达谱</li><li>💊 <strong>药物-靶标预测：</strong>基于分子描述符判断药物是否与靶蛋白结合</li></ul>'),
    CD('from sklearn.svm import SVC\nfrom sklearn.preprocessing import StandardScaler\n\n# SVM对特征尺度敏感，先标准化\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X_gene_expr)\n\n# RBF核SVM用于基因表达分类\nsvm = SVC(kernel="rbf", C=1.0, gamma="scale")\nsvm.fit(X_scaled, y_cancer_type)\nprint(f"支持向量数: {len(svm.support_)}")'),
    Q([MQ('SVM的"核技巧(kernel trick)"解决什么问题？',['让代码运行更快','将非线性可分数据映射到高维使其线性可分','减少特征数量','自动选择特征'],1,'很多生物数据在原空间是线性不可分的（如不同癌症亚型的基因表达模式高度重叠），核函数将其映射到高维后可以找到分离超平面。')])
])

add('stage-2-ml-random-forest','随机森林与集成学习',2,'ml','中级',[
    A('<p><strong>随机森林=一群决策树投票。</strong>一个问题一个人判断可能出错，但100个人各自独立思考后投票——准确率大幅提升。每棵树看数据的不同子集和不同特征子集，所以各有"专长"，组合起来既有高准确率又能抗过拟合。</p>'),
    C('<p>随机森林=Bagging(Bootstrap Aggregating)+随机特征选择。从原始数据有放回地采样B个bootstrap数据集，每个训练一棵决策树，且每次分裂时只随机考虑一部分特征。最终分类结果由所有树投票决定。</p><p>核心优势：①天然抗过拟合 ②自动输出特征重要性 ③几乎不需要调参就能用 ④可并行训练。</p>'),
    B('<ul><li>🧬 <strong>SNP致病性预测：</strong>综合多维度基因组特征判断变异是否致病</li><li>🔬 <strong>生物标志物发现：</strong>通过特征重要性排序找到关键基因</li><li>📊 <strong>微生物组分析：</strong>基于OTU丰度预测疾病状态并鉴定关键菌群</li></ul>'),
    CD('from sklearn.ensemble import RandomForestClassifier\nimport numpy as np\n\nrf = RandomForestClassifier(n_estimators=100, max_depth=10)\nrf.fit(X_train, y_train)\n\n# 特征重要性——哪些基因对预测最重要\nimportances = rf.feature_importances_\ntop_genes = np.argsort(importances)[-10:]\nprint(f"Top10重要基因: {top_genes}")', 'Top10重要基因: [152 487 1023 ...]'),
    Q([MQ('随机森林为什么比单棵决策树好？',['更快','多棵树投票+随机采样→降低方差+抗过拟合','更省内存','需要更少数据'],1,'单棵树容易记住训练数据的噪声(高方差)。多棵树各自在不同数据和特征上训练，取平均/投票→方差大幅降低。')])
])

add('stage-2-ml-gradient-boosting','梯度提升树 (XGBoost, LightGBM)',2,'ml','中级',[
    A('<p><strong>梯度提升=串行改进的决策树。</strong>第一棵树做了粗略预测，第二棵树专注于修正第一棵树的错误，第三棵树再修正前两棵的错误……每棵新树都盯着前面的"残差"去优化。就像是接力赛——每个人都在前人基础上更进一步。</p>'),
    C('<p>梯度提升在每步训练一棵浅层树来拟合前面模型的残差(梯度方向)。XGBoost加正则化防过拟合，LightGBM用直方图算法和叶子优先生长大幅提速。这两个在表格数据的ML竞赛中统治了多年。</p>'),
    B('<ul><li>🧬 <strong>基因表达预测：</strong>从DNA序列特征预测基因表达量(回归)</li><li>💊 <strong>药物响应预测：</strong>基于细胞系特征预测IC50值，XGBoost在大多数药物上表现最优</li><li>🏆 <strong>Kaggle生信竞赛：</strong>梯度提升方法在基因组学预测任务中频繁夺冠</li></ul>'),
    CD('import xgboost as xgb\n\ndt = xgb.DMatrix(X_genomic, label=y_response)\nparams = {"max_depth":5, "eta":0.1, "objective":"reg:squarederror"}\nmodel = xgb.train(params, dt, num_boost_round=100)'),
    Q([MQ('梯度提升和随机森林的核心区别？',['梯度提升更快','提升是串行(纠错)，森林是并行(投票)','没有区别','随机森林更准确'],1,'随机森林=并行独立训练多棵树投票；梯度提升=串行训练，每棵树修正前面树的错误。')])
])

add('stage-2-ml-logistic-regression','逻辑回归',2,'ml','入门',[
    A('<p><strong>逻辑回归=给一个分数，然后转成概率。</strong>就像医生根据患者的各项指标打一个"风险分数"，然后用sigmoid函数把这个分数映射成0到1之间的概率。>0.5判为高风险，<0.5判为低风险。</p>'),
    C('<p>逻辑回归虽然名字里有"回归"，但本质是<strong>分类算法</strong>。它在线性组合z=w·x+b上套一层sigmoid函数σ(z)=1/(1+e⁻ᶻ)把输出压缩到(0,1)，解释为属于正类的概率。训练时最大化似然函数而非最小化均方误差。</p><p>最大优势：<strong>完全可解释</strong>——每个特征的权重直接反映其对预测的影响方向和大小。</p>'),
    B('<ul><li>🧬 <strong>疾病风险评分：</strong>综合多个基因变异和临床指标构建致病风险模型，医生可以直接理解每个因素的贡献</li><li>💊 <strong>药物敏感性二分类：</strong>预测细胞系对药物是否敏感(IC50<阈值)</li></ul>'),
    CD('from sklearn.linear_model import LogisticRegression\n\nlr = LogisticRegression(penalty="l1", solver="saga")  # L1=自动特征选择\nlr.fit(X_clinical, y_disease)\n\n# 可解释性——每个特征的权重\nfor name, coef in zip(feature_names, lr.coef_[0]):\n    print(f"{name}: {coef:.3f}")', 'age: 0.042\nTP53_mut: 1.823  ← 最强风险因素\nsmoking: 0.521'),
    Q([MQ('逻辑回归叫"回归"但做的是什么？',['回归预测数值','分类(输出概率→类别)','聚类','降维'],1,'虽叫回归，但sigmoid将线性输出映射为概率→分类。这是很多初学者的疑惑！')])
])

add('stage-2-ml-naive-bayes','朴素贝叶斯',2,'ml','入门',[
    A('<p><strong>朴素贝叶斯=用贝叶斯公式做分类，假设所有特征互相独立（虽然现实中很少成立，但效果往往出奇地好）。</strong>就像判断一封邮件是不是垃圾邮件：看"免费""中奖""点击"这些词各自出现的概率，虽然它们可能相关，但假装它们独立来简化计算——结果准确率还可以。</p>'),
    C('<p>基于贝叶斯定理P(C|X)=P(X|C)P(C)/P(X)。"朴素"是因为假设所有特征条件独立——这个假设几乎从不成立，但使得计算极其高效(只需统计词频/概率密度)。特别适合高维稀疏数据。</p><p>三种常见变体：Gaussian(连续特征)、Multinomial(计数特征，如k-mer频率)、Bernoulli(二值特征)。</p>'),
    B('<ul><li>🧬 <strong>序列分类：</strong>基于k-mer频率快速分类DNA序列的物种来源</li><li>🔬 <strong>蛋白质域预测：</strong>根据氨基酸频率预测蛋白质是否含有特定结构域</li><li>📚 <strong>文献挖掘：</strong>快速判断PubMed摘要是否属于某个主题</li></ul>'),
    CD('from sklearn.naive_bayes import MultinomialNB\nfrom sklearn.feature_extraction.text import CountVectorizer\n\n# DNA k-mer特征→物种分类\nvec = CountVectorizer(analyzer="char", ngram_range=(3,3))\nX_kmers = vec.fit_transform(dna_sequences)\nnb = MultinomialNB().fit(X_kmers, y_species)\nprint(f"准确率: {nb.score(X_kmers, y_species):.1%}")'),
    Q([MQ('"朴素"(Naive)指什么？',['算法很简单','假设所有特征互相独立','只适用于小数据','只能做二分类'],1,'朴素贝叶斯假设所有特征在给定类别下条件独立——现实几乎不成立但计算极快，很多场景效果仍不错。')])
])

add('stage-2-ml-pca-tsne','特征选择与降维 (PCA, t-SNE)',2,'ml','中级',[
    A('<p><strong>PCA像数据压缩——把冗余的高维信息浓缩到少数几个主成分里。t-SNE像地图投影——把高维的地球表面压到2D纸面上，尽量保持邻居关系。</strong></p>'),
    C('<p><strong>PCA(主成分分析)：</strong>线性降维，通过SVD找到方差最大的方向(主成分)，将原始20000维基因数据投影到前20-50个主成分上，保留大部分信息。</p><p><strong>t-SNE：</strong>非线性降维，特别擅长保持数据的局部邻域结构。适合可视化(2D/3D)，但<strong>不能用于下游分析</strong>——因为距离和密度被扭曲了。UMAP是更快的替代方案。</p>'),
    B('<p>单细胞RNA-seq的标准分析流程：用PCA降维到50维(去除噪声)，用UMAP/t-SNE降到2维(可视化)，每个点是一个细胞，同类型细胞自然聚在一起。</p>'),
    CD('from sklearn.decomposition import PCA\nimport numpy as np\n\n# PCA降维：20000基因→50主成分\nX_gene = np.random.randn(500, 20000)  # 500细胞×20000基因\npca = PCA(n_components=50)\nX_pca = pca.fit_transform(X_gene)\nprint(f"保留方差: {pca.explained_variance_ratio_.sum():.1%}")'),
    Q([MQ('t-SNE可视化结果能用于下游分析吗？',['可以，跟PCA一样','不能，距离和密度被扭曲，只能看局部结构','可以，但需要GPU','取决于数据'],1,'t-SNE严重扭曲全局距离和簇密度——你看到的两簇之间的距离和大小没有定量意义。聚类/差异分析应该用PCA降维后的数据。')])
])

add('stage-2-ml-hyperparameter-tuning','超参数调优',2,'ml','中级',[
    A('<p><strong>超参数调优=给模型找最佳"配方"。</strong>做菜时盐放多少、火候多大——这些不是从数据学来的，需要你自己试。网格搜索=把所有盐量×火候的组合全试一遍。贝叶斯优化=根据前面的结果聪明地选择下次试什么。</p>'),
    C('<p>超参数是模型训练前需要手动设置的参数(学习率、树的深度、正则化系数等)。调优方法：<strong>Grid Search</strong>遍历所有组合(全面但慢)，<strong>Random Search</strong>随机采样(更高效)，<strong>Bayesian Optimization</strong>用概率模型引导搜索(最智能)。</p>'),
    B('<p>在生信建模中，合适的超参数调优(如Optuna)可以将蛋白质功能预测的准确率提升5-15%。关键原则：<strong>永远在验证集上调参，绝对不能在测试集上泄露信息。</strong></p>'),
    CD('import optuna\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import cross_val_score\n\ndef objective(trial):\n    n = trial.suggest_int("n_estimators", 50, 300)\n    d = trial.suggest_int("max_depth", 3, 20)\n    rf = RandomForestClassifier(n_estimators=n, max_depth=d)\n    return cross_val_score(rf, X, y, cv=5).mean()\n\nstudy = optuna.create_study(direction="maximize")\nstudy.optimize(objective, n_trials=30)\nprint(f"最佳参数: {study.best_params}")'),
    Q([MQ('为什么不能在测试集上调超参数？',['测试集太小','会泄露测试集信息→高估泛化能力','计算太慢','不需要原因'],1,'在测试集上调参相当于考试前偷看答案——分数虚高但实际能力没变。用验证集调参，测试集只最后用一次。')])
])

add('stage-2-ml-shap-lime','模型解释性 (SHAP, LIME)',2,'ml','中级',[
    A('<p><strong>SHAP=给每个特征发"贡献账单"。</strong>模型预测这个SNP致病，为什么？SHAP告诉你：保守性得分贡献了+0.3，等位基因频率贡献了+0.1，蛋白结构影响贡献了-0.05(抵消了一点)。每个特征对最终预测的贡献清清楚楚。</p>'),
    C('<p>SHAP基于博弈论中的Shapley值——公平分配一个团队的"胜利"给每个成员。在ML中，它把模型的预测值分解为每个特征的贡献之和。LIME是另一种方法——在预测点附近用简单模型近似复杂模型来解释单次预测。</p>'),
    B('<p>在临床生信中，可解释性是关键——医生不会相信一个"黑箱"的诊断。SHAP可以解释为什么某个患者被预测为高风险，帮助识别关键的生物标志物。</p>'),
    CD('import shap, xgboost as xgb\n\nmodel = xgb.XGBClassifier().fit(X_train, y_train)\nexplainer = shap.TreeExplainer(model)\nshap_values = explainer.shap_values(X_test)\n# 瀑布图: 单个预测的特征贡献分解\nshap.plots.waterfall(explainer.expected_value, shap_values[0])'),
    Q([MQ('SHAP和特征重要性(如随机森林的feature_importances_)有什么不同？',['完全相同','SHAP对每个样本的每次预测给出特征贡献，重要性是全局平均','SHAP更快','SHAP只能用于XGBoost'],1,'特征重要性告诉你"整体来看哪个特征重要"，SHAP告诉你"对这个具体样本，每个特征分别贡献了多少"。')])
])

add('stage-2-ml-imbalanced-data','不平衡数据处理',2,'ml','中级',[
    A('<p><strong>在10000个SNP中找10个致病的，就像在10000粒沙子里找10粒金子。</strong>模型说"全判为沙子"就能拿99.9%准确率——但这完全没用。不平衡数据处理就是教会模型关注那10粒金子。</p>'),
    C('<p>处理不平衡数据的方法：①<strong>重采样</strong>——SMOTE合成少数类样本，或随机欠采样多数类 ②<strong>代价敏感学习</strong>——错分少数类的惩罚更大 ③<strong>用PR-AUC而非ROC-AUC</strong>评估 ④<strong>集成方法</strong>——如BalancedRandomForest。</p><p>生信中有大量天然不平衡场景：致病变异(0.1%)、稀有细胞类型(1%)、药物活性分子(5%)。</p>'),
    CD('from imblearn.over_sampling import SMOTE\nfrom sklearn.ensemble import RandomForestClassifier\n\nsmote = SMOTE(random_state=42)\nX_resampled, y_resampled = smote.fit_resample(X, y)\nprint(f"过采样前: {dict(zip(*np.unique(y, return_counts=True)))}\")\nprint(f"过采样后: {dict(zip(*np.unique(y_resampled, return_counts=True)))}\")\n\nrf = RandomForestClassifier().fit(X_resampled, y_resampled)'),
    Q([MQ('为什么PR-AUC比ROC-AUC对不平衡数据更敏感？',['二者一样','PR-AUC不看True Negative(多数类的正确预测)','PR-AUC更快','PR-AUC不需要标签'],1,'ROC-AUC关注TP和FP，当TN极多(99%+)时TN主导了曲线显得很好。PR-AUC忽略TN，真实反映少数类的检测能力。')])
])

add('stage-2-ml-survival-analysis','生存分析 (Cox模型、Kaplan-Meier)',2,'ml','中级',[
    A('<p><strong>生存分析研究"什么时候发生事件"而不只是"会不会发生"。</strong>两个患者都最终去世了，但一个活了2个月一个活了5年——只看"是否死亡"丢失了最关键的时间信息。生存分析同时利用事件是否发生和发生时间来建模。</p>'),
    C('<p><strong>Kaplan-Meier估计器：</strong>用观测数据估计生存曲线S(t)=P(存活时间>t)。<strong>Cox比例风险模型：</strong>评估多个变量(基因表达、突变、年龄)对生存风险的联合影响——h(t|X)=h₀(t)×exp(β₁x₁+β₂x₂+...)。exp(β)>1=高风险，<1=保护因素。</p><p>关键概念：<strong>删失(censoring)</strong>——患者在研究结束时还活着，只知道存活时间≥某值。</p>'),
    B('<p>肿瘤基因组学中最核心的分析——基于基因表达或突变特征预测患者总生存期(OS)和无进展生存期(PFS)，识别预后标志物。</p>'),
    CD('from lifelines import CoxPHFitter\nimport pandas as pd\n\ndf = pd.DataFrame({"TP53": [2.1, 3.5, 1.8], "survival": [45, 23, 67], "event": [1,1,0]})\ncph = CoxPHFitter()\ncph.fit(df, "survival", "event")\nprint(f"TP53风险比: {cph.hazard_ratios_[\"TP53\"]:.2f}")'),
    Q([MQ('生存分析中"删失(censored)"是什么意思？',['数据被删除了','知道患者至少活了X天但不知道确切死亡时间','数据是假的','一种正则化方法'],1,'临床研究中患者可能失访或研究结束时还活着——我们只知道他的存活时间≥观测到的最后随访时间，不知道确切死亡时间。')])
])

add('stage-2-ml-r-ecosystem','R语言ML生态初探 (caret, tidymodels)',2,'ml','入门',[
    A('<p><strong>R语言的ML生态就像一套专门为统计学家设计的工具箱。</strong>Python的scikit-learn像瑞士军刀(通用)，R的tidymodels像手术刀(精准的统计建模)。生信领域的很多经典方法(DESeq2, limma, Seurat)都是R写的。</p>'),
    C('<p>R语言在生信ML中的地位：<strong>caret</strong>提供200+模型的统一训练接口。<strong>tidymodels</strong>是caret的tidyverse风格继任者(parsnip+recipes+rsample)。<strong>Bioconductor</strong>是生信R包的生态系统。</p><p>Python vs R：生信DL研究→Python(PyTorch生态)；统计建模和差异表达→R(Bioconductor生态)。两者互补而非互斥。</p>'),
    B('<ul><li>🧬 差异表达分析: DESeq2, edgeR, limma (R专属)</li><li>📊 单细胞: Seurat (R) vs Scanpy (Python)</li><li>📈 生存分析: survival包 (R生态更成熟)</li></ul>'),
    CD('# R代码示例 (在R/RStudio中运行)\nlibrary(caret)\n# 用caret训练随机森林预测癌症亚型\ntrain_control <- trainControl(method="cv", number=10)\nmodel <- train(cancer_type ~ ., data=gene_expr,\n              method="rf", trControl=train_control)\nconfusionMatrix(model)'),
    Q([MQ('生信分析应该选Python还是R？',['只能选一个','看场景：DL用Python(PyTorch)，统计建模和差异表达用R(Bioconductor)','Python完胜','R完胜'],1,'两个都学一点最好——DL+ML框架用Python，差异表达和统计分析可能需要R。两者通过reticulate(R调Python)可以互通。')])
])

# ============ STAGE 2 DL ============
add('stage-2-dl-cnn','卷积神经网络 (CNN)',2,'dl','中级',[
    A('<p><strong>CNN像一个用"放大镜"扫描图像的检测器。</strong>放大镜(卷积核)在图像上逐行滑动，每次只看一小块区域，检测有没有特定的模式——比如"这里有条横线"、"那里有个角"。高层把这些局部模式组合成更复杂的形状。</p>'),
    C('<p>CNN的核心操作：<strong>卷积(Convolution)</strong>——用可学习的滤波器在输入上滑动，提取局部特征。<strong>池化(Pooling)</strong>——下采样减少尺寸。<strong>参数共享</strong>——所有位置用同一个滤波器，大幅减少参数量。</p><p>在生物序列分析中，1D CNN处理DNA/蛋白质序列(卷积核长度=k-mer长度)，相当于自动学习最有判别力的motif模式。</p>'),
    B('<ul><li>🧬 <strong>DNA基序发现：</strong>1D CNN自动学习转录因子结合位点的序列motif</li><li>🧪 <strong>蛋白质二级结构预测：</strong>从氨基酸序列预测α-helix/β-sheet/loop</li><li>🔬 <strong>DeepVariant：</strong>将测序读段比对信息编码为图像→CNN分类SNP/Indel</li></ul>'),
    CD('import torch.nn as nn\n\n# 1D CNN用于DNA序列motif检测\nclass DNA_CNN(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.conv1 = nn.Conv1d(4, 64, kernel_size=12)  # 4=ATCG\n        self.pool = nn.MaxPool1d(4)\n        self.conv2 = nn.Conv1d(64, 128, 8)\n        self.fc = nn.Linear(128, 1)  # 输出: 是否含有motif\n    def forward(self, x):\n        x = self.pool(torch.relu(self.conv1(x)))\n        x = self.pool(torch.relu(self.conv2(x)))\n        return self.fc(x.mean(dim=-1)).squeeze()'),
    Q([MQ('CNN为什么特别适合DNA序列分析？',['序列数据本身就是1D的','卷积核自动学习motif(局部模式)，类似位置权重矩阵PWM','CNN是唯一的选项','只有CNN能用GPU'],1,'卷积核本质就是自动学习的PWM(position weight matrix)——每个filter对应一个motif，这正是DNA序列分析的核心需求。')])
])

add('stage-2-dl-rnn','循环神经网络 (RNN)',2,'dl','中级',[
    A('<p><strong>RNN就像一个人边读书边做笔记。</strong>读到每个词时，他结合当前词的内容和之前的笔记(隐藏状态)来理解。读完一整句蛋白质序列后，笔记里就包含了整个序列的"摘要"——可以用来预测这条蛋白质的功能。</p>'),
    C('<p>RNN通过<strong>循环连接</strong>处理序列：当前输出hₜ取决于当前输入xₜ和上一时刻的隐藏状态hₜ₋₁。这使得RNN能"记住"之前看到的信息。适合变长序列：DNA(长度不固定的基因)、蛋白质(不同长度的氨基酸链)。</p><p>问题：标准RNN难以捕捉长程依赖——理论上能记住但实践中梯度会消失。</p>'),
    B('<ul><li>🧬 <strong>基因表达时间序列：</strong>建模基因表达随时间的动态变化</li><li>🧪 <strong>蛋白质功能预测：</strong>读取氨基酸序列→输出功能类别</li><li>📊 <strong>启动子强度预测：</strong>从DNA序列预测基因表达水平</li></ul>'),
    CD('import torch.nn as nn\n\n# RNN读取蛋白质序列→功能预测\nprotein_rnn = nn.RNN(\n    input_size=20,   # 20种氨基酸的embedding\n    hidden_size=128,\n    num_layers=2,\n    batch_first=True\n)\n# 输入: (batch, seq_len=300, 20)\n# 输出: (batch, seq_len, 128)'),
    Q([MQ('RNN相比FNN处理序列数据的优势是什么？',['更快','参数共享+循环连接→能处理变长序列并"记住"上下文','需要更少参数','没有优势'],1,'FNN需要固定输入大小且不考虑顺序。RNN的循环连接让它可以处理任意长度的序列，并且前一位置的信息可以影响后一位置。')])
])

add('stage-2-dl-lstm-gru','LSTM与GRU',2,'dl','中级',[
    A('<p><strong>RNN有"健忘症"——离得远的内容会忘记。LSTM给RNN装了三个"门"：忘记门(丢掉不重要的)、输入门(记住新的)、输出门(决定现在输出什么)。GRU是简化版LSTM，两个门搞定。</strong></p>'),
    C('<p>LSTM通过<strong>细胞状态(cell state)</strong>+门控机制解决长程梯度消失。遗忘门决定丢掉哪些旧信息，输入门决定记住哪些新信息，输出门决定当前输出。GRU合并了遗忘门和输入门为"更新门"，参数更少但通常效果不差。</p><p>在生信序列任务中，LSTM/GRU是标准RNN选择的替代——除非序列很短，否则几乎总是用LSTM/GRU。</p>'),
    B('<ul><li>🧬 <strong>蛋白质远程接触预测：</strong>LSTM捕捉序列中相距甚远但结构上接触的残基对</li><li>🔬 <strong>长非编码RNA分析：</strong>lncRNA通常很长(>200nt)，需要LSTM捕捉长程模式</li></ul>'),
    CD('import torch.nn as nn\n\n# 双向LSTM用于蛋白质序列\nbilstm = nn.LSTM(\n    input_size=64, hidden_size=128,\n    num_layers=2, bidirectional=True,\n    batch_first=True\n)\n# BiLSTM同时从前向后和从后向前读取→更好的上下文'),
    Q([MQ('LSTM解决了RNN的什么问题？',['RNN太慢了','长程梯度消失(忘记远处信息)','RNN参数太多','RNN不能用GPU'],1,'标准RNN处理长序列时，远处时间步的梯度指数衰减→模型学不到长程依赖。LSTM的细胞状态+门控机制让梯度可以"无损"传递很远。')])
])

add('stage-2-dl-embedding','Embedding层',2,'dl','中级',[
    A('<p><strong>Embedding=给每个离散符号(氨基酸、核苷酸)分配一个"坐标"。</strong>不是随便给的——相似的符号在空间中位置相近。就像城市地图：功能相似的地方自然挨在一起。A和G(都是嘌呤)的embedding向量会很近，而A和C(嘌呤vs嘧啶)会离得远。</p>'),
    C('<p>Embedding层将一个高维的one-hot向量(如20种氨基酸=20维)映射到一个低维的稠密向量(如64维)。这个映射矩阵是<strong>可学习的</strong>——训练过程中自动发现哪些氨基酸在功能上相似、哪些核苷酸偏好相同。</p><p>在蛋白质语言模型(ESM)中，氨基酸embedding是模型的第一层——之后的Transformer层在这些embedding上操作，学习更丰富的上下文表示。</p>'),
    B('<ul><li>🧬 <strong>DNA embedding：</strong>学习A/T/C/G的稠密表示(不只是one-hot)，自动发现嘌呤/嘧啶的模式</li><li>🧪 <strong>蛋白质embedding：</strong>学习20种氨基酸的"语义"表示——疏水的、带电的、极性的各聚在一起</li></ul>'),
    CD('import torch.nn as nn\n\n# DNA embedding: 4种碱基→64维稠密向量\ndna_embed = nn.Embedding(num_embeddings=4, embedding_dim=64)\n# A=0, T=1, C=2, G=3\nseq = torch.tensor([0, 1, 2, 3, 0, 2, 1])  # "ATCGACT"\nembeddings = dna_embed(seq)  # (7, 64)\nprint(f"ATCGACT → {embeddings.shape}")'),
    Q([MQ('Embedding和One-hot编码的区别？',['完全相同','One-hot是稀疏固定表示，Embedding是稠密可学习表示(相似的符号有相似的向量)','One-hot更高效','Embedding需要更少内存'],1,'One-hot: A=[1,0,0,0], T=[0,1,0,0]——所有碱基距离相等，没有"嘌呤vs嘧啶"的概念。Embedding学习后，A和G(嘌呤)的向量会很近。')])
])

add('stage-2-dl-dropout-regularization','Dropout与正则化',2,'dl','中级',[
    A('<p><strong>Dropout=每轮训练随机让一部分神经元"睡觉"。</strong>就像球队训练时，每场训练赛随机抽掉几个队员——这样剩下的队员不能依赖某个"明星球员"，每个人都要学会独当一面。最终全队上场时配合默契、不依赖任何单一个人。</p>'),
    C('<p>Dropout在每次训练迭代中随机将一部分神经元的输出设为0(通常p=0.2-0.5)。这迫使网络学习<strong>冗余表示</strong>——不能依赖某个特定神经元，因为每次它可能被丢弃。相当于在训练指数级数量的子网络并取平均。</p><p>推理时不dropout——所有神经元都参与，但输出要乘以(1-p)做缩放补偿。</p>'),
    B('<p>生信DL中Dropout几乎标配——基因组数据维度高样本少，网络极易过拟合。在蛋白质功能预测的FNN中加Dropout(0.3-0.5)是最简单有效的正则化。</p>'),
    CD('import torch.nn as nn\n\nmodel = nn.Sequential(\n    nn.Linear(1280, 256), nn.ReLU(),\n    nn.Dropout(0.4),      # 40%神经元随机休眠\n    nn.Linear(256, 64), nn.ReLU(),\n    nn.Dropout(0.3),      # 30%随机休眠\n    nn.Linear(64, 3)\n)\n# model.train()时Dropout生效，model.eval()时自动关闭'),
    Q([MQ('为什么推理时Dropout要关闭？',['为了更快','训练时dropout是做模型平均(ensemble)，推理时需要全部神经元保证最佳预测','为了省电','不需要关闭'],1,'Dropout训练时模拟了2^n个不同子网络。推理时所有神经元参与，相当于这些子网络的集成——需要缩放来匹配训练时的期望输出。')])
])

add('stage-2-dl-batch-norm','Batch Normalization',2,'dl','中级',[
    A('<p><strong>BatchNorm=给神经网络的每一层数据做"标准化"。</strong>就像流水线上每个工位收到标准尺寸的零件——不会因为上一工序的偏差导致这一工序出问题。数据经过每一层后都可能分布偏移(内部协变量偏移)，BatchNorm把它拉回标准正态分布。</p>'),
    C('<p>BatchNorm对每个mini-batch的激活值做：x̂=(x-μ)/σ，然后y=γx̂+β(γ和β是可学习参数）。好处：①加速训练(可用更大学习率) ②减少对初始化的敏感性 ③有轻微正则化效果。是ResNet和Transformer的标配组件。</p>'),
    B('<p>在生信DL中，BatchNorm对训练稳定性至关重要——DeepVariant、Enformer等模型都依赖它。但batch太小时(如仅2-4个样本)效果差，此时用LayerNorm替代。</p>'),
    CD('import torch.nn as nn\n\n# BatchNorm标配写法\nmodel = nn.Sequential(\n    nn.Linear(100, 64),\n    nn.BatchNorm1d(64),  # 对64个神经元输出做标准化\n    nn.ReLU(),\n    nn.Linear(64, 32),\n    nn.BatchNorm1d(32),\n    nn.ReLU(),\n    nn.Linear(32, 1)\n)'),
    Q([MQ('BatchNorm的"batch"指什么？',['一个训练批次(mini-batch)','整个数据集','一个样本','模型参数'],0,'BatchNorm在mini-batch的维度上计算均值和方差——如果batch_size=32，就是用32个样本的统计量做标准化。')])
])

add('stage-2-dl-learning-rate','学习率调度',2,'dl','中级',[
    A('<p><strong>学习率调度=训练时动态调整"步幅"。</strong>开始训练时大步走(高学习率)快速接近目标，后期小步微调(低学习率)精细收敛。就像停车：先快速驶入车位附近，然后慢速调整到精准位置。</p>'),
    C('<p>固定学习率很难：太大→训练后期震荡不收敛；太小→前期收敛太慢。学习率调度策略：<strong>StepLR</strong>每N轮降为原来的γ倍，<strong>CosineAnnealing</strong>余弦衰减(最常用)，<strong>ReduceLROnPlateau</strong>验证指标不提升时自动降低学习率，<strong>Warmup</strong>先从小学习率线性增到大学习率再衰减(Transformer标配)。</p>'),
    B('<p>训练蛋白质语言模型或基因组大模型时，学习率调度对最终性能有显著影响——warmup+cosine是现代Transformer训练的标准配方。</p>'),
    CD('import torch\n\noptimizer = torch.optim.Adam(model.parameters(), lr=1e-3)\n# 余弦退火: 学习率从1e-3衰减到0\nscheduler = torch.optim.lr_scheduler.CosineAnnealingLR(\n    optimizer, T_max=100)\n\nfor epoch in range(100):\n    train()\n    scheduler.step()  # 自动调整学习率\n    print(f"Epoch {epoch}: lr={scheduler.get_last_lr()[0]:.2e}")'),
    Q([MQ('Warmup是什么意思？',['预热GPU','训练开始时从小学习率线性增长到目标学习率','让模型休息','降低温度'],1,'训练初期参数是随机的，梯度方向不可靠。Warmup从极小的学习率开始，逐渐增加到目标值，避免一开始就走错方向——Transformer训练的标配。')])
])

add('stage-2-dl-data-augmentation','数据增强',2,'dl','中级',[
    A('<p><strong>数据增强=从你现有的数据"创造"更多训练样本。</strong>你只有100张猫的照片，但你可以把它们翻转、旋转、调亮度→瞬间变1000张。在生信中：一条DNA序列，取它的反向互补链=一个新的训练样本(生物学上等价但序列不同)。</p>'),
    C('<p>数据增强本质是利用<strong>领域知识</strong>对数据做不变性变换——变换后标签不变但特征变了，模型学会这些不变性后泛化能力更强。生信中独特的增强方法：DNA反向互补、翻译(从mRNA序列增强)、蛋白质的保守氨基酸替换、单细胞的dropout模拟。</p>'),
    B('<ul><li>🧬 <strong>DNA增强：</strong>反向互补(生物学等价)、随机截取子序列、加测序噪声</li><li>🧪 <strong>蛋白质增强：</strong>随机突变非保守氨基酸(功能通常不变)</li></ul>'),
    CD('import random\n\ndef augment_dna(seq):\n    """DNA序列增强: 随机反向互补"""\n    comp = {"A":"T","T":"A","C":"G","G":"C"}\n    if random.random() > 0.5:\n        # 反向互补——生物学上等价！\n        seq = "".join(comp[b] for b in reversed(seq))\n    return seq\n\noriginal = "ATCGATCG"\nprint(f"原始: {original}")\nprint(f"增强: {augment_dna(original)}")','原始: ATCGATCG\n增强: CGATCGAT'),
    Q([MQ('为什么DNA反向互补是有效的数据增强？',['因为序列看起来不同','反向互补链编码相同的遗传信息(生物学等价)','为了增加数据量','因为模型不知道方向'],1,'DNA是双链的——正向链和反向互补链编码相同的基因。所以翻转序列是合法的增强，模型应该学到这种不变性。')])
])

add('stage-2-dl-transfer-learning','迁移学习基础',2,'dl','中级',[
    A('<p><strong>迁移学习=用别人训练好的"大脑"来做你的事。</strong>别人花了100万美元训练了一个识别所有物体的模型，你只需要花1美元微调它来识别显微镜下的细胞。这不是偷懒——而是站在巨人的肩膀上。</p>'),
    C('<p>在生信DL中，迁移学习通过<strong>预训练+微调</strong>实现：在大规模无标注数据上预训练(如ESM-2在6500万蛋白质序列上预训练)，然后在小规模标注数据上微调(如你自己的100个功能注释的蛋白质)。</p><p>这是目前生信DL的<strong>标准范式</strong>——直接在基因组或蛋白质序列上从头训练几乎不会比预训练模型好。</p>'),
    B('<ul><li>🧪 ESM-2预训练 → 微调预测蛋白质稳定性(仅需几百条标注数据)</li><li>🧬 Nucleotide Transformer预训练 → 微调预测启动子活性</li><li>🔬 scGPT预训练 → 微调做细胞类型注释</li></ul>'),
    CD('from transformers import AutoModel\nimport torch.nn as nn\n\n# 加载预训练ESM-2 + 微调\npretrained = AutoModel.from_pretrained("facebook/esm2_t6_8M_UR50D")\n# 冻结预训练权重(可选)\nfor p in pretrained.parameters():\n    p.requires_grad = False\n# 加自己的分类头\nclassifier = nn.Linear(320, 3)  # 输出3类'),
    Q([MQ('为什么生信DL中预训练+微调比从头训练好？',['更快','预训练从海量序列学到的通用特征(如氨基酸生化属性)可以迁移——小数据上从头学不到这些','需要更少GPU','只是更快'],1,'预训练模型在大规模数据上已经学会了基础的序列"语言"(如氨基酸的生化属性、保守模式)，小数据集上这些通用特征极难从头学起。')])
])


add('stage-2-dl-bias-variance','偏差-方差诊断与模型调试',2,'dl','中级',[
    A('<p><strong>偏差=瞄准的"系统性偏差"，方差=箭的"散布范围"。</strong>高偏差：所有箭都打在靶子左边——模型太简单，学不到真实模式。高方差：箭散布在整个靶面上——模型太复杂，记住了训练数据的噪声。目标：低偏差+低方差=箭集中在靶心。</p>'),
    C('<p>诊断框架：<strong>训练误差高+验证误差高=高偏差(欠拟合)</strong>→加复杂度/减正则化/训更久。<strong>训练误差低+验证误差高=高方差(过拟合)</strong>→加正则化/更多数据/简化模型。<strong>贝叶斯最优错误率</strong>(人类水平)是偏差的"天花板"。</p>'),
    B('<p>生信特有的偏差来源：批次效应(不同医院数据)、测序平台差异、标注错误(如误标注的致病性)。这些系统性偏差如果不处理，会体现在验证集上表现为"突然的高偏差"。</p>'),
    CD('# 诊断过拟合的简单方法\ntrain_acc = model.score(X_train, y_train)\nval_acc = model.score(X_val, y_val)\ngap = train_acc - val_acc\nprint(f"训练: {train_acc:.1%}, 验证: {val_acc:.1%}, 差距: {gap:.1%}")\nif gap > 0.1:\n    print("⚠️ 可能过拟合! 尝试: Dropout / 正则化 / 更多数据")','训练: 98.5%, 验证: 78.3%, 差距: 20.2%\n⚠️ 可能过拟合! 尝试: Dropout / 正则化 / 更多数据'),
    Q([MQ('训练准确率99%验证准确率70%→什么诊断？',['欠拟合','过拟合','完美','数据有问题'],1,'训练远好于验证→过拟合。模型记住了训练数据而非学习普适规律。加Dropout/正则化/简化模型。')])
])

add('stage-2-dl-optimizers','优化器详解 (SGD, Momentum, RMSprop, Adam)',2,'dl','中级',[
    A('<p><strong>SGD=每步按陡坡走一步。Momentum=SGD+惯性(类似滚下山的球越滚越快)。Adam=SGD+惯性+自适应步长(每个参数有自己的学习率)。</strong>实践中99%的情况用Adam即可。</p>'),
    C('<p><strong>Adam(最常用)</strong>结合了Momentum(积累历史梯度方向)和RMSprop(根据梯度方差自适应调节每个参数的学习率)，对大多数任务表现优秀且对初始学习率不敏感。<strong>AdamW</strong>是带正确权重衰减的改进版，推荐替代原始Adam。</p><p>选择建议：默认Adam/AdamW(大多数任务)，SGD+Momentum(需要更精细控制泛化时)，RMSprop(处理非平稳目标)。</p>'),
    CD('import torch\n\n# AdamW: 当前最好的默认优化器\noptimizer = torch.optim.AdamW(\n    model.parameters(), lr=1e-3, weight_decay=0.01\n)\n# SGD+Momentum: 需要调参但可能泛化更好\noptimizer_sgd = torch.optim.SGD(\n    model.parameters(), lr=0.01, momentum=0.9, weight_decay=5e-4\n)'),
    Q([MQ('Adam相比纯SGD的最大优势？',['总是更准确','自适应学习率+动量=对超参数不敏感+收敛快','内存更小','只适用于CV'],1,'Adam为每个参数自动调整学习率→不太需要手动调学习率策略。SGD需要仔细的学习率调度才能达到类似效果。')])
])

add('stage-2-dl-gradient-issues','梯度消失/爆炸与权重初始化',2,'dl','中级',[
    A('<p><strong>梯度消失=信号在深层网络中逐渐衰减到0，前面层的参数几乎不更新。梯度爆炸=信号指数增长到无穷，训练崩溃。</strong>就像传话游戏——传100次后原话完全走样(消失)或被夸大扭曲(爆炸)。正确的权重初始化就像给每个人"标准化话筒音量"。</p>'),
    C('<p><strong>Xavier初始化：</strong>对于tanh/sigmoid激活→方差=1/(输入维度)。<strong>He初始化(推荐)：</strong>对于ReLU激活→方差=2/(输入维度)。原理是让每层输出的方差在正向和反向传播时保持一致→梯度不消失不爆炸。</p><p>现代架构搭配：He初始化+ReLU+BatchNorm→几乎不用担心梯度消失/爆炸了。</p>'),
    CD('import torch.nn as nn\n\n# PyTorch默认就用He初始化(Kaiming)\nlayer = nn.Linear(100, 64)\n# → 自动使用Kaiming Uniform初始化\nprint(f"权重均值: {layer.weight.mean():.4f}, 标准差: {layer.weight.std():.4f}")'),
    Q([MQ('He初始化vs Xavier初始化的选择原则？',['He用于ReLU(乘2补偿负半轴置零), Xavier用于tanh/sigmoid','随便选','He只用于CV','Xavier更好'],0,'ReLU把一半的激活值置零→方差减半。He初始化乘2补偿这个效果，让梯度传播更稳定。')])
])

add('stage-2-dl-resnet','残差连接与ResNet',2,'dl','中级',[
    A('<p><strong>残差连接=给神经网络加了"高速公路"。</strong>数据不一定要一层层走——可以通过"跳跃连接"直接跳过几层传过去。这解决了极深网络的退化问题：越深反而越差？因为信号在层层传递中丢失了。加了跳跃连接后，100层的网络可以稳定训练。</p>'),
    C('<p>残差块计算F(x)+x(输入加到输出上)。如果没有残差连接，网络需要学习H(x)；有残差后只需学习残差F(x)=H(x)-x——如果恒等映射是最优的，只需把F(x)推为0即可，远比学习H(x)=x容易。</p><p>这一点被<strong>Transformer和AlphaFold广泛继承</strong>——Transformer的每个注意力层和FFN层都有残差连接+LayerNorm。</p>'),
    B('<p>AlphaFold2的Evoformer模块：每个注意力块和transition块都使用残差连接——没有残差，48层的Evoformer根本无法训练。</p>'),
    CD('import torch.nn as nn\n\n# 残差块: 深度学习能训练100+层的关键\nclass ResidualBlock(nn.Module):\n    def __init__(self, dim):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(dim, dim), nn.ReLU(),\n            nn.Linear(dim, dim)\n        )\n    def forward(self, x):\n        return x + self.net(x)  # ← 跳跃连接！'),
    Q([MQ('残差连接解决了什么问题？',['让网络更快','极深网络的退化问题(越深反而训练误差越高)','减少了参数','让网络更小'],1,'没有残差时，极深网络的信号逐渐丢失→训练误差反而比浅层更高(不是因为过拟合，是因为优化变难)。残差让信息可以"绕过"层直达后面。')])
])

# ============ STAGE 3 ML ============
add('stage-3-ml-stacking-blending','集成策略进阶 (Stacking, Blending)',3,'ml','高级',[
    A('<p><strong>Stacking=让一个"元模型"学习如何最好地组合多个专家的意见。</strong>三个医生给出不同诊断(序列模型医生说"致病"、结构模型医生说"良性"、进化模型医生说"不确定")，元模型学习每个医生在什么情况下更可靠，做出最终判断。</p>'),
    C('<p>Stacking：第一层用多个基模型做预测，第二层用元学习器(通常是简单模型如逻辑回归)基于基模型的输出做最终预测。Blending=简化版Stacking(用hold-out验证集而非交叉验证)。在Kaggle生信竞赛中，Stacking经常是决胜法宝。</p>'),
    CD('from sklearn.ensemble import StackingClassifier\nfrom sklearn.linear_model import LogisticRegression\n\nestimators = [("rf", RandomForestClassifier()), ("svm", SVC(probability=True)), ("xgb", XGBClassifier())]\nstack = StackingClassifier(estimators=estimators, final_estimator=LogisticRegression())\nstack.fit(X_train, y_train)'),
    Q([MQ('Stacking和简单投票(Bagging)的区别？',['完全相同','Stacking学习如何加权组合，投票是等权','Stacking更快','Stacking只用两个模型'],1,'投票=所有人一票等权。Stacking=训练元学习器自动发现"谁在什么情况下更可靠"——通常更准确但计算量更大。')])
])

add('stage-3-ml-active-learning','主动学习',3,'ml','高级',[
    A('<p><strong>主动学习=模型自己说"我需要更多的这类例子才能学得更好"。</strong>你有100万个分子但只有预算做1000个实验验证。主动学习：先随机做100个，训练模型后让它选"最不确定"的下100个去做实验——最大化每块钱的信息增益。</p>'),
    C('<p>在标注成本极高的场景(蛋白质实验验证、药物合成测试)，主动学习通过<strong>不确定性采样</strong>(选模型最不确定的样本)、<strong>多样性采样</strong>(选代表不同区域的样本)或<strong>预期模型改变</strong>(选对模型影响最大的样本)来最小化标注成本。</p>'),
    B('<ul><li>🧪 <strong>蛋白质工程：</strong>选择最可能改善活性的变体做实验验证</li><li>💊 <strong>药物筛选：</strong>从百万化合物库中智能选择最有信息量的做实验</li></ul>'),
    CD('# 主动学习伪代码\n# 1. 标注小部分数据训练初始模型\n# 2. 对未标注数据预测，选"最不确定"的\n# 3. 送去实验标注，加入训练集\n# 4. 重新训练，重复2-3直到预算用完\nuncertainty = model.predict_proba(X_unlabeled)\nidx = np.argsort(-uncertainty.max(axis=1))[:100]  # 最不确定的100个'),
    Q([MQ('什么时候用主动学习？',['数据很多时','标注成本高(实验验证)时——最大化每块钱的信息增益','GPU不够时','所有场景'],1,'主动学习的核心价值是减少标注成本。蛋白质实验验证一次可能花费数百美元→聪明地选择做哪些实验可以省大量经费。')])
])

add('stage-3-ml-semi-supervised','半监督学习',3,'ml','高级',[
    A('<p><strong>半监督学习=用少量标注+大量未标注数据一起训练。</strong>你有10个已知功能的蛋白质和10000个未知功能的蛋白质。只用10个标注训练效果很差，但把10000个未标注的也利用起来——它们虽然没有标签，但包含了蛋白质序列空间的分布信息——可以帮助模型学得更好。</p>'),
    C('<p>半监督学习在生信中极具吸引力——获取标注(蛋白质功能、致病性)需要昂贵实验，但未标注数据(测序数据)非常丰富。方法：①自训练(用模型预测未标注数据→置信度高的加入训练) ②一致性正则化(对同一输入的不同扰动给出相似预测) ③生成模型(用未标注数据学数据分布)。</p>'),
    CD('# 半监督学习: 自训练\n# 1. 用标注数据训练初始模型\nmodel.fit(X_labeled, y_labeled)\n# 2. 对未标注数据预测\npseudo_labels = model.predict(X_unlabeled)\n# 3. 置信度高的伪标签加入训练集\nconfident = model.predict_proba(X_unlabeled).max(axis=1) > 0.95\nX_extended = np.vstack([X_labeled, X_unlabeled[confident]])\ny_extended = np.hstack([y_labeled, pseudo_labels[confident]])\n# 4. 重新训练→重复2-4\nmodel.fit(X_extended, y_extended)'),
    Q([MQ('半监督学习的前提假设是什么？',['标注数据足够多','未标注数据的分布包含有助于分类的信息','GPU足够强','只需要标注数据'],1,'如果未标注数据跟任务无关→半监督没用。但生信中序列空间的平滑性(相似序列→相似功能)使得未标注数据有价值。')])
])

add('stage-3-ml-gnn','图神经网络基础 (GNN)',3,'ml','高级',[
    A('<p><strong>GNN处理的是"关系数据"——不是一个个独立的样本，而是一张关系网。</strong>分子里的原子通过化学键连接、蛋白质通过物理接触相互作用、基因通过调控关系彼此影响。GNN在图上做消息传递——每个节点通过"听邻居说了什么"来更新自己的表示。</p>'),
    C('<p>GNN的核心=消息传递：①每个节点聚合邻居节点传来的消息 ②用聚合的消息更新自己的表示 ③重复多轮(每轮信息传得更远)。变体：GCN(简单平均)、GAT(注意力加权邻居)、MPNN(消息传递网络，适合化学分子)。</p>'),
    B('<ul><li>💊 <strong>分子性质预测：</strong>原子=节点，化学键=边→预测毒性/溶解度/活性</li><li>🧪 <strong>蛋白质相互作用网络：</strong>蛋白质=节点，相互作用=边→预测新的PPI</li><li>🧬 <strong>基因调控网络：</strong>基因=节点，调控关系=边→发现关键调控因子</li></ul>'),
    CD('from torch_geometric.nn import GCNConv\nimport torch.nn as nn\n\nclass MoleculeGNN(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.conv1 = GCNConv(32, 64)  # 原子特征→64维\n        self.conv2 = GCNConv(64, 64)\n        self.fc = nn.Linear(64, 1)    # 输出: 毒性\n    def forward(self, x, edge_index):\n        x = torch.relu(self.conv1(x, edge_index))\n        x = torch.relu(self.conv2(x, edge_index))\n        return self.fc(x.mean(dim=0))'),
    Q([MQ('GNN和传统CNN/RNN处理数据的方式有什么本质不同？',['GNN更快','GNN处理图结构数据(非欧几里得空间)——数据之间有关系连接','GNN参数更少','没有不同'],1,'CNN处理网格数据(图像)，RNN处理序列数据——它们假设数据有固定结构。GNN处理图——节点和边的任意连接方式，适合分子和生物网络。')])
])

add('stage-3-ml-automl','AutoML',3,'ml','高级',[
    A('<p><strong>AutoML=让AI帮你选择和训练AI模型。</strong>你只需要给数据，AutoML自动尝试各种模型组合、特征工程和超参数，找到最适合的。就像一个自动化的数据科学家——降低ML使用门槛。</p>'),
    C('<p>AutoML涵盖：自动特征工程、自动模型选择、自动超参数优化、自动架构搜索(NAS)。Python工具：auto-sklearn、TPOT(遗传算法搜索ML管道)、AutoGluon(Amazon)。对生信研究者意义：快速构建强基线模型，确定"这数据到底能被ML学到多少"。</p>'),
    B('<p>生信典型用法：拿到一个新数据集(如某疾病的蛋白质组数据)，先用AutoGluon跑一遍得到基线性能。如果AutoML都学不好(接近随机)→数据可能没有信号或需要领域知识特征工程。如果AutoML表现不错→可以投入时间手动优化。</p>'),
    CD('# AutoGluon: 一键训练\nfrom autogluon.tabular import TabularPredictor\n\npredictor = TabularPredictor(label="disease_status").fit(train_data)\npredictions = predictor.predict(test_data)\nleaderboard = predictor.leaderboard()  # 自动尝试所有模型\nprint(leaderboard)'),
    Q([MQ('AutoML的目的是什么？',['让人类不写代码','自动完成ML管道(模型选择+特征工程+超参数)→降低门槛','取代人类','只用深度学习'],1,'AutoML不取代人类但极大降低入门门槛——自动做模型选择、特征工程和超参数搜索，输出强基线。')])
])

# ============ STAGE 3 DL ============
add('stage-3-dl-seq2seq','Seq2Seq与编码器-解码器架构',3,'dl','高级',[
    A('<p><strong>Seq2Seq=把一句话"压缩"成一个思想向量，再"解压"成另一句话。</strong>编码器读完整句英文→压缩成"意思向量"，解码器从这个向量里解压出中文翻译。蛋白质功能注释也可以用这个思路：编码氨基酸序列→解码成GO功能术语。</p>'),
    C('<p>Seq2Seq是注意力机制和Transformer的前身。编码器(通常RNN/LSTM)把输入序列编码为一个固定大小的上下文向量。解码器从上下文向量(和之前生成的输出)逐个生成目标序列。核心问题：<strong>信息瓶颈</strong>——所有输入信息被压缩到一个向量，长序列丢失信息→这就是注意力机制要解决的问题。</p>'),
    B('<ul><li>🧪 <strong>蛋白质功能注释生成：</strong>序列→GO术语描述</li><li>🧬 <strong>基因序列→RNA表达预测：</strong>DNA启动子区域→表达水平</li></ul>'),
    CD('# Seq2Seq概念: 编码→压缩→解码\nclass Encoder(nn.Module):\n    def __init__(self):\n        self.rnn = nn.LSTM(64, 256)\n    def forward(self, x):\n        _, (h, c) = self.rnn(x)  # 最后时间步的隐藏状态=上下文向量\n        return h, c\n\nclass Decoder(nn.Module):\n    def __init__(self):\n        self.rnn = nn.LSTM(64, 256)\n        self.out = nn.Linear(256, 20)  # 20种氨基酸\n    def forward(self, x, h, c):\n        out, (h, c) = self.rnn(x, (h, c))\n        return self.out(out), h, c'),
    Q([MQ('Seq2Seq的信息瓶颈是什么？',['计算太慢','所有输入被压缩到一个固定大小的向量→长序列信息丢失','内存不够','无法处理蛋白质'],1,'编码器把整条序列压缩成单个上下文向量。序列越长信息丢失越严重。注意力机制解决了这个问题——解码器可以直接"看"编码器的所有位置。')])
])

add('stage-3-dl-attention','注意力机制',3,'dl','高级',[
    A('<p><strong>注意力机制=翻译时不是死记一个固定"摘要"，而是每翻译一个词都回头看原文中相关的位置。</strong>翻译"transmembrane protein"时，生成"跨膜"这个词的时候注意力聚焦在"transmembrane"区域；生成"蛋白"时注意力移到"protein"区域。</p>'),
    C('<p>注意力计算三个矩阵：<strong>Query(查询)</strong>="我要找什么"、<strong>Key(键)</strong>="我有什么"、<strong>Value(值)</strong>="我的内容"。Attention(Q,K,V)=softmax(QKᵀ/√d)·V。Q和K的点积计算"查询和键的匹配度"→softmax得注意力权重→加权V。</p><p>在生信中：注意力权重可以解释——当模型预测"致病"时，哪些氨基酸残基被关注最多？</p>'),
    B('<ul><li>🧪 <strong>蛋白质残基重要性：</strong>注意力权重显示哪些残基对功能预测最关键→指导实验突变</li><li>🧬 <strong>调控区域识别：</strong>DNA Transformer的注意力集中在启动子和增强子区域</li></ul>'),
    CD('import torch, torch.nn.functional as F\n\n# 缩放点积注意力\nQ = torch.randn(1, 8, 100, 64)  # (batch, heads, seq, dim)\nK = V = Q\nattn = (Q @ K.transpose(-2, -1)) / (64 ** 0.5)  # QKᵀ/√d\nweights = F.softmax(attn, dim=-1)  # 注意力权重\noutput = weights @ V  # 加权求和\nprint(f"注意力权重形状: {weights.shape}")  # (1,8,100,100)'),
    Q([MQ('注意力中的Q、K、V分别代表什么？',['Query/Key/Value: 查询找什么/键有什么/值的内容','问题/答案/验证','快速/关键/重要','没有特殊含义'],0,'Q=我要找什么(查询), K=我有什么(键用于匹配), V=我的实际内容(值)。Q和K匹配得到注意力权重，用权重加权V。')])
])

add('stage-3-dl-transformer','Transformer架构',3,'dl','高级',[
    A('<p><strong>Transformer=用注意力替代RNN的序列模型。</strong>RNN像排队传话——必须一个个来，第100个人等前面99个。Transformer像圆桌会议——所有人同时交流，每个人可以直接听到任何人的发言。这就是为什么Transformer能并行训练，扩展到大模型。</p>'),
    C('<p>Transformer=多头自注意力+位置编码+前馈网络+残差连接+LayerNorm。关键创新：<strong>自注意力</strong>让每个位置都能直接访问所有其他位置，消除了RNN的串行瓶颈。<strong>多头注意力</strong>从多个"视角"看序列关系。<strong>位置编码</strong>注入位置信息(因为注意力本身不考虑顺序)。</p><p>Transformer是现代生物序列模型的核心——ESM、AlphaFold的Evoformer、Nucleotide Transformer、Enformer、scGPT全部基于它。</p>'),
    B('<p>几乎所有现代生信大模型都基于Transformer：ESM-2(蛋白质)、Nucleotide Transformer(DNA)、Enformer(基因表达)、scGPT(单细胞)。理解Transformer=理解现代计算生物学。</p>'),
    CD('# Transformer的核心: 多头自注意力\nclass MultiHeadAttention(nn.Module):\n    def __init__(self, d_model=512, n_heads=8):\n        super().__init__()\n        self.qkv = nn.Linear(d_model, 3*d_model)  # QKV一起算\n        self.out = nn.Linear(d_model, d_model)\n    def forward(self, x):\n        B, T, C = x.shape\n        qkv = self.qkv(x).reshape(B, T, 3, 8, C//8)\n        q, k, v = qkv.unbind(2)  # 拆出Q,K,V\n        attn = (q @ k.transpose(-2,-1)) * (C//8)**-0.5\n        return self.out((F.softmax(attn,-1) @ v).reshape(B,T,C))'),
    Q([MQ('Transformer比RNN的核心优势？',['更简单','并行计算(所有位置同时处理)+直接长程依赖(注意力直达任何位置)','参数更少','不用训练'],1,'RNN串行处理→第N步等前N-1步→慢+长程梯度消失。Transformer自注意力让每个位置直接看到所有位置→并行+长程无衰减。')])
])

add('stage-3-dl-bert-pretraining','BERT与预训练语言模型',3,'dl','高级',[
    A('<p><strong>BERT="完形填空"学语言。</strong>给BERT一段话，随机遮住几个词，让它猜遮住的是什么。猜的过程中，BERT学会了词语的含义、语法和上下文关系——不需要任何标注数据！这就是"自监督预训练"。</p>'),
    C('<p>BERT使用<strong>掩码语言模型(MLM)</strong>——随机mask 15%的token，模型预测被mask的词。因为是双向的可以看到前后文。这个预训练思路被直接移植到生物序列：ESM用MLM在蛋白质序列上预训练，DNABERT/Nucleotide Transformer在DNA序列上预训练。</p><p>预训练后，只需在目标任务上加一个简单的分类头微调，就能在极少量标注数据上达到优秀性能。</p>'),
    B('<ul><li>🧪 <strong>ESM-2：</strong>MLM在6500万蛋白质序列上预训练→零样本预测突变效应</li><li>🧬 <strong>DNABERT：</strong>MLM在人类基因组上预训练→微调预测启动子/增强子</li></ul>'),
    CD('# BERT风格的掩码预训练原理\n# 原始序列: M K T V R Q E R L\n# Mask后:    M [MASK] T V [MASK] Q E R L\n# 模型预测:  [MASK]位置应该是什么氨基酸？\n# 这样做不需要标签——用序列本身作为监督信号！\n\n# 在蛋白质上BERT训练=ESM的原理'),
    Q([MQ('BERT的"掩码语言模型(MLM)"为什么不需要标注数据？',['用了强化学习','输入序列本身提供监督(自己mask→让自己猜回来)','标注数据是隐式的','用GAN生成标注'],1,'MLM用序列本身作为监督信号——mask掉部分token让模型预测回来。不需要任何人工标注，可以无限利用数据库中已有的序列数据。')])
])

add('stage-3-dl-vit','Vision Transformer (ViT)',3,'dl','高级',[
    A('<p><strong>ViT=把图片切成小方格，当成一个"序列"喂给Transformer。</strong>Transformer本是为文本设计的(序列输入)，但如果你把图片切成16×16的patch，每个patch就像一个"词"——Transformer也能处理。</p>'),
    C('<p>ViT将图像分割为固定大小的patch，展平成向量后加位置编码，送入标准Transformer编码器。在生信中，ViT被改编用于处理基因组浏览器截图、组织病理切片(H&E染色)和蛋白质结构可视化图像。</p><p>虽然CNN在图像任务上更天然，但ViT证明纯注意力架构也能在视觉任务上竞争——特别是大数据场景。</p>'),
    B('<ul><li>🔬 <strong>病理切片分析：</strong>将H&E染色组织切片切割为patch→ViT分类肿瘤亚型</li><li>🧪 <strong>蛋白质结构图：</strong>将3D结构的2D接触图输入ViT预测功能位点</li></ul>'),
    CD('# ViT核心思路: 图片→patch序列→Transformer\n# 一张224×224的图片→切成14×14=196个16×16的patch\n# 每个patch→embedding→加位置编码→送入Transformer\n# 跟处理蛋白质序列的Transformer完全一样的结构！'),
    Q([MQ('ViT和CNN处理图像的方式有何不同？',['CNN有卷积核的归纳偏置(局部性), ViT用自注意力需要大数据才能学到CNN内建的局部性','完全相同','ViT总是更好','CNN不能用Transformer'],0,'CNN内置了\"局部性\"先验(卷积只看一小块)，小数据上这很有效。ViT没有这个先验，需要更多数据来学到局部性——但大数据上ViT可以学到更全局的模式。')])
])

add('stage-3-dl-autoencoder-vae','自编码器与变分自编码器',3,'dl','高级',[
    A('<p><strong>自编码器=数据压缩+解压。VAE=加了一个"随机性"约束的压缩——压缩出来的不是固定点而是一个概率分布。</strong>普通自编码器压缩人脸→解压出原图。VAE压缩人脸→从概率分布的采样中生成"新"的但看起来合理的人脸。</p>'),
    C('<p><strong>AE：</strong>编码器压缩x→低维表示z，解码器从z重建x̂，最小化重构误差。用于降噪、降维、异常检测。<strong>VAE：</strong>编码器输出z的均值和方差，从N(μ,σ)采样z，解码器重建x̂。额外约束：让z的分布接近标准正态(KL散度)→可以在N(0,I)上采样生成新数据。</p>'),
    B('<ul><li>🔬 <strong>scVI：</strong>单细胞数据VAE——学习细胞的概率低维表示，同时做批次校正、降维、缺失值插补</li><li>🧪 <strong>蛋白质序列生成：</strong>从VAE的隐空间采样生成具有新功能的人工蛋白质</li></ul>'),
    CD('import torch.nn as nn\n\nclass VAE(nn.Module):\n    def __init__(self, input_dim=1000, latent_dim=20):\n        super().__init__()\n        self.encoder = nn.Sequential(nn.Linear(input_dim, 128), nn.ReLU())\n        self.mu = nn.Linear(128, latent_dim)      # 均值\n        self.logvar = nn.Linear(128, latent_dim)  # 对数方差\n        self.decoder = nn.Sequential(nn.Linear(latent_dim, 128), nn.ReLU(), nn.Linear(128, input_dim))\n    def reparameterize(self, mu, logvar):\n        std = torch.exp(0.5*logvar)\n        return mu + std*torch.randn_like(std)  # 重参数化技巧'),
    Q([MQ('VAE和普通自编码器的核心区别？',['VAE更快','VAE的隐空间是概率分布→可以在隐空间采样生成新数据','VAE参数更少','没有区别'],1,'普通AE学习到的是固定的隐向量。VAE学习隐空间上的概率分布——可以在分布上采样从而生成新的、未见过的样本。')])
])

add('stage-3-dl-gan','生成对抗网络 (GAN)',3,'dl','高级',[
    A('<p><strong>GAN="造假者vs鉴定师"的游戏。生成器(造假者)学习制造假画，判别器(鉴定师)学习分辨真假。造假者不断改进技术让假画更像真画，鉴定师也不断提升鉴定能力。最终造假者能造出以假乱真的作品。</strong></p>'),
    C('<p>GAN由生成器G和判别器D组成。G从噪声z生成假样本G(z)，D判断输入是真实样本(概率→1)还是假样本(概率→0)。训练是两人博弈：D最大化识别真假，G最小化D识别假样本的能力。收敛时G生成的样本D分不出真假(约50%)。</p>'),
    B('<ul><li>🧬 <strong>DNA序列生成：</strong>生成具有特定调控功能的合成DNA序列</li><li>💊 <strong>分子生成：</strong>生成具有目标性质的药物候选分子(如高溶解度+低毒性)</li><li>🧪 <strong>蛋白质序列设计：</strong>生成折叠稳定的人工蛋白质</li></ul>'),
    CD('# GAN: 生成器对抗判别器\n# 生成器G: 噪声z→"假"蛋白质序列\n# 判别器D: 序列→真/假概率\n# 博弈: G想让D判断失误, D想识别假序列\n\n# 训练伪代码:\n# 1. 训练D: 最大化 log(D(真)) + log(1-D(G(噪声)))\n# 2. 训练G: 最大化 log(D(G(噪声))) ← 让D判断假为真'),
    Q([MQ('GAN的生成器和判别器的关系？',['合作','对抗博弈——生成器想骗过判别器，判别器想识破生成器','独立训练','生成器先训练完再训练判别器'],1,'GAN训练本质是minimax博弈。实践中平衡两者训练难度是个关键挑战——一方太强会导致训练崩溃(mode collapse)。')])
])

add('stage-3-dl-multimodal','多模态学习',3,'dl','高级',[
    A('<p><strong>多模态=综合多种"语言"理解生物系统。</strong>了解一个蛋白质，不能只看序列(文本)，还要看3D结构(图像)、相互作用网络(图)、表达水平(数值)。多模态模型整合所有这些信息源——就像诊断时会看化验单+影像+症状。</p>'),
    C('<p>多模态学习融合不同类型的数据(文本、图像、图、时间序列等)到一个统一的表示空间。核心技术：①跨模态注意力(一种模态的表示影响另一种) ②对比学习(拉近相关模态对的距离，推远不相关的) ③模态融合(early fusion=原始数据合并，late fusion=各模态独立编码后合并)。</p>'),
    B('<ul><li>🧪 蛋白质理解：序列(文本)+结构(3D坐标)+相互作用网络(图)+功能文献(文本)</li><li>💊 药物发现：分子图+蛋白质结构+基因表达谱+临床文本</li></ul>'),
    CD('# 多模态学习概念: 融合不同数据源\n# 模态1: 蛋白质序列 → Transformer编码器 → embedding1\n# 模态2: 3D结构坐标 → GNN编码器 → embedding2\n# 模态3: 基因表达数据 → MLP编码器 → embedding3\n# 融合: concat([emb1, emb2, emb3]) → 最终预测层'),
    Q([MQ('多模态学习在生物信息学中的独特价值是什么？',['处理更多数据','不同模态提供互补信息——序列告诉你"能做什么"，结构告诉你"怎么做"','训练更快','只需要一种数据'],1,'序列、结构、表达、互作——每个视角看到生物系统的一个侧面。整合多模态可以获得更全面准确的生物学理解。')])
])

add('stage-3-dl-distillation','模型蒸馏',3,'dl','高级',[
    A('<p><strong>模型蒸馏=让一个大"老师模型"教一个小"学生模型"。</strong>15B参数的ESM-2太慢了没法在你的笔记本上跑。但你可以让ESM-2预测10000条蛋白质序列，用它的预测结果("软标签")训练一个100MB的小模型——小模型学会了老师的知识，但推理快100倍。</p>'),
    C('<p>蒸馏不仅是让小模型模仿大模型的硬预测(输出类别)，关键是学习<strong>软标签</strong>(各类别的概率分布)。软标签包含了更多信息——不仅知道正确答案是A，还知道B也很接近而C完全不相关。这在生信中非常实用：把ESM-2的知识蒸馏到可在Colab免费GPU上运行的轻量级模型。</p>'),
    B('<p>实用场景：把ESM-2 15B蒸馏到几百MB的模型，放在实验室的普通服务器上做日常蛋白质功能预测。</p>'),
    CD('# 知识蒸馏: 学生模仿老师的软标签\n# 老师模型(ESM-2 15B) → 软标签: [酶:0.7, 结构:0.2, 运输:0.1]\n# 学生模型(小) → 预测:        [酶:0.6, 结构:0.3, 运输:0.1]\n# 蒸馏损失 = ‖软标签 - 学生预测‖²\n# → 学生学习的不只是正确答案，还有各类别之间的关系'),
    Q([MQ('软标签为什么比硬标签更有价值？',['更小','软标签包含类别间关系(如"A和B很接近")——知识更多','计算更快','硬标签有噪声'],1,'硬标签"这是酶"只给1bit信息。软标签"酶70% 结构蛋白20% 运输10%"告诉学生：酶和结构蛋白比酶和运输蛋白更接近——这来自大模型学到的知识。')])
])

add('stage-3-dl-jax','JAX与函数式深度学习',3,'dl','高级',[
    A('<p><strong>JAX=PyTorch的函数式表亲。</strong>PyTorch像面向对象编程(模型=对象)，JAX像纯函数编程(模型=函数)。JAX的超级能力：JIT编译让代码自动加速，vmap自动向量化，pmap自动分布式——特别适合需要自定义梯度或高性能计算的生物物理学和蛋白质设计场景。</p>'),
    C('<p>JAX核心特性：<strong>JIT</strong>(即时编译)将Python/NumPy代码编译成高效的XLA代码，<strong>vmap</strong>(自动向量化)消除手写batch维度的需求，<strong>grad</strong>(自动求导)支持任意高阶导数(物理模拟需要二阶导数)。AlphaFold的某些变体、蛋白质设计模型(RFdiffusion)使用JAX实现。</p>'),
    B('<ul><li>🧪 <strong>蛋白质设计：</strong>RFdiffusion等前沿模型使用JAX实现等变神经网络</li><li>🔬 <strong>分子动力学模拟：</strong>JAX的高阶自动微分适合物理梯度</li></ul>'),
    CD('import jax, jax.numpy as jnp\n\n# JAX函数式编程: 纯函数+JIT编译\n@jax.jit\ndef predict(w, x):\n    return jnp.dot(w, x)  # 自动编译成高效代码\n\nw = jnp.array([1.0, 2.0, 3.0])\nx = jnp.array([4.0, 5.0, 6.0])\nprint(predict(w, x))  # 第一次调用编译，之后极速'),
    Q([MQ('JAX和PyTorch的最大区别？',['JAX更快','JAX是纯函数式(无状态)，PyTorch是面向对象(有状态)','JAX不需要GPU','没有区别'],1,'JAX要求模型是纯函数(输入→输出，无内部状态变化)。这使得JIT编译和自动并行化变得容易，但需要不同的编程思维。')])
])

add('stage-3-dl-end-to-end','端到端深度学习',3,'dl','高级',[
    A('<p><strong>端到端DL=直接从原始输入学到最终输出，不拆分中间步骤。</strong>传统方法：DNA序列→提取特征→预测功能(分两步)。端到端：DNA序列→神经网络→功能预测(一步，中间全部由网络自动学)。DeepVariant就是端到端的典范——从读段比对图像直接调用变异。</p>'),
    C('<p>端到端学习让所有组件<strong>联合优化</strong>而非各自独立优化。优点：避免中间步骤的信息损失，避免手工设计特征的偏差。缺点：需要更多数据，可解释性差，调试困难。判断标准：是否有足够数据支撑端到端？中间步骤是否有可靠的领域知识可以注入？</p>'),
    B('<ul><li>🧬 <strong>DeepVariant：</strong>测序读段图像→CNN→VCF变异(端到端)</li><li>🧪 <strong>AlphaFold2：</strong>MSA+模板→Evoformer→3D坐标(几乎端到端)</li></ul>'),
    CD('# 端到端 vs Pipeline\n# Pipeline: DNA → 提取motif特征 → 预测功能\n#   缺点: 如果motif提取方式不对，后续再强也没用\n#\n# 端到端: DNA → 神经网络 → 功能预测\n#   优点: 所有步骤联合优化\n#   缺点: 需要更多数据，如果数据不够Pipeline可能更好'),
    Q([MQ('端到端DL一定比pipeline好吗？',['是的，总是更好','看数据量——数据多端到端更好，数据少pipeline利用领域知识可能更好','总是pipeline更好','没有区别'],1,'端到端需要足够数据来同时学所有中间表示。如果只有几十个样本，注入领域知识(如已知的motif特征)的pipeline可能远好于端到端。')])
])

add('stage-3-dl-ml-strategy','结构化ML项目策略',3,'dl','高级',[
    A('<p><strong>ML项目的成败往往不取决于模型多复杂，而取决于你的策略——如何划分数据、选择评估指标、分析错误。</strong>就像打仗：武器精良(好模型)固然重要，但战略(数据划分、指标选择、错误分析)决定胜负。</p>'),
    C('<p>来自Andrew Ng的实战经验：①<strong>正交化</strong>——每次只调一个因素(不要同时改模型架构和数据预处理) ②<strong>单一评估指标</strong>——用F1而非同时看精确率和召回率各自"都还不错" ③<strong>错误分析</strong>——手动检查100个预测错误的样本，分类错误原因(如：60%是批次效应、30%是罕见变异、10%是标注错误)→有针对性地优化。</p>'),
    B('<p>生信项目常见错误：数据集中训练集和测试集来自不同批次→模型学到了批次差异而非生物信号→部署后性能崩溃。错误分析可以早期发现这类问题。</p>'),
    CD('# 错误分析: 检查模型为什么会错\nerrors = []\nfor x, y_true in zip(X_test, y_test):\n    y_pred = model.predict(x)\n    if y_pred != y_true:\n        errors.append({\"true\": y_true, \"pred\": y_pred, \"reason\": classify_error(x)})\n# 统计错误原因分布\n# 60% 批次效应 → 加入批次校正\n# 25% 新颖变异 → 需要更多训练数据\n# 15% 标注错误 → 修正标注'),
    Q([MQ('正交化(Orthogonalization)是什么意思？',['使用正交矩阵','每次只调整一个因素来改进模型的一个方面','用PCA','一种损失函数'],1,'不要同时改模型架构+数据预处理+学习率——你永远不知道哪个改动真正起了作用。正交化=一次改一个。')])
])

# ============ STAGE 4 ML ============
for key,name,content in [
    ('stage-4-ml-alphafold-ml','AlphaFold相关ML方法','<p>AlphaFold2中使用的ML技术组合：<strong>多序列比对(MSA)</strong>通过MAFFT搜索进化相关序列、<strong>Evoformer</strong>(Transformer变体)在MSA和残基对之间交换信息、<strong>结构模块</strong>用IPA(不变点注意力)输出3D坐标、<strong>回收</strong>机制迭代精炼预测。这些技术各自都可以应用于其他蛋白质分析任务。</p>'),
    ('stage-4-ml-esm','蛋白质语言模型 (ESM系列)','<p>ESM系列在数十亿蛋白质序列上用<strong>掩码语言模型</strong>预训练，学习氨基酸的上下文相关表示。核心能力：<strong>零样本突变效应预测</strong>——不需要任何标注数据，利用掩码位置的logits变化评估突变影响。这是\"直接从进化数据中学习蛋白质语法\"的典范。</p>'),
    ('stage-4-ml-genomic-language','基因组语言模型','<p>将DNA视为\"语言\"，用类似GPT/BERT的方法在大规模基因组数据上预训练。<strong>Nucleotide Transformer</strong>：在多个物种基因组上预训练，学习通用的DNA表示。<strong>Enformer</strong>：从200kb的DNA序列窗口预测基因表达和染色质状态。<strong>HyenaDNA</strong>：用状态空间模型替代注意力处理超长序列(百万碱基级)。</p>'),
    ('stage-4-ml-causal-inference','因果推断基础','<p>相关性≠因果性。基因表达和疾病相关但不一定是原因(可能被第三个隐藏变量同时影响)。因果推断方法(do-calculus、工具变量、孟德尔随机化、反事实推理)帮助从观测数据推断因果关系。在生信中用于：识别疾病的<strong>因果基因</strong>而非仅仅关联基因、评估药物的<strong>靶向效应</strong>而非脱靶效应。</p>'),
    ('stage-4-ml-reinforcement-bio','强化学习在生物中的应用','<p>强化学习=智能体在环境中通过试错学习最优策略。在生信中：<strong>分子生成</strong>(化学空间探索——每步添加/修改一个原子→奖励=好的性质)、<strong>蛋白质折叠模拟</strong>(动作=旋转二面角→奖励=接近天然构象)、<strong>最优实验设计</strong>(动作=选哪个实验→奖励=信息增益)。</p>'),
    ('stage-4-ml-nas','神经架构搜索 (NAS)','<p>NAS自动设计最优神经网络架构——替代人工\"试各种层数/宽度\"。方法：强化学习(控制器生成架构→训练→准确率作为奖励)、进化算法(种群中的架构交叉变异)、可微分搜索(DARTS——架构参数和权重一起梯度优化)。在生信中用于为特定任务(蛋白质接触预测、基因表达预测)自动发现最优架构。</p>'),
    ('stage-4-ml-federated','联邦学习','<p>联邦学习让多家医院在不共享原始数据(隐私!)的情况下协作训练模型。每家医院本地训练→只上传模型更新(梯度/参数，不含患者数据)→中央聚合更新→分发给所有医院。生信中最激动人心的应用场景：跨机构协作训练疾病诊断模型而无需共享患者基因组数据。</p>'),
]:
    add(key,name,4,'ml','高级',[A(content),C(content),
        Q([MQ('这个技术在生信中的核心价值是什么？',['加快计算','将ML前沿方法(因果推断/强化学习/NAS/联邦学习)应用于生物问题——推动精准医疗','替代传统方法','没有特殊价值'],1,'这些方法代表了ML在生物信息学前沿应用的方向——从相关性分析到因果推断，从单个模型到联邦协作。')])])

# ============ STAGE 4 DL ============
add('stage-4-dl-alphafold2','AlphaFold2架构详解',4,'dl','高级',[
    A('<p><strong>AlphaFold2从蛋白质的"亲戚关系图"(MSA)和"结构模板"出发，通过一个叫Evoformer的神经网络迭代地完善对蛋白质结构的理解，最后在3D空间中折叠出原子坐标。</strong>它解决了一个困扰科学50年的问题——从氨基酸序列预测3D蛋白质结构。</p>'),
    C('<p>AlphaFold2架构三大组件：①<strong>Evoformer(48层)</strong>——在MSA表示和配对(pair)表示之间进行三角注意力，利用协同进化信号推断残基间距离 ②<strong>结构模块(8层)</strong>——用IPA(不变点注意力)直接将pair表示转化为3D坐标，保证旋转平移不变性 ③<strong>回收</strong>——将结构模块的输出重新输入Evoformer迭代精炼。</p>'),
    B('<p>AlphaFold2已在超过2亿个蛋白质上预测结构(AlphaFold DB)。应用：药物设计(靶标结构)、酶工程(活性位点分析)、变异解释(致病突变对结构的影响)。</p>'),
    Q([MQ('AlphaFold2的Evoformer和标准Transformer有何不同？',['完全相同','Evoformer在两个表示(MSA和pair)之间做交叉注意力+三角更新，利用了蛋白质结构的几何先验','更小','不需要注意力'],1,'标准Transformer只有序列维度。Evoformer同时处理MSA(进化)和pair(空间)两种表示并互相通信，这是AlphaFold2精度突破的关键。')])
])

add('stage-4-dl-esm2','ESM-2蛋白质表示学习',4,'dl','高级',[
    A('<p><strong>ESM-2=给蛋白质序列\"学语文\"。</strong>就像BERT读了海量文本学会了语言，ESM-2读了6500万条蛋白质序列学会了蛋白质的\"语法\"——哪些氨基酸倾向于在一起，突变后\"语义\"(功能)会怎么变。</p>'),
    C('<p>ESM-2系列从8M到15B参数，用MLM在UniRef上预训练。生成的embedding捕捉了氨基酸的生化属性、残基间的协同进化关系和序列-结构关联。最惊艳的能力：<strong>零样本突变效应预测</strong>——计算WT和突变序列的log-likelihood差异，与实验突变扫描结果相关性可达0.5-0.7。</p>'),
    CD('from transformers import AutoTokenizer, AutoModel\nimport torch\n\nmodel = AutoModel.from_pretrained("facebook/esm2_t33_650M_UR50D")\ntokenizer = AutoTokenizer.from_pretrained("facebook/esm2_t33_650M_UR50D")\n\n# 零样本突变效应预测\nwt = tokenizer("MKTVRQER", return_tensors="pt")\nmt = tokenizer("MKTVRQPR", return_tensors="pt")\n\nwith torch.no_grad():\n    wt_out = model(**wt).logits\n    mt_out = model(**mt).logits\n# 突变效应 = 突变位置logit差值\n# (简化的零样本预测)'),
    Q([MQ('ESM-2的"零样本突变效应预测"为什么不需要标注数据？',['用了外部数据库','MLM预训练让模型学到氨基酸在上下文中的出现概率——突变改变了概率→效应大小','有隐式标注','需要标注'],1,'MLM训练让模型学会\"在这个上下文位置出现这个氨基酸有多合理\"。突变改变上下文→概率变化反映功能变化的可能性。')])
])

add('stage-4-dl-enformer','Enformer基因表达预测',4,'dl','高级',[
    A('<p><strong>Enformer=从DNA序列直接\"算命\"——预测这个DNA区域会产生多少RNA、染色质会如何打开。</strong>给它看200000个碱基对的DNA序列，它能预测出基因表达水平和多种表观基因组轨迹。理解非编码变异的功能不需要做实验——Enformer算一下就行。</p>'),
    C('<p>Enformer用Transformer+卷积处理超长DNA序列(200kb)，通过多头注意力捕捉远距离调控关系(增强子-启动子互作，可超过100kb)。相比传统方法只能看基因附近的区域，Enformer整合了全基因组范围内的调控信息。</p>'),
    B('<p>典型应用：预测非编码区SNP对附近基因表达的影响→评估非编码变异的致病潜力。这是\"变异解释\"领域的革命性工具。</p>'),
    Q([MQ('Enformer解决了传统基因表达预测的什么局限？',['更快','能捕捉超过100kb的远距离调控——传统方法只看基因附近几kb','不需要序列','不需要GPU'],1,'传统方法假设调控元件在基因附近。Enformer证明了远距离调控(增强子可在百万碱基以外)的重要性，并用Transformer有效建模。')])
])

add('stage-4-dl-diffusion-molecule','扩散模型在分子生成中的应用',4,'dl','高级',[
    A('<p><strong>扩散模型=先往数据上加噪声直到变成纯噪声，然后学习如何从噪声一步步\"去噪\"恢复成数据。</strong>训练：给分子结构不断加噪声→纯噪声。推理：从纯噪声开始，学到的去噪过程一步步\"雕刻\"出想要的分子——像是从云雾中逐渐显现出一个3D分子结构。</p>'),
    C('<p>扩散模型在图像生成(DALL-E/Stable Diffusion)取得成功后迅速被移植到分子生成。优势：①生成质量高(逐步去噪=精细控制) ②自然的条件生成(引导去噪方向→生成具有特定性质的分子) ③支持3D几何(分子构象、蛋白质骨架生成)。代表：RFdiffusion(蛋白质骨架设计)、GeoDiff(分子构象生成)、DiffSBDD(结构药物设计)。</p>'),
    B('<ul><li>💊 药物设计：生成具有特定靶标结合能力的分子</li><li>🧪 蛋白质设计：RFdiffusion从头设计结合特定靶标的蛋白质</li></ul>'),
    Q([MQ('扩散模型的核心思想？',['直接生成数据','前向加噪声→反向学去噪→从噪声生成数据','用GAN','用VAE'],1,'扩散模型通过两阶段过程——先加噪破坏数据，再学去噪恢复。生成时从随机噪声开始迭代去噪，类似于从雾中逐渐清晰的过程。')])
])

add('stage-4-dl-multimodal-bio','大型生物多模态模型',4,'dl','高级',[
    A('<p><strong>生物多模态大模型=一个模型同时理解DNA、蛋白质、文献、结构和实验数据。</strong>就像你问ChatGPT一个问题它综合网上所有信息回答，未来的BioGPT能同时考虑基因序列、蛋白质结构、PubMed文献和临床数据来回答生物学问题。</p>'),
    C('<p>这些模型旨在成为生物学的\"通用AI助手\"：能够理解多种生物数据类型(序列、结构、表达、文献、通路)，在它们之间建立联系，并生成可验证的科学假设。代表：BioGPT(生物医学文本)、ESM-3(序列+结构+功能联合生成)、GeneCompass(基因调控+表达)。</p>'),
    B('<p>最终目标：输入"这是什么突变为什么导致疾病？"→模型查阅基因组数据、蛋白质结构、通路知识、文献→输出假设和验证建议。</p>'),
    Q([MQ('生物多模态模型的长期目标是什么？',['替代所有实验室工作','成为能理解多种生物数据并生成科学假设的AI研究助手','只需要处理文本','只用于教育'],1,'梦想是AI科学家助手——综合序列/结构/文献/实验信息，生成和验证生物学假设。但这还有很长的路要走。')])
])

add('stage-4-dl-single-cell-foundation','单细胞基础模型 (scGPT, scFoundation)',4,'dl','高级',[
    A('<p><strong>单细胞基础模型=在一个超大规模单细胞数据集上预训练的Transformer，学习"细胞的语言"。</strong>就像GPT学会了文字后可以写文章、翻译、总结，scGPT学习了几千万个细胞的基因表达模式后可以做细胞类型注释、批次校正、扰动预测——一个模型搞定多种任务。</p>'),
    C('<p>scGPT和scFoundation等都是基于Transformer在数百万到数千万个单细胞转录组上预训练。每个细胞像一句话，每个基因像一个词——掩码语言模型预训练。预训练后模型学到的细胞表示可以用于：细胞类型标注(零样本)、批次校正、基因扰动响应预测(预测敲除某基因后其他基因的表达变化)、药物响应预测。</p>'),
    B('<p>最大的变革意义：传统方法每个数据集要独立分析，基础模型让\"在这批数据上训练的知识可以迁移到你的数据上\"。</p>'),
    Q([MQ('单细胞基础模型和传统单细胞分析工具(如Scanpy)有何不同？',['完全相同','基础模型在大规模数据上预训练→学到的通用细胞表示可以迁移——传统工具每个数据集独立分析','基础模型不需要数据','传统工具不需要GPU'],1,'传统工具没有\"预训练知识\"——每个新数据集从零开始分析。基础模型用大规模预训练的知识帮助理解和校正你的数据，类似于NLP中BERT如何改变了文本分析。')])
])

# ============ MATH TOPICS (concise, link to /math page) ============
math_topics = [
    ('stage-1-math-linear-algebra','线性代数: 向量、矩阵、点积','<p>向量=一组数字(如同一细胞的基因表达值)，矩阵=向量组成的表(所有细胞的表达矩阵)，点积=衡量两个向量有多"像"(基因表达相关性)。这些是所有ML算法的基础运算——模型训练本质就是海量的矩阵乘法和点积。</p>','<p>深度学习中的一切本质都是矩阵运算：全连接层=矩阵乘法，卷积=滑动点积，注意力=QKᵀ矩阵乘法。理解矩阵=理解为什么GPU适合DL(专门为矩阵运算设计)。</p>'),
    ('stage-1-math-calculus','微积分: 导数、偏导数、链式法则','<p>导数=函数在某点的"变化率"(梯度=下山方向)。偏导数=多变量函数只对一个变量求导(分别算每个参数对损失的影响)。链式法则=复合函数求导(反向传播的本质=链式法则的系统应用)。</p>','<p>反向传播算法=链式法则的工程实现。理解这个数学基础就能理解为什么PyTorch的autograd能自动求梯度——它自动应用链式法则。</p>'),
    ('stage-1-math-probability-basics','概率基础: 条件概率、贝叶斯定理','<p>条件概率P(A|B)=已知B发生后A的概率(已知患者有某突变后，患病概率是多少)。贝叶斯定理=P(H|E)=P(E|H)×P(H)/P(E)——从先验经过证据更新得到后验。这是概率推断的数学基础。</p>','<p>生信中的应用：已知某SNP在人群中的频率(先验)，测序看到这个SNP(证据)→贝叶斯更新→新概率。朴素贝叶斯分类器、隐马尔可夫模型、VAE的损失函数都基于贝叶斯定理。</p>'),
    ('stage-1-math-statistics-basics','统计基础: 均值、方差、分布','<p>均值=数据中心在哪，方差=数据散得有多开。分布(PDF/PMF)描述了数据的整体形态。正态分布随处可见(基因表达量、测量误差)，理解分布是理解生信数据的基础——差异表达分析本质就是比较两组的分布。</p>','<p>t检验检验两组基因表达均值差异是否显著。方差分析(ANOVA)同时比较多组。FDR校正(Benjamini-Hochberg)控制了大规模检验下的假发现率。</p>'),
    ('stage-2-math-matrix-decomp','矩阵分解 (SVD, 特征分解)','<p>SVD=把一个矩阵拆成三个"更容易理解"的矩阵的乘积。就像把一段复杂的和声拆成几个单独的音符——每个音符(主成分)捕获数据的一部分方差。这是PCA和推荐系统背后的数学。</p>','<p>SVD在生信中用于：基因表达矩阵降噪(扔掉小奇异值=扔掉噪声)、缺失值插补、发现主导的基因表达"程序"(主成分=生物过程)。</p>'),
    ('stage-2-math-gradient-descent-variants','梯度下降变种 (SGD, Adam)','<p>梯度下降是寻找函数最小值的迭代方法。SGD每次随机采样估计梯度(快但波动)，Momentum加惯性(平滑路径)，Adam自适应调节每个参数的学习率(目前最佳默认选择)。</p>','<p>不同优化器的收敛速度和最终性能差异显著。Adam对超参数不敏感(新手友好)，但某些场景SGD+Momentum+精细调度的最终泛化更好。</p>'),
    ('stage-2-math-probability-distributions','概率分布 (正态、伯努利、多项)','<p>正态分布→"大多数值围绕均值"(基因表达)。伯努利→"是/否"(是否致病)。多项分布→"k种可能之一"(亚细胞定位=k种位置)。理解分布=选择合适的似然函数和损失函数。</p>','<p>二分类用伯努利似然→交叉熵损失。回归用高斯似然→MSE损失。多分类用多项分布→多类交叉熵。选择正确的分布=选择正确的目标。</p>'),
    ('stage-2-math-mle','最大似然估计','<p>MLE=找到让观测数据出现概率最大的参数值。如果观察到3次正面1次反面，最可能的硬币正面概率是多少？p=0.75。这就是MLE——选择让数据"最不意外"的参数。</p>','<p>MLE是深度学习训练的统计基础——交叉熵损失=负对数似然的最小化。理解MLE=理解为什么神经网络用这些损失函数。</p>'),
    ('stage-2-math-information-theory','信息论基础 (熵、交叉熵)','<p>熵=不确定性(分布越均匀→越不确定→熵越大)。交叉熵=用分布Q编码分布P需要多少bit(非对称！)。KL散度=交叉熵-熵→Q和P的差异。交叉熵损失=让模型预测的分布接近真实分布。</p>','<p>几乎所有分类模型都用交叉熵损失——直觉：当预测分布和真实分布一致时交叉熵最小。这在生物序列分类和蛋白质功能预测中无处不在。</p>'),
    ('stage-3-math-attention-math','注意力机制数学推导','<p>Attention(Q,K,V)=softmax(QKᵀ/√dₖ)·V。QKᵀ=查询和所有键的点积(相似度)，/√dₖ=缩放防止softmax梯度太小，softmax=转为概率分布，×V=用注意力概率加权取值。每一步都可以在纸上手算验证。</p>','<p>缩放因子√dₖ不是随意加的——dₖ很大时QKᵀ的方差大→softmax输出趋近one-hot→梯度接近0。除以√dₖ保持方差为1，稳定训练。</p>'),
    ('stage-3-math-variational-inference','变分推断基础','<p>变分推断=用一个简单的分布来近似一个复杂的难以计算的后验分布。最小化KL(q||p)让简单分布尽可能接近真实后验。ELBO=证据下界，最大化ELBO=最小化KL=最好的近似。</p>','<p>VAE(scVI等)的损失函数=重构损失+KL散度。KL项约束隐空间接近标准正态——这就是为什么从标准正态采样可以生成新的单细胞数据。</p>'),
    ('stage-3-math-graph-spectral','图论与谱聚类','<p>图=节点+边。拉普拉斯矩阵L=D-A描述了图的连接结构。L的特征向量揭示图的"community structure"——第二小的特征值对应的Fiedler向量可以将图自然地切成两块。谱聚类利用这个性质做图划分。</p>','<p>在蛋白质相互作用网络中，谱聚类可以发现功能模块。在基因共表达网络中识别协同表达的基因群。</p>'),
    ('stage-3-math-advanced-optimization','优化理论进阶','<p>凸函数=形如碗状(任意两点间的线段都在函数上方)，只有一个全局最小值。非凸函数有多个局部最小值——深度学习中的损失函数几乎都是非凸的。为什么SGD还能工作？高维空间中大多数局部最小值实际是接近全局最优的鞍点或浅谷。</p>','<p>理解优化理论帮助调试训练：为什么loss震荡？可能是学习率太大在最优值附近来回跳。为什么loss不降？可能卡在鞍点(梯度≈0但不是最小值)。</p>'),
    ('stage-3-math-lagrange','拉格朗日乘子法','<p>拉格朗日乘子法=在约束条件下求最值的方法。比如在"总预算=100万"的约束下，如何分配使得研究产出最大化。通过引入乘子λ将约束融入目标函数，转化为无约束问题。</p>','<p>SVM的推导(最大化间隔受约束于正确分类)用拉格朗日乘子转为其对偶问题。约束优化在有生物学约束(如预算、实验成本)时有广泛应用。</p>'),
    ('stage-4-math-differential-equations','微分方程与动力系统','<p>微分方程描述变量如何随时间(或空间)变化。dx/dt=f(x)——x的变化率取决于x当前的值。动力系统研究这些方程的长期行为：会收敛到稳态？振荡？混沌？</p>','<p>生信中用于：基因调控网络动力学(转录因子浓度如何随时间变化)、蛋白质相互作用动力学、细胞分化轨迹建模(拟时序分析)。</p>'),
    ('stage-4-math-stochastic-processes','随机过程与马尔可夫链','<p>随机过程=随时间随机演变的系统。马尔可夫链=未来只依赖于现在(不依赖于过去的历史)——"无记忆性"。隐马尔可夫模型(HMM)=观测到的是表面信号，隐藏的真实状态按马尔可夫链演变。</p>','<p>HMM广泛应用于：序列比对、基因预测(GeneMark)、蛋白质结构域识别、单细胞拟时序(Palantir)。</p>'),
    ('stage-4-math-variational-calculus','变分法','<p>变分法是"函数的微积分"——优化对象不是数值而是函数。找一个函数(不是数值)使得某个积分最小化。在物理中：质点走哪条路径使得作用量最小？</p>','<p>在最优控制问题(最优实验设计)和连续极限下的优化中有应用。是理解物理启发式ML方法(如哈密顿神经网络)的数学基础。</p>'),
    ('stage-4-math-information-advanced','信息论进阶 (互信息、KL散度)','<p>互信息I(X;Y)=知道X后Y的不确定性减少了多少——衡量两个变量之间的(非线性)依赖关系。KL散度=两个分布有多不同(非对称)。这两个是生成模型训练和特征选择的重要工具。</p>','<p>互信息在生信中用于基因调控网络推理——如果知道基因A的表达量大幅减少了对基因B表达量的不确定性，A可能在调控B。比相关性更强大因为它能捕捉非线性关系。</p>'),
    ('stage-4-math-manifold-learning','流形学习','<p>高维数据通常实际分布在一个低维"流形"(manifold)上。就像地球表面是3D空间中的2D曲面。流形学习试图恢复这个低维结构。UMAP假设数据在黎曼流形上→用模糊拓扑保持局部邻域→可视化。</p>','<p>UMAP/t-SNE是单细胞分析的核心可视化工具——它们假设细胞在"发育连续体"上(一个低维流形)。流形学习让我们从高维基因表达中提取出生物学意义的低维结构。</p>'),
]
difficulty_map = {1: '入门', 2: '中级', 3: '高级', 4: '高级'}
for key,name,concept,bio in math_topics:
    s = int(key.split('-')[1])
    add(key,name,s,'math',difficulty_map[s],[
        A(concept),C(concept),B(bio),
        Q([MQ('这个数学概念在生信ML中最常见的应用是什么？',
              ['没有应用',f'{name.split(":")[0] if ":" in name else name}是理解ML算法原理和生信数据分析的数学基础',
               '只用于理论研究','不需要理解'],1,
              '理解底层数学原理让你能够调试训练问题、设计更好的模型、理解为什么某些方法对你的数据有效或无效。')])
    ])

with open('public/data/topics.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n=== DONE ===")
print(f"Total topics: {len(data['topics'])}")
print(f"Topic order entries: {len(data['topicOrder'])}")
for s in [1,2,3,4]:
    n = len([t for t in data['topics'] if t['stage']==s])
    print(f"  Stage {s}: {n} topics")
