// Powered by OnSpace.AI — Profile Screen (Dark Premium Redesign)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { mockRideHistory } from '@/constants/mockData';
import { useAlert } from '@/template';
import { StatusBar } from 'expo-status-bar';

type ProfileTab = 'stats' | 'referrals' | 'settings';

const ratingDist = [
  { stars: 5, count: 89, pct: 0.85 },
  { stars: 4, count: 28, pct: 0.27 },
  { stars: 3, count: 6,  pct: 0.06 },
  { stars: 2, count: 2,  pct: 0.02 },
  { stars: 1, count: 2,  pct: 0.02 },
];

const mockReferrals = [
  { id: 'r1', name: 'عصام محمد', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', earned: 20, date: 'أمس',       rides: 3 },
  { id: 'r2', name: 'دينا علي',  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', earned: 20, date: '30 ديسمبر', rides: 5 },
  { id: 'r3', name: 'سامي خالد', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', earned: 20, date: '28 ديسمبر', rides: 2 },
  { id: 'r4', name: 'منى أحمد',  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', earned: 20, date: '25 ديسمبر', rides: 7 },
];

interface MenuItemProps {
  icon: string; label: string; badge?: string; value?: string;
  onPress: () => void; danger?: boolean; note?: string;
}
function MenuItem({ icon, label, badge, value, onPress, danger, note }: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <MaterialIcons name="chevron-left" size={18} color={Colors.textMuted} />
      {badge ? (
        <View style={styles.menuBadge}><Text style={styles.menuBadgeText}>{badge}</Text></View>
      ) : null}
      {value ? <Text style={styles.menuValue}>{value}</Text> : null}
      {note  ? <Text style={styles.menuNote}>{note}</Text>  : null}
      <Text style={[styles.menuLabel, danger && { color: Colors.error }]}>{label}</Text>
      <View style={[styles.menuIconWrap, danger && { backgroundColor: Colors.errorSurface }]}>
        <MaterialIcons name={icon as any} size={17} color={danger ? Colors.error : Colors.primary} />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, unreadNotifications, markNotificationsRead } = useApp();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<ProfileTab>('stats');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const completedRides = mockRideHistory.filter(r => r.status === 'completed');
  const totalSpent = completedRides.reduce((s, r) => s + r.price, 0);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ──────────────────────────────────────── */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          {/* Top Row */}
          <View style={styles.headerTopRow}>
            <Pressable onPress={() => router.push('/admin-panel')} style={styles.headerIconBtn}>
              <MaterialIcons name="admin-panel-settings" size={18} color={Colors.textTertiary} />
            </Pressable>
            <Pressable
              onPress={() => { router.push('/notifications'); markNotificationsRead(); }}
              style={styles.headerIconBtn}
            >
              <MaterialIcons name="notifications-outlined" size={18} color={Colors.textTertiary} />
              {unreadNotifications > 0 && <View style={styles.notifDot} />}
            </Pressable>
          </View>

          {/* Avatar & Name */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatarGlow} />
              <Image source={{ uri: user.avatar }} style={styles.avatar} contentFit="cover" />
              {user.isVerified && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={16} color={Colors.primary} />
                </View>
              )}
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
            <View style={styles.joinRow}>
              <MaterialIcons name="event" size={11} color={Colors.textMuted} />
              <Text style={styles.joinDate}>عضو منذ {user.joinDate}</Text>
            </View>
          </View>

          {/* Stats Strip */}
          <View style={styles.statsStrip}>
            {[
              { value: user.totalRides, label: 'رحلة', color: Colors.textPrimary },
              { value: user.rating, label: 'تقييمي', color: Colors.primary, icon: 'star' },
              { value: user.referralCount, label: 'إحالة', color: Colors.success },
              { value: user.wallet.toFixed(0), label: 'رصيد ج', color: Colors.primary },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={styles.stripDivider} />}
                <View style={styles.stripItem}>
                  <View style={styles.stripValRow}>
                    {s.icon && <MaterialIcons name={s.icon as any} size={12} color={Colors.primary} />}
                    <Text style={[styles.stripNum, { color: s.color }]}>{s.value}</Text>
                  </View>
                  <Text style={styles.stripLabel}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {([
              { id: 'stats' as ProfileTab, label: 'الإحصائيات', icon: 'bar-chart' },
              { id: 'referrals' as ProfileTab, label: 'الإحالات', icon: 'people' },
              { id: 'settings' as ProfileTab, label: 'الإعدادات', icon: 'settings' },
            ]).map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <MaterialIcons name={tab.icon as any} size={13} color={isActive ? Colors.textInverse : Colors.textTertiary} />
                  <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Wallet Chip */}
        <Pressable style={styles.walletChip} onPress={() => router.push('/(tabs)/wallet')}>
          <MaterialIcons name="chevron-left" size={18} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.walletChipLabel}>رصيد المحفظة</Text>
            <Text style={styles.walletChipAmount}>{user.wallet.toFixed(2)} جنيه</Text>
          </View>
          <View style={styles.walletChipIcon}>
            <MaterialIcons name="account-balance-wallet" size={22} color={Colors.primary} />
          </View>
        </Pressable>

        {/* ── STATS TAB ───────────────────────────────────── */}
        {activeTab === 'stats' && (
          <View style={styles.tabContent}>
            {/* Ride Summary Grid */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>ملخص الرحلات</Text>
              <View style={styles.rideGrid}>
                {[
                  { label: 'مكتملة',       value: completedRides.length, color: Colors.success, icon: 'check-circle' },
                  { label: 'ملغاة',        value: mockRideHistory.length - completedRides.length, color: Colors.error, icon: 'cancel' },
                  { label: 'إجمالي الإنفاق', value: `${totalSpent.toFixed(0)} ج`, color: Colors.primary, icon: 'account-balance-wallet' },
                  { label: 'متوسط السعر', value: `${(totalSpent / Math.max(completedRides.length, 1)).toFixed(0)} ج`, color: Colors.warning, icon: 'trending-up' },
                ].map(item => (
                  <View key={item.label} style={styles.rideStatCard}>
                    <View style={[styles.rideStatIconWrap, { backgroundColor: item.color + '20' }]}>
                      <MaterialIcons name={item.icon as any} size={22} color={item.color} />
                    </View>
                    <Text style={[styles.rideStatVal, { color: item.color }]}>{item.value}</Text>
                    <Text style={styles.rideStatLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Recent Rides */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>آخر الرحلات</Text>
              {mockRideHistory.slice(0, 3).map((ride, i) => (
                <View key={ride.id} style={[styles.rideRow, i < 2 && { borderBottomWidth: 1, borderBottomColor: Colors.divider, paddingBottom: Spacing.sm }]}>
                  <View style={styles.rideRowLeft}>
                    <Text style={[styles.ridePrice, { color: ride.status === 'completed' ? Colors.success : Colors.error }]}>
                      {ride.status === 'completed' ? `-${ride.price.toFixed(0)} ج` : 'ملغاة'}
                    </Text>
                    <Text style={styles.rideDate}>{ride.date}</Text>
                  </View>
                  <View style={styles.rideRowInfo}>
                    <Text style={styles.rideTo} numberOfLines={1}>{ride.to}</Text>
                    <Text style={styles.rideFrom} numberOfLines={1}>{ride.from}</Text>
                  </View>
                  <View style={[styles.rideStatusDot, { backgroundColor: ride.status === 'completed' ? Colors.success : Colors.error }]} />
                </View>
              ))}
            </View>

            {/* Rating Breakdown */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>تفاصيل تقييماتي</Text>
              <View style={styles.ratingOverview}>
                <View style={styles.ratingBig}>
                  <Text style={styles.ratingBigNum}>{user.rating}</Text>
                  <View style={styles.starsRow}>
                    {[1,2,3,4,5].map(s => (
                      <MaterialIcons key={s} name="star" size={14} color={s <= Math.round(user.rating) ? Colors.primary : Colors.surfaceElevated} />
                    ))}
                  </View>
                  <Text style={styles.ratingTotalLabel}>{user.totalRides} تقييم</Text>
                </View>
                <View style={styles.ratingBars}>
                  {ratingDist.map(row => (
                    <View key={row.stars} style={styles.ratingBarRow}>
                      <View style={styles.ratingBarTrack}>
                        <View style={[styles.ratingBarFill, { width: `${row.pct * 100}%` }]} />
                      </View>
                      <View style={styles.ratingStarLabel}>
                        <MaterialIcons name="star" size={10} color={Colors.primary} />
                        <Text style={styles.ratingStarNum}>{row.stars}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ── REFERRALS TAB ───────────────────────────────── */}
        {activeTab === 'referrals' && (
          <View style={styles.tabContent}>
            {/* Code Hero */}
            <LinearGradient
              colors={['#7B2FBE', '#4A1480']}
              style={styles.refHero}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <View style={styles.refHeroDecor} />
              <MaterialIcons name="card-giftcard" size={72} color="rgba(255,255,255,0.12)" style={{ position: 'absolute', left: 12, bottom: -8 }} />
              <View style={styles.refHeroContent}>
                <Text style={styles.refHeroTitle}>كود الإحالة بتاعك</Text>
                <Text style={styles.refHeroDesc}>شارك مع أصدقائك واكسب 20 جنيه لكل إحالة ناجحة</Text>
                <Pressable
                  style={styles.refCodeBox}
                  onPress={() => showAlert('تم النسخ!', `كود الإحالة: ${user.referralCode}`)}
                >
                  <MaterialIcons name="content-copy" size={16} color="#7B2FBE" />
                  <Text style={styles.refCodeText}>{user.referralCode}</Text>
                </Pressable>
                <Pressable style={styles.refShareBtn}>
                  <MaterialIcons name="share" size={14} color="#fff" />
                  <Text style={styles.refShareText}>مشاركة الكود</Text>
                </Pressable>
              </View>
            </LinearGradient>

            {/* Earnings Summary */}
            <View style={styles.refStatsRow}>
              <View style={[styles.refStatCard, { borderColor: Colors.primaryBorder }]}>
                <Text style={styles.refStatVal}>{user.referralCount}</Text>
                <Text style={styles.refStatLabel}>إجمالي الإحالات</Text>
              </View>
              <View style={[styles.refStatCard, { borderColor: Colors.success + '40', backgroundColor: Colors.successSurface }]}>
                <Text style={[styles.refStatVal, { color: Colors.success }]}>{user.referralEarnings} ج</Text>
                <Text style={styles.refStatLabel}>إجمالي الأرباح</Text>
              </View>
            </View>

            {/* Referral History */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>سجل الإحالات</Text>
              {mockReferrals.map((ref, i) => (
                <View key={ref.id} style={[styles.refRow, i < mockReferrals.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.divider, paddingBottom: Spacing.sm }]}>
                  <View style={styles.refRowLeft}>
                    <Text style={[styles.refEarned, { color: Colors.success }]}>+{ref.earned} ج</Text>
                    <Text style={styles.refDate}>{ref.date}</Text>
                  </View>
                  <View style={styles.refInfo}>
                    <Text style={styles.refName}>{ref.name}</Text>
                    <Text style={styles.refRides}>{ref.rides} رحلات مكتملة</Text>
                  </View>
                  <Image source={{ uri: ref.avatar }} style={styles.refAvatar} contentFit="cover" />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── SETTINGS TAB ────────────────────────────────── */}
        {activeTab === 'settings' && (
          <View style={styles.tabContent}>
            {/* Language Toggle */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>اللغة</Text>
              <View style={styles.langRow}>
                {([
                  { id: 'ar' as const, label: 'العربية', flag: '🇸🇦' },
                  { id: 'en' as const, label: 'English', flag: '🇺🇸' },
                ]).map(lang => (
                  <Pressable
                    key={lang.id}
                    style={[styles.langBtn, language === lang.id && styles.langBtnActive]}
                    onPress={() => setLanguage(lang.id)}
                  >
                    <Text style={styles.langFlag}>{lang.flag}</Text>
                    <Text style={[styles.langLabel, language === lang.id && { color: Colors.textInverse }]}>{lang.label}</Text>
                    {language === lang.id && (
                      <View style={styles.langCheck}><MaterialIcons name="check" size={12} color={Colors.textInverse} /></View>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Account section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionLabel}>الحساب</Text>
              <View style={styles.menuGroup}>
                <MenuItem icon="notifications" label="الإشعارات" badge={unreadNotifications > 0 ? String(unreadNotifications) : undefined} onPress={() => { router.push('/notifications'); markNotificationsRead(); }} />
                <MenuItem icon="history" label="سجل الرحلات" onPress={() => {}} />
                <MenuItem icon="star" label="تقييماتي" onPress={() => setActiveTab('stats')} />
                <MenuItem icon="people" label="نظام الإحالة" onPress={() => setActiveTab('referrals')} />
              </View>
            </View>

            {/* Privacy section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionLabel}>الأمان والخصوصية</Text>
              <View style={styles.menuGroup}>
                <MenuItem icon="location-on" label="مشاركة الموقع" value="مفعّل" onPress={() => {}} />
                <MenuItem icon="lock" label="تغيير كلمة المرور" onPress={() => {}} />
                <MenuItem icon="verified-user" label="التحقق من الهوية" onPress={() => {}} />
                <MenuItem icon="privacy-tip" label="سياسة الخصوصية" onPress={() => {}} />
              </View>
            </View>

            {/* App section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionLabel}>التطبيق</Text>
              <View style={styles.menuGroup}>
                <MenuItem icon="admin-panel-settings" label="لوحة التحكم الإدارية" onPress={() => router.push('/admin-panel')} />
                <MenuItem icon="directions-car" label="وضع السائق" onPress={() => router.push('/driver-mode')} note="جديد" />
                <MenuItem icon="help" label="المساعدة والدعم" onPress={() => {}} />
                <MenuItem icon="info" label="عن التطبيق" value="v1.0.0" onPress={() => {}} />
              </View>
            </View>

            {/* Logout */}
            <View style={[styles.settingsSection, { marginBottom: Spacing.xxxl + 20 }]}>
              <View style={styles.menuGroup}>
                <MenuItem
                  icon="logout"
                  label="تسجيل الخروج"
                  danger
                  onPress={() => showAlert('تسجيل الخروج', 'هل تريد تسجيل الخروج؟', [
                    { text: 'إلغاء', style: 'cancel' },
                    { text: 'خروج', style: 'destructive', onPress: () => router.replace('/') }
                  ])}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // HEADER
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTopRow: {
    flexDirection: 'row', justifyContent: 'flex-start', gap: 8,
  },
  headerIconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5, borderColor: Colors.surface,
  },
  avatarSection: { alignItems: 'center', gap: 5 },
  avatarOuter: { position: 'relative', marginBottom: Spacing.xs },
  avatarGlow: {
    position: 'absolute', top: -8, left: -8, right: -8, bottom: -8,
    borderRadius: 60, backgroundColor: Colors.primary, opacity: 0.1,
  },
  avatar: {
    width: 86, height: 86, borderRadius: 43,
    borderWidth: 3, borderColor: Colors.primary,
    ...Shadow.golden,
  },
  verifiedBadge: {
    position: 'absolute', bottom: 0, right: -2,
    backgroundColor: Colors.surface,
    borderRadius: 12, padding: 2,
    borderWidth: 1.5, borderColor: Colors.borderGold,
  },
  userName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl, fontWeight: Typography.extraBold, color: Colors.textPrimary,
  },
  userPhone: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: Colors.textTertiary,
  },
  joinRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  joinDate: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted },

  // STATS STRIP
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl, padding: Spacing.md,
    justifyContent: 'space-around',
    borderWidth: 1, borderColor: Colors.border,
  },
  stripItem: { alignItems: 'center', gap: 3 },
  stripValRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  stripNum: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.extraBold },
  stripLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  stripDivider: { width: 1, backgroundColor: Colors.border },

  // TABS
  tabRow: { flexDirection: 'row', gap: 6 },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 9, borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1, borderColor: Colors.border,
  },
  tabBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary, ...Shadow.goldenSm },
  tabBtnText: { fontFamily: Typography.fontFamily, fontSize: 11, fontWeight: Typography.semiBold, color: Colors.textTertiary },
  tabBtnTextActive: { color: Colors.textInverse },

  // WALLET CHIP
  walletChip: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginTop: -Spacing.md,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    ...Shadow.golden,
    borderWidth: 1.5, borderColor: Colors.borderGold,
  },
  walletChipIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primarySurface, alignItems: 'center', justifyContent: 'center',
  },
  walletChipLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right' },
  walletChipAmount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.extraBold, color: Colors.primary,
  },

  // TAB CONTENT
  tabContent: { paddingHorizontal: Spacing.base, paddingTop: Spacing.xl, gap: Spacing.base, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, ...Shadow.sm, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right',
  },

  // RIDE STATS
  rideGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  rideStatCard: {
    width: '47%', backgroundColor: Colors.background,
    borderRadius: Radius.lg, padding: Spacing.md,
    alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  rideStatIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  rideStatVal: { fontFamily: Typography.fontFamily, fontSize: Typography.lg, fontWeight: Typography.extraBold },
  rideStatLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'center' },

  // RECENT RIDES
  rideRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: Spacing.xs },
  rideStatusDot: { width: 8, height: 8, borderRadius: 4 },
  rideRowInfo: { flex: 1 },
  rideTo: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  rideFrom: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right' },
  rideRowLeft: { alignItems: 'flex-end', minWidth: 60 },
  ridePrice: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold },
  rideDate: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted },

  // RATING
  ratingOverview: { flexDirection: 'row', gap: Spacing.base, alignItems: 'center' },
  ratingBig: { alignItems: 'center', gap: 4, paddingRight: Spacing.md, borderRightWidth: 1, borderRightColor: Colors.border },
  ratingBigNum: { fontFamily: Typography.fontFamily, fontSize: 36, fontWeight: Typography.black, color: Colors.textPrimary },
  starsRow: { flexDirection: 'row', gap: 2 },
  ratingTotalLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  ratingBars: { flex: 1, gap: 7 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingStarLabel: { flexDirection: 'row', alignItems: 'center', gap: 1, width: 22, justifyContent: 'flex-end' },
  ratingStarNum: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textTertiary },
  ratingBarTrack: { flex: 1, height: 6, backgroundColor: Colors.surfaceElevated, borderRadius: 3, overflow: 'hidden' },
  ratingBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },

  // REFERRALS
  refHero: {
    borderRadius: Radius.xl, padding: Spacing.lg,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', overflow: 'hidden', position: 'relative',
  },
  refHeroDecor: {
    position: 'absolute', top: -30, left: -30,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  refHeroContent: { flex: 1, gap: Spacing.sm },
  refHeroTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.bold, color: '#fff', textAlign: 'right' },
  refHeroDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.8)', textAlign: 'right', lineHeight: 20 },
  refCodeBox: {
    backgroundColor: '#fff', borderRadius: Radius.lg,
    paddingHorizontal: 14, paddingVertical: 9,
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-end',
  },
  refCodeText: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.extraBold, color: '#7B2FBE', letterSpacing: 1 },
  refShareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 7, alignSelf: 'flex-end',
  },
  refShareText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: '#fff', fontWeight: Typography.semiBold },
  refStatsRow: { flexDirection: 'row', gap: Spacing.sm },
  refStatCard: {
    flex: 1, backgroundColor: Colors.primarySurface,
    borderRadius: Radius.xl, padding: Spacing.base,
    alignItems: 'center', gap: 4, borderWidth: 1.5, ...Shadow.sm,
  },
  refStatVal: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.extraBold, color: Colors.primary },
  refStatLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  refRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: Spacing.xs },
  refAvatar: { width: 40, height: 40, borderRadius: 20 },
  refInfo: { flex: 1 },
  refName: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  refRides: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right' },
  refRowLeft: { alignItems: 'flex-end', gap: 2 },
  refEarned: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold },
  refDate: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted },

  // SETTINGS
  settingsSection: { gap: 6 },
  settingsSectionLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold,
    color: Colors.textTertiary, textAlign: 'right',
    paddingHorizontal: 4,
  },
  menuGroup: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    overflow: 'hidden', ...Shadow.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
    gap: 8,
  },
  menuIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.base, color: Colors.textPrimary, textAlign: 'right' },
  menuValue: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textTertiary },
  menuNote: {
    fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.bold,
    color: Colors.textInverse, backgroundColor: Colors.success,
    borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2,
  },
  menuBadge: {
    backgroundColor: Colors.error, borderRadius: Radius.full,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  menuBadgeText: { fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.bold, color: '#fff' },
  langRow: { flexDirection: 'row', gap: Spacing.sm },
  langBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    padding: Spacing.md, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceSecondary,
  },
  langBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary, ...Shadow.goldenSm },
  langFlag: { fontSize: 18 },
  langLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textSecondary },
  langCheck: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
});
