import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Text,
  Platform,
  // PermissionsAndroid,
  Linking,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info'; // Import DeviceInfo for GPS check
import MainScreensHeader from '../components/headers/MainScreensHeader';
import MyImages from '../assets/images/MyImages';
import axios from 'axios';
import colors from '../assets/colors/AppColors';
import TransparentStatusbar from '../components/statusbar/TransparentStatusbar';
import AppHeader from '../components/headers/AppHeader';
import { GOOGLE_MAPS_APIKEY } from '../services/constants';
import { useFocusEffect } from '@react-navigation/native';

const mosqueLocation = {
  latitude: 53.839029,
  longitude: -2.215966,
};

const MosqueLocationScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      checkAndRequestLocationPermission();
    }, []),
  );

  const checkAndRequestLocationPermission = async () => {
    const permissionStatus = await check(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    );

    if (permissionStatus === RESULTS.GRANTED) {
      checkIfLocationServicesEnabled(); // If permission granted, check GPS
    } else {
      requestLocationPermission(); // Request permission if not granted
    }
  };

  const checkIfLocationServicesEnabled = async () => {
    const isLocationEnabled = await DeviceInfo.isLocationEnabled(); // Check if GPS is on
    if (isLocationEnabled) {
      getCurrentLocation(); // Get location if GPS is enabled
    } else {
      showEnableLocationAlert(); // Prompt to enable GPS
    }
  };

  const requestLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'We need access to your location to show you relevant information.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      checkIfLocationServicesEnabled(); // Check GPS if permission granted
    } else {
      console.log('Location permission denied');
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentLocation(location); // Save location to state
        fetchRoute(location, mosqueLocation);
        centerMap(location);
      },

      error => {
        console.log('Location error:', error);
        showEnableLocationAlert(); // Prompt to enable location if error
      },
      // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const showEnableLocationAlert = () => {
    Alert.alert(
      'Enable Location',
      'Please enable location services and ensure GPS is on.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enable',
          onPress: () =>
            Linking.sendIntent(
              'android.settings.LOCATION_SOURCE_SETTINGS',
            ).then(
              () => setTimeout(getCurrentLocation, 500),
            ),
        },
      ],
    );
  };

  const fetchRoute = async (origin, destination) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_APIKEY}`,
      );
      const points = decodePolyline(
        response.data.routes[0].overview_polyline.points,
      );
      setRouteCoords(points);
    } catch (error) {
      console.log('Error fetching directions:', error);
    }
  };

  const decodePolyline = t => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < t.length) {
      let result = 0,
        shift = 0,
        b;

      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  const centerMap = location => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TransparentStatusbar />
      <AppHeader />
      <MainScreensHeader
        subTitle="Mosque Location"
        title="Mosque Coordinates"
      />
      <MapView
      mapType='terrain'
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          ...mosqueLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Marker
          coordinate={mosqueLocation}
          title="Location"
          description="Ghausia Nelson">
          <View style={styles.markerContainer}>
            <Image source={MyImages.logo} style={styles.markerImage} />
          </View>
        </Marker>
        {currentLocation && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={colors.primary}
            strokeWidth={3}
          />
        )}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  map: {
    flex: 1
  },
  markerContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  markerImage: {
    height: 35,
    width: 35,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default MosqueLocationScreen;
