import React from "react";
import { Tabs } from "expo-router";
import { Home, Trophy, ShoppingCart, Settings } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import { View } from "react-native";
import BannerAd from "@/components/BannerAd";

export default function TabLayout() {
  const { theme } = useTheme();
  
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false, // Remove headers from all tab screens
          tabBarActiveTintColor: theme.primaryColor,
          tabBarInactiveTintColor: theme.id === 'default' ? "#94A3B8" : `${theme.primaryColor}80`,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: theme.id === 'default' ? "#E2E8F0" : `${theme.primaryColor}30`,
            height: 60,
            paddingBottom: 8,
            backgroundColor: theme.backgroundColor,
          },
          tabBarShowLabel: false, // Hide tab labels, show only icons
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            tabBarIcon: ({ color }) => <Trophy size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
          }}
        />
      </Tabs>
      <BannerAd />
    </>
  );
}