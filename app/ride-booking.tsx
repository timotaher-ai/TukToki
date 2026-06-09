// Powered by OnSpace.AI — Request TukTuk Screen (Dark Premium Redesign)
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import * as Location from 'expo-location';
import BookingMapView from '@/components/BookingMapView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { mockCarTypes, mockDriverInfo } from '@/constants/mockData';
import { Image } from 'expo-image';
import { useAlert } from '@/template';
import { StatusBar } from 'expo-status-bar';

type Step = 'main' | 'searching' | 'found';

export default function RideBookingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setActiveRide } = useApp();
  const { showAlert } = useAlert();
  const mapRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [step, setStep] = useState<Step>('main');
  const [from, setFrom] = useState('شارع التحرير، الدقي');
  const [to, setTo] = useState('ميدان الجيزة');
  const [selectedCar, setSelectedCar] = useState('standard');
  const [payMethod, setPayMethod] = useState<'cash' | 'wallet'>('cash');
  const [promoCode, setPromoCode] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>({
    latitude: 30.0444, longitude: 31.2357,
  });

  const carInfo = mockCarTypes.find(c => c.id === selectedCar) || mockCarTypes[1];

  useEffect(() => {
    if (step === 'searching') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.5, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [step]);

  const handleGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      setFrom('موقعي الحالي (GPS)');
    } catch {
      setFrom('القاهرة، مصر');
    }
  };

  const handleRequest = () => {
    if (!from.trim() || !to.trim()) {
      showAlert('تنبيه', 'يرجى تحديد نقطة الانطلاق والوجهة');
      return;
    }
    setStep('searching');
    setTimeout(() => setStep('found'), 2800);
  };

  const handleAcceptDriver = () => {
    setActiveRide({ status: 'in_progress', driver: mockDriverInfo, eta: mockDriverInfo.eta });
    router.replace('/ride-tracking');
  };

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  if (step === 'searching') {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <StatusBar style="light" />
        <View style={styles.searchingAnim}>
          <Animated.View style={[styles.searchRing3, { transform: [{ scale: Animated.multiply(pulseAnim, 1.6 as any) }], opacity: 0.08 }]} />
          <Animated.View style={[styles.searchRing2, { transform: [{ scale: Animated.multiply(pulseAnim, 1.25 as any) }], opacity: 0.15 }]} />
          <Animated.View style={[styles.searchRing, { transform: [{ scale: pulseAnim }] }]} />
          <View style={styles.searchCenter}>
            <MaterialIcons name="local-taxi" size={40} color={Colors.primary} />
          </View>
        </View>
        <Text style={styles.searchTitle}>جاري البحث عن توكتك</Text>
        <Text style={styles.searchSub}>نبحث عن أقرب سائق متاح لك...</Text>
        <View style={styles.searchTips}>
          {['سائق قريب منك', 'موثق ومرخص', 'آمن ومضمون'].map(t => (
            <View key={t} style={styles.searchTipChip}>
              <MaterialIcons name="check-circle" size={13} color={Colors.success} />
              <Text style={styles.searchTipText}>{t}</Text>
            </View>
          ))}
        </View>
        <Pressable style={styles.cancelSearchBtn} onPress={() => setStep('main')}>
          <Text style={styles.cancelSearchText}>إلغاء البحث</Text>
        </Pressable>
      </View>
    );
  }

  if (step === 'found') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <View style={[styles.topNav, { paddingTop: Spacing.md }]}>
          <View style={styles.offersBtn} />
          <View style={styles.navCenter}>
            <Text style={styles.navTitle}>تم إيجاد سائق</Text>
            <Text style={styles.navSub}>رحلتك تبدأ الآن</Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: Spacing.base, gap: Spacing.md, paddingBottom: 40 }}>
          <View style={styles.foundBanner}>
            <MaterialIcons name="check-circle" size={20} color={Colors.success} />
            <Text style={styles.foundBannerText}>تم العثور على سائق!</Text>
          </View>

          <View style={styles.driverCard}>
            <View style={styles.driverRow}>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{mockDriverInfo.name}</Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={14} color={Colors.primary} />
                  <Text style={styles.ratingText}>{mockDriverInfo.rating}</Text>
                  <Text style={styles.ridesCount}>({mockDriverInfo.totalRides} رحلة)</Text>
                </View>
                <Text style={styles.driverCar}>{mockDriverInfo.car}</Text>
                <View style={styles.plateBadge}>
                  <Text style={styles.plateText}>{mockDriverInfo.plate}</Text>
                </View>
              </View>
              <Image source={{ uri: mockDriverInfo.avatar }} style={styles.driverAvatar} contentFit="cover" />
            </View>
            <View style={styles.etaRow}>
              <MaterialIcons name="access-time" size={16} color={Colors.primary} />
              <Text style={styles.etaText}>السائق على بعد {mockDriverInfo.eta} دقائق منك</Text>
            </View>
          </View>

          <View style={styles.actionBtnsRow}>
            <Pressable style={styles.callActionBtn}>
              <MaterialIcons name="phone" size={20} color={Colors.success} />
              <Text style={[styles.actionBtnText, { color: Colors.success }]}>اتصال</Text>
            </Pressable>
            <Pressable style={styles.msgActionBtn} onPress={() => router.push('/chat')}>
              <MaterialIcons name="chat" size={20} color={Colors.primary} />
              <Text style={[styles.actionBtnText, { color: Colors.primary }]}>رسالة</Text>
            </Pressable>
          </View>

          <Pressable style={styles.trackBtn} onPress={handleAcceptDriver}>
            <Text style={styles.trackBtnText}>تتبع الرحلة</Text>
            <MaterialIcons name="location-on" size={20} color={Colors.textInverse} />
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* ── Top Nav ──────────────────────────────────────────── */}
      <View style={[styles.topNav, { paddingTop: Spacing.md }]}>
        <Pressable style={styles.offersBtn}>
          <MaterialIcons name="local-offer" size={16} color={Colors.primary} />
          <Text style={styles.offersBtnText}>العروض</Text>
        </Pressable>
        <View style={styles.navCenter}>
          <Text style={styles.navTitle}>طلب توكتك</Text>
          <Text style={styles.navSub}>رحلتك تبدأ من هنا</Text>
        </View>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-forward" size={20} color={Colors.textSecondary} />
        </Pressable>
      </View>

      {/* ── Map ──────────────────────────────────────────────── */}
      <View style={styles.mapArea}>
        <BookingMapView
          mapRef={mapRef}
          userLocation={userLocation}
          locationLoading={false}
          mapExpanded={false}
          onGetLocation={handleGetLocation}
          onToggleExpand={() => {}}
        />
        {/* Current Location Button */}
        <Pressable style={styles.myLocBtn} onPress={handleGetLocation}>
          <MaterialIcons name="my-location" size={16} color={Colors.textPrimary} />
          <Text style={styles.myLocText}>موقعي الحالي</Text>
        </Pressable>
      </View>

      {/* ── Bottom Sheet ─────────────────────────────────────── */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.sheetHandle} />

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* Destination Selector */}
          <View style={styles.sheetSection}>
            <Text style={styles.sheetSectionTitle}>حدد وجهتك</Text>
            <View style={styles.locationsCard}>
              {/* From */}
              <View style={styles.locRow}>
                <Pressable style={styles.swapBtn} onPress={swapLocations}>
                  <MaterialIcons name="swap-vert" size={18} color={Colors.textTertiary} />
                </Pressable>
                <TextInput
                  style={styles.locInput}
                  value={from}
                  onChangeText={setFrom}
                  textAlign="right"
                  placeholder="نقطة الانطلاق"
                  placeholderTextColor={Colors.textMuted}
                  returnKeyType="next"
                />
                <View style={[styles.locDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.locLabel}>من</Text>
              </View>
              <View style={styles.locDivider} />
              {/* To */}
              <View style={styles.locRow}>
                <View style={{ width: 36 }} />
                <TextInput
                  style={styles.locInput}
                  value={to}
                  onChangeText={setTo}
                  textAlign="right"
                  placeholder="الوجهة"
                  placeholderTextColor={Colors.textMuted}
                  returnKeyType="done"
                />
                <View style={[styles.locDot, { backgroundColor: Colors.error }]} />
                <Text style={styles.locLabel}>إلى</Text>
              </View>
            </View>
          </View>

          {/* Tuk-Tuk Type */}
          <View style={styles.sheetSection}>
            <Text style={styles.sheetSectionTitle}>اختر نوع التوكتك</Text>
            <View style={styles.carGrid}>
              {mockCarTypes.map(car => {
                const isActive = selectedCar === car.id;
                return (
                  <Pressable
                    key={car.id}
                    style={[styles.carCard, isActive && styles.carCardActive]}
                    onPress={() => setSelectedCar(car.id)}
                  >
                    {isActive && (
                      <View style={styles.carCheck}>
                        <MaterialIcons name="check" size={12} color={Colors.textInverse} />
                      </View>
                    )}
                    <MaterialIcons name="local-taxi" size={28} color={isActive ? Colors.primary : Colors.textTertiary} />
                    <Text style={[styles.carPassengers]}>
                      <MaterialIcons name="person" size={11} color={Colors.textTertiary} /> {car.capacity}
                    </Text>
                    <Text style={[styles.carName, isActive && styles.carNameActive]}>{car.name}</Text>
                    <Text style={styles.carDesc}>{car.desc}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Payment + Price */}
          <View style={styles.sheetSection}>
            <View style={styles.payPriceRow}>
              {/* Pay method */}
              <Pressable
                style={styles.payMethodBtn}
                onPress={() => setPayMethod(p => p === 'cash' ? 'wallet' : 'cash')}
              >
                <MaterialIcons
                  name={payMethod === 'cash' ? 'payments' : 'account-balance-wallet'}
                  size={18}
                  color={Colors.primary}
                />
                <View style={styles.payMethodInfo}>
                  <Text style={styles.payMethodLabel}>طريقة الدفع</Text>
                  <Text style={styles.payMethodValue}>{payMethod === 'cash' ? 'كاش' : 'محفظة'}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-down" size={18} color={Colors.textTertiary} />
              </Pressable>

              {/* Price estimate */}
              <View style={styles.priceEstimateBox}>
                <View style={styles.priceInfoIcon}>
                  <MaterialIcons name="info-outline" size={12} color={Colors.textTertiary} />
                </View>
                <Text style={styles.priceSub}>تقدير السعر</Text>
                <Text style={styles.priceVal}>22 - 18 ج.م</Text>
                <Text style={styles.priceNote}>السعر تقريبي وقد يتغير</Text>
              </View>
            </View>
          </View>

          {/* Promo Code */}
          <View style={[styles.sheetSection, { marginBottom: Spacing.base }]}>
            <Pressable style={styles.promoRow}>
              <MaterialIcons name="sell" size={16} color={Colors.textTertiary} style={{ transform: [{ rotate: '90deg' }] }} />
              <Text style={styles.promoPlaceholder}>
                {promoCode || 'لديك كود خصم؟'}
              </Text>
            </Pressable>
          </View>

          {/* Request Button */}
          <View style={styles.sheetSection}>
            <Pressable style={styles.requestBtn} onPress={handleRequest}>
              <Text style={styles.requestBtnText}>طلب توكتك</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centerContent: { alignItems: 'center', justifyContent: 'center', gap: Spacing.xl },

  // NAV
  topNav: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm,
  },
  navCenter: { alignItems: 'center' },
  navTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.black,
    color: Colors.textPrimary,
  },
  navSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textTertiary,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  offersBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  offersBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.semiBold,
    color: Colors.primary,
  },

  // MAP
  mapArea: {
    height: 260,
    position: 'relative',
    overflow: 'hidden',
  },
  myLocBtn: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.md,
  },
  myLocText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },

  // BOTTOM SHEET
  bottomSheet: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxxl,
    borderTopRightRadius: Radius.xxxl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderColor: Colors.border,
    ...Shadow.lg,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetSection: { paddingHorizontal: Spacing.base, marginBottom: Spacing.md },
  sheetSectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'right',
    marginBottom: Spacing.sm,
  },

  // LOCATIONS CARD
  locationsCard: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  locRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    gap: 8,
  },
  locLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold,
    color: Colors.textTertiary, width: 26, textAlign: 'right',
  },
  locInput: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  locDot: { width: 10, height: 10, borderRadius: 5 },
  locDivider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: Spacing.base },
  swapBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },

  // CAR GRID
  carGrid: { flexDirection: 'row', gap: Spacing.sm },
  carCard: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl, padding: Spacing.md,
    alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.border,
    position: 'relative',
  },
  carCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceElevated,
    ...Shadow.goldenSm,
  },
  carCheck: {
    position: 'absolute', top: -6, left: -6,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.background,
  },
  carPassengers: {
    fontFamily: Typography.fontFamily,
    fontSize: 10, color: Colors.textTertiary,
  },
  carName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.bold,
    color: Colors.textTertiary, textAlign: 'center',
  },
  carNameActive: { color: Colors.textPrimary },
  carDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: 9, color: Colors.textMuted, textAlign: 'center',
  },

  // PAY + PRICE
  payPriceRow: { flexDirection: 'row', gap: Spacing.sm },
  payMethodBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  payMethodInfo: { flex: 1 },
  payMethodLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 10, color: Colors.textTertiary,
    textAlign: 'right',
  },
  payMethodValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.primary, textAlign: 'right',
  },
  priceEstimateBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'flex-end',
    borderWidth: 1, borderColor: Colors.border,
    position: 'relative',
  },
  priceInfoIcon: {
    position: 'absolute', top: 10, left: 10,
  },
  priceSub: {
    fontFamily: Typography.fontFamily,
    fontSize: 10, color: Colors.textTertiary,
  },
  priceVal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.black,
    color: Colors.textPrimary,
  },
  priceNote: {
    fontFamily: Typography.fontFamily,
    fontSize: 9, color: Colors.textMuted, textAlign: 'right',
  },

  // PROMO
  promoRow: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.lg,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: 13,
    gap: 10,
    borderWidth: 1, borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  promoPlaceholder: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: Colors.textTertiary,
    textAlign: 'right',
  },

  // REQUEST BTN
  requestBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.golden,
  },
  requestBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.black,
    color: Colors.textInverse,
    letterSpacing: 0.5,
  },

  // SEARCHING
  searchingAnim: {
    width: 180, height: 180,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  searchCenter: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.borderGold,
  },
  searchRing: {
    position: 'absolute',
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 2, borderColor: Colors.primary,
    opacity: 0.25,
  },
  searchRing2: {
    position: 'absolute',
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 1.5, borderColor: Colors.primary,
    opacity: 0.15,
  },
  searchRing3: {
    position: 'absolute',
    width: 170, height: 170, borderRadius: 85,
    borderWidth: 1, borderColor: Colors.primary,
  },
  searchTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl, fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  searchSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: Colors.textTertiary,
  },
  searchTips: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  searchTipChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.successSurface,
    borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(0,200,120,0.2)',
  },
  searchTipText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.success,
    fontWeight: Typography.semiBold,
  },
  cancelSearchBtn: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xxxl, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.border,
    marginTop: Spacing.md,
  },
  cancelSearchText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, color: Colors.textTertiary,
    fontWeight: Typography.semiBold,
  },

  // FOUND
  foundBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.successSurface,
    borderRadius: Radius.lg, padding: Spacing.base,
    justifyContent: 'flex-end',
    borderWidth: 1, borderColor: 'rgba(0,200,120,0.2)',
  },
  foundBannerText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.success,
  },
  driverCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.base,
    gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.md,
  },
  driverRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  driverAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: Colors.borderGold },
  driverInfo: { flex: 1, gap: 4 },
  driverName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'flex-end' },
  ratingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary,
  },
  ridesCount: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  driverCar: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'right',
  },
  plateBadge: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.sm,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-end',
    borderWidth: 1, borderColor: Colors.border,
  },
  plateText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary, letterSpacing: 2,
  },
  etaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primarySurface, borderRadius: Radius.lg,
    padding: Spacing.md, justifyContent: 'flex-end',
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  etaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.primary,
  },
  actionBtnsRow: { flexDirection: 'row', gap: Spacing.sm },
  callActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.successSurface,
    borderRadius: Radius.lg, paddingVertical: 14,
    borderWidth: 1, borderColor: 'rgba(0,200,120,0.2)',
  },
  msgActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primarySurface,
    borderRadius: Radius.lg, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  actionBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.semiBold,
  },
  trackBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    ...Shadow.golden,
  },
  trackBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.black, color: Colors.textInverse,
  },
});
