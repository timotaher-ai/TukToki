// Powered by OnSpace.AI — Post Detail (TukTalk) - Dark Premium
import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput,
  KeyboardAvoidingView, Platform, Animated, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { mockPosts } from '@/constants/mockData';
import { useApp } from '@/hooks/useApp';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_W } = Dimensions.get('window');

interface Comment {
  id: string;
  postId: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  liked: boolean;
  replyTo: string | null;
  isReply: boolean;
}

const allPosts = [
  ...mockPosts,
  {
    id: 'post_verified_001',
    author: { name: 'عمر طارق', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', verified: true },
    content: 'رحلة من التجمع الخامس لوسط البلد في أسرع وقت ممكن مع تيك توكي! 🚀',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&h=350&fit=crop',
    likes: 78, comments: 11, shares: 5, time: 'منذ ساعة', liked: false, trending: false,
    isVerifiedRide: true,
    rideInfo: { from: 'التجمع الخامس', to: 'وسط البلد', price: 120, rating: 5, driver: 'أشرف محمود', vehicle: 'ملاكي توفير' },
  },
  {
    id: 'post_004',
    author: { name: 'نور إبراهيم', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', verified: false },
    content: 'اشتريت هدية لأمي من المول وجيت بيها بالتوك توك، السائق كان حلو جداً وساعدني في حملها 😊',
    image: null, likes: 45, comments: 8, shares: 2, time: 'منذ 3 ساعات', liked: true, trending: false,
    isVerifiedRide: false, rideInfo: null,
  },
];

const commentsByPost: Record<string, Comment[]> = {
  post_001: [
    { id: 'c1', postId: 'post_001', author: 'علي حسن', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop', text: 'موافق تماماً! خدمة ممتازة وسائق محترم جداً', time: 'منذ 10 دقائق', likes: 5, liked: false, replyTo: null, isReply: false },
    { id: 'c1r1', postId: 'post_001', author: 'دينا رامي', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop', text: 'موافقك الرأي يا علي! الخدمة في المعادي ممتازة خصوصاً في أوقات الذروة', time: 'منذ 8 دقائق', likes: 3, liked: true, replyTo: 'علي حسن', isReply: true },
    { id: 'c2', postId: 'post_001', author: 'منى أحمد', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop', text: 'انا كمان جربتها وكانت تجربة رائعة 😍 نصحت بيها كل صاحباتي', time: 'منذ 20 دقيقة', likes: 3, liked: false, replyTo: null, isReply: false },
    { id: 'c3', postId: 'post_001', author: 'أيمن طارق', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop', text: 'وصلت بأمان والسائق كان محترف جداً 👏 خصوصاً في ظل الزحمة الشديدة', time: 'منذ ساعة', likes: 15, liked: false, replyTo: null, isReply: false },
    { id: 'c3r1', postId: 'post_001', author: 'نور إبراهيم', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop', text: 'نفس الإحساس! دايماً وصلت في الميعاد', time: 'منذ 50 دقيقة', likes: 7, liked: false, replyTo: 'أيمن طارق', isReply: true },
    { id: 'c4', postId: 'post_001', author: 'خالد مصطفى', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop', text: 'السعر مناسب جداً مقارنة بالبدائل الأخرى، أنصح بيها بشدة', time: 'منذ ساعتين', likes: 12, liked: true, replyTo: null, isReply: false },
  ],
  post_002: [
    { id: 'p2c1', postId: 'post_002', author: 'نادر حسن', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop', text: 'خاصية الأسرة أنقذتني فعلاً! أولادي دايماً في مكان آمن', time: 'منذ يوم', likes: 45, liked: false, replyTo: null, isReply: false },
    { id: 'p2c2', postId: 'post_002', author: 'هدى سمير', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop', text: 'نفس الشعور! مطمن أكثر على عيالي دلوقتي 🙏', time: 'منذ يومين', likes: 22, liked: false, replyTo: null, isReply: false },
    { id: 'p2c2r1', postId: 'post_002', author: 'أميرة محمد', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop', text: 'أنا معاكي يا هدى! التطبيق غير حياتي مع بناتي', time: 'منذ يومين', likes: 8, liked: true, replyTo: 'هدى سمير', isReply: true },
  ],
  post_003: [
    { id: 'p3c1', postId: 'post_003', author: 'خالد مصطفى', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop', text: 'كود الإحالة بتاعي KHALID2024 يلا استخدموه 😂', time: 'منذ ساعة', likes: 12, liked: false, replyTo: null, isReply: false },
    { id: 'p3c2', postId: 'post_003', author: 'سلمى طارق', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop', text: 'أنا برضو عملت كويس من الإحالات! النظام ممتاز ومربح جداً 🎉', time: 'منذ 3 ساعات', likes: 8, liked: true, replyTo: null, isReply: false },
  ],
  post_verified_001: [
    { id: 'pv1c1', postId: 'post_verified_001', author: 'سلمى طارق', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop', text: 'ما شاء الله عليك! رحلة من ده لده كانت 90 جنيه معايا', time: 'منذ 40 دقيقة', likes: 6, liked: false, replyTo: null, isReply: false },
    { id: 'pv1c2', postId: 'post_verified_001', author: 'محمد فاروق', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop', text: 'أشرف محمود ده سائق ممتاز! ركبت معاه قبل كده وكان محترم جداً', time: 'منذ ساعة', likes: 9, liked: true, replyTo: null, isReply: false },
  ],
};

// ── LikeButton ────────────────────────────────────────────────────────────────
function LikeButton({ liked, count, onPress, size = 16 }: { liked: boolean; count: number; onPress: () => void; size?: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.4, duration: 90, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 6 }),
    ]).start();
    onPress();
  };
  return (
    <Pressable style={cSt.likeBtn} onPress={handlePress} hitSlop={8}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialIcons name={liked ? 'favorite' : 'favorite-border'} size={size} color={liked ? Colors.error : Colors.textTertiary} />
      </Animated.View>
      {count > 0 && <Text style={[cSt.likeCount, liked && { color: Colors.error }]}>{count}</Text>}
    </Pressable>
  );
}

// ── CommentItem ───────────────────────────────────────────────────────────────
function CommentItem({ comment, onLike, onReply }: {
  comment: Comment;
  onLike: (id: string) => void;
  onReply: (author: string, commentId: string) => void;
}) {
  return (
    <View style={[cSt.root, comment.isReply && cSt.rootReply]}>
      {comment.isReply && <View style={cSt.replyLine} />}
      <Image source={{ uri: comment.avatar }} style={[cSt.avatar, comment.isReply && cSt.avatarSm]} contentFit="cover" />
      <View style={cSt.body}>
        <View style={[cSt.bubble, comment.isReply && cSt.bubbleReply]}>
          {comment.replyTo && (
            <View style={cSt.replyToRow}>
              <MaterialIcons name="reply" size={10} color={Colors.primary} />
              <Text style={cSt.replyToText}>رداً على <Text style={cSt.replyToName}>{comment.replyTo}</Text></Text>
            </View>
          )}
          <Text style={cSt.author}>{comment.author}</Text>
          <Text style={cSt.text}>{comment.text}</Text>
        </View>
        <View style={cSt.actions}>
          <Text style={cSt.time}>{comment.time}</Text>
          <Text style={cSt.dot}>·</Text>
          <LikeButton liked={comment.liked} count={comment.likes} onPress={() => onLike(comment.id)} size={13} />
          <Text style={cSt.dot}>·</Text>
          <Pressable style={cSt.replyBtn} onPress={() => onReply(comment.author, comment.id)} hitSlop={8}>
            <MaterialIcons name="reply" size={13} color={Colors.textMuted} />
            <Text style={cSt.replyBtnText}>رد</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const cSt = StyleSheet.create({
  root: { flexDirection: 'row', paddingHorizontal: Spacing.base, paddingVertical: 10, gap: 10, alignItems: 'flex-start' },
  rootReply: { paddingLeft: Spacing.xl + Spacing.base, position: 'relative' },
  replyLine: { position: 'absolute', left: Spacing.xl + 10, top: 0, bottom: 0, width: 1.5, backgroundColor: Colors.border },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, flexShrink: 0 },
  avatarSm: { width: 32, height: 32, borderRadius: 16 },
  body: { flex: 1, gap: 5 },
  bubble: { backgroundColor: Colors.surface, borderRadius: Radius.xl, borderTopRightRadius: Radius.sm, padding: Spacing.md, gap: 3, borderWidth: 1, borderColor: Colors.border },
  bubbleReply: { backgroundColor: Colors.surfaceSecondary, borderColor: Colors.primary + '25' },
  replyToRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  replyToText: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textTertiary },
  replyToName: { color: Colors.primary, fontWeight: Typography.bold as any },
  author: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold as any, color: Colors.textPrimary, textAlign: 'right' },
  text: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20, textAlign: 'right' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  time: { fontFamily: Typography.fontFamily, fontSize: 11, color: Colors.textMuted },
  dot: { fontSize: 11, color: Colors.textMuted },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  likeCount: { fontFamily: Typography.fontFamily, fontSize: 11, color: Colors.textMuted, fontWeight: Typography.bold as any },
  replyBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  replyBtnText: { fontFamily: Typography.fontFamily, fontSize: 11, color: Colors.textMuted, fontWeight: Typography.semiBold as any },
});

// ── VerifiedRideBanner ────────────────────────────────────────────────────────
function VerifiedRideBanner({ rideInfo }: { rideInfo: any }) {
  return (
    <LinearGradient colors={['#0D1E3A', Colors.primary + '20']} style={rdSt.root} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}>
      <View style={rdSt.left}>
        <View style={rdSt.tag}>
          <MaterialIcons name="verified" size={11} color={Colors.primary} />
          <Text style={rdSt.tagText}>رحلة موثقة من تك توكي</Text>
        </View>
        <Text style={rdSt.route} numberOfLines={1}>{rideInfo.from} ← {rideInfo.to}</Text>
        <View style={rdSt.meta}>
          <View style={rdSt.pill}><MaterialIcons name="local-taxi" size={10} color={Colors.primary} /><Text style={rdSt.pillText}>{rideInfo.vehicle}</Text></View>
          <View style={rdSt.stars}>{[1,2,3,4,5].map(s => <MaterialIcons key={s} name="star" size={10} color={s <= rideInfo.rating ? Colors.primary : Colors.surfaceElevated} />)}</View>
          <Text style={rdSt.price}>{rideInfo.price} ج</Text>
        </View>
      </View>
      <MaterialIcons name="local-taxi" size={30} color={Colors.primary} style={{ opacity: 0.65 }} />
    </LinearGradient>
  );
}

const rdSt = StyleSheet.create({
  root: { borderRadius: Radius.xl, padding: Spacing.base, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.borderGold },
  left: { flex: 1, gap: 5 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tagText: { fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.bold as any, color: Colors.primary },
  route: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold as any, color: '#fff', textAlign: 'right' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  stars: { flexDirection: 'row' },
  price: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.black as any, color: Colors.primary },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.primarySurface, borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2 },
  pillText: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.primary, fontWeight: Typography.bold as any },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function PostDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useApp();
  const params = useLocalSearchParams<{ postId?: string }>();

  const postId = params.postId || 'post_001';
  const post = allPosts.find(p => p.id === postId) || allPosts[0];

  const [postState, setPostState] = useState({ liked: post.liked, likes: post.likes, comments: post.comments, shares: post.shares });
  const [displayComments, setDisplayComments] = useState<Comment[]>(commentsByPost[post.id] || commentsByPost['post_001']);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ author: string; commentId: string } | null>(null);
  const inputRef = useRef<TextInput>(null);
  const postLikeScale = useRef(new Animated.Value(1)).current;

  const handleLikePost = useCallback(() => {
    Animated.sequence([
      Animated.timing(postLikeScale, { toValue: 1.35, duration: 90, useNativeDriver: true }),
      Animated.spring(postLikeScale, { toValue: 1, useNativeDriver: true, damping: 6 }),
    ]).start();
    setPostState(prev => ({ ...prev, liked: !prev.liked, likes: prev.liked ? prev.likes - 1 : prev.likes + 1 }));
  }, []);

  const handleLikeComment = useCallback((id: string) => {
    setDisplayComments(prev => prev.map(c => c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c));
  }, []);

  const handleReply = useCallback((author: string, commentId: string) => {
    setReplyingTo({ author, commentId });
    setCommentText(`@${author} `);
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(() => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `c_${Date.now()}`, postId: post.id, author: user.name, avatar: user.avatar,
      text: commentText.trim(), time: 'الآن', likes: 0, liked: false,
      replyTo: replyingTo?.author || null, isReply: !!replyingTo,
    };
    setDisplayComments(prev => {
      if (replyingTo) {
        const idx = prev.findIndex(c => c.id === replyingTo.commentId);
        const arr = [...prev];
        arr.splice(idx >= 0 ? idx + 1 : arr.length, 0, newComment);
        return arr;
      }
      return [newComment, ...prev];
    });
    setPostState(prev => ({ ...prev, comments: prev.comments + 1 }));
    setCommentText('');
    setReplyingTo(null);
  }, [commentText, replyingTo, post.id, user]);

  const renderHeader = useCallback(() => (
    <View>
      {/* Hero or text header */}
      {post.image ? (
        <View style={st.heroWrap}>
          <Image source={{ uri: post.image }} style={st.heroImg} contentFit="cover" transition={300} />
          <LinearGradient colors={['rgba(0,0,0,0.55)', 'transparent', 'rgba(0,0,0,0.72)']} style={StyleSheet.absoluteFill} />
          <Pressable style={[st.heroBack, { top: insets.top + 10 }]} onPress={() => router.back()}>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </Pressable>
          <View style={st.heroBottom}>
            <View style={st.heroAuthorInfo}>
              <View style={st.heroAuthorMeta}>
                {post.author.verified && <MaterialIcons name="verified" size={14} color={Colors.primary} />}
                <Text style={st.heroAuthorName}>{post.author.name}</Text>
              </View>
              <Text style={st.heroTime}>{post.time}</Text>
            </View>
            <Image source={{ uri: post.author.avatar }} style={st.heroAvatar} contentFit="cover" />
          </View>
        </View>
      ) : (
        <View style={[st.textHeader, { paddingTop: insets.top + 10 }]}>
          <Pressable style={st.textHeaderBack} onPress={() => router.back()}>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.textSecondary} />
          </Pressable>
          <View style={st.textHeaderRight}>
            <View>
              <View style={st.textHeaderMeta}>
                <Text style={st.textHeaderName}>{post.author.name}</Text>
                {post.author.verified && <MaterialIcons name="verified" size={13} color={Colors.primary} />}
              </View>
              <Text style={st.textHeaderTime}>{post.time}</Text>
            </View>
            <Image source={{ uri: post.author.avatar }} style={st.textHeaderAvatar} contentFit="cover" />
          </View>
        </View>
      )}

      {/* Content */}
      <View style={st.contentSection}>
        {(post as any).trending && (
          <View style={st.trendBadge}>
            <MaterialIcons name="local-fire-department" size={11} color={Colors.error} />
            <Text style={st.trendText}>رائج الآن</Text>
          </View>
        )}
        <Text style={st.postText}>{post.content}</Text>
        {(post as any).isVerifiedRide && (post as any).rideInfo && (
          <VerifiedRideBanner rideInfo={(post as any).rideInfo} />
        )}

        {/* Stats */}
        <View style={st.statsRow}>
          <Text style={st.stat}>{postState.shares} مشاركة</Text>
          <Text style={st.statDot}>·</Text>
          <Text style={st.stat}>{postState.comments} تعليق</Text>
          <Text style={st.statDot}>·</Text>
          <Text style={st.stat}>{postState.likes} إعجاب</Text>
        </View>

        <View style={st.divider} />

        {/* Actions */}
        <View style={st.actionsRow}>
          <Pressable style={st.actionBtn}>
            <MaterialIcons name="share" size={20} color={Colors.textTertiary} />
            <Text style={st.actionLabel}>شاركها</Text>
          </Pressable>
          <Pressable style={st.actionBtn} onPress={() => inputRef.current?.focus()}>
            <MaterialIcons name="chat-bubble-outline" size={20} color={Colors.primary} />
            <Text style={[st.actionLabel, { color: Colors.primary }]}>تعليق</Text>
          </Pressable>
          <Pressable style={st.actionBtn} onPress={handleLikePost}>
            <Animated.View style={{ transform: [{ scale: postLikeScale }] }}>
              <MaterialIcons name={postState.liked ? 'favorite' : 'favorite-border'} size={20} color={postState.liked ? Colors.error : Colors.textTertiary} />
            </Animated.View>
            <Text style={[st.actionLabel, postState.liked && { color: Colors.error }]}>
              {postState.likes} عجبني
            </Text>
          </Pressable>
        </View>

        <View style={st.divider} />
      </View>

      {/* Comments header */}
      <View style={st.commentsHeader}>
        <View style={st.commentsCountBadge}>
          <Text style={st.commentsCountText}>{displayComments.length}</Text>
        </View>
        <Text style={st.commentsTitle}>التعليقات</Text>
      </View>
    </View>
  ), [post, postState, displayComments.length, insets, handleLikePost]);

  return (
    <KeyboardAvoidingView style={st.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />

      <FlatList
        data={displayComments}
        keyExtractor={c => c.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={st.separator} />}
        ListEmptyComponent={() => (
          <View style={st.emptyState}>
            <MaterialIcons name="chat-bubble-outline" size={48} color={Colors.textMuted} />
            <Text style={st.emptyTitle}>لا تعليقات بعد</Text>
            <Text style={st.emptySub}>كن أول من يعلق!</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <CommentItem comment={item} onLike={handleLikeComment} onReply={handleReply} />
        )}
      />

      {/* Input Bar */}
      <View style={[st.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        {/* Reply indicator */}
        {replyingTo && (
          <View style={st.replyIndicator}>
            <Pressable onPress={() => { setReplyingTo(null); setCommentText(''); }} style={st.replyClose}>
              <MaterialIcons name="close" size={15} color={Colors.textTertiary} />
            </Pressable>
            <View style={st.replyIndicatorContent}>
              <MaterialIcons name="reply" size={13} color={Colors.primary} />
              <Text style={st.replyIndicatorText}>
                رداً على <Text style={st.replyIndicatorName}>{replyingTo.author}</Text>
              </Text>
            </View>
          </View>
        )}

        {/* Input row */}
        <View style={st.inputRow}>
          <Pressable
            style={[st.sendBtn, !commentText.trim() && st.sendBtnOff]}
            onPress={handleSend}
            disabled={!commentText.trim()}
          >
            <MaterialIcons name="send" size={18} color={commentText.trim() ? Colors.textInverse : Colors.textMuted} />
          </Pressable>
          <TextInput
            ref={inputRef}
            style={st.input}
            value={commentText}
            onChangeText={setCommentText}
            placeholder={replyingTo ? `رد على ${replyingTo.author}...` : 'أضف تعليقاً...'}
            placeholderTextColor={Colors.textMuted}
            textAlign="right"
            multiline
            maxLength={300}
          />
          <Image source={{ uri: user.avatar }} style={st.inputAvatar} contentFit="cover" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // HERO
  heroWrap: { width: SCREEN_W, height: 285, position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroBack: { position: 'absolute', left: Spacing.base, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  heroBottom: { position: 'absolute', bottom: 18, left: Spacing.base, right: Spacing.base, flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroAvatar: { width: 46, height: 46, borderRadius: 23, borderWidth: 2.5, borderColor: Colors.primary },
  heroAuthorInfo: { flex: 1 },
  heroAuthorMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'flex-end' },
  heroAuthorName: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold as any, color: '#fff' },
  heroTime: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.65)', textAlign: 'right', marginTop: 2 },

  // TEXT HEADER
  textHeader: { backgroundColor: Colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  textHeaderBack: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  textHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  textHeaderMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  textHeaderName: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold as any, color: Colors.textPrimary },
  textHeaderTime: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, marginTop: 2 },
  textHeaderAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: Colors.border },

  // CONTENT
  contentSection: { backgroundColor: Colors.background, padding: Spacing.base, gap: Spacing.md },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.errorSurface, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-end' },
  trendText: { fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.bold as any, color: Colors.error },
  postText: { fontFamily: Typography.fontFamily, fontSize: Typography.md, color: Colors.textPrimary, lineHeight: 28, textAlign: 'right' },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  stat: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted },
  statDot: { fontSize: Typography.xs, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.divider },
  actionsRow: { flexDirection: 'row' },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  actionLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textTertiary, fontWeight: Typography.semiBold as any },

  // COMMENTS HEADER
  commentsHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider, justifyContent: 'flex-end' },
  commentsTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.bold as any, color: Colors.textPrimary },
  commentsCountBadge: { backgroundColor: Colors.primarySurface, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.borderGold },
  commentsCountText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.black as any, color: Colors.primary },

  // EMPTY
  emptyState: { alignItems: 'center', paddingTop: 40, gap: Spacing.md },
  emptyTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.bold as any, color: Colors.textPrimary },
  emptySub: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textTertiary },
  separator: { height: 1, backgroundColor: Colors.divider, marginHorizontal: Spacing.base },

  // INPUT BAR
  inputBar: { backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 8, paddingHorizontal: Spacing.base, ...Shadow.md },
  replyIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, marginBottom: 2 },
  replyClose: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  replyIndicatorContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primarySurface, borderRadius: Radius.lg, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: Colors.borderGold },
  replyIndicatorText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textSecondary },
  replyIndicatorName: { color: Colors.primary, fontWeight: Typography.bold as any },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  inputAvatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: Colors.borderGold, flexShrink: 0 },
  input: {
    flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.base, color: Colors.textPrimary,
    backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.full,
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1.5, borderColor: Colors.border, maxHeight: 88,
  },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...Shadow.goldenSm },
  sendBtnOff: { backgroundColor: Colors.surfaceSecondary },
});
