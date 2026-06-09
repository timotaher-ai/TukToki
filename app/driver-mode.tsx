// Powered by OnSpace.AI — Driver Mode Screen
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';

type DriverStatus = 'offline' | 'online' | 'in_ride';

interface IncomingRide {
  id: string;
  passenger: { name: string; rating: number; avatar: string; totalRides: number };
  from: string;
  to: string;
  distance: string;
  duration: string;
  price: number;
  payMethod: 'cash' | 'wallet';
  eta: number;
}

const mockIncomingRide: IncomingRide = {
  id: 'req_001',
  passenger: {
    name: 'فاطمة أحمد',
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    totalRides: 45,
  },
  from: 'مدينة نصر، الحي الأول',
  to: 'مول مصر، 6 أكتوبر',
  distance: '18.5 كم',
  duration: '35 دقيقة',
  price: 95.00,
  payMethod: 'wallet',
  eta: 4,
};

const todayEarnings = [
  { id: 'e1', passenger: 'محمد علي', from: 'الزمالك', to: 'المطار', price: 150, time: '8:30 ص', status: 'completed' },
  { id: 'e2', passenger: 'سارة خالد', from: 'مدينة نصر', to: 'وسط البلد', price: 60, time: '10:15 ص', status: 'completed' },
  { id: 'e3', passenger: 'عمر حسن', from: 'التجمع', to: 'المعادي', price: 110, time: '1:00 م', status: 'completed' },
];

