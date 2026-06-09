// Native map component for ride tracking
import React from 'react';
import { View, StyleSheet, Pressable, Text, Animated } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, Typography } from '@/constants/theme';

interface TrackingMapViewProps {
  mapRef: React.RefObject<MapView>;
  userLocation: { latitude: number; longitude: number };
  driverPos: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  routeCoords: { latitude: number; longitude: number }[];
  rideStatus: string;
  pulseAnim: Animated.Value;
  insetTop: number;
  onBack: () => void;
  onSOS: () => void;
  onRecenter: () => void;
}

export default function TrackingMapView({
  mapRef,
  userLocation,
  driverPos,
  destination,
  routeCoords,
  rideStatus,
  pulseAnim,
  insetTop,
  onBack,
  onSOS,
  onRecenter,
}: TrackingMapViewProps) {
  return (
    <View style={styles.mapArea}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: (driverPos.latitude + userLocation.latitude) / 2,
          longitude: (driverPos.longitude + userLocation.longitude) / 2,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        showsTraffic={false}
      >
        {/* User Marker */}
        <Marker coordinate={userLocation} title="موقعك">
          <View style={styles.userMarker}>
            <MaterialIcons name="person-pin" size={20} color="#fff" />
          </View>
        </Marker>

        {/* Driver Marker */}
        <Marker coordinate={driverPos} title="السائق">
          <Animated.View style={[styles.driverMarkerOuter, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.driverMarkerInner}>
              <MaterialIcons name="directions-car" size={16} color="#fff" />
            </View>
          </Animated.View>
        </Marker>

        {/* Destination */}
        {rideStatus !== 'arriving' && (
          <Marker coordinate={destination} title="الوجهة">
            <View style={styles.destMarker}>
              <MaterialIcons name="location-on" size={20} color="#fff" />
            </View>
          </Marker>
        )}

        {/* Route Line */}
        <Polyline
          coordinates={routeCoords}
          strokeColor={Colors.primary}
          strokeWidth={4}
          lineDashPattern={rideStatus === 'arriving' ? [8, 4] : undefined}
        />
      </MapView>

      {/* Back Button */}
      <Pressable style={[styles.backBtn, { top: insetTop + 12 }]} onPress={onBack}>
        <MaterialIcons name="arrow-forward" size={22} color={Colors.textPrimary} />
      </Pressable>

      {/* SOS Button */}
      <Pressable style={[styles.sosBtn, { top: insetTop + 12 }]} onPress={onSOS}>
        <MaterialIcons name="emergency" size={16} color={Colors.error} />
        <Text style={styles.sosBtnText}>SOS</Text>
      </Pressable>

      {/* Recenter */}
      <Pressable style={styles.recenterBtn} onPress={onRecenter}>
        <MaterialIcons name="my-location" size={20} color={Colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  mapArea: { flex: 1, position: 'relative' },
  map: { width: '100%', height: '100%' },
  userMarker: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.secondary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
    ...Shadow.md,
  },
  driverMarkerOuter: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary + '30',
    alignItems: 'center', justifyContent: 'center',
  },
  driverMarkerInner: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
    ...Shadow.golden,
  },
  destMarker: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.error,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
    ...Shadow.sm,
  },
  backBtn: {
    position: 'absolute', right: Spacing.base,
    backgroundColor: Colors.surface,
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },
  sosBtn: {
    position: 'absolute', left: Spacing.base,
    backgroundColor: Colors.errorSurface,
    borderRadius: Radius.lg,
    paddingHorizontal: 12, paddingVertical: 9,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.error,
  },
  sosBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.extraBold,
    color: Colors.error,
  },
  recenterBtn: {
    position: 'absolute', right: Spacing.base, bottom: 210,
    backgroundColor: Colors.surface,
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.md,
  },
});
