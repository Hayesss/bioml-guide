import { Link } from 'react-router-dom';
import { BookOpen, Microscope, ArrowRight, Dna, Layers, FlaskConical, Brain, Zap } from 'lucide-react';

const milestones = [
  { year: '2001', event: '人类基因组计划完成', detail: '首次获得人类全基因组序列，耗资30亿美元，历时13年' },
  { year: '2008', event: '下一代测序(NGS)普及', detail: '测序成本断崖式下降，一个人类基因组从30亿降到1000美元以下' },
  { year: '2012', event: 'AlexNet赢得ImageNet', detail: '深度学习首次在图像识别上大幅超越传统方法，开启了DL革命' },
  { year: '2015', event: 'DeepVariant发布', detail: 'Google用CNN进行变异检测，精度超越传统GATK流程' },
  { year: '2018', event: '单细胞组学爆发', detail: '10x Genomics使单细胞测序成为常规技术，一个实验可测百万细胞' },
  { year: '2021', event: 'AlphaFold2开源', detail: 'DeepMind解决50年蛋白质折叠难题，精度达到实验水平，被誉为AI for Science的里程碑' },
  { year: '2023', event: '生物大模型时代', detail: 'ESM-2/Nucleotide Transformer/scGPT等预训练模型涌现，AI从工具变为平台' },
];

const cases = [
  {
    title: 'AlphaFold2 — 50年蛋白质折叠问题',
    tag: '结构生物学',
    color: '#1E3A5F',
    problem: '从氨基酸序列预测蛋白质3D结构是困扰科学界50年的难题。传统实验方法(X射线晶体学、冷冻电镜)每个蛋白质需要数月到数年。',
    solution: 'AlphaFold2用Evoformer(48层Transformer变体)处理多序列比对和残基配对表示，输出原子级精度的3D坐标。在CASP14竞赛中中位误差仅0.96埃，达到实验精度。',
    impact: '已预测超过2亿个蛋白质结构(AlphaFold DB)，全球200万研究人员使用。加速了药物设计、酶工程和变异致病性解读。',
  },
  {
    title: 'ESM-2 — 蛋白质的语言模型',
    tag: '蛋白质工程',
    color: '#2D5A3D',
    problem: '实验方法评估单个氨基酸突变对蛋白质功能的影响费时费钱。一个蛋白质的所有可能单点突变量是序列长度的20倍，无法全部实验验证。',
    solution: 'ESM-2在6500万条蛋白质序列上做掩码语言模型预训练。通过比较野生型和突变型序列在模型下的log-likelihood差异，零样本(不需要任何实验数据!)预测突变效应。',
    impact: '15B参数的ESM-2可以零样本预测约70%的ClinVar致病变异。为蛋白质工程提供了高效的计算筛选工具，大幅减少需要实验验证的突变数量。',
  },
  {
    title: 'scVI — 单细胞数据的深度生成模型',
    tag: '单细胞组学',
    color: '#5B3A7B',
    problem: '单细胞RNA-seq数据高度稀疏(90%以上的值为0)、噪声大、且不同实验批次之间存在系统性偏差(批次效应)。传统归一化和降维方法难以同时处理这些问题。',
    solution: 'scVI用变分自编码器(VAE)学习细胞的概率低维表示。通过将批次信息作为条件变量，VAE的隐空间捕获的是生物变异而非技术噪声。同时完成批次校正、降维、缺失值插补和差异表达分析。',
    impact: '已成为单细胞数据分析的核心工具之一。研究者可以整合来自不同实验室、不同测序平台的单细胞数据，发现跨研究的生物学规律。',
  },
  {
    title: 'Enformer — 从DNA序列预测基因表达',
    tag: '基因组学',
    color: '#8B4513',
    problem: '人类基因组中98%是非编码区。这些区域中的变异如何影响基因表达一直难以预测——因为调控元件可以在距离目标基因超过100kb的位置起作用。传统方法只能看基因附近几千碱基的区域。',
    solution: 'Enformer用Transformer+卷积处理200kb的超长DNA序列窗口，通过多头注意力捕捉远距离调控关系(增强子-启动子互作)。直接从DNA序列预测基因表达水平和多种表观基因组轨迹。',
    impact: '使得非编码区变异的功能解读成为可能。研究者可以输入一个非编码SNP的基因组坐标，Enformer预测附近基因的表达变化，从而评估该变异的致病潜力。',
  },
];

