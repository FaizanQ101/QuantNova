export const CONFIG = {
  // Gemini API Configuration (SERVER-SIDE ONLY)
  // Do not put API keys in client code. The app calls `/api/chat` (Vercel function) instead.
  GEMINI_API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
  GEMINI_MODEL: 'gemini-1.5-flash', // Options: gemini-1.5-flash, gemini-1.5-pro, gemini-1.5-pro-latest

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

// The Gemini API key must be configured as a SERVER env var on Vercel: `GEMINI_API_KEY`.
