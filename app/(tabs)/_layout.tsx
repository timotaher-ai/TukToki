// Powered by OnSpace.AI — Tab Layout (Dark Premium Edition)
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { Colors, Typography, Spacing, Shadow, Radius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

function TabIcon({
  name, focused, color, size, badge,
}: {
  name: string; focused: boolean; color: string; size: number; badge?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.15 : 1,
      useNativeDriver: true,
      speed: 50, bounciness: 10,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={[styles.iconWrap, { transform: [{ scale }] }]}>
      <MaterialIcons name={name as any} size={size} color={color} />
      {focused && <View style={styles.activeUnderline} />}
      {badge != null && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      )}
    </Animated.View>
  );
}

function CenterTabIcon({ focused }: { focused: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.08 : 1,
      useNativeDriver: true, speed: 40, bounciness: 8,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={[styles.centerBtn, { transform: [{ scale }] }, focused && styles.centerBtnFocused]}>
      <MaterialIcons name="local-taxi" size={26} color={Colors.textInverse} />
    </Animated.View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const _app = useApp(); // reserved for future badge use

  const tabBarStyle = {
    height: Platform.select({ ios: insets.bottom + 66, android: insets.bottom + 66, default: 70 }),
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: insets.bottom + 6, android: insets.bottom + 6, default: 6 }),
    paddingHorizontal: Spacing.xs,
    backgroundColor: Colors.tabBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.tabBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 20,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: {
          fontFamily: Typography.fontFamily,
          fontSize: 10,
          fontWeight: Typography.semiBold,
          marginTop: 1,
        },
        tabBarItemStyle: { paddingTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: 'رحلاتي',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="local-taxi" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: 'طلب توكتك',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <CenterTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'TukTalk',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="forum"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'بروفايلي',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="person" focused={focused} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  activeUnderline: {
    position: 'absolute', bottom: -6,
    width: 20, height: 2.5, borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  badge: {
    position: 'absolute', top: -4, right: -8,
    backgroundColor: Colors.error,
    borderRadius: 999, minWidth: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: Colors.tabBackground,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  centerBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3, borderColor: 'rgba(232,160,32,0.25)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 12,
  },
  centerBtnFocused: {
    shadowOpacity: 0.75,
    shadowRadius: 22,
    elevation: 16,
  },
});
