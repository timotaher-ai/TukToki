// Powered by OnSpace.AI — Admin Panel Screen
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

const adminStats = [
  { label: 'المستخدمون', value: '12,847', icon: 'people', color: Colors.primary, bg: Colors.primarySurface },
  { label: 'الرحلات اليوم', value: '1,234', icon: 'directions-car', color: Colors.success, bg: Colors.successSurface },
  { label: 'الإيرادات', value: '45,680 ج', icon: 'attach-money', color: Colors.warning, bg: Colors.warningSurface },
  { label: 'السائقون', value: '489', icon: 'badge', color: '#9B59B6', bg: '#F5EEF8' },
];

const mediaSettings = [
  { label: 'حجم الصور', value: '10 MB', icon: 'image', editable: true },
  { label: 'حجم الفيديو', value: '100 MB', icon: 'videocam', editable: true },
  { label: 'عدد الملفات بالمنشور', value: '5', icon: 'attach-file', editable: true },
  { label: 'الفيديو في المنشورات', value: 'مفعّل', icon: 'play-circle', toggle: true, enabled: true },
  { label: 'الصور في المنشورات', value: 'مفعّل', icon: 'photo-library', toggle: true, enabled: true },
];

const activeRides = [
  { id: 'R001', user: 'أحمد محمد', driver: 'خالد أمين', from: 'مدينة نصر', to: 'المعادي', status: 'جارية' },
  { id: 'R002', user: 'سارة علي', driver: 'محمود حسن', from: 'الزمالك', to: 'مصر الجديدة', status: 'في الطريق' },
  { id: 'R003', user: 'عمر يوسف', driver: 'أحمد طارق', from: 'التجمع', to: 'وسط البلد', status: 'جارية' },
];

