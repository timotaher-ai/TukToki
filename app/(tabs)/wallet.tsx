// Powered by OnSpace.AI — Wallet Screen (Enhanced with Chart + Referral System)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 100;

const transactionConfig: Record<string, { icon: string; color: string; bg: string }> = {
  ride:     { icon: 'directions-car', color: Colors.error,   bg: Colors.errorSurface },
  referral: { icon: 'person-add',     color: Colors.success, bg: Colors.successSurface },
  topup:    { icon: 'add-circle',     color: Colors.primary, bg: Colors.primarySurface },
  withdraw: { icon: 'account-balance',color: Colors.warning, bg: Colors.warningSurface },
};

// Monthly spending data (mock)
const monthlyData = [
  { month: 'أغسطس', spent: 280, earned: 40 },
  { month: 'سبتمبر', spent: 320, earned: 60 },
  { month: 'أكتوبر', spent: 195, earned: 80 },
  { month: 'نوفمبر', spent: 410, earned: 40 },
  { month: 'ديسمبر', spent: 335, earned: 100 },
  { month: 'يناير',  spent: 235, earned: 40 },
];

const referralFriends = [
  { id: 'r1', name: 'عصام محمد', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', status: 'active', rides: 12, earned: 20 },
  { id: 'r2', name: 'دينا علي',   avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', status: 'active', rides: 8, earned: 20 },
  { id: 'r3', name: 'سامي خالد', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', status: 'pending', rides: 1, earned: 0 },
];

type WalletTab = 'overview' | 'referral';

function SpendingChart() {
  const maxVal = Math.max(...monthlyData.map(d => Math.max(d.spent, d.earned)));
  const BAR_W = (CHART_WIDTH - (monthlyData.length - 1) * 8) / monthlyData.length / 2 - 2;

  return (
    <View style={chartStyles.container}>
      {/* Y axis labels */}
      <View style={chartStyles.yAxis}>
        {[maxVal, Math.round(maxVal / 2), 0].map(v => (
          <Text key={v} style={chartStyles.yLabel}>{v === 0 ? '0' : v > 999 ? `${(v/1000).toFixed(1)}k` : v}</Text>
        ))}
      </View>
      {/* Bars */}
      <View style={chartStyles.barsArea}>
        {monthlyData.map((d, i) => (
          <View key={i} style={chartStyles.barGroup}>
            <View style={chartStyles.barPair}>
              {/* Earned bar */}
              <View style={[chartStyles.bar, chartStyles.barEarned, { height: Math.max(4, (d.earned / maxVal) * CHART_HEIGHT), width: BAR_W }]} />
              {/* Spent bar */}
              <View style={[chartStyles.bar, chartStyles.barSpent, { height: Math.max(4, (d.spent / maxVal) * CHART_HEIGHT), width: BAR_W }]} />
            </View>
            <Text style={chartStyles.monthLabel} numberOfLines={1}>{d.month}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8, paddingTop: Spacing.sm },
  yAxis: { justifyContent: 'space-between', paddingBottom: 22, gap: 0 },
  yLabel: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textTertiary, textAlign: 'right', width: 28 },
  barsArea: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  barGroup: { flex: 1, alignItems: 'center', gap: 4 },
  barPair: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { borderRadius: 4 },
  barSpent: { backgroundColor: Colors.error },
  barEarned: { backgroundColor: Colors.success },
  monthLabel: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textTertiary, textAlign: 'center' },
});

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, walletTransactions } = useApp();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<WalletTab>('overview');

  const totalEarned = walletTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = walletTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <LinearGradient
          colors={[Colors.secondary, Colors.secondaryLight, '#3A7BD5']}
          style={[styles.balanceCard, { paddingTop: insets.top + 20 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Golden accent ring */}
          <View style={styles.balanceRing}>
            <MaterialIcons name="account-balance-wallet" size={28} color={Colors.primary} />
          </View>

          <Text style={styles.balanceLabel}>رصيدي الحالي</Text>
          <View style={styles.balanceNumRow}>
            <Text style={styles.balanceCurrency}>ج</Text>
            <Text style={styles.balanceAmount}>{user.wallet.toFixed(2)}</Text>
          </View>

          {/* Mini stats */}
          <View style={styles.balanceMiniStats}>
            <View style={styles.balanceMiniStat}>
              <MaterialIcons name="arrow-downward" size={14} color="#E8F5E9" />
              <Text style={styles.balanceMiniVal}>{totalEarned.toFixed(0)} ج</Text>
              <Text style={styles.balanceMiniLabel}>وارد</Text>
            </View>
            <View style={styles.balanceMiniDivider} />
            <View style={styles.balanceMiniStat}>
              <MaterialIcons name="arrow-upward" size={14} color="#FFCDD2" />
              <Text style={styles.balanceMiniVal}>{totalSpent.toFixed(0)} ج</Text>
              <Text style={styles.balanceMiniLabel}>صادر</Text>
            </View>
          </View>

          <View style={styles.balanceActions}>
            <Pressable style={styles.balanceActionBtn} onPress={() => router.push('/wallet-topup')}>
              <MaterialIcons name="add" size={18} color={Colors.secondary} />
              <Text style={styles.balanceActionText}>شحن</Text>
            </Pressable>
            <Pressable style={styles.balanceActionBtn} onPress={() => showAlert('قريباً', 'خدمة السحب ستكون متاحة قريباً')}>
              <MaterialIcons name="download" size={18} color={Colors.secondary} />
              <Text style={styles.balanceActionText}>سحب</Text>
            </Pressable>
            <Pressable style={styles.balanceActionBtn} onPress={() => showAlert('قريباً', 'خدمة التحويل ستكون متاحة قريباً')}>
              <MaterialIcons name="send" size={18} color={Colors.secondary} />
              <Text style={styles.balanceActionText}>تحويل</Text>
            </Pressable>
          </View>
        </LinearGradient>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          {([
            { id: 'overview' as WalletTab, label: 'نظرة عامة', icon: 'dashboard' },
            { id: 'referral' as WalletTab, label: 'نظام الإحالة', icon: 'people' },
          ]).map(tab => (
            <Pressable
              key={tab.id}
              style={[styles.tabBtn, activeTab === tab.id && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <MaterialIcons
                name={tab.icon as any}
                size={16}
                color={activeTab === tab.id ? '#fff' : Colors.textTertiary}
              />
              <Text style={[styles.tabBtnText, activeTab === tab.id && styles.tabBtnTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ===== TAB: OVERVIEW ===== */}
        {activeTab === 'overview' && (
          <View style={styles.content}>
            {/* Stats Cards */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: Colors.successSurface }]}>
                  <MaterialIcons name="person-add" size={20} color={Colors.success} />
                </View>
                <Text style={styles.statValue}>{user.referralCount}</Text>
                <Text style={styles.statLabel}>إحالة</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: Colors.primarySurface }]}>
                  <MaterialIcons name="attach-money" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.statValue}>{user.referralEarnings}</Text>
                <Text style={styles.statLabel}>أرباح الإحالة</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: Colors.warningSurface }]}>
                  <MaterialIcons name="trending-up" size={20} color={Colors.warning} />
                </View>
                <Text style={styles.statValue}>{totalEarned.toFixed(0)}</Text>
                <Text style={styles.statLabel}>إجمالي الدخل</Text>
              </View>
            </View>

            {/* Spending Chart */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
                    <Text style={styles.legendText}>دخل</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
                    <Text style={styles.legendText}>إنفاق</Text>
                  </View>
                </View>
                <Text style={styles.chartTitle}>الإنفاق الشهري</Text>
              </View>
              <SpendingChart />
              <Text style={styles.chartNote}>آخر 6 أشهر · بالجنيه المصري</Text>
            </View>

            {/* Transactions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLink}>عرض الكل</Text>
                <Text style={styles.sectionTitle}>المعاملات الأخيرة</Text>
              </View>
              {walletTransactions.map(tx => {
                const config = transactionConfig[tx.type] || transactionConfig.ride;
                const isPositive = tx.amount > 0;
                return (
                  <View key={tx.id} style={styles.txCard}>
                    <View style={styles.txRight}>
                      <Text style={[styles.txAmount, { color: isPositive ? Colors.success : Colors.error }]}>
                        {isPositive ? '+' : ''}{tx.amount.toFixed(2)} ج
                      </Text>
                      <Text style={styles.txDate}>{tx.date}</Text>
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txDesc}>{tx.desc}</Text>
                      <View style={[styles.txTypeBadge, { backgroundColor: config.bg }]}>
                        <MaterialIcons name={config.icon as any} size={10} color={config.color} />
                      </View>
                    </View>
                    <View style={[styles.txIcon, { backgroundColor: config.bg }]}>
                      <MaterialIcons name={config.icon as any} size={20} color={config.color} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ===== TAB: REFERRAL ===== */}
        {activeTab === 'referral' && (
          <View style={styles.content}>
            {/* Referral Hero */}
            <LinearGradient
              colors={[Colors.success, '#006644']}
              style={styles.referralHero}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <View style={styles.referralHeroDecor} />
              <View style={styles.referralHeroContent}>
                <Text style={styles.referralHeroTitle}>ادعُ أصدقاءك واكسب معاهم!</Text>
                <Text style={styles.referralHeroDesc}>احصل على 20 جنيه مقابل كل صديق يسجل ويكمل أول رحلة</Text>
              </View>
              <View style={styles.referralCodeSection}>
                <Text style={styles.referralCodeLabel}>كودك الخاص</Text>
                <Pressable
                  style={styles.referralCodeBox}
                  onPress={() => showAlert('تم النسخ! 📋', `شارك كودك: ${user.referralCode}`)}
                >
                  <MaterialIcons name="content-copy" size={20} color={Colors.success} />
                  <Text style={styles.referralCodeText}>{user.referralCode}</Text>
                </Pressable>
                <Pressable style={styles.shareBtn}>
                  <MaterialIcons name="share" size={16} color="#fff" />
                  <Text style={styles.shareBtnText}>مشاركة الكود الآن</Text>
                </Pressable>
              </View>
            </LinearGradient>

            {/* Referral Stats */}
            <View style={styles.referralStatsRow}>
              <View style={[styles.referralStatCard, { borderColor: Colors.primary }]}>
                <Text style={styles.referralStatVal}>{user.referralCount}</Text>
                <Text style={styles.referralStatLabel}>إجمالي الإحالات</Text>
                <View style={[styles.referralStatBadge, { backgroundColor: Colors.primarySurface }]}>
                  <MaterialIcons name="people" size={14} color={Colors.primary} />
                </View>
              </View>
              <View style={[styles.referralStatCard, { borderColor: Colors.success }]}>
                <Text style={[styles.referralStatVal, { color: Colors.success }]}>{user.referralEarnings} ج</Text>
                <Text style={styles.referralStatLabel}>إجمالي الأرباح</Text>
                <View style={[styles.referralStatBadge, { backgroundColor: Colors.successSurface }]}>
                  <MaterialIcons name="monetization-on" size={14} color={Colors.success} />
                </View>
              </View>
              <View style={[styles.referralStatCard, { borderColor: Colors.warning }]}>
                <Text style={[styles.referralStatVal, { color: Colors.warning }]}>3</Text>
                <Text style={styles.referralStatLabel}>في الانتظار</Text>
                <View style={[styles.referralStatBadge, { backgroundColor: Colors.warningSurface }]}>
                  <MaterialIcons name="access-time" size={14} color={Colors.warning} />
                </View>
              </View>
            </View>

            {/* How it works */}
            <View style={styles.howCard}>
              <Text style={styles.howTitle}>كيف يعمل النظام؟</Text>
              {[
                { step: '١', text: 'شارك كودك مع أصدقائك', icon: 'share', color: Colors.primary },
                { step: '٢', text: 'يسجل صديقك بكودك', icon: 'person-add', color: Colors.success },
                { step: '٣', text: 'يكمل أول رحلة بنجاح', icon: 'directions-car', color: Colors.warning },
                { step: '٤', text: 'تحصل على 20 جنيه فوراً!', icon: 'account-balance-wallet', color: '#9B59B6' },
              ].map(s => (
                <View key={s.step} style={styles.howRow}>
                  <View style={[styles.howStepBadge, { backgroundColor: s.color + '20' }]}>
                    <MaterialIcons name={s.icon as any} size={18} color={s.color} />
                  </View>
                  <Text style={styles.howText}>{s.text}</Text>
                  <View style={[styles.howNum, { backgroundColor: s.color }]}>
                    <Text style={styles.howNumText}>{s.step}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Friend List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>أصدقاؤك المُحالون</Text>
              <View style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
                {referralFriends.map(friend => (
                  <View key={friend.id} style={styles.friendCard}>
                    <View style={styles.friendLeft}>
                      <Text style={[
                        styles.friendEarned,
                        { color: friend.earned > 0 ? Colors.success : Colors.textTertiary }
                      ]}>
                        {friend.earned > 0 ? `+${friend.earned} ج` : 'معلق'}
                      </Text>
                    </View>
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName}>{friend.name}</Text>
                      <View style={styles.friendMeta}>
                        <View style={[
                          styles.friendStatusBadge,
                          { backgroundColor: friend.status === 'active' ? Colors.successSurface : Colors.warningSurface }
                        ]}>
                          <MaterialIcons
                            name={friend.status === 'active' ? 'check-circle' : 'access-time'}
                            size={10}
                            color={friend.status === 'active' ? Colors.success : Colors.warning}
                          />
                          <Text style={[
                            styles.friendStatusText,
                            { color: friend.status === 'active' ? Colors.success : Colors.warning }
                          ]}>
                            {friend.status === 'active' ? `${friend.rides} رحلات` : 'لم يكمل رحلة'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} contentFit="cover" />
                  </View>
                ))}
              </View>
            </View>

            <View style={{ height: 32 }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  balanceCard: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
    gap: Spacing.sm,
  },
  balanceRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(232,160,32,0.2)',
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  balanceLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  balanceNumRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  balanceAmount: {
    fontFamily: Typography.fontFamily,
    fontSize: 48,
    fontWeight: Typography.black,
    color: '#fff',
    lineHeight: 56,
  },
  balanceCurrency: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: 8,
  },
  balanceMiniStats: {
    flexDirection: 'row',
    gap: Spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginVertical: Spacing.sm,
  },
  balanceMiniStat: { alignItems: 'center', gap: 2, flexDirection: 'row', gap: 6 },
  balanceMiniDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  balanceMiniVal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  balanceMiniLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.6)',
  },
  balanceActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  balanceActionBtn: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: 4,
    minWidth: 80,
  },
  balanceActionText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.secondary,
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 4,
    gap: 4,
    ...Shadow.sm,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.lg,
  },
  tabBtnActive: { backgroundColor: Colors.secondary },
  tabBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textTertiary,
  },
  tabBtnTextActive: { color: '#fff' },
  content: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base, gap: Spacing.base, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    ...Shadow.sm,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.extraBold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.sm,
    gap: Spacing.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  chartLegend: { flexDirection: 'row', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  chartNote: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  section: { gap: 4 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  sectionLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.semiBold,
  },
  txCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  txInfo: { flex: 1, gap: 4 },
  txDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  txTypeBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  txRight: { alignItems: 'flex-end', gap: 2 },
  txAmount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  txDate: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  referralHero: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  referralHeroDecor: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  referralHeroContent: { gap: 6 },
  referralHeroTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg,
    fontWeight: Typography.extraBold,
    color: '#fff',
    textAlign: 'right',
  },
  referralHeroDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'right',
    lineHeight: 22,
  },
  referralCodeSection: { gap: Spacing.sm, alignItems: 'flex-end' },
  referralCodeLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  referralCodeBox: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  referralCodeText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg,
    fontWeight: Typography.black,
    color: Colors.success,
    letterSpacing: 2,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
  },
  shareBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  referralStatsRow: { flexDirection: 'row', gap: Spacing.sm },
  referralStatCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    ...Shadow.sm,
    position: 'relative',
  },
  referralStatVal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg,
    fontWeight: Typography.extraBold,
    color: Colors.primary,
  },
  referralStatLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  referralStatBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  howCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.sm,
    gap: Spacing.md,
  },
  howTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  howRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  howNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howNumText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  howText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  howStepBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadow.sm,
  },
  friendAvatar: { width: 44, height: 44, borderRadius: 22 },
  friendInfo: { flex: 1 },
  friendName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  friendMeta: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  friendStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  friendStatusText: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    fontWeight: Typography.semiBold,
  },
  friendLeft: { alignItems: 'flex-end', minWidth: 55 },
  friendEarned: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
});