const concepts = [
  { term: '特征 (Feature)', def: '输入模型的每个可量化属性。在生信中，可以是基因表达值、DNA k-mer频率、蛋白质氨基酸组成等。' },
  { term: '标签 (Label)', def: '模型要预测的目标变量。如基因是否致病(是/否)、蛋白质的亚细胞定位(核/质/膜)、药物的IC50值(数值)。' },
  { term: '训练/验证/测试集', def: '训练集=模型学习的数据；验证集=调超参数的数据；测试集=最终评估的数据。三者必须严格分离，尤其要防止不同批次的数据泄漏。' },
  { term: '过拟合 (Overfitting)', def: '模型记住了训练数据的噪声而非普适规律。在生信中尤其常见——基因数(n=20000)远多于样本数(n=100)时，过拟合是默认状态而非例外。' },
  { term: '嵌入 (Embedding)', def: '将离散符号(氨基酸、核苷酸)映射为稠密连续向量的技术。相似符号的向量在空间中靠近——这与氨基酸的生化属性自然对应。' },
  { term: '迁移学习 (Transfer Learning)', def: '在大规模数据上预训练模型，在小数据上微调。生信DL的标准范式——几乎所有前沿模型(ESM, AlphaFold, scGPT)都采用预训练+微调模式。' },
  { term: '批次效应 (Batch Effect)', def: '由实验条件(不同日期、不同技术员、不同测序仪)而非生物因素导致的数据系统性差异。是生信数据分析中最棘手的混淆因素之一。' },
  { term: '多模态 (Multimodal)', def: '同时处理和整合多种类型的数据——DNA序列、蛋白质结构、基因表达、临床记录。多模态整合是精准医学的核心技术挑战。' },
];

