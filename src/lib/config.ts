// Configuration file for QuantNova
// Replace the placeholder with your actual Kimi API key

export const CONFIG = {
  // Kimi API Configuration
  // Get your API key from: https://platform.moonshot.cn/
  KIMI_API_KEY: 'sk-VmDVFj89F4qo6ZjyZogqVYKPdhiBXo46eTEKhRtRq5aVPiMH',
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

// Helper to check if API key is configured
export function isApiKeyConfigured(): boolean {
  return CONFIG.KIMI_API_KEY !== 'YOUR_KIMI_API_KEY_HERE' && 
         CONFIG.KIMI_API_KEY.length > 0;
}
