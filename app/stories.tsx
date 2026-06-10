// Powered by OnSpace.AI — حكايات (Stories) Screen - TukTalk
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, Dimensions, PanResponder,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const STORY_DURATION = 15000; // 15 seconds per story

// ── Mock story data ──────────────────────────────────────────────────────────
const mockStoriesData = [
  {
    userId: 's1',
    user: 'أنا',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    isOwn: true,
    stories: [
      {
        id: 'st1',
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&h=900&fit=crop',
        text: 'رحلة رائعة من المعادي للمهندسين 🚗✨',
        isRide: true,
        rideInfo: { from: 'المعادي', to: 'المهندسين', price: 45, rating: 5, driver: 'محمد أحمد' },
        timestamp: '2 ساعات',
        viewers: 34,
        viewed: false,
      },
      {
        id: 'st2',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=900&fit=crop',
        text: 'صباح جميل من قلب القاهرة ☀️',
        isRide: false,
        timestamp: '5 ساعات',
        viewers: 21,
        viewed: false,
      },
    ],
  },
  {
    userId: 's2',
    user: 'سارة',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    isOwn: false,
    stories: [
      {
        id: 'st3',
        image: 'https://images.unsplash.com/photo-1566698869547-9e1c4a9f7c48?w=500&h=900&fit=crop',
        text: 'وصلت بأمان مع تيك توكي 💛',
        isRide: true,
        rideInfo: { from: 'الزمالك', to: 'التجمع الخامس', price: 120, rating: 5, driver: 'أحمد خالد' },
        timestamp: '30 دقيقة',
        viewers: 89,
        viewed: false,
      },
    ],
  },
  {
    userId: 's3',
    user: 'كريم',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    isOwn: false,
    stories: [
      {
        id: 'st4',
        image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&h=900&fit=crop',
        text: 'اليوم السائق كان ممتاز جداً 👏',
        isRide: false,
        timestamp: 'أمس',
        viewers: 45,
        viewed: true,
      },
    ],
  },
  {
    userId: 's4',
    user: 'هنا',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    isOwn: false,
    stories: [
      {
        id: 'st5',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=900&fit=crop',
        text: 'ربحت 100 جنيه من الإحالات هذا الأسبوع! 🎉',
        isRide: false,
        timestamp: '3 ساعات',
        viewers: 112,
        viewed: false,
      },
    ],
  },
  {
    userId: 's5',
    user: 'محمود',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    isOwn: false,
    stories: [
      {
        id: 'st6',
        image: 'https://images.unsplash.com/photo-1501526029524-a8ea952b15be?w=500&h=900&fit=crop',
        text: 'تيك توكي أفضل تطبيق في مصر 🏆',
        isRide: true,
        rideInfo: { from: 'مدينة نصر', to: 'وسط البلد', price: 65, rating: 4, driver: 'سامي علي' },
        timestamp: '6 ساعات',
        viewers: 67,
        viewed: true,
      },
    ],
  },
];

