// Powered by OnSpace.AI — رحلاتي المجدولة (Scheduled Rides) — Dark Premium
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, Animated, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAlert } from '@/template';
import { StatusBar } from 'expo-status-bar';

// ── Types ────────────────────────────────────────────────────────────────────
type ScheduledStatus = 'upcoming' | 'notified' | 'cancelled';

interface ScheduledRide {
  id: string;
  from: string;
  to: string;
  date: string;
  dateEn: Date;
  time: string;
  vehicle: string;
  vehicleIcon: string;
  vehicleColor: string;
  estimatedPrice: string;
  payMethod: string;
  status: ScheduledStatus;
  notified30: boolean;
  notified60: boolean;
}

// ── Mock scheduled rides ─────────────────────────────────────────────────────
const now = new Date();
const makeDate = (daysAhead: number, h: number, m: number) => {
  const d = new Date(now);
  d.setDate(now.getDate() + daysAhead);
  d.setHours(h, m, 0, 0);
  return d;
};

const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const DAYS_AR   = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

function formatDate(d: Date) {
  return `${DAYS_AR[d.getDay()]}، ${d.getDate()} ${MONTHS_AR[d.getMonth()]}`;
}
function formatTime(d: Date) {
  const h = d.getHours(), m = d.getMinutes();
  const period = h < 12 ? 'ص' : h < 18 ? 'ظ' : 'م';
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} ${period}`;
}

const initRides: ScheduledRide[] = [
  {
    id: 'sr1',
    from: 'شارع النيل، المعادي',
    to: 'مطار القاهرة الدولي',
    date: formatDate(makeDate(0, 14, 30)),
    dateEn: makeDate(0, 14, 30),
    time: formatTime(makeDate(0, 14, 30)),
    vehicle: 'ملاكي توفير', vehicleIcon: 'directions-car', vehicleColor: Colors.success,
    estimatedPrice: '140–180',
    payMethod: 'محفظة',
    status: 'upcoming',
    notified30: false, notified60: false,
  },
  {
    id: 'sr2',
    from: 'التجمع الخامس',
    to: 'الجامعة الأمريكية',
    date: formatDate(makeDate(1, 8, 0)),
    dateEn: makeDate(1, 8, 0),
    time: formatTime(makeDate(1, 8, 0)),
    vehicle: 'توك توك', vehicleIcon: 'electric-rickshaw', vehicleColor: Colors.primary,
    estimatedPrice: '45–60',
    payMethod: 'كاش',
    status: 'upcoming',
    notified30: false, notified60: false,
  },
  {
    id: 'sr3',
    from: 'المهندسين',
    to: 'مول مصر، 6 أكتوبر',
    date: formatDate(makeDate(2, 16, 0)),
    dateEn: makeDate(2, 16, 0),
    time: formatTime(makeDate(2, 16, 0)),
    vehicle: 'فان عائلي', vehicleIcon: 'airport-shuttle', vehicleColor: '#9B59B6',
    estimatedPrice: '80–110',
    payMethod: 'كاش',
    status: 'upcoming',
    notified30: false, notified60: false,
  },
  {
    id: 'sr4',
    from: 'الزمالك',
    to: 'مدينة نصر',
    date: formatDate(makeDate(-1, 9, 0)),
    dateEn: makeDate(-1, 9, 0),
    time: formatTime(makeDate(-1, 9, 0)),
    vehicle: 'سكوتر', vehicleIcon: 'two-wheeler', vehicleColor: Colors.warning,
    estimatedPrice: '25–35',
    payMethod: 'محفظة',
    status: 'notified',
    notified30: true, notified60: true,
  },
];

// ── Countdown Hook ────────────────────────────────────────────────────────────
function useCountdown(targetDate: Date) {
  const [remaining, setRemaining] = useState(() => targetDate.getTime() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      setRemaining(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (remaining <= 0) return { expired: true, text: 'انتهى', days: 0, hours: 0, mins: 0, secs: 0 };

  const totalSecs = Math.floor(remaining / 1000);
  const days  = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins  = Math.floor((totalSecs % 3600) / 60);
  const secs  = totalSecs % 60;

  let text = '';
  if (days > 0) text = `${days} يوم ${hours} ساعة`;
  else if (hours > 0) text = `${hours} س ${mins} د`;
  else if (mins > 0) text = `${mins} د ${secs} ث`;
  else text = `${secs} ثانية`;

  return { expired: false, text, days, hours, mins, secs };
}

// ── Ride Card ─────────────────────────────────────────────────────────────────
function RideCard({
  ride,
  onEdit,
  onCancel,
}: {
  ride: ScheduledRide;
  onEdit: () => void;
  onCancel: () => void;
}) {
  const countdown = useCountdown(ride.dateEn);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!countdown.expired && countdown.hours === 0 && countdown.mins <= 60) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.06, duration: 900, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulse.stopAnimation?.();
    }
  }, [countdown.mins, countdown.hours]);

  const isCancelled = ride.status === 'cancelled';
  const isExpired   = countdown.expired;
  const isSoon      = !isExpired && !isCancelled && countdown.hours === 0 && countdown.mins <= 60;

  const statusColor = isCancelled ? Colors.error
    : isExpired ? Colors.textMuted
    : isSoon ? Colors.warning
    : Colors.success;

  const statusLabel = isCancelled ? 'ملغاة'
    : isExpired ? 'انتهت'
    : isSoon ? 'قريباً'
    : 'مجدولة';

  return (
    <Animated.View style={[
      cardSt.root,
      isCancelled && cardSt.cancelled,
      isSoon && { borderColor: Colors.warning + '60', transform: [{ scale: pulse }] },
      { borderColor: isCancelled ? Colors.error + '30' : isSoon ? Colors.warning + '40' : Colors.border },
    ]}>
      {/* Top bar */}
      <View style={cardSt.topBar}>
        <View style={[cardSt.statusPill, { backgroundColor: statusColor + '20' }]}>
          <View style={[cardSt.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[cardSt.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>

        {/* Countdown */}
        {!isCancelled && !isExpired && (
          <View style={[cardSt.countdownPill, isSoon && { backgroundColor: Colors.warningSurface }]}>
            <MaterialIcons name="timer" size={12} color={isSoon ? Colors.warning : Colors.textTertiary} />
            <Text style={[cardSt.countdownText, isSoon && { color: Colors.warning }]}>
              {countdown.text}
            </Text>
          </View>
        )}
      </View>

      {/* Route */}
      <View style={cardSt.routeSection}>
        <View style={cardSt.routeRow}>
          <View style={[cardSt.routeDot, { backgroundColor: Colors.success }]} />
          <Text style={cardSt.routeText} numberOfLines={1}>{ride.from}</Text>
          <Text style={cardSt.routeLabel}>من</Text>
        </View>
        <View style={cardSt.routeConnector}>
          <View style={cardSt.routeLine} />
          <MaterialIcons name="arrow-downward" size={12} color={Colors.textMuted} />
        </View>
        <View style={cardSt.routeRow}>
          <View style={[cardSt.routeDot, { backgroundColor: Colors.error }]} />
          <Text style={cardSt.routeText} numberOfLines={1}>{ride.to}</Text>
          <Text style={cardSt.routeLabel}>إلى</Text>
        </View>
      </View>

      {/* Details strip */}
      <View style={cardSt.detailsStrip}>
        <View style={cardSt.detailItem}>
          <MaterialIcons name="schedule" size={13} color={Colors.primary} />
          <Text style={cardSt.detailText}>{ride.time}</Text>
        </View>
        <View style={cardSt.detailDivider} />
        <View style={cardSt.detailItem}>
          <MaterialIcons name="calendar-today" size={13} color={Colors.primary} />
          <Text style={cardSt.detailText}>{ride.date}</Text>
        </View>
        <View style={cardSt.detailDivider} />
        <View style={cardSt.detailItem}>
          <MaterialIcons name={ride.vehicleIcon as any} size={13} color={ride.vehicleColor} />
          <Text style={[cardSt.detailText, { color: ride.vehicleColor }]}>{ride.vehicle}</Text>
        </View>
      </View>

      {/* Price + Pay */}
      <View style={cardSt.priceRow}>
        <View style={[cardSt.payBadge, { backgroundColor: Colors.primarySurface }]}>
          <MaterialIcons name={ride.payMethod === 'محفظة' ? 'account-balance-wallet' : 'payments'} size={12} color={Colors.primary} />
          <Text style={cardSt.payText}>{ride.payMethod}</Text>
        </View>
        <View style={cardSt.pricePill}>
          <Text style={cardSt.priceLabel}>التقدير</Text>
          <Text style={cardSt.priceVal}>{ride.estimatedPrice} ج</Text>
        </View>
      </View>

      {/* Notification indicators */}
      {!isCancelled && !isExpired && (
        <View style={cardSt.notifRow}>
          <View style={[cardSt.notifPill, ride.notified60 && cardSt.notifPillActive]}>
            <MaterialIcons name={ride.notified60 ? 'notifications-active' : 'notifications-none'} size={11} color={ride.notified60 ? Colors.success : Colors.textMuted} />
            <Text style={[cardSt.notifPillText, ride.notified60 && { color: Colors.success }]}>
              {ride.notified60 ? 'تم الإشعار قبل ساعة' : 'إشعار قبل ساعة'}
            </Text>
          </View>
          <View style={[cardSt.notifPill, ride.notified30 && cardSt.notifPillActive]}>
            <MaterialIcons name={ride.notified30 ? 'notifications-active' : 'notifications-none'} size={11} color={ride.notified30 ? Colors.success : Colors.textMuted} />
            <Text style={[cardSt.notifPillText, ride.notified30 && { color: Colors.success }]}>
              {ride.notified30 ? 'تم الإشعار قبل ٣٠ دقيقة' : 'إشعار قبل ٣٠ دقيقة'}
            </Text>
          </View>
        </View>
      )}

      {/* Actions */}
      {!isCancelled && !isExpired && (
        <View style={cardSt.actions}>
          <Pressable style={cardSt.cancelBtn} onPress={onCancel}>
            <MaterialIcons name="close" size={15} color={Colors.error} />
            <Text style={cardSt.cancelText}>إلغاء الرحلة</Text>
          </Pressable>
          <Pressable style={cardSt.editBtn} onPress={onEdit}>
            <MaterialIcons name="edit" size={15} color={Colors.primary} />
            <Text style={cardSt.editText}>تعديل الموعد</Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
}

const cardSt = StyleSheet.create({
  root: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, gap: Spacing.sm,
    borderWidth: 1.5, ...Shadow.sm,
  },
  cancelled: { opacity: 0.55 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold },
  countdownPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.border,
  },
  countdownText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.textSecondary },

  // Route
  routeSection: { backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.lg, padding: Spacing.md, gap: 4 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  routeText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textPrimary, textAlign: 'right' },
  routeLabel: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textMuted, width: 20, textAlign: 'right' },
  routeConnector: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 },
  routeLine: { width: 1, height: 10, backgroundColor: Colors.border, marginRight: 4, marginLeft: 14 },

  // Details
  detailsStrip: {
    flexDirection: 'row', backgroundColor: Colors.background,
    borderRadius: Radius.lg, paddingHorizontal: Spacing.sm, paddingVertical: 10,
    alignItems: 'center', justifyContent: 'space-around',
    borderWidth: 1, borderColor: Colors.border,
  },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  detailText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.semiBold, color: Colors.textSecondary },
  detailDivider: { width: 1, height: 16, backgroundColor: Colors.divider },

  // Price
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  payBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.borderGold },
  payText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.primary, fontWeight: Typography.semiBold },
  pricePill: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  priceLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  priceVal: { fontFamily: Typography.fontFamily, fontSize: Typography.lg, fontWeight: Typography.black, color: Colors.primary },

  // Notif indicators
  notifRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  notifPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: Colors.border },
  notifPillActive: { backgroundColor: Colors.successSurface, borderColor: 'rgba(0,200,120,0.2)' },
  notifPillText: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.textMuted },

  // Actions
  actions: { flexDirection: 'row', gap: Spacing.sm },
  editBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.primarySurface, borderRadius: Radius.full,
    paddingVertical: 11, borderWidth: 1, borderColor: Colors.borderGold,
  },
  editText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.primary },
  cancelBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.errorSurface, borderRadius: Radius.full,
    paddingVertical: 11, borderWidth: 1, borderColor: Colors.error + '30',
  },
  cancelText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.error },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ScheduledRidesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [rides, setRides] = useState<ScheduledRide[]>(initRides);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'cancelled'>('all');

  const filtered = rides.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return r.status !== 'cancelled';
    return r.status === 'cancelled';
  });

  const upcomingCount = rides.filter(r => r.status !== 'cancelled' && r.dateEn.getTime() > Date.now()).length;

  const handleCancel = (id: string) => {
    const ride = rides.find(r => r.id === id);
    if (!ride) return;
    showAlert(
      'إلغاء الرحلة المجدولة',
      `هل تريد إلغاء رحلة "${ride.from}" إلى "${ride.to}"؟`,
      [
        { text: 'تراجع', style: 'cancel' },
        {
          text: 'إلغاء الرحلة',
          style: 'destructive',
          onPress: () => setRides(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r)),
        },
      ]
    );
  };

  const handleEdit = (id: string) => {
    showAlert('تعديل الموعد', 'سيتم فتح واجهة التعديل قريباً — الآن يمكنك إلغاء الرحلة وإنشاء رحلة جديدة من شاشة الحجز', [
      { text: 'حسناً' },
      { text: 'إلغاء وإعادة الحجز', onPress: () => { handleCancel(id); router.push('/ride-booking'); } },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Header ─────────────────────────────────────────── */}
      <LinearGradient
        colors={['#0D1B3E', '#162550']}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          {/* Badge */}
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{upcomingCount} رحلة</Text>
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>رحلاتي المجدولة</Text>
            <Text style={styles.headerSub}>Scheduled Rides</Text>
          </View>

          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>

        {/* Info row */}
        <View style={styles.infoRow}>
          <View style={styles.infoPill}>
            <MaterialIcons name="notifications-active" size={13} color={Colors.warning} />
            <Text style={styles.infoText}>إشعارات تلقائية قبل الرحلة بساعة و٣٠ دقيقة</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {([
            { id: 'all', label: 'الكل', icon: 'list' },
            { id: 'upcoming', label: 'القادمة', icon: 'event' },
            { id: 'cancelled', label: 'الملغاة', icon: 'cancel' },
          ] as const).map(f => {
            const isActive = filter === f.id;
            return (
              <Pressable
                key={f.id}
                style={[styles.filterBtn, isActive && styles.filterBtnActive]}
                onPress={() => setFilter(f.id)}
              >
                <MaterialIcons name={f.icon as any} size={13} color={isActive ? '#fff' : 'rgba(255,255,255,0.5)'} />
                <Text style={[styles.filterText, isActive && { color: '#fff' }]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </LinearGradient>

      {/* ── List ───────────────────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={r => r.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.base, gap: Spacing.md, paddingBottom: 40 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialIcons name="event-busy" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>لا توجد رحلات مجدولة</Text>
            <Text style={styles.emptySub}>أنشئ رحلة مجدولة من شاشة الحجز</Text>
            <Pressable style={styles.emptyBtn} onPress={() => router.push('/ride-booking')}>
              <MaterialIcons name="add" size={18} color={Colors.textInverse} />
              <Text style={styles.emptyBtnText}>جدولة رحلة جديدة</Text>
            </Pressable>
          </View>
        )}
        renderItem={({ item }) => (
          <RideCard
            ride={item}
            onEdit={() => handleEdit(item.id)}
            onCancel={() => handleCancel(item.id)}
          />
        )}
      />

      {/* ── FAB ────────────────────────────────────────────── */}
      <Pressable
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => router.push('/ride-booking')}
      >
        <MaterialIcons name="add" size={22} color={Colors.textInverse} />
        <Text style={styles.fabText}>رحلة جديدة</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm, gap: Spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.bold, color: '#fff' },
  headerSub: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.5)' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  countBadge: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5, ...Shadow.goldenSm },
  countBadgeText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, fontWeight: Typography.bold, color: Colors.textInverse },

  infoRow: {},
  infoPill: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: Colors.warningSurface, borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'center',
    borderWidth: 1, borderColor: Colors.warning + '30',
  },
  infoText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.warning },

  filterRow: { flexDirection: 'row', gap: 8 },
  filterBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 9, borderRadius: Radius.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontFamily: Typography.fontFamily, fontSize: 11, fontWeight: Typography.semiBold, color: 'rgba(255,255,255,0.5)' },

  emptyState: { flex: 1, alignItems: 'center', gap: Spacing.md, paddingTop: 80 },
  emptyTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  emptySub: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textTertiary },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl, paddingVertical: 14, marginTop: Spacing.md,
    ...Shadow.golden,
  },
  emptyBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textInverse },

  fab: {
    position: 'absolute', right: Spacing.base,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl, paddingVertical: 15,
    ...Shadow.golden,
  },
  fabText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textInverse },
});
