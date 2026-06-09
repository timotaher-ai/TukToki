// Powered by OnSpace.AI — Geofencing Screen
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch, TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import GeofenceMapView from '@/components/GeofenceMapView';

interface Zone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  active: boolean;
  alertOnExit: boolean;
  alertOnEnter: boolean;
  icon: string;
}

const defaultZones: Zone[] = [
  { id: 'z1', name: 'المنزل', latitude: 30.0444, longitude: 31.2357, radius: 300, color: Colors.success, active: true, alertOnExit: true, alertOnEnter: true, icon: 'home' },
  { id: 'z2', name: 'المدرسة', latitude: 30.0520, longitude: 31.2430, radius: 250, color: Colors.primary, active: true, alertOnExit: true, alertOnEnter: false, icon: 'school' },
  { id: 'z3', name: 'النادي', latitude: 30.0380, longitude: 31.2280, radius: 200, color: '#9B59B6', active: false, alertOnExit: false, alertOnEnter: false, icon: 'sports' },
];

const radiusOptions = [100, 200, 300, 500, 1000];
const colorOptions = [Colors.success, Colors.primary, Colors.error, Colors.warning, '#9B59B6', Colors.secondary];
const iconOptions = ['home', 'school', 'sports', 'local-hospital', 'store', 'park'] as const;

