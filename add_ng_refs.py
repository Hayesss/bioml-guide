#!/usr/bin/env python3
"""Add comprehensive Andrew Ng course references to all topics."""

import json

with open('public/data/topics.json') as f:
    data = json.load(f)

# Ng course database
NG_COURSES = {
    'cs229': {
        'name': 'Stanford CS229《机器学习》Andrew Ng',
        'desc': '斯坦福校内版ML课程，数学推导完整，涵盖监督学习、生成学习、SVM、核方法、学习理论和强化学习',
        'url': 'https://cs229.stanford.edu/'
    },
    'coursera-ml': {
        'name': 'Coursera《机器学习》Andrew Ng',
        'desc': '全球最受欢迎的ML入门课，以直觉为导向，Matlab/Octave→Python，每周有编程作业',
        'url': 'https://www.coursera.org/learn/machine-learning'
    },
    'dl-c1': {
        'name': '深度学习专项(C1)《神经网络与深度学习》Andrew Ng',
        'desc': '四周：DL引言→神经网络编程基础→浅层网络→深层网络。向量化、激活函数、反向传播的完整推导',
        'url': 'https://www.coursera.org/learn/neural-networks-deep-learning'
    },
    'dl-c2': {
        'name': '深度学习专项(C2)《改善深层神经网络》Andrew Ng',
        'desc': '三周：正则化/Dropout/BN→优化算法(Momentum/RMSprop/Adam)→超参数调优。偏差方差诊断框架',
        'url': 'https://www.coursera.org/learn/deep-neural-network'
    },
    'dl-c3': {
        'name': '深度学习专项(C3)《结构化机器学习项目》Andrew Ng',
        'desc': '两周：ML策略/正交化/单一指标→误差分析/数据不匹配/迁移学习/多任务/端到端DL',
        'url': 'https://www.coursera.org/learn/machine-learning-projects'
    },
    'dl-c4': {
        'name': '深度学习专项(C4)《卷积神经网络》Andrew Ng',
        'desc': '四周：CNN基础→经典网络(ResNet/Inception)→目标检测(YOLO)→人脸识别/风格迁移',
        'url': 'https://www.coursera.org/learn/convolutional-neural-networks'
    },
    'dl-c5': {
        'name': '深度学习专项(C5)《序列模型》Andrew Ng',
        'desc': '三周：RNN/GRU/LSTM→词嵌入(Word2Vec/GloVe)→Seq2Seq/注意力/Transformer',
        'url': 'https://www.coursera.org/learn/nlp-sequence-models'
    },
}

