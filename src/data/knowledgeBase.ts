export interface KnowledgeDocument {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

export const knowledgeBase: KnowledgeDocument[] = [
  {
    id: "about-1",
    category: "About",
    title: "About QuantNova",
    content: "QuantNova is an AI and software consultancy studio that designs systems that think, adapt, and ship. We help teams move faster with confidence by pairing modern AI infrastructure with disciplined product craft. Our mission is to engineer intelligence that delivers measurable results.",
    keywords: ["about", "quantnova", "company", "mission", "who are you", "what is"]
  },
  {
    id: "services-overview",
    category: "Services",
    title: "Our Services Overview",
    content: "QuantNova offers three core services: AI Strategy & Roadmapping, Intelligent Product Design, and ML Engineering & Integration. We provide end-to-end support from first principles to production, helping businesses define the right AI bets, design intuitive interfaces, and build reliable ML pipelines.",
    keywords: ["services", "what do you offer", "capabilities", "solutions", "help"]
  },
  {
    id: "service-ai-strategy",
    category: "Services",
    title: "AI Strategy & Roadmapping",
    content: "Our AI Strategy & Roadmapping service helps you define the right bets, data needs, and rollout plan. We work with your team to identify high-impact AI opportunities, assess data readiness, create implementation roadmaps, and establish success metrics. This ensures your AI investments deliver ROI from day one.",
    keywords: ["strategy", "roadmap", "planning", "consulting", "ai strategy", "advisory", "consultation"]
  },
  {
    id: "service-product-design",
    category: "Services",
    title: "Intelligent Product Design",
    content: "We design interfaces that make complex AI models feel simple and intuitive. Our Intelligent Product Design service covers UX research, AI-native interface design, prototyping, usability testing, and design systems. We ensure your AI-powered products are not just powerful, but delightful to use.",
    keywords: ["design", "ui", "ux", "interface", "product design", "prototype", "user experience"]
  },
  {
    id: "service-ml-engineering",
    category: "Services",
    title: "ML Engineering & Integration",
    content: "Our ML Engineering service delivers reliable pipelines, monitoring, and shipping discipline. We build production-grade ML systems including model development, MLOps infrastructure, API integration, performance monitoring, and continuous improvement workflows. We ensure your models work reliably at scale.",
    keywords: ["engineering", "ml", "machine learning", "development", "integration", "pipeline", "api", "model"]
  },
  {
    id: "web-mobile-apps",
    category: "Services",
    title: "Web & Mobile Application Development",
    content: "QuantNova builds modern web and mobile applications using cutting-edge technologies. We specialize in React, React Native, TypeScript, and cloud-native architectures. Whether you need a customer-facing app, internal tool, or AI-powered platform, we deliver scalable, performant solutions.",
    keywords: ["web app", "mobile app", "application", "development", "react", "app development", "software"]
  },
  {
    id: "ai-solutions",
    category: "Services",
    title: "Applied AI Solutions",
    content: "We implement practical AI solutions that solve real business problems. Our expertise includes LLM integration, chatbot development, AI agents, natural language processing, computer vision, predictive analytics, and recommendation systems. We focus on AI that delivers tangible business value.",
    keywords: ["ai", "artificial intelligence", "llm", "chatbot", "agents", "nlp", "machine learning", "automation"]
  },
  {
    id: "llm-services",
    category: "Services",
    title: "LLM & ChatBot Development",
    content: "We build custom LLM-powered applications including intelligent chatbots, document analysis tools, code assistants, and content generation systems. We work with leading models (GPT, Claude, Llama) and implement RAG (Retrieval-Augmented Generation) for accurate, context-aware responses.",
    keywords: ["llm", "large language model", "chatbot", "gpt", "claude", "rag", "generative ai", "openai"]
  },
  {
    id: "ai-agents",
    category: "Services",
    title: "AI Agents & Automation",
    content: "We develop autonomous AI agents that can perform complex tasks, make decisions, and integrate with your existing systems. From customer service agents to data processing automation, we build agents that understand context, take actions, and learn from feedback.",
    keywords: ["agents", "ai agents", "automation", "autonomous", "workflow", "process automation"]
  },
  {
    id: "process",
    category: "Process",
    title: "Our Process",
    content: "We follow a clear three-step process: Discover (map decisions, data, and constraints), Prototype (build the smallest useful system fast), and Scale (harden, integrate, and measure outcomes). This iterative approach ensures we deliver value quickly while building for long-term success.",
    keywords: ["process", "methodology", "how we work", "approach", "steps", "workflow"]
  },
  {
    id: "case-study-1",
    category: "Case Studies",
    title: "Demand Forecasting Platform - Retail",
    content: "We built a demand forecasting platform for a retail client that reduced overstock by 23% in 90 days. The system uses machine learning to predict product demand across hundreds of SKUs, optimizing inventory levels and reducing waste while maintaining stock availability.",
    keywords: ["retail", "forecasting", "inventory", "case study", "example", "success story"]
  },
  {
    id: "case-study-2",
    category: "Case Studies",
    title: "Customer Support Copilot - SaaS",
    content: "We developed an AI-powered customer support copilot for a SaaS company that cut ticket resolution time by 40%. The system suggests responses, automates common queries, and provides agents with relevant context from knowledge bases and previous interactions.",
    keywords: ["saas", "support", "customer service", "copilot", "automation", "case study"]
  },
  {
    id: "case-study-3",
    category: "Case Studies",
    title: "Risk Scoring Dashboard - Fintech",
    content: "We created a real-time risk scoring dashboard for a fintech client enabling sub-second decisions with full explainability. The ML model evaluates transaction risk while providing clear explanations for each decision, ensuring compliance and building trust.",
    keywords: ["fintech", "risk", "dashboard", "finance", "scoring", "case study", "real-time"]
  },
  {
    id: "tech-stack",
    category: "Technology",
    title: "Our Technology Stack",
    content: "We use modern, proven technologies including: Frontend (React, TypeScript, Next.js, Tailwind CSS), Mobile (React Native, Flutter), Backend (Node.js, Python, Go), AI/ML (TensorFlow, PyTorch, LangChain, OpenAI, Hugging Face), Cloud (AWS, GCP, Azure, Vercel), and Databases (PostgreSQL, MongoDB, Redis, Vector DBs).",
    keywords: ["tech stack", "technologies", "tools", "framework", "python", "react", "aws", "cloud"]
  },
  {
    id: "pricing",
    category: "Pricing",
    title: "Pricing & Engagement",
    content: "We offer flexible engagement models including project-based pricing, retainer agreements, and dedicated teams. Each engagement starts with a discovery call to understand your needs and provide a customized proposal. Contact us for a detailed quote tailored to your project requirements.",
    keywords: ["pricing", "cost", "budget", "how much", "rate", "engagement", "hire", "contract"]
  },
  {
    id: "contact",
    category: "Contact",
    title: "Contact Information",
    content: "You can reach us through the contact form on our website, or email us directly at hello@quantnova.studio. We typically respond within 2 business days. You can also book a discovery call directly through our website to discuss your project.",
    keywords: ["contact", "email", "reach", "get in touch", "phone", "call", "message"]
  },
  {
    id: "timeline",
    category: "Process",
    title: "Project Timeline",
    content: "Project timelines vary based on scope and complexity. A typical MVP takes 6-10 weeks, while full-scale implementations range from 3-6 months. We use agile methodologies with 2-week sprints, providing regular demos and maintaining transparent communication throughout.",
    keywords: ["timeline", "how long", "duration", "time", "weeks", "months", "delivery"]
  },
  {
    id: "team",
    category: "About",
    title: "Our Team",
    content: "QuantNova is led by experienced AI researchers, software engineers, and product designers. Our team combines deep technical expertise in machine learning with strong product sensibilities. We've shipped products at leading tech companies and startups, bringing that experience to every client engagement.",
    keywords: ["team", "who", "people", "experts", "engineers", "developers", "staff"]
  },
  {
    id: "industries",
    category: "About",
    title: "Industries We Serve",
    content: "We work across multiple industries including Retail & E-commerce, Financial Services, Healthcare, SaaS & Technology, Manufacturing, and Logistics. Our cross-industry experience allows us to bring best practices and innovative solutions to every project.",
    keywords: ["industries", "sector", "vertical", "retail", "fintech", "healthcare", "who do you work with"]
  },
  {
    id: "why-us",
    category: "About",
    title: "Why Choose QuantNova",
    content: "Choose QuantNova for: 99.97% uptime on production systems, <120ms average inference response, 3x faster time-to-decision vs baseline, end-to-end expertise from strategy to deployment, transparent communication, and a focus on measurable business outcomes. We're not just building AI—we're building your competitive advantage.",
    keywords: ["why", "choose", "different", "advantage", "benefits", "why quantnova", "best"]
  }
];

// Simple embedding function using keyword matching for RAG
export function findRelevantDocuments(query: string, topK: number = 3): KnowledgeDocument[] {
  const normalizedQuery = query.toLowerCase();
  const queryWords = normalizedQuery.split(/\s+/);
  
  const scored = knowledgeBase.map(doc => {
    let score = 0;
    
    // Check keyword matches
    doc.keywords.forEach(keyword => {
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        score += 3; // Direct keyword match
      }
      
      // Check if any query word matches keyword
      queryWords.forEach(word => {
        if (keyword.toLowerCase().includes(word) && word.length > 2) {
          score += 1;
        }
      });
    });
    
    // Check title matches
    if (normalizedQuery.includes(doc.title.toLowerCase())) {
      score += 2;
    }
    
    // Check content matches
    queryWords.forEach(word => {
      if (word.length > 3 && doc.content.toLowerCase().includes(word)) {
        score += 0.5;
      }
    });
    
    return { doc, score };
  });
  
  // Sort by score and return top K
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.doc);
}

export function buildContext(documents: KnowledgeDocument[]): string {
  if (documents.length === 0) {
    return "No specific information found.";
  }
  
  return documents
    .map((doc, i) => `[${i + 1}] ${doc.title}: ${doc.content}`)
    .join("\n\n");
}