export default function GeofencingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { familyMembers } = useApp();
  const { showAlert } = useAlert();
  const mapRef = useRef<any>(null);

  const [zones, setZones] = useState<Zone[]>(defaultZones);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>('z1');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneRadius, setNewZoneRadius] = useState(300);
  const [newZoneColor, setNewZoneColor] = useState(Colors.primary);
  const [selectedMemberId, setSelectedMemberId] = useState(familyMembers[0]?.id || '');
  const [pendingCoords, setPendingCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const selectedZone = zones.find(z => z.id === selectedZoneId);
  const selectedMember = familyMembers.find(m => m.id === selectedMemberId);

  const memberLocation = selectedMember
    ? { latitude: selectedMember.currentLocation.lat, longitude: selectedMember.currentLocation.lng }
    : undefined;

  const handleMapPress = (coords: { latitude: number; longitude: number }) => {
    setPendingCoords(coords);
    setShowAddForm(true);
  };

  const handleAddZone = () => {
    if (!newZoneName.trim() || !pendingCoords) return;
    const newZone: Zone = {
      id: `z${Date.now()}`,
      name: newZoneName.trim(),
      latitude: pendingCoords.latitude,
      longitude: pendingCoords.longitude,
      radius: newZoneRadius,
      color: newZoneColor,
      active: true,
      alertOnExit: true,
      alertOnEnter: false,
      icon: 'place',
    };
    setZones(prev => [...prev, newZone]);
    setSelectedZoneId(newZone.id);
    setNewZoneName('');
    setShowAddForm(false);
    setPendingCoords(null);
    showAlert('تم إضافة المنطقة!', `تمت إضافة "${newZone.name}" بنجاح`);
  };

  const handleToggleZone = (id: string) => {
    setZones(prev => prev.map(z => z.id === id ? { ...z, active: !z.active } : z));
  };

  const handleToggleAlert = (id: string, field: 'alertOnExit' | 'alertOnEnter') => {
    setZones(prev => prev.map(z => z.id === id ? { ...z, [field]: !z[field as keyof Zone] } : z));
  };

  const handleDeleteZone = (id: string) => {
    showAlert('حذف المنطقة', 'هل تريد حذف هذه المنطقة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف', style: 'destructive',
        onPress: () => {
          setZones(prev => prev.filter(z => z.id !== id));
          setSelectedZoneId(null);
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.secondaryDark, Colors.secondary]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerStats}>
            <Text style={styles.headerStatNum}>{zones.filter(z => z.active).length}</Text>
            <Text style={styles.headerStatLabel}>نشطة</Text>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>المناطق المسموحة</Text>
            <Text style={styles.headerSub}>Geofencing</Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-forward" size={22} color="#fff" />
          </Pressable>
        </View>

        {/* Member Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 4 }}>
          {familyMembers.map(member => (
            <Pressable
              key={member.id}
              style={[styles.memberChip, selectedMemberId === member.id && styles.memberChipActive]}
              onPress={() => setSelectedMemberId(member.id)}
            >
              <Image source={{ uri: member.avatar }} style={styles.memberChipAvatar} contentFit="cover" />
              <Text style={[styles.memberChipName, selectedMemberId === member.id && { color: Colors.secondary }]}>
                {member.name.split(' ')[0]}
              </Text>
              {selectedMemberId === member.id && <MaterialIcons name="check" size={12} color={Colors.secondary} />}
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Map */}
      <View style={styles.mapArea}>
        <GeofenceMapView
          mapRef={mapRef}
          zones={zones}
          memberLocation={memberLocation}
          selectedZoneId={selectedZoneId || undefined}
          onMapPress={handleMapPress}
        />

        {/* Map Tip */}
        <View style={styles.mapTip}>
          <MaterialIcons name="touch-app" size={14} color={Colors.secondary} />
          <Text style={styles.mapTipText}>اضغط على الخريطة لإضافة منطقة</Text>
        </View>

        {/* Add Zone FAB */}
        <Pressable style={styles.addZoneFab} onPress={() => { setPendingCoords({ latitude: 30.0444, longitude: 31.2357 }); setShowAddForm(true); }}>
          <MaterialIcons name="add-location-alt" size={22} color="#fff" />
        </Pressable>
      </View>

      {/* Bottom Panel */}
      <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + 8 }]}>
        {/* Zone List */}
        <View style={styles.zoneListHeader}>
          <Pressable style={styles.addZoneTextBtn} onPress={() => { setPendingCoords({ latitude: 30.0444, longitude: 31.2357 }); setShowAddForm(true); }}>
            <MaterialIcons name="add" size={16} color={Colors.primary} />
            <Text style={styles.addZoneTextBtnText}>إضافة منطقة</Text>
          </Pressable>
          <Text style={styles.zoneListTitle}>المناطق المحددة</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 4 }}>
          {zones.map(zone => (
            <Pressable
              key={zone.id}
              style={[styles.zoneChip, { borderColor: zone.color }, selectedZoneId === zone.id && { backgroundColor: zone.color + '20' }, !zone.active && { opacity: 0.5 }]}
              onPress={() => setSelectedZoneId(zone.id === selectedZoneId ? null : zone.id)}
            >
              <MaterialIcons name={zone.icon as any} size={16} color={zone.color} />
              <Text style={[styles.zoneChipName, { color: zone.color }]}>{zone.name}</Text>
              <Text style={styles.zoneChipRadius}>{zone.radius}م</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Selected Zone Details */}
        {selectedZone ? (
          <View style={styles.zoneDetail}>
            <View style={styles.zoneDetailHeader}>
              <Pressable onPress={() => handleDeleteZone(selectedZone.id)}>
                <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
              </Pressable>
              <View style={styles.zoneDetailTitle}>
                <View style={[styles.zoneColorDot, { backgroundColor: selectedZone.color }]} />
                <Text style={styles.zoneDetailName}>{selectedZone.name}</Text>
              </View>
              <Switch
                value={selectedZone.active}
                onValueChange={() => handleToggleZone(selectedZone.id)}
                trackColor={{ false: Colors.border, true: selectedZone.color }}
                thumbColor="#fff"
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            </View>

            <View style={styles.zoneAlerts}>
              <View style={styles.alertRow}>
                <Switch
                  value={selectedZone.alertOnExit}
                  onValueChange={() => handleToggleAlert(selectedZone.id, 'alertOnExit')}
                  trackColor={{ false: Colors.border, true: Colors.error }}
                  thumbColor="#fff"
                  style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                />
                <Text style={styles.alertLabel}>تنبيه عند الخروج</Text>
                <MaterialIcons name="exit-to-app" size={16} color={Colors.error} />
              </View>
              <View style={styles.alertRow}>
                <Switch
                  value={selectedZone.alertOnEnter}
                  onValueChange={() => handleToggleAlert(selectedZone.id, 'alertOnEnter')}
                  trackColor={{ false: Colors.border, true: Colors.success }}
                  thumbColor="#fff"
                  style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                />
                <Text style={styles.alertLabel}>تنبيه عند الدخول</Text>
                <MaterialIcons name="login" size={16} color={Colors.success} />
              </View>
            </View>

            <View style={styles.radiusRow}>
              <Text style={styles.radiusLabel}>نطاق المنطقة: {selectedZone.radius} متر</Text>
            </View>
          </View>
        ) : null}
      </View>

      {/* Add Zone Form Modal */}
      {showAddForm ? (
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>إضافة منطقة جديدة</Text>

            <TextInput
              style={styles.nameInput}
              placeholder="اسم المنطقة (مثال: المدرسة)"
              placeholderTextColor={Colors.textTertiary}
              value={newZoneName}
              onChangeText={setNewZoneName}
              textAlign="right"
            />

            <Text style={styles.modalLabel}>نطاق المنطقة (متر)</Text>
            <View style={styles.radiusOptions}>
              {radiusOptions.map(r => (
                <Pressable
                  key={r}
                  style={[styles.radiusOption, newZoneRadius === r && styles.radiusOptionActive]}
                  onPress={() => setNewZoneRadius(r)}
                >
                  <Text style={[styles.radiusOptionText, newZoneRadius === r && { color: Colors.secondary }]}>
                    {r >= 1000 ? `${r / 1000}كم` : `${r}م`}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.modalLabel}>لون المنطقة</Text>
            <View style={styles.colorOptions}>
              {colorOptions.map(c => (
                <Pressable
                  key={c}
                  style={[styles.colorOption, { backgroundColor: c }, newZoneColor === c && styles.colorOptionActive]}
                  onPress={() => setNewZoneColor(c)}
                >
                  {newZoneColor === c && <MaterialIcons name="check" size={14} color="#fff" />}
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelModalBtn} onPress={() => { setShowAddForm(false); setPendingCoords(null); }}>
                <Text style={styles.cancelModalText}>إلغاء</Text>
              </Pressable>
              <Pressable
                style={[styles.addZoneConfirmBtn, !newZoneName.trim() && { opacity: 0.5 }]}
                onPress={handleAddZone}
              >
                <Text style={styles.addZoneConfirmText}>إضافة المنطقة</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.md,
    borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl,
    gap: Spacing.md,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.lg, fontWeight: Typography.bold, color: '#fff' },
  headerSub: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.5)' },
  headerStats: { alignItems: 'center' },
  headerStatNum: { fontFamily: Typography.fontFamily, fontSize: Typography.xl, fontWeight: Typography.black, color: Colors.primary },
  headerStatLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: 'rgba(255,255,255,0.6)' },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  memberChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  memberChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  memberChipAvatar: { width: 24, height: 24, borderRadius: 12 },
  memberChipName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold, color: 'rgba(255,255,255,0.8)',
  },
  mapArea: { height: 280, position: 'relative' },
  mapTip: {
    position: 'absolute', top: 12, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5,
  },
  mapTipText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs, color: Colors.secondary,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: Radius.full,
  },
  addZoneFab: {
    position: 'absolute', bottom: 12, right: 12,
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.golden,
  },
  bottomPanel: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl,
    padding: Spacing.base, gap: Spacing.md,
    ...Shadow.lg,
    flex: 1,
  },
  zoneListHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  zoneListTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary },
  addZoneTextBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6,
  },
  addZoneTextBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.primary },
  zoneChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1.5, ...Shadow.sm,
  },
  zoneChipName: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold },
  zoneChipRadius: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },
  zoneDetail: {
    backgroundColor: Colors.background, borderRadius: Radius.xl,
    padding: Spacing.md, gap: Spacing.sm,
  },
  zoneDetailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  zoneDetailTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  zoneColorDot: { width: 12, height: 12, borderRadius: 6 },
  zoneDetailName: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary },
  zoneAlerts: { gap: 6 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  alertLabel: {
    flex: 1, fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, color: Colors.textPrimary, textAlign: 'right',
  },
  radiusRow: { alignItems: 'flex-end' },
  radiusLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.xs, color: Colors.textTertiary },

  // MODAL
  modalOverlay: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl,
    padding: Spacing.xl, gap: Spacing.md,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.sm,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.lg, fontWeight: Typography.bold,
    color: Colors.textPrimary, textAlign: 'center',
  },
  nameInput: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg, padding: Spacing.md,
    fontFamily: Typography.fontFamily, fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  modalLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm, fontWeight: Typography.semiBold,
    color: Colors.textSecondary, textAlign: 'right',
  },
  radiusOptions: { flexDirection: 'row', gap: 8 },
  radiusOption: {
    flex: 1, backgroundColor: Colors.background,
    borderRadius: Radius.lg, paddingVertical: 8, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  radiusOptionActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  radiusOptionText: { fontFamily: Typography.fontFamily, fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textPrimary },
  colorOptions: { flexDirection: 'row', gap: 10 },
  colorOption: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  colorOptionActive: { borderWidth: 3, borderColor: '#fff', ...Shadow.sm },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelModalBtn: {
    flex: 1, backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  cancelModalText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.semiBold, color: Colors.textSecondary },
  addZoneConfirmBtn: {
    flex: 2, backgroundColor: Colors.primary,
    borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center',
    ...Shadow.golden,
  },
  addZoneConfirmText: { fontFamily: Typography.fontFamily, fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.secondary },
});