export default function DriverModeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [driverStatus, setDriverStatus] = useState<DriverStatus>('offline');
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [acceptedRide, setAcceptedRide] = useState<IncomingRide | null>(null);
  const [acceptCountdown, setAcceptCountdown] = useState(30);
  const [isOnline, setIsOnline] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const countdownAnim = useRef(new Animated.Value(1)).current;

  const totalEarned = todayEarnings.reduce((s, r) => s + r.price, 0);

  // Pulse animation when online
  useEffect(() => {
    if (driverStatus === 'online') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [driverStatus]);

  // Simulate incoming ride when online
  useEffect(() => {
    if (driverStatus !== 'online') return;
    const t = setTimeout(() => {
      setShowRideRequest(true);
      setAcceptCountdown(30);
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 20 }).start();
    }, 3000);
    return () => clearTimeout(t);
  }, [driverStatus]);

  // Countdown timer for ride request
  useEffect(() => {
    if (!showRideRequest) return;
    const interval = setInterval(() => {
      setAcceptCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowRideRequest(false);
          Animated.timing(slideAnim, { toValue: 300, duration: 300, useNativeDriver: true }).start();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showRideRequest]);

  const handleToggleOnline = (val: boolean) => {
    setIsOnline(val);
    if (val) {
      setDriverStatus('online');
      showAlert('أنت متصل الآن!', 'ستبدأ تلقي طلبات الرحلات');
    } else {
      setDriverStatus('offline');
      setShowRideRequest(false);
      Animated.timing(slideAnim, { toValue: 300, duration: 300, useNativeDriver: true }).start();
    }
  };

  const handleAccept = () => {
    setAcceptedRide(mockIncomingRide);
    setShowRideRequest(false);
    setDriverStatus('in_ride');
    Animated.timing(slideAnim, { toValue: 300, duration: 300, useNativeDriver: true }).start();
  };

  const handleReject = () => {
    setShowRideRequest(false);
    Animated.timing(slideAnim, { toValue: 300, duration: 300, useNativeDriver: true }).start();
  };

  const handleEndRide = () => {
    setAcceptedRide(null);
    setDriverStatus('online');
    showAlert('تمت الرحلة! 🎉', `ربحت ${mockIncomingRide.price} جنيه`);
  };

  const statusConfig = {
    offline: { label: 'غير متصل', color: Colors.textTertiary, bg: Colors.surfaceSecondary, desc: 'فعّل الوضع لتلقي الرحلات' },
    online: { label: 'متاح للرحلات', color: Colors.success, bg: Colors.successSurface, desc: 'تبحث عن رحلات قريبة منك' },
    in_ride: { label: 'في رحلة', color: Colors.primary, bg: Colors.primarySurface, desc: 'رحلة جارية الآن' },
  };
  const statusInfo = statusConfig[driverStatus];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <LinearGradient
          colors={[Colors.secondaryDark, Colors.secondary]}
          style={[styles.header, { paddingTop: insets.top + 12 }]}
        >
          <View style={styles.headerRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
              <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
            </View>
            <Text style={styles.headerTitle}>وضع السائق</Text>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <MaterialIcons name="arrow-forward" size={22} color="#fff" />
            </Pressable>
          </View>

          {/* Toggle + Pulse */}
          <View style={styles.toggleSection}>
            <View style={styles.pulseContainer}>
              <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
              <Animated.View style={[styles.pulseRing2, {
                opacity: driverStatus === 'online' ? 0.3 : 0,
                transform: [{ scale: Animated.multiply(pulseAnim, 1.3 as any) }],
              }]} />
              <View style={[styles.pulseCenter, { backgroundColor: driverStatus === 'online' ? Colors.success : Colors.textTertiary }]}>
                <MaterialIcons name="local-taxi" size={32} color="#fff" />
              </View>
            </View>
            <Text style={styles.toggleDesc}>{statusInfo.desc}</Text>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{isOnline ? 'متصل' : 'غير متصل'}</Text>
              <Switch
                value={isOnline}
                onValueChange={handleToggleOnline}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: Colors.success }}
                thumbColor="#fff"
                ios_backgroundColor="rgba(255,255,255,0.2)"
              />
            </View>
          </View>

          {/* Today Summary */}
          <View style={styles.todaySummary}>
            {[
              { label: 'أرباح اليوم', value: `${totalEarned} ج`, icon: 'attach-money', color: Colors.primary },
              { label: 'رحلات اليوم', value: String(todayEarnings.length), icon: 'directions-car', color: Colors.success },
              { label: 'تقييمي', value: '4.9 ⭐', icon: 'star', color: '#FF9500' },
              { label: 'وقت التشغيل', value: '3.5 س', icon: 'access-time', color: Colors.info },
            ].map((item, i) => (
              <View key={i} style={styles.summaryItem}>
                <Text style={[styles.summaryVal, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ===== ACTIVE RIDE (if in ride) ===== */}
        {acceptedRide ? (
          <View style={[styles.card, styles.activeRideCard]}>
            <LinearGradient colors={[Colors.primary + '20', Colors.primarySurface]} style={styles.activeRideHeader} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View style={[styles.liveBadge, { backgroundColor: Colors.success }]}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>رحلة مباشرة</Text>
              </View>
              <Text style={styles.activeRideTitle}>رحلتك الحالية</Text>
            </LinearGradient>

            <View style={styles.passengerRow}>
              <View style={styles.passengerInfo}>
                <Text style={styles.passengerName}>{acceptedRide.passenger.name}</Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={13} color={Colors.primary} />
                  <Text style={styles.ratingText}>{acceptedRide.passenger.rating}</Text>
                  <Text style={styles.ridesCount}>({acceptedRide.passenger.totalRides} رحلة)</Text>
                </View>
              </View>
              <Image source={{ uri: acceptedRide.passenger.avatar }} style={styles.passengerAvatar} contentFit="cover" />
            </View>

            <View style={styles.routeCard}>
              <View style={styles.routeRow}>
                <Text style={styles.routeAddr}>{acceptedRide.from}</Text>
                <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
              </View>
              <View style={styles.routeConnector} />
              <View style={styles.routeRow}>
                <Text style={styles.routeAddr}>{acceptedRide.to}</Text>
                <View style={[styles.routeDot, { backgroundColor: Colors.error }]} />
              </View>
            </View>

            <View style={styles.rideMetaRow}>
              <View style={styles.rideMetaItem}>
                <Text style={styles.rideMetaVal}>{acceptedRide.distance}</Text>
                <Text style={styles.rideMetaLabel}>المسافة</Text>
              </View>
              <View style={styles.rideMetaItem}>
                <Text style={styles.rideMetaVal}>{acceptedRide.duration}</Text>
                <Text style={styles.rideMetaLabel}>المدة</Text>
              </View>
              <View style={styles.rideMetaItem}>
                <Text style={[styles.rideMetaVal, { color: Colors.success }]}>{acceptedRide.price} ج</Text>
                <Text style={styles.rideMetaLabel}>الأجرة</Text>
              </View>
              <View style={styles.rideMetaItem}>
                <MaterialIcons
                  name={acceptedRide.payMethod === 'wallet' ? 'account-balance-wallet' : 'payments'}
                  size={16}
                  color={Colors.primary}
                />
                <Text style={styles.rideMetaLabel}>{acceptedRide.payMethod === 'wallet' ? 'محفظة' : 'نقدي'}</Text>
              </View>
            </View>

            <View style={styles.rideActions}>
              <Pressable style={styles.chatAction} onPress={() => router.push('/chat')}>
                <MaterialIcons name="chat" size={20} color={Colors.primary} />
                <Text style={styles.chatActionText}>محادثة</Text>
              </Pressable>
              <Pressable style={styles.callAction}>
                <MaterialIcons name="phone" size={20} color={Colors.success} />
                <Text style={styles.callActionText}>اتصال</Text>
              </Pressable>
              <Pressable style={styles.endRideBtn} onPress={handleEndRide}>
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={styles.endRideBtnText}>إنهاء الرحلة</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* ===== EARNINGS SECTION ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>رحلات اليوم</Text>
          </View>

          <View style={styles.earningsSummaryCard}>
            <View style={styles.earningsTotal}>
              <Text style={styles.earningsTotalLabel}>إجمالي الأرباح اليوم</Text>
              <Text style={styles.earningsTotalVal}>{totalEarned} جنيه</Text>
            </View>
            <View style={styles.earningsBreakdown}>
              <View style={styles.earningsBreakItem}>
                <Text style={styles.earningsBreakVal}>{todayEarnings.length}</Text>
                <Text style={styles.earningsBreakLabel}>رحلات</Text>
              </View>
              <View style={styles.earningsBreakDivider} />
              <View style={styles.earningsBreakItem}>
                <Text style={styles.earningsBreakVal}>{(totalEarned / Math.max(todayEarnings.length, 1)).toFixed(0)}</Text>
                <Text style={styles.earningsBreakLabel}>متوسط/رحلة</Text>
              </View>
              <View style={styles.earningsBreakDivider} />
              <View style={styles.earningsBreakItem}>
                <Text style={styles.earningsBreakVal}>3.5 س</Text>
                <Text style={styles.earningsBreakLabel}>وقت العمل</Text>
              </View>
            </View>
          </View>

          {todayEarnings.map(earning => (
            <View key={earning.id} style={styles.earningRow}>
              <View style={styles.earningLeft}>
                <Text style={[styles.earningPrice, { color: Colors.success }]}>+{earning.price} ج</Text>
                <Text style={styles.earningTime}>{earning.time}</Text>
              </View>
              <View style={styles.earningInfo}>
                <Text style={styles.earningPassenger}>{earning.passenger}</Text>
                <Text style={styles.earningRoute} numberOfLines={1}>{earning.from} ← {earning.to}</Text>
              </View>
              <View style={styles.earningIconWrap}>
                <MaterialIcons name="check-circle" size={22} color={Colors.success} />
              </View>
            </View>
          ))}
        </View>

        {/* ===== PERFORMANCE CARD ===== */}
        <View style={[styles.section, { paddingBottom: 20 }]}>
          <Text style={styles.sectionTitle}>أدائي هذا الأسبوع</Text>
          <View style={styles.performanceCard}>
            {[
              { label: 'قبول الرحلات', value: 94, color: Colors.success },
              { label: 'الإلغاء', value: 6, color: Colors.error },
              { label: 'رضا الراكب', value: 98, color: Colors.primary },
            ].map(perf => (
              <View key={perf.label} style={styles.perfItem}>
                <View style={styles.perfBarTrack}>
                  <View style={[styles.perfBarFill, { width: `${perf.value}%`, backgroundColor: perf.color }]} />
                </View>
                <View style={styles.perfLabelRow}>
                  <Text style={[styles.perfVal, { color: perf.color }]}>{perf.value}%</Text>
                  <Text style={styles.perfLabel}>{perf.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* ===== INCOMING RIDE MODAL ===== */}
      {showRideRequest && (
        <View style={styles.rideRequestOverlay}>
          <Animated.View style={[styles.rideRequestSheet, { transform: [{ translateY: slideAnim }] }]}>
            {/* Countdown ring */}
            <View style={styles.countdownWrap}>
              <View style={styles.countdownRing}>
                <Text style={styles.countdownNum}>{acceptCountdown}</Text>
              </View>
              <View style={styles.newRequestBadge}>
                <MaterialIcons name="notifications-active" size={14} color="#fff" />
                <Text style={styles.newRequestText}>طلب رحلة جديد!</Text>
              </View>
            </View>

            {/* Passenger */}
            <View style={styles.requestPassenger}>
              <Image source={{ uri: mockIncomingRide.passenger.avatar }} style={styles.requestAvatar} contentFit="cover" />
              <View style={styles.requestPassengerInfo}>
                <Text style={styles.requestPassengerName}>{mockIncomingRide.passenger.name}</Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={13} color={Colors.primary} />
                  <Text style={styles.ratingText}>{mockIncomingRide.passenger.rating}</Text>
                  <Text style={styles.ridesCount}>({mockIncomingRide.passenger.totalRides} رحلة)</Text>
                </View>
              </View>
              <View style={styles.etaBadge}>
                <Text style={styles.etaNum}>{mockIncomingRide.eta}</Text>
                <Text style={styles.etaLabel}>دقائق</Text>
              </View>
            </View>

            {/* Route */}
            <View style={styles.requestRoute}>
              <View style={styles.requestRouteRow}>
                <Text style={styles.requestRouteAddr}>{mockIncomingRide.from}</Text>
                <View style={[styles.requestRouteDot, { backgroundColor: Colors.success }]} />
              </View>
              <View style={styles.requestRouteConnector} />
              <View style={styles.requestRouteRow}>
                <Text style={styles.requestRouteAddr}>{mockIncomingRide.to}</Text>
                <View style={[styles.requestRouteDot, { backgroundColor: Colors.error }]} />
              </View>
            </View>

            {/* Trip Info */}
            <View style={styles.requestMetaRow}>
              <View style={[styles.requestMetaItem, { backgroundColor: Colors.primarySurface }]}>
                <MaterialIcons name="straighten" size={16} color={Colors.primary} />
                <Text style={[styles.requestMetaVal, { color: Colors.primary }]}>{mockIncomingRide.distance}</Text>
              </View>
              <View style={[styles.requestMetaItem, { backgroundColor: Colors.successSurface }]}>
                <MaterialIcons name="attach-money" size={16} color={Colors.success} />
                <Text style={[styles.requestMetaVal, { color: Colors.success }]}>{mockIncomingRide.price} ج</Text>
              </View>
              <View style={[styles.requestMetaItem, { backgroundColor: Colors.warningSurface }]}>
                <MaterialIcons
                  name={mockIncomingRide.payMethod === 'wallet' ? 'account-balance-wallet' : 'payments'}
                  size={16}
                  color={Colors.warning}
                />
                <Text style={[styles.requestMetaVal, { color: Colors.warning }]}>
                  {mockIncomingRide.payMethod === 'wallet' ? 'محفظة' : 'نقدي'}
                </Text>
              </View>
            </View>

            {/* Accept / Reject Buttons */}
            <View style={styles.requestActions}>
              <Pressable style={styles.rejectBtn} onPress={handleReject}>
                <MaterialIcons name="close" size={22} color={Colors.error} />
                <Text style={styles.rejectBtnText}>رفض</Text>
              </Pressable>
              <Pressable style={styles.acceptBtn} onPress={handleAccept}>
                <LinearGradient colors={[Colors.success, '#006644']} style={styles.acceptGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <MaterialIcons name="check" size={22} color="#fff" />
                  <Text style={styles.acceptBtnText}>قبول الرحلة</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl, fontWeight: Typography.bold, color: '#fff',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold },
  toggleSection: { alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  pulseContainer: {
    width: 110, height: 110,
    alignItems: 'center', justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 2, borderColor: Colors.success, opacity: 0.4,
  },
  pulseRing2: {
    position: 'absolute',
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 1.5, borderColor: Colors.success,
  },
  pulseCenter: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
  },
  toggleDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: 'rgba(255,255,255,0.7)',
  },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  toggleLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold, color: '#fff',
  },
  todaySummary: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    justifyContent: 'space-around',
  },
  summaryItem: { alignItems: 'center', gap: 3 },
  summaryVal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.extraBold, color: '#fff',
  },
  summaryLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: 'rgba(255,255,255,0.6)',
  },

  // ACTIVE RIDE
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    overflow: 'hidden',
    ...Shadow.md,
  },
  activeRideCard: { borderWidth: 1.5, borderColor: Colors.primary },
  activeRideHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
  activeRideTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.bold, color: '#fff',
  },
  passengerRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.base, gap: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  passengerAvatar: { width: 52, height: 52, borderRadius: 26 },
  passengerInfo: { flex: 1 },
  passengerName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, justifyContent: 'flex-end' },
  ratingText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary },
  ridesCount: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  routeCard: { padding: Spacing.base, gap: 4 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-end' },
  routeDot: { width: 12, height: 12, borderRadius: 6, flexShrink: 0 },
  routeAddr: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  routeConnector: { width: 2, height: 14, backgroundColor: Colors.border, marginRight: 5, alignSelf: 'flex-end' },
  rideMetaRow: {
    flexDirection: 'row', padding: Spacing.md,
    gap: 4, borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  rideMetaItem: { flex: 1, alignItems: 'center', gap: 2 },
  rideMetaVal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  rideMetaLabel: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textTertiary },
  rideActions: {
    flexDirection: 'row', padding: Spacing.md, gap: 8,
    borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  chatAction: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.primarySurface, borderRadius: Radius.lg, paddingVertical: 10,
  },
  chatActionText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.primary },
  callAction: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.successSurface, borderRadius: Radius.lg, paddingVertical: 10,
  },
  callActionText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.success },
  endRideBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.success, borderRadius: Radius.lg, paddingVertical: 10,
  },
  endRideBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: '#fff' },

  // SECTIONS
  section: { paddingHorizontal: Spacing.base, marginTop: Spacing.lg, gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  earningsSummaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl, overflow: 'hidden',
    ...Shadow.sm,
  },
  earningsTotal: {
    backgroundColor: Colors.secondary,
    padding: Spacing.base, alignItems: 'flex-end',
  },
  earningsTotalLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: 'rgba(255,255,255,0.7)',
  },
  earningsTotalVal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xxl, fontWeight: Typography.black, color: Colors.primary,
  },
  earningsBreakdown: {
    flexDirection: 'row', padding: Spacing.md, justifyContent: 'space-around',
  },
  earningsBreakItem: { alignItems: 'center', gap: 3 },
  earningsBreakVal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  earningsBreakLabel: {
    fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary,
  },
  earningsBreakDivider: { width: 1, backgroundColor: Colors.divider },
  earningRow: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    ...Shadow.sm,
  },
  earningIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.successSurface,
    alignItems: 'center', justifyContent: 'center',
  },
  earningInfo: { flex: 1 },
  earningPassenger: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  earningRoute: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right',
  },
  earningLeft: { alignItems: 'flex-end', gap: 2 },
  earningPrice: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold },
  earningTime: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  performanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.base,
    gap: Spacing.md, ...Shadow.sm,
  },
  perfItem: { gap: 6 },
  perfLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  perfLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textSecondary },
  perfVal: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold },
  perfBarTrack: {
    height: 8, backgroundColor: Colors.border,
    borderRadius: 4, overflow: 'hidden',
  },
  perfBarFill: { height: '100%', borderRadius: 4 },

  // RIDE REQUEST OVERLAY
  rideRequestOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  rideRequestSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.xl,
    gap: Spacing.md,
    ...Shadow.lg,
  },
  countdownWrap: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  countdownRing: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 3, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  countdownNum: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl, fontWeight: Typography.black, color: Colors.primary,
  },
  newRequestBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.error,
    borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 7,
  },
  newRequestText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.bold, color: '#fff',
  },
  requestPassenger: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  requestAvatar: { width: 56, height: 56, borderRadius: 28 },
  requestPassengerInfo: { flex: 1 },
  requestPassengerName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right',
  },
  etaBadge: {
    backgroundColor: Colors.primarySurface, borderRadius: Radius.lg,
    paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center',
  },
  etaNum: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.black, color: Colors.primary },
  etaLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.primary },
  requestRoute: {
    backgroundColor: Colors.background, borderRadius: Radius.lg,
    padding: Spacing.md, gap: 6,
  },
  requestRouteRow: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-end' },
  requestRouteDot: { width: 12, height: 12, borderRadius: 6 },
  requestRouteAddr: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  requestRouteConnector: { width: 2, height: 12, backgroundColor: Colors.border, marginRight: 5, alignSelf: 'flex-end' },
  requestMetaRow: { flexDirection: 'row', gap: 8 },
  requestMetaItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, borderRadius: Radius.lg, paddingVertical: 8,
  },
  requestMetaVal: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold },
  requestActions: { flexDirection: 'row', gap: 12 },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: Radius.full, paddingVertical: 14,
    backgroundColor: Colors.errorSurface,
    borderWidth: 1.5, borderColor: Colors.error,
  },
  rejectBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.error },
  acceptBtn: { flex: 2, borderRadius: Radius.full, overflow: 'hidden', ...Shadow.golden },
  acceptGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, gap: 8,
  },
  acceptBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: '#fff' },
});
