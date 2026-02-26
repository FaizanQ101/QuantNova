import { findRelevantDocuments, type KnowledgeDocument } from '@/data/knowledgeBase';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: KnowledgeDocument[];
}

export interface ChatResponse {
  message: string;
  sources: KnowledgeDocument[];
  error?: string;
}

// Enhanced fallback responses with more detailed answers
const FALLBACK_RESPONSES: Record<string, string> = {
  greeting: "Hello! I'm the QuantNova AI assistant. I can help you learn about our AI strategy, product design, and ML engineering services. What would you like to know?",

  services: "QuantNova offers: 1) AI Strategy & Roadmapping - defining the right AI bets and rollout plans, 2) Intelligent Product Design - making complex AI models feel simple, and 3) ML Engineering & Integration - building reliable pipelines and monitoring systems.",

  contact: "You can reach us through the contact form on this page or email hello@quantnova.studio. We typically respond within 2 business days! You can also book a discovery call directly through our website.",

  pricing: "Our pricing varies based on project scope and requirements. We offer flexible engagement models including project-based pricing, retainers, and dedicated teams. Book a discovery call for a customized quote.",

  process: "Our process follows three steps: 1) Discover - map decisions, data, and constraints, 2) Prototype - build the smallest useful system fast, 3) Scale - harden, integrate, and measure outcomes.",

  timeline: "Project timelines vary by scope. A typical MVP takes 6-10 weeks, while full-scale implementations range from 3-6 months. We use agile methodologies with 2-week sprints.",

  case_studies: "We've delivered results like: 23% overstock reduction for retail clients, 40% faster ticket resolution for SaaS companies, and sub-second risk decisions for fintech. Check out our case studies section for details.",

  default: "I appreciate your question! To get the most accurate information about that, please fill out our contact form or email hello@quantnova.studio. Our team will get back to you within 2 business days with detailed information."
};

// Simple in-memory cache for common queries
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