export default function IntroPage() {
  return (
    <div className="max-w-[860px] mx-auto py-10 px-6 space-y-20">
      {/* ====== 1. Hero ====== */}
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 bg-brand-accent-light text-brand-accent">
          <Dna size={14} />
          生物信息学 X 机器学习
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-5 text-brand-ink leading-tight">
          当生物学遇见<br className="md:hidden" />人工智能
        </h1>
        <p className="text-base md:text-lg max-w-xl mx-auto mb-8 text-brand-ink-muted leading-relaxed">
          一个人类基因组有30亿个碱基对，一个单细胞实验能测10000个基因的表达，
          一个蛋白质数据库收录了2亿个结构——生物学已进入数据洪流时代。
          机器学习和深度学习正在成为解读这些数据的核心工具。
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/roadmap" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white no-underline bg-brand-accent">
            <BookOpen size={15} />开始系统学习
          </Link>
          <Link to="/applications" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium no-underline border border-brand-border text-brand-ink-light">
            <Microscope size={15} />查看应用方向
          </Link>
        </div>
      </section>

      {/* ====== 2. 生物信息学是什么 ====== */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Dna size={20} className="text-brand-accent" />
          <h2 className="text-xl font-bold text-brand-ink">生物信息学是什么？</h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-brand-ink-light">
          <p>生物信息学(Bioinformatics)是<strong>用计算工具分析生物学数据</strong>的交叉学科。它诞生于一个简单需求：当DNA测序仪每天产出数百万个碱基对的数据时，人类不可能手动分析——必须借助计算机和算法。</p>
          <p>1990年代，生物信息学主要做序列比对和数据库搜索(BLAST)。2001年人类基因组计划完成后，重心转向功能注释和比较基因组学。2010年代NGS技术成熟后，单次实验可产生TB级数据——差异表达分析、变异检测、ChIP-seq、Hi-C等成为常规分析手段。</p>
          <p>2020年代以来，<strong>机器学习和深度学习正在重塑这个领域</strong>：AlphaFold2从序列预测3D蛋白质结构(精度达到实验水平)、ESM-2用语言模型零样本预测突变效应、单细胞基础模型从数百万细胞中学习通用表示——算法驱动的生物学发现正在成为现实。</p>
        </div>

        {/* Timeline */}
        <div className="mt-8 border rounded-lg overflow-hidden border-brand-border">
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

      {/* ====== 3. 生物学大数据的挑战 ====== */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Zap size={20} className="text-brand-accent" />
          <h2 className="text-xl font-bold text-brand-ink">生物学大数据的独特挑战</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: '维度灾难 (p >> n)', desc: '一个典型的基因组学研究可能测量20000个基因的表达值，但只有100个患者样本。20000个特征 vs 100个样本——绝大多数ML算法在p>>n时会严重过拟合。', color: '#1E3A5F' },
            { title: '极度的异质性', desc: '没有两个肿瘤在分子水平上是完全相同的。每位患者的癌症都有独特的突变组合和基因表达模式。模型必须从海量的个体差异中找出共性规律。', color: '#2D5A3D' },
            { title: '噪声与稀疏性', desc: '单细胞RNA-seq数据中90%以上的值为0(基因未被测到或真的不表达)。区分技术噪声和生物信号本身就是一个未完全解决的问题。', color: '#5B3A7B' },
            { title: '批次效应', desc: '同一份样本在不同日期、不同技术员、不同测序仪上可能得到显著不同的结果。如果不校正批次效应，模型学到的是实验条件差异而非生物学差异。', color: '#8B4513' },
            { title: '多模态整合', desc: '一个生物学问题往往需要同时看DNA序列、RNA表达、蛋白质结构、代谢物浓度和临床表型。每种数据类型有自己的噪声特性和统计分布，整合起来极其困难。', color: '#C53030' },
            { title: '标注数据稀缺', desc: '实验验证蛋白质功能、变异致病性或药物响应极其昂贵(一个实验可能数百到数千美元)。高质量标注数据远少于未标注的测序数据。', color: '#4A6741' },
          ].map((item) => (
            <div key={item.title} className="border rounded-lg p-5 border-brand-border" style={{ borderLeftWidth: 3, borderLeftColor: item.color }}>
              <h3 className="text-sm font-semibold mb-2 text-brand-ink">{item.title}</h3>
              <p className="text-xs text-brand-ink-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== 4. 为什么传统方法不够 ====== */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Brain size={20} className="text-brand-accent" />
          <h2 className="text-xl font-bold text-brand-ink">为什么传统统计方法不够？</h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-brand-ink-light">
          <p>传统生物信息学分析主要依赖统计检验(t检验、方差分析、Wilcoxon检验)和线性模型。这些方法在过去的几十年中做出了巨大贡献，但在面对现代生物学数据规模时开始显现局限：</p>
          <ul className="space-y-3 list-none pl-0">
            <li className="flex items-start gap-2">
              <span className="text-brand-accent font-bold shrink-0">1.</span>
              <span><strong>多重检验问题：</strong>对20000个基因逐个做t检验(比较肿瘤vs正常)，即使所有基因都没有差异，按p=0.05的阈值也会有约1000个假阳性。FDR校正(如Benjamini-Hochberg)可以控制假发现率，但代价是检验功效下降——很多真正的差异基因被遗漏。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-accent font-bold shrink-0">2.</span>
              <span><strong>线性假设的局限：</strong>基因调控网络、蛋白质相互作用、代谢通路中的关系几乎都是非线性的。两个基因的联合表达效应可能远大于各自效应的简单相加(上位效应，epistasis)。线性模型无法捕捉这些复杂关系。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-accent font-bold shrink-0">3.</span>
              <span><strong>手工特征的瓶颈：</strong>传统方法需要研究者手工设计特征——从DNA序列中提取k-mer频率、从蛋白质序列中计算理化性质描述符。这个过程依赖领域知识且可能遗漏重要的未知模式。深度学习可以自动从原始序列数据中学习最优特征表示。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-accent font-bold shrink-0">4.</span>
              <span><strong>大规模预测需求：</strong>传统统计方法适合验证一个明确的假设(如"基因X在肿瘤中高表达")。但现代生物学需要做大规模预测——"在2万个基因中找出所有与预后相关的"、"预测所有可能的SNP中哪些致病"——这本质上是ML的搜索和排序问题。</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ====== 5. ML/DL改变生物信息学的四个案例 ====== */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <FlaskConical size={20} className="text-brand-accent" />
          <h2 className="text-xl font-bold text-brand-ink">ML/DL如何改变生物信息学</h2>
        </div>
        <p className="text-sm text-brand-ink-muted mb-6">四个案例展示机器学习和深度学习如何在真实生物信息学问题中取得突破。</p>
        <div className="space-y-5">
          {cases.map((c) => (
            <div key={c.title} className="border rounded-lg overflow-hidden border-brand-border">
              <div className="h-1" style={{ backgroundColor: c.color }} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: c.color + '18', color: c.color }}>{c.tag}</span>
                  <h3 className="text-base font-semibold text-brand-ink">{c.title}</h3>
                </div>
                <div className="space-y-3 text-sm text-brand-ink-light leading-relaxed">
                  <div>
                    <span className="text-xs font-semibold text-brand-ink-muted uppercase tracking-wide">问题</span>
                    <p className="mt-1">{c.problem}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brand-ink-muted uppercase tracking-wide">ML/DL方案</span>
                    <p className="mt-1">{c.solution}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brand-ink-muted uppercase tracking-wide">影响</span>
                    <p className="mt-1">{c.impact}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== 6. 核心概念速览 ====== */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={20} className="text-brand-accent" />
          <h2 className="text-xl font-bold text-brand-ink">核心概念速览</h2>
        </div>
        <div className="border rounded-lg divide-y divide-brand-border-light border-brand-border">
          {concepts.map((c) => (
            <div key={c.term} className="flex items-start gap-4 px-5 py-3.5">
              <span className="text-sm font-mono font-semibold text-brand-accent shrink-0 min-w-[120px]">{c.term}</span>
              <span className="text-sm text-brand-ink-light leading-relaxed">{c.def}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 text-center">
          <Link to="/roadmap" className="inline-flex items-center gap-1.5 text-sm font-medium no-underline text-brand-accent">
            查看完整术语体系 <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ====== 7. 学习路线图 ====== */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Layers size={20} className="text-brand-accent" />
          <h2 className="text-xl font-bold text-brand-ink">学习路线图</h2>
        </div>
        <p className="text-sm text-brand-ink-muted mb-6">四个阶段，从零基础到前沿应用，系统掌握生物信息学 ML/DL。</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { id: 1, name: '基础入门', time: '4-6周', desc: '编程、数学和ML/DL基础概念', color: '#1E3A5F' },
            { id: 2, name: '核心方法', time: '6-8周', desc: '经典ML算法和DL核心架构', color: '#2D5A3D' },
            { id: 3, name: '进阶架构', time: '8-10周', desc: 'Transformer、注意力机制等', color: '#5B3A7B' },
            { id: 4, name: '专业应用', time: '持续学习', desc: '前沿领域和大型预训练模型', color: '#8B4513' },
          ].map((s) => (
            <div key={s.id} className="border rounded-lg p-4 text-center border-brand-border">
              <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.id}</div>
              <div className="text-sm font-semibold mb-1 text-brand-ink">{s.name}</div>
              <div className="text-xs text-brand-ink-muted mb-2">{s.time}</div>
              <div className="text-xs text-brand-ink-muted">{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 text-center">
          <Link to="/roadmap" className="inline-flex items-center gap-1.5 text-sm font-medium no-underline text-brand-accent">
            查看完整学习路径 <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="text-center py-12 border rounded-lg border-brand-border bg-brand-off-white">
        <h2 className="text-xl font-bold mb-3 text-brand-ink">准备好了吗？</h2>
        <p className="text-sm text-brand-ink-muted mb-6 max-w-md mx-auto">
          无论你是刚入门的研究生还是经验丰富的生物信息学研究者，
          系统学习ML/DL都将为你的研究打开新的可能性。
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/roadmap" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white no-underline bg-brand-accent">
            <BookOpen size={15} />开始系统学习
          </Link>
          <Link to="/applications" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium no-underline border border-brand-border text-brand-ink-light">
            <Microscope size={15} />探索应用方向
          </Link>
        </div>
      </section>
    </div>
  );
}
