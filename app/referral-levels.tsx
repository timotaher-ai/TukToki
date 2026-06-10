// Powered by OnSpace.AI — Referral Levels (نظام المستويات) Screen - Dark Premium
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated, Share, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Level Config ──────────────────────────────────────────────────────────────
const levels = [
  {
    id: 'bronze',
    ar: 'برونز',
    en: 'BRONZE',
    min: 1, max: 20,
    color: '#CD7F32',
    gradColors: ['#5A3010', '#3D2008'] as [string, string],
    icon: 'emoji-events',
    rate: '5%',
    bonus: '10 ج',
    perks: ['خصم 5% على رسوم السحب','وصول للعروض الخاصة'],
  },
  {
    id: 'silver',
    ar: 'فضي',
    en: 'SILVER',
    min: 21, max: 50,
    color: '#C0C0C0',
    gradColors: ['#3A3A3A', '#252525'] as [string, string],
    icon: 'workspace-premium',
    rate: '8%',
    bonus: '20 ج',
    perks: ['خصم 8% على رسوم السحب','أولوية دعم فني','شارة مستخدم مميز'],
  },
  {
    id: 'gold',
    ar: 'ذهبي',
    en: 'GOLD',
    min: 51, max: 100,
    color: Colors.primary,
    gradColors: [Colors.primary, '#5A3E00'] as [string, string],
    icon: 'military-tech',
    rate: '12%',
    bonus: '35 ج',
    perks: ['خصم 12% على رسوم السحب','سحب أسرع (24 ساعة)','شارة ذهبية في البروفايل','ترقية مجانية لرحلة واحدة/شهر'],
  },
  {
    id: 'platinum',
    ar: 'بلاتيني',
    en: 'PLATINUM',
    min: 101, max: 250,
    color: '#E5E4E2',
    gradColors: ['#2A2A2A', '#1A1A1A'] as [string, string],
    icon: 'diamond',
    rate: '15%',
    bonus: '50 ج',
    perks: ['خصم 15% على رسوم السحب','سحب فوري','مدير حساب مخصص','أولوية طلب التوكتك'],
  },
  {
    id: 'diamond',
    ar: 'ماسي',
    en: 'DIAMOND',
    min: 251, max: 9999,
    color: '#B9F2FF',
    gradColors: ['#003344', '#001C25'] as [string, string],
    icon: 'auto-awesome',
    rate: '20%',
    bonus: '80 ج',
    perks: ['خصم 20% على رسوم السحب','سحب فوري 24/7','شارة ماسية حصرية','عروض VIP','دعوات حصرية للفعاليات'],
  },
];

// ── QR Code Visual ────────────────────────────────────────────────────────────
function QRCodeVisual({ code }: { code: string }) {
  // Generate a deterministic dot pattern based on code characters
  const dots = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      if (r === 0 || r === 6 || c === 0 || c === 6) return 1;
      if ((r === 1 || r === 5) && (c === 1 || c === 5)) return 1;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return 1;
      const charCode = code.charCodeAt((r * 7 + c) % code.length);
      return (charCode + r + c) % 3 === 0 ? 1 : 0;
    })
  );
  return (
    <View style={qrSt.root}>
      {dots.map((row, r) => (
        <View key={r} style={qrSt.row}>
          {row.map((cell, c) => (
            <View key={c} style={[qrSt.cell, cell ? qrSt.filled : qrSt.empty]} />
          ))}
        </View>
      ))}
    </View>
  );
}

const qrSt = StyleSheet.create({
  root: { gap: 3, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', gap: 3 },
  cell: { width: 8, height: 8, borderRadius: 1.5 },
  filled: { backgroundColor: '#fff' },
  empty: { backgroundColor: 'transparent' },
});

// ── Progress Bar ──────────────────────────────────────────────────────────────
function AnimatedProgressBar({ progress, color }: { progress: number; color: string }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(widthAnim, { toValue: progress, useNativeDriver: false, damping: 14, stiffness: 60 }).start();
  }, [progress]);
  return (
    <View style={pbSt.track}>
      <Animated.View
        style={[pbSt.fill, {
          width: widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          backgroundColor: color,
        }]}
      />
    </View>
  );
}

const pbSt = StyleSheet.create({
  track: { height: 8, backgroundColor: Colors.surfaceElevated, borderRadius: 4, overflow: 'hidden', flex: 1 },
  fill: { height: '100%', borderRadius: 4 },
});

