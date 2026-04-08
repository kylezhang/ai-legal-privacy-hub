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
    category: 'Data Protection',
    region: 'UK',
  },
  {
    id: 'nist-ai-rmf',
    title: 'NIST AI Risk Management Framework',
    title_zh: 'NIST AI 风险管理框架',
    description: 'A voluntary framework for managing risks when designing, developing, deploying, or using AI systems.',
    description_zh: '美国国家标准与技术研究院 (NIST) 发布的自愿性框架，用于管理 AI 系统设计、开发、部署或使用过程中的风险。',
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
    category: 'AI Regulation',
    region: 'USA',
  },
  {
    id: 'edpb-guidelines',
    title: 'EDPB Guidelines on AI',
    title_zh: 'EDPB AI 指南汇总',
    description: 'Comprehensive guidelines from the European Data Protection Board on AI and GDPR compliance.',
    description_zh: '欧洲数据保护委员会 (EDPB) 发布的关于 AI 与 GDPR 合规性的全面指南。',
    url: 'https://edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_en',
    category: 'Data Protection',
    region: 'EU',
  },
  {
    id: 'ftc-ai-guidance',
    title: 'FTC Business Guidance on AI',
    title_zh: 'FTC AI 商业指南',
    description: 'The Federal Trade Commission\'s guidance for businesses using AI tools while maintaining consumer privacy.',
    description_zh: '美国联邦贸易委员会 (FTC) 为使用 AI 工具的企业提供的关于维护消费者隐私的指导。',
    url: 'https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check',
    category: 'Privacy',
    region: 'USA', 
  },
  {
    id: 'oecd-ai-policy',
    title: 'OECD AI Policy Observatory',
    title_zh: 'OECD AI 政策观察站',
    description: 'A platform for AI policy analysis and data, providing tools to compare AI policies globally.',
    description_zh: '经合组织 (OECD) 提供的 AI 政策分析与数据平台，包含对比全球 AI 政策的各类工具。',
    url: 'https://oecd.ai/en/policy-observatory',
    category: 'Global Policy',
    region: 'Global',
  }
];

