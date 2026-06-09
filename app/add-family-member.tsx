// Powered by OnSpace.AI — Add Family Member Modal
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useAlert } from '@/template';

export default function AddFamilyMemberScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'ذكر' | 'أنثى'>('ذكر');
  const [parentId] = useState('user_001');

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      showAlert('بيانات ناقصة', 'من فضلك أدخل الاسم ورقم الهاتف');
      return;
    }
    showAlert('تمت الإضافة!', `تم إرسال دعوة إلى ${name} برقم ${phone}`, [
      { text: 'تمام', onPress: () => router.back() }
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.handleBar} />
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>إضافة فرد جديد</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, gap: Spacing.base }}>
        {/* Icon */}
        <View style={styles.iconWrap}>
          <MaterialIcons name="person-add" size={48} color={Colors.primary} />
          <Text style={styles.iconDesc}>أدخل بيانات الفرد الجديد وسيصله دعوة للانضمام</Text>
        </View>

        {/* Name */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>الاسم الكامل</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="أدخل الاسم"
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
              placeholder="+20 10 XXXX XXXX"
              placeholderTextColor={Colors.textTertiary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              textAlign="right"
            />
            <MaterialIcons name="phone" size={20} color={Colors.textTertiary} />
          </View>
        </View>

        {/* Gender */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>الجنس</Text>
          <View style={styles.genderRow}>
            {(['ذكر', 'أنثى'] as const).map(g => (
              <Pressable
                key={g}
                style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                onPress={() => setGender(g)}
              >
                <MaterialIcons
                  name={g === 'ذكر' ? 'male' : 'female'}
                  size={20}
                  color={gender === g ? '#fff' : Colors.primary}
                />
                <Text style={[styles.genderText, gender === g && { color: '#fff' }]}>{g}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Parent ID (read-only) */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>سيتم ربط هذا الفرد تلقائياً بـ Family ID: FAM_001</Text>
          <MaterialIcons name="link" size={18} color={Colors.primary} />
        </View>

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>إرسال الدعوة</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  iconWrap: { alignItems: 'center', paddingVertical: Spacing.lg, gap: 8 },
  iconDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.sm * 1.6,
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
    borderWidth: 1.5,
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
  genderRow: { flexDirection: 'row', gap: Spacing.sm },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  genderBtnActive: { backgroundColor: Colors.primary },
  genderText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },
  infoCard: {
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  infoText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.primary,
    flex: 1,
    textAlign: 'right',
    fontWeight: Typography.semiBold,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Shadow.md,
    marginBottom: Spacing.xl,
  },
  saveBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: '#fff',
  },
});