class ChatbotService {
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    this.loadHistory();
  }

  private loadHistory(): void {
    try {
      if (typeof window === 'undefined') return;
      const saved = localStorage.getItem('quantnova_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.conversationHistory = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
      this.conversationHistory = [];
    }
  }

  private saveHistory(): void {
    try {
      if (typeof window === 'undefined') return;
      // Keep only last 50 messages
      const toSave = this.conversationHistory.slice(-50);
      localStorage.setItem('quantnova_chat_history', JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }

  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  clearHistory(): void {
    this.conversationHistory = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quantnova_chat_history');
    }
    // Clear cache as well
    responseCache.clear();
  }

  addMessage(content: string, role: 'user' | 'assistant'): void {
    const message: ChatMessage = {
      id: this.generateId(),
      role,
      content,
      timestamp: new Date(),
    };
    this.conversationHistory.push(message);
    this.saveHistory();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getCachedResponse(query: string): string | null {
    const normalizedQuery = query.toLowerCase().trim();
    const cached = responseCache.get(normalizedQuery);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.response;
    }
    return null;
  }

  private cacheResponse(query: string, response: string): void {
    const normalizedQuery = query.toLowerCase().trim();
    responseCache.set(normalizedQuery, { response, timestamp: Date.now() });

    // Limit cache size
    if (responseCache.size > 100) {
      const firstKey = responseCache.keys().next().value;
      if (firstKey) {
        responseCache.delete(firstKey);
      }
    }
  }

  private getFallbackResponse(query: string): ChatResponse {
    const normalizedQuery = query.toLowerCase();

    // Check cache first
    const cached = this.getCachedResponse(query);
    if (cached) {
      return { message: cached, sources: [] };
    }

    let response: string;

    // Greeting patterns
    if (normalizedQuery.match(/^(hi|hello|hey|greetings|good (morning|afternoon|evening))/)) {
      response = FALLBACK_RESPONSES.greeting;
    }
    // Services patterns
    else if (normalizedQuery.includes('service') || normalizedQuery.includes('offer') || normalizedQuery.includes('do you do') || normalizedQuery.includes('what can you')) {
      response = FALLBACK_RESPONSES.services;
    }
    // Process patterns
    else if (normalizedQuery.includes('process') || normalizedQuery.includes('how do you work') || normalizedQuery.includes('methodology')) {
      response = FALLBACK_RESPONSES.process;
    }
    // Contact patterns
    else if (normalizedQuery.includes('contact') || normalizedQuery.includes('email') || normalizedQuery.includes('reach') || normalizedQuery.includes('get in touch')) {
      response = FALLBACK_RESPONSES.contact;
    }
    // Pricing patterns
    else if (normalizedQuery.includes('price') || normalizedQuery.includes('cost') || normalizedQuery.includes('budget') || normalizedQuery.includes('how much') || normalizedQuery.includes('rate')) {
      response = FALLBACK_RESPONSES.pricing;
    }
    // Timeline patterns
    else if (normalizedQuery.includes('timeline') || normalizedQuery.includes('how long') || normalizedQuery.includes('duration') || normalizedQuery.includes('time')) {
      response = FALLBACK_RESPONSES.timeline;
    }
    // Case study patterns
    else if (normalizedQuery.includes('case study') || normalizedQuery.includes('example') || normalizedQuery.includes('portfolio') || normalizedQuery.includes('work')) {
      response = FALLBACK_RESPONSES.case_studies;
    }
    // About patterns
    else if (normalizedQuery.includes('about') || normalizedQuery.includes('who are you') || normalizedQuery.includes('what is quantnova')) {
      response = "QuantNova is an AI and software consultancy that designs systems that think, adapt, and ship. We help teams move faster with confidence by pairing modern AI infrastructure with disciplined product craft.";
    }
    // Tech stack patterns
    else if (normalizedQuery.includes('tech') || normalizedQuery.includes('stack') || normalizedQuery.includes('technology') || normalizedQuery.includes('tools')) {
      response = "We work with React, TypeScript, Python, TensorFlow, PyTorch, AWS, and other modern technologies. Our stack is tailored to each project's needs.";
    }
    else {
      response = FALLBACK_RESPONSES.default;
    }

    // Cache the response
    this.cacheResponse(query, response);

    return { message: response, sources: [] };
  }

  async sendMessage(userMessage: string): Promise<ChatResponse> {
    // Check cache first
    const cached = this.getCachedResponse(userMessage);
    if (cached) {
      this.addMessage(cached, 'assistant');
      return { message: cached, sources: [] };
    }

    // Retrieve relevant documents using improved RAG
    const relevantDocs = findRelevantDocuments(userMessage, 5);

    // If we have relevant documents, use them for a better response
    if (relevantDocs.length > 0 && relevantDocs[0]) {
      const topDoc = relevantDocs[0];
      let response = '';

      // Generate contextual response based on the most relevant document
      switch (topDoc.category) {
        case 'Services':
          response = `${topDoc.content} Would you like to learn more about how we can help with your specific needs?`;
          break;
        case 'Case Studies':
          response = `${topDoc.content} Interested in discussing how we could achieve similar results for your business?`;
          break;
        case 'Process':
          response = `${topDoc.content} This approach ensures we deliver value quickly while building for long-term success.`;
          break;
        case 'About':
          response = topDoc.content;
          break;
        default:
          response = topDoc.content;
      }

      this.addMessage(response, 'assistant');
      this.cacheResponse(userMessage, response);

      return {
        message: response,
        sources: relevantDocs
      };
    }

    // Fallback to keyword-based responses
    const fallback = this.getFallbackResponse(userMessage);
    this.addMessage(fallback.message, 'assistant');

    return fallback;
  }

  // Quick replies for common questions
  getQuickReplies(): string[] {
    const recentMessages = this.conversationHistory.slice(-3);
    const hasAskedAboutServices = recentMessages.some(m =>
      m.content.toLowerCase().includes('service') || m.content.toLowerCase().includes('offer')
    );

    if (hasAskedAboutServices) {
      return [
        "Tell me about your process",
        "View case studies",
        "How much does it cost?",
        "Book a discovery call"
      ];
    }

    return [
      "What services do you offer?",
      "Tell me about your process",
      "View case studies",
      "Book a discovery call"
    ];
  }
}

export const chatbotService = new ChatbotService();
