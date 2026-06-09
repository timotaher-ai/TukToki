// Powered by OnSpace.AI — Notifications Screen (Enhanced with Categories)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { StatusBar } from 'expo-status-bar';

type NotifCategory = 'all' | 'ride' | 'family' | 'referral' | 'promo';

const notifConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  ride:     { icon: 'directions-car',   color: Colors.primary,    bg: Colors.primarySurface, label: 'رحلات' },
  family:   { icon: 'family-restroom',  color: Colors.success,    bg: Colors.successSurface, label: 'الأسرة' },
  referral: { icon: 'card-giftcard',    color: '#9B59B6',          bg: '#F3E9FA',             label: 'إحالات' },
  promo:    { icon: 'local-offer',      color: Colors.error,      bg: Colors.errorSurface,   label: 'عروض' },
};

const categories: { id: NotifCategory; label: string; icon: string }[] = [
  { id: 'all',      label: 'الكل',    icon: 'notifications' },
  { id: 'ride',     label: 'رحلات',   icon: 'directions-car' },
  { id: 'family',   label: 'الأسرة',  icon: 'family-restroom' },
  { id: 'referral', label: 'إحالات',  icon: 'card-giftcard' },
  { id: 'promo',    label: 'عروض',    icon: 'local-offer' },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { notifications, markNotificationsRead } = useApp();

  const [activeCategory, setActiveCategory] = useState<NotifCategory>('all');
  const [localNotifs, setLocalNotifs] = useState(notifications);

  const filtered = localNotifs.filter(n =>
    activeCategory === 'all' ? true : n.type === activeCategory
  );

  const unreadCount = localNotifs.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setLocalNotifs(prev => prev.map(n => ({ ...n, read: true })));
    markNotificationsRead();
  };

  const handleClearAll = () => {
    setLocalNotifs([]);
  };

  const handleMarkRead = (id: string) => {
    setLocalNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={[Colors.secondary, Colors.secondaryLight]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <Pressable style={styles.markAllBtn} onPress={handleMarkAllRead}>
                <MaterialIcons name="done-all" size={16} color={Colors.primary} />
                <Text style={styles.markAllText}>قراءة الكل</Text>
              </Pressable>
            )}
            <Pressable style={styles.clearBtn} onPress={handleClearAll}>
              <MaterialIcons name="delete-sweep" size={16} color="rgba(255,255,255,0.6)" />
            </Pressable>
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>الإشعارات</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount} جديد</Text>
              </View>
            )}
          </View>

          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-forward" size={22} color="#fff" />
          </Pressable>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoriesWrap}>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={c => c.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing.base, gap: 8 }}
            renderItem={({ item: cat }) => {
              const count = cat.id === 'all'
                ? localNotifs.filter(n => !n.read).length
                : localNotifs.filter(n => n.type === cat.id && !n.read).length;
              const isActive = activeCategory === cat.id;
              return (
                <Pressable
                  style={[styles.catChip, isActive && styles.catChipActive]}
                  onPress={() => setActiveCategory(cat.id)}
                >
                  <MaterialIcons
                    name={cat.icon as any}
                    size={14}
                    color={isActive ? Colors.secondary : 'rgba(255,255,255,0.6)'}
                  />
                  <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat.label}</Text>
                  {count > 0 && (
                    <View style={styles.catBadge}>
                      <Text style={styles.catBadgeText}>{count}</Text>
                    </View>
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </LinearGradient>

      {/* Notifications List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.base, gap: Spacing.sm, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialIcons name="notifications-off" size={48} color={Colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>لا توجد إشعارات</Text>
            <Text style={styles.emptyDesc}>
              {activeCategory === 'all' ? 'ستظهر هنا إشعاراتك الجديدة' : `لا توجد إشعارات في قسم "${categories.find(c => c.id === activeCategory)?.label}"`}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const config = notifConfig[item.type] || notifConfig.ride;
          return (
            <Pressable
              style={[styles.notifCard, !item.read && styles.notifCardUnread]}
              onPress={() => handleMarkRead(item.id)}
            >
              {/* Unread Indicator */}
              {!item.read && <View style={styles.unreadStripe} />}

              {/* Icon */}
              <View style={[styles.notifIconWrap, { backgroundColor: config.bg }]}>
                <MaterialIcons name={config.icon as any} size={22} color={config.color} />
                {!item.read && <View style={[styles.notifDot, { backgroundColor: config.color }]} />}
              </View>

              {/* Content */}
              <View style={styles.notifContent}>
                <View style={styles.notifTitleRow}>
                  <Text style={styles.notifTime}>{item.time}</Text>
                  <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
                    {item.title}
                  </Text>
                </View>
                <Text style={styles.notifBody}>{item.body}</Text>
                <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
                  <Text style={[styles.typeLabel, { color: config.color }]}>{config.label}</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  headerCenter: { alignItems: 'center', gap: 4 },
  headerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    fontWeight: Typography.bold,
    color: Colors.secondary,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  markAllText: {
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    fontWeight: Typography.bold,
    color: Colors.secondary,
  },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesWrap: { paddingVertical: 4 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    height: 36,
  },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: 'rgba(255,255,255,0.6)',
  },
  catTextActive: { color: Colors.secondary },
  catBadge: {
    backgroundColor: Colors.error,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  catBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  notifCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  notifCardUnread: {
    backgroundColor: '#FDFAF4',
    borderWidth: 1,
    borderColor: Colors.primarySurface,
  },
  unreadStripe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  notifIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  notifContent: { flex: 1, gap: 4 },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  notifTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    textAlign: 'right',
    flex: 1,
  },
  notifTitleUnread: {
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  notifBody: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
    lineHeight: Typography.sm * 1.5,
  },
  notifTime: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    flexShrink: 0,
  },
  typeBadge: {
    alignSelf: 'flex-end',
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  typeLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    fontWeight: Typography.bold,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  emptyDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
