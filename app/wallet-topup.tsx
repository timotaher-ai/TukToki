// Powered by OnSpace.AI — Wallet Top-up Modal
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

const quickAmounts = [50, 100, 200, 500];

export default function WalletTopupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();

  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'fawry' | 'vodafone'>('card');

  const methods = [
    { id: 'card', label: 'بطاقة بنكية', icon: 'credit-card' },
    { id: 'fawry', label: 'فوري', icon: 'store' },
    { id: 'vodafone', label: 'فودافون كاش', icon: 'phone-iphone' },
  ] as const;

  const handleTopup = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showAlert('خطأ', 'من فضلك أدخل مبلغاً صحيحاً');
      return;
    }
    showAlert('تم الشحن!', `تم إضافة ${amount} جنيه إلى محفظتك`, [
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
          <Text style={styles.headerTitle}>شحن المحفظة</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.base, gap: Spacing.base }}>
        {/* Amount Input */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>المبلغ (جنيه)</Text>
          <View style={styles.amountInputWrap}>
            <Text style={styles.currencySymbol}>ج</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={Colors.textTertiary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              textAlign="center"
            />
          </View>

          {/* Quick Amounts */}
          <View style={styles.quickRow}>
            {quickAmounts.map(qa => (
              <Pressable
                key={qa}
                style={[styles.quickBtn, amount === String(qa) && styles.quickBtnActive]}
                onPress={() => setAmount(String(qa))}
              >
                <Text style={[styles.quickBtnText, amount === String(qa) && { color: '#fff' }]}>{qa}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionLabel}>طريقة الدفع</Text>
        {methods.map(method => (
          <Pressable
            key={method.id}
            style={[styles.methodCard, selectedMethod === method.id && styles.methodCardActive]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={[styles.methodRadio, selectedMethod === method.id && styles.methodRadioActive]}>
              {selectedMethod === method.id && <View style={styles.methodRadioInner} />}
            </View>
            <Text style={[styles.methodLabel, selectedMethod === method.id && { color: Colors.primary }]}>
              {method.label}
            </Text>
            <View style={[styles.methodIcon, selectedMethod === method.id && { backgroundColor: Colors.primarySurface }]}>
              <MaterialIcons name={method.icon as any} size={20} color={selectedMethod === method.id ? Colors.primary : Colors.textTertiary} />
            </View>
          </Pressable>
        ))}

        <Pressable
          style={[styles.topupBtn, !amount.trim() && { opacity: 0.5 }]}
          onPress={handleTopup}
          disabled={!amount.trim()}
        >
          <Text style={styles.topupBtnText}>
            شحن {amount ? `${amount} جنيه` : ''}
          </Text>
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
  amountCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.base,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  amountLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    fontWeight: Typography.semiBold,
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencySymbol: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  amountInput: {
    fontFamily: Typography.fontFamily,
    fontSize: 48,
    fontWeight: Typography.extraBold,
    color: Colors.textPrimary,
    minWidth: 120,
  },
  quickRow: { flexDirection: 'row', gap: Spacing.sm },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  quickBtnActive: { backgroundColor: Colors.primary },
  quickBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  sectionLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  methodCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  methodCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#F8FBFF',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodRadioActive: { borderColor: Colors.primary },
  methodRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  topupBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.sm,
    ...Shadow.md,
    marginBottom: Spacing.xl,
  },
  topupBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: '#fff',
  },
});
