#!/usr/bin/env python3
"""Build Ng references JSON, then inject into topics.json"""
import json

NG = {
  'supervised-unsupervised': [
    ['coursera-ml', 'Ng在Week 1用房价预测引入监督学习：已知数据→学习模式→预测。他用鸡尾酒会问题引入无监督学习：从嘈杂混音中分离不同人的声音。'],
    ['cs229', 'CS229 Lecture 1给出监督学习的数学形式化。Ng强调：最重要的不是模型多复杂，而是你喂了什么数据。'],
  ],
  'classification-regression': [
    ['coursera-ml', 'Ng在Week 1-3反复强调：分类输出离散标签，回归输出连续值。在动手建模前先想清楚你的y是什么类型。'],
    ['cs229', 'CS229 Lecture 2-3：Ng用线性回归的最小二乘解析解vs梯度下降迭代解的对比，直观展示了闭式解vs优化的权衡。'],
  ],
  'knn': [
    ['coursera-ml', 'Ng用k-NN作为非参数方法的典型例子：不需要训练，预测时才计算——懒惰学习的特点。'],
  ],
  'kmeans': [
    ['coursera-ml', 'Ng在Week 8用自动分割市场的例子讲k-means，展示肘部法则选择k，推荐多次随机初始化选最低代价的结果。'],
    ['cs229', 'CS229 Lecture 13：Ng证明k-means本质上是EM算法的一个特例（高斯混合模型在协方差趋向0的极限）。'],
  ],
  'decision-tree': [
    ['cs229', 'CS229 Lecture 10：Ng说单棵树最大的问题是方差太大——数据稍微一变树结构就完全不同。所以他自然地引出随机森林。'],
  ],
  'evaluation-metrics': [
    ['coursera-ml', 'Ng在Week 6提出单一数字评估指标原则。他说：如果你有多个指标，团队会在会议上争论哪个更重要——用一个数结束争论。'],
    ['dl-c3', 'DL专项C3 Week 1：Ng将单一评估指标提升为ML项目管理的核心原则——如果团队有两个目标，把其中一个变成约束，优化另一个。'],
  ],
  'cross-validation': [
    ['coursera-ml', 'Ng在Week 6引入诊断法——用学习曲线判断过拟合/欠拟合。他说：当你不知道模型为什么表现不好时，画出学习曲线比盲目试超参数有效得多。'],
    ['dl-c2', 'DL专项C2 Week 1：Ng用Train/Dev/Test三集合划分作为DL项目第一步。小数据用70/30，大数据用98/1/1。'],
  ],
  'overfitting': [
    ['coursera-ml', 'Ng在Week 3&6对过拟合做了最详细的讲解——用复杂多项式完美穿过所有点但在新点上乱飞的动画展示过拟合。解决方案：更多数据/更少特征/正则化。'],
    ['dl-c2', 'DL专项C2 Week 1：Ng提出先看训练集→解决高偏差→再看验证集→解决高方差的诊断流程。他强调：不要同时调所有东西，遵循正交化原则。'],
  ],
  'neural-network-basics': [
    ['dl-c1', 'DL专项C1 Week 3-4：Ng手把手从单个神经元讲到深层网络。他说：深度学习没有魔法——只是很多个简单的单元组织在一起。'],
  ],
  'fnn': [
    ['dl-c1', 'DL专项C1 Week 3-4：Ng说这就是为什么深度有用——像乐高积木，简单的block可以搭成复杂结构。'],
    ['cs229', 'CS229 Lecture 12：Ng从XOR问题证明单层网络无法解决XOR（线性不可分），加一层隐藏层立刻解决。'],
  ],
  'activation': [
    ['dl-c1', 'DL专项C1 Week 3：Ng逐一讲解sigmoid/tanh/ReLU。推荐规则：隐藏层默认用ReLU，不确定就用ReLU。'],
  ],
  'backpropagation': [
    ['dl-c1', 'DL专项C1 Week 3-4：Ng用计算图来推导反向传播。他说：反向传播只是链式法则的系统性应用——理解了计算图就理解了BP。'],
  ],
  'loss-functions': [
    ['dl-c1', 'DL专项C1 Week 2：Ng花一整节课推导为什么MSE不适合逻辑回归。MSE+逻辑回归=非凸优化，交叉熵+逻辑回归=凸优化——梯度下降保证收敛到全局最优。'],
  ],
  'gradient-descent': [
    ['dl-c1', 'DL专项C1 Week 2：Ng用盲人下山比喻梯度下降。学习率=每步跨多大——太大跳过最小值，太小收敛太慢。'],
    ['dl-c2', 'DL专项C2 Week 2：Ng用小球滚下山讲动量，用不同方向不同步长讲RMSprop，用结合两者优点引出Adam。这些比喻让复杂的优化算法变得易懂。'],
  ],
  'vectorization': [
    ['dl-c1', 'DL专项C1 Week 2：Ng用代码对比for循环和numpy向量运算（300倍速度差）。他说：向量化不是可选的优化——是让DL在大数据上可行的必要条件。'],
  ],
  'minibatch': [
    ['dl-c2', 'DL专项C2 Week 2：Ng详细对比Batch/SGD/Mini-batch。全量太慢，SGD不稳定，Mini-batch（32/64/128）是甜点。'],
  ],
  'pytorch': [
    ['dl-c2', 'DL专项C2 Week 3：Ng用TensorFlow演示如何几行代码实现训练——框架让你专注于模型设计而非梯度计算细节。设计思想完全适用于PyTorch。'],
  ],
  'svm': [
    ['coursera-ml', 'Ng在Week 7讲SVM——这是他讲得最详细的算法之一。他用大间距分类器的几何直觉引入，强调核函数将数据映射到高维空间使其线性可分。'],
    ['cs229', 'CS229 Lecture 6-7：Ng从拉格朗日对偶性完整推导SVM。对偶形式中数据只以内积形式出现——这就是核技巧有效的数学原因。'],
  ],
  'random-forest': [
    ['cs229', 'CS229 Lecture 10：Ng说随机森林是开箱即用的最强算法之一——几乎不需要特征工程，自动处理非线性。'],
  ],
  'gradient-boosting': [
    ['coursera-ml', 'Ng在Week 10讲梯度提升：每次拟合残差——第一棵树拟合原始y，第二棵拟合残差y1-yhat1，第三棵拟合残差y2-yhat2……不断逼近。'],
  ],
  'logistic-regression': [
    ['coursera-ml', 'Ng在Week 3讲逻辑回归：从sigmoid函数性质到决策边界到代价函数J(theta)的完整推导。他说：理解逻辑回归就理解了神经网络的单个神经元。'],
    ['dl-c1', 'DL专项C1 Week 2再次回到逻辑回归——神经元+激活函数的本质等价于逻辑回归，这是从ML过渡到DL的关键认知。'],
  ],
  'naive-bayes': [
    ['cs229', 'CS229 Lecture 5：Ng从生成模型vs判别模型的角度讲朴素贝叶斯——判别模型直接学P(y|x)，生成模型学P(x|y)P(y)然后贝叶斯求P(y|x)。'],
  ],
  'pca': [
    ['coursera-ml', 'Ng在Week 8讲降维：PCA不是扔掉特征——是找到特征的更好表示。压缩后再解压等于丢掉噪声。'],
    ['cs229', 'CS229 Lecture 10：Ng从SVD角度推导PCA：X=USigmaV转置，前k个右奇异向量等于前k个主成分方向。'],
  ],
  'hyperparameter': [
    ['dl-c2', 'DL专项C2 Week 3：Ng给出超参数重要性排序——学习率alpha最重要，其次是隐藏单元数>Mini-batch size>层数>学习率衰减。'],
  ],
  'shap': [
    ['dl-c3', 'DL专项C3 Week 2：Ng的错误分析方法为模型解释提供了框架——检查100个预测错误按原因分类，最多的那类就是你下一步该优化的。'],
  ],
  'imbalanced-data': [
    ['coursera-ml', 'Ng在Week 6提出著名的准确率悖论：如果1%样本是正类，预测全为负类的准确率是99%，但完全没用。偏斜类要用Precision/Recall/F1评估。'],
  ],
  'survival': [
    ['cs229', 'CS229 Lecture 11：Ng讲EM算法处理缺失数据的思想也适用于生存分析的删失数据。他强调：观测不到不等于不存在，统计推断必须考虑未观测到的事件。'],
  ],
  'cnn': [
    ['dl-c4', 'DL专项C4 Week 1：Ng用边缘检测作为CNN引入。他说：CNN的神奇之处不在于卷积本身（几十年前就有了），而在于卷积核是学出来的。'],
  ],
  'rnn': [
    ['dl-c5', 'DL专项C5 Week 1：Ng用时间展开来可视化RNN——把循环展开成一个深层前馈网络，每一层对应一个时间步。'],
  ],
  'lstm': [
    ['dl-c5', 'DL专项C5 Week 1：Ng说这是他课程中最喜欢讲的内容。他用门等于信息流控制器的直觉——忘记门决定丢掉什么，更新门决定记住什么，输出门决定现在输出什么。'],
  ],
  'embedding': [
    ['dl-c5', 'DL专项C5 Week 2：Ng用king-man+woman约等于queen展示embedding的神奇——学到的不只是相似性，是语义的线性结构。'],
  ],
  'dropout': [
    ['dl-c2', 'DL专项C2 Week 1：Ng用球队训练类比讲解Dropout——每次训练随机抽掉几个人，剩下的人不能依赖某个明星球员。Dropout等于训练大量子网络的集成。'],
  ],
  'batch-norm': [
    ['dl-c2', 'DL专项C2 Week 3：Ng用协变量偏移解释BN——前面层参数变化导致后面层输入分布变化，后面层要不断适应。BN固定每层输入分布，加速训练。'],
  ],
  'learning-rate': [
    ['dl-c2', 'DL专项C2 Week 2：Ng说学习率是你最需要关心的超参数——它的影响超过其他所有超参数之和。推荐用图表而非固定decay来调学习率。'],
  ],
  'data-augmentation': [
    ['dl-c2', 'DL专项C2 Week 1：Ng把数据增强列为反过拟合的重要手段——翻转/旋转/裁剪不改变标签，但让模型看到更多变化。'],
  ],
  'transfer-learning': [
    ['dl-c3', 'DL专项C3 Week 2：Ng说迁移学习是小数据上做深度学习的秘密武器。两步策略：冻结预训练层当特征提取器，只训练你的分类层。'],
    ['dl-c4', 'DL专项C4 Week 2：Ng用ImageNet预训练模型做新分类任务的实战演示——即使只有几百张图片也能远超从头训练的效果。'],
  ],
  'bias-variance': [
    ['dl-c2', 'DL专项C2 Week 1：Ng提出了贝叶斯最优错误率作为偏差上限。诊断框架：训练误差减贝叶斯误差等于可避免偏差，验证误差减训练误差等于方差。先解决偏差再解决方差。'],
  ],
  'optimizers': [
    ['dl-c2', 'DL专项C2 Week 2：Ng用一整周讲优化算法——Momentum记住方向不拐弯，RMSprop让陡方向减速平方向加速，Adam结合两者成为默认选择。'],
  ],
  'gradient-issues': [
    ['dl-c1', 'DL专项C1 Week 4：Ng在深层网络部分讨论梯度消失——靠近输入层的梯度可能指数级变小，这些层几乎不更新。用ReLU和合适的初始化来缓解。'],
  ],
  'resnet': [
    ['dl-c4', 'DL专项C4 Week 2：Ng把ResNet称为计算机视觉史上最重要的架构创新之一。跳跃连接等于信息高速公路——学习残差F(x)=H(x)-x比直接学H(x)容易。'],
  ],
  'seq2seq': [
    ['dl-c5', 'DL专项C5 Week 1-3：Ng用机器翻译贯穿C5讲Seq2Seq到注意力到Transformer的演进。他说Seq2Seq的瓶颈在于固定大小的上下文向量——像通过小孔看大画。'],
  ],
  'attention': [
    ['dl-c5', 'DL专项C5 Week 3：Ng说注意力是他最喜欢讲解的概念之一。注意力权重的alpha矩阵可以被可视化——你会看到翻译时source和target的词确实在正确对齐。'],
  ],
  'transformer': [
    ['dl-c5', 'DL专项C5 Week 3：Ng说这是改变NLP（也是改变DL）的架构——它证明了一个完全基于注意力的网络可以取代RNN。'],
  ],
  'bert': [
    ['dl-c5', 'DL专项C5 Week 2：Ng讲完word2vec和GloVe后介绍了BERT式的上下文相关词嵌入——同一个词在不同上下文中应该有不同的embedding。'],
  ],
  'vit': [
    ['dl-c4', 'DL专项C4 Week 1-2：Ng对CNN局部连接和参数共享的讲解为理解ViT提供了对比视角——理解CNN的归纳偏置才能理解为什么ViT需要更多数据。'],
  ],
  'end-to-end': [
    ['dl-c3', 'DL专项C3 Week 2：Ng把端到端DL作为C3课程高潮——数据足够多时端到端可能超越pipeline；数据不够时注入领域知识的pipeline更优。'],
  ],
  'ml-strategy': [
    ['dl-c3', 'DL专项C3两整周讲ML策略——这是Ng课程系列中最独特的部分。他说40%的ML项目失败不是因为模型不够好，而是策略不对。'],
  ],
  'multimodal': [
    ['dl-c3', 'DL专项C3 Week 2：Ng讲多任务学习时说一个模型同时做多个任务——共享底层特征，独立顶层输出。这个思路与多模态学习一脉相承。'],
  ],
  'distillation': [
    ['dl-c3', 'DL专项C3 Week 1：Ng对模型压缩的讨论预见了蒸馏思想——部署时不需要训练时的复杂度，可以用更小的模型模仿大模型的输出。'],
  ],
  'alphafold2': [
    ['dl-c4', 'Ng对ResNet、注意力和等变性的讲解为理解AlphaFold提供了所有必要基础。AlphaFold2的IPA模块的设计原理正是Ng强调的等变性。'],
    ['dl-c3', 'Ng的端到端DL讨论直接适用于AlphaFold2的架构选择——从MSA到3D坐标的端到端预测。'],
  ],
  'esm2': [
    ['dl-c5', 'DL专项C5 Week 2-3：Ng对词嵌入和语言模型的讲解是理解ESM-2的最佳前置知识。蛋白质的氨基酸等于语言的词，掩码语言模型等于在蛋白质序列上做完形填空。'],
  ],
  'enformer': [
    ['dl-c3', 'Ng的端到端DL思想完美解释了Enformer的设计——从200kb DNA序列直接预测基因表达，跳过中间步骤。'],
    ['dl-c5', 'Enformer的自注意力直接源自Ng在C5中讲解的Transformer——多头注意力让模型从不同视角看序列。'],
  ],
  'genomic-language': [
    ['dl-c3', 'Ng的端到端DL思想解释了基因组语言模型——从DNA序列直接学习调控语法，跳过手工特征工程。'],
    ['dl-c5', '基因组Transformer的注意力机制直接源自Ng讲解的自注意力——每个DNA位置都可以直接看到所有其他位置。'],
  ],
  'diffusion': [
    ['dl-c4', 'Ng在神经风格迁移中讲解的从噪声逐步生成的思想与扩散模型异曲同工。Ng说的AI能创造新东西而不仅是识别正好概括了扩散模型+生信的价值。'],
  ],
  'single-cell': [
    ['dl-c3', 'Ng讲迁移学习时说在大数据上预训练、在小数据上微调——这正是scGPT/scFoundation的设计范式。'],
  ],
  'reinforcement': [
    ['cs229', 'CS229 Lecture 16-17：Ng用一整周讲强化学习——从MDP到Q-Learning/Policy Gradient。他的直升机自动驾驶例子展示了RL在复杂连续动作空间中的学习能力。'],
  ],
  'causal': [
    ['cs229', 'CS229 Lecture 14：Ng用冰淇淋销量和溺水率的例子解释因果vs相关——两者相关但禁售冰淇淋不会减少溺水，因为有第三个变量温度同时影响两者。'],
  ],
  'linear-algebra': [
    ['coursera-ml', 'Ng在Week 1就用矩阵形式化线性回归。他说你不必成为线性代数专家，但理解矩阵乘法是理解ML实现的最基本要求。'],
  ],
  'calculus': [
    ['coursera-ml', 'Ng在Week 2讲梯度下降时手算偏导数。他说你不用手算导数——框架帮你算——但理解导数是什么会让你的调参直觉好10倍。'],
  ],
  'probability': [
    ['cs229', 'CS229 Lecture 4：Ng用贝叶斯定理推导GDA。他说贝叶斯定理是ML中最重要的一条公式——从先验经过证据得到后验。'],
  ],
  'statistics': [
    ['cs229', 'CS229 Lecture 1：Ng开场就回顾均值/方差/高斯分布——假设数据服从正态分布，就可以给每个数据点算p-value，构成统计检验的基础。'],
  ],
  'matrix-decomp': [
    ['cs229', 'CS229 Lecture 10：Ng从SVD讲PCA——X=USigmaV转置，U的列是左奇异向量，V的列是右奇异向量（等于主成分方向）。这是ML中最优雅的数学联系之一。'],
  ],
  'gradient-descent-variants': [
    ['dl-c2', 'DL专项C2 Week 2：Ng用一整周对比优化器——从SGD锯齿路径到Momentum平滑路径到RMSprop自适应到Adam最优默认。这些动画是所有ML学习者最应该记住的图示。'],
  ],
  'probability-distributions': [
    ['cs229', 'CS229 Lecture 4：Ng从指数族分布角度统一看高斯/伯努利/多项分布——GLM利用指数族性质，每个分布有对应的link函数和自然参数。'],
  ],
  'mle': [
    ['cs229', 'CS229 Lecture 4：Ng从MLE推导线性回归的最小二乘——假设y给定x服从正态分布，最大化log-likelihood等价于最小化MSE。损失函数不是随意选的——它来自对数据分布的假设。'],
  ],
  'information-theory': [
    ['cs229', 'CS229 Lecture 1-3：Ng从y=1时log(h)要大、y=0时log(1-h)要大的角度推导交叉熵——本质上就是用信息论的直觉来设计损失函数。'],
  ],
  'attention-math': [
    ['dl-c5', 'DL专项C5 Week 3：Ng手算QK转置→softmax→加权V的完整过程。他特别强调根号dk的作用——不加缩放的话，dk很大时softmax输出趋近one-hot，梯度接近0。'],
  ],
  'variational': [
    ['cs229', 'CS229 Lecture 15：Ng讲EM算法时用反复猜测-更新的迭代来近似难以直接计算的分布——这个用简单分布逼近复杂后验的思想是变分推断的核心。'],
  ],
  'lagrange': [
    ['cs229', 'CS229 Lecture 6：Ng在推导SVM的对偶问题时展示了拉格朗日乘子法的完整计算——引入乘子alpha将约束融入目标函数，然后求鞍点。'],
  ],
  'stochastic': [
    ['cs229', 'CS229 Lecture 16：Ng用MDP引入马尔可夫链——下一状态的概率只取决于当前状态和动作，不依赖于历史路径。'],
  ],
}

