// Powered by OnSpace.AI — Login Screen with OTP
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAlert } from '@/template';
import { StatusBar } from 'expo-status-bar';

type LoginStep = 'phone' | 'otp';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [step, setStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSendOtp = () => {
    if (phone.replace(/\s/g, '').length < 10) {
      shake();
      showAlert('رقم غير صحيح', 'أدخل رقم هاتف مصري صحيح (10 أرقام على الأقل)');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleOtpChange = (val: string, idx: number) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 3) {
      otpRefs.current[idx + 1]?.focus();
    }
    if (!val && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
    // Auto-submit when all filled
    if (val && idx === 3 && newOtp.every(d => d !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleVerifyOtp = (code: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code === '1234' || code.length === 4) {
        router.replace('/(tabs)');
      } else {
        shake();
        showAlert('كود خاطئ', 'الكود الذي أدخلته غير صحيح. حاول مرة أخرى');
        setOtp(['', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <Pressable onPress={() => (step === 'otp' ? setStep('phone') : router.back())} style={styles.backBtn}>
              <MaterialIcons name="arrow-forward" size={22} color={Colors.secondary} />
            </Pressable>
          </View>

          {/* Brand */}
          <View style={styles.brandSection}>
            <View style={styles.logoCircle}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logoImg}
                contentFit="contain"
              />
            </View>
            <Text style={styles.brandAr}>تـك توكي</Text>
            <Text style={styles.brandEn}>TEEK TOUKY</Text>
          </View>

          {/* Form Card */}
          <Animated.View style={[styles.formCard, { transform: [{ translateX: shakeAnim }] }]}>
            {step === 'phone' ? (
              <>
                <Text style={styles.formTitle}>مرحباً بك 👋</Text>
                <Text style={styles.formSub}>أدخل رقم هاتفك لتسجيل الدخول</Text>

                <View style={styles.phoneWrap}>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="01X XXXX XXXX"
                    placeholderTextColor={Colors.textTertiary}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    textAlign="right"
                    maxLength={13}
                  />
                  <View style={styles.flagBadge}>
                    <Text style={styles.flagEmoji}>🇪🇬</Text>
                    <Text style={styles.countryCode}>+20</Text>
                  </View>
                </View>

                <Pressable
                  style={[styles.primaryBtn, loading && styles.primaryBtnLoading]}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.btnGrad}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <Text style={styles.btnText}>جاري الإرسال...</Text>
                    ) : (
                      <>
                        <Text style={styles.btnText}>إرسال كود التحقق</Text>
                        <MaterialIcons name="sms" size={18} color="#fff" />
                      </>
                    )}
                  </LinearGradient>
                </Pressable>

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>أو</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Pressable style={styles.signupLink} onPress={() => router.push('/signup')}>
                  <Text style={styles.signupLinkText}>ليس لديك حساب؟ <Text style={{ color: Colors.primary, fontWeight: Typography.bold }}>إنشاء حساب</Text></Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.formTitle}>أدخل كود التحقق 🔐</Text>
                <Text style={styles.formSub}>أُرسل إلى {phone}</Text>
                <Text style={styles.otpHint}>الكود للتجربة: 1234</Text>

                <View style={styles.otpRow}>
                  {otp.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      ref={(r) => { otpRefs.current[idx] = r; }}
                      style={[styles.otpBox, digit && styles.otpBoxFilled]}
                      value={digit}
                      onChangeText={(v) => handleOtpChange(v.slice(-1), idx)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                      selectionColor={Colors.primary}
                    />
                  ))}
                </View>

                <Pressable
                  style={[styles.primaryBtn, loading && styles.primaryBtnLoading]}
                  onPress={() => handleVerifyOtp(otp.join(''))}
                  disabled={loading || otp.some(d => !d)}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.btnGrad}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <Text style={styles.btnText}>جاري التحقق...</Text>
                    ) : (
                      <>
                        <Text style={styles.btnText}>تأكيد الدخول</Text>
                        <MaterialIcons name="check-circle" size={18} color="#fff" />
                      </>
                    )}
                  </LinearGradient>
                </Pressable>

                <Pressable style={styles.resendBtn} onPress={() => setStep('phone')}>
                  <Text style={styles.resendText}>لم تصلك الرسالة؟ إعادة الإرسال</Text>
                </Pressable>
              </>
            )}
          </Animated.View>

          {/* Progress Steps */}
          <View style={styles.stepsRow}>
            <View style={[styles.stepDot, step === 'phone' && styles.stepDotActive]} />
            <View style={[styles.stepLine, step === 'otp' && styles.stepLineActive]} />
            <View style={[styles.stepDot, step === 'otp' && styles.stepDotActive]} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  brandSection: { alignItems: 'center', paddingVertical: Spacing.xl, gap: 6 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.primary,
    ...Shadow.golden,
  },
  logoImg: { width: 56, height: 56 },
  brandAr: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xxl,
    fontWeight: Typography.black,
    color: Colors.secondary,
  },
  brandEn: {
    fontFamily: Typography.fontFamilyEn,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
    letterSpacing: 3,
  },
  formCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    gap: Spacing.base,
    ...Shadow.md,
  },
  formTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.extraBold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  formSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  otpHint: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.primary,
    textAlign: 'center',
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  phoneWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  flagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    backgroundColor: Colors.surfaceSecondary,
  },
  flagEmoji: { fontSize: 18 },
  countryCode: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.base,
    paddingVertical: 14,
  },
  primaryBtn: {
    borderRadius: Radius.full,
    overflow: 'hidden',
    ...Shadow.golden,
  },
  primaryBtnLoading: { opacity: 0.7 },
  btnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  btnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: '#fff',
  },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.divider },
  dividerText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textTertiary,
  },
  signupLink: { alignItems: 'center', paddingVertical: 4 },
  signupLinkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  otpRow: { flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center' },
  otpBox: {
    width: 60,
    height: 64,
    borderRadius: Radius.lg,
    borderWidth: 2.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  resendBtn: { alignItems: 'center', paddingVertical: 4 },
  resendText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.semiBold,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: 8,
  },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  stepDotActive: { backgroundColor: Colors.primary, width: 12, height: 12, borderRadius: 6 },
  stepLine: { width: 32, height: 2, backgroundColor: Colors.border, borderRadius: 1 },
  stepLineActive: { backgroundColor: Colors.primary },
});
