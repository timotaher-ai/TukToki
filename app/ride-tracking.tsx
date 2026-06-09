// Powered by OnSpace.AI — Ride Tracking Screen (Dark Premium Redesign)
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, ScrollView,
} from 'react-native';
import TrackingMapView from '@/components/TrackingMapView';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { mockDriverInfo } from '@/constants/mockData';
import { StatusBar } from 'expo-status-bar';

const USER_LOCATION = { latitude: 30.0444, longitude: 31.2357 };
const DESTINATION   = { latitude: 30.0610, longitude: 31.2200 };

const DRIVER_PATH = [
  { latitude: 30.0520, longitude: 31.2430 },
  { latitude: 30.0500, longitude: 31.2410 },
  { latitude: 30.0480, longitude: 31.2390 },
  { latitude: 30.0460, longitude: 31.2370 },
  { latitude: 30.0450, longitude: 31.2360 },
  { latitude: 30.0444, longitude: 31.2357 },
];

const PROGRESS_STEPS = ['البحث', 'الوصول', 'في الطريق', 'وصلنا'];

export default function RideTrackingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setActiveRide } = useApp();
  const mapRef = useRef<any>(null);

  const [eta, setEta] = useState(mockDriverInfo.eta);
  const [rideStatus, setRideStatus] = useState<'arriving' | 'in_ride' | 'arriving_dest' | 'completed'>('arriving');
  const [driverPos, setDriverPos] = useState(DRIVER_PATH[0]);
  const [pathStep, setPathStep] = useState(0);
  const [progressStep, setProgressStep] = useState(1); // 0-3
  const [sheetExpanded, setSheetExpanded] = useState(false);

  // Animations
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const sheetAnim   = useRef(new Animated.Value(0)).current;
  const statusFade  = useRef(new Animated.Value(1)).current;
  const tukRotate   = useRef(new Animated.Value(0)).current;

  // Pulse the golden glow under driver icon
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Tuk icon subtle bobbing
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(tukRotate, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(tukRotate, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Driver movement along path
  useEffect(() => {
    if (rideStatus !== 'arriving') return;
    const interval = setInterval(() => {
      setPathStep(prev => {
        const next = prev + 1;
        if (next < DRIVER_PATH.length) {
          setDriverPos(DRIVER_PATH[next]);
          mapRef.current?.animateToRegion({ ...DRIVER_PATH[next], latitudeDelta: 0.022, longitudeDelta: 0.022 }, 1200);
          return next;
        } else {
          clearInterval(interval);
          setRideStatus('in_ride');
          setProgressStep(2);
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

  const statusConfig: Record<string, { title: string; desc: string; color: string; icon: string }> = {
    arriving:      { title: 'السائق في الطريق إليك',  desc: `يصل خلال ${eta} دقيقة`,      color: Colors.primary, icon: 'local-taxi' },
    in_ride:       { title: 'أنت في الرحلة الآن',     desc: 'استمتع برحلتك الآمنة',        color: Colors.success, icon: 'directions-car' },
    arriving_dest: { title: 'تقترب من وجهتك',          desc: 'دقيقتان للوصول',             color: Colors.warning, icon: 'place' },
    completed:     { title: 'وصلت بسلام!',             desc: 'شكراً لاستخدامك تك توكي',    color: Colors.success, icon: 'check-circle' },
  };
  const currentStatus = statusConfig[rideStatus];

  const routeCoords = rideStatus === 'arriving'
    ? [driverPos, USER_LOCATION]
    : [USER_LOCATION, DESTINATION];

  const tukTranslate = tukRotate.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Full-screen Map */}
      <View style={styles.mapFull}>
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
          onRecenter={() => mapRef.current?.animateToRegion({ ...USER_LOCATION, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 600)}
        />
      </View>

      {/* Floating Top Bar */}
      <View style={[styles.floatingTopBar, { top: insets.top + 8 }]}>
        <Pressable style={styles.floatBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-forward" size={20} color={Colors.textPrimary} />
        </Pressable>

        {/* Live status pill */}
        <View style={[styles.statusPill, { borderColor: currentStatus.color + '50', backgroundColor: Colors.surface }]}>
          <View style={[styles.statusPillDot, { backgroundColor: currentStatus.color }]} />
          <Text style={[styles.statusPillText, { color: currentStatus.color }]}>{currentStatus.title}</Text>
        </View>

        <Pressable style={styles.floatBtn} onPress={() => router.push('/chat')}>
          <MaterialIcons name="chat-bubble-outline" size={20} color={Colors.textPrimary} />
        </Pressable>
      </View>

      {/* ETA Floating Badge */}
      {rideStatus === 'arriving' && (
        <Animated.View style={[styles.etaFloatBadge, { bottom: sheetExpanded ? 360 : 300 }]}>
          <Animated.View style={[styles.etaTukIcon, { transform: [{ translateY: tukTranslate }] }]}>
            <MaterialIcons name="local-taxi" size={22} color={Colors.primary} />
          </Animated.View>
          <View style={styles.etaTextWrap}>
            <Text style={styles.etaFloatNum}>{eta}</Text>
            <Text style={styles.etaFloatLabel}>دقيقة</Text>
          </View>
        </Animated.View>
      )}

      {/* Progress Indicator */}
      <View style={styles.progressRow}>
        {PROGRESS_STEPS.map((step, i) => (
          <View key={i} style={styles.progressStep}>
            <View style={[
              styles.progressDot,
              i < progressStep && { backgroundColor: Colors.success },
              i === progressStep && { backgroundColor: Colors.primary, ...Shadow.goldenSm },
            ]}>
              {i < progressStep
                ? <MaterialIcons name="check" size={10} color="#fff" />
                : <View style={styles.progressDotInner} />
              }
            </View>
            {i < PROGRESS_STEPS.length - 1 && (
              <View style={[styles.progressLine, i < progressStep && { backgroundColor: Colors.success }]} />
            )}
            <Text style={[
              styles.progressLabel,
              i === progressStep && { color: Colors.primary, fontWeight: Typography.bold },
            ]}>{step}</Text>
          </View>
        ))}
      </View>

      {/* ── Bottom Sheet ─────────────────────────────────────── */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable style={styles.sheetHandle} onPress={() => setSheetExpanded(!sheetExpanded)} />

        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: currentStatus.color + '15', borderColor: currentStatus.color + '30' }]}>
          <View style={[styles.statusBannerDot, { backgroundColor: currentStatus.color }]} />
          <View style={styles.statusBannerInfo}>
            <Text style={[styles.statusBannerTitle, { color: currentStatus.color }]}>{currentStatus.title}</Text>
            <Text style={styles.statusBannerDesc}>{currentStatus.desc}</Text>
          </View>
          <View style={[styles.statusBannerIcon, { backgroundColor: currentStatus.color + '20' }]}>
            <MaterialIcons name={currentStatus.icon as any} size={20} color={currentStatus.color} />
          </View>
        </View>

        {/* Driver Card */}
        <View style={styles.driverCard}>
          <View style={styles.driverCardLeft}>
            <Pressable style={styles.driverActionBtn} onPress={() => router.push('/chat')}>
              <MaterialIcons name="chat" size={18} color={Colors.primary} />
            </Pressable>
            <Pressable style={[styles.driverActionBtn, { backgroundColor: Colors.successSurface }]}>
              <MaterialIcons name="phone" size={18} color={Colors.success} />
            </Pressable>
          </View>

          <View style={styles.driverCardCenter}>
            <Text style={styles.driverName}>{mockDriverInfo.name}</Text>
            <Text style={styles.driverVehicle}>{mockDriverInfo.car}</Text>
            <View style={styles.driverMetaRow}>
              <View style={styles.plateBadge}>
                <Text style={styles.plateText}>{mockDriverInfo.plate}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <MaterialIcons name="star" size={12} color={Colors.primary} />
                <Text style={styles.ratingText}>{mockDriverInfo.rating}</Text>
              </View>
            </View>
          </View>

          <View style={styles.driverAvatarWrap}>
            <Image source={{ uri: mockDriverInfo.avatar }} style={styles.driverAvatar} contentFit="cover" />
            <View style={styles.driverOnlineDot} />
          </View>
        </View>

        {/* Route Summary */}
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <Text style={styles.routeAddr} numberOfLines={1}>{'المعادي، القاهرة'}</Text>
            <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
          </View>
          <View style={styles.routeConnector}>
            <View style={styles.routeConnectorLine} />
            <View style={styles.routeDistBadge}>
              <MaterialIcons name="straighten" size={11} color={Colors.textTertiary} />
              <Text style={styles.routeDistText}>18 كم · 35 دق</Text>
            </View>
          </View>
          <View style={styles.routeRow}>
            <Text style={styles.routeAddr} numberOfLines={1}>{'مول مصر، 6 أكتوبر'}</Text>
            <View style={[styles.routeDot, { backgroundColor: Colors.error }]} />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable style={styles.shareBtn}>
            <MaterialIcons name="share" size={16} color={Colors.primary} />
            <Text style={styles.shareBtnText}>مشاركة</Text>
          </Pressable>
          <Pressable style={styles.sosBtn}>
            <MaterialIcons name="emergency" size={16} color={Colors.error} />
            <Text style={styles.sosBtnText}>SOS</Text>
          </Pressable>
          <Pressable style={styles.endBtn} onPress={handleEndRide}>
            <MaterialIcons name="flag" size={16} color={Colors.textInverse} />
            <Text style={styles.endBtnText}>إنهاء الرحلة</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  mapFull: { ...StyleSheet.absoluteFillObject },

  // FLOATING TOP BAR
  floatingTopBar: {
    position: 'absolute', left: Spacing.base, right: Spacing.base,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    zIndex: 20,
  },
  floatBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.md,
  },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    borderRadius: Radius.full,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1,
    ...Shadow.md,
    flex: 1, justifyContent: 'center',
  },
  statusPillDot: { width: 8, height: 8, borderRadius: 4 },
  statusPillText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.bold,
  },

  // ETA FLOAT BADGE
  etaFloatBadge: {
    position: 'absolute', right: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.borderGold,
    ...Shadow.golden,
    zIndex: 15,
  },
  etaTukIcon: { alignItems: 'center' },
  etaTextWrap: { alignItems: 'center' },
  etaFloatNum: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xxl, fontWeight: Typography.black, color: Colors.primary,
  },
  etaFloatLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textTertiary,
  },

  // PROGRESS
  progressRow: {
    position: 'absolute', bottom: 300, left: Spacing.base, right: Spacing.base,
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.md, zIndex: 15,
  },
  progressStep: { flex: 1, alignItems: 'center', position: 'relative' },
  progressDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.border,
  },
  progressDotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.textMuted },
  progressLine: {
    position: 'absolute', top: 10, right: -'50%' as any, left: '50%' as any,
    height: 2, backgroundColor: Colors.border,
  },
  progressLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 9, color: Colors.textTertiary, marginTop: 4, textAlign: 'center',
  },

  // BOTTOM SHEET
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxxl,
    borderTopRightRadius: Radius.xxxl,
    padding: Spacing.base,
    paddingTop: Spacing.md,
    gap: Spacing.md,
    borderTopWidth: 1, borderColor: Colors.border,
    ...Shadow.lg,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 2,
  },

  // STATUS BANNER
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1,
  },
  statusBannerDot: { width: 10, height: 10, borderRadius: 5 },
  statusBannerInfo: { flex: 1 },
  statusBannerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold, textAlign: 'right',
  },
  statusBannerDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right',
  },
  statusBannerIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },

  // DRIVER CARD
  driverCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  driverAvatarWrap: { position: 'relative' },
  driverAvatar: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2.5, borderColor: Colors.borderGold,
  },
  driverOnlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2.5, borderColor: Colors.surfaceSecondary,
  },
  driverCardCenter: { flex: 1, gap: 2 },
  driverName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  driverVehicle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right',
  },
  driverMetaRow: { flexDirection: 'row', gap: 6, justifyContent: 'flex-end', alignItems: 'center' },
  plateBadge: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.sm,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: Colors.border,
  },
  plateText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.bold,
    color: Colors.textPrimary, letterSpacing: 1.5,
  },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.primarySurface, borderRadius: Radius.sm,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  ratingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.primary,
  },
  driverCardLeft: { flexDirection: 'column', gap: 8 },
  driverActionBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.borderGold,
  },

  // ROUTE CARD
  routeCard: {
    backgroundColor: Colors.background, borderRadius: Radius.lg,
    padding: Spacing.md, gap: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  routeDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  routeAddr: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  routeConnector: {
    flexDirection: 'row', alignItems: 'center', paddingRight: 9,
    paddingLeft: 0, gap: 8, height: 20,
  },
  routeConnectorLine: {
    width: 2, height: 16, backgroundColor: Colors.border,
    borderRadius: 1, marginRight: 0,
  },
  routeDistBadge: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4,
    justifyContent: 'flex-end',
  },
  routeDistText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textTertiary,
  },

  // ACTION ROW
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  shareBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.primarySurface,
    borderRadius: Radius.full, paddingVertical: 13,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  shareBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.primary,
  },
  sosBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.errorSurface,
    borderRadius: Radius.full, paddingVertical: 13,
    borderWidth: 1, borderColor: 'rgba(255,75,75,0.3)',
  },
  sosBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.error,
  },
  endBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primary,
    borderRadius: Radius.full, paddingVertical: 13,
    ...Shadow.golden,
  },
  endBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textInverse,
  },
});
