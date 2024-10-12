import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MainScreensHeader from '../components/headers/MainScreensHeader';
import MyImages from '../assets/images/MyImages';
import axios from 'axios';
import colors from '../assets/colors/AppColors';

const mosqueLocation = {
  latitude: 32.1120, 
  longitude: 74.1923,
};

const GOOGLE_MAPS_APIKEY = 'AIzaSyDjUQi1vqjc1j5AbFBIyvy_zXl8qoqwXGo'; 
const MosqueLocationScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState('');
  
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          // Request permission directly for Android
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission Denied',
              'Location permission is required.',
            );
            return;
          }
        }
        // Fetch the current location
        Geolocation.getCurrentPosition(
          position => {
            const currentLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setCurrentLocation(currentLocation);
            fetchRoute(currentLocation, mosqueLocation);
          },
          error => {
            Alert.alert('Error', 'Failed to get your location');
            console.log(error);
          },
          // {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } catch (error) {
        console.log('Permission error:', error);
      }
    };

    // Call the function to request permission and fetch location
    requestLocationPermission();
  }, []);

  // Fetch route from current location to mosque using Google Directions API
  const fetchRoute = async (origin, destination) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_APIKEY}`
      );

      const points = decodePolyline(response.data.routes[0].overview_polyline.points);
      setRouteCoords(points);

      // Extract the duration (time to destination) from the response
      const duration = response.data.routes[0].legs[0].duration.text;
      setEstimatedTime(duration); // Set the estimated time
    } catch (error) {
      console.log('Error fetching directions:', error);
    }
  };

  // Decode the polyline from Google API response
  const decodePolyline = (t) => {
    let points = [];
    let index = 0, len = t.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  return (
    <View style={styles.container}>
      <MainScreensHeader title={'Mosque Location'} />
      <MapView
        style={styles.map}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        showsUserLocation={true}
        initialRegion={{
          ...mosqueLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Marker
          coordinate={mosqueLocation}
          title="Mosque"
          description="Islamiya Mosque">
          <View style={styles.markerContainer}>
            <Image source={MyImages.masjid} style={styles.markerImage} />
          </View>
        </Marker>

        {currentLocation && (
          <>
            <Polyline
              coordinates={routeCoords}
              strokeColor={colors.black}
              strokeWidth={3}
            />
          </>
        )}
      </MapView>
      {/* {estimatedTime !== '' && (
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>Estimated Time: {estimatedTime}</Text>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {
    flex: 1,
  },
  markerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerImage: {
    height: 35,
    width: 35,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: 'white',
  },
  timeContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  timeText: {
    fontSize: 16,
    color: '#000',
  },
});

export default MosqueLocationScreen;
