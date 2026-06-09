// Powered by OnSpace.AI — Family Screen (Dark Premium Redesign)
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import FamilyMapView from '@/components/FamilyMapView';
import { StatusBar } from 'expo-status-bar';

type FamilyTab = 'map' | 'members' | 'alerts';

const HOME_LOCATION = { latitude: 30.0444, longitude: 31.2357 };

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  in_ride: { label: 'في رحلة',    color: Colors.primary,      bg: Colors.primarySurface, icon: 'local-taxi' },
  online:  { label: 'متصل',       color: Colors.success,      bg: Colors.successSurface, icon: 'circle' },
  offline: { label: 'غير متصل',  color: Colors.textTertiary, bg: Colors.surfaceSecondary, icon: 'remove-circle-outline' },
};

const mockAlerts = [
  { id: 'a1', member: 'مريم أحمد',  type: 'exit',  zone: 'المدرسة',   time: 'الآن',          color: Colors.error },
  { id: 'a2', member: 'عمر أحمد',   type: 'enter', zone: 'المنزل',    time: 'منذ 30 دقيقة',  color: Colors.success },
  { id: 'a3', member: 'مريم أحمد',  type: 'ride',  zone: 'رحلة جديدة', time: 'منذ ساعة',      color: Colors.primary },
  { id: 'a4', member: 'نور أحمد',   type: 'enter', zone: 'المنزل',    time: 'منذ 2 ساعة',    color: Colors.success },
];

const TABS: { id: FamilyTab; label: string; icon: string }[] = [
  { id: 'map',     label: 'الخريطة',   icon: 'map' },
  { id: 'members', label: 'الأفراد',   icon: 'people' },
  { id: 'alerts',  label: 'التنبيهات', icon: 'notifications' },
];

