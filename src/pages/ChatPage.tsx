import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { QuickActions } from '../components/chat/QuickActions';
// import { LoadingSpinner } from '../components/ui/Button';
import type { Message } from '../types';
import { apiService } from '../services/api';
import { Bot } from 'lucide-react';
import { useChatSession } from '../contexts/useChatSession';

const ChatPage: React.FC = () => {
  // const [messages, setMessages] = useState<Message[]>([]);
  const [messages, setMessages, clearChat] = useChatSession<Message[]>('tpc_chat_history', []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting message
    if (messages.length === 0) {
      const greeting: Message = {
        id: '1',
        content: "Hello! I'm your TPC Query Assistant. I can help with information about placement eligibility, registration rules, and general policies. How can I assist you today?",
        sender: 'ai',
        timestamp: new Date(),
        requiresHumanIntervention: false,
      };
      setMessages([greeting]);
    }
  }, [messages, setMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call API
      const response = await apiService.sendMessage({ message: content });

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'ai',
        timestamp: new Date(),
        requiresHumanIntervention: !!response.requiresHumanIntervention,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request. Please try again or contact the TPC coordinator.',
        sender: 'ai',
        timestamp: new Date(),
        requiresHumanIntervention: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (message: string) => {
    handleSendMessage(message);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          onClearChat={clearChat}
        />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Messages */}
            {messages.length === 1 && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-400 rounded-full mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to TPC Query Assistant
                </h2>
                <p className="text-gray-600 mb-6">
                  Ask me anything about placement policies, eligibility, and procedures
                </p>
                <QuickActions
                  onSelectAction={handleQuickAction}
                  disabled={isLoading}
                />
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                requiresHumanIntervention={message.sender === 'ai' && message.requiresHumanIntervention}
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center px-4 py-3 bg-gray-100 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;