# Now inject into topics.json
with open('public/data/topics.json') as f:
    data = json.load(f)

NG_COURSES = {
    'cs229': {'name': 'Stanford CS229《机器学习》Andrew Ng', 'desc': '斯坦福校内版ML课程，数学推导完整，涵盖监督学习、生成学习、SVM、核方法、学习理论和强化学习'},
    'coursera-ml': {'name': 'Coursera《机器学习》Andrew Ng', 'desc': '全球最受欢迎的ML入门课，以直觉为导向，每周有编程作业'},
    'dl-c1': {'name': '深度学习专项(C1)《神经网络与深度学习》Andrew Ng', 'desc': '四周：DL引言→神经网络编程基础→浅层网络→深层网络。向量化、激活函数、反向传播的完整推导'},
    'dl-c2': {'name': '深度学习专项(C2)《改善深层神经网络》Andrew Ng', 'desc': '三周：正则化/Dropout/BN→优化算法(Momentum/RMSprop/Adam)→超参数调优。偏差方差诊断框架'},
    'dl-c3': {'name': '深度学习专项(C3)《结构化机器学习项目》Andrew Ng', 'desc': '两周：ML策略/正交化/单一指标→误差分析/数据不匹配/迁移学习/多任务/端到端DL'},
    'dl-c4': {'name': '深度学习专项(C4)《卷积神经网络》Andrew Ng', 'desc': '四周：CNN基础→经典网络(ResNet/Inception)→目标检测(YOLO)→人脸识别/风格迁移'},
    'dl-c5': {'name': '深度学习专项(C5)《序列模型》Andrew Ng', 'desc': '三周：RNN/GRU/LSTM→词嵌入(Word2Vec/GloVe)→Seq2Seq/注意力/Transformer'},
}

