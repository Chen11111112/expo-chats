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

// --- 假資料區塊 ---

// 線上用戶假資料
const mockOnlineUsers = [
  { id: '1', name: 'Jihoon', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '2', name: 'Ricky', avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: '3', name: 'Alex', avatar: 'https://i.pravatar.cc/150?img=14' },
  { id: '4', name: 'Ana', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '5', name: 'Sarina', avatar: 'https://i.pravatar.cc/150?img=7' },
];

// 聊天室列表假資料
const mockChats = [
  { id: '1', name: 'Ana Thomas', avatar: 'https://i.pravatar.cc/150?img=5', lastMessage: 'Hey! how are you?', time: '3h' },
  { id: '2', name: 'Bay Area Hikers', avatar: 'https://i.pravatar.cc/150?img=6', lastMessage: 'Linlin: I\'m here!', time: 'now' },
  { id: '3', name: 'Book Club', avatar: 'https://i.pravatar.cc/150?img=7', lastMessage: 'Sarina: Has anyone read...', time: 'now' },
  { id: '4', name: 'Jihoon Song', avatar: 'https://i.pravatar.cc/150?img=12', lastMessage: 'thank you!!!', time: '5h' },
  { id: '5', name: 'Jacqueline Farley', avatar: 'https://i.pravatar.cc/150?img=9', lastMessage: 'Wanna meet on fri?', time: '6h' },
  { id: '6', name: 'Carl, Agnes', avatar: 'https://i.pravatar.cc/150?img=10', lastMessage: 'Jamie: That\'s amazing', time: '2d' },
];

export default function ChatListScreen() {
  const { userImage , userName} = useUser();

  const handlePressChat = (chatName: string) => {
    console.log(`點擊了聊天室: ${chatName}`);
    // 這裡交給負責聊天室的人接手
  };

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.chatItemContainer} 
      onPress={() => handlePressChat(item.name)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
      
      <View style={styles.chatTextContainer}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage} numberOfLines={1}>
          {item.lastMessage} · {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
            data={mockChats}
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
            scrollEnabled={false} // 外層已有 ScrollView
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