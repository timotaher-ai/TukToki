// Powered by OnSpace.AI — TukTalk Social Feed — Dark Premium
import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput,
  ScrollView, Animated, Dimensions, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { mockPosts } from '@/constants/mockData';
import { StoriesBar } from './stories';
import { useAlert } from '@/template';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Extended mock posts ────────────────────────────────────────────────────────
const allPosts = [
  ...mockPosts,
  {
    id: 'post_verified_001',
    author: { name: 'عمر طارق', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', verified: true },
    content: 'رحلة من التجمع الخامس لوسط البلد في أسرع وقت ممكن مع تيك توكي! 🚀',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&h=350&fit=crop',
    likes: 78,
    comments: 11,
    shares: 5,
    time: 'منذ ساعة',
    liked: false,
    trending: false,
    isVerifiedRide: true,
    rideInfo: { from: 'التجمع الخامس', to: 'وسط البلد', price: 120, rating: 5, driver: 'أشرف محمود', vehicle: 'ملاكي توفير' },
  },
  {
    id: 'post_004',
    author: { name: 'نور إبراهيم', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', verified: false },
    content: 'اشتريت هدية لأمي من المول وجيت بيها بالتوك توك، السائق كان حلو جداً وساعدني في حملها 😊',
    image: null,
    likes: 45,
    comments: 8,
    shares: 2,
    time: 'منذ 3 ساعات',
    liked: true,
    trending: false,
    isVerifiedRide: false,
  },
  {
    id: 'post_verified_002',
    author: { name: 'محمود فاروق', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', verified: true },
    content: 'الرحلة كانت سريعة ومريحة رغم الزحمة! نجوم خمسة بدون تفكير ⭐⭐⭐⭐⭐',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&h=350&fit=crop',
    likes: 156,
    comments: 22,
    shares: 13,
    time: 'منذ 8 ساعات',
    liked: false,
    trending: true,
    isVerifiedRide: true,
    rideInfo: { from: 'المعادي', to: 'المهندسين', price: 75, rating: 5, driver: 'سامر علي', vehicle: 'توك توك' },
  },
];

type FeedFilter = 'for_you' | 'trending' | 'rides' | 'following';

const feedFilters: { id: FeedFilter; label: string; icon: string }[] = [
  { id: 'for_you',   label: 'لك',           icon: 'auto-awesome' },
  { id: 'trending',  label: 'الأكثر رواجاً', icon: 'trending-up' },
  { id: 'rides',     label: 'رحلات موثقة',   icon: 'verified' },
  { id: 'following', label: 'تتابعهم',       icon: 'people' },
];

// ── Trending Widget ────────────────────────────────────────────────────────────
const trendingTopics = [
  { rank: 1, tag: '#تيك_توكي', posts: '2.4k منشور', color: Colors.primary },
  { rank: 2, tag: '#رحلات_مصر', posts: '1.8k منشور', color: Colors.success },
  { rank: 3, tag: '#التوكتك_الذهبي', posts: '987 منشور', color: Colors.warning },
  { rank: 4, tag: '#إحالة_واكسب', posts: '654 منشور', color: '#9B59B6' },
  { rank: 5, tag: '#محفظة_تك_توكي', posts: '421 منشور', color: '#3D9BFF' },
];

function TrendingWidget() {
  return (
    <View style={trendSt.root}>
      <View style={trendSt.header}>
        <MaterialIcons name="local-fire-department" size={16} color={Colors.error} />
        <Text style={trendSt.headerTitle}>الأكثر رواجاً الآن 🔥</Text>
      </View>
      {trendingTopics.map(t => (
        <Pressable key={t.rank} style={trendSt.row}>
          <View style={[trendSt.rankWrap, { backgroundColor: t.color + '15' }]}>
            <Text style={[trendSt.rank, { color: t.color }]}>#{t.rank}</Text>
          </View>
          <View style={trendSt.info}>
            <Text style={trendSt.tag}>{t.tag}</Text>
            <Text style={trendSt.count}>{t.posts}</Text>
          </View>
          <MaterialIcons name="trending-up" size={16} color={t.color} />
        </Pressable>
      ))}
    </View>
  );
}

const trendSt = StyleSheet.create({
  root: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, gap: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: 7, justifyContent: 'flex-end', marginBottom: 4 },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: Spacing.xs },
  rankWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rank: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.black },
  info: { flex: 1 },
  tag: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  count: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right' },
});

