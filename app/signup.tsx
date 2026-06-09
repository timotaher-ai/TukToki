// Powered by OnSpace.AI — Signup Screen
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAlert } from '@/template';
import { StatusBar } from 'expo-status-bar';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'parent' | 'rider'>('rider');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    if (!name.trim() || !phone.trim()) {
      showAlert('بيانات ناقصة', 'أدخل اسمك ورقم هاتفك');
      return;
    }
    if (!agreeTerms) {
      showAlert('الشروط والأحكام', 'يجب الموافقة على الشروط والأحكام للمتابعة');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
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
          {/* Top Bar */}
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
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
            <Text style={styles.brandTitle}>إنشاء حساب جديد</Text>
            <Text style={styles.brandSub}>انضم لأكبر منصة نقل ذكي في مصر</Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {/* Role Selection */}
            <View style={styles.roleSection}>
              <Text style={styles.fieldLabel}>نوع الحساب</Text>
              <View style={styles.roleRow}>
                {([
                  { id: 'rider', label: 'راكب', icon: 'person', desc: 'احجز رحلات واستمتع' },
                  { id: 'parent', label: 'ولي أمر', icon: 'family-restroom', desc: 'تحكم في حسابات الأسرة' },
                ] as const).map(r => (
                  <Pressable
                    key={r.id}
                    style={[styles.roleCard, role === r.id && styles.roleCardActive]}
                    onPress={() => setRole(r.id)}
                  >
                    <MaterialIcons name={r.icon as any} size={24} color={role === r.id ? '#fff' : Colors.primary} />
                    <Text style={[styles.roleLabel, role === r.id && { color: '#fff' }]}>{r.label}</Text>
                    <Text style={[styles.roleDesc, role === r.id && { color: 'rgba(255,255,255,0.75)' }]}>{r.desc}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Name */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>الاسم الكامل</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="أدخل اسمك الكامل"
                  placeholderTextColor={Colors.textTertiary}
                  value={name}
                  onChangeText={setName}
                  textAlign="right"
                />
                <MaterialIcons name="person" size={20} color={Colors.textTertiary} />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>رقم الهاتف</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="01X XXXX XXXX"
                  placeholderTextColor={Colors.textTertiary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  textAlign="right"
                />
                <View style={styles.flagBadge}>
                  <Text style={styles.flagEmoji}>🇪🇬</Text>
                  <Text style={styles.countryCode}>+20</Text>
                </View>
              </View>
            </View>

            {/* Terms */}
            <Pressable style={styles.termsRow} onPress={() => setAgreeTerms(!agreeTerms)}>
              <Text style={styles.termsText}>أوافق على <Text style={{ color: Colors.primary }}>الشروط والأحكام</Text></Text>
              <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                {agreeTerms && <MaterialIcons name="check" size={14} color="#fff" />}
              </View>
            </Pressable>

            <Pressable
              style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
              onPress={handleSignup}
              disabled={loading}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.btnGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <Text style={styles.btnText}>جاري الإنشاء...</Text>
                ) : (
                  <>
                    <Text style={styles.btnText}>إنشاء الحساب</Text>
                    <MaterialIcons name="how-to-reg" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </Pressable>

            <Pressable style={styles.loginLink} onPress={() => router.push('/login')}>
              <Text style={styles.loginLinkText}>
                لديك حساب بالفعل؟ <Text style={{ color: Colors.primary, fontWeight: Typography.bold }}>تسجيل الدخول</Text>
              </Text>
            </Pressable>
          </View>

          <View style={{ height: insets.bottom + Spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  brandSection: { alignItems: 'center', paddingVertical: Spacing.lg, gap: 6 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.primary,
    ...Shadow.golden,
  },
  logoImg: { width: 50, height: 50 },
  brandTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.extraBold,
    color: Colors.secondary,
  },
  brandSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    gap: Spacing.base,
    ...Shadow.md,
  },
  roleSection: { gap: 10 },
  roleRow: { flexDirection: 'row', gap: Spacing.sm },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  roleCardActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  roleLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  roleDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 14,
  },
  fieldWrap: { gap: 8 },
  fieldLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    paddingVertical: 14,
  },
  flagBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  flagEmoji: { fontSize: 16 },
  countryCode: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'flex-end',
  },
  termsText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  primaryBtn: {
    borderRadius: Radius.full,
    overflow: 'hidden',
    ...Shadow.golden,
    marginTop: 4,
  },
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
  loginLink: { alignItems: 'center' },
  loginLinkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
});
