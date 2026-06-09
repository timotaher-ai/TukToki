// Native map component for ride booking
import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/constants/theme';

interface BookingMapViewProps {
  mapRef: React.RefObject<MapView>;
  userLocation: { latitude: number; longitude: number } | null;
  locationLoading: boolean;
  mapExpanded: boolean;
  onGetLocation: () => void;
  onToggleExpand: () => void;
}

const CAIRO_REGION = {
  latitude: 30.0444,
  longitude: 31.2357,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function BookingMapView({
  mapRef,
  userLocation,
  locationLoading,
  mapExpanded,
  onGetLocation,
  onToggleExpand,
}: BookingMapViewProps) {
  return (
    <View style={[styles.mapContainer, mapExpanded && styles.mapContainerExpanded]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={
          userLocation
            ? { ...userLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 }
            : CAIRO_REGION
        }
        showsUserLocation
        showsMyLocationButton={false}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="موقعك">
            <View style={styles.myLocationMarker}>
              <MaterialIcons name="my-location" size={18} color="#fff" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <Pressable style={styles.mapControlBtn} onPress={onGetLocation}>
          <MaterialIcons
            name={locationLoading ? 'refresh' : 'my-location'}
            size={18}
            color={Colors.primary}
          />
        </Pressable>
        <Pressable style={styles.mapControlBtn} onPress={onToggleExpand}>
          <MaterialIcons
            name={mapExpanded ? 'fullscreen-exit' : 'fullscreen'}
            size={18}
            color={Colors.primary}
          />
        </Pressable>
      </View>

      {!userLocation && (
        <Pressable style={styles.locationPrompt} onPress={onGetLocation}>
          <MaterialIcons name="location-searching" size={16} color={Colors.primary} />
          <Text style={styles.locationPromptText}>
            {locationLoading ? 'جاري تحديد موقعك...' : 'اضغط لتحديد موقعك بـ GPS'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: { height: 220, position: 'relative', overflow: 'hidden' },
  mapContainerExpanded: { height: 360 },
  map: { width: '100%', height: '100%' },
  mapControls: { position: 'absolute', right: 12, bottom: 12, gap: 8 },
  mapControlBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.md,
  },
  locationPrompt: {
    position: 'absolute', bottom: 12, left: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7,
    ...Shadow.sm,
  },
  locationPromptText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.semiBold,
  },
  myLocationMarker: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
    ...Shadow.golden,
  },
});
