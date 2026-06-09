// Powered by OnSpace.AI — Driver-Passenger Chat Screen
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { mockDriverInfo, mockChatMessages, quickReplies } from '@/constants/mockData';

type Message = {
  id: string;
  from: 'driver' | 'user';
  text: string;
  time: string;
  read: boolean;
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>(mockChatMessages as Message[]);
  const [input, setInput] = useState('');
  const [showQuick, setShowQuick] = useState(true);

  const now = () => {
    const d = new Date();
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      from: 'user',
      text: text.trim(),
      time: now(),
      read: false,
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
    setShowQuick(false);

    // Simulated driver reply
    setTimeout(() => {
      const replies = [
        'حسناً، في طريقي إليك',
        'فهمت، شكراً',
        'سأكون هناك خلال دقيقتين',
        'تمام 👍',
      ];
      const reply: Message = {
        id: `m${Date.now()}_r`,
        from: 'driver',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: now(),
        read: false,
      };
      setMessages(prev => [...prev, reply]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.from === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowDriver]}>
        {!isUser && (
          <Image source={{ uri: mockDriverInfo.avatar }} style={styles.msgAvatar} contentFit="cover" />
        )}
        <View style={[styles.msgBubble, isUser ? styles.msgBubbleUser : styles.msgBubbleDriver]}>
          <Text style={[styles.msgText, isUser && { color: '#fff' }]}>{item.text}</Text>
          <View style={styles.msgMeta}>
            {isUser && item.read && (
              <MaterialIcons name="done-all" size={12} color="rgba(255,255,255,0.7)" />
            )}
            <Text style={[styles.msgTime, isUser && { color: 'rgba(255,255,255,0.7)' }]}>{item.time}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <LinearGradient
        colors={[Colors.secondary, Colors.secondaryLight]}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerRight}>
            <Pressable style={styles.callBtn}>
              <MaterialIcons name="phone" size={22} color="#fff" />
            </Pressable>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <MaterialIcons name="arrow-forward" size={22} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{mockDriverInfo.name}</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>متصل - السائق</Text>
            </View>
          </View>
          <Image source={{ uri: mockDriverInfo.avatar }} style={styles.driverAvatar} contentFit="cover" />
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: Spacing.base, gap: 8, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Quick Replies */}
      {showQuick && (
        <View style={styles.quickSection}>
          <FlatList
            horizontal
            data={quickReplies}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Pressable style={styles.quickChip} onPress={() => sendMessage(item)}>
                <Text style={styles.quickText}>{item}</Text>
              </Pressable>
            )}
            contentContainerStyle={{ paddingHorizontal: Spacing.base, gap: 8 }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* Input Bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable
          style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.sendGrad}
          >
            <MaterialIcons name="send" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
        <TextInput
          style={styles.textInput}
          placeholder="اكتب رسالة..."
          placeholderTextColor={Colors.textTertiary}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={300}
          textAlign="right"
          onFocus={() => setShowQuick(false)}
        />
        <Pressable style={styles.attachBtn} onPress={() => setShowQuick(prev => !prev)}>
          <MaterialIcons name="flash-on" size={22} color={Colors.primary} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  driverAvatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: Colors.primary },
  driverInfo: { flex: 1 },
  driverName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: '#fff',
    textAlign: 'right',
  },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'flex-end' },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  onlineText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  headerRight: { flexDirection: 'row', gap: 8 },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
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
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowDriver: { justifyContent: 'flex-start' },
  msgAvatar: { width: 32, height: 32, borderRadius: 16 },
  msgBubble: {
    maxWidth: '72%',
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: 4,
    ...Shadow.sm,
  },
  msgBubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  msgBubbleDriver: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  msgText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  msgMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'flex-end' },
  msgTime: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.textTertiary,
  },
  quickSection: {
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  quickChip: {
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  quickText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.secondary,
    fontWeight: Typography.semiBold,
  },
  inputBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  attachBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    borderRadius: 22,
    overflow: 'hidden',
    ...Shadow.golden,
  },
  sendGrad: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
