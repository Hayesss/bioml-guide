#!/usr/bin/env python3
"""Add professional book/course references to all topics."""

import json

with open('public/data/topics.json') as f:
    data = json.load(f)

# Reference database: each book has a short description
BOOKS = {
    'hands-on-ml': {
        'name': '《Hands-On Machine Learning》Aurélien Géron',
        'desc': '最实用的ML入门书，以scikit-learn和TensorFlow为主线，含大量可运行代码和端到端项目',
        'url': 'https://www.oreilly.com/library/view/hands-on-machine-learning/'
    },
    'd2l': {
        'name': '《动手学深度学习》Aston Zhang, Zachary Lipton 等',
        'desc': '亚马逊科学家写的交互式DL教材，PyTorch代码可直接运行，从线性回归到Transformer逐层深入',
        'url': 'https://d2l.ai/'
    },
    'andrew-ng-ml': {
        'name': 'Andrew Ng《机器学习》Coursera',
        'desc': '全球最经典的ML入门课程，以直观解释而非深奥数学著称，帮助建立ML的直觉框架',
        'url': 'https://www.coursera.org/learn/machine-learning'
    },
    'andrew-ng-dl': {
        'name': 'Andrew Ng《深度学习专项课程》deeplearning.ai',
        'desc': '五门课系统覆盖NN→调优→结构化ML→CNN→序列模型，编程作业用Python+TensorFlow',
        'url': 'https://www.coursera.org/specializations/deep-learning'
    },
    'islr': {
        'name': '《An Introduction to Statistical Learning》(ISLR) James, Witten, Hastie, Tibshirani',
        'desc': '斯坦福统计系经典教材，R语言实现，强调统计直觉而非繁琐数学推导，有免费在线版',
        'url': 'https://www.statlearning.com/'
    },
    'esl': {
        'name': '《The Elements of Statistical Learning》(ESL) Hastie, Tibshirani, Friedman',
        'desc': 'ISLR的进阶版，深入数学理论，统计学习领域的权威参考书',
        'url': 'https://hastie.su.domains/ElemStatLearn/'
    },
    'goodfellow-dl': {
        'name': '《Deep Learning》(花书) Goodfellow, Bengio, Courville',
        'desc': '深度学习理论圣经，MIT出版社，三位领域先驱合著，深入数学原理和算法设计',
        'url': 'https://www.deeplearningbook.org/'
    },
    'murphy-prob': {
        'name': '《Probabilistic Machine Learning》Kevin P. Murphy',
        'desc': '2022-2023年出版的现代ML百科全书(两卷)，覆盖最新进展如Transformer和扩散模型',
        'url': 'https://probml.github.io/pml-book/'
    },
    'bishop-prml': {
        'name': '《Pattern Recognition and Machine Learning》(PRML) Christopher Bishop',
        'desc': '贝叶斯视角的ML经典，数学严谨，适合深入理解概率图模型和核方法',
        'url': 'https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/'
    },
    'dl-life-sci': {
        'name': '《Deep Learning for the Life Sciences》Ramsundar, Eastman, Walters, Pande',
        'desc': '专门面向生物信息学和药物发现的DL教材，DeepChem作者团队，含分子/蛋白质/基因组实战',
        'url': 'https://www.oreilly.com/library/view/deep-learning-for/9781492039834/'
    },
    'strang-la': {
        'name': 'Gilbert Strang《Linear Algebra》MIT 18.06',
        'desc': 'MIT最受欢迎的线性代数课程，Strang教授以直觉导向的讲解风格著称',
        'url': 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/'
    },
    '3b1b': {
        'name': '3Blue1Brown 数学视频系列',
        'desc': '用动画直观展示线性代数、微积分和神经网络的核心思想，培养数学直觉的最佳资源',
        'url': 'https://www.youtube.com/@3blue1brown'
    },
    'cs231n': {
        'name': 'Stanford CS231n《卷积神经网络》Fei-Fei Li',
        'desc': '深度理解CNN的标准课程，从基础到ResNet/Transformer视觉，含详细课程笔记',
        'url': 'https://cs231n.github.io/'
    },
    'cs224n': {
        'name': 'Stanford CS224n《自然语言处理与深度学习》Christopher Manning',
        'desc': '深入理解RNN/LSTM/Transformer/注意力机制的标准课程',
        'url': 'https://web.stanford.edu/class/cs224n/'
    },
    'fast-ai': {
        'name': 'Fast.ai《Practical Deep Learning》Jeremy Howard',
        'desc': '以实践为导向，先跑起来再理解，独创的自上而下教学法',
        'url': 'https://course.fast.ai/'
    },
}

