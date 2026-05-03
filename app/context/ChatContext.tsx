import React, { createContext, useState, useContext } from 'react';

// 1. 初始的聊天室列表假資料
const initialChats = [
  { id: '1', name: 'Ana Thomas', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jihoon Song', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Book Club', avatar: 'https://i.pravatar.cc/150?img=3' },
];

// 2. 初始的對話紀錄假資料 (用聊天室 id 當作分類 Key)
const initialMessages = {
  '1': [
    { id: 'm1', text: 'Hey! how are you?', sender: 'other', time: '10:00 AM' }
  ],
  '2': [
    { id: 'm2', text: 'thank you!!!', sender: 'other', time: '5:00 PM' }
  ],
  '3': [
    { id: 'm3', text: 'Has anyone read the new chapter?', sender: 'other', time: '昨天' }
  ],
  "group_88": [
    { id: '8', text: '要約什麼時候開會?', sender: 'other', time: '3天前',avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '22', text: '明天可以嗎?', sender: 'other', time: '3天前' },
    { id: '23', text: '要討論什麼?', sender: 'other', time: '昨天' }
  ],
  "group_99": [
    { id: '4', text: '記得大掃除!!!', sender: 'other', time: '10分鐘前'},
    { id: '5', text: '下周要防災演習喔!', sender: 'other', time: '3天前' },
    { id: '6', text: '誰作業沒交?', sender: 'other', time: '昨天' },
    { id: '7', text: '老師在問?', sender: 'other', time: '昨天' },
  ],
};

const ChatContext = createContext<any>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState(initialChats);
  const [messages, setMessages] = useState<any>(initialMessages);

  // 提供一個發送訊息的功能，讓內頁可以呼叫
  const sendMessage = (chatId: string, text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev: any) => ({
      ...prev,
      // 保留原本該聊天室的訊息，並把新訊息塞到最後面
      [chatId]: [...(prev[chatId] || []), newMessage], 
    }));
  };

  return (
    <ChatContext.Provider value={{ chats, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);