export default function FamilyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { familyMembers, updateFamilyPermission } = useApp();
  const mapRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<FamilyTab>('map');

  const onlineCount  = familyMembers.filter(m => m.status !== 'offline').length;
  const inRideCount  = familyMembers.filter(m => m.status === 'in_ride').length;
  const alertCount   = mockAlerts.filter(a => a.type === 'exit').length;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* ── Header ──────────────────────────────────────────── */}
      <LinearGradient
        colors={['#1A1B22', '#23242E']}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        {/* Top row */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.push('/add-family-member')} style={styles.addBtn}>
            <MaterialIcons name="person-add" size={16} color={Colors.primary} />
            <Text style={styles.addBtnText}>إضافة</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>مراقبة الأسرة</Text>
            <Text style={styles.headerSub}>Family Control</Text>
          </View>

          <Pressable onPress={() => router.push('/geofencing')} style={styles.fenceBtn}>
            <MaterialIcons name="fence" size={16} color={Colors.primary} />
            <Text style={styles.fenceBtnText}>المناطق</Text>
          </Pressable>
        </View>

        {/* Stats Row */}
        <View style={styles.statsStrip}>
          {[
            { value: familyMembers.length, label: 'الأفراد',   color: Colors.textPrimary },
            { value: onlineCount,           label: 'متصل',      color: Colors.success },
            { value: inRideCount,           label: 'في رحلة',   color: Colors.primary },
            { value: alertCount,            label: 'تنبيهات',   color: Colors.error },
          ].map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={styles.statsDivider} />}
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Tab Row */}
        <View style={styles.tabRow}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <MaterialIcons
                  name={tab.icon as any}
                  size={14}
                  color={isActive ? Colors.textInverse : Colors.textTertiary}
                />
                <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                  {tab.label}
                </Text>
                {tab.id === 'alerts' && alertCount > 0 && (
                  <View style={styles.alertCountBadge}>
                    <Text style={styles.alertCountText}>{alertCount}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </LinearGradient>

      {/* ── MAP TAB ─────────────────────────────────────────── */}
      {activeTab === 'map' && (
        <View style={styles.mapContainer}>
          <FamilyMapView
            mapRef={mapRef}
            members={familyMembers}
            homeLocation={HOME_LOCATION}
            geofenceRadius={400}
            showGeofence
          />

          {/* Dark Legend */}
          <View style={styles.mapLegend}>
            {[
              { color: Colors.primary, label: 'في رحلة' },
              { color: Colors.success, label: 'متصل' },
              { color: Colors.textTertiary, label: 'غير متصل' },
            ].map(item => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Member Chips */}
          <View style={styles.memberChipsWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: Spacing.base }}>
              {familyMembers.map(member => {
                const status = statusConfig[member.status];
                return (
                  <Pressable
                    key={member.id}
                    style={styles.memberChip}
                    onPress={() => router.push({ pathname: '/family-member', params: { id: member.id } })}
                  >
                    <View style={styles.memberChipAvatarWrap}>
                      <Image source={{ uri: member.avatar }} style={styles.memberChipAvatar} contentFit="cover" />
                      <View style={[styles.memberChipOnlineDot, { backgroundColor: status.color }]} />
                    </View>
                    <View style={styles.memberChipInfo}>
                      <Text style={styles.memberChipName}>{member.name.split(' ')[0]}</Text>
                      <View style={[styles.memberChipBadge, { backgroundColor: status.bg }]}>
                        <MaterialIcons name={status.icon as any} size={9} color={status.color} />
                        <Text style={[styles.memberChipBadgeText, { color: status.color }]}>{status.label}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Geofence CTA */}
          <Pressable style={styles.geofenceCTA} onPress={() => router.push('/geofencing')}>
            <MaterialIcons name="fence" size={16} color={Colors.textInverse} />
            <Text style={styles.geofenceCTAText}>إدارة المناطق المسموحة</Text>
            <MaterialIcons name="arrow-back" size={14} color={Colors.textInverse} />
          </Pressable>
        </View>
      )}

      {/* ── MEMBERS TAB ─────────────────────────────────────── */}
      {activeTab === 'members' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.base, gap: Spacing.md, paddingBottom: 30 }}>
          {familyMembers.map(member => {
            const status = statusConfig[member.status];
            return (
              <View key={member.id} style={styles.memberCard}>
                {/* Card top */}
                <Pressable
                  style={styles.memberCardTop}
                  onPress={() => router.push({ pathname: '/family-member', params: { id: member.id } })}
                >
                  {/* Avatar + status */}
                  <View style={styles.memberAvatarWrap}>
                    <Image source={{ uri: member.avatar }} style={styles.memberAvatar} contentFit="cover" />
                    <View style={[styles.memberStatusRing, { borderColor: status.color }]}>
                      <View style={[styles.memberStatusDot, { backgroundColor: status.color }]} />
                    </View>
                  </View>

                  {/* Info */}
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={styles.memberMetaRow}>
                      <View style={[styles.memberStatusBadge, { backgroundColor: status.bg }]}>
                        <MaterialIcons name={status.icon as any} size={11} color={status.color} />
                        <Text style={[styles.memberStatusText, { color: status.color }]}>{status.label}</Text>
                      </View>
                      <Text style={styles.memberAge}>{member.age} سنة · {member.gender}</Text>
                    </View>
                    <Text style={styles.memberLastSeen}>{member.lastSeen}</Text>
                  </View>

                  <View style={styles.memberCardArrow}>
                    <MaterialIcons name="chevron-left" size={20} color={Colors.textTertiary} />
                  </View>
                </Pressable>

                {/* Permissions */}
                <View style={styles.memberPerms}>
                  <View style={styles.permsRow}>
                    <View style={styles.permItem}>
                      <Switch
                        value={member.permissions.canBook}
                        onValueChange={(val) => updateFamilyPermission(member.id, 'canBook', val)}
                        trackColor={{ false: Colors.surfaceElevated, true: Colors.primary }}
                        thumbColor="#fff"
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                      />
                      <MaterialIcons name="local-taxi" size={14} color={Colors.textTertiary} />
                      <Text style={styles.permLabel}>حجز رحلات</Text>
                    </View>
                    <View style={styles.permItem}>
                      <Switch
                        value={member.permissions.canPay}
                        onValueChange={(val) => updateFamilyPermission(member.id, 'canPay', val)}
                        trackColor={{ false: Colors.surfaceElevated, true: Colors.primary }}
                        thumbColor="#fff"
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                      />
                      <MaterialIcons name="credit-card" size={14} color={Colors.textTertiary} />
                      <Text style={styles.permLabel}>الدفع</Text>
                    </View>
                  </View>

                  <View style={styles.timeRow}>
                    <Pressable style={styles.geofenceSmallBtn} onPress={() => router.push('/geofencing')}>
                      <MaterialIcons name="fence" size={13} color={Colors.primary} />
                      <Text style={styles.geofenceSmallText}>المناطق</Text>
                    </Pressable>
                    <View style={styles.timeBadge}>
                      <MaterialIcons name="access-time" size={13} color={Colors.primary} />
                      <Text style={styles.timeValue}>{member.permissions.timeLimit}</Text>
                    </View>
                    <Text style={styles.timeLabel}>حد الاستخدام</Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* SOS Panel */}
          <View style={styles.sosPanel}>
            <View style={styles.sosPanelLeft}>
              <Pressable style={styles.sosPanelBtn}>
                <Text style={styles.sosPanelBtnText}>إعداد</Text>
              </Pressable>
            </View>
            <View style={styles.sosPanelInfo}>
              <Text style={styles.sosPanelTitle}>زر الطوارئ SOS</Text>
              <Text style={styles.sosPanelDesc}>يُرسل الموقع الحالي فوراً لولي الأمر</Text>
            </View>
            <View style={[styles.sosPanelIcon, { backgroundColor: Colors.errorSurface }]}>
              <MaterialIcons name="emergency" size={24} color={Colors.error} />
            </View>
          </View>
        </ScrollView>
      )}

      {/* ── ALERTS TAB ──────────────────────────────────────── */}
      {activeTab === 'alerts' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.base, gap: Spacing.sm, paddingBottom: 30 }}>
          <View style={styles.alertsHeader}>
            <View style={styles.alertsCountBadge}>
              <Text style={styles.alertsCountText}>{mockAlerts.length}</Text>
            </View>
            <Text style={styles.alertsTitle}>التنبيهات الأخيرة</Text>
          </View>

          {mockAlerts.map(alert => (
            <View key={alert.id} style={[styles.alertCard, { borderRightColor: alert.color }]}>
              <View style={styles.alertLeft}>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
              <View style={styles.alertInfo}>
                <Text style={styles.alertMember}>{alert.member}</Text>
                <Text style={styles.alertDesc}>
                  {alert.type === 'exit'  ? `خرجت من منطقة "${alert.zone}"` :
                   alert.type === 'enter' ? `دخلت منطقة "${alert.zone}"` :
                   `بدأت ${alert.zone}`}
                </Text>
              </View>
              <View style={[styles.alertIconWrap, { backgroundColor: alert.color + '20' }]}>
                <MaterialIcons
                  name={alert.type === 'exit' ? 'exit-to-app' : alert.type === 'enter' ? 'login' : 'local-taxi'}
                  size={20}
                  color={alert.color}
                />
              </View>
            </View>
          ))}

          <Pressable style={styles.geofenceFullBtn} onPress={() => router.push('/geofencing')}>
            <MaterialIcons name="arrow-back" size={16} color={Colors.textInverse} />
            <Text style={styles.geofenceFullBtnText}>إدارة المناطق والجيوفنسينج</Text>
            <MaterialIcons name="fence" size={18} color={Colors.textInverse} />
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // HEADER
  header: {
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerCenter: { alignItems: 'center' },
  headerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  headerSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textTertiary,
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  addBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.semiBold },
  fenceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.border,
  },
  fenceBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.semiBold },

  // STATS STRIP
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl, padding: Spacing.md,
    justifyContent: 'space-around',
    borderWidth: 1, borderColor: Colors.border,
  },
  statItem: { alignItems: 'center', gap: 3 },
  statNum: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.extraBold,
  },
  statLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  statsDivider: { width: 1, backgroundColor: Colors.border },

  // TAB ROW
  tabRow: { flexDirection: 'row', gap: 6 },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 10, borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1, borderColor: Colors.border,
    position: 'relative',
  },
  tabBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary, ...Shadow.goldenSm },
  tabBtnText: { fontFamily: Typography.fontFamily, fontSize: 11, fontWeight: Typography.semiBold, color: Colors.textTertiary },
  tabBtnTextActive: { color: Colors.textInverse },
  alertCountBadge: {
    position: 'absolute', top: -5, right: -5,
    backgroundColor: Colors.error, borderRadius: 999,
    minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3, borderWidth: 2, borderColor: Colors.background,
  },
  alertCountText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold, color: '#fff' },

  // MAP
  mapContainer: { flex: 1, position: 'relative' },
  mapLegend: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.sm, gap: 5,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.md,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textSecondary },
  memberChipsWrap: { position: 'absolute', bottom: 80, left: 0, right: 0, paddingVertical: 6 },
  memberChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.sm,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    minWidth: 100, ...Shadow.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  memberChipAvatarWrap: { position: 'relative' },
  memberChipAvatar: { width: 40, height: 40, borderRadius: 20 },
  memberChipOnlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 11, height: 11, borderRadius: 6,
    borderWidth: 2, borderColor: Colors.surface,
  },
  memberChipInfo: { gap: 2 },
  memberChipName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  memberChipBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2,
  },
  memberChipBadgeText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold },
  geofenceCTA: {
    position: 'absolute', bottom: 16, left: Spacing.base, right: Spacing.base,
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 13, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, ...Shadow.golden,
  },
  geofenceCTAText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textInverse,
  },

  // MEMBERS
  memberCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl, overflow: 'hidden',
    ...Shadow.sm, borderWidth: 1, borderColor: Colors.border,
  },
  memberCardTop: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.base, gap: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  memberAvatarWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  memberAvatar: { width: 52, height: 52, borderRadius: 26 },
  memberStatusRing: {
    position: 'absolute', bottom: -2, right: -2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2,
  },
  memberStatusDot: { width: 8, height: 8, borderRadius: 4 },
  memberInfo: { flex: 1, gap: 3 },
  memberName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  memberMetaRow: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'flex-end' },
  memberStatusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  memberStatusText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.semiBold },
  memberAge: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  memberLastSeen: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted, textAlign: 'right' },
  memberCardArrow: { paddingLeft: 4 },
  memberPerms: { padding: Spacing.md, gap: 10 },
  permsRow: { flexDirection: 'row', gap: 8 },
  permItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    gap: 5, justifyContent: 'flex-end',
    backgroundColor: Colors.background, borderRadius: Radius.lg,
    paddingHorizontal: 10, paddingVertical: 8,
  },
  permLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textSecondary },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  timeLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right',
  },
  timeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primarySurface, borderRadius: Radius.sm,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  timeValue: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.primary },
  geofenceSmallBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primarySurface, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  geofenceSmallText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.semiBold },
  sosPanel: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, flexDirection: 'row', alignItems: 'center',
    gap: 12, borderWidth: 1, borderColor: 'rgba(255,75,75,0.2)',
    ...Shadow.sm,
  },
  sosPanelIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  sosPanelInfo: { flex: 1 },
  sosPanelTitle: {
    fontFamily: Typography.fontFamily, fontSize: Typography.base,
    fontWeight: Typography.bold, color: Colors.error, textAlign: 'right',
  },
  sosPanelDesc: {
    fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textSecondary, textAlign: 'right',
  },
  sosPanelLeft: {},
  sosPanelBtn: {
    backgroundColor: Colors.error, borderRadius: Radius.full,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  sosPanelBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: '#fff' },

  // ALERTS
  alertsHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-end' },
  alertsTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  alertsCountBadge: {
    backgroundColor: Colors.error, borderRadius: Radius.full,
    minWidth: 24, height: 24, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5,
  },
  alertsCountText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold, color: '#fff' },
  alertCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: 12, borderRightWidth: 4,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.sm,
  },
  alertIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  alertInfo: { flex: 1 },
  alertMember: {
    fontFamily: Typography.fontFamily, fontSize: Typography.base,
    fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right',
  },
  alertDesc: {
    fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'right',
  },
  alertLeft: { alignItems: 'flex-end' },
  alertTime: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  geofenceFullBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 14, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, ...Shadow.golden, marginTop: Spacing.sm,
  },
  geofenceFullBtnText: {
    fontFamily: Typography.fontFamily, fontSize: Typography.base,
    fontWeight: Typography.bold, color: Colors.textInverse,
  },
});
