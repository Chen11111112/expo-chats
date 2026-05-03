import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
// 如果 @/components/Themed 報錯，就用下面這行
import { Text, View } from "react-native";

export default function IGProfileScreen() {
  const {
    userImage: image,
    setUserImage: setImage,
    userName: username, 
    setUserName: setUsername, 
  } = useUser();

  const [name, setName] = useState("陳家豪");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("權限請求", "請允許相簿權限來換頭像喔！");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* IG 風格 Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>編輯個人檔案</Text>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {/* 大頭照選取區 */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                image
                  ? { uri: image }
                  : { uri: "https://via.placeholder.com/150" }
              }
              style={styles.avatar}
            />
            <Text style={styles.changePhotoText}>更換大頭照</Text>
          </TouchableOpacity>
        </View>

        {/* IG 風格欄位 */}
        <View style={styles.formContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>姓名</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="姓名"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>用戶名稱</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="用戶名稱"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>簡介</Text>
            <TextInput
              style={styles.input}
              placeholder="寫點什麼吧..."
              multiline
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => Alert.alert("成功", "設定已儲存")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>完成編輯</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingBottom: 15,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#dbdbdb",
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#000" },
  avatarSection: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  changePhotoText: {
    color: "#0095f6",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  formContainer: { width: "100%", paddingHorizontal: 15 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#dbdbdb",
    paddingVertical: 12,
  },
  label: { width: 80, fontSize: 16, color: "#000" },
  input: { flex: 1, fontSize: 16, color: "#000" },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#0095f6",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 8,
  },
});