// ── Stories Viewer Component ─────────────────────────────────────────────────
function StoriesViewer({ initialUser, onClose }: { initialUser: number; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [userIdx, setUserIdx] = useState(initialUser);
  const [storyIdx, setStoryIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressRef = useRef<Animated.CompositeAnimation | null>(null);
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const currentUser = mockStoriesData[userIdx];
  const currentStory = currentUser?.stories[storyIdx];
  const totalStories = currentUser?.stories.length || 1;

  const goNext = () => {
    if (storyIdx < totalStories - 1) {
      setStoryIdx(prev => prev + 1);
    } else if (userIdx < mockStoriesData.length - 1) {
      setUserIdx(prev => prev + 1);
      setStoryIdx(0);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (storyIdx > 0) {
      setStoryIdx(prev => prev - 1);
    } else if (userIdx > 0) {
      setUserIdx(prev => prev - 1);
      setStoryIdx(0);
    }
  };

  useEffect(() => {
    progressAnim.setValue(0);
    // Fade in
    Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();

    if (!paused) {
      progressRef.current = Animated.timing(progressAnim, {
        toValue: 1,
        duration: STORY_DURATION,
        useNativeDriver: false,
      });
      progressRef.current.start(({ finished }) => {
        if (finished) goNext();
      });
    }
    return () => progressRef.current?.stop();
  }, [storyIdx, userIdx, paused]);

  if (!currentStory) return null;

  return (
    <View style={[viewerSt.root, { backgroundColor: '#000' }]}>
      <StatusBar style="light" />

      {/* Full Image */}
      <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: opacityAnim }]}>
        <Image
          source={{ uri: currentStory.image }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={300}
        />
        {/* Dark overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent', 'transparent', 'rgba(0,0,0,0.7)']}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Progress bars */}
      <View style={[viewerSt.progressRow, { top: insets.top + 8 }]}>
        {currentUser.stories.map((_, i) => (
          <View key={i} style={viewerSt.progressTrack}>
            <Animated.View
              style={[
                viewerSt.progressFill,
                {
                  width: i < storyIdx ? '100%'
                    : i === storyIdx
                    ? progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                    : '0%',
                },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Header */}
      <View style={[viewerSt.header, { top: insets.top + 24 }]}>
        <View style={viewerSt.headerActions}>
          <Pressable style={viewerSt.headerBtn} onPress={onClose}>
            <MaterialIcons name="close" size={22} color="#fff" />
          </Pressable>
          <Pressable style={viewerSt.headerBtn} onPress={() => setPaused(p => !p)}>
            <MaterialIcons name={paused ? 'play-arrow' : 'pause'} size={20} color="#fff" />
          </Pressable>
        </View>
        <View style={viewerSt.userInfo}>
          <View style={viewerSt.avatarWrap}>
            <Image source={{ uri: currentUser.avatar }} style={viewerSt.avatar} contentFit="cover" />
          </View>
          <View style={viewerSt.userText}>
            <Text style={viewerSt.userName}>{currentUser.user}</Text>
            <Text style={viewerSt.storyTime}>{currentStory.timestamp}</Text>
          </View>
        </View>
      </View>

      {/* Tap zones */}
      <Pressable
        style={viewerSt.tapLeft}
        onPress={goPrev}
        onLongPress={() => setPaused(true)}
        onPressOut={() => setPaused(false)}
      />
      <Pressable
        style={viewerSt.tapRight}
        onPress={goNext}
        onLongPress={() => setPaused(true)}
        onPressOut={() => setPaused(false)}
      />

      {/* Bottom content */}
      <View style={[viewerSt.bottom, { paddingBottom: insets.bottom + 20 }]}>
        {/* Story text */}
        {currentStory.text ? (
          <Text style={viewerSt.storyText}>{currentStory.text}</Text>
        ) : null}

        {/* Verified Ride Banner */}
        {currentStory.isRide && currentStory.rideInfo && (
          <View style={viewerSt.rideBanner}>
            <View style={viewerSt.rideBannerLeft}>
              <View style={viewerSt.verifiedTag}>
                <MaterialIcons name="verified" size={11} color={Colors.primary} />
                <Text style={viewerSt.verifiedText}>رحلة موثقة من تك توكي</Text>
              </View>
              <View style={viewerSt.rideRoute}>
                <Text style={viewerSt.rideRouteText}>{currentStory.rideInfo.from} → {currentStory.rideInfo.to}</Text>
              </View>
              <View style={viewerSt.rideMeta}>
                <View style={viewerSt.rideMetaItem}>
                  {[...Array(5)].map((_, s) => (
                    <MaterialIcons key={s} name="star" size={10} color={s < currentStory.rideInfo!.rating ? Colors.primary : 'rgba(232,160,32,0.3)'} />
                  ))}
                </View>
                <Text style={viewerSt.ridePrice}>{currentStory.rideInfo.price} ج</Text>
                <Text style={viewerSt.rideDriver}>{currentStory.rideInfo.driver}</Text>
              </View>
            </View>
            <MaterialIcons name="local-taxi" size={32} color={Colors.primary} />
          </View>
        )}

        {/* Viewers + Actions */}
        <View style={viewerSt.bottomRow}>
          <View style={viewerSt.actionsRow}>
            <Pressable style={viewerSt.actionBtn}>
              <MaterialIcons name="favorite-border" size={20} color="#fff" />
            </Pressable>
            <Pressable style={viewerSt.actionBtn}>
              <MaterialIcons name="send" size={20} color="#fff" />
            </Pressable>
          </View>
          <View style={viewerSt.viewersRow}>
            <Text style={viewerSt.viewersText}>{currentStory.viewers} مشاهدة</Text>
            <MaterialIcons name="visibility" size={14} color="rgba(255,255,255,0.7)" />
          </View>
        </View>
      </View>
    </View>
  );
}

const viewerSt = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  progressRow: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', gap: 4, zIndex: 10 },
  progressTrack: { flex: 1, height: 2.5, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  header: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, borderWidth: 2.5, borderColor: Colors.primary, overflow: 'hidden' },
  avatar: { width: 37, height: 37, borderRadius: 19 },
  userText: { gap: 1 },
  userName: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: '#fff' },
  storyTime: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.7)' },
  tapLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: SCREEN_W * 0.35, zIndex: 5 },
  tapRight: { position: 'absolute', right: 0, top: 0, bottom: 0, width: SCREEN_W * 0.65, zIndex: 5 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: Spacing.base, gap: Spacing.sm, zIndex: 10 },
  storyText: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.semiBold, color: '#fff', textAlign: 'right', lineHeight: 26, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  rideBanner: {
    backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: Radius.xl,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1.5, borderColor: Colors.borderGold,
    backdropFilter: 'blur(10px)',
  },
  rideBannerLeft: { flex: 1, gap: 5 },
  verifiedTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.bold, color: Colors.primary },
  rideRoute: {},
  rideRouteText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: '#fff', textAlign: 'right' },
  rideMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rideMetaItem: { flexDirection: 'row' },
  ridePrice: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.primary },
  rideDriver: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.7)' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  viewersRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  viewersText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.8)' },
});

