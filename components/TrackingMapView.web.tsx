// Web fallback for ride tracking map
import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

interface TrackingMapViewProps {
  mapRef?: any;
  userLocation: { latitude: number; longitude: number };
  driverPos: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  routeCoords: any[];
  rideStatus: string;
  pulseAnim: Animated.Value;
  insetTop: number;
  onBack: () => void;
  onSOS: () => void;
  onRecenter: () => void;
}

export default function TrackingMapView({
  rideStatus,
  pulseAnim,
  insetTop,
  onBack,
  onSOS,
}: TrackingMapViewProps) {
  return (
    <View style={styles.mapArea}>
      {/* Placeholder Map */}
      <View style={styles.mapPlaceholder}>
        <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
        <View style={styles.mapCenter}>
          <MaterialIcons name="directions-car" size={36} color={Colors.primary} />
        </View>
        <Text style={styles.mapStatusText}>
          {rideStatus === 'arriving' ? 'السائق في الطريق إليك' : 'أنت في الرحلة الآن'}
        </Text>
        <Text style={styles.mapSubText}>الخريطة التفاعلية متاحة على التطبيق المحمول</Text>
      </View>

      {/* Back Button */}
      <Pressable style={[styles.backBtn, { top: insetTop + 12 }]} onPress={onBack}>
        <MaterialIcons name="arrow-forward" size={22} color={Colors.textPrimary} />
      </Pressable>

      {/* SOS Button */}
      <Pressable style={[styles.sosBtn, { top: insetTop + 12 }]} onPress={onSOS}>
        <MaterialIcons name="emergency" size={16} color={Colors.error} />
        <Text style={styles.sosBtnText}>SOS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  mapArea: { flex: 1, position: 'relative', backgroundColor: '#E8F4F8' },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primary,
    opacity: 0.3,
  },
  mapCenter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Shadow.golden,
  },
  mapStatusText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.secondary,
  },
  mapSubText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  backBtn: {
    position: 'absolute', right: Spacing.base,
    backgroundColor: Colors.surface,
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },
  sosBtn: {
    position: 'absolute', left: Spacing.base,
    backgroundColor: Colors.errorSurface,
    borderRadius: Radius.lg,
    paddingHorizontal: 12, paddingVertical: 9,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.error,
  },
  sosBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.extraBold,
    color: Colors.error,
  },
});
