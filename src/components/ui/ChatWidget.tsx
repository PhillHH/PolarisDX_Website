import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Send, Minus } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'

interface Message {
  id: string
  text?: string
  content?: ReactNode
  sender: 'user' | 'bot'
  timestamp: Date
}

const ChatWidget = () => {
  const { t } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize: Open on desktop, add welcome message
  useEffect(() => {
    // SSR guard - window is not available on server
    if (typeof window === 'undefined') return

    // Check if desktop (width > 1024px)
    if (window.innerWidth > 1024) {
      setIsOpen(true)
    }

    // Add prototype welcome message
    const welcomeMsg: Message = {
      id: 'welcome-1',
      content: (
        <Trans
          i18nKey="chat.welcome_prototype"
          t={t}
          components={[
            <Link to="/contact" className="underline underline-offset-2 font-medium" key="0">
              Link
            </Link>,
            <a href="tel:+4915175011699" className="underline underline-offset-2 font-medium" key="1">
              Phone
            </a>,
          ]}
        />
      ),
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages([welcomeMsg])
  }, [t])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const toggleChat = () => {
    if (isMinimized) {
        setIsMinimized(false)
        setIsOpen(true)
    } else {
        setIsOpen(!isOpen)
    }
  }

  const handleMinimize = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsMinimized(true)
      setIsOpen(false)
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputText.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsLoading(true)

    try {
      // Call the backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const data = await response.json()

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || t('chat.error', 'Sorry, something went wrong.'),
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])

    } catch (error) {
      console.error('Chat error:', error)
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: t('chat.unavailable', 'Der Chat ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns per E-Mail.'),
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-[60] flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 duration-300
          ${isOpen
            ? 'bg-white/80 backdrop-blur-md text-gray-600 h-12 w-12 border border-gray-200 shadow-lg lg:hidden'
            : 'bg-gradient-to-br from-blue-600 to-blue-900 text-white h-14 w-14 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] border border-blue-500/30'
          }
        `}
        aria-label="Open Chat"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-7 w-7" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 lg:bottom-6 right-6 z-[60] w-[90vw] lg:w-96 max-w-[350px] lg:max-w-[400px] overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 animate-in slide-in-from-bottom-10 fade-in duration-300 border border-white/40">

          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#0f5f95] to-[#052e4a] px-5 py-4 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/20 text-xs font-bold backdrop-blur-sm">
                 DX
                 <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-[#0f5f95] shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
              </div>
              <div className="flex flex-col">
                 <span className="text-sm font-medium tracking-wide">{t('chat.title', 'PolarisDX Concierge')}</span>
                 <span className="text-xxs text-blue-200 opacity-90 tracking-wider uppercase">{t('chat.status', 'Online')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
                {/* Minimize Button */}
                <button onClick={handleMinimize} className="p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
                    <Minus className="h-4 w-4" />
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[350px] lg:h-[400px] overflow-y-auto bg-transparent p-5 flex flex-col gap-4">
             {/* Note: Removed 'messages.length === 0' check because we always have the prototype message now */}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-fit max-w-[85%] flex-col gap-1 px-4 py-3 text-sm shadow-sm backdrop-blur-sm
                  ${
                    msg.sender === 'user'
                      ? 'self-end bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-br-sm shadow-blue-900/10'
                      : 'self-start bg-white/80 text-gray-800 border border-white/50 rounded-2xl rounded-bl-sm shadow-lg shadow-gray-200/50'
                  }
                `}
              >
                <div className="leading-relaxed">{msg.content || msg.text}</div>
                <span className={`text-xxs tracking-wide ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isLoading && (
               <div className="self-start bg-white/80 border border-white/50 rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg shadow-gray-200/50 backdrop-blur-sm">
                  <div className="flex gap-1.5">
                     <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></span>
                     <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></span>
                     <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"></span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t border-white/20 bg-white/50 p-4 backdrop-blur-md">
            <div className="relative flex items-center group">
              <input
                type="text"
                disabled
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('chat.placeholder', 'Nachricht eingeben...')}
                className="w-full rounded-full border border-gray-200/60 bg-white/80 text-gray-600 py-3 pl-5 pr-12 text-sm outline-none transition-all focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10 focus:bg-white placeholder:text-gray-400 cursor-not-allowed shadow-inner"
              />
              <button
                type="submit"
                disabled
                className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none cursor-not-allowed"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </div>
            <div className="mt-2.5 text-center text-xxs text-gray-400 font-medium tracking-wide uppercase opacity-70">
               {t('chat.footer', 'PolarisDX Private Assistant')}
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatWidget
