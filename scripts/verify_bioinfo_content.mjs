import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const readText = (path) => readFileSync(join(root, path), 'utf8');

const fail = (message) => {
  throw new Error(message);
};

const roadmap = readJson('public/data/roadmap.json');
const applications = readJson('public/data/applications.json');
const topics = readJson('public/data/topics.json');
const tools = readJson('public/data/tools.json');
const resources = readJson('public/data/resources.json');
const topicPage = readText('src/pages/TopicLearnPage.tsx');
const roadmapPage = readText('src/pages/RoadmapPage.tsx');
const searchModal = readText('src/components/SearchModal.tsx');
const appSource = readText('src/App.tsx');
const navbar = readText('src/components/Navbar.tsx');
const footer = readText('src/components/Footer.tsx');
const bioinfoNgsPage = readText('src/pages/BioinfoNgsPage.tsx');
const cheatsheetPage = readText('src/pages/CheatSheetPage.tsx');
const quiz = readText('src/components/Quiz.tsx');

const requiredTopicKeys = [
  'ngs-fastq-qc',
  'genome-alignment',
  'count-matrix',
  'cuttag-analysis',
  'rnaseq-deseq2',
  'atacseq-analysis',
  'multiomics-integration',
];

const requiredTools = [
  'fastqc',
  'multiqc',
  'bowtie2',
  'samtools',
  'bedtools',
  'cutadapt',
  'seacr',
  'deeptools',
  'deseq2',
  'chipseeker',
  'macs2',
  'homer',
];

const requiredResources = [
  'cuttag-tutorial-zheng',
  'cuttag-natcomm-2019',
  'seacr-2019',
  'deseq2-paper',
  'encode-atac-pipeline',
  'bioconductor-chipseq',
];

if (!roadmap.stages?.some((stage) => Array.isArray(stage.bioinfoTopics) && stage.bioinfoTopics.length > 0)) {
  fail('roadmap.json must include bioinfoTopics in at least one stage');
}

const app = applications.applications?.find((item) => item.id === 'bioinformatics-workflows');
if (!app) fail('applications.json must include bioinformatics-workflows');
if (!app.mlMethods?.length || !app.dlMethods?.length || !app.datasets?.length) {
  fail('bioinformatics-workflows must include methods and datasets');
}

for (const key of requiredTopicKeys) {
  const topic = topics.topics?.find((item) => item.key === key);
  if (!topic) fail(`topics.json missing topic ${key}`);
  if (topic.type !== 'bioinfo') fail(`${key} must use type bioinfo`);
  if (!topics.topicOrder?.includes(key)) fail(`topicOrder missing ${key}`);
  for (const sectionType of ['concept', 'code', 'check']) {
    if (!topic.sections?.some((section) => section.type === sectionType)) {
      fail(`${key} missing ${sectionType} section`);
    }
  }
}

const cuttag = topics.topics.find((item) => item.key === 'cuttag-analysis');
for (const sectionType of ['analogy', 'concept', 'expert', 'how', 'bio', 'code', 'check']) {
  if (!cuttag.sections.some((section) => section.type === sectionType)) {
    fail(`cuttag-analysis missing ${sectionType} section`);
  }
}
if (!Array.isArray(cuttag.workflowModules) || cuttag.workflowModules.length < 13) {
  fail('cuttag-analysis must include at least 13 workflowModules');
}

for (const id of requiredTools) {
  if (!tools.tools?.some((tool) => tool.id === id)) {
    fail(`tools.json missing ${id}`);
  }
}

for (const id of requiredResources) {
  if (!resources.resources?.some((resource) => resource.id === id)) {
    fail(`resources.json missing ${id}`);
  }
}

for (const expected of ['bioinfo', '生物信息学']) {
  if (!topicPage.includes(expected)) {
    fail(`TopicLearnPage.tsx missing ${expected}`);
  }
}
for (const expected of ['workflowModules', '流程模块卡片']) {
  if (!topicPage.includes(expected)) {
    fail(`TopicLearnPage.tsx missing ${expected}`);
  }
}

for (const expected of ['bioinfoTopics', '生信流程']) {
  if (!roadmapPage.includes(expected)) {
    fail(`RoadmapPage.tsx missing ${expected}`);
  }
}
for (const expected of ['bioinfoTopics', '生信流程']) {
  if (!searchModal.includes(expected)) {
    fail(`SearchModal.tsx missing ${expected}`);
  }
}
for (const expected of ['path="/ngs"', 'BioinfoNgsPage']) {
  if (!appSource.includes(expected)) {
    fail(`App.tsx missing ${expected}`);
  }
}
for (const expected of ['/ngs', '生信NGS']) {
  if (!navbar.includes(expected)) {
    fail(`Navbar.tsx missing ${expected}`);
  }
  if (!footer.includes(expected)) {
    fail(`Footer.tsx missing ${expected}`);
  }
}
for (const expected of ['生信NGS流程', 'cuttag-analysis', 'workflowModules', 'ngs-fastq-qc']) {
  if (!bioinfoNgsPage.includes(expected)) {
    fail(`BioinfoNgsPage.tsx missing ${expected}`);
  }
}

for (const expected of ['FastQC/MultiQC', 'SEACR', 'peak annotation']) {
  if (!cheatsheetPage.includes(expected)) {
    fail(`CheatSheetPage.tsx missing ${expected}`);
  }
}

for (const expected of ['CUT&Tag', 'SEACR peak calling', '差异 peak']) {
  if (!quiz.includes(expected)) {
    fail(`Quiz.tsx missing ${expected}`);
  }
}

console.log('Bioinfo content checks passed');
