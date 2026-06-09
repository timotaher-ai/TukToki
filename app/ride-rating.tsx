// Powered by OnSpace.AI — Ride Rating Screen
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  ScrollView, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { mockDriverInfo } from '@/constants/mockData';
import { useAlert } from '@/template';

const quickTags = [
  { id: 'clean', label: 'سائق نظيف', icon: 'cleaning-services' },
  { id: 'polite', label: 'سائق مؤدب', icon: 'sentiment-very-satisfied' },
  { id: 'ontime', label: 'التزام بالوقت', icon: 'access-time' },
  { id: 'safe', label: 'قيادة آمنة', icon: 'verified-user' },
  { id: 'car', label: 'سيارة نظيفة', icon: 'local-car-wash' },
  { id: 'route', label: 'أفضل مسار', icon: 'alt-route' },
];

export default function RideRatingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const starScale = useRef(Array.from({ length: 5 }, () => new Animated.Value(1))).current;

  const handleStarPress = (idx: number) => {
    setStars(idx + 1);
    Animated.sequence([
      Animated.spring(starScale[idx], { toValue: 1.4, useNativeDriver: true, speed: 50 }),
      Animated.spring(starScale[idx], { toValue: 1.0, useNativeDriver: true, speed: 30 }),
    ]).start();
  };

  const toggleTag = (id: string) => {
    setSelectedTags(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const ratingLabels = ['', 'سيئة', 'مقبولة', 'جيدة', 'رائعة', 'ممتازة!'];
  const ratingColors = ['', Colors.error, Colors.warning, Colors.warning, Colors.success, Colors.primary];

  const handleSubmit = () => {
    if (!stars) {
      showAlert('اختر تقييمك', 'من فضلك قيّم الرحلة بالنجوم أولاً');
      return;
    }
    showAlert('شكراً على تقييمك! 🌟', 'ساعدت في تحسين تجربة الرحلات لكل المستخدمين', [
      { text: 'تمام', onPress: () => router.replace('/(tabs)') },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.secondary, Colors.secondaryLight]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>تقييم الرحلة</Text>
          <Pressable onPress={() => router.replace('/(tabs)')} style={styles.skipBtn}>
            <Text style={styles.skipText}>تخطي</Text>
          </Pressable>
        </View>

        {/* Completion Badge */}
        <View style={styles.completeBadge}>
          <MaterialIcons name="check-circle" size={40} color={Colors.primary} />
          <Text style={styles.completeTitle}>وصلت بسلام! 🎉</Text>
          <Text style={styles.completeDesc}>شارك تجربتك مع الركاب الآخرين</Text>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.base, gap: Spacing.base }}>

        {/* Driver Card */}
        <View style={styles.driverCard}>
          <Image source={{ uri: mockDriverInfo.avatar }} style={styles.driverAvatar} contentFit="cover" />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{mockDriverInfo.name}</Text>
            <Text style={styles.driverCar}>{mockDriverInfo.car}</Text>
            <View style={styles.driverStatRow}>
              <MaterialIcons name="star" size={14} color={Colors.primary} />
              <Text style={styles.driverRating}>{mockDriverInfo.rating} · {mockDriverInfo.totalRides} رحلة</Text>
            </View>
          </View>
          <View style={styles.plateBadge}>
            <Text style={styles.plateText}>{mockDriverInfo.plate}</Text>
          </View>
        </View>

        {/* Stars */}
        <View style={styles.starsSection}>
          <Text style={styles.starTitle}>كيف كانت الرحلة؟</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Animated.View key={idx} style={{ transform: [{ scale: starScale[idx] }] }}>
                <Pressable onPress={() => handleStarPress(idx)}>
                  <MaterialIcons
                    name={idx < stars ? 'star' : 'star-border'}
                    size={44}
                    color={idx < stars ? Colors.primary : Colors.border}
                  />
                </Pressable>
              </Animated.View>
            ))}
          </View>
          {stars > 0 && (
            <View style={[styles.ratingLabel, { backgroundColor: ratingColors[stars] + '20' }]}>
              <Text style={[styles.ratingLabelText, { color: ratingColors[stars] }]}>
                {ratingLabels[stars]}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Tags */}
        {stars >= 3 && (
          <View style={styles.tagsSection}>
            <Text style={styles.tagsTitle}>ما الذي أعجبك؟</Text>
            <View style={styles.tagsGrid}>
              {quickTags.map(tag => (
                <Pressable
                  key={tag.id}
                  style={[styles.tagChip, selectedTags.includes(tag.id) && styles.tagChipActive]}
                  onPress={() => toggleTag(tag.id)}
                >
                  <MaterialIcons
                    name={tag.icon as any}
                    size={16}
                    color={selectedTags.includes(tag.id) ? '#fff' : Colors.textSecondary}
                  />
                  <Text style={[styles.tagText, selectedTags.includes(tag.id) && { color: '#fff' }]}>
                    {tag.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Comment */}
        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>أضف تعليقاً (اختياري)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="شاركنا تفاصيل تجربتك..."
            placeholderTextColor={Colors.textTertiary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
            textAlign="right"
          />
          <Text style={styles.commentCount}>{comment.length} / 200</Text>
        </View>

        {/* Tip */}
        <View style={styles.tipSection}>
          <Text style={styles.tipTitle}>هل تريد مكافأة السائق؟</Text>
          <View style={styles.tipRow}>
            {[5, 10, 20, 50].map(tip => (
              <Pressable key={tip} style={styles.tipBtn}>
                <Text style={styles.tipAmount}>{tip} ج</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Submit */}
        <Pressable
          style={[styles.submitBtn, !stars && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={!stars}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.submitGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.submitText}>إرسال التقييم</Text>
            <MaterialIcons name="send" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>

        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  skipBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  skipText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.75)',
  },
  completeBadge: { alignItems: 'center', gap: 6 },
  completeTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.extraBold,
    color: '#fff',
  },
  completeDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.75)',
  },
  driverCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadow.sm,
    borderWidth: 1.5,
    borderColor: Colors.primarySurface,
  },
  driverAvatar: { width: 60, height: 60, borderRadius: 30 },
  driverInfo: { flex: 1, gap: 3 },
  driverName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  driverCar: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
  driverStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },
  driverRating: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  plateBadge: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  plateText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: '#fff',
    letterSpacing: 1.5,
  },
  starsSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadow.sm,
  },
  starTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingLabel: {
    borderRadius: Radius.full,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  ratingLabelText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  tagsSection: { gap: Spacing.sm },
  tagsTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  tagChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  tagText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  commentSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  commentTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  commentInput: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  commentCount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'left',
  },
  tipSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  tipTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  tipRow: { flexDirection: 'row', gap: Spacing.sm },
  tipBtn: {
    flex: 1,
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.lg,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  tipAmount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  submitBtn: {
    borderRadius: Radius.full,
    overflow: 'hidden',
    ...Shadow.golden,
  },
  submitGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  submitText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: '#fff',
  },
});
