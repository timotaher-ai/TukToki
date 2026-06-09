// Powered by OnSpace.AI — Chat Screen (Dark Premium Redesign)
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  FlatList, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { mockDriverInfo, mockChatMessages, quickReplies } from '@/constants/mockData';
import { StatusBar } from 'expo-status-bar';

type Message = {
  id: string;
  from: 'driver' | 'user';
  text: string;
  time: string;
  read: boolean;
};

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      );
    Animated.parallel([anim(dot1, 0), anim(dot2, 150), anim(dot3, 300)]).start();
  }, []);

  return (
    <View style={typingSt.root}>
      <View style={typingSt.bubble}>
        {[dot1, dot2, dot3].map((d, i) => (
          <Animated.View key={i} style={[typingSt.dot, { transform: [{ translateY: d }] }]} />
        ))}
      </View>
    </View>
  );
}

const typingSt = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: Spacing.base, marginTop: 4 },
  bubble: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl, borderBottomLeftRadius: 4,
    paddingHorizontal: 16, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.sm,
  },
  dot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>(mockChatMessages as Message[]);
  const [input, setInput] = useState('');
  const [showQuick, setShowQuick] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputBarScale = useRef(new Animated.Value(1)).current;

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

    // Show typing indicator then driver reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const driverReplies = [
          'حسناً، في طريقي إليك',
          'فهمت، شكراً',
          'سأكون هناك خلال دقيقتين',
          'تمام 👍',
          'على الطريق 🚗',
        ];
        const reply: Message = {
          id: `m${Date.now()}_r`,
          from: 'driver',
          text: driverReplies[Math.floor(Math.random() * driverReplies.length)],
          time: now(),
          read: false,
        };
        setMessages(prev => [...prev, reply]);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
      }, 1800);
    }, 600);

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleFocus = () => {
    setInputFocused(true);
    setShowQuick(false);
    Animated.spring(inputBarScale, { toValue: 1.01, useNativeDriver: true, damping: 10 }).start();
  };

  const handleBlur = () => {
    setInputFocused(false);
    Animated.spring(inputBarScale, { toValue: 1, useNativeDriver: true, damping: 10 }).start();
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.from === 'user';
    const prevMsg = messages[index - 1];
    const showAvatar = !isUser && (!prevMsg || prevMsg.from !== 'driver');

    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowDriver]}>
        {/* Driver avatar */}
        {!isUser && (
          <View style={styles.avatarSlot}>
            {showAvatar ? (
              <View style={styles.msgAvatarWrap}>
                <Image
                  source={{ uri: mockDriverInfo.avatar }}
                  style={styles.msgAvatar}
                  contentFit="cover"
                />
              </View>
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
          </View>
        )}

        <View style={[styles.msgBubble, isUser ? styles.msgBubbleUser : styles.msgBubbleDriver]}>
          {/* Golden corner accent for user messages */}
          {isUser && <View style={styles.userBubbleCorner} />}

          <Text style={[styles.msgText, isUser ? styles.msgTextUser : styles.msgTextDriver]}>
            {item.text}
          </Text>

          <View style={[styles.msgMeta, isUser && styles.msgMetaUser]}>
            {isUser && (
              <MaterialIcons
                name={item.read ? 'done-all' : 'done'}
                size={12}
                color={item.read ? Colors.primary : 'rgba(232,160,32,0.5)'}
              />
            )}
            <Text style={[styles.msgTime, isUser ? styles.msgTimeUser : styles.msgTimeDriver]}>
              {item.time}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      {/* ── Header ─────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        {/* Left actions */}
        <View style={styles.headerActions}>
          <Pressable style={styles.headerActionBtn}>
            <MaterialIcons name="phone" size={18} color={Colors.success} />
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.headerActionBtn}>
            <MaterialIcons name="arrow-forward" size={18} color={Colors.textSecondary} />
          </Pressable>
        </View>

        {/* Center info */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerName}>{mockDriverInfo.name}</Text>
          <View style={styles.headerStatus}>
            <View style={styles.onlineDot} />
            <Text style={styles.headerStatusText}>السائق • متصل الآن</Text>
          </View>
        </View>

        {/* Avatar */}
        <View style={styles.headerAvatarWrap}>
          <Image
            source={{ uri: mockDriverInfo.avatar }}
            style={styles.headerAvatar}
            contentFit="cover"
          />
          <View style={styles.onlineDotLarge} />
        </View>
      </View>

      {/* Ride info banner */}
      <View style={styles.rideBanner}>
        <MaterialIcons name="local-taxi" size={14} color={Colors.primary} />
        <Text style={styles.rideBannerText}>
          {mockDriverInfo.car} · {mockDriverInfo.plate}
        </Text>
        <View style={styles.rideBannerDivider} />
        <MaterialIcons name="star" size={12} color={Colors.primary} />
        <Text style={styles.rideBannerRating}>{mockDriverInfo.rating}</Text>
      </View>

      {/* ── Messages List ───────────────────────────────────── */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: 12, gap: 6 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
      />

      {/* ── Quick Replies ───────────────────────────────────── */}
      {showQuick && (
        <View style={styles.quickSection}>
          <FlatList
            horizontal
            data={quickReplies}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Pressable style={styles.quickChip} onPress={() => sendMessage(item)}>
                <Text style={styles.quickChipText}>{item}</Text>
              </Pressable>
            )}
            contentContainerStyle={{ paddingHorizontal: Spacing.base, gap: 8, paddingVertical: 2 }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* ── Input Bar ───────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.inputBar,
          { paddingBottom: insets.bottom + 10 },
          inputFocused && styles.inputBarFocused,
          { transform: [{ scale: inputBarScale }] },
        ]}
      >
        {/* Send button */}
        <Pressable
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
        >
          <MaterialIcons name="send" size={18} color={input.trim() ? Colors.textInverse : Colors.textMuted} />
        </Pressable>

        {/* Text Input */}
        <TextInput
          style={[styles.textInput, inputFocused && styles.textInputFocused]}
          placeholder="اكتب رسالة..."
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={300}
          textAlign="right"
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="send"
          onSubmitEditing={() => sendMessage(input)}
        />

        {/* Quick toggle */}
        <Pressable
          style={[styles.quickToggleBtn, showQuick && styles.quickToggleBtnActive]}
          onPress={() => setShowQuick(prev => !prev)}
        >
          <MaterialIcons
            name="flash-on"
            size={20}
            color={showQuick ? Colors.textInverse : Colors.primary}
          />
        </Pressable>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // HEADER
  header: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Shadow.md,
  },
  headerAvatarWrap: { position: 'relative' },
  headerAvatar: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 2.5, borderColor: Colors.borderGold,
  },
  onlineDotLarge: {
    position: 'absolute', bottom: 1, right: 1,
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2.5, borderColor: Colors.surface,
  },
  headerCenter: { flex: 1, gap: 3 },
  headerName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  headerStatus: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, justifyContent: 'flex-end',
  },
  onlineDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: Colors.success,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  headerStatusText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textTertiary,
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerActionBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },

  // RIDE BANNER
  rideBanner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    backgroundColor: Colors.primarySurface,
    paddingVertical: 8, paddingHorizontal: Spacing.base,
    borderBottomWidth: 1, borderBottomColor: Colors.borderGold + '40',
  },
  rideBannerText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  rideBannerDivider: {
    width: 1, height: 12,
    backgroundColor: Colors.borderGold,
    marginHorizontal: 4,
  },
  rideBannerRating: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.bold,
    color: Colors.primary,
  },

  // MESSAGES
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 2,
  },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowDriver: { justifyContent: 'flex-start' },
  avatarSlot: { width: 36, flexShrink: 0 },
  avatarPlaceholder: { width: 36 },
  msgAvatarWrap: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1.5, borderColor: Colors.borderGold,
    overflow: 'hidden',
  },
  msgAvatar: { width: 34, height: 34, borderRadius: 17 },

  // BUBBLES
  msgBubble: {
    maxWidth: '72%',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  msgBubbleUser: {
    backgroundColor: '#2A1F00',
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    ...Shadow.goldenSm,
  },
  msgBubbleDriver: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  userBubbleCorner: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
  msgText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    lineHeight: 22,
    textAlign: 'right',
  },
  msgTextUser: { color: Colors.primary },
  msgTextDriver: { color: Colors.textPrimary },
  msgMeta: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, justifyContent: 'flex-start',
  },
  msgMetaUser: { justifyContent: 'flex-end' },
  msgTime: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
  },
  msgTimeUser: { color: Colors.primary + '80' },
  msgTimeDriver: { color: Colors.textMuted },

  // QUICK REPLIES
  quickSection: {
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  quickChip: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.full,
    paddingHorizontal: 16, paddingVertical: 9,
    borderWidth: 1, borderColor: Colors.borderGold + '60',
    flexShrink: 0,
  },
  quickChipText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold,
    color: Colors.primary,
  },

  // INPUT BAR
  inputBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border,
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: Spacing.base, paddingTop: Spacing.sm,
    gap: 8,
  },
  inputBarFocused: {
    borderTopColor: Colors.borderGold,
    borderTopWidth: 1.5,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: Spacing.base, paddingVertical: 10,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, color: Colors.textPrimary,
    maxHeight: 100,
    minHeight: 44,
  },
  textInputFocused: {
    borderColor: Colors.borderGold,
    backgroundColor: Colors.surfaceElevated,
  },
  quickToggleBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.borderGold + '60',
  },
  quickToggleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadow.goldenSm,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.golden,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.surfaceSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
});
