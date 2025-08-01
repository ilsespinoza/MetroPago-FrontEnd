import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        headerTransparent: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarStyle: { display: "none" },
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="comenzar"
        options={({ navigation }) => ({
          tabBarStyle: { display: "none" },
          headerShown: true,
          headerTitle: "",
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("login")}
              style={{ marginLeft: 15 }}
            >
              <IconSymbol name="arrow.left" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />

      <Tabs.Screen
        name="login"
        options={({}) => ({
          tabBarStyle: { display: "none" },
          headerShown: true,
          headerTitle: "",
          headerBackTitleVisible: false,
        })}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    backgroundColor: "#ffffffee",
    height: 64,
    paddingBottom: Platform.OS === "ios" ? 16 : 12,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
});
