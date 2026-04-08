export interface PolicyResource {
  id: string;
  title: string;
  title_zh: string;
  summary: string;
  summary_zh: string;
  url: string;
  source: string;
  region: string;
  type: string;
  type_zh: string;
}

export const POLICY_RESOURCES: PolicyResource[] = [
  {
    id: 'eu-ai-office',
    title: 'European AI Office',
    title_zh: '欧盟 AI Office',
    summary:
      'The European Commission\'s AI Office coordinates AI Act implementation, GPAI oversight, and cross-border regulatory cooperation.',
    summary_zh:
      '欧盟委员会 AI Office 是 AI 法案实施、通用人工智能模型监管和跨境协调的核心机构。',
    url: 'https://digital-strategy.ec.europa.eu/en/policies/ai-office',
    source: 'European Commission',
    region: 'EU',
    type: 'Institution',
    type_zh: '监管机构',
  },
  {
    id: 'eu-ai-act-portal',
    title: 'EU Artificial Intelligence Act Portal',
    title_zh: '欧盟人工智能法案入口',
    summary:
      'An official entry point for understanding the AI Act, the AI Office, and the broader EU approach to trustworthy AI.',
    summary_zh:
      '官方入口页，集中梳理 AI 法案、AI Office 以及欧盟对可信 AI 的整体治理框架。',
    url: 'https://commission.europa.eu/topics/artificial-intelligence_en',
    source: 'European Commission',
    region: 'EU',
    type: 'Regulation',
    type_zh: '法规总览',
  },
  {
    id: 'edpb-news',
    title: 'EDPB News and Publications',
    title_zh: 'EDPB 新闻与出版物',
    summary:
      'Track EDPB opinions, coordinated enforcement signals, and privacy positions that directly affect AI model deployment and data use.',
    summary_zh:
      '跟踪 EDPB 的意见、协同执法动向以及与 AI 模型部署和数据使用直接相关的隐私立场。',
    url: 'https://www.edpb.europa.eu/news/news_en',
    source: 'EDPB',
    region: 'EU',
    type: 'Guidance',
    type_zh: '官方指引',
  },
  {
    id: 'ftc-ai-claims',
    title: 'FTC Guidance: Keep Your AI Claims in Check',
    title_zh: 'FTC 指引：谨慎审查你的 AI 宣称',
    summary:
      'A practical U.S. enforcement-oriented guidance note on deceptive AI claims, substantiation, and consumer protection risk.',
    summary_zh:
      '面向执法和企业合规的美国官方指引，聚焦 AI 宣传、证据支持和消费者保护风险。',
    url: 'https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check',
    source: 'FTC',
    region: 'USA',
    type: 'Enforcement Guidance',
    type_zh: '执法指引',
  },
  {
    id: 'nist-ai-rmf-playbook',
    title: 'NIST AI RMF Playbook',
    title_zh: 'NIST AI 风险管理框架实务手册',
    summary:
      'A detailed implementation companion for the NIST AI RMF, useful for translating governance principles into operational controls.',
    summary_zh:
      'NIST AI 风险管理框架的落地手册，适合把治理原则转成可执行的组织流程和控制要求。',
    url: 'https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-playbook',
    source: 'NIST',
    region: 'USA',
    type: 'Framework',
    type_zh: '治理框架',
  },
];
