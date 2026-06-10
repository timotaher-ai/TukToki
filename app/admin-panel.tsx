// Powered by OnSpace.AI — Admin Panel (Full Rebuild - Dark Premium)
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAlert } from '@/template';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_W } = Dimensions.get('window');
const CHART_W = SCREEN_W - 64;
const CHART_H = 80;

// ── Mock Data ────────────────────────────────────────────────────────────────
const kpiData = [
  { label: 'المستخدمون', value: '12,847', icon: 'people', color: Colors.primary, bg: Colors.primarySurface, trend: '+12%' },
  { label: 'الرحلات اليوم', value: '1,234', icon: 'local-taxi', color: Colors.success, bg: Colors.successSurface, trend: '+8%' },
  { label: 'الإيرادات', value: '45,680 ج', icon: 'attach-money', color: Colors.warning, bg: Colors.warningSurface, trend: '+21%' },
  { label: 'السائقون النشطون', value: '489', icon: 'badge', color: '#9B59B6', bg: '#2A1B3D', trend: '+4%' },
];

const weeklyRevenue = [55, 78, 45, 92, 68, 85, 100];
const weeklyRides   = [420, 560, 340, 780, 520, 650, 890];

const mockUsers = [
  { id: 'u1', name: 'أحمد محمد السيد', phone: '+201012345678', role: 'user', status: 'active', rides: 127, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', verified: true },
  { id: 'u2', name: 'سارة خالد حسن', phone: '+201112345678', role: 'user', status: 'active', rides: 45, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', verified: true },
  { id: 'u3', name: 'محمود عبد الله', phone: '+201212345678', role: 'driver', status: 'active', rides: 312, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', verified: false },
  { id: 'u4', name: 'نور أحمد علي', phone: '+201312345678', role: 'user', status: 'banned', rides: 3, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', verified: false },
  { id: 'u5', name: 'خالد مصطفى', phone: '+201412345678', role: 'driver', status: 'active', rides: 89, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop', verified: true },
];

const mockWithdrawals = [
  { id: 'w1', user: 'هنا خالد', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', method: 'فودافون كاش', amount: 250, fee: 12.5, net: 237.5, date: 'الآن', status: 'pending', phone: '01011234567' },
  { id: 'w2', user: 'عصام محمد', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', method: 'إنستا باي', amount: 500, fee: 15, net: 485, date: 'منذ 10 دق', status: 'pending', phone: '01512345678' },
  { id: 'w3', user: 'دينا علي', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop', method: 'أورنج كاش', amount: 150, fee: 7.5, net: 142.5, date: 'منذ 30 دق', status: 'approved', phone: '01212345678' },
  { id: 'w4', user: 'سامي يوسف', avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=80&h=80&fit=crop', method: 'فوري', amount: 800, fee: 24, net: 776, date: 'أمس', status: 'transferred', phone: '01312345678' },
  { id: 'w5', user: 'منى حسن', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop', method: 'اتصالات كاش', amount: 320, fee: 16, net: 304, date: 'أمس', status: 'rejected', phone: '01112345678' },
];

const mockReports = [
  { id: 'r1', text: 'محتوى مسيء في منشور', user: 'كريم أسامة', type: 'post', time: 'منذ 5 دق', severity: 'high' },
  { id: 'r2', text: 'سائق تصرف بطريقة غير لائقة', user: 'سارة محمد', type: 'driver', time: 'منذ 20 دق', severity: 'high' },
  { id: 'r3', text: 'رسائل مزعجة من مستخدم', user: 'أحمد طارق', type: 'message', time: 'منذ ساعة', severity: 'medium' },
  { id: 'r4', text: 'صورة غير مناسبة في قصة', user: 'هنا خالد', type: 'story', time: 'منذ 2 ساعة', severity: 'medium' },
];

const referralLevels = [
  { level: 'Bronze', ar: 'برونز', min: 1, max: 20, rate: '5%', bonus: '10 ج', color: '#CD7F32', icon: 'emoji-events' },
  { level: 'Silver', ar: 'فضي', min: 21, max: 50, rate: '8%', bonus: '20 ج', color: '#C0C0C0', icon: 'workspace-premium' },
  { level: 'Gold', ar: 'ذهبي', min: 51, max: 100, rate: '12%', bonus: '35 ج', color: Colors.primary, icon: 'military-tech' },
  { level: 'Platinum', ar: 'بلاتيني', min: 101, max: 250, rate: '15%', bonus: '50 ج', color: '#E5E4E2', icon: 'diamond' },
  { level: 'Diamond', ar: 'ماسي', min: 251, max: 999, rate: '20%', bonus: '80 ج', color: '#B9F2FF', icon: 'auto-awesome' },
];

const topMarketers = [
  { rank: 1, name: 'هنا خالد',   referrals: 89, earnings: 1780, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', level: 'Gold' },
  { rank: 2, name: 'عصام محمد',  referrals: 56, earnings: 1120, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', level: 'Silver' },
  { rank: 3, name: 'سارة خالد',  referrals: 43, earnings: 860, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', level: 'Silver' },
  { rank: 4, name: 'أحمد محمد',  referrals: 12, earnings: 240, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', level: 'Bronze' },
];

type AdminTab = 'overview' | 'users' | 'withdrawals' | 'tuktalk' | 'referrals';

const withdrawalStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: 'قيد المراجعة',  color: Colors.warning, bg: Colors.warningSurface },
  approved:    { label: 'موافق عليه',    color: '#3D9BFF', bg: '#0D2A4A' },
  processing:  { label: 'قيد التحويل',   color: '#9B59B6', bg: '#2A1B3D' },
  transferred: { label: 'تم التحويل',    color: Colors.success, bg: Colors.successSurface },
  rejected:    { label: 'مرفوض',         color: Colors.error, bg: Colors.errorSurface },
  cancelled:   { label: 'ملغي',          color: Colors.textTertiary, bg: Colors.surfaceSecondary },
};

// ── Revenue Chart ─────────────────────────────────────────────────────────────
function RevenueChart({ data }: { data: number[] }) {
  const maxVal = Math.max(...data, 1);
  const labels = ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];
  return (
    <View style={chartSt.root}>
      {data.map((v, i) => (
        <View key={i} style={chartSt.barGroup}>
          <View style={[chartSt.bar, {
            height: Math.max(4, (v / maxVal) * CHART_H),
            backgroundColor: i === data.length - 1 ? Colors.primary : Colors.primarySurface,
          }]} />
          <Text style={chartSt.label}>{labels[i]}</Text>
        </View>
      ))}
    </View>
  );
}

const chartSt = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: CHART_H + 20 },
  barGroup: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '100%', borderRadius: 6 },
  label: { fontFamily: Typography.fontFamily, fontSize: 8, color: Colors.textMuted, textAlign: 'center' },
});

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminPanelScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [withdrawals, setWithdrawals] = useState(mockWithdrawals);
  const [users, setUsers] = useState(mockUsers);

  const tabs: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview',    label: 'نظرة عامة',    icon: 'dashboard' },
    { id: 'users',       label: 'المستخدمون',   icon: 'people' },
    { id: 'withdrawals', label: 'السحوبات',      icon: 'account-balance', badge: withdrawals.filter(w => w.status === 'pending').length },
    { id: 'tuktalk',     label: 'TukTalk',       icon: 'chat-bubble', badge: mockReports.filter(r => r.severity === 'high').length },
    { id: 'referrals',   label: 'الإحالات',      icon: 'people-outline' },
  ];

  const handleWithdrawalAction = (id: string, action: 'approve' | 'reject') => {
    showAlert(
      action === 'approve' ? 'تأكيد الموافقة' : 'تأكيد الرفض',
      action === 'approve' ? 'هل تريد الموافقة على طلب السحب هذا؟' : 'هل تريد رفض طلب السحب هذا؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: action === 'approve' ? 'موافقة' : 'رفض',
          style: action === 'approve' ? 'default' : 'destructive',
          onPress: () => setWithdrawals(prev =>
            prev.map(w => w.id === id ? { ...w, status: action === 'approve' ? 'approved' : 'rejected' } : w)
          ),
        },
      ]
    );
  };

  const handleUserAction = (id: string, action: 'ban' | 'verify' | 'unban') => {
    setUsers(prev => prev.map(u =>
      u.id === id
        ? { ...u, status: action === 'ban' ? 'banned' : 'active', verified: action === 'verify' ? true : u.verified }
        : u
    ));
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Header ──────────────────────────────────────────── */}
      <LinearGradient
        colors={['#0D1B3E', '#162550']}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.adminBadge}>
            <MaterialIcons name="admin-panel-settings" size={14} color={Colors.warning} />
            <Text style={styles.adminBadgeText}>Super Admin</Text>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>لوحة التحكم</Text>
            <Text style={styles.headerSub}>Admin Dashboard</Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 6 }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <MaterialIcons name={tab.icon as any} size={14} color={isActive ? '#fff' : 'rgba(255,255,255,0.5)'} />
                <Text style={[styles.tabBtnText, isActive && { color: '#fff' }]}>{tab.label}</Text>
                {tab.badge != null && tab.badge > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.base, gap: Spacing.base, paddingBottom: 40 }}
      >

        {/* ══════════════════════════════════════════════════════
            OVERVIEW TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <>
            {/* KPI Cards */}
            <View style={styles.kpiGrid}>
              {kpiData.map(k => (
                <View key={k.label} style={[styles.kpiCard, { backgroundColor: k.bg, borderColor: k.color + '30' }]}>
                  <View style={styles.kpiTop}>
                    <View style={[styles.kpiBadge, { backgroundColor: k.color + '20' }]}>
                      <Text style={[styles.kpiTrend, { color: k.color }]}>{k.trend}</Text>
                    </View>
                    <MaterialIcons name={k.icon as any} size={24} color={k.color} />
                  </View>
                  <Text style={[styles.kpiVal, { color: k.color }]}>{k.value}</Text>
                  <Text style={styles.kpiLabel}>{k.label}</Text>
                </View>
              ))}
            </View>

            {/* Revenue Chart */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderSub}>آخر 7 أيام</Text>
                <Text style={styles.cardTitle}>إيرادات الأسبوع</Text>
                <View style={styles.cardHeaderIcon}>
                  <MaterialIcons name="bar-chart" size={16} color={Colors.primary} />
                </View>
              </View>
              <RevenueChart data={weeklyRevenue} />
              <View style={styles.chartFooter}>
                <Text style={[styles.chartFooterVal, { color: Colors.success }]}>+21% من الأسبوع الماضي</Text>
                <Text style={styles.chartFooterTotal}>الإجمالي: 45,680 ج</Text>
              </View>
            </View>

            {/* Rides Chart */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderSub}>آخر 7 أيام</Text>
                <Text style={styles.cardTitle}>الرحلات اليومية</Text>
                <View style={[styles.cardHeaderIcon, { backgroundColor: Colors.successSurface }]}>
                  <MaterialIcons name="directions-car" size={16} color={Colors.success} />
                </View>
              </View>
              <RevenueChart data={weeklyRides} />
              <View style={styles.chartFooter}>
                <Text style={[styles.chartFooterVal, { color: Colors.success }]}>+8% من الأسبوع الماضي</Text>
                <Text style={styles.chartFooterTotal}>الإجمالي: 4,230 رحلة</Text>
              </View>
            </View>

            {/* Top Marketers */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderIcon}>
                  <MaterialIcons name="emoji-events" size={16} color={Colors.warning} />
                </View>
                <Text style={styles.cardTitle}>أفضل المسوقين</Text>
              </View>
              {topMarketers.map(m => (
                <View key={m.rank} style={styles.marketerRow}>
                  <Text style={[styles.marketerEarnings, { color: Colors.success }]}>{m.earnings} ج</Text>
                  <View style={styles.marketerInfo}>
                    <Text style={styles.marketerName}>{m.name}</Text>
                    <Text style={styles.marketerReferrals}>{m.referrals} إحالة · {m.level}</Text>
                  </View>
                  <View style={styles.marketerRankWrap}>
                    <Image source={{ uri: m.avatar }} style={styles.marketerAvatar} contentFit="cover" />
                    <View style={[styles.rankBadge, { backgroundColor: m.rank === 1 ? Colors.warning : m.rank === 2 ? '#C0C0C0' : '#CD7F32' }]}>
                      <Text style={styles.rankText}>{m.rank}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ══════════════════════════════════════════════════════
            USERS TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <>
            {/* Stats row */}
            <View style={styles.userStatsRow}>
              {[
                { label: 'نشطون', value: '8,234', color: Colors.success, icon: 'check-circle' },
                { label: 'جدد هذا الأسبوع', value: '+342', color: Colors.primary, icon: 'person-add' },
                { label: 'محجوبون', value: '23', color: Colors.error, icon: 'block' },
                { label: 'السائقون', value: '489', color: '#9B59B6', icon: 'badge' },
              ].map(s => (
                <View key={s.label} style={[styles.userStatCard, { borderColor: s.color + '30' }]}>
                  <MaterialIcons name={s.icon as any} size={18} color={s.color} />
                  <Text style={[styles.userStatVal, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.userStatLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Users List */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderIcon}>
                  <MaterialIcons name="people" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.cardTitle}>المستخدمون</Text>
              </View>
              {users.map((u, i) => (
                <View key={u.id} style={[styles.userRow, i < users.length - 1 && styles.rowDivider]}>
                  {/* Actions */}
                  <View style={styles.userActions}>
                    {u.status === 'active' ? (
                      <Pressable
                        style={[styles.userActionBtn, { backgroundColor: Colors.errorSurface }]}
                        onPress={() => handleUserAction(u.id, 'ban')}
                      >
                        <MaterialIcons name="block" size={14} color={Colors.error} />
                      </Pressable>
                    ) : (
                      <Pressable
                        style={[styles.userActionBtn, { backgroundColor: Colors.successSurface }]}
                        onPress={() => handleUserAction(u.id, 'unban')}
                      >
                        <MaterialIcons name="check-circle" size={14} color={Colors.success} />
                      </Pressable>
                    )}
                    {!u.verified && (
                      <Pressable
                        style={[styles.userActionBtn, { backgroundColor: Colors.primarySurface }]}
                        onPress={() => handleUserAction(u.id, 'verify')}
                      >
                        <MaterialIcons name="verified" size={14} color={Colors.primary} />
                      </Pressable>
                    )}
                  </View>

                  {/* Info */}
                  <View style={styles.userInfo}>
                    <View style={styles.userNameRow}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: u.status === 'active' ? Colors.success : Colors.error }
                      ]} />
                      <Text style={styles.userName}>{u.name}</Text>
                      {u.verified && <MaterialIcons name="verified" size={13} color={Colors.primary} />}
                    </View>
                    <Text style={styles.userPhone}>{u.phone}</Text>
                    <View style={styles.userMeta}>
                      <View style={[
                        styles.roleTag,
                        { backgroundColor: u.role === 'driver' ? '#2A1B3D' : Colors.primarySurface }
                      ]}>
                        <Text style={[styles.roleText, { color: u.role === 'driver' ? '#9B59B6' : Colors.primary }]}>
                          {u.role === 'driver' ? 'سائق' : 'مستخدم'}
                        </Text>
                      </View>
                      <Text style={styles.userRides}>{u.rides} رحلة</Text>
                    </View>
                  </View>

                  <Image source={{ uri: u.avatar }} style={styles.userAvatar} contentFit="cover" />
                </View>
              ))}
            </View>
          </>
        )}

        {/* ══════════════════════════════════════════════════════
            WITHDRAWALS TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'withdrawals' && (
          <>
            {/* Stats */}
            <View style={styles.withdrawStatsRow}>
              {[
                { label: 'قيد المراجعة', value: withdrawals.filter(w => w.status === 'pending').length, color: Colors.warning },
                { label: 'موافق عليها', value: withdrawals.filter(w => w.status === 'approved').length, color: '#3D9BFF' },
                { label: 'مكتملة', value: withdrawals.filter(w => w.status === 'transferred').length, color: Colors.success },
                { label: 'مرفوضة', value: withdrawals.filter(w => w.status === 'rejected').length, color: Colors.error },
              ].map(s => (
                <View key={s.label} style={[styles.wdStatCard, { borderColor: s.color + '40' }]}>
                  <Text style={[styles.wdStatVal, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.wdStatLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Withdrawals List */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderIcon}>
                  <MaterialIcons name="account-balance" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.cardTitle}>قائمة طلبات السحب</Text>
              </View>

              {withdrawals.map((w, i) => {
                const sc = withdrawalStatusConfig[w.status] || withdrawalStatusConfig.pending;
                const isPending = w.status === 'pending';
                return (
                  <View key={w.id} style={[styles.wdCard, i < withdrawals.length - 1 && styles.rowDivider]}>
                    {/* Top row */}
                    <View style={styles.wdTopRow}>
                      <View style={[styles.wdStatusBadge, { backgroundColor: sc.bg }]}>
                        <Text style={[styles.wdStatusText, { color: sc.color }]}>{sc.label}</Text>
                      </View>
                      <View style={styles.wdUserRow}>
                        <Text style={styles.wdUserName}>{w.user}</Text>
                        <Image source={{ uri: w.avatar }} style={styles.wdAvatar} contentFit="cover" />
                      </View>
                    </View>

                    {/* Details */}
                    <View style={styles.wdDetails}>
                      <View style={styles.wdDetailItem}>
                        <Text style={styles.wdDetailLabel}>المبلغ</Text>
                        <Text style={styles.wdDetailVal}>{w.amount} ج</Text>
                      </View>
                      <View style={styles.wdDetailDivider} />
                      <View style={styles.wdDetailItem}>
                        <Text style={styles.wdDetailLabel}>الرسوم</Text>
                        <Text style={[styles.wdDetailVal, { color: Colors.error }]}>{w.fee} ج</Text>
                      </View>
                      <View style={styles.wdDetailDivider} />
                      <View style={styles.wdDetailItem}>
                        <Text style={styles.wdDetailLabel}>الصافي</Text>
                        <Text style={[styles.wdDetailVal, { color: Colors.success }]}>{w.net} ج</Text>
                      </View>
                    </View>

                    {/* Method + date */}
                    <View style={styles.wdMeta}>
                      <Text style={styles.wdDate}>{w.date}</Text>
                      <View style={styles.wdMethodBadge}>
                        <MaterialIcons name="account-balance-wallet" size={12} color={Colors.primary} />
                        <Text style={styles.wdMethod}>{w.method} · {w.phone}</Text>
                      </View>
                    </View>

                    {/* Action Buttons (only for pending) */}
                    {isPending && (
                      <View style={styles.wdActionRow}>
                        <Pressable
                          style={styles.wdRejectBtn}
                          onPress={() => handleWithdrawalAction(w.id, 'reject')}
                        >
                          <MaterialIcons name="close" size={15} color={Colors.error} />
                          <Text style={styles.wdRejectText}>رفض</Text>
                        </Pressable>
                        <Pressable
                          style={styles.wdApproveBtn}
                          onPress={() => handleWithdrawalAction(w.id, 'approve')}
                        >
                          <MaterialIcons name="check" size={15} color={Colors.textInverse} />
                          <Text style={styles.wdApproveText}>موافقة</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* ══════════════════════════════════════════════════════
            TUKTALK TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'tuktalk' && (
          <>
            {/* TukTalk Stats */}
            <View style={styles.talkStatsRow}>
              {[
                { label: 'المنشورات', value: '4,231', color: Colors.primary, icon: 'article' },
                { label: 'القصص', value: '892', color: Colors.warning, icon: 'auto-stories' },
                { label: 'البلاغات', value: mockReports.length, color: Colors.error, icon: 'report' },
                { label: 'محجوب', value: '12', color: Colors.textTertiary, icon: 'visibility-off' },
              ].map(s => (
                <View key={s.label} style={[styles.talkStatCard, { borderColor: s.color + '30' }]}>
                  <MaterialIcons name={s.icon as any} size={20} color={s.color} />
                  <Text style={[styles.talkStatVal, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.talkStatLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Reports */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: Colors.errorSurface }]}>
                  <MaterialIcons name="report" size={16} color={Colors.error} />
                </View>
                <Text style={styles.cardTitle}>بلاغات المحتوى</Text>
              </View>

              {mockReports.map((r, i) => (
                <View key={r.id} style={[styles.reportCard, i < mockReports.length - 1 && styles.rowDivider, { borderRightColor: r.severity === 'high' ? Colors.error : Colors.warning }]}>
                  <View style={styles.reportActions}>
                    <Pressable style={[styles.reportActionBtn, { backgroundColor: Colors.successSurface }]}>
                      <MaterialIcons name="check" size={14} color={Colors.success} />
                    </Pressable>
                    <Pressable style={[styles.reportActionBtn, { backgroundColor: Colors.errorSurface }]}>
                      <MaterialIcons name="delete" size={14} color={Colors.error} />
                    </Pressable>
                  </View>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportText}>{r.text}</Text>
                    <View style={styles.reportMeta}>
                      <Text style={styles.reportTime}>{r.time}</Text>
                      <Text style={styles.reportUser}>{r.user}</Text>
                      <View style={[
                        styles.reportTypeBadge,
                        { backgroundColor: r.type === 'post' ? Colors.primarySurface : r.type === 'driver' ? Colors.errorSurface : Colors.warningSurface }
                      ]}>
                        <Text style={[
                          styles.reportTypeText,
                          { color: r.type === 'post' ? Colors.primary : r.type === 'driver' ? Colors.error : Colors.warning }
                        ]}>
                          {r.type === 'post' ? 'منشور' : r.type === 'driver' ? 'سائق' : r.type === 'story' ? 'قصة' : 'رسالة'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.severityDot, { backgroundColor: r.severity === 'high' ? Colors.error : Colors.warning }]} />
                </View>
              ))}
            </View>

            {/* Banned Words */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: Colors.warningSurface }]}>
                  <MaterialIcons name="not-interested" size={16} color={Colors.warning} />
                </View>
                <Text style={styles.cardTitle}>الكلمات المحظورة</Text>
              </View>
              <Pressable style={styles.bannedWordAction}>
                <MaterialIcons name="add" size={16} color={Colors.primary} />
                <Text style={styles.bannedWordActionText}>إضافة كلمة محظورة</Text>
              </Pressable>
              <View style={styles.bannedWordsRow}>
                {['محتوى مسيء','إعلانات مزيفة','سبّ وشتم','احتيال','تحرش'].map(w => (
                  <Pressable key={w} style={styles.bannedWordChip}>
                    <MaterialIcons name="close" size={11} color={Colors.error} />
                    <Text style={styles.bannedWordText}>{w}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}

        {/* ══════════════════════════════════════════════════════
            REFERRALS TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'referrals' && (
          <>
            {/* Overall Stats */}
            <View style={styles.refOverallRow}>
              {[
                { label: 'إجمالي الإحالات', value: '2,847', color: Colors.primary, icon: 'people' },
                { label: 'الأرباح المدفوعة', value: '56,940 ج', color: Colors.success, icon: 'payments' },
                { label: 'في الانتظار', value: '12', color: Colors.warning, icon: 'access-time' },
              ].map(s => (
                <View key={s.label} style={[styles.refOverallCard, { borderColor: s.color + '30' }]}>
                  <MaterialIcons name={s.icon as any} size={22} color={s.color} />
                  <Text style={[styles.refOverallVal, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.refOverallLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Levels Editor */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderIcon, { backgroundColor: Colors.warningSurface }]}>
                  <MaterialIcons name="emoji-events" size={16} color={Colors.warning} />
                </View>
                <Text style={styles.cardTitle}>مستويات الإحالة</Text>
              </View>

              {referralLevels.map((lvl, i) => (
                <View key={lvl.level} style={[styles.levelRow, i < referralLevels.length - 1 && styles.rowDivider]}>
                  {/* Edit Actions */}
                  <View style={styles.levelActions}>
                    <Pressable style={[styles.levelEditBtn, { backgroundColor: Colors.primarySurface }]}>
                      <MaterialIcons name="edit" size={13} color={Colors.primary} />
                    </Pressable>
                  </View>

                  {/* Info */}
                  <View style={styles.levelInfo}>
                    <View style={styles.levelHeader}>
                      <View style={[styles.rateTag, { backgroundColor: lvl.color + '20' }]}>
                        <Text style={[styles.rateText, { color: lvl.color }]}>نسبة {lvl.rate}</Text>
                      </View>
                      <Text style={[styles.levelName, { color: lvl.color }]}>{lvl.ar}</Text>
                    </View>
                    <Text style={styles.levelRange}>{lvl.min} – {lvl.max} إحالة</Text>
                    <View style={styles.bonusRow}>
                      <MaterialIcons name="card-giftcard" size={12} color={Colors.primary} />
                      <Text style={styles.bonusText}>مكافأة {lvl.bonus} لكل إحالة</Text>
                    </View>
                  </View>

                  {/* Icon */}
                  <View style={[styles.levelIconWrap, { backgroundColor: lvl.color + '20', borderColor: lvl.color + '40' }]}>
                    <MaterialIcons name={lvl.icon as any} size={28} color={lvl.color} />
                  </View>
                </View>
              ))}
            </View>

            {/* Settings */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderIcon}>
                  <MaterialIcons name="settings" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.cardTitle}>شروط الإحالة</Text>
              </View>
              {[
                { label: 'توثيق رقم الهاتف', icon: 'phone-android', enabled: true },
                { label: 'إكمال رحلة أولى', icon: 'local-taxi', enabled: true },
                { label: 'مرور 7 أيام بدون مخالفات', icon: 'event-available', enabled: true },
                { label: 'السحب التلقائي للأرباح', icon: 'autorenew', enabled: false },
              ].map((s, i, arr) => (
                <View key={s.label} style={[styles.settingRowItem, i < arr.length - 1 && styles.rowDivider]}>
                  <View style={[styles.settingToggle, { backgroundColor: s.enabled ? Colors.primary : Colors.surfaceElevated }]}>
                    <View style={[styles.settingThumb, { left: s.enabled ? 'auto' : 2, right: s.enabled ? 2 : 'auto' as any }]} />
                  </View>
                  <Text style={styles.settingText}>{s.label}</Text>
                  <View style={[styles.cardHeaderIcon, { backgroundColor: Colors.primarySurface }]}>
                    <MaterialIcons name={s.icon as any} size={15} color={Colors.primary} />
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // HEADER
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.bold, color: '#fff' },
  headerSub: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.5)' },
  adminBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,149,0,0.2)', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4,
  },
  adminBadgeText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.warning },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  tabBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    position: 'relative',
  },
  tabBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.semiBold, color: 'rgba(255,255,255,0.55)' },
  tabBadge: {
    backgroundColor: Colors.error, borderRadius: 10, minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
    position: 'absolute', top: -6, right: -6,
    borderWidth: 2, borderColor: '#162550',
  },
  tabBadgeText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold, color: '#fff' },

  // CARDS
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, ...Shadow.sm, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  cardTitle: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  cardHeaderSub: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  cardHeaderIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primarySurface, alignItems: 'center', justifyContent: 'center',
  },

  // KPI
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  kpiCard: {
    width: '48%', borderRadius: Radius.xl, padding: Spacing.base,
    gap: 4, borderWidth: 1, ...Shadow.sm,
  },
  kpiTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kpiBadge: { borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 2 },
  kpiTrend: { fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.bold },
  kpiVal: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.extraBold },
  kpiLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },

  // CHART
  chartFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartFooterTotal: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.primary },
  chartFooterVal: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.semiBold },

  // MARKETER
  marketerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  marketerRankWrap: { position: 'relative' },
  marketerAvatar: { width: 44, height: 44, borderRadius: 22 },
  rankBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.surface,
  },
  rankText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold, color: '#fff' },
  marketerInfo: { flex: 1 },
  marketerName: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  marketerReferrals: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right' },
  marketerEarnings: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, minWidth: 70, textAlign: 'right' },

  rowDivider: { borderBottomWidth: 1, borderBottomColor: Colors.divider },

  // USERS
  userStatsRow: { flexDirection: 'row', gap: Spacing.sm },
  userStatCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.sm,
    alignItems: 'center', gap: 4, borderWidth: 1, ...Shadow.sm,
  },
  userStatVal: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.extraBold },
  userStatLabel: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textTertiary, textAlign: 'center' },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: Spacing.sm },
  userAvatar: { width: 46, height: 46, borderRadius: 23 },
  userInfo: { flex: 1 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'flex-end' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  userName: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary },
  userPhone: { fontFamily: Typography.fontFamily, fontSize: 11, color: Colors.textTertiary, textAlign: 'right' },
  userMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'flex-end' },
  roleTag: { borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 2 },
  roleText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold },
  userRides: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textMuted },
  userActions: { flexDirection: 'row', gap: 6 },
  userActionBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },

  // WITHDRAWALS
  withdrawStatsRow: { flexDirection: 'row', gap: Spacing.sm },
  wdStatCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.sm,
    alignItems: 'center', gap: 4, borderWidth: 1.5, ...Shadow.sm,
  },
  wdStatVal: { fontFamily: Typography.fontFamily, fontSize: Typography.lg, fontWeight: Typography.extraBold },
  wdStatLabel: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textTertiary, textAlign: 'center' },
  wdCard: { paddingVertical: Spacing.md, gap: Spacing.sm },
  wdTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wdUserRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wdAvatar: { width: 36, height: 36, borderRadius: 18 },
  wdUserName: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary },
  wdStatusBadge: { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  wdStatusText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold },
  wdDetails: {
    flexDirection: 'row', gap: 0,
    backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.lg,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.border,
  },
  wdDetailItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: Spacing.sm },
  wdDetailDivider: { width: 1, backgroundColor: Colors.border },
  wdDetailLabel: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textMuted },
  wdDetailVal: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary },
  wdMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wdMethodBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  wdMethod: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textSecondary },
  wdDate: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted },
  wdActionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: 2 },
  wdApproveBtn: {
    flex: 2, backgroundColor: Colors.success, borderRadius: Radius.full,
    paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  wdApproveText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textInverse },
  wdRejectBtn: {
    flex: 1, backgroundColor: Colors.errorSurface, borderRadius: Radius.full,
    paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderColor: Colors.error + '40',
  },
  wdRejectText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.error },

  // TUKTALK
  talkStatsRow: { flexDirection: 'row', gap: Spacing.sm },
  talkStatCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.sm,
    alignItems: 'center', gap: 4, borderWidth: 1, ...Shadow.sm,
  },
  talkStatVal: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.extraBold },
  talkStatLabel: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textTertiary, textAlign: 'center' },
  reportCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    paddingVertical: Spacing.md, borderRightWidth: 3,
  },
  severityDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  reportInfo: { flex: 1 },
  reportText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textPrimary, textAlign: 'right' },
  reportMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginTop: 4 },
  reportUser: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  reportTime: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted },
  reportTypeBadge: { borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 2 },
  reportTypeText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold },
  reportActions: { flexDirection: 'column', gap: 6 },
  reportActionBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  bannedWordAction: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primarySurface, borderRadius: Radius.lg,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.borderGold, alignSelf: 'flex-end',
    borderStyle: 'dashed',
  },
  bannedWordActionText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.primary },
  bannedWordsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bannedWordChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.errorSurface, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: Colors.error + '30',
  },
  bannedWordText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.error, fontWeight: Typography.semiBold },

  // REFERRALS
  refOverallRow: { flexDirection: 'row', gap: Spacing.sm },
  refOverallCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.md, alignItems: 'center', gap: 5, borderWidth: 1, ...Shadow.sm,
  },
  refOverallVal: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.extraBold },
  refOverallLabel: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textTertiary, textAlign: 'center' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: Spacing.md },
  levelIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5,
  },
  levelInfo: { flex: 1, gap: 4 },
  levelHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  levelName: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.extraBold },
  rateTag: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  rateText: { fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.bold },
  levelRange: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right' },
  bonusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'flex-end' },
  bonusText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textSecondary },
  levelActions: { flexDirection: 'column', gap: 6 },
  levelEditBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  settingRowItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  settingToggle: {
    width: 40, height: 22, borderRadius: 11, position: 'relative',
    justifyContent: 'center',
  },
  settingThumb: {
    position: 'absolute', width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#fff', top: 2,
  },
  settingText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textPrimary, textAlign: 'right' },
});
