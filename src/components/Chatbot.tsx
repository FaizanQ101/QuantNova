import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Loader2,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { chatbotService, type ChatMessage } from '@/lib/chatbotService';
import { ScrollArea } from '@/components/ui/scroll-area';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [apiConfigured] = useState(true); // API is handled server-side via /api/chat
  
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load chat history on mount
  useEffect(() => {
    setMessages(chatbotService.getHistory());
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
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Animate chat window
  useEffect(() => {
    if (chatWindowRef.current) {
      if (isOpen) {
        gsap.fromTo(
          chatWindowRef.current,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
    }
  }, [isOpen]);

  // Send welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleSendMessage("Hello! What can you tell me about QuantNova?");
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInputValue('');
    setIsLoading(true);
    setShowTyping(true);

    // Update messages immediately with user message
    setMessages(chatbotService.getHistory());

    try {
      await chatbotService.sendMessage(userMessage);
      
      // Small delay for natural feel
      setTimeout(() => {
        setShowTyping(false);
        setMessages(chatbotService.getHistory());
        setIsLoading(false);
      }, 500);
    } catch (error) {
      setShowTyping(false);
      setIsLoading(false);
      setMessages(chatbotService.getHistory());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleQuickReply = (reply: string) => {
    if (reply === "View case studies") {
      const element = document.querySelector('#work');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    } else if (reply === "Book a discovery call") {
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
    <div className="fixed bottom-6 right-6 z-[200]">
      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="absolute bottom-20 right-0 w-[90vw] max-w-[400px] h-[500px] max-h-[70vh] glass-panel overflow-hidden flex flex-col shadow-2xl"
          style={{ opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(167,177,216,0.12)] bg-[rgba(11,18,32,0.8)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F6DFF] to-[#8B9FFF] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#F4F6FF]">QuantNova AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-[#A7B1D8]">
                    {apiConfigured ? 'Online' : 'Offline mode'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-2 rounded-lg text-[#A7B1D8] hover:text-[#F4F6FF] hover:bg-[rgba(167,177,216,0.1)] transition-colors"
                title="Clear chat"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-[#A7B1D8] hover:text-[#F4F6FF] hover:bg-[rgba(167,177,216,0.1)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-[#4F6DFF] mx-auto mb-4" />
                  <p className="text-[#A7B1D8] text-sm">
                    Ask me anything about QuantNova's services, process, or how we can help your business!
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-[rgba(79,109,255,0.2)]'
                        : 'bg-gradient-to-br from-[#4F6DFF] to-[#8B9FFF]'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-[#4F6DFF]" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-[#4F6DFF] text-white rounded-br-md'
                          : 'bg-[rgba(167,177,216,0.1)] text-[#F4F6FF] rounded-bl-md'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="mt-1 text-xs text-[#A7B1D8]/60">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {showTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F6DFF] to-[#8B9FFF] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[rgba(167,177,216,0.1)] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#A7B1D8] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#A7B1D8] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#A7B1D8] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          {messages.length > 0 && messages.length < 4 && (
            <div className="px-4 py-2 border-t border-[rgba(167,177,216,0.08)]">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[rgba(79,109,255,0.1)] text-xs text-[#4F6DFF] hover:bg-[rgba(79,109,255,0.2)] transition-colors whitespace-nowrap"
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
            className="px-4 py-4 border-t border-[rgba(167,177,216,0.12)] bg-[rgba(11,18,32,0.8)]"
          >
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-[rgba(7,11,20,0.6)] border border-[rgba(167,177,216,0.2)] rounded-xl px-4 py-2.5 text-sm text-[#F4F6FF] placeholder:text-[#A7B1D8]/50 focus:outline-none focus:border-[#4F6DFF] focus:ring-1 focus:ring-[#4F6DFF]/20 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-[#4F6DFF] text-white flex items-center justify-center hover:bg-[#3d5aee] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      )}

      {/* Floating Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-[rgba(167,177,216,0.2)] text-[#F4F6FF]'
            : 'bg-gradient-to-br from-[#4F6DFF] to-[#8B9FFF] text-white'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Notification Badge */}
      {!isOpen && messages.length === 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#070B14]" />
      )}
    </div>
  );
};

export default Chatbot;
