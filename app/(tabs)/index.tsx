import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  SafeAreaView
} from 'react-native';
import { useUser } from '../context/UserContext';
import { useRouter } from 'expo-router';
import { useChat } from '../context/ChatContext';

// --- 假資料區塊 ---

// 線上用戶假資料
const mockOnlineUsers = [
  { id: '1', name: 'Jihoon', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '2', name: 'Ricky', avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: '3', name: 'Alex', avatar: 'https://i.pravatar.cc/150?img=14' },
  { id: '4', name: 'Ana', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '5', name: 'Sarina', avatar: 'https://i.pravatar.cc/150?img=7' },
];

export default function ChatListScreen() {
  const { userImage, userName } = useUser();
  const { chats, messages } = useChat(); // 2. 拿出聊天室列表和所有對話紀錄
  const router = useRouter();

  // 接收整個 chat item，方便我們取得 id 和 name
  // 接收整個 item 物件，這樣我們才能拿到 id 和 name
  const handlePressChat = (chatItem: any) => {
    console.log(`準備進入聊天室: ${chatItem.name}`);
   
    router.push({
      pathname: "/chat/[id]", // 這裡要寫死你的檔名結構，不要用變數
      params: { 
        id: chatItem.id,     // 真正的 ID 從這裡傳給 [id].tsx
        name: chatItem.name  // 對方的名字一樣照傳
      }
    });
  };

  const renderChatItem = ({ item }: { item: any }) => {
    // 3. 找出這個聊天室的所有訊息
    const roomMessages = messages[item.id] || [];
    // 4. 抓出陣列的「最後一個」元素當作最後一則訊息
    const lastMsg = roomMessages.length > 0 ? roomMessages[roomMessages.length - 1] : null;

    return (
      <TouchableOpacity 
        style={styles.chatItemContainer} 
        onPress={() => handlePressChat(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
        <View style={styles.chatTextContainer}>
          <Text style={styles.chatName}>{item.name}</Text>
          {/* 5. 顯示動態抓到的最後一則訊息與時間 */}
          <Text style={styles.chatMessage} numberOfLines={1}>
            {lastMsg ? lastMsg.text : '尚無訊息'} · {lastMsg ? lastMsg.time : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* 1. 頂部 Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* 使用者的頭貼與帳號名稱 */}
            <Image 
              source={userImage ? { uri: userImage } : { uri: 'https://via.placeholder.com/150' }} 
              style={styles.headerCurrentUserAvatar} 
            />
            <Text style={styles.headerUsername}>{userName}</Text>
          </View>
          {/* 已移除右側編輯筆 */}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 2. 線上用戶區塊 (綠色小點) */}
          <View style={styles.onlineSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.onlineScroll}>
              {mockOnlineUsers.map((user) => (
                <TouchableOpacity key={user.id} style={styles.onlineItem}>
                  <View>
                    <Image source={{ uri: user.avatar }} style={styles.onlineAvatar} />
                    {/* 綠色上線狀態點點 */}
                    <View style={styles.onlineDot} />
                  </View>
                  <Text style={styles.onlineName} numberOfLines={1}>
                    {user.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 3. 聊天室列表 (已移除分類標籤、藍點與相機) */}
          <FlatList
            data={chats} // 6. 這裡改成傳入 Context 拿出來的 chats
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
            scrollEnabled={false}
            contentContainerStyle={styles.chatListContainer}
          />
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header 樣式
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCurrentUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  headerUsername: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  // 線上用戶樣式
  onlineSection: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb', // 增加一條淡淡的底線區隔
  },
  onlineScroll: {
    paddingHorizontal: 15,
  },
  onlineItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 65,
  },
  onlineAvatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  onlineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50', // 綠色
    borderWidth: 2,
    borderColor: '#fff', // 讓綠點有白色邊框，看起來更立體
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  onlineName: {
    fontSize: 12,
    color: '#000',
    marginTop: 8,
    textAlign: 'center',
  },
  // 聊天列表樣式
  chatListContainer: {
    paddingTop: 10,
  },
  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  chatTextContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  chatName: {
    fontSize: 15,
    color: '#000',
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: '#504e4e',
  },
});