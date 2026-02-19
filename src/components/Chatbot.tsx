import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Trash2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { chatbotService, type ChatMessage } from '@/lib/chatbotService';
import { ScrollArea } from '@/components/ui/scroll-area';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    setMessages(chatbotService.getHistory());

    // Check if offline
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to allow animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        chatWindowRef.current &&
        !chatWindowRef.current.contains(e.target as Node)
      ) {
        // Don't close if clicking the toggle button
        const target = e.target as HTMLElement;
        if (!target.closest('.chatbot-toggle')) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Debounced send handler
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInputValue('');
    setIsLoading(true);
    setShowTyping(true);

    // Add user message immediately
    chatbotService.addMessage(userMessage, 'user');
    setMessages(chatbotService.getHistory());

    try {
      const response = await chatbotService.sendMessage(userMessage);

      // Simulate typing delay for natural feel (300-800ms)
      const typingDelay = Math.max(300, Math.min(800, response.message.length * 15));
      await new Promise(resolve => setTimeout(resolve, typingDelay));

      setShowTyping(false);
      setMessages(chatbotService.getHistory());
    } catch (error) {
      setShowTyping(false);
      setMessages(chatbotService.getHistory());
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleQuickReply = (reply: string) => {
    if (reply === 'View case studies') {
      const element = document.querySelector('#work');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    } else if (reply === 'Book a discovery call') {
      const element = document.querySelector('#contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    } else {
      handleSendMessage(reply);
    }
  };

  const clearChat = () => {
    chatbotService.clearHistory();
    setMessages([]);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(date));
  };

  const quickReplies = chatbotService.getQuickReplies();

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[200]">
      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className={`absolute bottom-16 sm:bottom-20 right-0 w-[calc(100vw-32px)] sm:w-[380px] max-w-[400px] glass-panel overflow-hidden flex flex-col shadow-2xl transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
        style={{ height: 'min(500px, calc(100vh - 120px))', maxHeight: '70vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-[rgba(167,177,216,0.12)] bg-[rgba(11,18,32,0.8)] flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#4F6DFF] to-[#8B9FFF] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[#F4F6FF] text-sm sm:text-base truncate">QuantNova AI</h3>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400' : 'bg-green-400'} animate-pulse`} />
                <span className="text-xs text-[#A7B1D8]">
                  {isOffline ? 'Offline mode' : 'Online'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-2 rounded-lg text-[#A7B1D8] hover:text-[#F4F6FF] hover:bg-[rgba(167,177,216,0.1)] transition-colors"
              title="Clear chat"
              aria-label="Clear chat"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-[#A7B1D8] hover:text-[#F4F6FF] hover:bg-[rgba(167,177,216,0.1)] transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Offline Warning */}
        {isOffline && (
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-400">You're offline. Responses may be limited.</p>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 px-3 sm:px-4 py-4">
          <div className="space-y-3 sm:space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-[#4F6DFF] mx-auto mb-3 sm:mb-4" />
                <p className="text-[#A7B1D8] text-sm px-4">
                  Ask me anything about QuantNova's services, process, or how we can help your business!
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-[rgba(79,109,255,0.2)]'
                      : 'bg-gradient-to-br from-[#4F6DFF] to-[#8B9FFF]'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4F6DFF]" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] sm:max-w-[75%] ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}
                >
                  <div
                    className={`inline-block px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-[#4F6DFF] text-white rounded-br-md'
                        : 'bg-[rgba(167,177,216,0.1)] text-[#F4F6FF] rounded-bl-md'
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className="mt-1 text-[10px] sm:text-xs text-[#A7B1D8]/60">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {showTyping && (
              <div className="flex gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#4F6DFF] to-[#8B9FFF] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="bg-[rgba(167,177,216,0.1)] rounded-2xl rounded-bl-md px-3 sm:px-4 py-2 sm:py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#A7B1D8] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#A7B1D8] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#A7B1D8] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Replies */}
        {messages.length > 0 && messages.length < 4 && !isLoading && (
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-[rgba(167,177,216,0.08)] flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[rgba(79,109,255,0.1)] text-xs text-[#4F6DFF] hover:bg-[rgba(79,109,255,0.2)] transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {reply}
                  <ChevronRight size={12} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="px-3 sm:px-4 py-3 sm:py-4 border-t border-[rgba(167,177,216,0.12)] bg-[rgba(11,18,32,0.8)] flex-shrink-0"
        >
          <div className="flex gap-2 sm:gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-[rgba(7,11,20,0.6)] border border-[rgba(167,177,216,0.2)] rounded-xl px-3 sm:px-4 py-2.5 text-sm text-[#F4F6FF] placeholder:text-[#A7B1D8]/50 focus:outline-none focus:border-[#4F6DFF] focus:ring-1 focus:ring-[#4F6DFF]/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#4F6DFF] text-white flex items-center justify-center hover:bg-[#3d5aee] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chatbot-toggle w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-[rgba(167,177,216,0.2)] text-[#F4F6FF]'
            : 'bg-gradient-to-br from-[#4F6DFF] to-[#8B9FFF] text-white'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <div className="relative">
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </div>
      </button>

      {/* Notification Badge */}
      {!isOpen && messages.length === 0 && (
        <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500 border-2 border-[#070B14] animate-pulse" />
      )}
    </div>
  );
};

export default Chatbot;