// ── Verified Ride Banner ────────────────────────────────────────────────────────
function VerifiedRideBanner({ rideInfo }: { rideInfo: any }) {
  return (
    <LinearGradient
      colors={['#0D1E3A', Colors.primary + '25']}
      style={rideSt.root}
      start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}
    >
      <View style={rideSt.left}>
        <View style={rideSt.verifiedTag}>
          <MaterialIcons name="verified" size={11} color={Colors.primary} />
          <Text style={rideSt.verifiedText}>رحلة موثقة من تك توكي</Text>
        </View>
        <Text style={rideSt.route} numberOfLines={1}>{rideInfo.from} ← {rideInfo.to}</Text>
        <View style={rideSt.metaRow}>
          <View style={rideSt.vehiclePill}>
            <MaterialIcons name="local-taxi" size={10} color={Colors.primary} />
            <Text style={rideSt.vehicleText}>{rideInfo.vehicle}</Text>
          </View>
          <View style={rideSt.stars}>
            {[1,2,3,4,5].map(s => (
              <MaterialIcons key={s} name="star" size={10} color={s <= rideInfo.rating ? Colors.primary : Colors.surfaceElevated} />
            ))}
          </View>
          <Text style={rideSt.price}>{rideInfo.price} ج</Text>
        </View>
      </View>
      <MaterialIcons name="local-taxi" size={28} color={Colors.primary} style={{ opacity: 0.7 }} />
    </LinearGradient>
  );
}

const rideSt = StyleSheet.create({
  root: {
    borderRadius: Radius.lg, padding: Spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: Colors.borderGold,
    marginHorizontal: Spacing.base, marginBottom: Spacing.sm,
  },
  left: { flex: 1, gap: 4 },
  verifiedTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.bold, color: Colors.primary },
  route: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: '#fff', textAlign: 'right' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  stars: { flexDirection: 'row' },
  price: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.primary },
  vehiclePill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.primarySurface, borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2 },
  vehicleText: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.primary, fontWeight: Typography.bold },
});

// ── Like Button with animation ─────────────────────────────────────────────────
function LikeButton({ liked, count, onPress }: { liked: boolean; count: number; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.35, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 6 }),
    ]).start();
    onPress();
  };

  return (
    <Pressable style={postSt.actionBtn} onPress={handlePress}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialIcons name={liked ? 'favorite' : 'favorite-border'} size={20} color={liked ? Colors.error : Colors.textTertiary} />
      </Animated.View>
      <Text style={[postSt.actionCount, liked && { color: Colors.error }]}>{count}</Text>
      <Text style={postSt.actionLabel}>عجبني</Text>
    </Pressable>
  );
}

// ── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, onLike, onComment, onShare }: {
  post: typeof allPosts[0] & { isVerifiedRide?: boolean; rideInfo?: any };
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}) {
  return (
    <View style={postSt.root}>
      {/* Author row */}
      <View style={postSt.authorRow}>
        <Pressable style={postSt.moreBtn}>
          <MaterialIcons name="more-horiz" size={18} color={Colors.textMuted} />
        </Pressable>
        <View style={postSt.authorInfo}>
          <View style={postSt.authorMeta}>
            <Text style={postSt.authorTime}>{post.time}</Text>
            {post.author.verified && (
              <MaterialIcons name="verified" size={13} color={Colors.primary} />
            )}
            <Text style={postSt.authorName}>{post.author.name}</Text>
          </View>
        </View>
        <Image source={{ uri: post.author.avatar }} style={postSt.avatar} contentFit="cover" />
      </View>

      {/* Trending badge */}
      {post.trending && (
        <View style={postSt.trendingBadge}>
          <MaterialIcons name="local-fire-department" size={11} color={Colors.error} />
          <Text style={postSt.trendingText}>رائج الآن</Text>
        </View>
      )}

      {/* Content */}
      <Text style={postSt.content}>{post.content}</Text>

      {/* Image */}
      {post.image && (
        <Image
          source={{ uri: post.image }}
          style={postSt.postImage}
          contentFit="cover"
          transition={300}
        />
      )}

      {/* Verified ride banner */}
      {post.isVerifiedRide && post.rideInfo && (
        <VerifiedRideBanner rideInfo={post.rideInfo} />
      )}

      {/* Stats */}
      <View style={postSt.statsRow}>
        <Text style={postSt.stat}>{post.shares} مشاركة</Text>
        <Text style={postSt.stat}>·</Text>
        <Text style={postSt.stat}>{post.comments} تعليق</Text>
        <Text style={postSt.stat}>·</Text>
        <Text style={postSt.stat}>{post.likes} إعجاب</Text>
      </View>

      {/* Divider */}
      <View style={postSt.divider} />

      {/* Actions */}
      <View style={postSt.actionsRow}>
        <Pressable style={postSt.actionBtn} onPress={onShare}>
          <MaterialIcons name="share" size={20} color={Colors.textTertiary} />
          <Text style={postSt.actionLabel}>شاركها</Text>
        </Pressable>

        <Pressable style={postSt.actionBtn} onPress={onComment}>
          <MaterialIcons name="chat-bubble-outline" size={20} color={Colors.textTertiary} />
          <Text style={postSt.actionLabel}>تعليق</Text>
        </Pressable>

        <LikeButton liked={post.liked} count={post.likes} onPress={onLike} />
      </View>
    </View>
  );
}

