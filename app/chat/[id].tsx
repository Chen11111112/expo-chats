import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useChat } from '../context/ChatContext';

export default function ChatRoomScreen() {
  // 從參數中獲取 id, name 和我們剛新增的 isGroup
  const { id, name, isGroup } = useLocalSearchParams(); 
  const { messages, sendMessage } = useChat(); 
  const [inputText, setInputText] = useState('');

  const roomMessages = messages[id as string] || [];
  const isGroupChat = isGroup === 'true';

  const handleSend = () => {
    if (inputText.trim() === '') return;
    sendMessage(id as string, inputText);
    setInputText(''); 
  };

  // 渲染單一氣泡訊息
  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender === 'me';

    return (
      <View style={[
        styles.messageWrapper, 
        isMe ? styles.messageWrapperMe : styles.messageWrapperOther
      ]}>
        
        {/* 如果是群組且是別人發的，顯示發言者名字 */}
        {!isMe && isGroupChat && (
          <Text style={styles.senderName}>{item.senderName || '成員'}</Text>
        )}

        <View style={[
          styles.messageRow, 
          isMe ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }
        ]}>
         
          {!isMe && (
            <Image 
            source={{ 
              uri: (item.id 
                    ? `https://i.pravatar.cc/150?img=${item.id}` 
                    : 'https://i.pravatar.cc/') 
            }}
              style={styles.messageAvatar} 
            />
          )}

          <View style={[
            styles.messageBubble, 
            isMe ? styles.messageBubbleMe : styles.messageBubbleOther
          ]}>
            <Text style={[
              styles.messageText, 
              isMe ? styles.messageTextMe : styles.messageTextOther
            ]}>
              {item.text}
            </Text>
          </View>
        </View>

        <Text style={[styles.timeText, isMe ? { textAlign: 'right' } : { textAlign: 'left' }]}>
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 動態設定 Header，如果是群組可以在標題後加註 */}
      <Stack.Screen 
        options={{ 
          title: (name as string) || '聊天室',
          headerBackTitle: '返回',
        }} 
      />

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          data={roomMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          // 自動捲動到底部（當訊息很多時）
          showsVerticalScrollIndicator={false}
        />

        {/* 底部輸入框區域 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="輸入訊息..."
            placeholderTextColor="#999"
            multiline // 支援多行輸入
          />
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.6 }]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
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
  messageList: { padding: 15, paddingBottom: 20 },
  
  messageWrapper: { marginBottom: 15, maxWidth: '85%' },
  messageWrapperMe: { alignSelf: 'flex-end' },
  messageWrapperOther: { alignSelf: 'flex-start' },
  
  messageRow: {
    alignItems: 'flex-end',
  },
  messageAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 8,
    marginLeft: 8,
  },
  
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    marginLeft: 52, // 為了對齊頭像後的文字
  },

  messageBubble: { 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 18,
    maxWidth: '80%',
  },
  messageBubbleMe: { 
    backgroundColor: '#0084ff', 
    borderBottomRightRadius: 4 
  },
  messageBubbleOther: { 
    backgroundColor: '#fff', 
    borderBottomLeftRadius: 4,
    // 增加一點陰影讓它在灰色背景上更明顯
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  
  messageText: { fontSize: 16, lineHeight: 22 },
  messageTextMe: { color: '#fff' },
  messageTextOther: { color: '#000' },
  
  timeText: { fontSize: 10, color: '#aaa', marginTop: 4, marginHorizontal: 10 },

  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'flex-end', // 讓發送按鈕對齊多行輸入框底部
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 100, // 限制最大高度
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#0084ff',
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});