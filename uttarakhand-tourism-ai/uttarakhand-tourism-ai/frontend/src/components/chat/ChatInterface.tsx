import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Volume2, VolumeX } from 'lucide-react';
import MessageBubble from './MessageBubble';
import VoiceInput from './VoiceInput';
import { sendChatMessage, getChatSuggestions } from '../../services/api';
import type { Language } from '../../types';
import type { ChatMessage, ConversationHistory } from '../../types/chat';
import { generateId } from '../../utils/helpers';

interface ChatInterfaceProps {
  language: Language;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationHistoryRef = useRef<ConversationHistory[]>([]);

  useEffect(() => {
    loadSuggestions();
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSuggestions = async () => {
    try {
      const response = await getChatSuggestions(language);
      if (response.success && response.suggestions) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      language
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Update conversation history
    conversationHistoryRef.current.push({ role: 'user', content: text });

    try {
      const response = await sendChatMessage(
        text,
        language,
        conversationHistoryRef.current
      );

      if (response.success && response.response) {
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
          language
        };

        setMessages((prev) => [...prev, assistantMessage]);
        conversationHistoryRef.current.push({
          role: 'assistant',
          content: response.response
        });

        // Auto-speak if enabled
        if (autoSpeak) {
          const utterance = new SpeechSynthesisUtterance(response.response);
          const langMap: Record<Language, string> = {
            english: 'en-IN',
            hindi: 'hi-IN',
            garhwali: 'hi-IN',
            kumaoni: 'hi-IN'
          };
          utterance.lang = langMap[language] || 'en-IN';
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }
      } else {
        throw new Error(response.message || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
        language
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
    handleSend(transcript);
  };

  return (
    <div className="flex flex-col h-[650px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Uttarakhand AI Guide</h3>
              <p className="text-xs text-white/80">Your personal tourism assistant</p>
            </div>
          </div>
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all backdrop-blur-sm ${
              autoSpeak
                ? 'bg-green-500/30 hover:bg-green-500/40'
                : 'bg-white/20 hover:bg-white/30'
            }`}
            title={autoSpeak ? 'Auto-speak enabled' : 'Auto-speak disabled'}
          >
            {autoSpeak ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50 backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="text-center mt-12 px-4">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <span className="text-5xl">🏔️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Welcome to Uttarakhand Tourism AI!
            </h3>
            <p className="text-gray-600 mb-2">
              Your intelligent companion for exploring the Land of Gods
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Ask me about places, culture, travel tips, or anything about Uttarakhand
            </p>
            {suggestions.length > 0 && (
              <div className="max-w-2xl mx-auto">
                <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
                  <span>✨</span>
                  <span>Try these quick questions:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-3 bg-white text-left rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-200 group"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        {suggestions.length > 0 && messages.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 font-medium flex items-center">
              💡 Suggestions:
            </span>
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full hover:from-blue-100 hover:to-purple-100 transition-all disabled:opacity-50 border border-gray-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            language={language}
            disabled={isLoading}
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              disabled={isLoading}
            />
            {input.trim() && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                Press Enter ↵
              </span>
            )}
          </div>
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

