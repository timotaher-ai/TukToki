// Web fallback - Family Map View
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

interface FamilyMember {
  id: string;
  name: string;
  status: string;
  currentLocation: { lat: number; lng: number };
}

const statusColors: Record<string, string> = {
  in_ride: Colors.primary,
  online: Colors.success,
  offline: Colors.textTertiary,
};

interface FamilyMapViewProps {
  mapRef?: any;
  members: FamilyMember[];
  homeLocation: { latitude: number; longitude: number };
  geofenceRadius?: number;
  showGeofence?: boolean;
}

export default function FamilyMapView({ members }: FamilyMapViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <View style={styles.mapIcon}>
          <MaterialIcons name="map" size={40} color={Colors.secondary} />
        </View>
        <Text style={styles.title}>خريطة الأسرة</Text>
        <Text style={styles.sub}>متاحة على التطبيق المحمول</Text>
        <View style={styles.memberPins}>
          {members.map(m => (
            <View key={m.id} style={[styles.memberPin, { borderColor: statusColors[m.status] || Colors.textTertiary }]}>
              <View style={[styles.pinDot, { backgroundColor: statusColors[m.status] || Colors.textTertiary }]} />
              <Text style={styles.pinName} numberOfLines={1}>{m.name.split(' ')[0]}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F4F8' },
  placeholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: Spacing.xl,
  },
  mapIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.md,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.secondary,
  },
  sub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textTertiary,
  },
  memberPins: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 },
  memberPin: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1.5, ...Shadow.sm,
  },
  pinDot: { width: 8, height: 8, borderRadius: 4 },
  pinName: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.semiBold, color: Colors.textPrimary },
});
