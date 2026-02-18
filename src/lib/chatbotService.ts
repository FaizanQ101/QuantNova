import { findRelevantDocuments, buildContext, type KnowledgeDocument } from '@/data/knowledgeBase';
import { CONFIG, isApiKeyConfigured } from './config';

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

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are a helpful AI assistant for QuantNova, an AI and software consultancy studio. 
Your role is to answer questions about QuantNova's services, process, case studies, and capabilities.

Use the provided context to answer questions accurately. If the context doesn't contain the answer, 
be honest and say you don't have that specific information, but offer to connect them with the team.

Guidelines:
- Be professional, friendly, and concise
- Use the context provided to answer accurately
- If asked about pricing, mention that it varies by project and encourage a discovery call
- If asked about something not in the context, suggest contacting hello@quantnova.studio
- Always maintain a helpful, consultative tone
- Keep responses under 3-4 sentences when possible

Context information will be provided below:`;

// Fallback responses when API is not configured
const FALLBACK_RESPONSES: Record<string, string> = {
  greeting: "Hello! I'm the QuantNova AI assistant. I'd be happy to help you learn about our AI and software development services. What would you like to know?",
  services: "QuantNova offers AI Strategy & Roadmapping, Intelligent Product Design, ML Engineering & Integration, Web/Mobile App Development, and LLM/ChatBot solutions. Would you like details on any specific service?",
  contact: "You can reach us through the contact form on this page or email hello@quantnova.studio. We typically respond within 2 business days!",
  pricing: "Our pricing varies based on project scope and requirements. Book a discovery call through our contact form for a customized quote.",
  default: "Thank you for your interest in QuantNova! To get detailed information about that, please fill out our contact form or email hello@quantnova.studio. Our team will get back to you within 2 business days."
};

class ChatbotService {
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    this.loadHistory();
  }

  private loadHistory(): void {
    try {
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
    localStorage.removeItem('quantnova_chat_history');
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getFallbackResponse(query: string): ChatResponse {
    const normalizedQuery = query.toLowerCase();
    
    if (normalizedQuery.match(/^(hi|hello|hey|greetings)/)) {
      return { message: FALLBACK_RESPONSES.greeting, sources: [] };
    }
    if (normalizedQuery.includes('service') || normalizedQuery.includes('offer')) {
      return { message: FALLBACK_RESPONSES.services, sources: [] };
    }
    if (normalizedQuery.includes('contact') || normalizedQuery.includes('email') || normalizedQuery.includes('reach')) {
      return { message: FALLBACK_RESPONSES.contact, sources: [] };
    }
    if (normalizedQuery.includes('price') || normalizedQuery.includes('cost') || normalizedQuery.includes('budget')) {
      return { message: FALLBACK_RESPONSES.pricing, sources: [] };
    }
    
    return { message: FALLBACK_RESPONSES.default, sources: [] };
  }

  async sendMessage(userMessage: string): Promise<ChatResponse> {
    // Add user message to history
    const userMsg: ChatMessage = {
      id: this.generateId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    this.conversationHistory.push(userMsg);

    // Retrieve relevant documents
    const relevantDocs = findRelevantDocuments(userMessage, CONFIG.CHATBOT.TOP_K_RETRIEVAL);
    const context = buildContext(relevantDocs);

    // If API key is not configured, use fallback responses
    if (!isApiKeyConfigured()) {
      const fallback = this.getFallbackResponse(userMessage);
      
      const assistantMsg: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: fallback.message,
        timestamp: new Date(),
        sources: fallback.sources
      };
      this.conversationHistory.push(assistantMsg);
      this.saveHistory();
      
      return fallback;
    }

    try {
      // Build messages for API
      const messages = [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\nContext:\n${context}` },
        ...this.conversationHistory.slice(-6).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      // Call Kimi API
      const response = await fetch(`${CONFIG.KIMI_API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.KIMI_API_KEY}`
        },
        body: JSON.stringify({
          model: CONFIG.KIMI_MODEL,
          messages,
          temperature: CONFIG.CHATBOT.TEMPERATURE,
          max_tokens: CONFIG.CHATBOT.MAX_TOKENS,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content || 
        "I apologize, but I'm having trouble processing your request. Please try again or contact us directly.";

      const assistantMsg: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        sources: relevantDocs
      };
      this.conversationHistory.push(assistantMsg);
      this.saveHistory();

      return {
        message: assistantContent,
        sources: relevantDocs
      };

    } catch (error) {
      console.error('Chatbot API error:', error);
      
      // Fallback to local response on API error
      const fallback = this.getFallbackResponse(userMessage);
      
      const assistantMsg: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: fallback.message + " (Note: I'm currently running in offline mode)",
        timestamp: new Date(),
        sources: []
      };
      this.conversationHistory.push(assistantMsg);
      this.saveHistory();

      return {
        message: fallback.message,
        sources: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Quick replies for common questions
  getQuickReplies(): string[] {
    return [
      "What services do you offer?",
      "Tell me about your process",
      "View case studies",
      "How much does it cost?",
      "Book a discovery call"
    ];
  }
}

export const chatbotService = new ChatbotService();
