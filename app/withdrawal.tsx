// Powered by OnSpace.AI — Withdrawal Screen (وسائل الدفع المصرية) - Dark Premium
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput, Animated, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Egyptian Payment Methods ──────────────────────────────────────────────────
const paymentMethods = [
  {
    id: 'vodafone',
    name: 'فودافون كاش',
    nameEn: 'Vodafone Cash',
    icon: 'sim-card',
    color: '#E60000',
    gradColors: ['#3D0000', '#250000'] as [string, string],
    feePercent: 0.5,
    minAmount: 30,
    maxAmount: 5000,
    processingTime: '24 ساعة',
    desc: 'تحويل فوري لمحفظة فودافون كاش',
    available: true,
  },
  {
    id: 'orange',
    name: 'أورنج كاش',
    nameEn: 'Orange Cash',
    icon: 'phone-iphone',
    color: '#FF6600',
    gradColors: ['#3D1A00', '#251000'] as [string, string],
    feePercent: 0.5,
    minAmount: 30,
    maxAmount: 3000,
    processingTime: '24 ساعة',
    desc: 'سحب مباشر لمحفظة أورنج كاش',
    available: true,
  },
  {
    id: 'etisalat',
    name: 'اتصالات كاش',
    nameEn: 'Etisalat Cash',
    icon: 'signal-cellular-alt',
    color: '#00A651',
    gradColors: ['#002A15', '#001A0D'] as [string, string],
    feePercent: 0.5,
    minAmount: 30,
    maxAmount: 3000,
    processingTime: '24 ساعة',
    desc: 'إرسال للمحفظة الإلكترونية لاتصالات',
    available: true,
  },
  {
    id: 'fawry',
    name: 'فوري',
    nameEn: 'Fawry',
    icon: 'store',
    color: '#FFA500',
    gradColors: ['#3D2A00', '#251A00'] as [string, string],
    feePercent: 1,
    minAmount: 30,
    maxAmount: 10000,
    processingTime: '2-3 أيام عمل',
    desc: 'استلم من أقرب نقطة فوري',
    available: true,
  },
  {
    id: 'instapay',
    name: 'إنستا باي',
    nameEn: 'InstaPay',
    icon: 'account-balance',
    color: '#007AFF',
    gradColors: ['#00183D', '#000F25'] as [string, string],
    feePercent: 0,
    minAmount: 30,
    maxAmount: 20000,
    processingTime: 'فوري',
    desc: 'تحويل مباشر للبنك أو المحفظة',
    available: true,
  },
];

// ── Withdrawal Status Config ──────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  pending:     { label: 'قيد المراجعة',   color: Colors.warning,       bg: Colors.warningSurface,      icon: 'pending' },
  approved:    { label: 'موافق عليه',      color: '#3D9BFF',            bg: '#0D2A4A',                   icon: 'check-circle-outline' },
  processing:  { label: 'قيد التحويل',    color: '#9B59B6',            bg: '#2A1B3D',                   icon: 'autorenew' },
  transferred: { label: 'تم التحويل',     color: Colors.success,       bg: Colors.successSurface,       icon: 'check-circle' },
  rejected:    { label: 'مرفوض',           color: Colors.error,         bg: Colors.errorSurface,         icon: 'cancel' },
  cancelled:   { label: 'ملغي',            color: Colors.textTertiary,  bg: Colors.surfaceSecondary,     icon: 'do-not-disturb' },
};

// ── Mock history ──────────────────────────────────────────────────────────────
const mockHistory = [
  { id: 'h1', method: 'فودافون كاش', amount: 250, fee: 1.25, net: 248.75, status: 'transferred', date: '12 يناير 2025', phone: '01011234567' },
  { id: 'h2', method: 'إنستا باي',   amount: 500, fee: 0,    net: 500,    status: 'pending',     date: '10 يناير 2025', phone: '01512345678' },
  { id: 'h3', method: 'فوري',        amount: 150, fee: 1.5,  net: 148.5,  status: 'rejected',    date: '5 يناير 2025',  phone: 'نقطة فوري' },
  { id: 'h4', method: 'أورنج كاش',  amount: 300, fee: 1.5,  net: 298.5,  status: 'transferred', date: '28 ديسمبر 2024', phone: '01212345678' },
];

