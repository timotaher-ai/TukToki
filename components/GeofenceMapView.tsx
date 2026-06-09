// Native - Geofence Map View
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface Zone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  active: boolean;
}

interface GeofenceMapViewProps {
  mapRef: React.RefObject<MapView>;
  zones: Zone[];
  memberLocation?: { latitude: number; longitude: number };
  selectedZoneId?: string;
  onMapPress?: (coords: { latitude: number; longitude: number }) => void;
}

export default function GeofenceMapView({
  mapRef,
  zones,
  memberLocation,
  selectedZoneId,
  onMapPress,
}: GeofenceMapViewProps) {
  const center = memberLocation || (zones[0] ? { latitude: zones[0].latitude, longitude: zones[0].longitude } : { latitude: 30.0444, longitude: 31.2357 });

  return (
    <View style={styles.mapWrap}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          ...center,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        onPress={(e) => onMapPress && onMapPress(e.nativeEvent.coordinate)}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Active zones */}
        {zones.filter(z => z.active).map(zone => (
          <React.Fragment key={zone.id}>
            <Circle
              center={{ latitude: zone.latitude, longitude: zone.longitude }}
              radius={zone.radius}
              strokeColor={zone.color + 'CC'}
              fillColor={zone.color + '25'}
              strokeWidth={selectedZoneId === zone.id ? 3 : 2}
            />
            <Marker
              coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
              title={zone.name}
            >
              <View style={[styles.zoneMarker, { backgroundColor: zone.color, borderColor: selectedZoneId === zone.id ? '#fff' : zone.color + '80' }]}>
                <MaterialIcons name="place" size={14} color="#fff" />
              </View>
            </Marker>
          </React.Fragment>
        ))}

        {/* Member current location */}
        {memberLocation ? (
          <Marker coordinate={memberLocation} title="الموقع الحالي">
            <View style={styles.memberMarker}>
              <MaterialIcons name="person-pin" size={18} color="#fff" />
            </View>
          </Marker>
        ) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: { flex: 1 },
  map: { width: '100%', height: '100%' },
  zoneMarker: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2,
  },
  memberMarker: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.secondary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
  },
});
