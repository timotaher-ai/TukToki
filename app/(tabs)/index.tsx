// Powered by OnSpace.AI — Home Screen (Dark Premium Redesign)
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { mockCarTypes, mockRideHistory } from '@/constants/mockData';
import { StatusBar } from 'expo-status-bar';

const { width: SW } = Dimensions.get('window');

// ─── Mock near tuk-tuks for the map illustration ─────────────────────────────
const NEAR_TUKS = [
  { id: 't1', x: 0.28, y: 0.40 },
  { id: 't2', x: 0.58, y: 0.28 },
  { id: 't3', x: 0.72, y: 0.58 },
];

const quickDests = [
  { id: 'd1', icon: 'work', label: 'العمل', sub: 'وسط البلد' },
  { id: 'd2', icon: 'school', label: 'الجامعة', sub: 'مدينة نصر' },
  { id: 'd3', icon: 'home', label: 'المنزل', sub: 'شارع النيل' },
  { id: 'd4', icon: 'add', label: 'إضافة مكان', sub: '' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, activeRide, unreadNotifications } = useApp();
  const [selectedCar, setSelectedCar] = useState('standard');

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Top Status Bar ─────────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 4 }]}>
        <Pressable onPress={() => router.push('/notifications')} style={styles.notifBtn}>
          <MaterialIcons name="notifications" size={22} color="#fff" />
          {unreadNotifications > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>{unreadNotifications}</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.logoWrap}>
          <Text style={styles.logoAr}>تـك توكي</Text>
          <Text style={styles.logoEn}>TAK TOCKY</Text>
        </View>

        <Pressable style={styles.menuBtn}>
          <MaterialIcons name="menu" size={22} color="#fff" />
          <View style={styles.menuDot} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >

        {/* ── Map Preview Card ───────────────────────────────────────── */}
        <View style={[styles.mapCard, { marginTop: Spacing.md }]}>
          {/* Map BG */}
          <View style={styles.mapBg}>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map(f => (
              <View key={`h${f}`} style={[styles.mapGridH, { top: `${f * 100}%` as any }]} />
            ))}
            {[0.2, 0.4, 0.6, 0.8].map(f => (
              <View key={`v${f}`} style={[styles.mapGridV, { left: `${f * 100}%` as any }]} />
            ))}
          </View>

          {/* Glow under center tuk */}
          <View style={styles.mapGlow} />

          {/* Nearby tuk-tuks */}
          {NEAR_TUKS.map(t => (
            <View key={t.id} style={[styles.nearTuk, { left: `${t.x * 100}%` as any, top: `${t.y * 100}%` as any }]}>
              <MaterialIcons name="local-taxi" size={20} color={Colors.primary} />
            </View>
          ))}

          {/* Center tuk */}
          <View style={styles.centerTuk}>
            <View style={styles.centerTukGlow} />
            <MaterialIcons name="local-taxi" size={36} color={Colors.primary} />
          </View>

          {/* Location strip */}
          <View style={styles.locationStrip}>
            <Pressable
              style={styles.mapPinBtn}
              onPress={() => router.push('/ride-booking')}
            >
              <MaterialIcons name="location-pin" size={20} color={Colors.primary} />
            </Pressable>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>الموقع الحالي</Text>
              <Text style={styles.locationValue}>شارع النيل، المعادي، القاهرة</Text>
            </View>
            <View style={styles.locationDotIcon}>
              <MaterialIcons name="my-location" size={18} color={Colors.textTertiary} />
            </View>
          </View>

          {/* Map button */}
          <Pressable
            style={styles.mapBtn}
            onPress={() => router.push('/ride-booking')}
          >
            <MaterialIcons name="map" size={16} color={Colors.textInverse} />
            <Text style={styles.mapBtnText}>تحديد على الخريطة</Text>
          </Pressable>
        </View>

        {/* ── Destination Search Card ───────────────────────────────── */}
        <View style={styles.destCard}>
          <View style={styles.destTitleRow}>
            <View style={styles.destDot} />
            <Text style={styles.destTitle}>إلى أين تريد الذهاب؟</Text>
          </View>

          <Pressable
            style={styles.searchBar}
            onPress={() => router.push('/ride-booking')}
          >
            <MaterialIcons name="search" size={18} color={Colors.textTertiary} />
            <Text style={styles.searchPlaceholder}>ابحث عن وجهتك</Text>
          </Pressable>

          {/* Quick Destinations */}
          <View style={styles.quickDestRow}>
            {quickDests.map(d => (
              <Pressable
                key={d.id}
                style={styles.quickDestItem}
                onPress={() => router.push('/ride-booking')}
              >
                <View style={[styles.quickDestIcon, d.id === 'd4' && styles.quickDestIconAdd]}>
                  <MaterialIcons
                    name={d.icon as any}
                    size={22}
                    color={d.id === 'd4' ? Colors.textTertiary : Colors.textSecondary}
                  />
                </View>
                <Text style={styles.quickDestLabel}>{d.label}</Text>
                {d.sub ? <Text style={styles.quickDestSub} numberOfLines={1}>{d.sub}</Text> : null}
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Promo Banner ─────────────────────────────────────────── */}
        <Pressable style={styles.promoBanner} onPress={() => router.push('/ride-booking')}>
          {/* Tuk image placeholder */}
          <View style={styles.promoTukWrap}>
            <LinearGradient
              colors={['transparent', Colors.primary + '30']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
            <MaterialIcons name="local-taxi" size={64} color={Colors.primary} />
          </View>
          <View style={styles.promoContent}>
            <View style={styles.promoDot} />
            <Text style={styles.promoTitle}>توصيل سريع وآمن</Text>
            <Text style={styles.promoSub}>أسعار مناسبة... رحلات مريحة</Text>
            <Pressable style={styles.promoCTA} onPress={() => router.push('/ride-booking')}>
              <MaterialIcons name="arrow-back" size={16} color={Colors.textInverse} />
              <Text style={styles.promoCTAText}>اطلب توكتك الآن</Text>
            </Pressable>
          </View>
          {/* Dots */}
          <View style={styles.promoPagination}>
            {[0, 1, 2].map(i => (
              <View key={i} style={[styles.promoPagDot, i === 0 && styles.promoPagDotActive]} />
            ))}
          </View>
        </Pressable>

        {/* ── Ride Type Section ─────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اختر نوع الرحلة</Text>
          <View style={styles.carGrid}>
            {mockCarTypes.map(car => {
              const isActive = selectedCar === car.id;
              return (
                <Pressable
                  key={car.id}
                  style={[styles.carCard, isActive && styles.carCardActive]}
                  onPress={() => setSelectedCar(car.id)}
                >
                  {car.badge ? (
                    <View style={styles.carBadge}>
                      <Text style={styles.carBadgeText}>{car.badge}</Text>
                    </View>
                  ) : null}
                  <MaterialIcons
                    name="local-taxi"
                    size={32}
                    color={isActive ? Colors.primary : Colors.textTertiary}
                  />
                  <Text style={[styles.carName, isActive && styles.carNameActive]}>{car.name}</Text>
                  <Text style={[styles.carDesc, isActive && styles.carDescActive]}>{car.desc}</Text>
                  <View style={[styles.carRadio, isActive && styles.carRadioActive]}>
                    {isActive && <View style={styles.carRadioDot} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Active Ride ───────────────────────────────────────────── */}
        {activeRide ? (
          <Pressable style={styles.activeRideCard} onPress={() => router.push('/ride-tracking')}>
            <View style={styles.liveDot} />
            <View style={styles.activeRideInfo}>
              <Text style={styles.activeRideTitle}>رحلتك جارية الآن</Text>
              <Text style={styles.activeRideDesc}>السائق {activeRide.driver?.name} · {activeRide.eta} دقائق</Text>
            </View>
            <MaterialIcons name="chevron-left" size={22} color={Colors.primary} />
          </Pressable>
        ) : null}

      </ScrollView>

      {/* ── Bottom CTA ────────────────────────────────────────────── */}
      <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + 70 }]}>
        <Pressable style={styles.ctaBtn} onPress={() => router.push('/ride-booking')}>
          <Pressable style={styles.ctaIcon} onPress={() => router.push('/ride-booking')}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.textInverse} />
          </Pressable>
          <Text style={styles.ctaText}>اطلب توكتك الآن</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // TOP BAR
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  menuBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
    position: 'relative',
  },
  menuDot: {
    position: 'absolute', top: 10, right: 10,
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5, borderColor: Colors.background,
  },
  notifBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: Colors.primary,
    borderRadius: 6, minWidth: 14, height: 14,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 2,
    borderWidth: 1.5, borderColor: Colors.background,
  },
  notifBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.textInverse },
  logoWrap: { alignItems: 'center' },
  logoAr: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.black,
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  logoEn: {
    fontFamily: 'System',
    fontSize: 9, fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 3,
    marginTop: -2,
  },

  // MAP CARD
  mapCard: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    height: 220,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
    position: 'relative',
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#12141E',
  },
  mapGridH: {
    position: 'absolute', left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  mapGridV: {
    position: 'absolute', top: 0, bottom: 0, width: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  mapGlow: {
    position: 'absolute',
    width: 120, height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '18',
    alignSelf: 'center',
    top: '30%',
    left: '35%',
  },
  nearTuk: {
    position: 'absolute',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    opacity: 0.55,
  },
  centerTuk: {
    position: 'absolute',
    alignSelf: 'center',
    top: '28%',
    left: '42%',
    alignItems: 'center', justifyContent: 'center',
  },
  centerTukGlow: {
    position: 'absolute',
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary + '22',
  },
  locationStrip: {
    position: 'absolute', bottom: 48, left: 12, right: 12,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10,
    gap: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  mapPinBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  locationInfo: { flex: 1 },
  locationLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 10, color: Colors.textTertiary,
    textAlign: 'right',
  },
  locationValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  locationDotIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  mapBtn: {
    position: 'absolute', bottom: 10, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 14, paddingVertical: 8,
    ...Shadow.goldenSm,
  },
  mapBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.bold,
    color: Colors.textInverse,
  },

  // DESTINATION CARD
  destCard: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1, borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  destTitleRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'flex-end', gap: 8,
  },
  destDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  destTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  searchBar: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.lg,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 13,
    gap: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, color: Colors.textTertiary,
    textAlign: 'right',
  },
  quickDestRow: { flexDirection: 'row', gap: Spacing.sm },
  quickDestItem: { flex: 1, alignItems: 'center', gap: 5 },
  quickDestIcon: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  quickDestIconAdd: { borderStyle: 'dashed' },
  quickDestLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.semiBold,
    color: Colors.textSecondary, textAlign: 'center',
  },
  quickDestSub: {
    fontFamily: Typography.fontFamily,
    fontSize: 10, color: Colors.textTertiary, textAlign: 'center',
  },

  // PROMO BANNER
  promoBanner: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    height: 150,
    flexDirection: 'row',
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.sm,
    position: 'relative',
  },
  promoTukWrap: {
    width: 130, height: '100%',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
  },
  promoContent: {
    flex: 1, padding: Spacing.base,
    justifyContent: 'center', alignItems: 'flex-end', gap: 5,
  },
  promoDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  promoTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.black,
    color: Colors.textPrimary,
  },
  promoSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textSecondary,
  },
  promoCTA: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 14, paddingVertical: 8,
    marginTop: 4,
    ...Shadow.goldenSm,
  },
  promoCTAText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
  promoPagination: {
    position: 'absolute', bottom: 10, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 5,
  },
  promoPagDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  promoPagDotActive: { width: 16, backgroundColor: Colors.primary },

  // RIDE TYPE
  section: { paddingHorizontal: Spacing.base, marginTop: Spacing.lg },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'right',
    marginBottom: Spacing.md,
  },
  carGrid: { flexDirection: 'row', gap: Spacing.sm },
  carCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'center', gap: 6,
    borderWidth: 1.5, borderColor: Colors.border,
    position: 'relative',
    ...Shadow.sm,
  },
  carCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceSecondary,
    ...Shadow.goldenSm,
  },
  carBadge: {
    position: 'absolute', top: -8, right: -4,
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingHorizontal: 6, paddingVertical: 2,
    ...Shadow.goldenSm,
  },
  carBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 9, fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
  carName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.bold,
    color: Colors.textTertiary, textAlign: 'center',
  },
  carNameActive: { color: Colors.textPrimary },
  carDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: 10, color: Colors.textMuted, textAlign: 'center',
  },
  carDescActive: { color: Colors.textTertiary },
  carRadio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: Colors.textMuted,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2,
  },
  carRadioActive: { borderColor: Colors.primary },
  carRadioDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  // ACTIVE RIDE
  activeRideCard: {
    marginHorizontal: Spacing.base, marginTop: Spacing.md,
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1.5, borderColor: Colors.borderGold,
  },
  liveDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.success,
    shadowColor: Colors.success, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 6, elevation: 4,
  },
  activeRideInfo: { flex: 1 },
  activeRideTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'right',
  },
  activeRideDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textSecondary, textAlign: 'right',
  },

  // CTA
  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: 17,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 12,
    ...Shadow.golden,
  },
  ctaIcon: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  ctaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.black,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
});
