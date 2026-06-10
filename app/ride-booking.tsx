// Powered by OnSpace.AI — Request TukTuk Screen (Dark Premium + Schedule + 5 Vehicle Types)
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Animated, Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import BookingMapView from '@/components/BookingMapView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { mockDriverInfo } from '@/constants/mockData';
import { Image } from 'expo-image';
import { useAlert } from '@/template';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_W } = Dimensions.get('window');

// ── 5 Vehicle Types ─────────────────────────────────────────────────────────
const vehicleTypes = [
  {
    id: 'tuk',
    name: 'توك توك',
    nameEn: 'TukTuk',
    icon: 'electric-rickshaw',
    capacity: 2,
    basePrice: '18–25',
    desc: 'سريع ومناسب للمسافات القصيرة',
    eta: '2',
    badge: 'الأشهر',
    badgeColor: Colors.primary,
    color: Colors.primary,
  },
  {
    id: 'economy',
    name: 'ملاكي توفير',
    nameEn: 'Economy',
    icon: 'directions-car',
    capacity: 4,
    basePrice: '30–45',
    desc: 'مريح واقتصادي',
    eta: '4',
    badge: null,
    color: Colors.success,
  },
  {
    id: 'van',
    name: 'فان عائلي',
    nameEn: 'Van',
    icon: 'airport-shuttle',
    capacity: 7,
    basePrice: '55–80',
    desc: 'مثالي للعائلات والمجموعات',
    eta: '6',
    badge: null,
    color: '#9B59B6',
  },
  {
    id: 'scooter',
    name: 'سكوتر',
    nameEn: 'Scooter',
    icon: 'two-wheeler',
    capacity: 1,
    basePrice: '10–18',
    desc: 'الأسرع في الزحمة',
    eta: '1',
    badge: 'الأسرع',
    badgeColor: Colors.warning,
    color: Colors.warning,
  },
  {
    id: 'truck',
    name: 'نقل خفيف',
    nameEn: 'Light Truck',
    icon: 'local-shipping',
    capacity: 2,
    basePrice: '70–120',
    desc: 'لنقل الأثاث والبضائع',
    eta: '8',
    badge: null,
    color: Colors.error,
  },
];

// ── Date/Time helpers ────────────────────────────────────────────────────────
const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const DAYS_AR   = ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];

function getDates() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { date: d, label: i === 0 ? 'اليوم' : i === 1 ? 'غداً' : DAYS_AR[d.getDay()], sub: `${d.getDate()} ${MONTHS_AR[d.getMonth()]}` };
  });
}

function getTimeSlots() {
  const slots = [];
  for (let h = 6; h < 24; h++) {
    slots.push({ h, m: 0, label: `${String(h).padStart(2,'0')}:00`, period: h < 12 ? 'ص' : h < 18 ? 'ظ' : 'م' });
    slots.push({ h, m: 30, label: `${String(h).padStart(2,'0')}:30`, period: h < 12 ? 'ص' : h < 18 ? 'ظ' : 'م' });
  }
  return slots;
}

type BookingMode = 'instant' | 'schedule';
type Step = 'main' | 'searching' | 'found';

