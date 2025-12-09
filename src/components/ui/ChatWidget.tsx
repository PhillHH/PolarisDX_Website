import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Minus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Message {
  id: string
  text: string
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
    // Check if desktop (width > 1024px)
    if (window.innerWidth > 1024) {
      setIsOpen(true)
    }

    // Add prototype welcome message
    const welcomeMsg: Message = {
      id: 'welcome-1',
      text: t('chat.welcome_prototype', 'Willkommen! Unser AI-Chatbot wird in den nächsten Tagen aktiviert. Bis dahin nutzen Sie bitte unser Kontaktformular für Anfragen.'),
      sender: 'bot',
      timestamp: new Date()
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
        className={`fixed bottom-6 right-6 z-40 flex items-center justify-center rounded-full shadow-xl transition-all hover:scale-105 active:scale-95
          ${isOpen ? 'bg-gray-200 text-gray-600 h-12 w-12' : 'bg-blue-600 text-white h-14 w-14 hover:bg-blue-700'}
        `}
        aria-label="Open Chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}

        {/* Notification badge if minimized and new messages? (Optional) */}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-[350px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in slide-in-from-bottom-10 fade-in duration-200">

          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                 DX
                 <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-blue-600"></span>
              </div>
              <div className="flex flex-col">
                 <span className="text-sm font-semibold">Support Assistant</span>
                 <span className="text-[10px] text-blue-100 opacity-90">{t('chat.status', 'Online')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
                {/* Minimize Button */}
                <button onClick={handleMinimize} className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors">
                    <Minus className="h-4 w-4" />
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[350px] overflow-y-auto bg-gray-50 p-4 flex flex-col gap-3">
             {/* Note: Removed 'messages.length === 0' check because we always have the prototype message now */}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-fit max-w-[85%] flex-col gap-1 rounded-xl px-3 py-2 text-sm shadow-sm
                  ${
                    msg.sender === 'user'
                      ? 'self-end bg-blue-600 text-white rounded-br-none'
                      : 'self-start bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }
                `}
              >
                <p>{msg.text}</p>
                <span className={`text-[9px] ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isLoading && (
               <div className="self-start bg-white border border-gray-100 rounded-xl rounded-bl-none px-3 py-2 shadow-sm">
                  <div className="flex gap-1">
                     <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></span>
                     <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></span>
                     <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"></span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-100 bg-white p-3">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('chat.placeholder', 'Nachricht eingeben...')}
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-12 text-sm outline-none transition-all focus:border-blue-400 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </div>
            <div className="mt-2 text-center text-[10px] text-gray-400">
               {t('chat.footer', 'Powered by PolarisDX Assistant')}
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatWidget
