import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Microscope, ArrowRight, Dna, Layers, FlaskConical, Brain, Zap, ChevronDown } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollReveal(0.12);
  return (
    <div ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

const milestones = [
  { year: '2001', event: '人类基因组计划完成', detail: '首次获得人类全基因组序列，耗资30亿美元，历时13年' },
  { year: '2008', event: '下一代测序(NGS)普及', detail: '测序成本断崖式下降，一个人类基因组从30亿降到1000美元以下' },
  { year: '2012', event: 'AlexNet赢得ImageNet', detail: '深度学习首次在图像识别上大幅超越传统方法，开启了DL革命' },
  { year: '2015', event: 'DeepVariant发布', detail: 'Google用CNN进行变异检测，精度超越传统GATK流程' },
  { year: '2018', event: '单细胞组学爆发', detail: '10x Genomics使单细胞测序成为常规技术，一个实验可测百万细胞' },
  { year: '2021', event: 'AlphaFold2开源', detail: 'DeepMind解决50年蛋白质折叠难题，精度达到实验水平' },
  { year: '2023', event: '生物大模型时代', detail: 'scGPT/GeneFormer/scFoundation等单细胞基础模型涌现。OmicVerse(Nature Communications 2024)统一多组学分析框架发布' },
  { year: '2024', event: 'AlphaFold3 + 诺贝尔化学奖', detail: 'AF3用扩散模型扩展到蛋白-小分子/DNA/RNA复合物。Baker/Hassabis/Jumper获诺贝尔化学奖，标志AI生物学获最高学术认可' },
  { year: '2025', event: '十亿细胞时代', detail: 'CZI Billion Cells Project启动(目标10亿细胞)。10x单次运行400万细胞。单细胞基础模型基准测试揭示当前方法的局限与机遇' },
];

const cases = [
  { title: 'AlphaFold2/3 — 蛋白质结构预测革命', tag: '结构生物学', color: '#1E3A5F', problem: '从氨基酸序列预测蛋白质3D结构是困扰科学界50年的难题。AlphaFold2(2021)解决了单体蛋白预测；AlphaFold3(2024, Nature)用扩散模型扩展到蛋白质-DNA/RNA/小分子复合物。', solution: 'AF2用Evoformer(48层Transformer变体)处理MSA和残基配对表示，CASP14中位误差0.96埃。AF3用Pairformer+扩散架构，蛋白-配体对接成功率76.4%(Vina仅52.3%)。', impact: 'AF2已预测超2亿个蛋白质结构。AF3使Isomorphic Labs与Eli Lilly(17.45亿美元)和Novartis(12.38亿美元)达成AI药物发现合作。2024年诺贝尔化学奖授予AlphaFold开发者。' },
  { title: 'RFdiffusion + ProteinMPNN — 从零设计全新蛋白质', tag: '蛋白质设计', color: '#2D5A3D', problem: '自然界不存在能结合特定靶标的蛋白质怎么办？传统蛋白质工程依赖定向进化和筛选，成功率低、周期长。', solution: 'RFdiffusion(扩散模型)生成全新蛋白质骨架，ProteinMPNN(图神经网络)设计最优氨基酸序列。两步生成→验证→实验测试。2024年Nature报道从头设计了超高亲和力蛋白结合剂。', impact: 'Baker实验室已设计出针对流感病毒、艰难梭菌毒素的全新抗体；RFdiffusion2扩展至酶设计。2024年诺贝尔化学奖共同授予计算蛋白质设计。' },
  { title: 'scGPT/GeneFormer — 单细胞基础模型', tag: '单细胞组学', color: '#5B3A7B', problem: '不同实验室、不同平台、不同物种的单细胞数据如何统一分析？传统方法需要为每个数据集重新训练模型。', solution: 'scGPT(Nature Methods 2024)在3300万细胞上预训练GPT架构；GeneFormer(Nature 2023)在3000万细胞上用MLM目标预训练。零样本完成细胞注释、扰动预测、基因功能推断。', impact: '单细胞基础模型使跨数据集、跨物种分析成为可能。但2025年Nature Methods基准测试诚实指出：在扰动预测任务上，这些大模型尚未超越简单线性基线——领域仍在快速演进中。' },
  { title: 'Enformer — 从DNA序列预测基因表达', tag: '基因组学', color: '#8B4513', problem: '98%的非编码区变异如何影响基因表达？调控元件可在100kb外起作用，传统方法只能看基因附近区域。', solution: 'Enformer用Transformer+卷积处理200kb的DNA序列窗口，多头注意力捕捉远距离增强子-启动子互作，直接从序列预测表达水平。', impact: '使非编码变异功能解读成为可能，输入SNP坐标即可预测附近基因的表达变化，评估致病潜力。' },
  { title: 'ESM-2 — 蛋白质的语言模型', tag: '蛋白质工程', color: '#4A6741', problem: '实验方法评估突变效应费时费钱。一个蛋白质的所有可能单点突变量是序列长度的20倍，无法全部实验验证。', solution: 'ESM-2在6500万条蛋白质序列上做掩码语言模型预训练。零样本(不需要实验数据)预测突变效应——比较野生型和突变型的log-likelihood差异。', impact: '15B参数的ESM-2可以零样本预测约70%的ClinVar致病变异，为蛋白质工程提供了高效的计算筛选工具。' },
  { title: 'scVI — 单细胞数据的深度生成模型', tag: '单细胞组学', color: '#C53030', problem: '单细胞RNA-seq数据高度稀疏(90%以上值为0)、噪声大、批次效应严重。传统归一化方法难以同时处理这些问题。', solution: 'scVI用变分自编码器学习细胞的概率低维表示，将批次信息作为条件变量，隐空间捕获生物变异而非技术噪声。', impact: '已成为单细胞数据分析的核心工具，研究者可整合来自不同实验室、不同平台的数据，发现跨研究的生物学规律。' },
  { title: 'DeepVariant — CNN替代传统变异检测流程', tag: '基因组学', color: '#6B4C8B', problem: '传统变异检测(GATK Best Practices)依赖人工规则和统计模型，参数调优复杂，对不同类型的变异检测精度不一致。', solution: 'DeepVariant将测序读段堆叠转化为RGB图像，用Inception-v3 CNN直接从图像中识别变异位点——端到端学习跳过了传统pipeline的多个中间步骤。', impact: '在多个基准测试中精度超越GATK，被ClinVar和1000 Genomes项目采用，证明CNN可以在核心基因组学任务上超越传统统计流程。' },
  { title: 'DNABERT/Enformer — 基因组序列的Transformer模型', tag: '基因组学', color: '#8B0000', problem: 'DNA调控密码极其复杂——同一个转录因子可结合数千个序列motif变体，传统位置权重矩阵(PWM)无法捕获这种复杂性。', solution: 'DNABERT用BERT架构在人类基因组DNA序列上做MLM预训练，学习启动子、增强子、剪接位点的序列特征。Enformer将感受野扩展到200kb，从序列直接预测基因表达和表观状态。', impact: 'Nature Reviews Genetics(2025)将基因组序列的深度学习模型列为"基因组学的机器学习"核心主题之一。这些模型正在改变我们对非编码变异的解读方式。' },
];

const challenges = [
  { title: '维度灾难 (p >> n)', desc: '20000个基因 vs 100个样本——绝大多数ML算法在特征数远超样本数时会严重过拟合。', color: '#1E3A5F' },
  { title: '极度的异质性', desc: '没有两个肿瘤在分子水平上完全相同。每位患者的癌症都有独特的突变组合和基因表达模式。', color: '#2D5A3D' },
  { title: '噪声与稀疏性', desc: '单细胞RNA-seq数据中90%以上的值为0。区分技术噪声和生物信号本身就是一个未完全解决的问题。', color: '#5B3A7B' },
  { title: '批次效应', desc: '同一份样本在不同日期、不同测序仪上可能得到显著不同的结果。不校正批次效应，模型学到的是实验条件差异而非生物学差异。', color: '#8B4513' },
  { title: '多模态整合', desc: '一个生物学问题往往需要同时看DNA序列、RNA表达、蛋白质结构、代谢物浓度和临床表型。', color: '#C53030' },
  { title: '标注数据稀缺', desc: '实验验证一个蛋白质功能或变异致病性可能花费数百到数千美元。高质量标注数据远少于未标注的测序数据。', color: '#4A6741' },
];

const concepts = [
  { term: '特征 (Feature)', def: '输入模型的每个可量化属性。在生信中，可以是基因表达值、DNA k-mer频率、蛋白质氨基酸组成等。' },
  { term: '标签 (Label)', def: '模型要预测的目标变量。如基因是否致病(是/否)、蛋白质的亚细胞定位(核/质/膜)、药物的IC50值(数值)。' },
  { term: '过拟合', def: '模型记住了训练数据的噪声而非普适规律。基因数(n=20000)远多于样本数(n=100)时，过拟合是默认状态而非例外。' },
  { term: '嵌入 (Embedding)', def: '将离散符号(氨基酸、核苷酸)映射为稠密连续向量的技术。ESM-2将蛋白质序列转为1280维向量，GeneFormer将细胞转为嵌入用于跨数据集分析。' },
  { term: '迁移学习', def: '在大规模数据上预训练模型，在小数据上微调。生信DL的标准范式——几乎所有前沿模型(ESM, AlphaFold, scGPT)都采用预训练+微调模式。' },
  { term: '批次效应', def: '由实验条件(不同日期、技术员、测序仪)而非生物因素导致的数据系统性差异。是生信数据分析中最棘手的混淆因素。' },
  { term: '多模态', def: '同时处理和整合多种类型的数据——DNA序列、蛋白质结构、基因表达、临床记录。多模态整合是精准医学的核心技术挑战。' },
  { term: '端到端学习', def: '从原始输入直接预测最终输出，不拆分中间步骤。DeepVariant从测序读段图像直接调用变异，跳过了传统pipeline的多个中间步骤。' },
  { term: '基础模型 (FM)', def: '在大规模数据上预训练的大容量神经网络，通过微调适应多种下游任务。scGPT(3300万细胞)、GeneFormer(3000万细胞)是单细胞FM的代表。2025年基准测试揭示其在扰动预测等任务上仍需改进。' },
  { term: '扩散模型 (Diffusion)', def: '通过逐步去噪生成新数据的深度生成模型。AlphaFold3用扩散模型预测蛋白-配体复合结构；RFdiffusion用扩散模型从零设计全新蛋白质。2024年诺贝尔化学奖的核心技术之一。' },
  { term: '变分自编码器 (VAE)', def: '学习数据的概率隐空间表示的生成模型。scVI用VAE对单细胞数据进行批次校正和降维；Bulk2Space用beta-VAE进行Bulk到单细胞的反卷积。' },
  { term: '图神经网络 (GNN)', def: '处理图结构数据的深度学习方法。ProteinMPNN用GNN设计蛋白质序列；GCN/GAT用于分子性质预测和PPI网络分析。' },
];

export default function IntroPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 滚动压缩：封面内容随滚动缩小+上移+淡出
  const coverScale = 1 - scrollProgress * 0.12;
  const coverTranslateY = scrollProgress * window.innerHeight * 0.15;
  const coverOpacity = 1 - scrollProgress * 0.6;

  return (
    <div>
      {/* ====== Full-viewport Cover ====== */}
      <section className="relative overflow-hidden">
        {/* 16:9 容器：背景图+文字共用 */}
        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
          {/* 背景图片层，30%透明度 */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${import.meta.env.BASE_URL}cover-bg.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.3,
            }}
          />
          {/* 文字层：置于16:9图片中央 */}
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
            style={{
              transform: `scale(${coverScale}) translateY(${coverTranslateY}px)`,
              opacity: coverOpacity,
              willChange: 'transform, opacity',
            }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 bg-brand-accent-light text-brand-accent">
                <Dna size={14} />生物信息学 X 机器学习
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-brand-ink leading-tight">
                当生物学遇见人工智能
              </h1>
              <p className="text-base md:text-lg max-w-xl mx-auto mb-10 text-brand-ink-muted leading-relaxed">
                一个人类基因组有30亿个碱基对，一个单细胞实验能测10000个基因的表达，
                一个蛋白质数据库收录了2亿个结构。生物学已进入数据洪流时代，
                机器学习和深度学习正在成为解读这些数据的核心工具。
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/roadmap" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white no-underline bg-brand-accent hover:opacity-90 transition-opacity">
                  <BookOpen size={16} />开始系统学习
                </Link>
                <Link to="/applications" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium no-underline border border-brand-border text-brand-ink-light hover:bg-brand-off-white transition-colors">
                  <Microscope size={16} />查看应用方向
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll-down indicator，贴在16:9容器底部 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 scroll-indicator">
            <span className="text-xs text-brand-ink-muted">向下滚动了解更多</span>
            <ChevronDown size={20} className="text-brand-ink-muted" />
          </div>
        </div>
      </section>

      {/* ====== Content sections with scroll reveal ====== */}

      {/* 1. What is bioinformatics */}
      <Reveal>
        <section className="max-w-[860px] mx-auto py-16 px-6">
          <div className="flex items-center gap-3 mb-8">
            <Dna size={22} className="text-brand-accent" />
            <h2 className="text-2xl font-bold text-brand-ink">生物信息学是什么？</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-brand-ink-light max-w-3xl">
            <p>生物信息学(Bioinformatics)是<strong>用计算工具分析生物学数据</strong>的交叉学科。它诞生于一个简单需求：当DNA测序仪每天产出数百万个碱基对的数据时，人类不可能手动分析——必须借助计算机和算法。</p>
            <p>1990年代，生物信息学主要做序列比对和数据库搜索(BLAST)。2001年人类基因组计划完成后，重心转向功能注释和比较基因组学。2010年代NGS技术成熟后，单次实验可产生TB级数据。2020年代以来，<strong>机器学习和深度学习正在重塑这个领域</strong>——算法驱动的生物学发现正在成为现实。</p>
          </div>

          <div className="mt-10 border rounded-lg overflow-hidden border-brand-border max-w-3xl">
            <div className="px-5 py-3 bg-brand-off-white border-b border-brand-border-light">
              <h3 className="text-sm font-semibold text-brand-ink">关键里程碑</h3>
            </div>
            <div className="divide-y divide-brand-border-light">
              {milestones.map((m) => (
                <div key={m.year} className="flex items-start gap-4 px-5 py-3">
                  <span className="text-xs font-mono font-bold text-brand-accent shrink-0 w-10">{m.year}</span>
                  <div>
                    <div className="text-sm font-medium text-brand-ink">{m.event}</div>
                    <div className="text-xs text-brand-ink-muted mt-0.5">{m.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* 2. Data challenges */}
      <Reveal>
        <section className="max-w-[860px] mx-auto py-16 px-6">
          <div className="flex items-center gap-3 mb-8">
            <Zap size={22} className="text-brand-accent" />
            <h2 className="text-2xl font-bold text-brand-ink">生物学大数据的独特挑战</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((item) => (
              <div key={item.title} className="border rounded-lg p-5 border-brand-border" style={{ borderLeftWidth: 3, borderLeftColor: item.color }}>
                <h3 className="text-sm font-semibold mb-2 text-brand-ink">{item.title}</h3>
                <p className="text-xs text-brand-ink-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 2.5. The scale revolution */}
      <Reveal>
        <section className="max-w-[860px] mx-auto py-16 px-6">
          <div className="flex items-center gap-3 mb-8">
            <Layers size={22} className="text-brand-accent" />
            <h2 className="text-2xl font-bold text-brand-ink">数据的量级革命：从万到亿</h2>
          </div>
          <p className="text-sm text-brand-ink-muted mb-6">
            单细胞组学正经历前所未有的数据爆炸。理解这一量级跃迁，才能理解为什么ML/DL不是锦上添花，而是刚需。
          </p>
          <div className="border rounded-lg overflow-hidden border-brand-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-off-white">
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink">项目/平台</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink">细胞数</th>
                  <th className="text-left px-4 py-3 font-semibold text-brand-ink-muted">年份</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-brand-border-light"><td className="px-4 py-2.5 text-brand-ink-light">CZI Billion Cells Project</td><td className="px-4 py-2.5 font-bold text-brand-accent">10亿 (目标)</td><td className="px-4 py-2.5 text-brand-ink-muted">2025</td></tr>
                <tr className="border-t border-brand-border-light"><td className="px-4 py-2.5 text-brand-ink-light">Human Cell Atlas</td><td className="px-4 py-2.5 font-bold text-brand-accent">&gt;1亿</td><td className="px-4 py-2.5 text-brand-ink-muted">2025</td></tr>
                <tr className="border-t border-brand-border-light"><td className="px-4 py-2.5 text-brand-ink-light">scBaseCount (最大公共仓库)</td><td className="px-4 py-2.5 font-bold text-brand-accent">&gt;2.3亿</td><td className="px-4 py-2.5 text-brand-ink-muted">2025</td></tr>
                <tr className="border-t border-brand-border-light"><td className="px-4 py-2.5 text-brand-ink-light">Scale Bio 100M Cell Challenge</td><td className="px-4 py-2.5 font-bold text-brand-accent">~10亿 (147提案)</td><td className="px-4 py-2.5 text-brand-ink-muted">2025</td></tr>
                <tr className="border-t border-brand-border-light"><td className="px-4 py-2.5 text-brand-ink-light">Tahoe-100M (Parse/Ultima)</td><td className="px-4 py-2.5 font-bold text-brand-accent">1亿</td><td className="px-4 py-2.5 text-brand-ink-muted">2024</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-brand-ink-muted mt-4">
            <em>来源：GEN Biotechnology (2025), bioRxiv (2025), CZI/10x Genomics/Ultima Genomics 官方公告</em>
          </p>
          <p className="text-sm text-brand-ink-light mt-4">
            10x Genomics 最新平台单次运行可处理 <strong>400万个细胞</strong>，未来目标是万兆级（trillion-scale）。十年前一个博士论文分析几百个细胞，现在一个项目就能产生数十亿细胞的数据——<strong>如果没有ML/DL，这些数据将无法被有效分析</strong>。
          </p>
        </section>
      </Reveal>

      {/* 3. Why traditional methods fall short */}
      <Reveal>
        <section className="max-w-[860px] mx-auto py-16 px-6">
          <div className="flex items-center gap-3 mb-8">
            <Brain size={22} className="text-brand-accent" />
            <h2 className="text-2xl font-bold text-brand-ink">为什么传统统计方法不够？</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-brand-ink-light max-w-3xl">
            <p>传统生物信息学分析主要依赖统计检验(t检验、方差分析)和线性模型。这些方法贡献巨大，但面对现代生物学数据规模时开始显现局限：</p>
            <ul className="space-y-3 list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-brand-accent font-bold shrink-0">1.</span>
                <span><strong>多重检验问题：</strong>对20000个基因逐个做t检验，按p=0.05会有约1000个假阳性。FDR校正可以控制假发现率，但代价是检验功效下降。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-accent font-bold shrink-0">2.</span>
                <span><strong>线性假设的局限：</strong>基因调控网络、蛋白质相互作用中的关系几乎都是非线性的。两个基因的联合表达效应可能远大于各自效应的简单相加(上位效应)。线性模型无法捕捉这些复杂关系。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-accent font-bold shrink-0">3.</span>
                <span><strong>手工特征的瓶颈：</strong>传统方法需要研究者手工设计特征——从DNA序列中提取k-mer频率、计算理化描述符。这个过程依赖领域知识且可能遗漏重要的未知模式。深度学习可以自动从原始序列学习最优特征表示。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-accent font-bold shrink-0">4.</span>
                <span><strong>大规模预测需求：</strong>传统统计适合验证一个明确假设，但现代生物学需要大规模预测——"在2万个基因中找出所有与预后相关的"——这本质上是ML的搜索和排序问题。</span>
              </li>
            </ul>
          </div>
        </section>
      </Reveal>

      {/* 4. Breakthrough cases */}
      <Reveal>
        <section className="max-w-[860px] mx-auto py-16 px-6">
          <div className="flex items-center gap-3 mb-8">
            <FlaskConical size={22} className="text-brand-accent" />
            <h2 className="text-2xl font-bold text-brand-ink">ML/DL如何改变生物信息学</h2>
          </div>
          <p className="text-sm text-brand-ink-muted mb-8">四个案例展示机器学习和深度学习如何在真实生物信息学问题中取得突破。</p>
          <div className="space-y-6">
            {cases.map((c) => (
              <div key={c.title} className="border rounded-lg overflow-hidden border-brand-border">
                <div className="h-1" style={{ backgroundColor: c.color }} />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: c.color + '18', color: c.color }}>{c.tag}</span>
                    <h3 className="text-base font-semibold text-brand-ink">{c.title}</h3>
                  </div>
                  <div className="space-y-3 text-sm text-brand-ink-light leading-relaxed">
                    <div><span className="text-xs font-semibold text-brand-ink-muted uppercase tracking-wide">问题</span><p className="mt-1">{c.problem}</p></div>
                    <div><span className="text-xs font-semibold text-brand-ink-muted uppercase tracking-wide">ML/DL方案</span><p className="mt-1">{c.solution}</p></div>
                    <div><span className="text-xs font-semibold text-brand-ink-muted uppercase tracking-wide">影响</span><p className="mt-1">{c.impact}</p></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 4.5. Nobel Prize and honest assessment */}
      <Reveal>
        <section className="max-w-[860px] mx-auto py-16 px-6">
          <div className="flex items-center gap-3 mb-8">
            <FlaskConical size={22} className="text-brand-accent" />
            <h2 className="text-2xl font-bold text-brand-ink">2024诺贝尔化学奖：AI蛋白质时代的加冕</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border rounded-lg p-5 border-brand-border" style={{ borderLeftWidth: 3, borderLeftColor: '#1E3A5F' }}>
              <h3 className="text-sm font-semibold mb-2 text-brand-ink">David Baker (华盛顿大学)</h3>
              <p className="text-xs text-brand-ink-muted leading-relaxed mb-2">
                "for computational protein design" — 用RoseTTAFold和RFdiffusion从零设计自然界不存在的全新蛋白质
              </p>
              <p className="text-xs text-brand-ink-light leading-relaxed">
                代表工具：RFdiffusion (扩散模型生成蛋白质骨架) + ProteinMPNN (GNN设计氨基酸序列)。已设计出针对流感病毒、艰难梭菌毒素的全新抗体。
              </p>
            </div>
            <div className="border rounded-lg p-5 border-brand-border" style={{ borderLeftWidth: 3, borderLeftColor: '#C53030' }}>
              <h3 className="text-sm font-semibold mb-2 text-brand-ink">Demis Hassabis & John Jumper (DeepMind)</h3>
              <p className="text-xs text-brand-ink-muted leading-relaxed mb-2">
                "for protein structure prediction" — AlphaFold2解决了50年的蛋白质折叠问题
              </p>
              <p className="text-xs text-brand-ink-light leading-relaxed">
                代表工具：AlphaFold2 → AlphaFold3 (扩散架构，扩展到蛋白-配体/DNA/RNA复合物)。Isomorphic Labs已与Eli Lilly ($17.45亿)和Novartis ($12.38亿)达成合作。
              </p>
            </div>
          </div>
          <p className="text-sm text-brand-ink-light mt-4 leading-relaxed">
            这是诺贝尔奖历史上首次将化学奖授予纯粹的计算方法——标志着<strong>AI驱动的生物学发现</strong>已获得最高学术认可。
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="max-w-[860px] mx-auto py-16 px-6">
          <div className="flex items-center gap-3 mb-8">
            <Brain size={22} className="text-brand-accent" />
            <h2 className="text-2xl font-bold text-brand-ink">前沿挑战：诚实的评估</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-brand-ink-light">
            <p>尽管ML/DL在生信中取得了令人瞩目的突破，学术界对当前能力的评估是诚实的：</p>
            <div className="border rounded-lg p-5 bg-brand-off-white border-brand-border-light space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0 mt-0.5">1.</span>
                <span><strong>单细胞基础模型的局限：</strong>2025年Nature Methods基准测试(Ahlmann-Eltze, Huber & Anders)显示，scGPT、GeneFormer、scFoundation等大模型在基因扰动预测任务上<strong>尚未超越简单的线性基线</strong>。零样本表示在大多数情况下并不优于简单方法。</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0 mt-0.5">2.</span>
                <span><strong>蛋白质设计的五大挑战：</strong>Nature(2024)指出AI蛋白质设计仍面临：可靠的小分子结合剂设计、酶催化活性设计、构象动力学建模、复杂分子机器设计、从失败中学习。</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0 mt-0.5">3.</span>
                <span><strong>可解释性鸿沟：</strong>深度学习模型在预测精度上超越了传统方法，但其"黑箱"本质限制了在临床决策中的应用。xAI(可解释AI)是当前研究热点——Novakovsky et al., Nature Reviews Genetics (2023)为此发表了专题综述。</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0 mt-0.5">4.</span>
                <span><strong>数据量≠数据质量：</strong>十亿细胞的规模令人震撼，但批次效应、平台差异、注释不一致等问题并未因数据量增大而自动解决。ML/DL方法本身需要高质量的训练数据——"garbage in, garbage out"在生信领域同样适用。</span>
              </div>
            </div>
            <p>这些挑战不是ML/DL的失败——它们是<strong>下一代方法需要解决的问题</strong>。正如2024年诺贝尔奖所表明的，这个领域仍处于指数增长期。</p>
          </div>
        </section>
      </Reveal>

      {/* 5. Key concepts */}
      <Reveal>
        <section className="max-w-[860px] mx-auto py-16 px-6">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen size={22} className="text-brand-accent" />
            <h2 className="text-2xl font-bold text-brand-ink">核心概念速览</h2>
          </div>
          <div className="border rounded-lg divide-y divide-brand-border-light border-brand-border">
            {concepts.map((c) => (
              <div key={c.term} className="flex items-start gap-4 px-5 py-3.5">
                <span className="text-sm font-mono font-semibold text-brand-accent shrink-0 min-w-[100px]">{c.term}</span>
                <span className="text-sm text-brand-ink-light leading-relaxed">{c.def}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 6. Learning roadmap */}
      <Reveal>
        <section className="max-w-[860px] mx-auto py-16 px-6">
          <div className="flex items-center gap-3 mb-8">
            <Layers size={22} className="text-brand-accent" />
            <h2 className="text-2xl font-bold text-brand-ink">学习路线图</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 1, name: '基础入门', time: '4-6周', desc: '编程、数学和ML/DL基础', color: '#1E3A5F' },
              { id: 2, name: '核心方法', time: '6-8周', desc: '经典ML和DL核心架构', color: '#2D5A3D' },
              { id: 3, name: '进阶架构', time: '8-10周', desc: 'Transformer与注意力', color: '#5B3A7B' },
              { id: 4, name: '专业应用', time: '持续学习', desc: '前沿领域和生物大模型', color: '#8B4513' },
            ].map((s) => (
              <div key={s.id} className="border rounded-lg p-4 text-center border-brand-border">
                <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.id}</div>
                <div className="text-sm font-semibold mb-1 text-brand-ink">{s.name}</div>
                <div className="text-xs text-brand-ink-muted mb-2">{s.time}</div>
                <div className="text-xs text-brand-ink-muted">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/roadmap" className="inline-flex items-center gap-1.5 text-sm font-medium no-underline text-brand-accent">
              查看完整学习路径 <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <section className="max-w-[860px] mx-auto py-16 px-6 mb-16">
          <div className="text-center py-16 border rounded-lg border-brand-border bg-brand-off-white">
            <h2 className="text-2xl font-bold mb-3 text-brand-ink">准备好了吗？</h2>
            <p className="text-sm text-brand-ink-muted mb-8 max-w-md mx-auto">
              无论你是刚入门的研究生还是经验丰富的生物信息学研究者，
              系统学习ML/DL都将为你的研究打开新的可能性。
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/roadmap" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white no-underline bg-brand-accent hover:opacity-90 transition-opacity">
                <BookOpen size={16} />开始系统学习
              </Link>
              <Link to="/applications" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium no-underline border border-brand-border text-brand-ink-light hover:bg-brand-off-white transition-colors">
                <Microscope size={16} />探索应用方向
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
