// Powered by OnSpace.AI — Wallet Screen (Dark Premium Redesign)
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
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH  = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 90;

const txConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  ride:     { icon: 'local-taxi',           color: Colors.error,   bg: Colors.errorSurface,   label: 'رحلة' },
  referral: { icon: 'person-add',           color: Colors.success, bg: Colors.successSurface, label: 'إحالة' },
  topup:    { icon: 'add-circle-outline',   color: Colors.primary, bg: Colors.primarySurface, label: 'شحن' },
  withdraw: { icon: 'account-balance',      color: Colors.warning, bg: Colors.warningSurface, label: 'سحب' },
};

const monthlyData = [
  { month: 'أغس',  spent: 280, earned: 40 },
  { month: 'سبت',  spent: 320, earned: 60 },
  { month: 'أكت',  spent: 195, earned: 80 },
  { month: 'نوف',  spent: 410, earned: 40 },
  { month: 'ديس',  spent: 335, earned: 100 },
  { month: 'يناير', spent: 235, earned: 40 },
];

const referralFriends = [
  { id: 'r1', name: 'عصام محمد', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', status: 'active', rides: 12, earned: 20 },
  { id: 'r2', name: 'دينا علي',  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', status: 'active', rides: 8,  earned: 20 },
  { id: 'r3', name: 'سامي خالد', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', status: 'pending', rides: 1, earned: 0 },
];

type WalletTab = 'overview' | 'referral';

function SpendingChart() {
  const maxVal = Math.max(...monthlyData.map(d => Math.max(d.spent, d.earned)), 1);
  const BAR_W  = (CHART_WIDTH / monthlyData.length - 10) / 2;

  return (
    <View style={chartSt.root}>
      {/* Y labels */}
      <View style={chartSt.yAxis}>
        {[maxVal, Math.round(maxVal / 2), 0].map((v, i) => (
          <Text key={i} style={chartSt.yLabel}>{v === 0 ? '0' : v > 999 ? `${(v / 1000).toFixed(1)}k` : v}</Text>
        ))}
      </View>
      {/* Bars */}
      <View style={chartSt.bars}>
        {monthlyData.map((d, i) => (
          <View key={i} style={chartSt.barGroup}>
            <View style={chartSt.barPair}>
              <View style={[chartSt.bar, { height: Math.max(4, (d.earned / maxVal) * CHART_HEIGHT), width: BAR_W, backgroundColor: Colors.success }]} />
              <View style={[chartSt.bar, { height: Math.max(4, (d.spent / maxVal) * CHART_HEIGHT), width: BAR_W, backgroundColor: Colors.error }]} />
            </View>
            <Text style={chartSt.monthLabel}>{d.month}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const chartSt = StyleSheet.create({
  root: { flexDirection: 'row', gap: 6, paddingTop: Spacing.xs },
  yAxis: { justifyContent: 'space-between', paddingBottom: 20 },
  yLabel: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textMuted, textAlign: 'right', width: 26 },
  bars: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  barGroup: { flex: 1, alignItems: 'center', gap: 4 },
  barPair: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { borderRadius: 4 },
  monthLabel: { fontFamily: Typography.fontFamily, fontSize: 8, color: Colors.textMuted, textAlign: 'center' },
});

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, walletTransactions } = useApp();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<WalletTab>('overview');

  const totalEarned = walletTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalSpent  = walletTransactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Balance Card ─────────────────────────────────── */}
        <View style={[styles.balanceSection, { paddingTop: insets.top + 16 }]}>
          {/* Background grid decoration */}
          <View style={styles.balanceBgGrid}>
            {[0.3, 0.6, 0.9].map(f => (
              <View key={f} style={[styles.balanceBgLine, { top: `${f * 100}%` as any }]} />
            ))}
          </View>

          {/* Wallet icon top */}
          <View style={styles.walletIconWrap}>
            <MaterialIcons name="account-balance-wallet" size={26} color={Colors.primary} />
          </View>

          <Text style={styles.balanceLabel}>رصيدي الحالي</Text>

          {/* Amount */}
          <View style={styles.balanceAmountRow}>
            <Text style={styles.balanceCurrency}>ج</Text>
            <Text style={styles.balanceAmount}>{user.wallet.toFixed(2)}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.balanceStats}>
            <View style={styles.balanceStat}>
              <MaterialIcons name="arrow-downward" size={12} color={Colors.success} />
              <View>
                <Text style={[styles.balanceStatVal, { color: Colors.success }]}>{totalEarned.toFixed(0)} ج</Text>
                <Text style={styles.balanceStatLabel}>وارد</Text>
              </View>
            </View>
            <View style={styles.balanceStatDivider} />
            <View style={styles.balanceStat}>
              <MaterialIcons name="arrow-upward" size={12} color={Colors.error} />
              <View>
                <Text style={[styles.balanceStatVal, { color: Colors.error }]}>{totalSpent.toFixed(0)} ج</Text>
                <Text style={styles.balanceStatLabel}>صادر</Text>
              </View>
            </View>
            <View style={styles.balanceStatDivider} />
            <View style={styles.balanceStat}>
              <MaterialIcons name="card-giftcard" size={12} color={Colors.primary} />
              <View>
                <Text style={[styles.balanceStatVal, { color: Colors.primary }]}>{user.referralEarnings.toFixed(0)} ج</Text>
                <Text style={styles.balanceStatLabel}>إحالات</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.balanceActions}>
            {[
              { icon: 'add', label: 'شحن',  onPress: () => router.push('/wallet-topup'), primary: true },
              { icon: 'download', label: 'سحب', onPress: () => showAlert('قريباً', 'خدمة السحب ستكون متاحة قريباً'), primary: false },
              { icon: 'send', label: 'تحويل', onPress: () => showAlert('قريباً', 'خدمة التحويل ستكون متاحة قريباً'), primary: false },
            ].map(btn => (
              <Pressable
                key={btn.label}
                style={[styles.balanceActionBtn, btn.primary && styles.balanceActionBtnPrimary]}
                onPress={btn.onPress}
              >
                <View style={[styles.balanceActionIcon, btn.primary && styles.balanceActionIconPrimary]}>
                  <MaterialIcons name={btn.icon as any} size={18} color={btn.primary ? Colors.textInverse : Colors.primary} />
                </View>
                <Text style={[styles.balanceActionLabel, btn.primary && { color: Colors.textInverse }]}>{btn.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Tab Switcher ─────────────────────────────────── */}
        <View style={styles.tabSwitcher}>
          {([
            { id: 'overview' as WalletTab, label: 'نظرة عامة', icon: 'dashboard' },
            { id: 'referral' as WalletTab, label: 'نظام الإحالة', icon: 'people' },
          ]).map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <MaterialIcons name={tab.icon as any} size={15} color={isActive ? Colors.textInverse : Colors.textTertiary} />
                <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── OVERVIEW TAB ─────────────────────────────────── */}
        {activeTab === 'overview' && (
          <View style={styles.content}>
            {/* Quick stats */}
            <View style={styles.quickStats}>
              {[
                { icon: 'person-add', label: 'إحالات', value: String(user.referralCount), color: Colors.success },
                { icon: 'attach-money', label: 'أرباح الإحالة', value: `${user.referralEarnings} ج`, color: Colors.primary },
                { icon: 'trending-up', label: 'إجمالي الدخل', value: `${totalEarned.toFixed(0)} ج`, color: Colors.warning },
              ].map(item => (
                <View key={item.label} style={styles.quickStatCard}>
                  <View style={[styles.quickStatIcon, { backgroundColor: item.color + '20' }]}>
                    <MaterialIcons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={styles.quickStatVal}>{item.value}</Text>
                  <Text style={styles.quickStatLabel}>{item.label}</Text>
                </View>
              ))}
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
                <Text style={styles.seeAll}>عرض الكل</Text>
                <Text style={styles.sectionTitle}>المعاملات الأخيرة</Text>
              </View>

              <View style={styles.txList}>
                {walletTransactions.map((tx, index) => {
                  const cfg = txConfig[tx.type] || txConfig.ride;
                  const isPos = tx.amount > 0;
                  return (
                    <View key={tx.id} style={[styles.txCard, index < walletTransactions.length - 1 && styles.txCardBorder]}>
                      {/* Icon */}
                      <View style={[styles.txIcon, { backgroundColor: cfg.bg }]}>
                        <MaterialIcons name={cfg.icon as any} size={20} color={cfg.color} />
                      </View>

                      {/* Info */}
                      <View style={styles.txInfo}>
                        <Text style={styles.txDesc} numberOfLines={1}>{tx.desc}</Text>
                        <View style={styles.txMetaRow}>
                          <View style={[styles.txTypePill, { backgroundColor: cfg.bg }]}>
                            <Text style={[styles.txTypePillText, { color: cfg.color }]}>{cfg.label}</Text>
                          </View>
                          <Text style={styles.txDate}>{tx.date}</Text>
                        </View>
                      </View>

                      {/* Amount */}
                      <Text style={[styles.txAmount, { color: isPos ? Colors.success : Colors.error }]}>
                        {isPos ? '+' : ''}{tx.amount.toFixed(2)} ج
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* ── REFERRAL TAB ─────────────────────────────────── */}
        {activeTab === 'referral' && (
          <View style={styles.content}>
            {/* Hero Banner */}
            <LinearGradient
              colors={[Colors.success, '#006644']}
              style={styles.referralHero}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <View style={styles.referralHeroDecor1} />
              <View style={styles.referralHeroDecor2} />
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
                  <MaterialIcons name="content-copy" size={18} color={Colors.success} />
                  <Text style={styles.referralCodeText}>{user.referralCode}</Text>
                </Pressable>
                <Pressable style={styles.referralShareBtn}>
                  <MaterialIcons name="share" size={14} color="#fff" />
                  <Text style={styles.referralShareText}>مشاركة الكود الآن</Text>
                </Pressable>
              </View>
            </LinearGradient>

            {/* Stats */}
            <View style={styles.referralStats}>
              {[
                { label: 'إجمالي الإحالات', value: user.referralCount, color: Colors.primary, icon: 'people' },
                { label: 'إجمالي الأرباح', value: `${user.referralEarnings} ج`, color: Colors.success, icon: 'monetization-on' },
                { label: 'في الانتظار', value: '3', color: Colors.warning, icon: 'access-time' },
              ].map(s => (
                <View key={s.label} style={[styles.referralStatCard, { borderColor: s.color + '40' }]}>
                  <View style={[styles.referralStatIconWrap, { backgroundColor: s.color + '20' }]}>
                    <MaterialIcons name={s.icon as any} size={16} color={s.color} />
                  </View>
                  <Text style={[styles.referralStatVal, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.referralStatLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* How it works */}
            <View style={styles.howCard}>
              <Text style={styles.howTitle}>كيف يعمل النظام؟</Text>
              {[
                { step: '١', text: 'شارك كودك مع أصدقائك', icon: 'share', color: Colors.primary },
                { step: '٢', text: 'يسجل صديقك بكودك',    icon: 'person-add', color: Colors.success },
                { step: '٣', text: 'يكمل أول رحلة بنجاح',  icon: 'local-taxi', color: Colors.warning },
                { step: '٤', text: 'تحصل على 20 جنيه فوراً!', icon: 'account-balance-wallet', color: '#9B59B6' },
              ].map(s => (
                <View key={s.step} style={styles.howRow}>
                  <View style={[styles.howStepNum, { backgroundColor: s.color }]}>
                    <Text style={styles.howStepNumText}>{s.step}</Text>
                  </View>
                  <Text style={styles.howText}>{s.text}</Text>
                  <View style={[styles.howIcon, { backgroundColor: s.color + '20' }]}>
                    <MaterialIcons name={s.icon as any} size={16} color={s.color} />
                  </View>
                </View>
              ))}
            </View>

            {/* Friends List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>أصدقاؤك المُحالون</Text>
              <View style={styles.friendsList}>
                {referralFriends.map(f => (
                  <View key={f.id} style={styles.friendCard}>
                    <Text style={[styles.friendEarned, { color: f.earned > 0 ? Colors.success : Colors.textTertiary }]}>
                      {f.earned > 0 ? `+${f.earned} ج` : 'معلق'}
                    </Text>
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName}>{f.name}</Text>
                      <View style={[
                        styles.friendStatusBadge,
                        { backgroundColor: f.status === 'active' ? Colors.successSurface : Colors.warningSurface }
                      ]}>
                        <MaterialIcons
                          name={f.status === 'active' ? 'check-circle' : 'access-time'}
                          size={10}
                          color={f.status === 'active' ? Colors.success : Colors.warning}
                        />
                        <Text style={[styles.friendStatusText, { color: f.status === 'active' ? Colors.success : Colors.warning }]}>
                          {f.status === 'active' ? `${f.rides} رحلات` : 'لم يكمل رحلة'}
                        </Text>
                      </View>
                    </View>
                    <Image source={{ uri: f.avatar }} style={styles.friendAvatar} contentFit="cover" />
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
  root: { flex: 1, backgroundColor: Colors.background },

  // BALANCE SECTION
  balanceSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl,
    alignItems: 'center', gap: Spacing.sm,
    borderBottomLeftRadius: Radius.xxxl,
    borderBottomRightRadius: Radius.xxxl,
    borderBottomWidth: 1, borderColor: Colors.borderGold,
    position: 'relative', overflow: 'hidden',
    ...Shadow.golden,
  },
  balanceBgGrid: { ...StyleSheet.absoluteFillObject },
  balanceBgLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(232,160,32,0.06)' },
  walletIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primarySurface,
    borderWidth: 2, borderColor: Colors.borderGold,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xs,
    ...Shadow.goldenSm,
  },
  balanceLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: Colors.textTertiary,
  },
  balanceAmountRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  balanceAmount: {
    fontFamily: Typography.fontFamily,
    fontSize: 52, fontWeight: Typography.black, color: Colors.textPrimary, lineHeight: 60,
  },
  balanceCurrency: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.primary, marginBottom: 10,
  },
  balanceStats: {
    flexDirection: 'row', gap: Spacing.lg,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  balanceStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  balanceStatDivider: { width: 1, backgroundColor: Colors.border, height: 30 },
  balanceStatVal: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold },
  balanceStatLabel: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textMuted },
  balanceActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  balanceActionBtn: {
    flex: 1, alignItems: 'center', gap: 6,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl, paddingVertical: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  balanceActionBtnPrimary: { backgroundColor: Colors.primary, borderColor: Colors.primary, ...Shadow.golden },
  balanceActionIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  balanceActionIconPrimary: { backgroundColor: 'rgba(0,0,0,0.2)' },
  balanceActionLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.semiBold, color: Colors.textSecondary,
  },

  // TABS
  tabSwitcher: {
    flexDirection: 'row', marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: 4, gap: 4,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.sm,
  },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: Radius.lg,
  },
  tabBtnActive: { backgroundColor: Colors.primary, ...Shadow.goldenSm },
  tabBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.semiBold, color: Colors.textTertiary,
  },
  tabBtnTextActive: { color: Colors.textInverse },

  // CONTENT
  content: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base, gap: Spacing.base, paddingBottom: 40 },

  // QUICK STATS
  quickStats: { flexDirection: 'row', gap: Spacing.sm },
  quickStatCard: {
    flex: 1, backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.md,
    alignItems: 'center', gap: 5,
    ...Shadow.sm, borderWidth: 1, borderColor: Colors.border,
  },
  quickStatIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  quickStatVal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.extraBold, color: Colors.textPrimary,
  },
  quickStatLabel: {
    fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textTertiary, textAlign: 'center',
  },

  // CHART
  chartCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, ...Shadow.sm, gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chartTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  chartLegend: { flexDirection: 'row', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  chartNote: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textMuted, textAlign: 'center',
  },

  // SECTION
  section: { gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  seeAll: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.semiBold,
  },

  // TRANSACTIONS
  txList: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    overflow: 'hidden', ...Shadow.sm,
    borderWidth: 1, borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  txCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.base, gap: 12,
  },
  txCardBorder: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  txIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txInfo: { flex: 1, gap: 4 },
  txDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  txMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'flex-end' },
  txTypePill: {
    borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 2,
  },
  txTypePillText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold },
  txDate: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted },
  txAmount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.bold, flexShrink: 0,
  },

  // REFERRAL
  referralHero: {
    borderRadius: Radius.xl, padding: Spacing.lg,
    gap: Spacing.lg, overflow: 'hidden', position: 'relative',
  },
  referralHeroDecor1: {
    position: 'absolute', top: -30, left: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  referralHeroDecor2: {
    position: 'absolute', bottom: -20, right: -20,
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  referralHeroContent: { gap: 5 },
  referralHeroTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.extraBold, color: '#fff', textAlign: 'right',
  },
  referralHeroDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: 'rgba(255,255,255,0.85)', textAlign: 'right', lineHeight: 22,
  },
  referralCodeSection: { gap: Spacing.sm, alignItems: 'flex-end' },
  referralCodeLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.7)' },
  referralCodeBox: {
    backgroundColor: '#fff', borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  referralCodeText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.black,
    color: Colors.success, letterSpacing: 2,
  },
  referralShareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full, paddingHorizontal: Spacing.lg, paddingVertical: 9,
  },
  referralShareText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.bold, color: '#fff',
  },
  referralStats: { flexDirection: 'row', gap: Spacing.sm },
  referralStatCard: {
    flex: 1, backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.md,
    alignItems: 'center', gap: 5,
    borderWidth: 1.5, ...Shadow.sm,
  },
  referralStatIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  referralStatVal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.extraBold,
  },
  referralStatLabel: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textTertiary, textAlign: 'center' },
  howCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, ...Shadow.sm, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  howTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right',
  },
  howRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  howStepNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  howStepNumText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: '#fff' },
  howText: {
    flex: 1, fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: Colors.textPrimary, textAlign: 'right',
  },
  howIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  friendsList: { marginTop: Spacing.sm, gap: Spacing.sm },
  friendCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: 12, ...Shadow.sm, borderWidth: 1, borderColor: Colors.border,
  },
  friendAvatar: { width: 44, height: 44, borderRadius: 22 },
  friendInfo: { flex: 1, gap: 4 },
  friendName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  friendStatusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3,
    alignSelf: 'flex-end',
  },
  friendStatusText: { fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.semiBold },
  friendEarned: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, minWidth: 55, textAlign: 'right' },
});