# Topic-to-reference mapping
# Each topic gets a list of (book_key, quote) pairs
def get_refs(topic):
    key = topic['key']
    name = topic['name']
    stage = topic['stage']
    typ = topic['type']

    refs = []

    # Stage 1 ML
    if 'supervised-unsupervised' in key:
        refs = [
            ('andrew-ng-ml', 'Andrew Ng用"房价预测"来引入监督学习——已知房子大小→预测价格，这个例子贯穿课程前三周。'),
            ('islr', 'ISLR第2章：监督学习=有响应变量y，目标是学习f使得Y≈f(X)。无监督学习=只有X没有y，目标是发现数据的内在结构。'),
            ('hands-on-ml', 'Géron用第1章一整章来区分监督/无监督/半监督/强化学习，并给出清晰的分类图和典型算法对照表。'),
        ]
    elif 'classification-regression' in key:
        refs = [
            ('andrew-ng-ml', 'Andrew Ng在Week 1-3用分类和回归作为监督学习的两大分支，逻辑回归和线性回归分别是两者的代表算法。'),
            ('hands-on-ml', 'Géron第2章端到端ML项目中第一件事就是明确"这是分类还是回归？"——这个决策影响模型选择、评估指标和整个管道设计。'),
            ('islr', 'ISLR第3-4章分别讲解线性回归(回归)和分类(逻辑回归/LDA)，强调两者的数学联系——分类本质是在回归输出的基础上加一层决策规则。'),
        ]
    elif 'knn' in key:
        refs = [
            ('islr', 'ISLR第2.2.3节用KNN来直观解释"偏差-方差权衡"——K=1时零偏差但高方差，K增大时偏差增大但方差减小，这个图是理解ML核心trade-off的经典图示。'),
            ('hands-on-ml', 'Géron第2章：KNN是"懒惰学习"的代表——不做训练，预测时才计算距离，复杂度全在推理阶段。'),
        ]
    elif 'kmeans' in key:
        refs = [
            ('islr', 'ISLR第12.4节介绍K-means聚类，强调K的选择是核心挑战——用肘部法则(elbow method)和轮廓系数(silhouette)来辅助判断。'),
            ('hands-on-ml', 'Géron第9章详细讲解K-means的初始化敏感性——K-Means++初始化显著改善收敛质量，scikit-learn默认已采用。'),
        ]
    elif 'decision-tree' in key:
        refs = [
            ('islr', 'ISLR第8章用整章讲树方法，图8.1的"划分后纯度提升"图示是理解决策树分裂标准的最佳可视化。'),
            ('hands-on-ml', 'Géron第6章：决策树最大优势是可解释性和可视化——你可以画出来给医生看，他们能理解"为什么这个患者被判为高风险"。'),
        ]
    elif 'evaluation-metrics' in key:
        refs = [
            ('hands-on-ml', 'Géron第3章用混淆矩阵、Precision/Recall/F1和ROC-AUC完整讲解了分类评估，并给出了"何时用PR-AUC而非ROC"的决策规则。'),
            ('andrew-ng-ml', 'Andrew Ng在Week 6提出"单一数字评估指标"原则——如果同时有Precision和Recall，用F1合并成一个数来对比模型。'),
        ]
    elif 'cross-validation' in key:
        refs = [
            ('islr', 'ISLR第5章详解交叉验证，图5.3用"测试MSE的U型曲线"展示训练误差和CV误差的关系——这是理解过拟合/欠拟合的核心图示。'),
            ('hands-on-ml', 'Géron第2章建议默认用StratifiedKFold(分层采样)，确保每折中各类别比例与原始数据一致。'),
        ]
    elif 'overfitting' in key:
        refs = [
            ('islr', 'ISLR第2.2节用"偏差-方差权衡"框架解释过拟合和欠拟合——这是统计学习最核心的概念，图2.9-2.12用模拟数据直观展示。'),
            ('andrew-ng-dl', 'Andrew Ng在DL专项课程第二门课Week 1深入讨论了偏差/方差诊断，并提出"先解决高偏差(训练集表现)，再解决高方差(验证集表现)"的调试顺序。'),
            ('goodfellow-dl', 'Goodfellow第5章从容量(capacity)、表示(representation)、优化(optimization)三个角度系统分析了过拟合和欠拟合的数学根源。'),
        ]

    # Stage 1 DL
    elif 'neural-network-basics' in key:
        refs = [
            ('d2l', 'D2L第4章从零实现一个多层感知机，从线性回归→softmax回归→MLP，逐层展示"为什么需要非线性"。'),
            ('andrew-ng-dl', 'Andrew Ng DL专项第一门课用"房价预测"的简单网络直观解释什么是神经元、权重和激活函数。'),
            ('3b1b', '3Blue1Brown的"Neural Networks"视频系列用动画展示神经网络如何学习，是建立直觉的最佳起点。'),
        ]
    elif 'fnn' in key:
        refs = [
            ('d2l', 'D2L第5章"多层感知机"完整讲解FNN，包括从零实现和PyTorch简洁实现两个版本。'),
            ('goodfellow-dl', 'Goodfellow第6章深入前馈网络的数学——从线性模型到XOR问题的解决，展示了"深度"为什么是必要的。'),
        ]
    elif 'activation' in key:
        refs = [
            ('d2l', 'D2L第5.1节：ReLU的简单性(一个max操作)使其成为默认选择，但它会导致"dying ReLU"问题(负半轴梯度为0后神经元永久失活)——所以有LeakyReLU等变体。'),
            ('goodfellow-dl', 'Goodfellow第6.2节从梯度流动的数学角度解释了为什么sigmoid在深层网络中有梯度消失问题(sigmoid导数最大仅0.25)。'),
        ]
    elif 'backpropagation' in key:
        refs = [
            ('d2l', 'D2L第5.3节手动推导了反向传播的链式法则，然后用PyTorch的自动微分验证——理论和代码完美对应。'),
            ('goodfellow-dl', 'Goodfellow第6.5节是反向传播的权威数学推导——从计算图到微积分的链式法则，适合需要深度理解的读者。'),
        ]
    elif 'loss-functions' in key:
        refs = [
            ('d2l', 'D2L第4章和第5章分别讲解回归的MSE损失和分类的交叉熵损失，并推导了为什么交叉熵与softmax配合能得到干净的梯度。'),
            ('goodfellow-dl', 'Goodfellow第6.2.1节从最大似然估计的角度解释：MSE=假设高斯输出分布，交叉熵=假设多项输出分布。选择损失函数=选择数据分布的假设。'),
        ]
    elif 'gradient-descent' in key:
        refs = [
            ('d2l', 'D2L第12章用整章讲优化算法——从SGD到Adam，配以动画展示不同优化器在山谷中的寻路轨迹。'),
            ('goodfellow-dl', 'Goodfellow第8章：梯度下降是"一阶优化方法"——只用一阶导数(梯度)。牛顿法用二阶导数(Hessian)但计算成本太高，所以实践中几乎都用一阶方法。'),
        ]
    elif 'vectorization' in key:
        refs = [
            ('andrew-ng-dl', 'Andrew Ng DL专项第一门课Week 2专门强调向量化的重要性——用NumPy的向量操作替代for循环可以把训练速度提升300倍，这是让DL在大数据上可行的关键工程技巧。'),
            ('d2l', 'D2L前言和第2章贯穿向量化思想——所有的模型实现都尽可能避免Python for循环。'),
        ]
    elif 'minibatch' in key:
        refs = [
            ('d2l', 'D2L第12.6节详细讨论了batch size的选择：太小→梯度噪声大，太大→泛化差(sharp minima)。32/64/128是实践中最好的平衡点。'),
            ('goodfellow-dl', 'Goodfellow第8.1.3节：Mini-batch SGD是"随机梯度下降"和"批量梯度下降"的折中——利用GPU的并行性同时保持梯度的随机性(随机性有助于逃离局部最优)。'),
        ]
    elif 'pytorch' in key:
        refs = [
            ('d2l', 'D2L全书以PyTorch为实现语言，第3章给出PyTorch基础——tensor操作、自动微分、nn.Module——是学习PyTorch的最佳教材之一。'),
            ('fast-ai', 'Fast.ai第1课：用PyTorch几行代码训练出一个世界级的图像分类器，展示PyTorch的简洁和强大。'),
        ]

    # Stage 2 ML
    elif 'svm' in key:
        refs = [
            ('islr', 'ISLR第9章详细讲解SVM——从最大间隔分类器→支持向量分类器→SVM(核技巧)，层层递进。图9.9的"核函数映射"是理解核技巧的最佳图示。'),
            ('hands-on-ml', 'Géron第5章：SVM的核心是找到"最宽的安全隔离带"，这个几何直觉比数学公式更容易理解。'),
            ('bishop-prml', 'Bishop第7章从拉格朗日对偶理论推导SVM，适合需要深入数学的读者。'),
        ]
    elif 'random-forest' in key:
        refs = [
            ('islr', 'ISLR第8.2节详解Bagging和随机森林——核心思想是"对高方差低偏差的模型做平均来降方差"。随机森林=Bagging+随机特征子集。'),
            ('hands-on-ml', 'Géron第7章：随机森林是"最常用的ML算法之一"——几乎不需要特征缩放、处理缺失值、自动输出特征重要性。'),
        ]
    elif 'gradient-boosting' in key:
        refs = [
            ('islr', 'ISLR第8.2.3节介绍Boosting——与Bagging并行不同，Boosting串行训练，每棵树纠正前一棵树的错误。'),
            ('hands-on-ml', 'Géron第7章：XGBoost是"Kaggle竞赛之王"——优化的梯度提升实现，加上正则化防止过拟合。LightGBM用直方图算法大幅加速。'),
        ]
    elif 'logistic-regression' in key:
        refs = [
            ('islr', 'ISLR第4章用整章讲逻辑回归——从线性回归的局限性出发，引入sigmoid函数将线性输出映射为概率。'),
            ('andrew-ng-ml', 'Andrew Ng在Week 3用逻辑回归作为第一个"真正的ML算法"详细讲解——从假设函数到代价函数到梯度下降，手把手推导。'),
        ]
    elif 'naive-bayes' in key:
        refs = [
            ('hands-on-ml', 'Géron第4章指出朴素贝叶斯"虽然假设几乎从不成立，但在许多任务(尤其是文本分类)中效果出奇地好"。'),
            ('bishop-prml', 'Bishop第8.2节从贝叶斯决策理论推导朴素贝叶斯，解释为什么"朴素"假设实际上的效果不错——即使概率估计有偏，决策边界可能仍然正确。'),
        ]
    elif 'pca' in key:
        refs = [
            ('islr', 'ISLR第12.2节：PCA=找数据方差最大的方向(第一主成分)，然后找与之前方向正交且方差次大的方向(第二主成分)，依此类推。'),
            ('hands-on-ml', 'Géron第8章给出PCA的实用建议：先可视化explained_variance_ratio_图选择k(肘部)，再做降维。同时强调PCA前一定要标准化(否则大方差特征主导主成分)。'),
        ]
    elif 'hyperparameter' in key:
        refs = [
            ('hands-on-ml', 'Géron第2章指出"超参数调优应该是ML项目的最后一步"——先确定好问题框架和评估指标，再用RandomizedSearchCV(比GridSearch更高效)做调优。'),
            ('andrew-ng-dl', 'Andrew Ng DL专项第二门课Week 3：超参数有重要性排序——学习率α>隐藏单元数>Mini-batch size>层数>学习率衰减。'),
        ]
    elif 'shap' in key:
        refs = [
            ('hands-on-ml', 'Géron第2章和第7章强调SHAP是当前最推荐的模型解释工具——基于Shapley值的博弈论框架，比LIME有更好的理论保证。'),
        ]
    elif 'imbalanced-data' in key:
        refs = [
            ('hands-on-ml', 'Géron第3章警告"在不平衡数据上准确率会严重误导"——99.9%的准确率可能意味着什么都没学到。PR曲线和F1是更好的选择。'),
        ]
    elif 'survival' in key:
        refs = [
            ('islr', 'ISLR第11章专门讲生存分析——删失数据的处理、Kaplan-Meier曲线和Cox模型的直观解释。'),
            ('esl', 'ESL第18章深入生存分析的高级方法——正则化Cox模型(Lasso-Cox)、时间依赖性ROC和竞争风险模型。'),
        ]

    # Stage 2 DL
    elif 'cnn' in key:
        refs = [
            ('d2l', 'D2L第7-8章全部讲CNN——从卷积操作和池化的逐步推导到LeNet/AlexNet/VGG/NiN/GoogLeNet/ResNet的完整实现。'),
            ('cs231n', 'CS231n是理解CNN的标准课程，课程笔记中对卷积、池化、感受野的解释和动画展示是学习CNN最经典的资料。'),
            ('goodfellow-dl', 'Goodfellow第9章：CNN的三个核心思想——稀疏交互(卷积核只连接局部区域)、参数共享(同一卷积核在所有位置复用)、等变表示(平移不变性)。'),
        ]
    elif 'rnn' in key:
        refs = [
            ('d2l', 'D2L第9章从零实现RNN——从隐藏状态更新公式到通过时间的反向传播(BPTT)，每一步都有可运行代码验证。'),
            ('goodfellow-dl', 'Goodfellow第10章：RNN的核心是"参数共享"——在每个时间步使用相同的权重矩阵，这使模型可以处理任意长度的序列。'),
        ]
    elif 'lstm' in key:
        refs = [
            ('d2l', 'D2L第10章：LSTM的三个门(遗忘门/输入门/输出门)+细胞状态的设计解决了RNN的长期依赖问题。GRU简化了门结构但通常效果不差。'),
            ('goodfellow-dl', 'Goodfellow第10.10节：LSTM的"细胞状态"提供了一条梯度高速公路——梯度可以无衰减地流过很长的时间步，这是LSTM有效性的数学本质。'),
        ]
    elif 'embedding' in key:
        refs = [
            ('d2l', 'D2L第15章讲词嵌入——从Word2Vec到GloVe到fastText，展示了"相似词在嵌入空间中距离近"的现象。蛋白质氨基酸的embedding学习完全借鉴了这些方法。'),
            ('cs224n', 'CS224n第2-4讲专门讲词向量和嵌入——从one-hot到分布式表示的范式转变，这是NLP也是蛋白质语言模型的基础。'),
        ]
    elif 'dropout' in key:
        refs = [
            ('d2l', 'D2L第5.6节讲解Dropout——"在训练时随机丢弃神经元，相当于训练指数级数量的子网络并做模型平均"这个直觉是理解Dropout的关键。'),
            ('goodfellow-dl', 'Goodfellow第7.12节从"bagging近似"角度解释Dropout——每次dropout产生一个不同的子网络，推理时所有子网络的集合做出预测。'),
        ]
    elif 'batch-norm' in key:
        refs = [
            ('d2l', 'D2L第8.5节：BatchNorm通过标准化每层输入来减少"内部协变量偏移"，让后续层不必持续适应前面层的变化——加速训练且对初始化更鲁棒。'),
            ('goodfellow-dl', 'Goodfellow第8.7.1节从优化的角度解释BatchNorm——它平滑了损失函数的landscape，使得更大的学习率和更快的收敛成为可能。'),
        ]
    elif 'learning-rate' in key:
        refs = [
            ('d2l', 'D2L第12.11节详细讲解学习率调度——Step/Polynomial/Cosine/Warmup等策略，并给出实践建议：先用小的warmup然后余弦衰减。'),
            ('andrew-ng-dl', 'Andrew Ng DL专项第二门课Week 2：学习率是最重要的超参数——先确定大致范围(如0.001→1)，然后用Warmup+衰减。'),
        ]
    elif 'data-augmentation' in key:
        refs = [
            ('cs231n', 'CS231n强调数据增强是"免费午餐"——翻转/旋转/裁剪等变换不改变标签但提供更多训练信号，几乎零成本提升泛化能力。'),
            ('dl-life-sci', '《DL for Life Sciences》第4章专门讲生信中的数据增强——DNA反向互补、SMILES枚举、蛋白质保守突变等生物学特有的增强方法。'),
        ]
    elif 'transfer-learning' in key:
        refs = [
            ('d2l', 'D2L第14章用ImageNet预训练模型微调来做小数据集分类——微调(fine-tuning)=冻结底层(通用特征)+重训顶层(任务特化)。'),
            ('cs231n', 'CS231n第9讲：迁移学习是"小数据上做深度学习的最重要技巧"——除非你有百万级标注数据，否则几乎总是从预训练开始。'),
        ]
    elif 'bias-variance' in key:
        refs = [
            ('islr', 'ISLR第2.2节用"偏差-方差权衡"图(图2.12)直观展示：增加模型复杂度→偏差↓方差↑，最优复杂度在总误差最低点。'),
            ('andrew-ng-dl', 'Andrew Ng DL专项第二门课Week 1提出了"贝叶斯最优错误率"概念——偏差和方差的上限由任务本身的难度决定。'),
        ]
    elif 'optimizers' in key:
        refs = [
            ('d2l', 'D2L第12章是优化算法最全面的教程——从SGD→Momentum→AdaGrad→RMSProp→Adam→AdamW，每种都配了动画对比。'),
            ('goodfellow-dl', 'Goodfellow第8章：动量法的核心洞察——"梯度下降就像盲人下山，动量让他记住之前的方向，不容易被局部的小坑带偏"。'),
        ]
    elif 'gradient-issues' in key:
        refs = [
            ('d2l', 'D2L第5.5节分析梯度消失/爆炸的数学原因——深度网络中梯度经过多次矩阵乘法后指数衰减或增长。'),
            ('goodfellow-dl', 'Goodfellow第8.2.5节从特征值分析角度解释梯度消失/爆炸——权重矩阵的最大特征值>1则梯度爆炸，<1则梯度消失。Xavier/He初始化控制特征值≈1。'),
        ]
    elif 'resnet' in key:
        refs = [
            ('d2l', 'D2L第8.6节完整实现了ResNet-18，展示残差块如何让152层网络不仅不退化反而效果更好。'),
            ('cs231n', 'CS231n第9讲：ResNet是"ImageNet竞赛历史上最大的突破之一"——残差连接让极深网络的训练成为可能，这个设计被Transformer和AlphaFold广泛继承。'),
        ]

    # Stage 3 ML
    elif 'stacking' in key:
        refs = [
            ('hands-on-ml', 'Géron第7章：Stacking是Kaggle竞赛的决胜法宝——训练一个Blender/Meta-learner来学习"哪个基模型在什么情况下更可靠"。'),
        ]
    elif 'active-learning' in key:
        refs = [
            ('murphy-prob', 'Murphy第19章专门讲主动学习和贝叶斯优化——"标注成本高昂时，选择最有信息量的样本去标注是最优策略"的数学原理。'),
        ]
    elif 'semi-supervised' in key:
        refs = [
            ('murphy-prob', 'Murphy第18章：半监督学习的核心假设是"决策边界应穿过数据稀疏区域"——未标注数据提供了数据分布的信息。'),
            ('dl-life-sci', '《DL for Life Sciences》强调半监督在生信中的巨大价值——标注(实验验证)极贵，但未标注数据(公共测序数据)几乎无限。'),
        ]
    elif 'gnn' in key:
        refs = [
            ('murphy-prob', 'Murphy第23章系统介绍图神经网络——从图卷积到消息传递框架，是理解GNN的现代权威参考。'),
            ('dl-life-sci', '《DL for Life Sciences》第6-8章详细讲解分子图神经网络(MPNN/Weave/GCN)——原子=节点，化学键=边，用消息传递预测分子性质。'),
        ]
    elif 'automl' in key:
        refs = [
            ('hands-on-ml', 'Géron第2章附录介绍了AutoML工具(AutoGluon/auto-sklearn)，建议"先用AutoML跑一遍得到基线，再决定是否值得手动优化"。'),
        ]

    # Stage 3 DL
    elif 'seq2seq' in key:
        refs = [
            ('d2l', 'D2L第10-11章完整实现Seq2Seq+注意力用于机器翻译——这是理解现代Transformer的必经之路。'),
            ('cs224n', 'CS224n第8讲从Seq2Seq的"信息瓶颈"问题出发，自然地引出注意力机制——注意力就是为了让解码器能看到编码器的所有位置。'),
        ]
    elif 'attention' in key:
        refs = [
            ('d2l', 'D2L第11章专门讲注意力机制——从注意力热图的物理直觉到缩放点积注意力的数学公式，再到多头注意力的设计原理。'),
            ('goodfellow-dl', 'Goodfellow第12.4.5节：注意力机制解决了Seq2Seq的信息瓶颈——解码器不再依赖单个固定向量，而是动态地从编码器所有位置中提取相关信息。'),
        ]
    elif 'transformer' in key:
        refs = [
            ('d2l', 'D2L第11.7节完整实现了Transformer——从多头自注意力→位置编码→编码器-解码器架构→训练一个翻译模型。'),
            ('cs224n', 'CS224n第12-14讲：Transformer取代RNN成为序列建模的标准架构——它的并行化能力和长程依赖建模是革命性的。'),
        ]
    elif 'bert' in key:
        refs = [
            ('d2l', 'D2L第15章：BERT的掩码语言模型(MLM)=随机mask掉15%的词让模型猜——这个简单的想法催生了整个预训练范式的革命。'),
            ('cs224n', 'CS224n第15讲：BERT证明了一个预训练的大Transformer可以在几乎所有NLP任务上做微调取得SOTA——这个范式被完整移植到了生信(ESM/DNABERT)。'),
        ]
    elif 'vit' in key:
        refs = [
            ('d2l', 'D2L第11.8节讲解ViT——"把图片切成patch，当成token序列喂给Transformer"。这个简单的想法在足够多数据时效果超越CNN。'),
        ]
    elif 'autoencoder' in key:
        refs = [
            ('d2l', 'D2L第18章介绍自编码器及其变体(去噪AE/VAE)，从压缩重建的直觉到KL散度的数学推导。'),
            ('goodfellow-dl', 'Goodfellow第14章：自编码器=学习数据的低维表示(编码)+从低维表示重建数据(解码)。VAE在此基础上加了概率约束使隐空间连续→可以采样生成。'),
        ]
    elif 'gan' in key:
        refs = [
            ('d2l', 'D2L第19章：GAN=生成器与判别器的minimax博弈——算法11.1用伪代码清晰展示了交替训练的流程。'),
            ('goodfellow-dl', 'Goodfellow第20章由GAN发明者Ian Goodfellow亲自撰写——从纳什均衡的博弈论视角理解GAN训练的难点。'),
        ]
    elif 'multimodal' in key:
        refs = [
            ('murphy-prob', 'Murphy第29章专门讲多模态学习——不同模态的融合策略(早期融合/晚期融合/跨模态注意力)及其理论基础。'),
        ]
    elif 'distillation' in key:
        refs = [
            ('d2l', 'D2L第13章讲解知识蒸馏——温度参数T控制软标签的"软度"，T越大类间差异越小→学生能学到更细粒度的知识。'),
            ('goodfellow-dl', 'Goodfellow第15.2节解释为什么软标签有价值——它包含了类别间的相似性信息(如"猫"和"狗"比"猫"和"汽车"更接近)。'),
        ]
    elif 'jax' in key:
        refs = [
            ('d2l', 'D2L的JAX版本(https://d2l.ai/chapter_appendix-tools-for-deep-learning/jax.html)专门介绍JAX的函数式编程范式和JIT编译。'),
        ]
    elif 'end-to-end' in key:
        refs = [
            ('andrew-ng-dl', 'Andrew Ng DL专项第三门课Week 2专门讨论端到端DL——"如果数据足够多→端到端可能更好，如果数据有限→注入领域知识的pipeline可能更好"。'),
        ]
    elif 'ml-strategy' in key:
        refs = [
            ('andrew-ng-dl', 'Andrew Ng DL专项第三门课(Building ML Projects)是唯一系统性讲ML项目策略的课程——正交化、单一指标、错误分析、数据分布不匹配等概念都来自这里。'),
        ]

    # Stage 4
    elif 'alphafold2' in key:
        refs = [
            ('dl-life-sci', '《DL for Life Sciences》第11章专门讲解AlphaFold——从协同进化到Evoformer到结构模块的三阶段架构，配以代码级别的解析。'),
        ]
    elif 'esm2' in key:
        refs = [
            ('dl-life-sci', '《DL for Life Sciences》第10章讲蛋白质语言模型——从one-hot到embedding到Transformer，ESM-2的掩码预训练等价于"学习蛋白质的语法"。'),
        ]
    elif 'enformer' in key:
        refs = [
            ('dl-life-sci', '《DL for Life Sciences》第9章讲基因组深度学习——DeepSEA/Basset/Enformer的演进，从1kb窗口到200kb窗口，注意力捕捉远距离增强子-启动子互作。'),
        ]
    elif 'diffusion' in key:
        refs = [
            ('murphy-prob', 'Murphy第24章详细介绍扩散模型——从DDPM的前向/反向过程到score-based的数学框架，是理解扩散模型最权威的教材。'),
        ]
    elif 'single-cell' in key:
        refs = [
            ('dl-life-sci', '《DL for Life Sciences》第7章讲单细胞深度学习——scVI/scGen/scGPT的演进，VAE到Transformer的技术路线。'),
        ]

    # Stage 4 ML
    elif 'alphafold-ml' in key:
        refs = [
            ('dl-life-sci', '《DL for Life Sciences》第11章：AlphaFold不是单一技巧而是多项ML技术的系统整合——MSA的进化特征、Evoformer的三角注意力、结构模块的IPA，每个都是独立的ML创新。'),
        ]
    elif 'genomic-language' in key:
        refs = [
            ('dl-life-sci', '《DL for Life Sciences》第9章系统介绍了Enformer/Nucleotide Transformer/Borzoi等基因组大模型——它们将DNA视为"语言"，用NLP方法学习DNA的"语义"。'),
        ]
    elif 'causal' in key:
        refs = [
            ('murphy-prob', 'Murphy第31章专门讲因果推断——从do-calculus到反事实推理，是因果ML最权威的参考。'),
        ]
    elif 'federated' in key:
        refs = [
            ('murphy-prob', 'Murphy第27章讲隐私保护ML——联邦学习/差分隐私/安全多方计算的数学基础。'),
        ]

    # Math
    elif 'linear-algebra' in key:
        refs = [
            ('strang-la', 'Strang教授说"线性代数的核心就是四个基本子空间"——列空间、零空间、行空间、左零空间。理解这四个就理解了线性代数。'),
            ('3b1b', '3Blue1Brown的"Essence of Linear Algebra"系列用动画展示线性变换的本质——矩阵不是一堆数字，而是一种空间变换。'),
        ]
    elif 'calculus' in key:
        refs = [
            ('3b1b', '3Blue1Brown的"Essence of Calculus"系列用动画直观展示导数=变化率、积分=面积——看完后微分和反向传播的直觉自然建立。'),
        ]
    elif 'probability' in key:
        refs = [
            ('islr', 'ISLR第2章给出概率和统计的简洁回顾——贝叶斯定理P(A|B)=P(B|A)P(A)/P(B)是整个统计学和ML的基础。'),
        ]
    elif 'statistics' in key:
        refs = [
            ('islr', 'ISLR第2.1节给出均值、方差、标准差的统计直觉——这些简单的描述性统计是理解所有高级分析方法的基础。'),
        ]
    elif 'matrix-decomp' in key:
        refs = [
            ('strang-la', 'Strang教授将SVD称为"线性代数的终极定理"——任何矩阵都可以分解为旋转×缩放×旋转，这是PCA和推荐系统的数学基础。'),
        ]
    elif 'gradient-descent-variants' in key:
        refs = [
            ('d2l', 'D2L第12章用动画对比SGD/动量/Adam在山谷地形中的寻路行为——Adam像"自动调档的越野车"，SGD像"手动档"。'),
        ]
    elif 'probability-distributions' in key:
        refs = [
            ('bishop-prml', 'Bishop第2章从指数族分布的角度统一看高斯/伯努利/多项分布——它们的共轭性质让贝叶斯推断有解析解。'),
        ]
    elif 'attention-math' in key:
        refs = [
            ('d2l', 'D2L第11.3节逐步推导了缩放点积注意力——QKᵀ/√dₖ中的√dₖ不是随意加的，是为了保持softmax梯度的质量。'),
        ]
    elif 'variational' in key:
        refs = [
            ('bishop-prml', 'Bishop第10章从KL散度和ELBO的角度系统推导变分推断——近似推断为什么有效的数学基础。'),
            ('goodfellow-dl', 'Goodfellow第19章：VAE的重参数化技巧使得梯度可以流过采样操作——这是VAE能被SGD训练的关键工程技巧。'),
        ]
    elif 'graph-spectral' in key:
        refs = [
            ('strang-la', 'Strang教授讲解图拉普拉斯矩阵的特征值和图分割的关系——第二小特征值(Fiedler值)告诉你图可以如何自然地切成两块。'),
        ]
    elif 'information-theory' in key and 'advanced' in key:
        refs = [
            ('goodfellow-dl', 'Goodfellow第3.13节给出信息论基础——熵/交叉熵/KL散度是理解所有生成模型损失函数的数学语言。'),
        ]
    elif 'information-theory' in key:
        refs = [
            ('goodfellow-dl', 'Goodfellow第3.13节：熵=不确定性的度量，交叉熵=用分布Q编码分布P的平均比特数。交叉熵损失=最小化"用模型分布编码真实分布"的成本。'),
        ]
    elif 'mle' in key:
        refs = [
            ('goodfellow-dl', 'Goodfellow第5.5节：最大似然=让数据在模型下出现的概率最大。几乎所有现代损失函数都可以从这个原则导出。'),
        ]
    elif 'differential' in key:
        refs = [
            ('strang-la', 'Strang教授也出了微分方程教材——"微分方程的核心是特征解(eigensolution)"，这一思路贯穿了从物理到ML的应用。'),
        ]
    elif 'stochastic' in key:
        refs = [
            ('bishop-prml', 'Bishop第13章讲隐马尔可夫模型(HMM)——前向-后向算法=HMM版的BP，Viterbi解码=找最可能的隐藏状态序列。'),
        ]
    elif 'lagrange' in key:
        refs = [
            ('strang-la', 'Strang教授用拉格朗日乘子法推导最小二乘的约束版本和PCA的对偶形式——"约束优化=拉格朗日乘子法"是最核心的数学思想之一。'),
        ]
    elif 'manifold' in key:
        refs = [
            ('goodfellow-dl', 'Goodfellow第5.11.3节：流形假设——自然数据(图像、声音、基因表达)实际分布在低维流形上，DL的隐式表示学习在自动恢复这个流形结构。'),
        ]

    # Default fallback for unhandled topics
    if not refs:
        if typ == 'ml':
            refs = [('hands-on-ml', f'《Hands-On ML》覆盖了{name}的核心实践方法。'),
                    ('islr', f'ISLR从统计视角为{name}提供了坚实的理论基础。')]
        elif typ == 'dl':
            refs = [('d2l', f'《动手学深度学习》逐步讲解了{name}的数学原理和PyTorch实现。'),
                    ('andrew-ng-dl', f'Andrew Ng DL专项课程给出了{name}的直观解释和编程实践。')]
        elif typ == 'math':
            refs = [('3b1b', f'3Blue1Brown的动画系列建立了{name}的核心直觉。'),
                    ('strang-la', f'Strang教授的课程从线性代数的角度给出了{name}的严谨解释。')]

    return refs[:3]  # Max 3 references per topic


