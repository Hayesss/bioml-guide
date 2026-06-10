# BioML Guide

面向**生物信息学研究者**的机器学习与深度学习系统学习指南。

从零基础到前沿应用，系统掌握 ML/DL 在基因组学、蛋白质科学、单细胞组学和药物发现中的核心方法与实践技能。

## 功能特性

- **四阶段学习路径** — 基础入门 → 核心方法 → 进阶架构 → 专业应用，每阶段覆盖 ML/DL/数学/工具/项目/资源六大维度
- **六大应用方向** — 基因组学、蛋白质科学、单细胞组学、药物发现、转录组学、影像组学，含决策指南（何时用 ML 何时用 DL）
- **进度追踪** — 勾选式学习检查，进度百分比，数据持久化到 localStorage
- **全局搜索** — `Ctrl+K` 呼出，模糊匹配全站工具、方法、概念和资源
- **速查表** — 环境搭建、数据加载、ML/DL 常用模式、生物信息特有操作的一键复制代码片段
- **自测 Quiz** — 5 道生物信息学 ML/DL 实战题目，即时反馈与解析
- **数学直觉** — 用生物学类比理解线性代数、微积分、概率、优化和信息论
- **响应式设计** — 桌面端和移动端均可正常浏览

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 本地预览生产构建
npm run preview
```

要求 Node.js 18+。

## 项目结构

```
bioml-guide/
├── public/
│   └── data/                  # 内容数据 (JSON)
│       ├── roadmap.json       # 四阶段学习路径
│       ├── applications.json  # 六大应用方向
│       ├── tools.json         # 工具库 (25+)
│       ├── resources.json     # 学习资源 (20+)
│       └── math.json          # 数学直觉
├── src/
│   ├── components/            # 通用组件
│   │   ├── Navbar.tsx         # 顶部导航 + 搜索入口
│   │   ├── Footer.tsx         # 页脚
│   │   ├── Layout.tsx         # 页面布局
│   │   ├── SearchModal.tsx    # 全局搜索模态框
│   │   ├── Quiz.tsx           # 自测问答
│   │   ├── CodeBlock.tsx      # 代码块 (语法高亮 + 复制)
│   │   └── BackToTop.tsx      # 回到顶部
│   ├── pages/                 # 页面组件
│   │   ├── HomePage.tsx       # 首页
│   │   ├── RoadmapPage.tsx    # 学习路径
│   │   ├── ApplicationsPage.tsx # 应用方向
│   │   ├── ResourcesPage.tsx  # 资源库
│   │   ├── ToolsPage.tsx      # 工具
│   │   ├── MathPage.tsx       # 数学直觉
│   │   └── CheatSheetPage.tsx # 速查表
│   ├── hooks/
│   │   ├── useData.ts         # JSON 数据加载
│   │   └── useProgress.ts     # 学习进度管理
│   ├── data/                  # TypeScript 类型定义及静态数据
│   ├── App.tsx                # 路由配置
│   ├── main.tsx               # 入口
│   └── index.css              # 全局样式 + CSS 变量
├── tailwind.config.js
├── vite.config.ts
└── .github/workflows/deploy.yml  # GitHub Pages 自动部署
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 3 |
| 路由 | React Router 7 |
| 图标 | Lucide React |
| 部署 | GitHub Pages (GitHub Actions) |

## 内容维护

所有学习内容以 JSON 格式存储在 `public/data/` 目录下，修改内容无需改动组件代码：

- 添加学习主题 → 编辑 `roadmap.json`
- 添加应用方向 → 编辑 `applications.json`
- 添加工具/资源 → 编辑 `tools.json` / `resources.json`
- 修改数学概念 → 编辑 `math.json`

速查表和 Quiz 的内容直接写在对应组件中。

## License

MIT
