import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Goal } from '../types';
import { Bot, ChevronDown, ChevronUp, Loader2, Send, Sparkles, User } from 'lucide-react';

interface AiTutorProps {
  decisionTitle: string;
  optionATitle: string;
  optionBTitle: string;
  goal: Goal;
}

export const AiTutor: React.FC<AiTutorProps> = ({
  decisionTitle,
  optionATitle,
  optionBTitle,
  goal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: 'Merhaba! Karar vermeden önce seçeneklerin olası yan etkilerini tartmak ister misin?',
      timestamp: 'Şimdi',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, errorNotice]);

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || inputVal).trim();
    if (!textToSend || isLoading) return;

    setErrorNotice(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decisionTitle,
          optionA: optionATitle,
          optionB: optionBTitle,
          goal,
          question: textToSend,
          history: newHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMsg =
          errorData?.error ||
          'Tutor şu anda yanıt veremiyor, lütfen birkaç saniye sonra tekrar dene.';
        setErrorNotice(errorMsg);
        return;
      }

      const data = await response.json();
      if (data.reply) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setErrorNotice('Tutor şu anda yanıt veremiyor, lütfen birkaç saniye sonra tekrar dene.');
      }
    } catch (err) {
      console.error(err);
      setErrorNotice('Tutor şu anda yanıt veremiyor, lütfen birkaç saniye sonra tekrar dene.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'En büyük risk nedir?',
    'Veri tabanını nasıl etkiler?',
    'Semptom mu kök neden mi?',
  ];

  return (
    <div className="w-full rounded-2xl bg-[#16264A] border border-[#2A3B63] overflow-hidden transition-all shadow-md">
      {/* Header bar / Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1E2E54]/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F5A23A]/10 border border-[#F5A23A]/30 text-[#F5A23A] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-semibold text-sm text-[#D8E2FF]">
                Tutor'a sor
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2A3B63] text-[#F5A23A]">
                Sokratik Rehber
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Cevabı doğrudan söylemez; doğru karara ulaşman için soru sorar.
            </p>
          </div>
        </div>

        <div className="text-[#94A3B8] p-1">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expanded Chat Area */}
      {isOpen && (
        <div className="border-t border-[#2A3B63] p-4 bg-[#0F1B33]/60 space-y-3">
          {/* Messages Container */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                data-testid="tutor-message"
                className={`flex gap-2.5 text-xs sm:text-sm ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="w-6 h-6 rounded-full bg-[#F5A23A]/20 text-[#F5A23A] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#F5A23A] text-[#0F1B33] font-medium rounded-br-none'
                      : 'bg-[#16264A] text-[#D8E2FF] border border-[#2A3B63] rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-[#2A3B63] text-[#D8E2FF] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#F5A23A] p-2 bg-[#16264A] rounded-lg border border-[#2A3B63] w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Tutor düşünüyor…</span>
              </div>
            )}

            {errorNotice && (
              <div
                data-testid="tutor-error"
                className="text-xs text-[#94A3B8] italic py-1 px-2 text-center"
              >
                {errorNotice}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick thought chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] font-mono px-2 py-1 rounded bg-[#16264A] hover:bg-[#1E2E54] border border-[#2A3B63] text-[#A7B8E7] hover:text-[#F5A23A] transition-colors cursor-pointer"
              >
                + {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input & Send Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              data-testid="tutor-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Takıldığın yeri yaz…"
              disabled={isLoading}
              className="flex-1 h-10 px-3 rounded-lg bg-[#16264A] border border-[#2A3B63] text-xs sm:text-sm text-[#D8E2FF] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#F5A23A] focus:ring-1 focus:ring-[#F5A23A]"
            />
            <button
              type="submit"
              data-testid="tutor-send"
              disabled={!inputVal.trim() || isLoading}
              className={`h-10 px-3.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                inputVal.trim() && !isLoading
                  ? 'bg-[#F5A23A] text-[#0F1B33] hover:bg-[#ffb34e]'
                  : 'bg-[#2A3B63]/50 text-[#94A3B8]/40 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
