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

// --- 假資料區塊：線上好友 ---
const mockOnlineUsers = [
  { id: '1', name: 'Ana Thomas', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jihoon Song', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Book Club', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Ana', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Sarina', avatar: 'https://i.pravatar.cc/150?img=5' },
];

export default function ChatListScreen() {
  const { userImage, userName } = useUser();
  const { chats, messages } = useChat(); 
  const router = useRouter();

  /**
   * 整合原本的 chats 與群組假資料
   * 實務上建議將 isGroup 存入 ChatContext 的資料結構中
   */
  const displayChats = [
    { 
      id: 'group_99', 
      name: '資三甲班群', 
      avatar: 'https://i.pravatar.cc/150?img=32', 
      isGroup: true 
    },
    ...chats,
    { 
      id: 'group_88', 
      name: 'BIRC前端群', 
      avatar: 'https://i.pravatar.cc/150?img=47', 
      isGroup: true 
    },
  ];

  const handlePressChat = (chatItem: any) => {
    router.push({
      pathname: "/chat/[id]",
      params: { 
        id: chatItem.id,
        name: chatItem.name,
        // 將群組屬性傳入，方便聊天頁面判斷是否顯示成員列表或特定 UI
        isGroup: chatItem.isGroup ? 'true' : 'false' 
      }
    });
  };

  const renderChatItem = ({ item }: { item: any }) => {
    const roomMessages = messages[item.id] || [];
    const lastMsg = roomMessages.length > 0 ? roomMessages[roomMessages.length - 1] : null;

    return (
      <TouchableOpacity 
        style={styles.chatItemContainer} 
        onPress={() => handlePressChat(item)}
        activeOpacity={0.7}
      >
        <View>
          <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
          {item.isGroup && <View style={styles.groupIndicator} />}
        </View>

        <View style={styles.chatTextContainer}>
          <View style={styles.chatHeaderRow}>
            <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
            {item.isGroup && (
              <View style={styles.groupBadge}>
                <Text style={styles.groupBadgeText}>群組</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.chatMessage} numberOfLines={1}>
            
            {lastMsg 
              ? `${item.isGroup ? 'Alex: ' : ''}${lastMsg.text}` 
              : '尚無訊息'
            } 
            {lastMsg ? ` · ${lastMsg.time}` : ''}
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
            <Image 
              source={userImage ? { uri: userImage } : { uri: 'https://via.placeholder.com/150' }} 
              style={styles.headerCurrentUserAvatar} 
            />
            <Text style={styles.headerUsername}>{userName}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 2. 線上用戶區塊 */}
          <View style={styles.onlineSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.onlineScroll}>
              {mockOnlineUsers.map((user) => (
                <TouchableOpacity key={user.id} style={styles.onlineItem}>
                  <View>
                    <Image source={{ uri: user.avatar }} style={styles.onlineAvatar} />
                    <View style={styles.onlineDot} />
                  </View>
                  <Text style={styles.onlineName} numberOfLines={1}>
                    {user.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 3. 聊天室列表 (含個人與群組) */}
          <FlatList
            data={displayChats}
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
  onlineSection: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
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
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
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
  chatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    maxWidth: '70%',
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
  },
  // --- 群組專屬樣式 ---
  groupIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  groupBadge: {
    backgroundColor: '#F0F2f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  groupBadgeText: {
    fontSize: 10,
    color: '#888',
    fontWeight: 'bold',
  },
});