export interface ComplianceTool {
  id: string;
  title: string;
  title_zh: string;
  description: string;
  description_zh: string;
  url: string;
  category: string;
  region: string;
}

export const COMPLIANCE_TOOLS: ComplianceTool[] = [
  {
    id: 'ico-toolkit',
    title: 'AI and Data Protection Risk Toolkit',
    title_zh: 'AI 与数据保护风险工具包',
    description: 'A toolkit from the UK Information Commissioner\'s Office to help organizations identify and mitigate risks.',
    description_zh: '来自英国信息专员办公室 (ICO) 的工具包，旨在帮助组织识别和减轻 AI 带来的数据保护风险。',
    url: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/relative-risk-and-the-ico-ai-toolkit/',
    category: 'Assessment',
    region: 'UK',
  },
  {
    id: 'nist-ai-rmf-playbook',
    title: 'NIST AI RMF Playbook',
    title_zh: 'NIST AI 风险管理框架实务手册',
    description: 'An operational playbook that helps teams turn the AI RMF into concrete governance, testing, and documentation practices.',
    description_zh: '把 NIST AI 风险管理框架转化为治理、测试和文档动作的实务手册，适合团队落地执行。',
    url: 'https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-playbook',
    category: 'Framework',
    region: 'USA',
  },
  {
    id: 'altai',
    title: 'ALTAI Self-Assessment',
    title_zh: 'ALTAI 可信 AI 自评清单',
    description: 'A European Commission self-assessment checklist that helps developers and deployers map trustworthy AI requirements into review questions.',
    description_zh: '欧盟委员会推出的可信 AI 自评清单，帮助开发者和部署方将要求转成可检查的问题列表。',
    url: 'https://digital-strategy.ec.europa.eu/en/library/assessment-list-trustworthy-artificial-intelligence-altai-self-assessment',
    category: 'Assessment',
    region: 'EU',
  },
  {
    id: 'oecd-ai-policy',
    title: 'OECD AI Policy Observatory',
    title_zh: 'OECD AI 政策观察站',
    description: 'A global tracker for comparing AI policies, national strategies, and regulatory developments across jurisdictions.',
    description_zh: '面向跨法域研究的全球政策观察平台，适合对比 AI 政策、国家战略和监管进展。',
    url: 'https://oecd.ai/en/policy-observatory',
    category: 'Regulatory Tracker',
    region: 'Global',
  },
  {
    id: 'ai-verify',
    title: 'AI Verify',
    title_zh: 'AI Verify 测试工具包',
    description: 'Singapore\'s governance testing framework and toolkit for evaluating transparency, robustness, fairness, and other trust signals in AI systems.',
    description_zh: '新加坡推出的 AI 治理测试框架与工具包，可用于检验透明度、稳健性、公平性等可信指标。',
    url: 'https://www.imda.gov.sg/how-we-can-help/ai-verify',
    category: 'Testing Toolkit',
    region: 'Singapore',
  }
];
