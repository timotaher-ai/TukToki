// Powered by OnSpace.AI — Profile Screen (Enhanced)
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

type ProfileTab = 'stats' | 'referrals' | 'settings';

interface MenuItemProps {
  icon: string;
  label: string;
  badge?: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, badge, value, onPress, danger }: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <MaterialIcons name="chevron-left" size={20} color={Colors.textTertiary} />
      {badge ? (
        <View style={styles.menuBadge}>
          <Text style={styles.menuBadgeText}>{badge}</Text>
        </View>
      ) : null}
      {value ? <Text style={styles.menuValue}>{value}</Text> : null}
      <Text style={[styles.menuLabel, danger && { color: Colors.error }]}>{label}</Text>
      <View style={[styles.menuIcon, { backgroundColor: danger ? Colors.errorSurface : Colors.primarySurface }]}>
        <MaterialIcons name={icon as any} size={18} color={danger ? Colors.error : Colors.primary} />
      </View>
    </Pressable>
  );
}

const ratingDistribution = [
  { stars: 5, count: 89, pct: 0.85 },
  { stars: 4, count: 28, pct: 0.27 },
  { stars: 3, count: 6, pct: 0.06 },
  { stars: 2, count: 2, pct: 0.02 },
  { stars: 1, count: 2, pct: 0.02 },
];

