// Web fallback — Booking Map View (Dark Theme)
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

interface BookingMapViewProps {
  mapRef?: any;
  userLocation: { latitude: number; longitude: number } | null;
  locationLoading: boolean;
  mapExpanded: boolean;
  onGetLocation: () => void;
  onToggleExpand: () => void;
}

// Mock tuk-tuk positions for illustration
const TUKS = [
  { id: 't1', x: '20%', y: '35%' },
  { id: 't2', x: '55%', y: '22%' },
  { id: 't3', x: '72%', y: '55%' },
];

export default function BookingMapView({ onGetLocation, userLocation }: BookingMapViewProps) {
  return (
    <View style={styles.container}>
      {/* Map background with grid */}
      <View style={styles.mapBg}>
        {[0.25, 0.5, 0.75].map(f => (
          <View key={`h${f}`} style={[styles.gridH, { top: `${f * 100}%` as any }]} />
        ))}
        {[0.2, 0.4, 0.6, 0.8].map(f => (
          <View key={`v${f}`} style={[styles.gridV, { left: `${f * 100}%` as any }]} />
        ))}

        {/* Route line (golden) */}
        <View style={styles.routeLine} />

        {/* Origin pin */}
        <View style={[styles.pin, styles.pinOrigin]}>
          <View style={styles.pinInner} />
          <View style={styles.pinLabel}>
            <Text style={styles.pinLabelText}>نقطة الانطلاق</Text>
            <Text style={styles.pinLabelSub}>شارع التحرير، الدقي</Text>
          </View>
        </View>

        {/* Destination pin */}
        <View style={[styles.pin, styles.pinDest]}>
          <View style={[styles.pinInner, { backgroundColor: Colors.error }]} />
          <View style={[styles.pinLabel, styles.pinLabelRight]}>
            <Text style={styles.pinLabelText}>الوجهة</Text>
            <Text style={styles.pinLabelSub}>ميدان الجيزة</Text>
          </View>
        </View>

        {/* Nearby tuk-tuks */}
        {TUKS.map(t => (
          <View key={t.id} style={[styles.nearTuk, { left: t.x as any, top: t.y as any }]}>
            <MaterialIcons name="local-taxi" size={22} color={Colors.primary} />
          </View>
        ))}
      </View>

      {/* My location button */}
      <Pressable style={styles.locBtn} onPress={onGetLocation}>
        <MaterialIcons name="my-location" size={16} color={Colors.textPrimary} />
        <Text style={styles.locBtnText}>موقعي الحالي</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 260,
    backgroundColor: '#12141E',
    position: 'relative',
    overflow: 'hidden',
  },
  mapBg: { ...StyleSheet.absoluteFillObject },
  gridH: {
    position: 'absolute', left: 0, right: 0,
    height: 1, backgroundColor: 'rgba(255,255,255,0.04)',
  },
  gridV: {
    position: 'absolute', top: 0, bottom: 0,
    width: 1, backgroundColor: 'rgba(255,255,255,0.04)',
  },
  routeLine: {
    position: 'absolute',
    top: '40%', left: '30%',
    width: '35%', height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    opacity: 0.85,
    transform: [{ rotate: '15deg' }],
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinOrigin: { top: '35%', left: '25%' },
  pinDest: { top: '52%', right: '22%' },
  pinInner: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.primary,
    borderWidth: 3, borderColor: '#fff',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 8,
  },
  pinLabel: {
    backgroundColor: 'rgba(26,27,34,0.92)',
    borderRadius: Radius.md, padding: Spacing.xs,
    marginTop: 4, alignItems: 'flex-end',
    borderWidth: 1, borderColor: Colors.borderGold,
    minWidth: 100,
  },
  pinLabelRight: { alignItems: 'flex-end' },
  pinLabelText: {
    fontFamily: Typography.fontFamily,
    fontSize: 11, fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  pinLabelSub: {
    fontFamily: Typography.fontFamily,
    fontSize: 9, color: Colors.textTertiary,
  },
  nearTuk: {
    position: 'absolute',
    transform: [{ translateX: -11 }, { translateY: -11 }],
    opacity: 0.6,
  },
  locBtn: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(26,27,34,0.92)',
    borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.md,
  },
  locBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
});