const postSt = StyleSheet.create({
  root: { backgroundColor: Colors.surface, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: Spacing.base, paddingBottom: Spacing.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: Colors.border },
  authorInfo: { flex: 1 },
  authorMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'flex-end' },
  authorName: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary },
  authorTime: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted },
  moreBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  trendingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.errorSurface, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-end',
    marginHorizontal: Spacing.base, marginBottom: Spacing.xs,
  },
  trendingText: { fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.bold, color: Colors.error },
  content: {
    fontFamily: Typography.fontFamily, fontSize: Typography.base, color: Colors.textPrimary,
    lineHeight: 24, textAlign: 'right', paddingHorizontal: Spacing.base, marginBottom: Spacing.sm,
  },
  postImage: { width: '100%', height: 220, marginBottom: Spacing.sm },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6,
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm,
  },
  stat: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: Spacing.base },
  actionsRow: { flexDirection: 'row', paddingHorizontal: Spacing.sm },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 12,
  },
  actionLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: Typography.semiBold },
  actionCount: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: Typography.bold },
});

// ── Create Post Modal ─────────────────────────────────────────────────────────
function CreatePostModal({ visible, onClose, onCreate }: {
  visible: boolean; onClose: () => void;
  onCreate: (post: any) => void;
}) {
  const { user } = useApp();
  const [text, setText] = useState('');
  const [postType, setPostType] = useState<'text' | 'ride'>('text');
  const insets = useSafeAreaInsets();

  const handleCreate = () => {
    if (!text.trim()) return;
    const newPost = {
      id: `post_${Date.now()}`,
      author: { name: user.name, avatar: user.avatar, verified: user.isVerified },
      content: text.trim(),
      image: null,
      likes: 0,
      comments: 0,
      shares: 0,
      time: 'الآن',
      liked: false,
      trending: false,
      isVerifiedRide: postType === 'ride',
      rideInfo: postType === 'ride' ? { from: 'موقعك الحالي', to: 'وجهتك', price: 0, rating: 5, driver: 'السائق', vehicle: 'توك توك' } : undefined,
    };
    onCreate(newPost);
    setText('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={modalSt.overlay}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[modalSt.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={modalSt.handle} />

          {/* Header */}
          <View style={modalSt.header}>
            <Pressable onPress={onClose} style={modalSt.closeBtn}>
              <MaterialIcons name="close" size={20} color={Colors.textTertiary} />
            </Pressable>
            <Text style={modalSt.title}>إنشاء منشور جديد</Text>
            <Image source={{ uri: user.avatar }} style={modalSt.avatar} contentFit="cover" />
          </View>

          {/* Type tabs */}
          <View style={modalSt.typeTabs}>
            {([
              { id: 'text', label: 'نص', icon: 'edit' },
              { id: 'ride', label: 'رحلة موثقة', icon: 'verified' },
            ] as const).map(t => {
              const isActive = postType === t.id;
              return (
                <Pressable
                  key={t.id}
                  style={[modalSt.typeTab, isActive && modalSt.typeTabActive]}
                  onPress={() => setPostType(t.id)}
                >
                  <MaterialIcons name={t.icon as any} size={14} color={isActive ? Colors.textInverse : Colors.textTertiary} />
                  <Text style={[modalSt.typeTabText, isActive && { color: Colors.textInverse }]}>{t.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Text Input */}
          <View style={modalSt.inputWrap}>
            <TextInput
              style={modalSt.input}
              value={text}
              onChangeText={setText}
              placeholder="شاركنا رأيك أو تجربتك مع تيك توكي..."
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlign="right"
              maxLength={500}
            />
            <Text style={modalSt.charCount}>{text.length}/500</Text>
          </View>

          {/* Ride info notice */}
          {postType === 'ride' && (
            <View style={modalSt.rideNotice}>
              <MaterialIcons name="verified" size={14} color={Colors.primary} />
              <Text style={modalSt.rideNoticeText}>سيتم إضافة شريط "رحلة موثقة من تك توكي" تلقائياً من آخر رحلة مكتملة</Text>
            </View>
          )}

          {/* Toolbar */}
          <View style={modalSt.toolbar}>
            <Pressable style={modalSt.toolBtn}>
              <MaterialIcons name="photo-camera" size={20} color={Colors.primary} />
            </Pressable>
            <Pressable style={modalSt.toolBtn}>
              <MaterialIcons name="image" size={20} color={Colors.primary} />
            </Pressable>
            <Pressable style={modalSt.toolBtn}>
              <MaterialIcons name="location-on" size={20} color={Colors.primary} />
            </Pressable>
            <Pressable style={modalSt.toolBtn}>
              <MaterialIcons name="tag" size={20} color={Colors.primary} />
            </Pressable>
          </View>

          {/* Post button */}
          <Pressable
            style={[modalSt.postBtn, !text.trim() && modalSt.postBtnDisabled]}
            onPress={handleCreate}
            disabled={!text.trim()}
          >
            <MaterialIcons name="send" size={18} color={text.trim() ? Colors.textInverse : Colors.textMuted} />
            <Text style={[modalSt.postBtnText, !text.trim() && { color: Colors.textMuted }]}>نشر الآن</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const modalSt = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xxxl, borderTopRightRadius: Radius.xxxl,
    padding: Spacing.base, gap: Spacing.base,
    borderTopWidth: 1, borderColor: Colors.border,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  title: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: Colors.borderGold },
  typeTabs: { flexDirection: 'row', gap: Spacing.sm },
  typeTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSecondary, borderWidth: 1, borderColor: Colors.border,
  },
  typeTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeTabText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textTertiary },
  inputWrap: {
    backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.xl,
    padding: Spacing.md, gap: 8, borderWidth: 1, borderColor: Colors.border, minHeight: 120,
  },
  input: {
    fontFamily: Typography.fontFamily, fontSize: Typography.base, color: Colors.textPrimary,
    lineHeight: 24, minHeight: 80,
  },
  charCount: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted, textAlign: 'left' },
  rideNotice: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.primarySurface, borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  rideNoticeText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.primary, textAlign: 'right', lineHeight: 18 },
  toolbar: { flexDirection: 'row', gap: Spacing.md, justifyContent: 'flex-end' },
  toolBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primarySurface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.borderGold },
  postBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...Shadow.golden,
  },
  postBtnDisabled: { backgroundColor: Colors.surfaceSecondary },
  postBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textInverse },
});

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function TukTalkScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useApp();
  const { showAlert } = useAlert();

  const [activeFilter, setActiveFilter] = useState<FeedFilter>('for_you');
  const [posts, setPosts] = useState(allPosts);
  const [createVisible, setCreateVisible] = useState(false);

  const filteredPosts = posts.filter(p => {
    if (activeFilter === 'trending') return p.trending;
    if (activeFilter === 'rides') return (p as any).isVerifiedRide;
    return true;
  });

  const handleLike = useCallback((id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  }, []);

  const handleCreate = useCallback((newPost: any) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  type ListItem =
    | { type: 'stories' }
    | { type: 'filter' }
    | { type: 'trending' }
    | { type: 'post'; data: typeof allPosts[0] & { isVerifiedRide?: boolean; rideInfo?: any } };

  const listData: ListItem[] = [
    { type: 'stories' },
    { type: 'filter' },
    ...(activeFilter === 'trending' ? [{ type: 'trending' as const }] : []),
    ...filteredPosts.map(p => ({ type: 'post' as const, data: p })),
  ];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Header ─────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-forward" size={20} color={Colors.textSecondary} />
        </Pressable>

        <View style={styles.headerLogo}>
          <Text style={styles.headerLogoMain}>TukTalk</Text>
          <Text style={styles.headerLogoAr}>ساحة تك توكي</Text>
        </View>

        <Pressable style={styles.headerBtn} onPress={() => setCreateVisible(true)}>
          <MaterialIcons name="edit-square" size={20} color={Colors.primary} />
        </Pressable>
      </View>

      {/* ── Feed ───────────────────────────────────────────── */}
      <FlatList
        data={listData}
        keyExtractor={(item, i) => {
          if (item.type === 'post') return item.data.id;
          return `${item.type}_${i}`;
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: Spacing.md, paddingBottom: 100 }}
        renderItem={({ item }) => {
          if (item.type === 'stories') {
            return (
              <View>
                <View style={styles.storiesHeaderRow}>
                  <Pressable style={styles.storiesAllBtn} onPress={() => router.push('/stories')}>
                    <Text style={styles.storiesAllText}>كل الحكايات</Text>
                    <MaterialIcons name="arrow-back" size={13} color={Colors.primary} />
                  </Pressable>
                  <View style={styles.storiesTitleRow}>
                    <View style={styles.storiesDot} />
                    <Text style={styles.storiesTitle}>الحكايات</Text>
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <StoriesBar />
                </ScrollView>
              </View>
            );
          }

          if (item.type === 'filter') {
            return (
              <ScrollView
                horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: Spacing.base, gap: 10, paddingVertical: 2 }}
              >
                {feedFilters.map(f => {
                  const isActive = activeFilter === f.id;
                  return (
                    <Pressable
                      key={f.id}
                      style={[styles.filterChip, isActive && styles.filterChipActive]}
                      onPress={() => setActiveFilter(f.id)}
                    >
                      <MaterialIcons name={f.icon as any} size={14} color={isActive ? Colors.textInverse : Colors.textTertiary} />
                      <Text style={[styles.filterChipText, isActive && { color: Colors.textInverse }]}>{f.label}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            );
          }

          if (item.type === 'trending') {
            return (
              <View style={{ paddingHorizontal: Spacing.base }}>
                <TrendingWidget />
              </View>
            );
          }

          if (item.type === 'post') {
            return (
              <View style={{ paddingHorizontal: Spacing.base }}>
                <PostCard
                  post={item.data as any}
                  onLike={() => handleLike(item.data.id)}
                  onComment={() => router.push(`/post-detail?postId=${item.data.id}` as any)}
                  onShare={() => showAlert('مشاركة', 'تم نسخ رابط المنشور!')}
                />
              </View>
            );
          }
          return null;
        }}
      />

      {/* ── FAB ────────────────────────────────────────────── */}
      <Pressable
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => setCreateVisible(true)}
      >
        <LinearGradient
          colors={[Colors.primary, '#B87418']}
          style={styles.fabGrad}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="add" size={26} color="#fff" />
        </LinearGradient>
      </Pressable>

      {/* ── Create Post Modal ───────────────────────────────── */}
      <CreatePostModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreate={handleCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  headerLogo: { alignItems: 'center' },
  headerLogoMain: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.black, color: Colors.primary },
  headerLogoAr: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textMuted, letterSpacing: 1 },

  storiesHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.xs, paddingTop: Spacing.sm,
  },
  storiesTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  storiesDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  storiesTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary },
  storiesAllBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primarySurface, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.borderGold,
  },
  storiesAllText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.semiBold },

  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary, ...Shadow.goldenSm },
  filterChipText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textTertiary },

  fab: { position: 'absolute', right: Spacing.base },
  fabGrad: {
    width: 58, height: 58, borderRadius: 29,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.golden,
  },
});