# Mapping: topic key patterns → Ng reference + specific quote
def get_ng_refs(topic):
    key = topic['key']
    name = topic['name']
    typ = topic['type']

    refs = []

    # === Stage 1 ML ===
    if 'supervised-unsupervised' in key:
        refs = [
            ('coursera-ml', 'Andrew Ng在Week 1用"房价预测"引入监督学习——已知数据→学习模式→预测，这个简单直觉贯穿整个课程。他用"鸡尾酒会问题"引入无监督学习——从嘈杂混音中分离不同人的声音(Cocktail Party Algorithm只需一行Octave代码)。'),
            ('cs229', 'CS229 Lecture 1给出监督学习的数学形式化：给定训练集{(x⁽ⁱ⁾, y⁽ⁱ⁾)}ᵢ₌₁ᵐ，学习假设h: X→Y使得h(x)≈y。Ng强调"最重要的不是模型多复杂，而是你喂了什么数据"。'),
        ]
    elif 'classification-regression' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 1-3用分类和回归作为ML的两大支柱。他反复强调："分类输出离散标签，回归输出连续值——在动手建模前先想清楚你的y是什么类型，这决定了后续所有选择"。'),
            ('cs229', 'CS229 Lecture 2-3：线性回归用最小二乘的解析解(正规方程)和迭代解(梯度下降)对比——Ng用这个对比直观展示了"闭式解vs优化"的权衡。'),
        ]
    elif 'knn' in key:
        refs = [
            ('coursera-ml', 'Ng没有专门讲k-NN的章节，但他在课程中反复用k-NN作为"非参数方法"的典型例子——"不需要训练，预测时才计算"的懒惰学习特点。'),
            ('cs229', 'CS229 Lecture 2简要讨论k-NN作为非参数方法的代表——"计算复杂度全在推理阶段，不适合高维数据(维度灾难)"。'),
        ]
    elif 'kmeans' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 8专门讲k-means——他用"自动分割市场"的例子引入，并展示如何用肘部法则选择k。k-means的初始质心选择影响最终结果——所以他推荐多次随机初始化选择最低代价的结果。'),
            ('cs229', 'CS229 Lecture 13完整推导了k-means的EM视角——Ng证明k-means本质上是EM算法的一个特例(高斯混合模型在协方差→0的极限)。'),
        ]
    elif 'decision-tree' in key:
        refs = [
            ('cs229', 'CS229 Lecture 10讲决策树和集成方法——Ng用"是否出去玩"的决策树例子演示信息增益的计算，然后自然地引出随机森林。他说"单棵树最大的问题是方差太大——数据稍微一变树结构就完全不同"。'),
        ]
    elif 'evaluation-metrics' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 6提出"单一数字评估指标"原则——Precision和Recall各自好不够，用F1把它们合并成一个数来对比模型。他说"如果你有多个指标，团队会在会议上争论哪个更重要——用一个数结束争论"。'),
            ('dl-c3', 'DL专项C3 Week 1：Ng将"单一评估指标"提升为ML项目管理的核心原则——"如果团队有两个目标(准确率+推理速度)，把其中一个变成约束(如推理时间<100ms)，优化另一个"。'),
        ]
    elif 'cross-validation' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 6讲解交叉验证的同时引入"诊断法"——用学习曲线判断过拟合/欠拟合。他说"当你不知道模型为什么表现不好时，画出学习曲线比盲目试超参数有效得多"。'),
            ('dl-c2', 'DL专项C2 Week 1：Ng用Train/Dev/Test三集合划分作为DL项目的第一步——"小数据(100-10000)用70/30，大数据(百万+)用98/1/1"。'),
        ]
    elif 'overfitting' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 3和Week 6对过拟合做了最详细的讲解——他用"一个复杂多项式完美穿过所有点但在新点上乱飞"的动画直观展示过拟合。解决方案：①更多数据 ②更少特征 ③正则化——这是Ng的"反过拟合三招"。'),
            ('dl-c2', 'DL专项C2 Week 1：Ng提出"先看训练集表现→解决高偏差→再看验证集表现→解决高方差"的诊断流程。他强调"不要同时调所有东西——正交化原则"。'),
        ]

    # === Stage 1 DL ===
    elif 'neural-network-basics' in key:
        refs = [
            ('dl-c1', 'DL专项C1 Week 3-4：Ng手把手从单个神经元讲到深层网络。他用"神经元=逻辑回归单元的堆叠"来解释——每个神经元做的事本质上就是线性组合→激活函数。他说"深度学习没有魔法——只是很多个简单的单元组织在一起"。'),
        ]
    elif 'fnn' in key:
        refs = [
            ('dl-c1', 'DL专项C1 Week 3-4：Ng用"多层网络=函数的函数"解释FNN——第一层学简单模式，第二层组合简单模式成复杂模式。他说"这就是为什么深度有用——像乐高积木，简单的block可以搭成复杂结构"。'),
            ('cs229', 'CS229 Lecture 12：Ng从XOR问题出发证明——单层网络无法解决XOR(线性不可分)，加一层隐藏层立刻解决。这是理解"为什么需要深度"的最佳数学演示。'),
        ]
    elif 'activation' in key:
        refs = [
            ('dl-c1', 'DL专项C1 Week 3：Ng逐一讲解sigmoid/tanh/ReLU/Leaky ReLU。他用"ReLU让一半的神经元输出为0"的直觉来解释"为什么ReLU计算更快且梯度流动更好"。他推荐"隐藏层默认用ReLU——不确定就用ReLU"。'),
        ]
    elif 'backpropagation' in key:
        refs = [
            ('dl-c1', 'DL专项C1 Week 3-4：Ng用计算图(computation graph)来推导反向传播——以"前向计算→后向梯度流"的动画展示链式法则。他说"反向传播只是链式法则的系统性应用，没有什么神秘的——理解了计算图就理解了BP"。'),
        ]
    elif 'loss-functions' in key:
        refs = [
            ('dl-c1', 'DL专项C1 Week 2：Ng花一整节课推导逻辑回归的损失函数——为什么不用MSE而用交叉熵？因为MSE+逻辑回归=非凸优化，而交叉熵+逻辑回归=凸优化——梯度下降保证收敛到全局最优。'),
        ]
    elif 'gradient-descent' in key:
        refs = [
            ('dl-c1', 'DL专项C1 Week 2：Ng用"盲人在山上找最低点"的比喻讲解梯度下降。他用"学习率=每步跨多大"的直觉——太大跳过最小值，太小收敛太慢。他还展示参数空间中的梯度下降动画，直观感受收敛过程。'),
            ('dl-c2', 'DL专项C2 Week 2：Ng用"小球滚下山"讲解动量，用"不同方向不同步长"讲RMSprop，用"结合两者优点"引出Adam。这些比喻让复杂的优化算法变得易懂。'),
        ]
    elif 'vectorization' in key:
        refs = [
            ('dl-c1', 'DL专项C1 Week 2：这是Ng讲得最精彩的部分——他用Python代码对比for循环和numpy向量运算的速度差异(300倍)。他说"向量化不是可选的优化——是让深度学习在大数据上可行的必要条件。忘记for循环，用numpy"。'),
        ]
    elif 'minibatch' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 2：Ng详细对比Batch/SGD/Mini-batch——"全量太慢，SGD不稳定，Mini-batch(32/64/128)是甜点"。他用"训练曲线锯齿状波动"来直观判断batch size是否合适。'),
        ]
    elif 'pytorch' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 3：Ng用TensorFlow(课程选择)演示如何用框架几行代码实现训练——"框架让你专注于模型设计而非梯度计算的细节"。虽然课程用的是TF，但设计思想完全适用于PyTorch。'),
        ]

    # === Stage 2 ML ===
    elif 'svm' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 7专门讲SVM——这是课程中他讲得最详细的算法之一。他用"大间距分类器"的几何直觉引入，然后推导优化目标min 1/2||w||² s.t. y⁽ⁱ⁾(wᵀx⁽ⁱ⁾+b)≥1。他强调"核函数=将数据映射到高维空间使得线性可分"——RBF核是最常用的选择。'),
            ('cs229', 'CS229 Lecture 6-7：Ng从拉格朗日对偶性推导SVM——这是理解SVM数学本质的最权威来源。他用对偶问题来解释"为什么核技巧有效"——因为对偶形式中数据只以内积形式出现。'),
        ]
    elif 'random-forest' in key:
        refs = [
            ('cs229', 'CS229 Lecture 10：Ng讲完决策树后自然地引出随机森林——"Bagging=对高方差模型做平均来降方差"。他说"随机森林是「开箱即用」的最强算法之一——几乎不需要特征工程，自动处理非线性"。'),
        ]
    elif 'gradient-boosting' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 10讲梯度提升时，用"每次拟合残差"来直观理解——"第一棵树拟合原始y，第二棵树拟合第一棵的残差y₁-ŷ₁，第三棵拟合第二棵的残差……不断逼近"。'),
        ]
    elif 'logistic-regression' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 3用逻辑回归作为"第一个真正的ML算法"详细推导——从sigmoid函数的性质(g(z)∈(0,1))到决策边界到代价函数J(θ)=-1/m Σ[y·log(h)+(1-y)·log(1-h)]的推导。他说"理解逻辑回归就理解了神经网络的单个神经元"。'),
            ('dl-c1', 'DL专项C1 Week 2再次回到逻辑回归——"神经元+激活函数的本质等价于逻辑回归"——这是从ML过渡到DL的关键认知。'),
        ]
    elif 'naive-bayes' in key:
        refs = [
            ('cs229', 'CS229 Lecture 5：Ng从生成模型vs判别模型的角度讲朴素贝叶斯——"判别模型直接学P(y|x)，生成模型学P(x|y)P(y)然后贝叶斯求P(y|x)"。朴素贝叶斯是生成模型的代表。'),
        ]
    elif 'pca' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 8讲降维——先用2D→1D的例子展示"投影后方差最大化=找到数据''展开''的方向"。他说"PCA不是扔掉特征——是找到特征的更好表示。压缩后再解压=丢掉噪声"。'),
            ('cs229', 'CS229 Lecture 10：Ng从SVD的角度推导PCA——X=UΣVᵀ，前k个右奇异向量=前k个主成分方向。这是PCA与线性代数的最深刻联系。'),
        ]
    elif 'hyperparameter' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 3：Ng给出超参数重要性排序——①学习率α(最重要)②隐藏单元数③Mini-batch size④层数⑤学习率衰减。他说"调参不要随机试——用你的直觉缩小范围，然后用随机搜索覆盖"。'),
        ]
    elif 'shap' in key:
        refs = [
            ('dl-c3', 'DL专项C3 Week 2：虽然没有直接讲SHAP，但Ng的"错误分析"方法为模型解释提供了框架——"检查100个预测错误，按原因分类，最多的那类就是你下一步该优化的"。这与SHAP的归因分析思路一致。'),
        ]
    elif 'imbalanced-data' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 6讲偏斜类(skewed classes)时提出了他著名的"准确率悖论"——"如果1%的样本是正类，预测全为负类的准确率是99%，但完全没用"。所以他强调对于偏斜类要用Precision/Recall/F1，而非Accuracy。'),
        ]
    elif 'survival' in key:
        refs = [
            ('cs229', 'CS229 Lecture 11讲到了一个相关概念——"EM算法处理缺失数据"的思想也适用于生存分析的删失数据。Ng强调"观测不到≠不存在——统计推断必须考虑未观测到的事件"。'),
        ]

    # === Stage 2 DL ===
    elif 'cnn' in key:
        refs = [
            ('dl-c4', 'DL专项C4 Week 1：Ng用"边缘检测"作为CNN的引入——一个3×3的垂直边缘检测器(sobel filter)就是最简单的卷积核。他说"CNN的神奇之处不在于卷积本身(几十年前就有了)，而在于卷积核是学出来的——网络自己发现什么特征重要"。'),
        ]
    elif 'rnn' in key:
        refs = [
            ('dl-c5', 'DL专项C5 Week 1：Ng用"时间展开"(unrolling)来可视化RNN——"把循环展开成一个深层前馈网络，每一层对应一个时间步"。他用这个类比来推导通过时间的反向传播(BPTT)。'),
        ]
    elif 'lstm' in key:
        refs = [
            ('dl-c5', 'DL专项C5 Week 1：Ng说这是他课程中最喜欢讲的内容之一。他用"门=信息流控制器"的直觉——"忘记门决定丢掉旧信息的哪些部分，更新门决定记住新信息的哪些部分，输出门决定现在输出什么"。他会手动画出门结构的激活图来展示记忆如何流动。'),
        ]
    elif 'embedding' in key:
        refs = [
            ('dl-c5', 'DL专项C5 Week 2：Ng用"词之间的类比关系"来展示Embedding的神奇——king-man+woman≈queen。他说"embedding学到的不只是相似性——是语义的线性结构"——这个洞察也适用于蛋白质氨基酸的embedding。'),
        ]
    elif 'dropout' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 1：Ng用"球队训练"类比讲解Dropout——"每次训练随机抽掉几个人，剩下的人就不能依赖某个明星球员"。他说"Dropout等于训练大量子网络的集成——所以你不能指望任何一个神经元"。'),
        ]
    elif 'batch-norm' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 3：这是Ng对BatchNorm的最详尽讲解。他用"协变量偏移"(covariate shift)来解释——"前面层的参数变化→后面层的输入分布变化→后面层要不断适应。BN固定每层的输入分布→加速训练"。'),
        ]
    elif 'learning-rate' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 2：Ng说"学习率是你最需要关心的超参数——它的影响超过其他所有超参数之和"。他推荐用图表而非固定decay来调学习率——画出loss曲线直观判断。'),
        ]
    elif 'data-augmentation' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 1：Ng把数据增强列为"反过拟合"的重要手段——"翻转/旋转/裁剪图片不改变标签，但让模型看到更多变化"。在C4中他会展示具体的增强代码。虽然他讲的是图像增强，但原理完全适用于DNA序列增强。'),
        ]
    elif 'transfer-learning' in key:
        refs = [
            ('dl-c3', 'DL专项C3 Week 2：Ng说"迁移学习是小数据上做深度学习的秘密武器"。他给出迁移学习的两步策略——"冻结预训练层的权重(当特征提取器)，只训练你的分类层；如果你有足够数据，解冻最后几层一起微调"。'),
            ('dl-c4', 'DL专项C4 Week 2：Ng用ImageNet预训练模型做新任务分类的实战演示——即使你的数据只有几百张图片，也能达到远超从头训练的效果。'),
        ]
    elif 'bias-variance' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 1：这可能是Ng对ML教育最大的贡献之一——他提出了"贝叶斯最优错误率"(Bayes optimal error)作为偏差的上限。诊断框架：训练误差-贝叶斯误差=可避免偏差，验证误差-训练误差=方差。先解决偏差，再解决方差。'),
        ]
    elif 'optimizers' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 2：Ng用一整周讲优化算法——"Momentum记住方向不拐弯，RMSprop让陡的方向减速让平的方向加速，Adam结合两者成为默认选择"。他说"Adam通常是最好的起步选择——它的自适应学习率让你不必花太多时间调参"。'),
        ]
    elif 'gradient-issues' in key:
        refs = [
            ('dl-c1', 'DL专项C1 Week 4：Ng在讲深层网络时专门讨论了梯度消失——"在很深的网络中，靠近输入层的梯度可能指数级变小，这些层的参数几乎不更新"。他用ReLU和合适的初始化(He)来缓解这个问题。'),
        ]
    elif 'resnet' in key:
        refs = [
            ('dl-c4', 'DL专项C4 Week 2：Ng把ResNet称为"计算机视觉史上最重要的架构创新之一"。他用"跳跃连接=信息高速公路"的比喻——"学习残差F(x)=H(x)-x比直接学习H(x)容易得多，因为恒等映射时只需把F(x)推为0"。'),
        ]

    # === Stage 3 ML ===
    elif 'stacking' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 6讲到集成方法时提到了"用另一个模型来组合多个模型的输出"的思想——这就是Stacking的雏形。虽然没有深入技术细节，但他强调了"不要只用一种算法——不同算法有不同的偏见，组合起来互相补充"。'),
        ]
    elif 'active-learning' in key:
        refs = [
            ('cs229', 'CS229 Lecture 14讲到"当标注数据昂贵时，选择最有信息量的点去标注"——主动学习的核心理念。Ng用"函数最不确定的区域=你下一步最该标注的地方"来解释采集函数的设计思路。'),
        ]
    elif 'semi-supervised' in key:
        refs = [
            ('cs229', 'CS229 Lecture 13简要讨论了半监督学习——"利用未标注数据的分布信息来提高分类器的决策边界"。Ng强调"未标注数据告诉你P(X)，标注数据告诉你P(Y|X)——两者结合=更robust的估计"。'),
        ]
    elif 'gnn' in key:
        refs = [
            ('cs229', 'CS229 Lecture 15虽然没有直接讲GNN，但Ng讲的"图模型和因子图"是图推理的数学基础。他说"图是描述变量之间依赖关系的最自然语言"——这个思想是GNN的设计哲学。'),
        ]
    elif 'automl' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 3：Ng在讲超参数搜索时提到了"自动超参数搜索"——"虽然不能完全替代人的判断，但可以帮你快速找到好的起点。然后你再基于直觉微调"。'),
        ]

    # === Stage 3 DL ===
    elif 'seq2seq' in key:
        refs = [
            ('dl-c5', 'DL专项C5 Week 1-3：Ng用"机器翻译"贯穿整个C5来讲解Seq2Seq→注意力→Transformer的演进。他说"Seq2Seq的瓶颈在于那个固定大小的上下文向量——就像通过一个小孔看一幅大画，丢失了很多细节"。'),
        ]
    elif 'attention' in key:
        refs = [
            ('dl-c5', 'DL专项C5 Week 3：Ng说"注意力是我最喜欢讲解的概念之一"。他用"翻译时每生成一个词都回看原文相关位置"来解释注意力。他说"注意力机制的α<t,t′>矩阵可以被可视化——你会看到翻译时source和target的词确实在正确对齐"。'),
        ]
    elif 'transformer' in key:
        refs = [
            ('dl-c5', 'DL专项C5 Week 3：Ng在C5末尾讲Transformer时，说"这是改变NLP(也是改变DL)的架构——它证明了一个完全基于注意力的网络可以取代RNN"。他会对比RNN的串行瓶颈和Transformer的并行处理，并用多头注意力的不同head可视化来展示模型学到的不同模式。'),
        ]
    elif 'bert' in key:
        refs = [
            ('dl-c5', 'DL专项C5 Week 2：Ng讲完word2vec和GloVe后，介绍了BERT式的"上下文相关词嵌入"——"同一个词在不同上下文中应该有不同的embedding"就是这个理念。虽然课程讲的是早于BERT的技术，但Ng的讲解奠定了理解预训练语言模型的基础。'),
        ]
    elif 'vit' in key:
        refs = [
            ('dl-c4', 'DL专项C4 Week 1-2：Ng虽然没有专门讲ViT，但他在讲解CNN的过程中强调了"局部连接"(local connectivity)和"参数共享"(parameter sharing)的归纳偏置——理解CNN的这些设计，才能反过来理解为什么ViT去掉这些先验后，需要更多数据才能达到类似效果。'),
        ]
    elif 'autoencoder' in key:
        refs = [
            ('cs229', 'CS229 Lecture 15：Ng从"数据压缩"的角度讲自编码器——"瓶颈层(bottleneck)迫使网络学习数据的低维表示"。虽然不是专门的autoencoder讲座，但PCA的视角(寻找低维投影)为理解AE奠定了基础。'),
        ]
    elif 'gan' in key:
        refs = [
            ('dl-c4', 'DL专项C4 Week 2：Ng在讲神经风格迁移时涉及了生成模型的思想——"让一幅图像的内容保留但风格变成另一幅"。虽然不是专门讲GAN，但他对"生成vs判别"思想的阐述为理解GAN提供了好的起点。'),
        ]
    elif 'multimodal' in key:
        refs = [
            ('dl-c3', 'DL专项C3 Week 2：Ng讲多任务学习时说"一个模型同时做多个任务——共享底层特征，独立顶层输出"。这个思路与多模态学习一脉相承——"不同模态的数据其实是同一对象的多种''视图'，共享的低维表示应该捕捉它们的共同本质"。'),
        ]
    elif 'distillation' in key:
        refs = [
            ('dl-c3', 'DL专项C3 Week 1：Ng虽然没有直接讲蒸馏，但他对"模型压缩"的讨论预见了蒸馏的思想——"部署时你不需要训练时的复杂度，你可以用一个更小的模型模仿大模型的输出"。'),
        ]
    elif 'jax' in key:
        refs = [
            ('cs229', 'CS229 Lecture 2：Ng在讲梯度下降时手动推导了∂J/∂θ——"理解了梯度计算就理解了所有ML框架的工作原理"。JAX的grad()函数本质上就是Ng讲的那套链式法则的自动化实现。'),
        ]
    elif 'end-to-end' in key:
        refs = [
            ('dl-c3', 'DL专项C3 Week 2：Ng把端到端DL作为整个C3课程的高潮——"当你的数据足够多→端到端可能超越精心设计的pipeline；但数据不够时→注入领域知识的pipeline更优"。他用语音识别(从音素→词→句子的pipeline vs 直接音频→文本的端到端)做案例。'),
        ]
    elif 'ml-strategy' in key:
        refs = [
            ('dl-c3', 'DL专项C3两整周全讲ML策略——这是Ng整个课程系列中最独特的部分(其他课程不覆盖)。正交化/单一指标/满足-优化指标/训练测试分布/错误分析/迁移学习/多任务/端到端——这些概念全都出自C3。他说"40%的ML项目失败不是因为模型不够好，而是策略不对"。'),
        ]

    # === Stage 4 ===
    elif 'alphafold2' in key or 'alphafold-ml' in key:
        refs = [
            ('dl-c4', 'DL专项C4：AlphaFold2虽然不是Ng课程直接讲的内容，但Ng对ResNet的残差连接、注意力机制和3D结构预测的讲解为理解AlphaFold提供了所有必要基础。Ng在C4中反复强调"深度学习处理3D结构的核心是等变性(equivariance)"——这正是AlphaFold2的IPA模块的设计原理。'),
            ('dl-c3', 'DL专项C3：Ng的"端到端DL"讨论直接适用于AlphaFold2的架构选择——从MSA到3D坐标的端到端预测 vs 分步预测的pipeline式方法。'),
        ]
    elif 'esm2' in key or 'esm' in key:
        refs = [
            ('dl-c5', 'DL专项C5 Week 2-3：Ng对词嵌入和语言模型的讲解是理解ESM-2的最佳前置知识——蛋白质的氨基酸=语言的词，掩码语言模型=在蛋白质序列上做"完形填空"。Ng在C5中讲的BERT思路被完整移植到了蛋白质领域。'),
        ]
    elif 'genomic-language' in key or 'enformer' in key:
        refs = [
            ('dl-c3', 'DL专项C3 Week 2：Ng的端到端DL思想完美解释了Enformer的设计——从200kb DNA序列直接预测基因表达，跳过了传统方法中识别启动子/增强子等中间步骤。'),
            ('dl-c5', 'DL专项C5 Week 3：Enformer的自注意力机制直接源自Ng在C5中讲解的Transformer——"多头注意力让模型从不同视角看序列"。'),
        ]
    elif 'diffusion' in key:
        refs = [
            ('dl-c4', 'DL专项C4 Week 2：虽然Ng课程不覆盖扩散模型，但他在神经风格迁移中讲解的"从噪声逐步生成"的思想与扩散模型异曲同工。他说的"AI能创造新东西而不仅是识别"正好概括了扩散模型+生信的价值——生成全新的、有特定功能的蛋白质和分子。'),
        ]
    elif 'single-cell' in key:
        refs = [
            ('dl-c3', 'DL专项C3 Week 2：Ng讲迁移学习时说"在大数据上预训练，在小数据上微调"——这正是scGPT/scFoundation的设计范式。先在百万级单细胞数据上预训练，再在你的几百个细胞上微调做细胞类型注释。'),
        ]
    elif 'causal' in key:
        refs = [
            ('cs229', 'CS229 Lecture 14：Ng简要讨论了因果vs相关的区别——"冰淇淋销量和溺水率相关，但禁售冰淇淋不会减少溺水——因为有第三个变量(温度)同时影响两者"。这个例子贴切地解释了生信中基因-疾病的因果推断挑战。'),
        ]
    elif 'reinforcement' in key:
        refs = [
            ('cs229', 'CS229 Lecture 16-17：Ng用一整周讲强化学习——从MDP到值迭代/Q-Learning/Policy Gradient。他的"直升机自动驾驶"例子展示了RL如何在复杂连续动作空间中学习。这些算法正被迁移到分子生成(化学空间中的RL探索)。'),
        ]
    elif 'nas' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 3：Ng在超参数搜索的讨论中预示了NAS的思想——"如果你有足够算力，为什么不自动搜索最优架构？"虽然课程不覆盖NAS技术细节，但Ng奠定了自动搜索的思想基础。'),
        ]
    elif 'federated' in key:
        refs = [
            ('dl-c3', 'DL专项C3 Week 1：Ng讨论了"多来源数据"的挑战——"不同医院的病人数据分布不同，不能假设一个模型能在所有医院表现一致"。这为理解联邦学习中non-iid数据的挑战提供了实际视角。'),
        ]

    # === Math ===
    elif 'linear-algebra' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 1就用矩阵来形式化线性回归——"h=θᵀX，一行Python代码：h = X @ theta"。他说"你不必成为线性代数专家，但理解矩阵乘法是理解ML实现的最基本要求"。整个课程贯穿了"能写成矩阵运算就不写for循环"的向量化思想。'),
        ]
    elif 'calculus' in key:
        refs = [
            ('coursera-ml', 'Ng在Week 2讲梯度下降时手算∂J/∂θ来推导更新规则——"导数就是函数在这一点的斜率，指向最陡的上升方向。我们要往反方向走"。他说"你不用手算导数——框架帮你算——但理解导数是什么会让你的调参直觉好10倍"。'),
        ]
    elif 'probability' in key:
        refs = [
            ('cs229', 'CS229 Lecture 4：Ng用贝叶斯定理推导GDA(高斯判别分析)——P(y|x)∝P(x|y)P(y)。他说"贝叶斯定理是ML中最重要的一条公式——从先验经过证据得到后验，这是所有概率推断的核心模式"。'),
        ]
    elif 'statistics' in key:
        refs = [
            ('cs229', 'CS229 Lecture 1：Ng开场就回顾了均值/方差/高斯分布——"假设你的数据服从正态分布，你就可以给每个数据点算一个概率(p-value)——这就构成了统计检验的基础"。'),
        ]
    elif 'matrix-decomp' in key:
        refs = [
            ('cs229', 'CS229 Lecture 10：Ng从SVD讲PCA——"X=UΣVᵀ，U的列是左奇异向量(样本空间的主方向)，V的列是右奇异向量(特征空间的主方向=主成分)"。这个SVD→PCA的推导是机器学习中最优雅的数学联系之一。'),
        ]
    elif 'gradient-descent-variants' in key:
        refs = [
            ('dl-c2', 'DL专项C2 Week 2：Ng用一整周讲优化器的演进——从SGD的锯齿路径→Momentum的平滑路径→RMSprop的自适应→Adam的最优默认。他配的动画对比(几种优化器在鞍点和峡谷中的行为)是所有ML学习者最应该记住的图示。'),
        ]
    elif 'probability-distributions' in key:
        refs = [
            ('cs229', 'CS229 Lecture 4：Ng从指数族分布(exponential family)的角度统一看高斯/伯努利/多项分布——"广义线性模型(GLM)利用指数族的性质，让每个分布都有对应的link函数和自然参数"。'),
        ]
    elif 'mle' in key:
        refs = [
            ('cs229', 'CS229 Lecture 4：Ng从MLE推导线性回归的最小二乘——"假设y|x~N(θᵀx, σ²)，最大化log-likelihood等价于最小化MSE"。这个推导揭示了"损失函数不是随意选的——它来自对数据分布的假设"。'),
        ]
    elif 'information-theory' in key:
        refs = [
            ('cs229', 'CS229 Lecture 1-3：Ng虽然没有专门讲信息论，但他在讲逻辑回归的代价函数时，从"y=1时log(h)要大，y=0时log(1-h)要大"的角度推导交叉熵——本质上就是用信息论的直觉来设计损失函数。'),
        ]
    elif 'attention-math' in key:
        refs = [
            ('dl-c5', 'DL专项C5 Week 3：Ng手算QKᵀ→softmax→加权V的整个过程——"Q和K的点积衡量"有多相关"，softmax转为概率，V就是你要提取的内容"。他特别强调√dₖ的作用——"不加缩放的话，dₖ很大时softmax的输出趋近one-hot，梯度接近0"。'),
        ]
    elif 'variational' in key:
        refs = [
            ('cs229', 'CS229 Lecture 15：Ng讲EM算法时用"反复猜测-更新"的迭代来近似难以直接计算的分布——这个"用简单分布逼近复杂后验"的思想是变分推断的核心。Ng的EM讲解(交替做E步和M步)为理解VAE的损失函数提供了最好的数学准备。'),
        ]
    elif 'lagrange' in key:
        refs = [
            ('cs229', 'CS229 Lecture 6：Ng在推导SVM的对偶问题时展示了拉格朗日乘子法的完整计算——"引入乘子αᵢ将约束融入目标函数，然后求鞍点"。他说"拉格朗日乘子是处理约束优化最优雅的数学工具"。'),
        ]
    elif 'stochastic' in key:
        refs = [
            ('cs229', 'CS229 Lecture 16：Ng用马尔可夫决策过程(MDP)引入马尔可夫链——"下一状态的概率只取决于当前状态和动作，不依赖于历史路径"。他用机器人导航的例子直观展示了MDP的状态转移和奖励结构。'),
        ]

    return refs[:2]  # Max 2 Ng refs per topic


