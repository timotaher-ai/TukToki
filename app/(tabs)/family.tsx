// Powered by OnSpace.AI — Family Screen (Enhanced with Real Map)
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

type FamilyTab = 'map' | 'members' | 'alerts';

const HOME_LOCATION = { latitude: 30.0444, longitude: 31.2357 };

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  in_ride: { label: 'في رحلة', color: Colors.primary, bg: Colors.primarySurface, icon: 'directions-car' },
  online:  { label: 'متصل',   color: Colors.success,  bg: Colors.successSurface,  icon: 'circle' },
  offline: { label: 'غير متصل', color: Colors.textTertiary, bg: Colors.background, icon: 'remove-circle' },
};

const mockAlerts = [
  { id: 'a1', member: 'مريم أحمد', type: 'exit', zone: 'المدرسة', time: 'الآن', color: Colors.error },
  { id: 'a2', member: 'عمر أحمد',  type: 'enter', zone: 'المنزل', time: 'منذ 30 دقيقة', color: Colors.success },
  { id: 'a3', member: 'مريم أحمد', type: 'ride',  zone: 'رحلة جديدة', time: 'منذ ساعة', color: Colors.primary },
];

export default function FamilyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { familyMembers, updateFamilyPermission } = useApp();
  const mapRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<FamilyTab>('map');

  const onlineCount = familyMembers.filter(m => m.status !== 'offline').length;
  const inRideCount = familyMembers.filter(m => m.status === 'in_ride').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.secondaryDark, Colors.secondary]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.push('/add-family-member')} style={styles.addBtn}>
            <MaterialIcons name="person-add" size={18} color="#fff" />
            <Text style={styles.addBtnText}>إضافة</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>الأسرة</Text>
            <Text style={styles.headerSub}>Family Control</Text>
          </View>
          <Pressable onPress={() => router.push('/geofencing')} style={styles.fenceBtn}>
            <MaterialIcons name="fence" size={18} color={Colors.primary} />
            <Text style={styles.fenceBtnText}>المناطق</Text>
          </Pressable>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{onlineCount}</Text>
            <Text style={styles.statLabel}>متصل</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, inRideCount > 0 && { color: Colors.primary }]}>{inRideCount}</Text>
            <Text style={styles.statLabel}>في رحلة</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{familyMembers.length}</Text>
            <Text style={styles.statLabel}>الأفراد</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: Colors.error }]}>{mockAlerts.filter(a => a.type === 'exit').length}</Text>
            <Text style={styles.statLabel}>تنبيهات</Text>
          </View>
        </View>

        {/* Tab Row */}
        <View style={styles.tabRow}>
          {([
            { id: 'map' as FamilyTab, label: 'الخريطة', icon: 'map' },
            { id: 'members' as FamilyTab, label: 'الأفراد', icon: 'people' },
            { id: 'alerts' as FamilyTab, label: 'التنبيهات', icon: 'notifications' },
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

      {/* ===== TAB: MAP ===== */}
      {activeTab === 'map' && (
        <View style={styles.mapContainer}>
          <FamilyMapView
            mapRef={mapRef}
            members={familyMembers}
            homeLocation={HOME_LOCATION}
            geofenceRadius={400}
            showGeofence
          />

          {/* Map Legend */}
          <View style={styles.mapLegend}>
            {[
              { color: Colors.primary, label: 'في رحلة' },
              { color: Colors.success, label: 'متصل' },
              { color: Colors.textTertiary, label: 'غير متصل' },
              { color: Colors.secondary, label: 'المنزل' },
            ].map(item => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Members Quick Row */}
          <View style={styles.membersQuickRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: Spacing.base }}>
              {familyMembers.map(member => {
                const status = statusConfig[member.status];
                return (
                  <Pressable
                    key={member.id}
                    style={styles.memberQuickCard}
                    onPress={() => router.push({ pathname: '/family-member', params: { id: member.id } })}
                  >
                    <View style={styles.memberQuickAvatarWrap}>
                      <Image source={{ uri: member.avatar }} style={styles.memberQuickAvatar} contentFit="cover" />
                      <View style={[styles.memberQuickStatusDot, { backgroundColor: status.color }]} />
                    </View>
                    <Text style={styles.memberQuickName}>{member.name.split(' ')[0]}</Text>
                    <View style={[styles.memberQuickBadge, { backgroundColor: status.bg }]}>
                      <MaterialIcons name={status.icon as any} size={10} color={status.color} />
                      <Text style={[styles.memberQuickBadgeText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Geofencing Button */}
          <Pressable style={styles.geofenceBtn} onPress={() => router.push('/geofencing')}>
            <MaterialIcons name="fence" size={18} color={Colors.secondary} />
            <Text style={styles.geofenceBtnText}>إدارة المناطق المسموحة</Text>
            <MaterialIcons name="arrow-back" size={16} color={Colors.secondary} />
          </Pressable>
        </View>
      )}

      {/* ===== TAB: MEMBERS ===== */}
      {activeTab === 'members' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.base, gap: Spacing.md, paddingBottom: 30 }}>
          {familyMembers.map(member => {
            const status = statusConfig[member.status];
            return (
              <View key={member.id} style={styles.memberCard}>
                <Pressable
                  style={styles.memberTop}
                  onPress={() => router.push({ pathname: '/family-member', params: { id: member.id } })}
                >
                  <MaterialIcons name="chevron-left" size={22} color={Colors.textTertiary} />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={styles.memberMeta}>
                      <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                      </View>
                      <Text style={styles.memberAge}>{member.age} سنة · {member.gender}</Text>
                    </View>
                    <Text style={styles.memberLastSeen}>{member.lastSeen}</Text>
                  </View>
                  <Image source={{ uri: member.avatar }} style={styles.memberAvatar} contentFit="cover" transition={200} />
                </Pressable>

                {/* Permissions */}
                <View style={styles.permsSection}>
                  <View style={styles.permsGrid}>
                    <View style={styles.permRow}>
                      <Switch
                        value={member.permissions.canBook}
                        onValueChange={(val) => updateFamilyPermission(member.id, 'canBook', val)}
                        trackColor={{ false: Colors.border, true: Colors.primary }}
                        thumbColor="#fff"
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                      />
                      <Text style={styles.permLabel}>حجز رحلات</Text>
                      <MaterialIcons name="directions-car" size={15} color={Colors.textSecondary} />
                    </View>
                    <View style={styles.permRow}>
                      <Switch
                        value={member.permissions.canPay}
                        onValueChange={(val) => updateFamilyPermission(member.id, 'canPay', val)}
                        trackColor={{ false: Colors.border, true: Colors.primary }}
                        thumbColor="#fff"
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                      />
                      <Text style={styles.permLabel}>الدفع</Text>
                      <MaterialIcons name="credit-card" size={15} color={Colors.textSecondary} />
                    </View>
                  </View>
                  <View style={styles.timeLimitRow}>
                    <View style={styles.timeBadge}>
                      <MaterialIcons name="access-time" size={13} color={Colors.primary} />
                      <Text style={styles.timeValue}>{member.permissions.timeLimit}</Text>
                    </View>
                    <Text style={styles.timeLabel}>حد الاستخدام</Text>
                    <Pressable style={styles.locationBtn} onPress={() => router.push('/geofencing')}>
                      <MaterialIcons name="fence" size={14} color={Colors.primary} />
                      <Text style={styles.locationBtnText}>المناطق</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}

          {/* SOS Panel */}
          <View style={styles.sosPanel}>
            <MaterialIcons name="emergency" size={24} color={Colors.error} />
            <View style={styles.sosInfo}>
              <Text style={styles.sosTitle}>زر الطوارئ SOS</Text>
              <Text style={styles.sosDesc}>يُرسل الموقع الحالي فوراً لولي الأمر</Text>
            </View>
            <Pressable style={styles.sosBtn}>
              <Text style={styles.sosBtnText}>إعداد</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {/* ===== TAB: ALERTS ===== */}
      {activeTab === 'alerts' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.base, gap: Spacing.sm, paddingBottom: 30 }}>
          <Text style={styles.alertsTitle}>آخر التنبيهات</Text>
          {mockAlerts.map(alert => (
            <View key={alert.id} style={[styles.alertCard, { borderRightColor: alert.color }]}>
              <View style={styles.alertLeft}>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
              <View style={styles.alertInfo}>
                <Text style={styles.alertMember}>{alert.member}</Text>
                <Text style={styles.alertDesc}>
                  {alert.type === 'exit' ? `خرجت من منطقة "${alert.zone}"` :
                   alert.type === 'enter' ? `دخلت منطقة "${alert.zone}"` :
                   `بدأت ${alert.zone}`}
                </Text>
              </View>
              <View style={[styles.alertIconWrap, { backgroundColor: alert.color + '20' }]}>
                <MaterialIcons
                  name={alert.type === 'exit' ? 'exit-to-app' : alert.type === 'enter' ? 'login' : 'directions-car'}
                  size={20}
                  color={alert.color}
                />
              </View>
            </View>
          ))}

          <Pressable style={styles.geofenceFullBtn} onPress={() => router.push('/geofencing')}>
            <MaterialIcons name="fence" size={20} color={Colors.secondary} />
            <Text style={styles.geofenceFullBtnText}>إدارة المناطق والجيوفنسينج</Text>
            <MaterialIcons name="arrow-back" size={18} color={Colors.secondary} />
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl,
    gap: Spacing.md,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.bold, color: '#fff' },
  headerSub: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.5)' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6,
  },
  addBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: '#fff', fontWeight: Typography.semiBold },
  fenceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary + '25',
    borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.primary + '50',
  },
  fenceBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.semiBold },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.lg, padding: Spacing.md,
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', gap: 3 },
  statNum: { fontFamily: Typography.fontFamily, fontSize: Typography.lg, fontWeight: Typography.extraBold, color: '#fff' },
  statLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.65)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  tabRow: { flexDirection: 'row', gap: 6 },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 9, borderRadius: Radius.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  tabBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabBtnText: { fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: Typography.semiBold, color: 'rgba(255,255,255,0.5)' },
  tabBtnTextActive: { color: Colors.secondary },

  // MAP TAB
  mapContainer: { flex: 1, position: 'relative' },
  mapLegend: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.lg, padding: Spacing.sm, gap: 4,
    ...Shadow.sm,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: Typography.fontFamily, fontSize: 11, color: Colors.textSecondary },
  membersQuickRow: {
    position: 'absolute', bottom: 80, left: 0, right: 0, paddingVertical: 4,
  },
  memberQuickCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.sm,
    alignItems: 'center', gap: 4,
    minWidth: 70, ...Shadow.md,
  },
  memberQuickAvatarWrap: { position: 'relative' },
  memberQuickAvatar: { width: 44, height: 44, borderRadius: 22 },
  memberQuickStatusDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: '#fff',
  },
  memberQuickName: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.textPrimary },
  memberQuickBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2,
  },
  memberQuickBadgeText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold },
  geofenceBtn: {
    position: 'absolute', bottom: 16, left: Spacing.base, right: Spacing.base,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    ...Shadow.golden,
  },
  geofenceBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.secondary },

  // MEMBERS TAB
  memberCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.sm,
  },
  memberTop: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.base,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  memberAvatar: { width: 52, height: 52, borderRadius: 26 },
  memberInfo: { flex: 1, paddingHorizontal: 12, gap: 2 },
  memberName: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  memberMeta: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'flex-end' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.semiBold },
  memberAge: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  memberLastSeen: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right' },
  permsSection: { padding: Spacing.md, gap: 8 },
  permsGrid: { gap: 6 },
  permRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  permLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textPrimary, flex: 1, textAlign: 'right' },
  timeLimitRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  timeLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textSecondary, flex: 1, textAlign: 'right' },
  timeBadge: {
    backgroundColor: Colors.primarySurface, borderRadius: Radius.sm,
    paddingHorizontal: 10, paddingVertical: 4,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  timeValue: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.primary },
  locationBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primarySurface, borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  locationBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.semiBold, color: Colors.primary },
  sosPanel: {
    backgroundColor: Colors.errorSurface, borderRadius: Radius.xl,
    padding: Spacing.base, flexDirection: 'row', alignItems: 'center',
    gap: 12, borderWidth: 1, borderColor: 'rgba(255,59,48,0.2)',
  },
  sosInfo: { flex: 1 },
  sosTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.error, textAlign: 'right' },
  sosDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textSecondary, textAlign: 'right' },
  sosBtn: { backgroundColor: Colors.error, borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 8 },
  sosBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: '#fff' },

  // ALERTS TAB
  alertsTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  alertCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRightWidth: 4, ...Shadow.sm,
  },
  alertIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  alertInfo: { flex: 1 },
  alertMember: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  alertDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'right' },
  alertLeft: { alignItems: 'flex-end' },
  alertTime: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  geofenceFullBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 14, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, ...Shadow.golden,
  },
  geofenceFullBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.secondary },
});
