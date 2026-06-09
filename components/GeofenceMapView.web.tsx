// Web fallback - Geofence Map View
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

interface Zone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  active: boolean;
}

interface GeofenceMapViewProps {
  mapRef?: any;
  zones: Zone[];
  memberLocation?: { latitude: number; longitude: number };
  selectedZoneId?: string;
  onMapPress?: (coords: { latitude: number; longitude: number }) => void;
}

export default function GeofenceMapView({ zones, selectedZoneId, onMapPress }: GeofenceMapViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <View style={styles.iconWrap}>
          <MaterialIcons name="fence" size={36} color={Colors.primary} />
        </View>
        <Text style={styles.title}>خريطة المناطق المسموحة</Text>
        <Text style={styles.sub}>اضغط لإضافة منطقة جديدة</Text>
        <Pressable
          style={styles.addZoneBtn}
          onPress={() => onMapPress && onMapPress({ latitude: 30.0444, longitude: 31.2357 })}
        >
          <MaterialIcons name="add-location" size={18} color="#fff" />
          <Text style={styles.addZoneBtnText}>إضافة منطقة هنا</Text>
        </Pressable>
        <View style={styles.activeZones}>
          {zones.filter(z => z.active).map(z => (
            <View key={z.id} style={[styles.zoneChip, { borderColor: z.color }, selectedZoneId === z.id && { backgroundColor: z.color + '20' }]}>
              <View style={[styles.zoneColorDot, { backgroundColor: z.color }]} />
              <Text style={styles.zoneChipName}>{z.name}</Text>
              <Text style={styles.zoneChipRadius}>{z.radius}م</Text>
            </View>
          ))}
        </View>
        <Text style={styles.webNote}>الخريطة التفاعلية والتعديل المباشر متاحان على التطبيق المحمول</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F4F8' },
  placeholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 12, padding: Spacing.xl,
  },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.md,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  sub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: Colors.textTertiary,
  },
  addZoneBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
    ...Shadow.golden,
  },
  addZoneBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.secondary,
  },
  activeZones: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  zoneChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1.5, ...Shadow.sm,
  },
  zoneColorDot: { width: 8, height: 8, borderRadius: 4 },
  zoneChipName: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textPrimary },
  zoneChipRadius: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  webNote: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textTertiary,
    textAlign: 'center', paddingHorizontal: 32, marginTop: 4,
  },
});
