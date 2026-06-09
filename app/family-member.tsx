// Powered by OnSpace.AI — Family Member Detail Screen
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

export default function FamilyMemberScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { familyMembers, updateFamilyPermission } = useApp();

  const member = familyMembers.find(m => m.id === id);

  if (!member) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>لم يتم العثور على الفرد</Text>
      </View>
    );
  }

  const statusColors: Record<string, string> = {
    in_ride: Colors.primary,
    online: Colors.success,
    offline: Colors.textTertiary,
  };

  const statusLabels: Record<string, string> = {
    in_ride: 'في رحلة الآن',
    online: 'متصل',
    offline: 'غير متصل',
  };

  const permItems = [
    { key: 'canBook', label: 'السماح بحجز الرحلات', icon: 'directions-car', value: member.permissions.canBook },
    { key: 'canPay', label: 'السماح بالدفع', icon: 'credit-card', value: member.permissions.canPay },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="arrow-forward" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>ملف الفرد</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.profileSection}>
          <Image source={{ uri: member.avatar }} style={styles.avatar} contentFit="cover" />
          <Text style={styles.memberName}>{member.name}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColors[member.status] }]} />
            <Text style={styles.statusText}>{statusLabels[member.status]}</Text>
          </View>
          <View style={styles.memberMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{member.age}</Text>
              <Text style={styles.metaLabel}>العمر</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{member.gender}</Text>
              <Text style={styles.metaLabel}>الجنس</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{member.permissions.timeLimit}</Text>
              <Text style={styles.metaLabel}>حد الوقت</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.base, gap: Spacing.base }}>

        {/* Location Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="location-on" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>الموقع الحالي</Text>
          </View>
          <View style={styles.locationPreview}>
            <MaterialIcons name="map" size={40} color={Colors.primaryLight} />
            <Text style={styles.locationText}>{member.lastSeen}</Text>
            <Text style={styles.locationCoords}>
              {member.currentLocation.lat.toFixed(4)}, {member.currentLocation.lng.toFixed(4)}
            </Text>
          </View>
        </View>

        {/* Permissions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="security" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>الصلاحيات</Text>
          </View>
          {permItems.map(perm => (
            <View key={perm.key} style={styles.permRow}>
              <Switch
                value={perm.value as boolean}
                onValueChange={(val) => updateFamilyPermission(member.id, perm.key, val)}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor="#fff"
              />
              <Text style={styles.permLabel}>{perm.label}</Text>
              <View style={styles.permIcon}>
                <MaterialIcons name={perm.icon as any} size={18} color={Colors.primary} />
              </View>
            </View>
          ))}
        </View>

        {/* Geofence */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="fence" size={18} color={Colors.warning} />
            <Text style={styles.cardTitle}>المناطق المسموحة (Geofencing)</Text>
          </View>
          <View style={styles.geofenceWrap}>
            <MaterialIcons name="add-location" size={28} color={Colors.primary} />
            <Text style={styles.geofenceText}>إضافة منطقة مسموحة</Text>
          </View>
        </View>

        {/* Actions */}
        <Pressable style={styles.dangerBtn}>
          <MaterialIcons name="block" size={18} color={Colors.error} />
          <Text style={styles.dangerBtnText}>إيقاف الحساب مؤقتاً</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
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
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  profileSection: { alignItems: 'center', gap: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  memberName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.85)',
  },
  memberMeta: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.lg,
    marginTop: 4,
  },
  metaItem: { alignItems: 'center', gap: 2 },
  metaValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  metaLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  metaDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  locationPreview: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  locationCoords: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'flex-end',
  },
  permIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  geofenceWrap: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 8,
  },
  geofenceText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.errorSurface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.2)',
    marginBottom: Spacing.xl,
  },
  dangerBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.error,
  },
});