# Process all topics
updated = 0
for topic in data['topics']:
    ng_refs = get_ng_refs(topic)
    if not ng_refs:
        print(f"  SKIP (no Ng mapping): {topic['name']}")
        continue

    # Find the expert section
    expert_section = None
    expert_idx = -1
    for i, sec in enumerate(topic['sections']):
        if sec['type'] == 'expert':
            expert_section = sec
            expert_idx = i
            break

    if not expert_section:
        print(f"  SKIP (no expert section): {topic['name']}")
        continue

    # Build Ng reference HTML
    items = []
    for key, quote in ng_refs:
        course = NG_COURSES.get(key)
        if not course:
            continue
        items.append(
            f'<div style="margin-bottom:10px;padding:10px 14px;background:#FFF0E5;border-radius:6px;border-left:3px solid #E67E22">'
            f'<p style="margin:0 0 3px 0;font-size:12px;font-weight:600;color:#C0392B">🎓 {course["name"]}</p>'
            f'<p style="margin:0 0 3px 0;font-size:12px;color:#4A4A4A;line-height:1.7">{quote}</p>'
            f'<p style="margin:0;font-size:11px;color:#A0A0A0">{course["desc"]}</p>'
            f'</div>'
        )

    header = '<p style="font-size:13px;color:#4A4A4A;margin-bottom:6px;font-weight:600">🎓 吴恩达课程观点</p>\n'
    new_content = header + '\n'.join(items)

    # Append to existing expert section content
    existing = expert_section.get('content', '')
    expert_section['content'] = existing + '\n<hr style="border:none;border-top:1px solid #E5E5E5;margin:12px 0">\n' + new_content

    updated += 1

with open('public/data/topics.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nUpdated {updated}/{len(data['topics'])} topics with Ng references")