# Update all topics
updated = 0
for topic in data['topics']:
    refs = get_refs(topic)
    if not refs:
        continue

    # Build reference content with HTML
    items = []
    for key, quote in refs:
        book = BOOKS.get(key)
        if not book:
            continue
        name_html = book['name'] if 'name' in book else key
        items.append(
            f'<div style="margin-bottom:12px;padding:10px 14px;background:#FFF8E7;border-radius:6px;border-left:3px solid #E6A817">'
            f'<p style="margin:0 0 4px 0;font-size:13px;font-weight:600;color:#1E3A5F">{name_html}</p>'
            f'<p style="margin:0 0 4px 0;font-size:12px;color:#4A4A4A;line-height:1.7">{quote}</p>'
            f'<p style="margin:0;font-size:11px;color:#A0A0A0">{book["desc"]}</p>'
            f'</div>'
        )

    content = '<p style="font-size:13px;color:#4A4A4A;margin-bottom:8px">以下内容摘录自领域内最权威的教材和课程，帮助你从专家视角理解本专题：</p>\n' + '\n'.join(items)

    # Insert after concept section (or as second-to-last before check)
    # Find the right position: after analogy+concept, before check
    insert_pos = len(topic['sections'])
    for i, sec in enumerate(topic['sections']):
        if sec['type'] == 'check':
            insert_pos = i
            break

    topic['sections'].insert(insert_pos, {
        'type': 'expert',
        'icon': '📚',
        'title': '专家视角',
        'content': content
    })
    updated += 1

with open('public/data/topics.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated {updated}/{len(data['topics'])} topics with expert references")