// ── Vehicle Card ─────────────────────────────────────────────────────────────
function VehicleCard({ v, isSelected, onSelect }: { v: typeof vehicleTypes[0]; isSelected: boolean; onSelect: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 8 }),
    ]).start();
    onSelect();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable style={[vSt.card, isSelected && { borderColor: v.color, backgroundColor: v.color + '12' }]} onPress={handlePress}>
        {/* Check */}
        {isSelected && (
          <View style={[vSt.checkBadge, { backgroundColor: v.color }]}>
            <MaterialIcons name="check" size={11} color="#fff" />
          </View>
        )}

        {/* Top badge */}
        {v.badge && !isSelected && (
          <View style={[vSt.topBadge, { backgroundColor: (v.badgeColor || v.color) + '20' }]}>
            <Text style={[vSt.topBadgeText, { color: v.badgeColor || v.color }]}>{v.badge}</Text>
          </View>
        )}

        {/* Icon */}
        <View style={[vSt.iconCircle, { backgroundColor: isSelected ? v.color + '20' : Colors.surfaceElevated, borderColor: isSelected ? v.color + '60' : Colors.border }]}>
          <MaterialIcons name={v.icon as any} size={30} color={isSelected ? v.color : Colors.textTertiary} />
        </View>

        {/* Name */}
        <Text style={[vSt.name, isSelected && { color: v.color }]} numberOfLines={1}>{v.name}</Text>

        {/* Capacity */}
        <View style={vSt.capacityRow}>
          <MaterialIcons name="people" size={10} color={Colors.textMuted} />
          <Text style={vSt.capacityText}>{v.capacity}</Text>
        </View>

        {/* Price */}
        <Text style={[vSt.price, isSelected && { color: v.color }]}>{v.basePrice} ج</Text>

        {/* ETA */}
        <View style={[vSt.etaBadge, isSelected && { backgroundColor: v.color + '20' }]}>
          <MaterialIcons name="access-time" size={9} color={isSelected ? v.color : Colors.textMuted} />
          <Text style={[vSt.etaText, isSelected && { color: v.color }]}>{v.eta} دق</Text>
        </View>

        {/* Active indicator bar */}
        {isSelected && <View style={[vSt.activeBar, { backgroundColor: v.color }]} />}
      </Pressable>
    </Animated.View>
  );
}

const vSt = StyleSheet.create({
  card: {
    width: 92,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 3,
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 155,
  },
  checkBadge: {
    position: 'absolute', top: -1, left: -1,
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.background,
    zIndex: 2,
  },
  topBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 6, paddingVertical: 2,
    marginBottom: 2,
  },
  topBadgeText: { fontFamily: Typography.fontFamily, fontSize: 8, fontWeight: Typography.bold },
  iconCircle: {
    width: 58, height: 58, borderRadius: 29,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5,
    marginTop: Spacing.xs,
  },
  name: {
    fontFamily: Typography.fontFamily,
    fontSize: 11, fontWeight: Typography.bold,
    color: Colors.textSecondary, textAlign: 'center',
  },
  capacityRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  capacityText: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textMuted },
  price: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.extraBold,
    color: Colors.textPrimary,
  },
  etaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2,
  },
  etaText: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textMuted },
  activeBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 3, borderRadius: 2,
  },
});

