import { useEffect } from 'react'

const SCRIPT_SRC = 'https://widget.hihuman.co.uk/bundle.js'
const BOT_ID = 'a8c8da26f4ccfc51884abe49cfb352f1bd3f6cf6f368c1361a41e1092fc80a88'

const ChatWidget = () => {
  useEffect(() => {
    // Avoid loading the script twice
    if (document.getElementById('custom_chat_widget')) return

    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.id = 'custom_chat_widget'
    script.setAttribute('bot-id', BOT_ID)
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup on unmount
      const el = document.getElementById('custom_chat_widget')
      if (el) el.remove()
    }
  }, [])

  return null
}

export default ChatWidget
