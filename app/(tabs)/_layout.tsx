import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// 封裝圖示組件
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // 如果你的 index 內頁已經有寫 Header (SafeAreaView)，這裡可以考慮 false 隱藏掉 Tabs 的預設 Header
        headerShown: useClientOnlyValue(false, false), 
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: '#DBDBDB',
          backgroundColor: '#fff',
        }
      }}
    >
      {/* Tab One: 聊天室 */}
      <Tabs.Screen
        name="index"
        options={{
          title: "聊天室",
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
        }}
      />

      {/* Tab Two: 個人檔案 */}
      <Tabs.Screen
        name="two"
        options={{
          title: "個人檔案",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}