# QuantNova Chatbot Setup Guide

## Overview

Your QuantNova website now includes a RAG (Retrieval-Augmented Generation) based chatbot that can answer questions about your services, process, and capabilities.

## Files Created

1. **`src/data/knowledgeBase.ts`** - Contains all company information, services, case studies, and FAQs
2. **`src/lib/config.ts`** - Configuration file with Kimi API settings
3. **`src/lib/chatbotService.ts`** - RAG retrieval logic and Kimi API integration
4. **`src/components/Chatbot.tsx`** - Chatbot UI component

## Setting Up Kimi API

### Step 1: Get Your API Key

1. Visit [Kimi Platform](https://platform.moonshot.cn/)
2. Create an account or log in
3. Navigate to API Keys section
4. Generate a new API key

### Step 2: Update the Configuration

Open `src/lib/config.ts` and replace the placeholder:

```typescript
export const CONFIG = {
  // IMPORTANT: Never put KIMI_API_KEY in client code.
  // Configure it as a server environment variable on Vercel instead.
  // ... rest of config
};
```

### Step 3: Rebuild and Redeploy

```bash
npm run build
# Then deploy the dist folder
```

## How RAG Works

1. **User asks a question** → Chatbot receives the query
2. **Document Retrieval** → System searches knowledge base for relevant documents based on keywords
3. **Context Building** → Retrieved documents are combined into a context string
4. **API Call** → Context + user query are sent to Kimi API
5. **Response** → AI generates an answer based on the provided context

## Knowledge Base Contents

The chatbot knows about:

- **Company Info**: About QuantNova, team, industries served
- **Services**: AI Strategy, Product Design, ML Engineering, Web/Mobile Apps, LLMs, ChatBots, AI Agents
- **Process**: Discover → Prototype → Scale methodology
- **Case Studies**: Retail forecasting, SaaS support copilot, Fintech risk dashboard
- **Technology Stack**: React, Python, AWS, TensorFlow, etc.
- **Pricing & Contact**: General pricing info and contact details

## Customizing the Knowledge Base

To add more information, edit `src/data/knowledgeBase.ts`:

```typescript
{
  id: "your-topic",
  category: "Category",
  title: "Topic Title",
  content: "Detailed information here...",
  keywords: ["keyword1", "keyword2", "keyword3"]
}
```

## Features

- **Persistent Chat History**: Conversations are saved in localStorage
- **Quick Replies**: Pre-defined questions for common queries
- **Typing Indicator**: Shows when the bot is "thinking"
- **Offline Mode**: Works without API key using fallback responses
- **Source Tracking**: Can show which knowledge documents were used
- **Mobile Responsive**: Works on all screen sizes

## Troubleshooting

### Chatbot shows "Offline mode"
- API key is not configured or is invalid
- Check the config.ts file

### Responses are not accurate
- Add more relevant keywords to knowledge documents
- Expand the content in knowledgeBase.ts
- Adjust TOP_K_RETRIEVAL value in config.ts

### API errors
- Verify your API key is valid
- Check your Kimi API quota/billing
- Review browser console for error details

## API Usage Notes

- The chatbot uses the `moonshot-v1-8k` model by default
- Each conversation includes the last 6 messages for context
- Token usage depends on conversation length and knowledge context size

## Security

- Never commit your actual API key to version control
- The API key is only used client-side for demo purposes
- For production, consider using a backend proxy to protect your API key
