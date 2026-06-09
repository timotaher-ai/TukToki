// Native - Family Map View
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface FamilyMember {
  id: string;
  name: string;
  status: string;
  currentLocation: { lat: number; lng: number };
}

const memberStatusColor: Record<string, string> = {
  in_ride: Colors.primary,
  online: Colors.success,
  offline: Colors.textTertiary,
};

interface FamilyMapViewProps {
  mapRef: React.RefObject<MapView>;
  members: FamilyMember[];
  homeLocation: { latitude: number; longitude: number };
  geofenceRadius?: number;
  showGeofence?: boolean;
}

export default function FamilyMapView({ mapRef, members, homeLocation, geofenceRadius = 500, showGeofence }: FamilyMapViewProps) {
  return (
    <View style={styles.mapWrap}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: homeLocation.latitude,
          longitude: homeLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Home marker */}
        <Marker coordinate={homeLocation} title="المنزل">
          <View style={styles.homeMarker}>
            <MaterialIcons name="home" size={18} color="#fff" />
          </View>
        </Marker>

        {/* Geofence circle */}
        {showGeofence && (
          <Circle
            center={homeLocation}
            radius={geofenceRadius}
            strokeColor={Colors.primary + '80'}
            fillColor={Colors.primary + '15'}
            strokeWidth={2}
          />
        )}

        {/* Member markers */}
        {members.map(member => {
          const coord = { latitude: member.currentLocation.lat, longitude: member.currentLocation.lng };
          const color = memberStatusColor[member.status] || Colors.textTertiary;
          return (
            <Marker key={member.id} coordinate={coord} title={member.name}>
              <View style={[styles.memberMarker, { borderColor: color }]}>
                <MaterialIcons
                  name={member.status === 'in_ride' ? 'directions-car' : member.status === 'online' ? 'person' : 'person-off'}
                  size={14}
                  color={color}
                />
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: { flex: 1 },
  map: { width: '100%', height: '100%' },
  homeMarker: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.secondary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
  },
  memberMarker: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
