// Powered by OnSpace.AI — Ride Tracking Screen with Real Map + Driver Animation
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated,
} from 'react-native';
import TrackingMapView from '@/components/TrackingMapView';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { mockDriverInfo } from '@/constants/mockData';

const USER_LOCATION = { latitude: 30.0444, longitude: 31.2357 };
const DESTINATION    = { latitude: 30.0610, longitude: 31.2200 };

// Driver starts far, moves toward user
const DRIVER_PATH = [
  { latitude: 30.0520, longitude: 31.2430 },
  { latitude: 30.0500, longitude: 31.2410 },
  { latitude: 30.0480, longitude: 31.2390 },
  { latitude: 30.0460, longitude: 31.2370 },
  { latitude: 30.0450, longitude: 31.2360 },
  { latitude: 30.0444, longitude: 31.2357 }, // arrived
];

export default function RideTrackingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setActiveRide } = useApp();
  const mapRef = useRef<any>(null);

  const [eta, setEta] = useState(mockDriverInfo.eta);
  const [rideStatus, setRideStatus] = useState<'arriving' | 'in_ride' | 'arriving_dest' | 'completed'>('arriving');
  const [driverPos, setDriverPos] = useState(DRIVER_PATH[0]);
  const [pathStep, setPathStep] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for driver marker
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Driver moves step by step
  useEffect(() => {
    if (rideStatus !== 'arriving') return;
    const interval = setInterval(() => {
      setPathStep(prev => {
        const next = prev + 1;
        if (next < DRIVER_PATH.length) {
          const pos = DRIVER_PATH[next];
          setDriverPos(pos);
          mapRef.current?.animateToRegion({
            ...pos,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
          }, 1200);
          return next;
        } else {
          clearInterval(interval);
          setRideStatus('in_ride');
          return prev;
        }
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [rideStatus]);

  // ETA countdown
  useEffect(() => {
    if (rideStatus !== 'arriving') return;
    const interval = setInterval(() => {
      setEta(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [rideStatus]);

  const handleEndRide = () => {
    setActiveRide(null);
    router.replace('/ride-rating');
  };

  const statusMessages: Record<string, { title: string; desc: string; color: string }> = {
    arriving:      { title: 'السائق في الطريق إليك',  desc: `يصل خلال ${eta} دقيقة`,         color: Colors.primary },
    in_ride:       { title: 'أنت في الرحلة الآن 🚗',   desc: 'استمتع برحلتك الآمنة',          color: Colors.success },
    arriving_dest: { title: 'تقترب من وجهتك',           desc: 'دقيقتان للوصول',               color: Colors.warning },
    completed:     { title: 'وصلت بسلام! 🎉',           desc: 'شكراً لاستخدامك تك توكي',      color: Colors.success },
  };

  const currentStatus = statusMessages[rideStatus];

  // Route polyline
  const routeCoords = rideStatus === 'arriving'
    ? [driverPos, USER_LOCATION]
    : [USER_LOCATION, DESTINATION];

  return (
    <View style={styles.container}>
      <TrackingMapView
        mapRef={mapRef}
        userLocation={USER_LOCATION}
        driverPos={driverPos}
        destination={DESTINATION}
        routeCoords={routeCoords}
        rideStatus={rideStatus}
        pulseAnim={pulseAnim}
        insetTop={insets.top}
        onBack={() => router.back()}
        onSOS={() => {}}
        onRecenter={() => mapRef.current?.animateToRegion({
          ...USER_LOCATION,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }, 600)}
      />

      {/* Bottom Panel */}
      <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + 16 }]}>
        {/* Status Bar */}
        <View style={[styles.statusBar, { backgroundColor: currentStatus.color + '15' }]}>
          <View style={[styles.statusDot, { backgroundColor: currentStatus.color }]} />
          <View style={styles.statusInfo}>
            <Text style={[styles.statusTitle, { color: currentStatus.color }]}>{currentStatus.title}</Text>
            <Text style={styles.statusDesc}>{currentStatus.desc}</Text>
          </View>
          {rideStatus === 'arriving' && (
            <View style={styles.etaWrap}>
              <Text style={[styles.etaNum, { color: currentStatus.color }]}>{eta}</Text>
              <Text style={[styles.etaLabel, { color: currentStatus.color }]}>دقيقة</Text>
            </View>
          )}
          {rideStatus === 'in_ride' && (
            <View style={[styles.liveBadge, { backgroundColor: Colors.success }]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>مباشر</Text>
            </View>
          )}
        </View>

        {/* Driver Card */}
        <View style={styles.driverCard}>
          <View style={styles.driverLeft}>
            <Pressable style={styles.driverAction} onPress={() => router.push('/chat')}>
              <MaterialIcons name="chat" size={18} color={Colors.primary} />
            </Pressable>
            <Pressable style={styles.driverAction}>
              <MaterialIcons name="phone" size={18} color={Colors.primary} />
            </Pressable>
          </View>
          <View style={styles.driverCenter}>
            <Text style={styles.driverName}>{mockDriverInfo.name}</Text>
            <Text style={styles.driverCar}>{mockDriverInfo.car} · {mockDriverInfo.plate}</Text>
            <View style={styles.ratingRow}>
              <MaterialIcons name="star" size={12} color={Colors.primary} />
              <Text style={styles.driverRating}>{mockDriverInfo.rating}</Text>
            </View>
          </View>
          <Image source={{ uri: mockDriverInfo.avatar }} style={styles.driverAvatar} contentFit="cover" />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable style={styles.shareBtn}>
            <MaterialIcons name="share" size={18} color={Colors.primary} />
            <Text style={styles.shareBtnText}>مشاركة الرحلة</Text>
          </Pressable>
          <Pressable style={styles.endBtn} onPress={handleEndRide}>
            <Text style={styles.endBtnText}>إنهاء الرحلة</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  bottomPanel: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.lg,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusInfo: { flex: 1 },
  statusTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    textAlign: 'right',
  },
  statusDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
  etaWrap: { alignItems: 'center' },
  etaNum: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xxxl,
    fontWeight: Typography.extraBold,
    lineHeight: 36,
  },
  etaLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.md,
  },
  driverAvatar: { width: 52, height: 52, borderRadius: 26 },
  driverCenter: { flex: 1 },
  driverName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  driverCar: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'flex-end' },
  driverRating: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  driverLeft: { flexDirection: 'row', gap: 8 },
  driverAction: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.full,
    paddingVertical: 14,
  },
  shareBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },
  endBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    ...Shadow.golden,
  },
  endBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: '#fff',
  },
});
