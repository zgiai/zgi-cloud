import { HTTP_STATUS_CODE } from '@/constants/http_status'
import { STORAGE_ADAPTER_KEYS } from '@/constants/storageAdapterKey'
import { getStorageAdapter } from '@/lib/storageAdapter'
import { getAuthToken } from '@/lib/token.utils'
import { addChatMessages, getChatHistory, streamChatCompletions } from '@/server/chat.server'
import { localStreamChatCompletions } from '@/server/ollama.server'
import { type ChatHistory, type ChatMessage, StreamChatMode } from '@/types/chat'
import { debounce } from 'lodash'
import React from 'react'
import { create } from 'zustand'
import { useAppSettingsStore } from '../appSettingsStore'
import { handleStreamResponse } from './handleStreamResponse'
import type { ChatStore } from './types'

const storageAdapter = getStorageAdapter({ key: STORAGE_ADAPTER_KEYS.chat.key })
/**
 * Create chat state management store
 */
export const useChatStore = create<ChatStore>()((set, get) => {
  // Add helper function to update chat title based on content
  const updateChatTitleByContent = (chatId: string) => {
    const { chatHistories, isFirstOpen } = get()
    const chat = chatHistories.find((c) => c.id === chatId)

    // Only update title when the software is first opened
    if (!chat || !chat.messages.length || !isFirstOpen) return

    // Get the first text message
    const firstTextMessage = chat.messages.find(
      (msg) => msg.role === 'user' && !msg.fileType && msg.content.trim(),
    )

    if (firstTextMessage) {
      const newTitle =
        firstTextMessage.content.slice(0, 20) + (firstTextMessage.content.length > 20 ? '...' : '')

      set((state) => ({
        chatHistories: state.chatHistories.map((c) => {
          if (c.id === chatId) {
            return {
              ...c,
              title: newTitle,
            }
          }
          return c
        }),
      }))

      get().saveChatsToDisk()
    }
  }

  // Add helper function to update chat title based on first text message
  const updateChatTitleByFirstMessage = (chatId: string) => {
    const { chatHistories } = get()
    const chat = chatHistories.find((c) => c.id === chatId)

    if (!chat || !chat.messages.length) return

    // Find first text message (no fileType)
    const firstTextMessage = chat.messages.find(
      (msg) => msg.role === 'user' && !msg.fileType && msg.content.trim(),
    )

    if (firstTextMessage) {
      const newTitle =
        firstTextMessage.content.slice(0, 20) + (firstTextMessage.content.length > 20 ? '...' : '')

      set((state) => ({
        chatHistories: state.chatHistories.map((c) => {
          if (c.id === chatId) {
            return {
              ...c,
              title: newTitle,
            }
          }
          return c
        }),
      }))

      get().saveChatsToDisk()
    }
  }

  return {
    currentChatId: null,
    chatHistories: [],
    messageStreamingMap: {},
    isLoadingMap: {},
    isFirstOpen: true, // Add first open flag
    refreshModelsLoading: false,
    createChatLoading: false,
    selectedModel: undefined, // Default selected model
    setSelectedModel: (model) => set({ selectedModel: model }), // Function to update selected model
    fileInputRef: React.createRef<HTMLInputElement>(),
    attachments: [], // Initialize attachment state
    inputMessage: '', // Initialize message state
    setInputMessage: (msg) => set({ inputMessage: msg }), // Set message
    setAttachments: (files) => set({ attachments: files }), // Set attachments

    init: async () => {
      const { loadChatsFromDisk } = get()
      loadChatsFromDisk()
      const providers = useAppSettingsStore.getState().providers || {}
      set({
        selectedModel:
          providers.zgi?.models[0] || providers.zgi?.customModels[0] || providers.ollama?.models[0],
      })
    },

    handleSend: async () => {
      const { inputMessage, attachments, sendMessage, isLoadingMap, currentChatId } = get()
      const isLoading = currentChatId ? isLoadingMap[currentChatId] : false
      if (isLoading) return

      // Clear input and attachments immediately after sending
      set({ inputMessage: '', attachments: [] })

      try {
        const messages: ChatMessage[] = []

        // Handle attachments
        if (attachments.length > 0) {
          const filePromises = attachments.map((file) => {
            return new Promise<ChatMessage>((resolve) => {
              const reader = new FileReader()
              reader.onload = () => {
                const fileContent = reader.result as string
                const base64Content = fileContent.split(',')[1]

                resolve({
                  id: Date.now().toString(),
                  role: 'user',
                  content: base64Content,
                  fileType: file.type,
                  fileName: file.name,
                  timestamp: new Date().toISOString(),
                  skipAIResponse: true,
                })
              }
              reader.readAsDataURL(file)
            })
          })

          const fileMessages = await Promise.all(filePromises)
          messages.push(...fileMessages)
        }

        // Add text message
        if (inputMessage.trim()) {
          messages.push({
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date().toISOString(),
            skipAIResponse: false,
          })
        }

        // Send messages
        if (messages.length > 0) {
          for (const msg of messages) {
            await sendMessage(msg)
          }
        }
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    },

    /**
     * Set current chat ID
     * @param id Chat ID
     */
    setCurrentChatId: async (id) => {
      const { updateChatMessages, saveChatsToDisk } = get()
      const { access_token } = await getAuthToken()
      set({ currentChatId: id })
      if (id && !id.includes('local_notId') && access_token) {
        const res = await getChatHistory(id)
        if (res?.data && res.status_code === HTTP_STATUS_CODE.SUCCESS) {
          updateChatMessages(id, res.data.messages || [])
        }
      }
      saveChatsToDisk()
    },

    /**
     * Create new chat
     */
    createChat: async () => {
      set({
        createChatLoading: true,
      })
      const id = await get().createChatSessionId({
        chatId: undefined,
        messages: [],
      })
      const newChat: ChatHistory = {
        id,
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
      }
      set((state) => ({
        chatHistories: [newChat, ...state.chatHistories],
        currentChatId: newChat.id,
        createChatLoading: false,
      }))
      get().saveChatsToDisk()
    },

    /**
     * Delete specified chat
     * @param id Chat ID to delete
     */
    deleteChat: (id) => {
      set((state) => {
        const newHistories = state.chatHistories.filter((chat) => chat.id !== id)
        return {
          chatHistories: newHistories,
          currentChatId:
            state.currentChatId === id ? (newHistories[0]?.id ?? null) : state.currentChatId,
        }
      })
      get().saveChatsToDisk()
    },

    /**
     * Update message list for specified chat
     * @param chatId Chat ID
     * @param messages New message list
     */
    updateChatMessages: (chatId, messages) => {
      set((state) => ({
        chatHistories: state.chatHistories.map((chat) =>
          chat.id === chatId ? { ...chat, messages } : chat,
        ),
      }))
      get().saveChatsToDisk()
    },

    /**
     * Update title for specified chat
     * @param chatId Chat ID
     * @param title New title
     */
    updateChatTitle: (chatId, title) => {
      set((state) => ({
        chatHistories: state.chatHistories.map((chat) =>
          chat.id === chatId ? { ...chat, title } : chat,
        ),
      }))
      get().saveChatsToDisk()
    },

    /**
     * Clear all chats
     */
    clearAllChats: () => {
      set({ chatHistories: [], currentChatId: null })
      get().saveChatsToDisk()
    },

    /**
     * Load chat history from storage
     */
    loadChatsFromDisk: async () => {
      try {
        const data = await storageAdapter.load()
        if (data) {
          set({
            chatHistories: data.chatHistories || [],
            currentChatId: data.currentChatId || null,
            isFirstOpen: true, // Reset to true each time loading
          })

          // Update titles for all chats after loading
          if (data.chatHistories) {
            for (const chat of data.chatHistories) {
              get().updateChatTitleByFirstMessage(chat.id)
            }
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    },

    /**
     * Save chat history to storage
     * Using debounce to avoid frequent saves
     */
    saveChatsToDisk: debounce(() => {
      const state = get()
      const data = {
        chatHistories: state.chatHistories,
        currentChatId: state.currentChatId,
      }
      storageAdapter.save(data)
    }, 1000),

    createChatSessionId: async ({ chatId, messages }) => {
      const { access_token } = await getAuthToken()
      const localChatId = `local_notId_${Date.now().toString()}`
      if (access_token && (!chatId || chatId?.includes('local_notId'))) {
        const res = await addChatMessages({
          session_id: chatId,
          messages: messages,
        })
        if (res?.data && res.status_code === HTTP_STATUS_CODE.SUCCESS) {
          return res.data?.session_id
        }
        return chatId || localChatId
      }
      return localChatId
    },

    /**
     * Send message and handle AI response
     */
    sendMessage: async (message: ChatMessage) => {
      const { currentChatId, selectedModel, createChatSessionId } = get()
      let chatId = currentChatId

      // Check if already loading
      const isLoading = get().isLoadingMap[chatId || '']
      if (isLoading) return
      if (!chatId) {
        const id = await createChatSessionId({ chatId: undefined, messages: [] })
        // Don't set title when creating new chat, wait for first message
        const newChat = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          chatHistories: [newChat, ...state.chatHistories],
          currentChatId: newChat.id,
        }))

        chatId = newChat.id
      }

      const currentChat = get().chatHistories.find((chat) => chat.id === chatId)
      if (!currentChat) return

      // Add user message to history
      const newMessages = [...currentChat.messages, message]

      // Update status immediately
      set((state) => ({
        chatHistories: state.chatHistories.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: newMessages,
            }
          }
          return chat
        }),
      }))

      // Update chat title if this is a text message
      if (!message.fileType && message.content.trim()) {
        get().updateChatTitleByFirstMessage(chatId)
      }

      // If it's a file message and marked to skip AI response, return
      if (message.skipAIResponse) {
        return
      }

      // Set loading status
      set((state) => ({
        isLoadingMap: { ...state.isLoadingMap, [chatId]: true },
        messageStreamingMap: { ...state.messageStreamingMap, [chatId]: '' },
      }))

      try {
        // Modify the format of the message sent to AI
        const messagesToSend = currentChat.messages.map((msg) => {
          if (msg.fileType?.includes('image/')) {
            // Handle image message
            let imageUrl = msg.content
            if (!msg.content.startsWith('http')) {
              // If not a URL, convert to base64
              imageUrl = `data:${msg.fileType};base64,${msg.content}`
            }

            return {
              role: msg.role,
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl,
                  },
                },
              ],
            }
          }
          // Handle normal text message
          return {
            role: msg.role,
            content: msg.content,
          }
        })

        // Handle the current message to send
        const currentMessageToSend = message.fileType?.includes('image/')
          ? {
              role: message.role,
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: message.content.startsWith('http')
                      ? message.content
                      : `data:${message.fileType};base64,${message.content}`,
                  },
                },
              ],
            }
          : {
              role: message.role,
              content: message.content,
            }
        if (!selectedModel) {
          set((state) => ({
            messageStreamingMap: {
              ...state.messageStreamingMap,
              [chatId]: 'Please select a model.',
            },
          }))
          return
        }
        // If this is not a message to skip AI response, send request
        if (!message.skipAIResponse) {
          const allMessages = [...messagesToSend, currentMessageToSend]
          let reader
          if (selectedModel?.type === StreamChatMode.ollama) {
            reader = await localStreamChatCompletions({
              model: selectedModel.id,
              messages: allMessages,
            })
          } else {
            reader = await streamChatCompletions({
              model: selectedModel.id,
              messages: allMessages,
              stream: true,
              temperature: 1,
            })
          }
          await handleStreamResponse({
            reader,
            chatId,
            messages: newMessages,
            set,
            onError: (error) => {
              console.error('Stream handling error:', error)
              set((state) => ({
                messageStreamingMap: {
                  ...state.messageStreamingMap,
                  [chatId]: 'Sorry, an error occurred while processing your message.',
                },
              }))
            },
            onComplete: async ({ assistantMessage }) => {
              // Additional actions after completion if needed
              get().saveChatsToDisk()
              // history chat
              if (!chatId?.includes('local_notId')) {
                await addChatMessages({
                  session_id: chatId,
                  messages: [...allMessages, assistantMessage],
                })
              }
            },
            streamMode:
              selectedModel?.type === StreamChatMode.ollama
                ? StreamChatMode.ollama
                : StreamChatMode.commonChat,
          })
        }
      } catch (error) {
        console.error('Failed to send message:', error)
        set((state) => ({
          messageStreamingMap: {
            ...state.messageStreamingMap,
            [chatId]: 'Sorry, failed to send message. Please try again later.',
          },
        }))
      } finally {
        set((state) => ({
          isLoadingMap: { ...state.isLoadingMap, [chatId]: false },
        }))

        if (!get().messageStreamingMap[chatId]) {
          get().saveChatsToDisk()
        }
      }
    },

    updateChatTitleByContent, // Export method
    updateChatTitleByFirstMessage,
  }
})
