import QuizBase from './QuizBase';
import type { QuizQuestion } from './QuizBase';

const questions: QuizQuestion[] = [
  {
    q: 'CUT&Tag 的核心实验信号来自什么？',
    options: ['抗体靶向 pA-Tn5 在目标附近插入接头形成的片段', 'RNA poly(A) 捕获', '蛋白质质谱峰', '16S V区扩增'],
    answer: 0,
    explanation: 'CUT&Tag 通过抗体把 pA-Tn5 tether 到目标 chromatin protein 附近，产生可测序片段；分析对象是 genomic regions、fragments、peaks 和 signal tracks。',
  },
  {
    q: 'CUT&Tag 中 FastQC 的 per-base sequence content 失败应如何处理？',
    options: ['立即丢弃样本', '结合 Tn5 preference、adapter、alignment rate 等指标综合判断', '一定要改用 RNA-seq 流程', '只看 Q30 即可'],
    answer: 1,
    explanation: 'CUT&Tag read 开头碱基组成偏差可能是 Tn5 特性，不能单独判失败，需要结合下游比对率、片段分布和富集指标。',
  },
  {
    q: 'SEACR peak calling 的典型输入是什么？',
    options: ['paired-end fragment bedGraph', 'raw FASTQ', 'gene TPM matrix', 'protein FASTA'],
    answer: 0,
    explanation: 'SEACR 设计为使用 paired-end fragment coverage 的 bedGraph 进行低背景 peak/enriched region calling。',
  },
  {
    q: '差异 peak 分析中 DESeq2 应输入什么？',
    options: ['BigWig signal', '每个 peak/region 的 raw fragment counts', 'IGV 截图', 'FastQC zip'],
    answer: 1,
    explanation: 'DESeq2 对 count data 建模，输入应是 master peak x sample 的未标准化 fragment counts，而不是浏览器轨道。',
  },
  {
    q: '多组学整合中最容易造成错误解释的问题是？',
    options: ['统一 sample_metadata 和 genome_build', '混用 hg19/hg38 或 gene ID 版本', '保存 BigWig', '使用 MultiQC'],
    answer: 1,
    explanation: 'peak-to-gene、region matrix 和表达矩阵连接必须使用一致的 genome build 和 gene annotation，否则会把区域连到错误基因。',
  },
  {
    q: '在生物信息学中，用随机森林预测SNP致病性时，哪个指标最适合评估模型在严重不平衡数据上的性能？',
    options: ['准确率 (Accuracy)', 'ROC-AUC', '精确率-召回率曲线下面积 (PR-AUC)', 'F1分数'],
    answer: 2,
    explanation: '致病SNP通常是稀有变异（1%以下），数据严重不平衡。PR-AUC对不平衡数据更敏感，而ROC-AUC在此情况下可能给出过于乐观的估计。',
  },
  {
    q: '使用PyTorch训练蛋白质序列分类模型时，以下哪个不是反向传播的必要步骤？',
    options: ['optimizer.zero_grad()', 'loss.backward()', 'optimizer.step()', 'model.eval()'],
    answer: 3,
    explanation: 'model.eval() 用于切换到评估模式（关闭Dropout/BatchNorm训练行为），不是反向传播步骤。zero_grad→backward→step 是标准的三步训练循环。',
  },
  {
    q: '以下哪种方法最适合处理单细胞RNA-seq数据中不同实验批次的系统偏差？',
    options: ['PCA降维', 'scVI的latent space批次校正', 'Log-normalization', 'Leiden聚类'],
    answer: 1,
    explanation: 'scVI通过深度生成模型将批次信息作为条件变量，在隐空间中分离生物变异和技术批次效应。PCA和归一化无法消除批次效应，聚类是下游分析步骤。',
  },
  {
    q: 'AlphaFold2之所以能高精度预测蛋白质结构，其核心创新是什么？',
    options: ['使用了更深的CNN', 'Evoformer模块处理MSA和配对表示的协同进化信息', '更大的训练数据集', '更快的GPU计算'],
    answer: 1,
    explanation: 'AlphaFold2的核心是Evoformer模块——它在多序列比对(MSA)和残基配对表示之间迭代传递信息，有效捕捉了共同进化信号。这是其精度突破的关键。',
  },
  {
    q: '在做差异基因表达分析时，为什么需要对p值进行多重检验校正（如Benjamini-Hochberg）？',
    options: ['提高p值的精度', '控制同时检验数万个基因时的假发现率(FDR)', '减小基因表达矩阵的大小', '增加差异基因的数量'],
    answer: 1,
    explanation: '基因组范围的分析同时检验20000+个基因。如果不校正，即使所有基因都不差异表达，也会有约1000个基因p<0.05（纯随机）。BH校正控制FDR≤5%。',
  },
];

export default function Quiz() {
  return <QuizBase questions={questions} variant="full" />;
}
