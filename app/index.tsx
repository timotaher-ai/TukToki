// Powered by OnSpace.AI — Teek Touky Dark Splash Screen (Premium Animated)
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const bgFade      = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide  = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const btnsSlide   = useRef(new Animated.Value(50)).current;
  const btnsOpacity = useRef(new Animated.Value(0)).current;
  const tukX        = useRef(new Animated.Value(-100)).current;
  const tukOpacity  = useRef(new Animated.Value(0)).current;
  const glow1       = useRef(new Animated.Value(0.3)).current;
  const glow2       = useRef(new Animated.Value(0.1)).current;
  const streakX     = useRef(new Animated.Value(-width)).current;
  const streakOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Stage 1: Background fade in
    Animated.timing(bgFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();

    // Stage 2: Tuk-tuk drives across screen
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(tukOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(tukX, { toValue: width + 100, duration: 1200, useNativeDriver: true }),
        Animated.timing(streakOpacity, { toValue: 0.6, duration: 100, useNativeDriver: true }),
        Animated.timing(streakX, { toValue: width + 200, duration: 1200, useNativeDriver: true }),
      ]).start(() => {
        Animated.timing(streakOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      });
    }, 300);

    // Stage 3: Logo appears
    setTimeout(() => {
      Animated.spring(logoScale, {
        toValue: 1, useNativeDriver: true, damping: 10, stiffness: 120,
      }).start();
      Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 900);

    // Stage 4: Title slides up
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(titleSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 1200);

    // Stage 5: Buttons appear
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(btnsOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(btnsSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 1600);

    // Continuous glow pulse
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow1, { toValue: 0.7, duration: 2000, useNativeDriver: true }),
        Animated.timing(glow1, { toValue: 0.2, duration: 2000, useNativeDriver: true }),
      ])
    );
    const glow2Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow2, { toValue: 0.5, duration: 1600, useNativeDriver: true }),
        Animated.timing(glow2, { toValue: 0.1, duration: 1600, useNativeDriver: true }),
      ])
    );
    setTimeout(() => { glowLoop.start(); glow2Loop.start(); }, 1000);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Dark background gradient */}
      <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: bgFade }]}>
        <LinearGradient
          colors={['#07080C', '#0E0F14', '#12141E']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Glow orbs */}
      <Animated.View style={[styles.glowOrb1, { opacity: glow1 }]} />
      <Animated.View style={[styles.glowOrb2, { opacity: glow2 }]} />
      <Animated.View style={[styles.glowOrb3, { opacity: glow1 }]} />

      {/* Subtle grid lines */}
      {[0.2, 0.4, 0.6, 0.8].map(f => (
        <View key={`h${f}`} style={[styles.gridH, { top: height * f }]} />
      ))}
      {[0.25, 0.5, 0.75].map(f => (
        <View key={`v${f}`} style={[styles.gridV, { left: width * f }]} />
      ))}

      {/* Speed streak (light trail before tuk) */}
      <Animated.View style={[
        styles.speedStreak,
        { transform: [{ translateX: Animated.subtract(streakX, 200 as any) }], opacity: streakOpacity }
      ]}>
        {[0, 12, 24, 36].map(offset => (
          <View key={offset} style={[styles.streakLine, { top: 14 + offset * 0.5, width: 80 - offset }]} />
        ))}
      </Animated.View>

      {/* Animated Tuk-Tuk */}
      <Animated.View style={[styles.tukContainer, { transform: [{ translateX: tukX }], opacity: tukOpacity }]}>
        <View style={styles.tukGlowBehind} />
        <View style={styles.tukIconWrap}>
          <MaterialIcons name="local-taxi" size={44} color={Colors.primary} />
        </View>
      </Animated.View>

      {/* Main content */}
      <View style={styles.contentWrap}>
        {/* Logo */}
        <Animated.View style={[styles.logoSection, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
          <View style={styles.logoOuterRing}>
            <View style={styles.logoInnerRing}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={styles.logoImg}
                  contentFit="contain"
                />
              </View>
            </View>
          </View>
          {/* Golden star accents */}
          <View style={styles.starTL}><MaterialIcons name="star" size={10} color={Colors.primary} /></View>
          <View style={styles.starTR}><MaterialIcons name="star" size={7} color={Colors.primaryLight} /></View>
          <View style={styles.starBL}><MaterialIcons name="star" size={7} color={Colors.primaryLight} /></View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={[styles.titleWrap, { transform: [{ translateY: titleSlide }], opacity: titleOpacity }]}>
          <Text style={styles.titleAr}>تـك توكي</Text>
          <Text style={styles.titleEn}>TEEK TOUKY</Text>
          <View style={styles.titleUnderline} />
          <Text style={styles.tagline}>وصلك أمان • أسرتك في الأمان</Text>
        </Animated.View>

        {/* Features chips */}
        <Animated.View style={[styles.featureChips, { opacity: titleOpacity }]}>
          {[
            { icon: 'local-taxi', label: 'توكتك' },
            { icon: 'family-restroom', label: 'الأسرة' },
            { icon: 'account-balance-wallet', label: 'محفظة' },
            { icon: 'chat-bubble-outline', label: 'رسائل' },
          ].map(f => (
            <View key={f.label} style={styles.featureChip}>
              <MaterialIcons name={f.icon as any} size={16} color={Colors.primary} />
              <Text style={styles.featureChipText}>{f.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttonsWrap, { transform: [{ translateY: btnsSlide }], opacity: btnsOpacity }]}>
          {/* Login primary */}
          <Pressable style={styles.loginBtn} onPress={() => router.push('/login')}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.loginBtnGrad}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <MaterialIcons name="login" size={20} color={Colors.textInverse} />
              <Text style={styles.loginBtnText}>تسجيل الدخول</Text>
            </LinearGradient>
          </Pressable>

          {/* Signup outlined */}
          <Pressable style={styles.signupBtn} onPress={() => router.push('/signup')}>
            <Text style={styles.signupBtnText}>إنشاء حساب جديد</Text>
            <MaterialIcons name="person-add-alt" size={18} color={Colors.primary} />
          </Pressable>

          {/* Guest link */}
          <Pressable style={styles.guestBtn} onPress={() => router.replace('/(tabs)')}>
            <MaterialIcons name="arrow-back" size={14} color={Colors.textMuted} />
            <Text style={styles.guestBtnText}>متابعة كزائر</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Bottom version */}
      <Animated.View style={[styles.versionRow, { opacity: btnsOpacity }]}>
        <View style={styles.versionDot} />
        <Text style={styles.versionText}>V1.0 — جاهز للإطلاق</Text>
        <View style={styles.versionDot} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#07080C', alignItems: 'center', justifyContent: 'center' },

  // GLOW ORBS
  glowOrb1: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: Colors.primary,
    top: height * 0.15, alignSelf: 'center',
    transform: [{ scaleX: 2.5 }, { scaleY: 0.6 }],
  },
  glowOrb2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.primary,
    bottom: height * 0.25, left: -60,
    transform: [{ scaleX: 1.5 }, { scaleY: 0.8 }],
  },
  glowOrb3: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: '#3D9BFF',
    bottom: height * 0.1, right: -40,
    transform: [{ scaleX: 1.8 }, { scaleY: 0.7 }],
  },

  // GRID
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.025)' },
  gridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.025)' },

  // TUK ANIMATION
  tukContainer: {
    position: 'absolute', top: height * 0.32,
    alignItems: 'center', justifyContent: 'center',
  },
  tukGlowBehind: {
    position: 'absolute', width: 80, height: 30, borderRadius: 15,
    backgroundColor: Colors.primary, opacity: 0.3,
    transform: [{ scaleX: 2 }],
    top: 20,
  },
  tukIconWrap: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 18, padding: 10,
    borderWidth: 2, borderColor: Colors.borderGold,
    ...Shadow.golden,
  },

  // SPEED STREAK
  speedStreak: { position: 'absolute', top: height * 0.32 + 6 },
  streakLine: { height: 2, backgroundColor: Colors.primaryLight, borderRadius: 1, marginBottom: 3, opacity: 0.7 },

  // CONTENT
  contentWrap: { alignItems: 'center', gap: Spacing.xl, paddingHorizontal: Spacing.xl, width: '100%' },

  // LOGO
  logoSection: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  logoOuterRing: {
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 1, borderColor: Colors.primary + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  logoInnerRing: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 1.5, borderColor: Colors.primary + '40',
    alignItems: 'center', justifyContent: 'center',
  },
  logoCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: Colors.primary,
    ...Shadow.golden,
  },
  logoImg: { width: 62, height: 62 },
  starTL: { position: 'absolute', top: 5, left: 5 },
  starTR: { position: 'absolute', top: 15, right: 8 },
  starBL: { position: 'absolute', bottom: 10, left: 12 },

  // TITLE
  titleWrap: { alignItems: 'center', gap: Spacing.sm },
  titleAr: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xxxl + 4, fontWeight: Typography.black,
    color: Colors.textPrimary, letterSpacing: 2,
  },
  titleEn: {
    fontFamily: 'System',
    fontSize: 13, fontWeight: '800',
    color: Colors.primary, letterSpacing: 5, textTransform: 'uppercase',
  },
  titleUnderline: {
    width: 60, height: 3, borderRadius: 2, backgroundColor: Colors.primary,
    marginVertical: 4, ...Shadow.goldenSm,
  },
  tagline: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: Colors.textTertiary,
    textAlign: 'center', letterSpacing: 0.5,
  },

  // FEATURE CHIPS
  featureChips: {
    flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', justifyContent: 'center',
  },
  featureChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.border,
  },
  featureChipText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, fontWeight: Typography.semiBold, color: Colors.textSecondary,
  },

  // BUTTONS
  buttonsWrap: { width: '100%', gap: Spacing.sm },
  loginBtn: { borderRadius: Radius.full, overflow: 'hidden', ...Shadow.golden },
  loginBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 17, gap: 10,
  },
  loginBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.textInverse,
  },
  signupBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: Radius.full, paddingVertical: 16,
    borderWidth: 1.5, borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  signupBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.primary,
  },
  guestBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 10,
  },
  guestBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: Colors.textMuted,
  },

  // VERSION
  versionRow: {
    position: 'absolute', bottom: 24,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  versionDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.textMuted },
  versionText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.textMuted, letterSpacing: 0.5,
  },
});