export default function AdminPanelScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'overview' | 'rides' | 'media' | 'users'>('overview');

  const sections = [
    { id: 'overview', label: 'نظرة عامة', icon: 'dashboard' },
    { id: 'rides', label: 'الرحلات', icon: 'directions-car' },
    { id: 'media', label: 'الوسائط', icon: 'perm-media' },
    { id: 'users', label: 'المستخدمون', icon: 'people' },
  ] as const;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0D1B3E', Colors.primaryDark]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="arrow-forward" size={24} color="#fff" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>لوحة التحكم</Text>
            <Text style={styles.headerSub}>Admin Panel</Text>
          </View>
          <View style={styles.adminBadge}>
            <MaterialIcons name="admin-panel-settings" size={16} color={Colors.warning} />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 8 }}>
          {sections.map(sec => (
            <Pressable
              key={sec.id}
              style={[styles.tabBtn, activeSection === sec.id && styles.tabBtnActive]}
              onPress={() => setActiveSection(sec.id)}
            >
              <MaterialIcons name={sec.icon as any} size={16} color={activeSection === sec.id ? '#fff' : 'rgba(255,255,255,0.6)'} />
              <Text style={[styles.tabBtnText, activeSection === sec.id && { color: '#fff' }]}>{sec.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.base, gap: Spacing.base }}>

        {/* Overview */}
        {activeSection === 'overview' && (
          <>
            <View style={styles.statsGrid}>
              {adminStats.map(stat => (
                <View key={stat.label} style={[styles.statCard, { backgroundColor: stat.bg }]}>
                  <MaterialIcons name={stat.icon as any} size={28} color={stat.color} />
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Revenue Chart Placeholder */}
            <View style={styles.chartCard}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="bar-chart" size={18} color={Colors.primary} />
                <Text style={styles.sectionTitle}>إيرادات هذا الأسبوع</Text>
              </View>
              <View style={styles.chartPlaceholder}>
                {[60, 80, 45, 90, 70, 85, 100].map((h, i) => (
                  <View key={i} style={styles.barWrap}>
                    <View style={[styles.bar, { height: h * 0.8, backgroundColor: i === 6 ? Colors.primary : Colors.primarySurface }]} />
                    <Text style={styles.barLabel}>{'أحدسبإثأج'.split('')[i]}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.chartTotal}>الإجمالي: 45,680 جنيه</Text>
            </View>
          </>
        )}

        {/* Rides */}
        {activeSection === 'rides' && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>{activeRides.length} رحلة نشطة</Text>
              </View>
              <Text style={styles.sectionTitle}>الرحلات الجارية</Text>
            </View>
            {activeRides.map(ride => (
              <View key={ride.id} style={styles.rideAdminCard}>
                <View style={styles.rideAdminRight}>
                  <Text style={styles.rideAdminId}>{ride.id}</Text>
                  <View style={styles.rideStatusBadge}>
                    <Text style={styles.rideStatusText}>{ride.status}</Text>
                  </View>
                </View>
                <View style={styles.rideAdminInfo}>
                  <Text style={styles.rideAdminUser}>{ride.user}</Text>
                  <Text style={styles.rideAdminDriver}>السائق: {ride.driver}</Text>
                  <Text style={styles.rideAdminRoute}>{ride.from} ← {ride.to}</Text>
                </View>
                <Pressable style={styles.rideAdminAction}>
                  <MaterialIcons name="cancel" size={20} color={Colors.error} />
                </Pressable>
              </View>
            ))}
          </>
        )}

        {/* Media Settings */}
        {activeSection === 'media' && (
          <>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="settings" size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>إعدادات المحتوى</Text>
            </View>
            <View style={styles.settingsCard}>
              {mediaSettings.map((setting, i) => (
                <View key={i} style={[styles.settingRow, i < mediaSettings.length - 1 && styles.settingDivider]}>
                  <View style={styles.settingRight}>
                    <Text style={styles.settingValue}>{setting.value}</Text>
                    {setting.editable && (
                      <Pressable style={styles.editBtn}>
                        <MaterialIcons name="edit" size={14} color={Colors.primary} />
                      </Pressable>
                    )}
                  </View>
                  <Text style={styles.settingLabel}>{setting.label}</Text>
                  <View style={styles.settingIcon}>
                    <MaterialIcons name={setting.icon as any} size={18} color={Colors.primary} />
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Users */}
        {activeSection === 'users' && (
          <>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="people" size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>إدارة المستخدمين</Text>
            </View>
            <View style={styles.userStatsRow}>
              {[
                { label: 'نشطون', value: '8,234', color: Colors.success },
                { label: 'جدد هذا الأسبوع', value: '+342', color: Colors.primary },
                { label: 'محجوبون', value: '23', color: Colors.error },
              ].map(stat => (
                <View key={stat.label} style={styles.userStatCard}>
                  <Text style={[styles.userStatValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.userStatLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.adminActionsList}>
              {[
                { icon: 'search', label: 'البحث عن مستخدم' },
                { icon: 'block', label: 'إدارة المحجوبين' },
                { icon: 'verified-user', label: 'طلبات التحقق' },
                { icon: 'report', label: 'البلاغات والشكاوى' },
              ].map(action => (
                <Pressable key={action.label} style={styles.adminActionItem}>
                  <MaterialIcons name="chevron-left" size={20} color={Colors.textTertiary} />
                  <Text style={styles.adminActionLabel}>{action.label}</Text>
                  <View style={styles.adminActionIcon}>
                    <MaterialIcons name={action.icon as any} size={18} color={Colors.primary} />
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  headerSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.6)',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,149,0,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  adminBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.warning,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tabBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: 'rgba(255,255,255,0.6)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    width: '48%',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.extraBold,
  },
  statLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  chartPlaceholder: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    paddingTop: 8,
  },
  barWrap: { alignItems: 'center', gap: 4, flex: 1 },
  bar: { width: '70%', borderRadius: 4, minHeight: 4 },
  barLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.textTertiary,
  },
  chartTotal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.primary,
    textAlign: 'right',
  },
  activeBadge: {
    backgroundColor: Colors.successSurface,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.success,
  },
  rideAdminCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadow.sm,
  },
  rideAdminRight: { alignItems: 'center', gap: 6 },
  rideAdminId: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  rideStatusBadge: {
    backgroundColor: Colors.successSurface,
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rideStatusText: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    fontWeight: Typography.semiBold,
    color: Colors.success,
  },
  rideAdminInfo: { flex: 1 },
  rideAdminUser: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  rideAdminDriver: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  rideAdminRoute: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
  rideAdminAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.errorSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: 12,
  },
  settingDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  editBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userStatsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  userStatCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    ...Shadow.sm,
  },
  userStatValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.extraBold,
  },
  userStatLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  adminActionsList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  adminActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 12,
  },
  adminActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminActionLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
});