// ── Method Card Component ─────────────────────────────────────────────────────
function MethodCard({ method, isSelected, onSelect }: { method: typeof paymentMethods[0]; isSelected: boolean; onSelect: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 8 }),
    ]).start();
    onSelect();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[
          mSt.card,
          isSelected && { borderColor: method.color, backgroundColor: method.color + '10' },
        ]}
        onPress={handlePress}
      >
        {isSelected && (
          <View style={[mSt.checkBadge, { backgroundColor: method.color }]}>
            <MaterialIcons name="check" size={12} color="#fff" />
          </View>
        )}

        {/* Color bar */}
        <View style={[mSt.colorBar, { backgroundColor: method.color }]} />

        {/* Icon */}
        <LinearGradient
          colors={isSelected ? method.gradColors : ['#1A1B22', Colors.surfaceSecondary]}
          style={mSt.iconWrap}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name={method.icon as any} size={28} color={isSelected ? method.color : Colors.textTertiary} />
        </LinearGradient>

        <Text style={[mSt.name, isSelected && { color: method.color }]} numberOfLines={1}>{method.name}</Text>
        <Text style={mSt.nameEn} numberOfLines={1}>{method.nameEn}</Text>

        {/* Fee */}
        <View style={[mSt.feeTag, isSelected && { backgroundColor: method.color + '20', borderColor: method.color + '40' }]}>
          <Text style={[mSt.feeText, isSelected && { color: method.color }]}>
            {method.feePercent === 0 ? 'بدون رسوم' : `${method.feePercent}% رسوم`}
          </Text>
        </View>

        {/* Processing time */}
        <Text style={mSt.time}>{method.processingTime}</Text>
      </Pressable>
    </Animated.View>
  );
}

