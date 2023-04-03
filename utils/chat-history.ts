import { Message } from "../types/message"

const CHAT_HISTORY: string = 'chat-history'

class ChatHistory {
  static load() {
    let history = localStorage.getItem(CHAT_HISTORY)
    if (!history) {
      localStorage.setItem(CHAT_HISTORY, JSON.stringify([]))
      history = localStorage.getItem(CHAT_HISTORY)
    }
    return JSON.parse(history)
  }

  static saveConversation(conversation: Message[]): void {
    localStorage.setItem(CHAT_HISTORY, JSON.stringify(conversation))
  }

  static clear(): void {
    localStorage.removeItem(CHAT_HISTORY)
    window.location.reload()
  }
}

export { ChatHistory }