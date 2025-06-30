import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text } from 'react-native';
import { Image } from 'expo-image';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: '#11B981',
          borderTopWidth: 0,
          elevation: 0,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: focused ? 'rgba(255,255,255,0.2)' : 'transparent',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              minWidth: 80,
              minHeight: 32,
            }}>
              <Image 
                source={require('../../assets/externalassets/home icon for the bottom tabs.png')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: focused ? 'white' : 'rgba(255,255,255,0.6)',
                  marginRight: 8,
                }}
                contentFit="contain"
              />
              <Text style={{
                fontSize: 14,
                fontFamily: FontFamily.bold,
                color: focused ? 'white' : 'rgba(255,255,255,0.6)',
              }}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ focused }) => (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: focused ? 'rgba(255,255,255,0.2)' : 'transparent',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              minWidth: 100,
              minHeight: 32,
            }}>
              <Image 
                source={require('../../assets/externalassets/wishlist icon.png')}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: focused ? 'white' : 'rgba(255,255,255,0.6)',
                  marginRight: 8,
                }}
                contentFit="contain"
              />
              <Text style={{
                fontSize: 14,
                fontFamily: FontFamily.bold,
                color: focused ? 'white' : 'rgba(255,255,255,0.6)',
              }}>
                Watchlist
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
