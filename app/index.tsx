// Powered by OnSpace.AI — Teek Touky Splash / Landing Screen
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 120 }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Egyptian Background — upper 2/3 */}
      <View style={styles.heroSection}>
        <Image
          source={require('@/assets/images/splash-egypt.png')}
          style={styles.heroImage}
          contentFit="cover"
          transition={300}
        />
        {/* Dark overlay for readability */}
        <LinearGradient
          colors={['rgba(26,42,60,0.25)', 'rgba(26,42,60,0.0)', Colors.background]}
          style={styles.heroOverlay}
        />

        {/* Logo pinned on top of hero */}
        <Animated.View style={[styles.logoWrap, { transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoCircle}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logoImg}
              contentFit="contain"
            />
          </View>
        </Animated.View>
      </View>

      {/* Bottom card — lower 1/3 */}
      <Animated.View style={[styles.bottomCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* App name */}
        <View style={styles.appNameRow}>
          <Text style={styles.appNameAr}>تـك توكي</Text>
          <Text style={styles.appNameEn}>Teek Touky</Text>
        </View>
        <Text style={styles.tagline}>وصلك أمان، أسرتك في الأمان</Text>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <Pressable
            style={styles.loginBtn}
            onPress={() => router.push('/login')}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.loginGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialIcons name="login" size={20} color="#fff" />
              <Text style={styles.loginBtnText}>تسجيل الدخول</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={styles.signupBtn}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.signupBtnText}>إنشاء حساب جديد</Text>
          </Pressable>

          <Pressable
            style={styles.guestBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.guestBtnText}>متابعة كزائر</Text>
            <MaterialIcons name="arrow-back" size={16} color={Colors.textTertiary} />
          </Pressable>
        </View>

        {/* Features strip */}
        <View style={styles.featuresRow}>
          {[
            { icon: 'directions-car', label: 'رحلات' },
            { icon: 'family-restroom', label: 'الأسرة' },
            { icon: 'account-balance-wallet', label: 'محفظة' },
            { icon: 'chat-bubble', label: 'تـك توك' },
          ].map(f => (
            <View key={f.label} style={styles.featureItem}>
              <MaterialIcons name={f.icon as any} size={20} color={Colors.primary} />
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  heroSection: {
    height: height * 0.62,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  logoWrap: {
    position: 'absolute',
    bottom: -44,
    alignSelf: 'center',
    zIndex: 10,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
    ...Shadow.golden,
  },
  logoImg: { width: 60, height: 60 },

  bottomCard: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl + 12,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.md,
  },
  appNameRow: { alignItems: 'center', gap: 2 },
  appNameAr: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xxxl,
    fontWeight: Typography.black,
    color: Colors.secondary,
    letterSpacing: 1,
  },
  appNameEn: {
    fontFamily: Typography.fontFamilyEn,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.primary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  tagline: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  buttonGroup: { width: '100%', gap: Spacing.sm },
  loginBtn: {
    borderRadius: Radius.full,
    overflow: 'hidden',
    ...Shadow.golden,
  },
  loginGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  loginBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  signupBtn: {
    borderRadius: Radius.full,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  signupBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.secondary,
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  guestBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textTertiary,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    ...Shadow.sm,
  },
  featureItem: { alignItems: 'center', gap: 4 },
  featureLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.semiBold,
  },
});
