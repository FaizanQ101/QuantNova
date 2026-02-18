export const CONFIG = {
  // Kimi API Configuration (SERVER-SIDE ONLY)
  // Do not put API keys in client code. The app calls `/api/chat` (Vercel function) instead.
  KIMI_API_BASE_URL: 'https://api.moonshot.cn/v1',
  KIMI_MODEL: 'moonshot-v1-8k', // Options: moonshot-v1-8k, moonshot-v1-32k, moonshot-v1-128k
  
  // Chatbot Configuration
  CHATBOT: {
    MAX_CONTEXT_LENGTH: 4000,
    TEMPERATURE: 0.7,
    MAX_TOKENS: 1000,
    TOP_K_RETRIEVAL: 3,
  },
  
  // Company Info
  COMPANY: {
    NAME: 'QuantNova',
    EMAIL: 'hello@quantnova.studio',
    WEBSITE: 'https://quantnova.studio',
  }
};

// The Kimi API key must be configured as a SERVER env var on Vercel: `KIMI_API_KEY`.
