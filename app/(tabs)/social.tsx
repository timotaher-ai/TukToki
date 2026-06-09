// Powered by OnSpace.AI — Messages Screen (Dark Premium Design)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { mockConversations } from '@/constants/mockData';
import { StatusBar } from 'expo-status-bar';

type FilterTab = 'all' | 'drivers' | 'support';

const filterTabs: { id: FilterTab; label: string; icon: string }[] = [
  { id: 'all',     label: 'الكل',       icon: 'chat-bubble-outline' },
  { id: 'drivers', label: 'السائقون',   icon: 'drive-eta' },
  { id: 'support', label: 'الدعم الفني', icon: 'headset-mic' },
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockConversations.filter(c => {
    const matchFilter = activeFilter === 'all' ? true
      : activeFilter === 'support' ? c.type === 'support'
      : c.type === 'driver';
    const matchSearch = !searchQuery || c.name.includes(searchQuery);
    return matchFilter && matchSearch;
  });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Header ──────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={styles.headerIconBtn}>
          <MaterialIcons name="more-horiz" size={20} color={Colors.primary} />
        </Pressable>

        <Text style={styles.headerTitle}>الرسائل</Text>

        <Pressable style={styles.headerIconBtn}>
          <MaterialIcons name="edit-square" size={20} color={Colors.textSecondary} />
        </Pressable>
      </View>

      {/* ── Search ──────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن رسالة أو اسم..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
        </View>
      </View>

      {/* ── Filter Tabs ─────────────────────────────────────── */}
      <View style={styles.filterRow}>
        {filterTabs.map(tab => {
          const isActive = activeFilter === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setActiveFilter(tab.id)}
            >
              <MaterialIcons
                name={tab.icon as any}
                size={15}
                color={isActive ? Colors.textInverse : Colors.textTertiary}
              />
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Conversations List ──────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item: conv, index }) => (
          <Pressable
            style={[styles.convItem, index < filtered.length - 1 && styles.convItemBorder]}
            onPress={() => router.push('/chat')}
          >
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              {conv.isSystem ? (
                <View style={styles.systemAvatar}>
                  <Text style={styles.systemAvatarText}>تك</Text>
                  <Text style={styles.systemAvatarSub}>توكي</Text>
                </View>
              ) : (
                <Image
                  source={{ uri: conv.avatar || '' }}
                  style={styles.avatar}
                  contentFit="cover"
                  transition={200}
                />
              )}
              {/* Online dot */}
              {conv.online && <View style={styles.onlineDot} />}
              {/* Unread badge */}
              {conv.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{conv.unread}</Text>
                </View>
              )}
            </View>

            {/* Content */}
            <View style={styles.convContent}>
              {/* Name + Time row */}
              <View style={styles.convTopRow}>
                <Text style={styles.convTime}>{conv.time}</Text>
                <Text style={[styles.convName, conv.unread > 0 && styles.convNameUnread]}>
                  {conv.name}
                </Text>
              </View>

              {/* Pinned icon + Last message */}
              <View style={styles.convBottomRow}>
                <View style={styles.convMsgRow}>
                  {conv.pinned && (
                    <MaterialIcons name="push-pin" size={13} color={Colors.primary} style={{ marginLeft: 4 }} />
                  )}
                  <Text
                    style={[styles.convLastMsg, conv.unread > 0 && styles.convLastMsgUnread]}
                    numberOfLines={1}
                  >
                    {conv.lastMessage}
                  </Text>
                </View>
                {conv.lastMessageLine2 ? (
                  <Text style={styles.convLastMsg2} numberOfLines={1}>{conv.lastMessageLine2}</Text>
                ) : null}
              </View>
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.black,
    color: Colors.textPrimary,
  },
  headerIconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },

  // SEARCH
  searchWrap: { paddingHorizontal: Spacing.base, marginBottom: Spacing.base },
  searchBar: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: 12,
    gap: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },

  // FILTER TABS
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadow.goldenSm,
  },
  filterTabText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
    color: Colors.textTertiary,
  },
  filterTabTextActive: { color: Colors.textInverse },

  // CONVERSATIONS
  convItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    gap: Spacing.md,
  },
  convItemBorder: {},
  separator: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.base,
  },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, borderColor: Colors.border,
  },
  systemAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.surface,
    borderWidth: 2, borderColor: Colors.borderGold,
    alignItems: 'center', justifyContent: 'center',
  },
  systemAvatarText: {
    fontFamily: Typography.fontFamily,
    fontSize: 12, fontWeight: Typography.black,
    color: Colors.primary, lineHeight: 14,
  },
  systemAvatarSub: {
    fontFamily: Typography.fontFamily,
    fontSize: 9, fontWeight: Typography.bold,
    color: Colors.primary, lineHeight: 12,
  },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2.5, borderColor: Colors.background,
  },
  unreadBadge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: Colors.primary,
    borderRadius: 10, minWidth: 20, height: 20,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2, borderColor: Colors.background,
    ...Shadow.goldenSm,
  },
  unreadBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 10, fontWeight: Typography.black,
    color: Colors.textInverse,
  },
  convContent: { flex: 1 },
  convTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  convName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  convNameUnread: {
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  convTime: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  convBottomRow: { gap: 2 },
  convMsgRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'flex-end',
  },
  convLastMsg: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    textAlign: 'right',
    flex: 1,
  },
  convLastMsgUnread: { color: Colors.textSecondary },
  convLastMsg2: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'right',
  },
});