updated = 0
for topic in data['topics']:
    key = topic['key']
    # Find matching pattern
    matched = None
    for pattern, refs in NG.items():
        if pattern in key:
            matched = refs
            break

    if not matched:
        print(f"  SKIP: {topic['name']}")
        continue

    # Find expert section
    for sec in topic['sections']:
        if sec['type'] != 'expert':
            continue

        # Build Ng HTML
        items = []
        for course_key, quote in matched:
            course = NG_COURSES.get(course_key)
            if not course:
                continue
            items.append(
                f'<div style="margin-bottom:10px;padding:10px 14px;background:#FFF0E5;border-radius:6px;border-left:3px solid #E67E22">'
                f'<p style="margin:0 0 3px 0;font-size:12px;font-weight:600;color:#C0392B">{chr(127891)} {course["name"]}</p>'
                f'<p style="margin:0 0 3px 0;font-size:12px;color:#4A4A4A;line-height:1.7">{quote}</p>'
                f'<p style="margin:0;font-size:11px;color:#A0A0A0">{course["desc"]}</p>'
                f'</div>'
            )

        if items:
            header = '<p style="font-size:13px;color:#4A4A4A;margin-bottom:6px;font-weight:600">' + chr(127891) + ' 吴恩达课程观点</p>\n'
            existing = sec.get('content', '')
            sec['content'] = existing + '\n<hr style="border:none;border-top:1px solid #E5E5E5;margin:12px 0">\n' + header + '\n'.join(items)
            updated += 1

with open('public/data/topics.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nUpdated {updated}/{len(data['topics'])} topics with Ng references")