// ── Share Options ─────────────────────────────────────────────────────────────
const shareOptions = [
  { id: 'whatsapp', label: 'واتساب', icon: 'chat', color: '#25D366', bg: '#0D2E1A' },
  { id: 'telegram', label: 'تيليجرام', icon: 'telegram', color: '#2AABEE', bg: '#0D1E2E' },
  { id: 'facebook', label: 'فيسبوك', icon: 'facebook', color: '#1877F2', bg: '#0D1830' },
  { id: 'copy', label: 'نسخ', icon: 'content-copy', color: Colors.primary, bg: Colors.primarySurface },
  { id: 'more', label: 'المزيد', icon: 'share', color: Colors.textSecondary, bg: Colors.surfaceSecondary },
];

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ReferralLevelsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useApp();

  const userReferrals = user.referralCount; // 12 - currently Bronze

  const getCurrentLevel = () => levels.find(l => userReferrals >= l.min && userReferrals <= l.max) || levels[0];
  const getNextLevel = () => {
    const cur = getCurrentLevel();
    const curIdx = levels.indexOf(cur);
    return curIdx < levels.length - 1 ? levels[curIdx + 1] : null;
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = nextLevel
    ? (userReferrals - currentLevel.min) / (nextLevel.min - currentLevel.min)
    : 1;

  const handleShare = async (platform: string) => {
    const msg = `انضم لتيك توكي باستخدام كود الدعوة: ${user.referralCode}\nhttps://teektop.app`;
    try {
      await Share.share({ message: msg, title: 'تيك توكي - كود الإحالة' });
    } catch {}
  };

  // Badge pulse animation
  const badgePulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, { toValue: 1.06, duration: 1200, useNativeDriver: true }),
        Animated.timing(badgePulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero Header ─────────────────────────────────────── */}
        <LinearGradient
          colors={['#0D1B3E', '#162550', '#0E0F14']}
          style={[styles.hero, { paddingTop: insets.top + 12 }]}
        >
          {/* Back */}
          <Pressable onPress={() => router.back()} style={styles.heroBack}>
            <MaterialIcons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
          </Pressable>

          {/* Current Level Badge */}
          <Animated.View style={[styles.currentLevelBadge, { transform: [{ scale: badgePulse }] }]}>
            <LinearGradient
              colors={currentLevel.gradColors}
              style={styles.currentLevelGrad}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name={currentLevel.icon as any} size={48} color={currentLevel.color} />
              <Text style={[styles.currentLevelAr, { color: currentLevel.color }]}>{currentLevel.ar}</Text>
              <Text style={styles.currentLevelEn}>{currentLevel.en}</Text>
            </LinearGradient>
          </Animated.View>

          <Text style={styles.heroTitle}>مستواك الحالي</Text>
          <Text style={styles.heroSub}>{userReferrals} إحالة مكتملة</Text>

          {/* Progress to next */}
          {nextLevel && (
            <View style={styles.progressSection}>
              <View style={styles.progressLabels}>
                <Text style={[styles.progressNextLabel, { color: nextLevel.color }]}>
                  {nextLevel.ar} ({nextLevel.min})
                </Text>
                <Text style={[styles.progressCurLabel, { color: currentLevel.color }]}>
                  {currentLevel.ar} ({currentLevel.min})
                </Text>
              </View>
              <AnimatedProgressBar progress={progressToNext} color={currentLevel.color} />
              <Text style={styles.progressHint}>
                {nextLevel.min - userReferrals} إحالة للوصول إلى مستوى {nextLevel.ar}
              </Text>
            </View>
          )}

          {/* Stats row */}
          <View style={styles.heroStats}>
            {[
              { label: 'إجمالي الإحالات', value: userReferrals, color: currentLevel.color, icon: 'people' },
              { label: 'الأرباح المحققة', value: `${user.referralEarnings} ج`, color: Colors.success, icon: 'payments' },
              { label: 'مكافأة/إحالة', value: currentLevel.bonus, color: Colors.primary, icon: 'card-giftcard' },
            ].map((s, i) => (
              <View key={i} style={styles.heroStatItem}>
                <MaterialIcons name={s.icon as any} size={16} color={s.color} />
                <Text style={[styles.heroStatVal, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.content}>

          {/* ── QR Code & Share ──────────────────────────────── */}
          <View style={styles.qrSection}>
            {/* QR Card */}
            <LinearGradient
              colors={['#1A1B22', Colors.surface]}
              style={styles.qrCard}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <View style={styles.qrCardGlow} />
              <View style={styles.qrCodeWrap}>
                <QRCodeVisual code={user.referralCode} />
              </View>
              <Text style={styles.qrCodeText}>{user.referralCode}</Text>
              <Text style={styles.qrHint}>اسكن الكود أو شارك الرابط</Text>
            </LinearGradient>

            {/* Share buttons */}
            <View style={styles.shareGrid}>
              {shareOptions.map(opt => (
                <Pressable
                  key={opt.id}
                  style={[styles.shareBtn, { backgroundColor: opt.bg }]}
                  onPress={() => handleShare(opt.id)}
                >
                  <MaterialIcons name={opt.icon as any} size={20} color={opt.color} />
                  <Text style={[styles.shareBtnText, { color: opt.color }]}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── Conditions ──────────────────────────────────── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <MaterialIcons name="rule" size={16} color={Colors.primary} />
              </View>
              <Text style={styles.cardTitle}>شروط احتساب الإحالة</Text>
            </View>
            {[
              { icon: 'phone-android', title: 'توثيق رقم الهاتف', desc: 'يجب التحقق من الهاتف برسالة OTP', done: true },
              { icon: 'local-taxi', title: 'إكمال رحلة أولى', desc: 'يكمل المُحال رحلته الأولى بنجاح', done: false },
              { icon: 'event-available', title: 'مرور 7 أيام', desc: 'بدون مخالفات أو بلاغات', done: false },
            ].map((c, i, arr) => (
              <View key={i} style={[styles.conditionRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.divider }]}>
                <View style={[styles.conditionCheck, { backgroundColor: c.done ? Colors.successSurface : Colors.surfaceSecondary }]}>
                  <MaterialIcons
                    name={c.done ? 'check-circle' : 'radio-button-unchecked'}
                    size={18}
                    color={c.done ? Colors.success : Colors.textMuted}
                  />
                </View>
                <View style={styles.conditionInfo}>
                  <Text style={[styles.conditionTitle, c.done && { color: Colors.success }]}>{c.title}</Text>
                  <Text style={styles.conditionDesc}>{c.desc}</Text>
                </View>
                <View style={[styles.conditionIconWrap, { backgroundColor: Colors.primarySurface }]}>
                  <MaterialIcons name={c.icon as any} size={16} color={Colors.primary} />
                </View>
              </View>
            ))}
          </View>

          {/* ── All Levels ──────────────────────────────────── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: Colors.warningSurface }]}>
                <MaterialIcons name="leaderboard" size={16} color={Colors.warning} />
              </View>
              <Text style={styles.cardTitle}>جميع المستويات</Text>
            </View>

            {levels.map((lvl, i) => {
              const isCurrent = lvl.id === currentLevel.id;
              const isLocked = userReferrals < lvl.min;
              const progress = !isLocked
                ? Math.min(1, (userReferrals - lvl.min) / (lvl.max - lvl.min + 1))
                : 0;

              return (
                <View
                  key={lvl.id}
                  style={[
                    styles.levelRow,
                    i < levels.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.divider },
                    isCurrent && { backgroundColor: lvl.color + '08' },
                  ]}
                >
                  {/* Current badge */}
                  {isCurrent && (
                    <View style={[styles.currentBadge, { backgroundColor: lvl.color }]}>
                      <Text style={styles.currentBadgeText}>حالياً</Text>
                    </View>
                  )}

                  {/* Level Icon */}
                  <View style={[styles.levelIconWrap, { backgroundColor: isLocked ? Colors.surfaceSecondary : lvl.color + '20', borderColor: isLocked ? Colors.border : lvl.color + '50' }]}>
                    <MaterialIcons name={lvl.icon as any} size={26} color={isLocked ? Colors.textMuted : lvl.color} />
                    {isLocked && (
                      <View style={styles.lockOverlay}>
                        <MaterialIcons name="lock" size={12} color={Colors.textMuted} />
                      </View>
                    )}
                  </View>

                  {/* Info */}
                  <View style={styles.levelInfo}>
                    <View style={styles.levelNameRow}>
                      <Text style={[styles.levelRangeText, { color: isLocked ? Colors.textMuted : Colors.textTertiary }]}>
                        {lvl.min}–{lvl.max === 9999 ? '∞' : lvl.max}
                      </Text>
                      <Text style={[styles.levelName, { color: isLocked ? Colors.textMuted : lvl.color }]}>
                        {lvl.ar}
                      </Text>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.levelProgressRow}>
                      <Text style={[styles.levelRate, { color: isLocked ? Colors.textMuted : lvl.color }]}>
                        {lvl.rate}
                      </Text>
                      <AnimatedProgressBar progress={isCurrent ? progressToNext : isLocked ? 0 : 1} color={lvl.color} />
                    </View>

                    <View style={styles.levelPerksRow}>
                      <View style={[styles.bonusPill, { backgroundColor: isLocked ? Colors.surfaceSecondary : lvl.color + '15' }]}>
                        <MaterialIcons name="card-giftcard" size={10} color={isLocked ? Colors.textMuted : lvl.color} />
                        <Text style={[styles.bonusPillText, { color: isLocked ? Colors.textMuted : lvl.color }]}>{lvl.bonus}/إحالة</Text>
                      </View>
                      <Text style={styles.levelPerk} numberOfLines={1}>{lvl.perks[0]}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* ── Current Level Perks ─────────────────────────── */}
          <LinearGradient
            colors={currentLevel.gradColors}
            style={styles.perksCard}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <View style={styles.perksHeader}>
              <MaterialIcons name={currentLevel.icon as any} size={28} color={currentLevel.color} />
              <View style={styles.perksHeaderText}>
                <Text style={styles.perksTitle}>مزايا مستوى {currentLevel.ar}</Text>
                <Text style={styles.perksSub}>{currentLevel.en} TIER BENEFITS</Text>
              </View>
            </View>
            {currentLevel.perks.map((perk, i) => (
              <View key={i} style={styles.perkItem}>
                <Text style={styles.perkText}>{perk}</Text>
                <MaterialIcons name="check-circle" size={16} color={currentLevel.color} />
              </View>
            ))}
          </LinearGradient>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // HERO
  hero: {
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl, gap: Spacing.md, alignItems: 'center',
  },
  heroBack: {
    position: 'absolute', top: 0, right: Spacing.base,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
    marginTop: 50,
  },
  currentLevelBadge: { marginTop: Spacing.xl },
  currentLevelGrad: {
    width: 130, height: 130, borderRadius: 65,
    alignItems: 'center', justifyContent: 'center', gap: 4,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
    ...Shadow.golden,
  },
  currentLevelAr: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.black, marginTop: -4 },
  currentLevelEn: { fontFamily: 'System', fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },
  heroTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.md, color: 'rgba(255,255,255,0.6)' },
  heroSub: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.extraBold, color: '#fff' },

  progressSection: { width: '100%', gap: Spacing.xs },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressCurLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold },
  progressNextLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold },
  progressHint: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },

  heroStats: {
    flexDirection: 'row', width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.xl,
    padding: Spacing.md, gap: 0,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  heroStatItem: { flex: 1, alignItems: 'center', gap: 4 },
  heroStatVal: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.extraBold },
  heroStatLabel: { fontFamily: Typography.fontFamily, fontSize: 9, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },

  content: { padding: Spacing.base, gap: Spacing.base },

  // QR
  qrSection: { gap: Spacing.md },
  qrCard: {
    borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderGold, ...Shadow.golden, position: 'relative', overflow: 'hidden',
  },
  qrCardGlow: {
    position: 'absolute', top: -40, alignSelf: 'center',
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: Colors.primary, opacity: 0.08,
    transform: [{ scaleX: 2.5 }, { scaleY: 0.5 }],
  },
  qrCodeWrap: {
    backgroundColor: '#1A1B22', borderRadius: Radius.xl,
    padding: 20, borderWidth: 1.5, borderColor: Colors.borderGold,
    ...Shadow.goldenSm,
  },
  qrCodeText: {
    fontFamily: Typography.fontFamily, fontSize: Typography.xxl,
    fontWeight: Typography.black, color: Colors.primary, letterSpacing: 3,
  },
  qrHint: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  shareGrid: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  shareBtn: {
    borderRadius: Radius.xl, paddingHorizontal: 16, paddingVertical: 13,
    alignItems: 'center', gap: 5, minWidth: (SCREEN_W - Spacing.base * 2 - Spacing.sm * 4) / 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  shareBtnText: { fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.semiBold },

  // CARD
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, ...Shadow.sm, gap: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  cardTitle: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  cardIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primarySurface, alignItems: 'center', justifyContent: 'center' },

  // CONDITIONS
  conditionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: Spacing.sm },
  conditionCheck: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  conditionInfo: { flex: 1 },
  conditionTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  conditionDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right' },
  conditionIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

  // LEVELS
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: Spacing.md, position: 'relative' },
  currentBadge: {
    position: 'absolute', top: 8, left: 0,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  currentBadgeText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold, color: '#000' },
  levelIconWrap: {
    width: 54, height: 54, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5,
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: Colors.background, borderRadius: 10, padding: 2,
  },
  levelInfo: { flex: 1, gap: 5 },
  levelNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  levelName: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.extraBold },
  levelRangeText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs },
  levelProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelRate: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold, width: 35, textAlign: 'right' },
  levelPerksRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  bonusPill: { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  bonusPillText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold },
  levelPerk: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textTertiary, flex: 1, textAlign: 'right' },

  // PERKS
  perksCard: { borderRadius: Radius.xl, padding: Spacing.xl, gap: Spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  perksHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'flex-end' },
  perksHeaderText: { flex: 1 },
  perksTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.bold, color: '#fff', textAlign: 'right' },
  perksSub: { fontFamily: 'System', fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, textAlign: 'right' },
  perkItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  perkText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: 'rgba(255,255,255,0.85)', textAlign: 'right' },
});
