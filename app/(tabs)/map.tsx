import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

interface GasStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  brand?: string;
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingStations, setFetchingStations] = useState(false);

  async function fetchNearbyGasStations(latitude: number, longitude: number) {
    setFetchingStations(true);
    const radius = 5000;

    const query = `[out:json][timeout:15];(node["amenity"="fuel"](around:${radius},${latitude},${longitude});way["amenity"="fuel"](around:${radius},${latitude},${longitude}););out center;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);

      const contentType = response.headers.get("content-type");
      if (
        !response.ok ||
        !contentType ||
        !contentType.includes("application/json")
      ) {
        throw new Error(
          "Serwer map jest przeciążony. Spróbuj ponownie za chwilę.",
        );
      }

      const data = await response.json();

      const fetchedStations: GasStation[] = data.elements
        .map((element: any) => {
          const lat = element.lat || (element.center && element.center.lat);
          const lon = element.lon || (element.center && element.center.lon);

          return {
            id: element.id.toString(),
            name: element.tags?.name || element.tags?.brand || "Stacja Paliw",
            brand: element.tags?.brand || undefined,
            latitude: lat,
            longitude: lon,
          };
        })
        .filter((station: GasStation) => station.latitude && station.longitude);

      setStations(fetchedStations);
    } catch (error: any) {
      console.error("Błąd pobierania stacji z Overpass API:", error);
      Alert.alert(
        "Informacja",
        "Nie udało się pobrać stacji paliw z sieci (serwer zajęty). Wyświetlamy samą mapę.",
      );
    } finally {
      setFetchingStations(false);
    }
  }

  useEffect(() => {
    async function initializeMap() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg(
            "Brak uprawnień do lokalizacji. Mapa pokaże widok domyślny.",
          );
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        await fetchNearbyGasStations(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
        );
      } catch (error) {
        Alert.alert("Błąd", "Nie udało się pobrać lokalizacji urządzenia.");
      } finally {
        setLoading(false);
      }
    }

    initializeMap();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Inicjalizacja mapy i GPS...</Text>
      </View>
    );
  }

  const defaultRegion = {
    latitude: 52.2297,
    longitude: 21.0122,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  const currentRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }
    : defaultRegion;

  return (
    <View style={styles.container}>
      {errorMsg && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{errorMsg}</Text>
        </View>
      )}

      {fetchingStations && (
        <View style={styles.inlineLoading}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.inlineLoadingText}>Pobieranie stacji...</Text>
        </View>
      )}

      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={currentRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title={station.name}
            description={
              station.brand ? `Sieć: ${station.brand}` : "Stacja benzynowa"
            }
          >
            <View style={styles.customMarker}>
              <Ionicons name="water" size={16} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  map: { width: "100%", height: "100%" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fe",
  },
  loadingText: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 16,
    fontWeight: "500",
  },
  banner: {
    backgroundColor: "#fee2e2",
    padding: 10,
    alignItems: "center",
    zIndex: 99,
  },
  bannerText: { color: "#ef4444", fontSize: 12, fontWeight: "600" },
  customMarker: {
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  inlineLoading: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 99,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inlineLoadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#1e293b",
    fontWeight: "600",
  },
});