const mockReferralHistory = [
  { id: 'r1', name: 'عصام محمد', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', earned: 20, date: 'أمس', rides: 3 },
  { id: 'r2', name: 'دينا علي',  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', earned: 20, date: '30 ديسمبر', rides: 5 },
  { id: 'r3', name: 'سامي خالد', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', earned: 20, date: '28 ديسمبر', rides: 2 },
  { id: 'r4', name: 'منى أحمد',  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', earned: 20, date: '25 ديسمبر', rides: 7 },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, unreadNotifications, markNotificationsRead } = useApp();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<ProfileTab>('stats');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const completedRides = mockRideHistory.filter(r => r.status === 'completed');
  const totalSpent = mockRideHistory.filter(r => r.status === 'completed').reduce((s, r) => s + r.price, 0);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.secondary, Colors.secondaryLight]}
          style={[styles.header, { paddingTop: insets.top + 12 }]}
        >
          {/* Top row */}
          <View style={styles.headerTopRow}>
            <Pressable onPress={() => router.push('/admin-panel')} style={styles.headerIconBtn}>
              <MaterialIcons name="admin-panel-settings" size={20} color="rgba(255,255,255,0.8)" />
            </Pressable>
            <Pressable
              onPress={() => { router.push('/notifications'); markNotificationsRead(); }}
              style={styles.headerIconBtn}
            >
              <MaterialIcons name="notifications" size={20} color="rgba(255,255,255,0.8)" />
              {unreadNotifications > 0 && <View style={styles.notifDotHeader} />}
            </Pressable>
          </View>

          {/* Avatar & Name */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} contentFit="cover" transition={200} />
              {user.isVerified && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={18} color={Colors.primary} />
                </View>
              )}
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
            <View style={styles.joinRow}>
              <MaterialIcons name="event" size={12} color="rgba(255,255,255,0.5)" />
              <Text style={styles.joinDate}>عضو منذ {user.joinDate}</Text>
            </View>
          </View>

          {/* Stats Strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{user.totalRides}</Text>
              <Text style={styles.statLabel}>رحلة</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={14} color={Colors.primary} />
                <Text style={styles.statNum}>{user.rating}</Text>
              </View>
              <Text style={styles.statLabel}>تقييمي</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{user.referralCount}</Text>
              <Text style={styles.statLabel}>إحالة</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{user.wallet.toFixed(0)}</Text>
              <Text style={styles.statLabel}>رصيد ج</Text>
            </View>
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabRow}>
            {([
              { id: 'stats' as ProfileTab, label: 'الإحصائيات', icon: 'bar-chart' },
              { id: 'referrals' as ProfileTab, label: 'الإحالات', icon: 'people' },
              { id: 'settings' as ProfileTab, label: 'الإعدادات', icon: 'settings' },
            ]).map(tab => (
              <Pressable
                key={tab.id}
                style={[styles.tabBtn, activeTab === tab.id && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <MaterialIcons
                  name={tab.icon as any}
                  size={15}
                  color={activeTab === tab.id ? Colors.secondary : 'rgba(255,255,255,0.5)'}
                />
                <Text style={[styles.tabBtnText, activeTab === tab.id && styles.tabBtnTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </LinearGradient>

        {/* Wallet Chip */}
        <Pressable style={styles.walletChip} onPress={() => router.push('/(tabs)/wallet')}>
          <MaterialIcons name="chevron-left" size={20} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.walletLabel}>رصيد المحفظة</Text>
            <Text style={styles.walletAmount}>{user.wallet.toFixed(2)} جنيه</Text>
          </View>
          <View style={styles.walletIconWrap}>
            <MaterialIcons name="account-balance-wallet" size={22} color={Colors.primary} />
          </View>
        </Pressable>

        {/* ===== TAB: STATS ===== */}
        {activeTab === 'stats' && (
          <View style={styles.tabContent}>
            {/* Ride Summary */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>ملخص الرحلات</Text>
              <View style={styles.rideGrid}>
                {[
                  { label: 'مكتملة', value: completedRides.length, color: Colors.success, icon: 'check-circle' },
                  { label: 'ملغاة', value: mockRideHistory.length - completedRides.length, color: Colors.error, icon: 'cancel' },
                  { label: 'إجمالي الإنفاق', value: `${totalSpent.toFixed(0)} ج`, color: Colors.primary, icon: 'account-balance-wallet' },
                  { label: 'متوسط السعر', value: `${(totalSpent / Math.max(completedRides.length, 1)).toFixed(0)} ج`, color: Colors.warning, icon: 'trending-up' },
                ].map(item => (
                  <View key={item.label} style={styles.rideStatCard}>
                    <View style={[styles.rideStatIcon, { backgroundColor: item.color + '20' }]}>
                      <MaterialIcons name={item.icon as any} size={22} color={item.color} />
                    </View>
                    <Text style={styles.rideStatValue}>{item.value}</Text>
                    <Text style={styles.rideStatLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Recent Rides */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>آخر الرحلات</Text>
              {mockRideHistory.slice(0, 3).map(ride => (
                <View key={ride.id} style={styles.rideRow}>
                  <View style={styles.rideRowLeft}>
                    <Text style={styles.rideDate}>{ride.date}</Text>
                    <Text style={[styles.ridePrice, { color: ride.status === 'completed' ? Colors.success : Colors.error }]}>
                      {ride.status === 'completed' ? `-${ride.price.toFixed(0)} ج` : 'ملغاة'}
                    </Text>
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
                      <MaterialIcons key={s} name="star" size={14} color={s <= Math.round(user.rating) ? Colors.primary : Colors.border} />
                    ))}
                  </View>
                  <Text style={styles.ratingTotal}>{user.totalRides} تقييم</Text>
                </View>
                <View style={styles.ratingBars}>
                  {ratingDistribution.map(row => (
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

        {/* ===== TAB: REFERRALS ===== */}
        {activeTab === 'referrals' && (
          <View style={styles.tabContent}>
            {/* Referral Code Card */}
            <LinearGradient
              colors={['#9B59B6', '#6C3483']}
              style={styles.referralHero}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <View style={styles.referralHeroContent}>
                <Text style={styles.referralHeroTitle}>كود الإحالة بتاعك</Text>
                <Text style={styles.referralHeroDesc}>شارك مع أصدقائك واكسب 20 جنيه لكل إحالة ناجحة</Text>
                <Pressable
                  style={styles.referralCodeBox}
                  onPress={() => showAlert('تم النسخ!', `كود الإحالة: ${user.referralCode}`)}
                >
                  <MaterialIcons name="content-copy" size={18} color="#9B59B6" />
                  <Text style={styles.referralCodeText}>{user.referralCode}</Text>
                </Pressable>
                <Pressable style={styles.shareReferralBtn}>
                  <MaterialIcons name="share" size={16} color="#fff" />
                  <Text style={styles.shareReferralText}>مشاركة الكود</Text>
                </Pressable>
              </View>
              <MaterialIcons name="card-giftcard" size={80} color="rgba(255,255,255,0.15)" />
            </LinearGradient>

            {/* Earnings Summary */}
            <View style={styles.earningsRow}>
              <View style={styles.earningCard}>
                <Text style={styles.earningValue}>{user.referralCount}</Text>
                <Text style={styles.earningLabel}>إجمالي الإحالات</Text>
              </View>
              <View style={[styles.earningCard, { backgroundColor: Colors.successSurface }]}>
                <Text style={[styles.earningValue, { color: Colors.success }]}>{user.referralEarnings} ج</Text>
                <Text style={styles.earningLabel}>إجمالي الأرباح</Text>
              </View>
            </View>

            {/* Referral History */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>سجل الإحالات</Text>
              {mockReferralHistory.map(ref => (
                <View key={ref.id} style={styles.referralRow}>
                  <View style={styles.referralRowLeft}>
                    <Text style={[styles.referralEarned, { color: Colors.success }]}>+{ref.earned} ج</Text>
                    <Text style={styles.referralDate}>{ref.date}</Text>
                  </View>
                  <View style={styles.referralRowInfo}>
                    <Text style={styles.referralName}>{ref.name}</Text>
                    <Text style={styles.referralRides}>{ref.rides} رحلات مكتملة</Text>
                  </View>
                  <Image source={{ uri: ref.avatar }} style={styles.referralAvatar} contentFit="cover" />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ===== TAB: SETTINGS ===== */}
        {activeTab === 'settings' && (
          <View style={styles.tabContent}>
            {/* Language */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>اللغة</Text>
              <View style={styles.langRow}>
                {([{ id: 'ar' as const, label: 'العربية', flag: '🇸🇦' }, { id: 'en' as const, label: 'English', flag: '🇺🇸' }]).map(lang => (
                  <Pressable
                    key={lang.id}
                    style={[styles.langBtn, language === lang.id && styles.langBtnActive]}
                    onPress={() => setLanguage(lang.id)}
                  >
                    <Text style={styles.langFlag}>{lang.flag}</Text>
                    <Text style={[styles.langLabel, language === lang.id && { color: '#fff' }]}>{lang.label}</Text>
                    {language === lang.id && <MaterialIcons name="check" size={14} color="#fff" />}
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>الحساب</Text>
              <View style={styles.menuGroup}>
                <MenuItem icon="notifications" label="الإشعارات" badge={unreadNotifications > 0 ? String(unreadNotifications) : undefined} onPress={() => { router.push('/notifications'); markNotificationsRead(); }} />
                <MenuItem icon="history" label="سجل الرحلات" onPress={() => {}} />
                <MenuItem icon="star" label="تقييماتي" onPress={() => setActiveTab('stats')} />
                <MenuItem icon="people" label="نظام الإحالة" onPress={() => setActiveTab('referrals')} />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>الأمان والخصوصية</Text>
              <View style={styles.menuGroup}>
                <MenuItem icon="location-on" label="مشاركة الموقع" value="مفعّل" onPress={() => {}} />
                <MenuItem icon="lock" label="تغيير كلمة المرور" onPress={() => {}} />
                <MenuItem icon="verified-user" label="التحقق من الهوية" onPress={() => {}} />
                <MenuItem icon="privacy-tip" label="سياسة الخصوصية" onPress={() => {}} />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>التطبيق</Text>
              <View style={styles.menuGroup}>
                <MenuItem icon="admin-panel-settings" label="لوحة التحكم الإدارية" onPress={() => router.push('/admin-panel')} />
                <MenuItem icon="help" label="المساعدة والدعم" onPress={() => {}} />
                <MenuItem icon="info" label="عن التطبيق" value="v1.0.0" onPress={() => {}} />
              </View>
            </View>

            <View style={[styles.section, { marginBottom: Spacing.xxxl }]}>
              <View style={styles.menuGroup}>
                <MenuItem icon="logout" label="تسجيل الخروج" onPress={() => showAlert('تسجيل الخروج', 'هل تريد تسجيل الخروج؟', [{ text: 'إلغاء', style: 'cancel' }, { text: 'خروج', style: 'destructive', onPress: () => router.replace('/') }])} danger />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: Spacing.md,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDotHeader: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
  },
  avatarSection: { alignItems: 'center', gap: 4, marginBottom: Spacing.lg },
  avatarWrap: { position: 'relative', marginBottom: Spacing.sm },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    ...Shadow.sm,
  },
  userName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.extraBold,
    color: '#fff',
  },
  userPhone: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.65)',
  },
  joinRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  joinDate: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.45)',
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  statItem: { alignItems: 'center', gap: 3 },
  statNum: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.extraBold,
    color: '#fff',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  statLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.6)',
  },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  tabRow: { flexDirection: 'row', gap: 6 },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tabBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: Typography.semiBold,
    color: 'rgba(255,255,255,0.5)',
  },
  tabBtnTextActive: { color: Colors.secondary },
  walletChip: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginTop: -Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadow.md,
  },
  walletIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
  walletAmount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg,
    fontWeight: Typography.extraBold,
    color: Colors.primary,
  },
  tabContent: { paddingHorizontal: Spacing.base, paddingTop: Spacing.xl, gap: Spacing.base, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.sm,
    gap: Spacing.md,
  },
  cardTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  rideGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  rideStatCard: {
    width: '47%',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  rideStatIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideStatValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg,
    fontWeight: Typography.extraBold,
    color: Colors.textPrimary,
  },
  rideStatLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  rideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  rideStatusDot: { width: 8, height: 8, borderRadius: 4 },
  rideRowInfo: { flex: 1 },
  rideTo: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  rideFrom: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
  rideRowLeft: { alignItems: 'flex-end', minWidth: 60 },
  ridePrice: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  rideDate: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  ratingOverview: { flexDirection: 'row', gap: Spacing.base, alignItems: 'center' },
  ratingBig: { alignItems: 'center', gap: 4 },
  ratingBigNum: {
    fontFamily: Typography.fontFamily,
    fontSize: 36,
    fontWeight: Typography.black,
    color: Colors.textPrimary,
  },
  starsRow: { flexDirection: 'row', gap: 2 },
  ratingTotal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  ratingBars: { flex: 1, gap: 6 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingStarLabel: { flexDirection: 'row', alignItems: 'center', gap: 1, width: 22, justifyContent: 'flex-end' },
  ratingStarNum: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.textTertiary,
  },
  ratingBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  referralHero: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  referralHeroContent: { flex: 1, gap: Spacing.sm },
  referralHeroTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: '#fff',
    textAlign: 'right',
  },
  referralHeroDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
    lineHeight: 20,
  },
  referralCodeBox: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-end',
  },
  referralCodeText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.extraBold,
    color: '#9B59B6',
    letterSpacing: 1,
  },
  shareReferralBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: 'flex-end',
  },
  shareReferralText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: '#fff',
    fontWeight: Typography.semiBold,
  },
  earningsRow: { flexDirection: 'row', gap: Spacing.sm },
  earningCard: {
    flex: 1,
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    alignItems: 'center',
    gap: 4,
  },
  earningValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.extraBold,
    color: Colors.primary,
  },
  earningLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  referralAvatar: { width: 40, height: 40, borderRadius: 20 },
  referralRowInfo: { flex: 1 },
  referralName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  referralRides: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
  referralRowLeft: { alignItems: 'flex-end', gap: 2 },
  referralEarned: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  referralDate: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  langRow: { flexDirection: 'row', gap: Spacing.sm },
  langBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  langBtnActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  langFlag: { fontSize: 18 },
  langLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  section: { marginTop: Spacing.base },
  sectionLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textTertiary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
    paddingHorizontal: 4,
  },
  menuGroup: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 10,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  menuValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textTertiary,
  },
  menuBadge: {
    backgroundColor: Colors.error,
    borderRadius: Radius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  menuBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    fontWeight: Typography.bold,
    color: '#fff',
  },
});
