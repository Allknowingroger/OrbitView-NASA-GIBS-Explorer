
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GibsLayer, ViewState } from '../types';
import { X, Send, MessageSquare } from './Icons';
import { generateScienceResponse } from '../services/geminiService';
import { format } from 'date-fns';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    date: Date;
    baseLayer: GibsLayer;
    overlays: GibsLayer[];
    viewState?: ViewState | null;
  };
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose, context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm your AI Earth Science companion. I can help you interpret the satellite imagery you're looking at. Ask me about weather patterns, the specific satellite instruments, or environmental phenomena!",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateScienceResponse(input, {
        date: format(context.date, 'yyyy-MM-dd'),
        layer: context.baseLayer,
        overlays: context.overlays,
        viewState: context.viewState
      });

      const modelMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "I encountered an error analyzing that request. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-white/95 backdrop-blur-md border-l border-gray-200 text-gray-900 z-[1000] flex flex-col shadow-2xl transition-transform duration-300">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-orange-500" size={20} />
          <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            AI Scientist
          </h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <div className={`text-[10px] mt-1 opacity-60 font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about these satellite observations..."
            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-4 pr-12 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none resize-none h-[60px] custom-scrollbar"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-400 font-medium italic">Satellite analysis provided by Gemini</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