// ── Stories Bar (exported for use in social.tsx) ──────────────────────────────
export function StoriesBar() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(0);
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(ringAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const handleOpen = (idx: number) => {
    setSelectedUser(idx);
    setViewerOpen(true);
  };

  return (
    <>
      <View style={barSt.root}>
        {mockStoriesData.map((u, i) => {
          const hasUnviewed = u.stories.some(s => !s.viewed);
          const gradientColors: [string, string] = hasUnviewed
            ? [Colors.primary, '#FF8C00']
            : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'];
          return (
            <Pressable key={u.userId} onPress={() => handleOpen(i)} style={barSt.storyItem}>
              {/* Ring */}
              <LinearGradient
                colors={gradientColors}
                style={barSt.ring}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                <View style={barSt.ringInner}>
                  {u.isOwn ? (
                    <View style={barSt.ownAvatarWrap}>
                      <Image source={{ uri: u.avatar }} style={barSt.avatar} contentFit="cover" />
                      <View style={barSt.addIcon}>
                        <MaterialIcons name="add" size={12} color={Colors.textInverse} />
                      </View>
                    </View>
                  ) : (
                    <Image source={{ uri: u.avatar }} style={barSt.avatar} contentFit="cover" />
                  )}
                </View>
              </LinearGradient>

              {/* Expiry indicator */}
              {!u.isOwn && hasUnviewed && (
                <View style={barSt.newDot} />
              )}

              <Text style={barSt.userName} numberOfLines={1}>{u.user}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Stories Viewer Overlay */}
      {viewerOpen && (
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 999 }]}>
          <StoriesViewer initialUser={selectedUser} onClose={() => setViewerOpen(false)} />
        </View>
      )}
    </>
  );
}

const barSt = StyleSheet.create({
  root: { flexDirection: 'row', gap: 16, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  storyItem: { alignItems: 'center', gap: 5, position: 'relative' },
  ring: { width: 66, height: 66, borderRadius: 33, padding: 2.5, alignItems: 'center', justifyContent: 'center' },
  ringInner: { width: 58, height: 58, borderRadius: 29, overflow: 'hidden', backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 58, height: 58, borderRadius: 29 },
  ownAvatarWrap: { width: 58, height: 58, borderRadius: 29, position: 'relative', overflow: 'visible' },
  addIcon: {
    position: 'absolute', bottom: 0, right: 0,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.background,
  },
  newDot: {
    position: 'absolute', top: 2, right: 2,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.background,
  },
  userName: { fontFamily: Typography.fontFamily, fontSize: 11, color: Colors.textSecondary, maxWidth: 64 },
});

// ── Main Export (page) ────────────────────────────────────────────────────────
export default function StoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ userIdx?: string }>();
  const initialIdx = parseInt(params.userIdx || '0', 10);

  return <StoriesViewer initialUser={initialIdx} onClose={() => router.back()} />;
}