const mSt = StyleSheet.create({
  card: {
    width: 100,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.sm,
    alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.border,
    position: 'relative', overflow: 'hidden',
    minHeight: 170,
  },
  checkBadge: {
    position: 'absolute', top: -1, left: -1,
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.background,
    zIndex: 2,
  },
  colorBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  iconWrap: {
    width: 60, height: 60, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 12,
  },
  name: { fontFamily: Typography.fontFamily, fontSize: 11, fontWeight: Typography.bold, color: Colors.textSecondary, textAlign: 'center' },
  nameEn: { fontFamily: 'System', fontSize: 9, color: Colors.textMuted, textAlign: 'center', fontWeight: '600' },
  feeTag: {
    backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.full,
    paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1, borderColor: Colors.border,
  },
  feeText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold, color: Colors.textTertiary },
  time: { fontFamily: Typography.fontFamily, fontSize: 8, color: Colors.textMuted, textAlign: 'center' },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
type ScreenState = 'select' | 'form' | 'history';

export default function WithdrawalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useApp();
  const { showAlert } = useAlert();

  const [screenState, setScreenState] = useState<ScreenState>('select');
  const [selectedMethod, setSelectedMethod] = useState<typeof paymentMethods[0] | null>(null);
  const [walletNumber, setWalletNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fee = selectedMethod ? parseFloat(amount || '0') * (selectedMethod.feePercent / 100) : 0;
  const netAmount = parseFloat(amount || '0') - fee;

  const isValid = walletNumber.trim().length >= 10 && parseFloat(amount) >= (selectedMethod?.minAmount || 30) && parseFloat(amount) <= user.wallet;

  const handleSubmit = () => {
    if (!isValid) {
      const issues = [];
      if (walletNumber.trim().length < 10) issues.push('رقم المحفظة غير صحيح');
      if (parseFloat(amount) < (selectedMethod?.minAmount || 30)) issues.push(`الحد الأدنى ${selectedMethod?.minAmount} جنيه`);
      if (parseFloat(amount) > user.wallet) issues.push('الرصيد غير كافٍ');
      showAlert('خطأ في البيانات', issues.join('\n'));
      return;
    }

    showAlert(
      'تأكيد طلب السحب',
      `سيتم تحويل ${netAmount.toFixed(2)} جنيه\nإلى ${selectedMethod?.name} (${walletNumber})\n\nرسوم: ${fee.toFixed(2)} جنيه`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تأكيد السحب',
          onPress: () => {
            setSubmitted(true);
            setTimeout(() => {
              setSubmitted(false);
              setScreenState('history');
              setAmount('');
              setWalletNumber('');
            }, 1500);
          },
        },
      ]
    );
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    return () => fadeAnim.setValue(0);
  }, [screenState]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Header ──────────────────────────────────────────── */}
      <LinearGradient
        colors={['#0D1B3E', '#162550']}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          {/* Balance */}
          <View style={styles.headerBalance}>
            <Text style={styles.headerBalanceLabel}>رصيدك</Text>
            <Text style={styles.headerBalanceAmount}>{user.wallet.toFixed(2)} <Text style={styles.headerCurrency}>ج</Text></Text>
          </View>

          {/* Title */}
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>سحب الأرباح</Text>
            <Text style={styles.headerSub}>Withdraw Earnings</Text>
          </View>

          {/* Back */}
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>

        {/* Tab Row */}
        <View style={styles.tabRow}>
          {([
            { id: 'select' as ScreenState, label: 'وسيلة الدفع', icon: 'account-balance-wallet' },
            { id: 'form' as ScreenState, label: 'تفاصيل السحب', icon: 'send' },
            { id: 'history' as ScreenState, label: 'سجل السحوبات', icon: 'history' },
          ]).map(tab => {
            const isActive = screenState === tab.id;
            const isDisabled = tab.id === 'form' && !selectedMethod;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tabBtn, isActive && styles.tabBtnActive, isDisabled && styles.tabBtnDisabled]}
                onPress={() => !isDisabled && setScreenState(tab.id)}
              >
                <MaterialIcons name={tab.icon as any} size={13} color={isActive ? '#fff' : isDisabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.55)'} />
                <Text style={[styles.tabBtnText, isActive && { color: '#fff' }, isDisabled && { color: 'rgba(255,255,255,0.2)' }]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </LinearGradient>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.base, gap: Spacing.base, paddingBottom: 40 }}>

          {/* ══ SELECT METHOD ══════════════════════════════════ */}
          {screenState === 'select' && (
            <>
              {/* Warning */}
              <View style={styles.warningCard}>
                <Text style={styles.warningText}>
                  الحد الأدنى للسحب: 30 جنيه · الرسوم تُخصم تلقائياً من المبلغ
                </Text>
                <MaterialIcons name="info-outline" size={16} color={Colors.warning} />
              </View>

              {/* Methods horizontal list */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    <MaterialIcons name="account-balance-wallet" size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.cardTitle}>اختر وسيلة السحب</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 4 }}>
                  {paymentMethods.map(m => (
                    <MethodCard
                      key={m.id}
                      method={m}
                      isSelected={selectedMethod?.id === m.id}
                      onSelect={() => { setSelectedMethod(m); }}
                    />
                  ))}
                </ScrollView>
              </View>

              {/* Selected method details */}
              {selectedMethod && (
                <View style={[styles.card, { borderColor: selectedMethod.color + '40' }]}>
                  <View style={[styles.selectedMethodBanner, { backgroundColor: selectedMethod.color + '10', borderColor: selectedMethod.color + '30' }]}>
                    <View style={styles.selectedMethodInfo}>
                      <Text style={[styles.selectedMethodName, { color: selectedMethod.color }]}>{selectedMethod.name}</Text>
                      <Text style={styles.selectedMethodDesc}>{selectedMethod.desc}</Text>
                    </View>
                    <MaterialIcons name={selectedMethod.icon as any} size={28} color={selectedMethod.color} />
                  </View>

                  <View style={styles.methodDetailsGrid}>
                    {[
                      { label: 'الحد الأدنى',     value: `${selectedMethod.minAmount} ج`,                  icon: 'south' },
                      { label: 'الحد الأقصى',     value: `${selectedMethod.maxAmount.toLocaleString()} ج`, icon: 'north' },
                      { label: 'الرسوم',           value: selectedMethod.feePercent === 0 ? 'مجاناً' : `${selectedMethod.feePercent}%`, icon: 'percent' },
                      { label: 'وقت المعالجة',    value: selectedMethod.processingTime,                    icon: 'schedule' },
                    ].map(d => (
                      <View key={d.label} style={styles.methodDetailItem}>
                        <MaterialIcons name={d.icon as any} size={14} color={selectedMethod.color} />
                        <Text style={[styles.methodDetailVal, { color: selectedMethod.color }]}>{d.value}</Text>
                        <Text style={styles.methodDetailLabel}>{d.label}</Text>
                      </View>
                    ))}
                  </View>

                  <Pressable
                    style={[styles.proceedBtn, { backgroundColor: selectedMethod.color }]}
                    onPress={() => setScreenState('form')}
                  >
                    <MaterialIcons name="arrow-back" size={18} color="#fff" />
                    <Text style={styles.proceedBtnText}>المتابعة إلى تفاصيل السحب</Text>
                  </Pressable>
                </View>
              )}
            </>
          )}

          {/* ══ FORM ══════════════════════════════════════════ */}
          {screenState === 'form' && selectedMethod && (
            <>
              {/* Method Info Banner */}
              <View style={[styles.formMethodBanner, { borderColor: selectedMethod.color + '50' }]}>
                <Pressable style={styles.changeMethodBtn} onPress={() => setScreenState('select')}>
                  <Text style={styles.changeMethodText}>تغيير</Text>
                </Pressable>
                <View style={styles.formMethodInfo}>
                  <Text style={[styles.formMethodName, { color: selectedMethod.color }]}>{selectedMethod.name}</Text>
                  <Text style={styles.formMethodTime}>{selectedMethod.processingTime} · {selectedMethod.feePercent === 0 ? 'بدون رسوم' : `رسوم ${selectedMethod.feePercent}%`}</Text>
                </View>
                <View style={[styles.formMethodIcon, { backgroundColor: selectedMethod.color + '20' }]}>
                  <MaterialIcons name={selectedMethod.icon as any} size={24} color={selectedMethod.color} />
                </View>
              </View>

              {/* Wallet Number */}
              <View style={styles.card}>
                <Text style={styles.inputLabel}>رقم المحفظة / الحساب</Text>
                <View style={[styles.inputWrap, walletNumber.length > 0 && walletNumber.length < 10 && styles.inputWrapError]}>
                  <TextInput
                    style={styles.input}
                    value={walletNumber}
                    onChangeText={setWalletNumber}
                    placeholder="01XXXXXXXXX"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="phone-pad"
                    maxLength={20}
                    textAlign="right"
                  />
                  <MaterialIcons name="phone-android" size={20} color={walletNumber.length >= 10 ? Colors.success : Colors.textTertiary} />
                </View>
                {walletNumber.length > 0 && walletNumber.length < 10 && (
                  <Text style={styles.inputError}>رقم المحفظة يجب أن يكون 10 أرقام على الأقل</Text>
                )}
              </View>

              {/* Amount */}
              <View style={styles.card}>
                <Text style={styles.inputLabel}>المبلغ المطلوب سحبه</Text>
                <View style={[styles.inputWrap, parseFloat(amount) > user.wallet && styles.inputWrapError]}>
                  <View style={styles.currencyLabel}>
                    <Text style={styles.currencyText}>ج.م</Text>
                  </View>
                  <TextInput
                    style={[styles.input, styles.amountInput]}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="numeric"
                    maxLength={8}
                    textAlign="right"
                  />
                </View>
                {parseFloat(amount) > user.wallet && (
                  <Text style={styles.inputError}>المبلغ يتجاوز رصيدك المتاح ({user.wallet.toFixed(0)} ج)</Text>
                )}

                {/* Quick amounts */}
                <View style={styles.quickAmounts}>
                  {[50, 100, 200, 500].map(a => (
                    <Pressable
                      key={a}
                      style={[styles.quickAmountChip, amount === String(a) && styles.quickAmountChipActive]}
                      onPress={() => setAmount(String(a))}
                    >
                      <Text style={[styles.quickAmountText, amount === String(a) && { color: Colors.textInverse }]}>{a} ج</Text>
                    </Pressable>
                  ))}
                  <Pressable
                    style={[styles.quickAmountChip, amount === user.wallet.toFixed(0) && styles.quickAmountChipActive]}
                    onPress={() => setAmount(user.wallet.toFixed(0))}
                  >
                    <Text style={[styles.quickAmountText, amount === user.wallet.toFixed(0) && { color: Colors.textInverse }]}>الكل</Text>
                  </Pressable>
                </View>
              </View>

              {/* Summary */}
              {parseFloat(amount) > 0 && (
                <View style={[styles.summaryCard, { borderColor: selectedMethod.color + '30' }]}>
                  <Text style={styles.summaryTitle}>ملخص العملية</Text>
                  {[
                    { label: 'المبلغ المطلوب', value: `${parseFloat(amount).toFixed(2)} ج`, color: Colors.textPrimary },
                    { label: `رسوم ${selectedMethod.name}`, value: fee === 0 ? 'مجاناً' : `-${fee.toFixed(2)} ج`, color: fee === 0 ? Colors.success : Colors.error },
                    { label: 'المبلغ الصافي', value: `${netAmount.toFixed(2)} ج`, color: Colors.success, bold: true },
                    { label: 'وقت التحويل', value: selectedMethod.processingTime, color: Colors.primary },
                  ].map((row, i, arr) => (
                    <View key={row.label} style={[styles.summaryRow, i === arr.length - 1 && { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm, marginTop: 2 }]}>
                      <Text style={[styles.summaryVal, { color: row.color }, row.bold && { fontSize: Typography.lg }]}>{row.value}</Text>
                      <Text style={[styles.summaryLabel, row.bold && { fontWeight: Typography.bold, color: Colors.textPrimary }]}>{row.label}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Submit */}
              <Pressable
                style={[
                  styles.submitBtn,
                  { backgroundColor: isValid ? selectedMethod.color : Colors.surfaceSecondary },
                  submitted && { backgroundColor: Colors.success },
                ]}
                onPress={handleSubmit}
                disabled={!isValid || submitted}
              >
                {submitted ? (
                  <>
                    <MaterialIcons name="check-circle" size={22} color="#fff" />
                    <Text style={styles.submitBtnText}>تم إرسال الطلب!</Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons name="send" size={20} color="#fff" />
                    <Text style={styles.submitBtnText}>تأكيد طلب السحب</Text>
                  </>
                )}
              </Pressable>
            </>
          )}

          {/* ══ HISTORY ═══════════════════════════════════════ */}
          {screenState === 'history' && (
            <>
              {/* Status Legend */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
                {Object.entries(statusConfig).map(([key, sc]) => (
                  <View key={key} style={[styles.legendChip, { backgroundColor: sc.bg }]}>
                    <MaterialIcons name={sc.icon as any} size={12} color={sc.color} />
                    <Text style={[styles.legendChipText, { color: sc.color }]}>{sc.label}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* History List */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    <MaterialIcons name="history" size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.cardTitle}>سجل السحوبات</Text>
                </View>

                {mockHistory.map((h, i) => {
                  const sc = statusConfig[h.status] || statusConfig.pending;
                  return (
                    <View key={h.id} style={[styles.historyRow, i < mockHistory.length - 1 && styles.historyRowBorder]}>
                      {/* Amount */}
                      <View style={styles.historyAmountCol}>
                        <Text style={[styles.historyNet, { color: h.status === 'transferred' ? Colors.success : h.status === 'rejected' ? Colors.error : Colors.textPrimary }]}>
                          {h.net.toFixed(0)} ج
                        </Text>
                        {h.fee > 0 && (
                          <Text style={styles.historyFee}>-{h.fee.toFixed(2)} رسوم</Text>
                        )}
                      </View>

                      {/* Info */}
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyMethod}>{h.method}</Text>
                        <Text style={styles.historyPhone}>{h.phone}</Text>
                        <Text style={styles.historyDate}>{h.date}</Text>
                      </View>

                      {/* Status */}
                      <View style={[styles.historyStatusBadge, { backgroundColor: sc.bg }]}>
                        <MaterialIcons name={sc.icon as any} size={12} color={sc.color} />
                        <Text style={[styles.historyStatusText, { color: sc.color }]}>{sc.label}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <Pressable
                style={styles.newWithdrawalBtn}
                onPress={() => { setScreenState('select'); setSelectedMethod(null); }}
              >
                <MaterialIcons name="add" size={18} color={Colors.textInverse} />
                <Text style={styles.newWithdrawalText}>طلب سحب جديد</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // HEADER
  header: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.bold, color: '#fff' },
  headerSub: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.5)' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerBalance: { alignItems: 'flex-end' },
  headerBalanceLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.5)' },
  headerBalanceAmount: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.extraBold, color: '#fff' },
  headerCurrency: { fontSize: Typography.base, color: Colors.primary },
  tabRow: { flexDirection: 'row', gap: 6, paddingVertical: 6 },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: 8, borderRadius: Radius.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  tabBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabBtnDisabled: { opacity: 0.4 },
  tabBtnText: { fontFamily: Typography.fontFamily, fontSize: 11, fontWeight: Typography.semiBold, color: 'rgba(255,255,255,0.55)' },

  // CARDS
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, ...Shadow.sm, gap: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  cardTitle: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  cardIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primarySurface, alignItems: 'center', justifyContent: 'center' },

  // WARNING
  warningCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.warningSurface, borderRadius: Radius.xl,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.warning + '30',
  },
  warningText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.warning, textAlign: 'right' },

  // SELECTED METHOD
  selectedMethodBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: Radius.xl, padding: Spacing.md, borderWidth: 1,
  },
  selectedMethodInfo: { flex: 1 },
  selectedMethodName: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.extraBold },
  selectedMethodDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right' },
  methodDetailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  methodDetailItem: {
    width: '47%', backgroundColor: Colors.background, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.border,
  },
  methodDetailVal: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold },
  methodDetailLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted },
  proceedBtn: {
    borderRadius: Radius.full, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    ...Shadow.golden,
  },
  proceedBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: '#fff' },

  // FORM
  formMethodBanner: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1.5, ...Shadow.sm,
  },
  changeMethodBtn: {
    backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border,
  },
  changeMethodText: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: Typography.semiBold },
  formMethodInfo: { flex: 1 },
  formMethodName: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, textAlign: 'right' },
  formMethodTime: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right' },
  formMethodIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  inputLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textTertiary, textAlign: 'right' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base, paddingVertical: 14,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  inputWrapError: { borderColor: Colors.error },
  input: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.base, color: Colors.textPrimary },
  amountInput: { fontSize: Typography.xxl, fontWeight: Typography.black, color: Colors.textPrimary },
  currencyLabel: {
    backgroundColor: Colors.primarySurface, borderRadius: Radius.sm,
    paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: Colors.borderGold,
  },
  currencyText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.primary },
  inputError: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.error, textAlign: 'right' },
  quickAmounts: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  quickAmountChip: {
    backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.full,
    paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1, borderColor: Colors.border,
  },
  quickAmountChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary, ...Shadow.goldenSm },
  quickAmountText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textSecondary },
  summaryCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.base, gap: Spacing.sm, borderWidth: 1.5,
    ...Shadow.sm,
  },
  summaryTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, color: Colors.textTertiary },
  summaryVal: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.semiBold },
  submitBtn: {
    borderRadius: Radius.full, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    ...Shadow.golden,
  },
  submitBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.md, fontWeight: Typography.bold, color: '#fff' },

  // HISTORY
  legendChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 6,
  },
  legendChipText: { fontFamily: Typography.fontFamily, fontSize: 10, fontWeight: Typography.bold },
  historyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: Spacing.md },
  historyRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  historyStatusBadge: {
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 5,
    flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0,
  },
  historyStatusText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: Typography.bold },
  historyInfo: { flex: 1 },
  historyMethod: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'right' },
  historyPhone: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'right' },
  historyDate: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textMuted, textAlign: 'right' },
  historyAmountCol: { alignItems: 'flex-end', minWidth: 65 },
  historyNet: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.extraBold },
  historyFee: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.error },
  newWithdrawalBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...Shadow.golden,
  },
  newWithdrawalText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textInverse },
});
