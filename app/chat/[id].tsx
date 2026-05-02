import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useUser } from '../context/UserContext';
import { useChat } from '../context/ChatContext';

// 假對話紀錄 (實務上通常會根據上方的 id 去後端撈取資料)
const mockMessages = [
  { id: '1', text: '嗨！最近好嗎？', sender: 'other', time: '10:00 AM' },
  { id: '2', text: '我很好啊！你呢？', sender: 'me', time: '10:02 AM' },
  { id: '3', text: '正在寫一個 React Native 的聊天 App！', sender: 'me', time: '10:03 AM' },
  { id: '4', text: '哇！聽起來超酷的 😎', sender: 'other', time: '10:05 AM' },
];

export default function ChatRoomScreen() {
  const { id, name } = useLocalSearchParams(); 
  const { messages, sendMessage } = useChat(); // 2. 從 Context 拿出功能
  const [inputText, setInputText] = useState('');

  // 3. 篩選出屬於這個房間的訊息
  const roomMessages = messages[id as string] || [];

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    // 4. 呼叫 Context 的發送功能
    sendMessage(id as string, inputText);
    setInputText(''); 
  };

  // 渲染單一氣泡訊息
  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.messageWrapper, isMe ? styles.messageWrapperMe : styles.messageWrapperOther]}>
        <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 動態設定上方 Header 的標題為對方的名字 */}
      <Stack.Screen options={{ title: (name as string) || '聊天室' }} />

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // 避免 iOS 導覽列擋住
      >
        {/* 對話紀錄列表 */}
        <FlatList
          data={roomMessages} // 5. 這裡改成傳入 roomMessages
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
        />

        {/* 底部輸入框區域 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="輸入訊息..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>傳送</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f2f2' },
  container: { flex: 1 },
  messageList: { padding: 15 },
  
  // 訊息氣泡排版
  messageWrapper: { marginBottom: 15, maxWidth: '80%' },
  messageWrapperMe: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  messageWrapperOther: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  
  messageBubble: { padding: 12, borderRadius: 20 },
  messageBubbleMe: { backgroundColor: '#0084ff', borderBottomRightRadius: 4 },
  messageBubbleOther: { backgroundColor: '#e4e6eb', borderBottomLeftRadius: 4 },
  
  messageText: { fontSize: 16 },
  messageTextMe: { color: '#fff' },
  messageTextOther: { color: '#000' },
  
  timeText: { fontSize: 11, color: '#888', marginTop: 4, marginHorizontal: 4 },

  // 輸入框區域
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // 給 iPhone 底部 Home 條留空間
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#0084ff',
    borderRadius: 20,
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});