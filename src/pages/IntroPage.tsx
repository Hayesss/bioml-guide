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
  { year: '2023', event: '生物大模型时代', detail: 'ESM-2/Nucleotide Transformer/scGPT等预训练模型涌现' },
];

const cases = [
  { title: 'AlphaFold2 — 50年蛋白质折叠问题', tag: '结构生物学', color: '#1E3A5F', problem: '从氨基酸序列预测蛋白质3D结构是困扰科学界50年的难题。传统实验方法每个蛋白质需要数月到数年。', solution: 'AlphaFold2用Evoformer(48层Transformer变体)处理多序列比对和残基配对表示，输出原子级精度的3D坐标。CASP14竞赛中位误差仅0.96埃。', impact: '已预测超过2亿个蛋白质结构，全球200万研究人员使用，加速了药物设计和变异致病性解读。' },
  { title: 'ESM-2 — 蛋白质的语言模型', tag: '蛋白质工程', color: '#2D5A3D', problem: '实验方法评估突变效应费时费钱。一个蛋白质的所有可能单点突变量是序列长度的20倍，无法全部实验验证。', solution: 'ESM-2在6500万条蛋白质序列上做掩码语言模型预训练。零样本(不需要实验数据)预测突变效应——比较野生型和突变型的log-likelihood差异。', impact: '15B参数的ESM-2可以零样本预测约70%的ClinVar致病变异，为蛋白质工程提供了高效的计算筛选工具。' },
  { title: 'scVI — 单细胞数据的深度生成模型', tag: '单细胞组学', color: '#5B3A7B', problem: '单细胞RNA-seq数据高度稀疏(90%以上值为0)、噪声大、批次效应严重。传统归一化方法难以同时处理这些问题。', solution: 'scVI用变分自编码器学习细胞的概率低维表示，将批次信息作为条件变量，隐空间捕获生物变异而非技术噪声。', impact: '已成为单细胞数据分析的核心工具，研究者可整合来自不同实验室、不同平台的数据，发现跨研究的生物学规律。' },
  { title: 'Enformer — 从DNA序列预测基因表达', tag: '基因组学', color: '#8B4513', problem: '98%的非编码区变异如何影响基因表达？调控元件可在100kb外起作用，传统方法只能看基因附近区域。', solution: 'Enformer用Transformer+卷积处理200kb的DNA序列窗口，多头注意力捕捉远距离增强子-启动子互作，直接从序列预测表达水平。', impact: '使非编码变异功能解读成为可能，输入SNP坐标即可预测附近基因的表达变化，评估致病潜力。' },
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
  { term: '嵌入 (Embedding)', def: '将离散符号(氨基酸、核苷酸)映射为稠密连续向量的技术。相似符号的向量在空间中靠近，与氨基酸的生化属性自然对应。' },
  { term: '迁移学习', def: '在大规模数据上预训练模型，在小数据上微调。生信DL的标准范式——几乎所有前沿模型(ESM, AlphaFold, scGPT)都采用预训练+微调模式。' },
  { term: '批次效应', def: '由实验条件(不同日期、技术员、测序仪)而非生物因素导致的数据系统性差异。是生信数据分析中最棘手的混淆因素。' },
  { term: '多模态', def: '同时处理和整合多种类型的数据——DNA序列、蛋白质结构、基因表达、临床记录。多模态整合是精准医学的核心技术挑战。' },
  { term: '端到端学习', def: '从原始输入直接预测最终输出，不拆分中间步骤。DeepVariant从测序读段图像直接调用变异，跳过了传统pipeline的多个中间步骤。' },
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
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* 背景图片层，30%透明度，16:9宽高比，顶部对齐 */}
        <div
          className="absolute w-full top-0 z-0"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}cover-bg.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            aspectRatio: '16 / 9',
            opacity: 0.3,
          }}
        />
        <div
          className="max-w-2xl mx-auto relative z-10 transition-none"
          style={{
            transform: `scale(${coverScale}) translateY(${coverTranslateY}px)`,
            opacity: coverOpacity,
          }}
        >
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

        {/* Scroll-down indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 scroll-indicator">
          <span className="text-xs text-brand-ink-muted">向下滚动了解更多</span>
          <ChevronDown size={20} className="text-brand-ink-muted" />
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