// ── Schedule Date Picker ──────────────────────────────────────────────────────
function DatePicker({ dates, selectedIdx, onSelect }: { dates: ReturnType<typeof getDates>; selectedIdx: number; onSelect: (i: number) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
      {dates.map((d, i) => {
        const isActive = selectedIdx === i;
        return (
          <Pressable
            key={i}
            style={[dpSt.dateChip, isActive && dpSt.dateChipActive]}
            onPress={() => onSelect(i)}
          >
            <Text style={[dpSt.dateDay, isActive && dpSt.dateDayActive]}>{d.label}</Text>
            <Text style={[dpSt.dateSub, isActive && dpSt.dateSubActive]}>{d.sub}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const dpSt = StyleSheet.create({
  dateChip: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl, paddingHorizontal: 16, paddingVertical: 10,
    alignItems: 'center', minWidth: 70,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  dateChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary, ...Shadow.goldenSm },
  dateDay: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textTertiary },
  dateDayActive: { color: Colors.textInverse },
  dateSub: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textMuted },
  dateSubActive: { color: 'rgba(255,255,255,0.8)' },
});

// ── Time Picker ──────────────────────────────────────────────────────────────
function TimePicker({ slots, selectedIdx, onSelect }: { slots: ReturnType<typeof getTimeSlots>; selectedIdx: number; onSelect: (i: number) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
      {slots.map((s, i) => {
        const isActive = selectedIdx === i;
        return (
          <Pressable
            key={i}
            style={[tpSt.chip, isActive && tpSt.chipActive]}
            onPress={() => onSelect(i)}
          >
            <Text style={[tpSt.time, isActive && tpSt.timeActive]}>{s.label}</Text>
            <Text style={[tpSt.period, isActive && tpSt.periodActive]}>{s.period}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const tpSt = StyleSheet.create({
  chip: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.lg, paddingHorizontal: 14, paddingVertical: 9,
    alignItems: 'center', minWidth: 62,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.borderGold,
    ...Shadow.goldenSm,
  },
  time: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textTertiary },
  timeActive: { color: Colors.primary },
  period: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textMuted },
  periodActive: { color: Colors.primary },
});

// ── Main Component ───────────────────────────────────────────────────────────
export default function RideBookingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setActiveRide } = useApp();
  const { showAlert } = useAlert();
  const mapRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [bookingMode, setBookingMode] = useState<BookingMode>('instant');
  const [step, setStep] = useState<Step>('main');
  const [from, setFrom] = useState('شارع التحرير، الدقي');
  const [to, setTo] = useState('ميدان الجيزة');
  const [selectedVehicle, setSelectedVehicle] = useState('tuk');
  const [payMethod, setPayMethod] = useState<'cash' | 'wallet'>('cash');
  const [userLocation] = useState({ latitude: 30.0444, longitude: 31.2357 });

  // Schedule
  const dates = getDates();
  const timeSlots = getTimeSlots();
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedTimeIdx, setSelectedTimeIdx] = useState(4); // 8:00 default

  // Mode switch animation
  const modeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(modeAnim, {
      toValue: bookingMode === 'instant' ? 0 : 1,
      useNativeDriver: false, damping: 14, stiffness: 120,
    }).start();
  }, [bookingMode]);

  const selectedV = vehicleTypes.find(v => v.id === selectedVehicle) || vehicleTypes[0];

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

  const handleRequest = () => {
    if (!from.trim() || !to.trim()) {
      showAlert('تنبيه', 'يرجى تحديد نقطة الانطلاق والوجهة');
      return;
    }
    if (bookingMode === 'schedule') {
      const d = dates[selectedDateIdx];
      const t = timeSlots[selectedTimeIdx];
      showAlert(
        'تأكيد جدولة الرحلة',
        `${d.label} ${d.sub} الساعة ${t.label} ${t.period}\n${selectedV.name} من "${from}" إلى "${to}"`,
        [
          { text: 'تعديل', style: 'cancel' },
          { text: 'تأكيد الجدولة', onPress: () => setStep('searching') },
        ]
      );
      return;
    }
    setStep('searching');
    setTimeout(() => setStep('found'), 2800);
  };

  const handleAcceptDriver = () => {
    setActiveRide({ status: 'in_progress', driver: mockDriverInfo, eta: mockDriverInfo.eta });
    router.replace('/ride-tracking');
  };

  // ── Searching Screen ───────────────────────────────────────────────────────
  if (step === 'searching') {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <StatusBar style="light" />
        <View style={styles.searchingAnim}>
          <Animated.View style={[styles.searchRing3, { transform: [{ scale: Animated.multiply(pulseAnim, 1.6 as any) }], opacity: 0.08 }]} />
          <Animated.View style={[styles.searchRing2, { transform: [{ scale: Animated.multiply(pulseAnim, 1.25 as any) }], opacity: 0.15 }]} />
          <Animated.View style={[styles.searchRing, { transform: [{ scale: pulseAnim }] }]} />
          <View style={[styles.searchCenter, { borderColor: selectedV.color }]}>
            <MaterialIcons name={selectedV.icon as any} size={38} color={selectedV.color} />
          </View>
        </View>
        <Text style={styles.searchTitle}>
          {bookingMode === 'schedule' ? 'جاري تأكيد الجدولة' : `جاري البحث عن ${selectedV.name}`}
        </Text>
        <Text style={styles.searchSub}>
          {bookingMode === 'schedule'
            ? `${dates[selectedDateIdx].label} الساعة ${timeSlots[selectedTimeIdx].label}`
            : 'نبحث عن أقرب سائق متاح...'}
        </Text>
        <View style={styles.searchTips}>
          {['سائق قريب منك','موثق ومرخص','آمن ومضمون'].map(t => (
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

  // ── Found Screen ───────────────────────────────────────────────────────────
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

  // ── MAIN Screen ────────────────────────────────────────────────────────────
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Nav */}
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

      {/* Mode Switcher */}
      <View style={styles.modeSwitcherWrap}>
        <View style={styles.modeSwitcher}>
          <Animated.View
            style={[
              styles.modeSlider,
              { left: modeAnim.interpolate({ inputRange: [0, 1], outputRange: ['2%', '51%'] }) },
            ]}
          />
          <Pressable style={styles.modeBtn} onPress={() => setBookingMode('instant')}>
            <MaterialIcons
              name="flash-on"
              size={15}
              color={bookingMode === 'instant' ? Colors.textInverse : Colors.textTertiary}
            />
            <Text style={[styles.modeBtnText, bookingMode === 'instant' && styles.modeBtnTextActive]}>فورية</Text>
          </Pressable>
          <Pressable style={styles.modeBtn} onPress={() => setBookingMode('schedule')}>
            <MaterialIcons
              name="event"
              size={15}
              color={bookingMode === 'schedule' ? Colors.textInverse : Colors.textTertiary}
            />
            <Text style={[styles.modeBtnText, bookingMode === 'schedule' && styles.modeBtnTextActive]}>جدولة رحلة</Text>
          </Pressable>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapArea}>
        <BookingMapView
          mapRef={mapRef}
          userLocation={userLocation}
          locationLoading={false}
          mapExpanded={false}
          onGetLocation={() => {}}
          onToggleExpand={() => {}}
        />
      </View>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.sheetHandle} />

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* Destination */}
          <View style={styles.sheetSection}>
            <Text style={styles.sheetSectionTitle}>حدد وجهتك</Text>
            <View style={styles.locationsCard}>
              <View style={styles.locRow}>
                <Pressable
                  style={styles.swapBtn}
                  onPress={() => { setFrom(to); setTo(from); }}
                >
                  <MaterialIcons name="swap-vert" size={18} color={Colors.textTertiary} />
                </Pressable>
                <TextInput
                  style={styles.locInput}
                  value={from}
                  onChangeText={setFrom}
                  textAlign="right"
                  placeholder="نقطة الانطلاق"
                  placeholderTextColor={Colors.textMuted}
                />
                <View style={[styles.locDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.locLabel}>من</Text>
              </View>
              <View style={styles.locDivider} />
              <View style={styles.locRow}>
                <View style={{ width: 36 }} />
                <TextInput
                  style={styles.locInput}
                  value={to}
                  onChangeText={setTo}
                  textAlign="right"
                  placeholder="الوجهة"
                  placeholderTextColor={Colors.textMuted}
                />
                <View style={[styles.locDot, { backgroundColor: Colors.error }]} />
                <Text style={styles.locLabel}>إلى</Text>
              </View>
            </View>
          </View>

          {/* ── SCHEDULE SECTION ────────────────────────────── */}
          {bookingMode === 'schedule' && (
            <View style={styles.sheetSection}>
              <View style={styles.scheduleCard}>
                {/* Scheduled badge */}
                <View style={styles.scheduleHeader}>
                  <View style={styles.scheduledBadge}>
                    <MaterialIcons name="event-available" size={13} color={Colors.primary} />
                    <Text style={styles.scheduledBadgeText}>رحلة مجدولة</Text>
                  </View>
                  <Text style={styles.scheduleHeaderTitle}>اختر الموعد</Text>
                </View>

                {/* Date */}
                <View style={styles.scheduleGroup}>
                  <View style={styles.scheduleGroupHeader}>
                    <Text style={styles.scheduleGroupTitle}>اليوم</Text>
                    <MaterialIcons name="calendar-today" size={14} color={Colors.primary} />
                  </View>
                  <DatePicker dates={dates} selectedIdx={selectedDateIdx} onSelect={setSelectedDateIdx} />
                </View>

                {/* Time */}
                <View style={styles.scheduleGroup}>
                  <View style={styles.scheduleGroupHeader}>
                    <Text style={styles.scheduleGroupTitle}>الوقت</Text>
                    <MaterialIcons name="schedule" size={14} color={Colors.primary} />
                  </View>
                  <TimePicker slots={timeSlots} selectedIdx={selectedTimeIdx} onSelect={setSelectedTimeIdx} />
                </View>

                {/* Summary */}
                <View style={styles.scheduleSummary}>
                  <MaterialIcons name="notifications-active" size={14} color={Colors.primary} />
                  <Text style={styles.scheduleSummaryText}>
                    {dates[selectedDateIdx].label}، {dates[selectedDateIdx].sub} الساعة {timeSlots[selectedTimeIdx].label} {timeSlots[selectedTimeIdx].period}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Vehicle Types */}
          <View style={styles.sheetSection}>
            <View style={styles.vehicleSectionHeader}>
              <View style={[styles.vehicleSelectedBadge, { backgroundColor: selectedV.color + '15', borderColor: selectedV.color + '40' }]}>
                <MaterialIcons name={selectedV.icon as any} size={13} color={selectedV.color} />
                <Text style={[styles.vehicleSelectedText, { color: selectedV.color }]}>{selectedV.name}</Text>
              </View>
              <Text style={styles.sheetSectionTitle}>اختر وسيلة النقل</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
              {vehicleTypes.map(v => (
                <VehicleCard
                  key={v.id}
                  v={v}
                  isSelected={selectedVehicle === v.id}
                  onSelect={() => setSelectedVehicle(v.id)}
                />
              ))}
            </ScrollView>

            {/* Description */}
            <View style={[styles.vehicleDesc, { borderColor: selectedV.color + '30' }]}>
              <MaterialIcons name="info-outline" size={13} color={selectedV.color} />
              <Text style={[styles.vehicleDescText, { color: selectedV.color }]}>{selectedV.desc}</Text>
              <Text style={styles.vehicleDescCapacity}>• {selectedV.capacity} مقعد</Text>
            </View>
          </View>

          {/* Payment + Price */}
          <View style={styles.sheetSection}>
            <View style={styles.payPriceRow}>
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

              <View style={[styles.priceEstimateBox, { borderColor: selectedV.color + '40' }]}>
                <Text style={styles.priceSub}>السعر التقديري</Text>
                <Text style={[styles.priceVal, { color: selectedV.color }]}>{selectedV.basePrice} ج</Text>
                <View style={styles.priceEtaRow}>
                  <MaterialIcons name="access-time" size={10} color={Colors.textMuted} />
                  <Text style={styles.priceNote}>{selectedV.eta} دق وصول</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Request Button */}
          <View style={[styles.sheetSection, { marginBottom: Spacing.md }]}>
            <Pressable
              style={[
                styles.requestBtn,
                bookingMode === 'schedule' && styles.requestBtnSchedule,
                { shadowColor: selectedV.color },
              ]}
              onPress={handleRequest}
            >
              <MaterialIcons
                name={bookingMode === 'instant' ? 'flash-on' : 'event-available'}
                size={20}
                color={Colors.textInverse}
              />
              <Text style={styles.requestBtnText}>
                {bookingMode === 'instant' ? `طلب ${selectedV.name} الآن` : 'جدولة الرحلة'}
              </Text>
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm,
  },
  navCenter: { alignItems: 'center' },
  navTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.black, color: Colors.textPrimary,
  },
  navSub: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  offersBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  offersBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.semiBold, color: Colors.primary },

  // MODE SWITCHER
  modeSwitcherWrap: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm },
  modeSwitcher: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full, padding: 4,
    flexDirection: 'row',
    borderWidth: 1, borderColor: Colors.border,
    position: 'relative', height: 44, overflow: 'hidden',
  },
  modeSlider: {
    position: 'absolute', top: 4, width: '48%', height: 36,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    ...Shadow.goldenSm,
  },
  modeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 5, zIndex: 1,
  },
  modeBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textTertiary },
  modeBtnTextActive: { color: Colors.textInverse },

  // MAP
  mapArea: { height: 220, position: 'relative', overflow: 'hidden' },

  // BOTTOM SHEET
  bottomSheet: {
    flex: 1, backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxxl, borderTopRightRadius: Radius.xxxl,
    paddingTop: Spacing.md, borderTopWidth: 1, borderColor: Colors.border,
    ...Shadow.lg,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.md,
  },
  sheetSection: { paddingHorizontal: Spacing.base, marginBottom: Spacing.md },
  sheetSectionTitle: {
    fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'right', marginBottom: Spacing.sm,
  },

  // LOCATIONS
  locationsCard: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  locRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: 14, gap: 8,
  },
  locLabel: {
    fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold,
    color: Colors.textTertiary, width: 26, textAlign: 'right',
  },
  locInput: {
    flex: 1, fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.semiBold, color: Colors.textPrimary,
  },
  locDot: { width: 10, height: 10, borderRadius: 5 },
  locDivider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: Spacing.base },
  swapBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },

  // SCHEDULE
  scheduleCard: {
    backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.xl,
    padding: Spacing.md, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderGold + '60',
    ...Shadow.goldenSm,
  },
  scheduleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scheduleHeaderTitle: {
    fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  scheduledBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.primarySurface, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.borderGold,
  },
  scheduledBadgeText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.semiBold, color: Colors.primary },
  scheduleGroup: { gap: Spacing.sm },
  scheduleGroupHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  scheduleGroupTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textTertiary },
  scheduleSummary: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primarySurface, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderGold, justifyContent: 'flex-end',
  },
  scheduleSummaryText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.primary },

  // VEHICLE
  vehicleSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  vehicleSelectedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1,
  },
  vehicleSelectedText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold },
  vehicleDesc: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: Spacing.sm, backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.lg, padding: Spacing.sm,
    borderWidth: 1, justifyContent: 'flex-end',
  },
  vehicleDescText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.semiBold, flex: 1, textAlign: 'right' },
  vehicleDescCapacity: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted },

  // PAYMENT
  payPriceRow: { flexDirection: 'row', gap: Spacing.sm },
  payMethodBtn: {
    flex: 1, backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl, padding: Spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.border,
  },
  payMethodInfo: { flex: 1 },
  payMethodLabel: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textTertiary, textAlign: 'right' },
  payMethodValue: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.primary, textAlign: 'right' },
  priceEstimateBox: {
    flex: 1, backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.xl, padding: Spacing.md, alignItems: 'flex-end',
    borderWidth: 1.5,
  },
  priceSub: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textTertiary },
  priceVal: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.black },
  priceEtaRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  priceNote: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.textMuted },

  // REQUEST BTN
  requestBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl, paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10,
    ...Shadow.golden,
  },
  requestBtnSchedule: { backgroundColor: Colors.navy || '#1A3A5C' },
  requestBtnText: {
    fontFamily: Typography.fontFamily, fontSize: Typography.lg, fontWeight: Typography.black,
    color: Colors.textInverse, letterSpacing: 0.5,
  },

  // SEARCHING
  searchingAnim: { width: 180, height: 180, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  searchCenter: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2,
  },
  searchRing: { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: Colors.primary, opacity: 0.25 },
  searchRing2: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 1.5, borderColor: Colors.primary, opacity: 0.15 },
  searchRing3: { position: 'absolute', width: 170, height: 170, borderRadius: 85, borderWidth: 1, borderColor: Colors.primary },
  searchTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary },
  searchSub: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textTertiary },
  searchTips: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  searchTipChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.successSurface,
    borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(0,200,120,0.2)',
  },
  searchTipText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.success, fontWeight: Typography.semiBold },
  cancelSearchBtn: {
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: Spacing.xxxl, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.md,
  },
  cancelSearchText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, color: Colors.textTertiary, fontWeight: Typography.semiBold },

  // FOUND
  foundBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.successSurface,
    borderRadius: Radius.lg, padding: Spacing.base, justifyContent: 'flex-end',
    borderWidth: 1, borderColor: 'rgba(0,200,120,0.2)',
  },
  foundBannerText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.success },
  driverCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base,
    gap: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.md,
  },
  driverRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  driverAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: Colors.borderGold },
  driverInfo: { flex: 1, gap: 4 },
  driverName: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'flex-end' },
  ratingText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary },
  ridesCount: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  driverCar: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'right' },
  plateBadge: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.sm,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-end', borderWidth: 1, borderColor: Colors.border,
  },
  plateText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary, letterSpacing: 2 },
  etaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primarySurface,
    borderRadius: Radius.lg, padding: Spacing.md, justifyContent: 'flex-end',
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  etaText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.primary },
  actionBtnsRow: { flexDirection: 'row', gap: Spacing.sm },
  callActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.successSurface, borderRadius: Radius.lg, paddingVertical: 14,
    borderWidth: 1, borderColor: 'rgba(0,200,120,0.2)',
  },
  msgActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primarySurface, borderRadius: Radius.lg, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  actionBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.semiBold },
  trackBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, ...Shadow.golden,
  },
  trackBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.black, color: Colors.textInverse },
});
