import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

export type FuelEntry = {
  id: string;
  station: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  odometer: number;
  imageUri?: string;
  synced?: boolean;
};

export interface VehicleInfo {
  nextServiceKm: number;
  lastOilChangeKm: number;
  techReviewDate: string;
  synced?: boolean;
}

export type State = {
  entries: FuelEntry[];
  vehicleInfo: VehicleInfo;
  loading: boolean;
};

export type Action =
  | {
      type: "LOAD_DATA";
      payload: { entries: FuelEntry[]; vehicleInfo: VehicleInfo };
    }
  | { type: "ADD_ENTRY"; payload: FuelEntry }
  | { type: "DELETE_ENTRY"; payload: string }
  | { type: "UPDATE_VEHICLE_INFO"; payload: VehicleInfo }
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "UPDATE_ENTRY_ID";
      payload: { oldId: string; syncedEntry: FuelEntry };
    };

const initialVehicleInfo: VehicleInfo = {
  nextServiceKm: 15000,
  lastOilChangeKm: 0,
  techReviewDate: new Date().toISOString().split("T")[0],
  synced: true,
};

const ASYNC_STORAGE_ENTRIES_KEY = "@fuelbuddy_entries_cache";
const ASYNC_STORAGE_VEHICLE_KEY = "@fuelbuddy_vehicle_cache";

export const fuelReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOAD_DATA":
      return {
        ...state,
        entries: action.payload.entries,
        vehicleInfo: action.payload.vehicleInfo,
        loading: false,
      };
    case "ADD_ENTRY":
      return { ...state, entries: [action.payload, ...state.entries] };
    case "DELETE_ENTRY":
      return {
        ...state,
        entries: state.entries.filter((e) => e.id !== action.payload),
      };
    case "UPDATE_VEHICLE_INFO":
      return { ...state, vehicleInfo: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "UPDATE_ENTRY_ID":
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.oldId ? action.payload.syncedEntry : e,
        ),
      };
    default:
      return state;
  }
};

const FuelContext = createContext<
  | {
      state: State;
      addEntry: (entry: FuelEntry) => Promise<void>;
      deleteEntry: (id: string) => Promise<void>;
      updateVehicleInfo: (info: VehicleInfo) => Promise<void>;
      syncOfflineData: (uid: string) => Promise<void>;
    }
  | undefined
>(undefined);

export const FuelProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(fuelReducer, {
    entries: [],
    vehicleInfo: initialVehicleInfo,
    loading: true,
  });

  const [userId, setUserId] = useState<string | null>(null);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const saveStateToCache = async (
    entries: FuelEntry[],
    vehicle: VehicleInfo,
  ) => {
    try {
      await AsyncStorage.setItem(
        ASYNC_STORAGE_ENTRIES_KEY,
        JSON.stringify(entries),
      );
      await AsyncStorage.setItem(
        ASYNC_STORAGE_VEHICLE_KEY,
        JSON.stringify(vehicle),
      );
    } catch (err) {
      console.error("Nie udało się zapisać pamięci podręcznej na dysku:", err);
    }
  };

  const fetchFreshData = useCallback(async (uid: string) => {
    try {
      const { data: entriesData, error: entriesError } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", uid)
        .order("date", { ascending: false });

      if (entriesError) throw entriesError;

      const remoteEntries: FuelEntry[] = (entriesData || []).map((e) => ({
        id: e.id.toString(),
        station: e.station,
        date: e.date,
        liters: Number(e.liters),
        pricePerLiter: Number(e.price_per_liter),
        totalCost: Number(e.total_cost),
        odometer: Number(e.odometer),
        imageUri: e.image_uri || undefined,
        synced: true,
      }));

      const unsyncedLocalEntries = stateRef.current.entries.filter(
        (e) => !e.synced,
      );
      const mergedEntries = [...unsyncedLocalEntries, ...remoteEntries];

      const uniqueEntries = mergedEntries.filter(
        (entry, index, self) =>
          index === self.findIndex((t) => t.id === entry.id),
      );

      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicle_info")
        .select("*")
        .eq("user_id", uid)
        .single();

      if (vehicleError && vehicleError.code !== "PGRST116") {
        throw vehicleError;
      }

      let mergedVehicle = stateRef.current.vehicleInfo;
      if (vehicleData && stateRef.current.vehicleInfo.synced !== false) {
        mergedVehicle = {
          nextServiceKm: Number(vehicleData.next_service_km),
          lastOilChangeKm: Number(vehicleData.last_oil_change_km),
          techReviewDate: vehicleData.tech_review_date,
          synced: true,
        };
      }

      dispatch({
        type: "LOAD_DATA",
        payload: { entries: uniqueEntries, vehicleInfo: mergedVehicle },
      });

      await saveStateToCache(uniqueEntries, mergedVehicle);
    } catch (error) {
      console.log(
        "Praca w trybie offline — brak połączenia ze zdalną bazą danych:",
        error,
      );
    }
  }, []);

  const syncOfflineData = useCallback(async (uid: string) => {
    if (!uid) return;

    const unsyncedEntries = stateRef.current.entries.filter((e) => !e.synced);

    for (const localEntry of unsyncedEntries) {
      try {
        const calculatedTotal =
          Number(localEntry.liters) * Number(localEntry.pricePerLiter);

        const { data, error: insertError } = await supabase
          .from("entries")
          .insert({
            user_id: uid,
            station: localEntry.station,
            date: localEntry.date,
            liters: Number(localEntry.liters),
            price_per_liter: Number(localEntry.pricePerLiter),
            total_cost: calculatedTotal,
            odometer: Number(localEntry.odometer),
            image_uri: localEntry.imageUri || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (data) {
          const syncedEntry: FuelEntry = {
            id: data.id.toString(),
            station: data.station,
            date: data.date,
            liters: Number(data.liters),
            pricePerLiter: Number(data.price_per_liter),
            totalCost: Number(data.total_cost),
            odometer: Number(data.odometer),
            imageUri: data.image_uri || undefined,
            synced: true,
          };

          dispatch({
            type: "UPDATE_ENTRY_ID",
            payload: { oldId: localEntry.id, syncedEntry },
          });
        }
      } catch (err) {
        console.error("Pojedyncza synchronizacja wpisu nie powiodła się:", err);
      }
    }

    if (stateRef.current.vehicleInfo.synced === false) {
      try {
        const { error: upsertError } = await supabase
          .from("vehicle_info")
          .upsert({
            user_id: uid,
            next_service_km: Number(stateRef.current.vehicleInfo.nextServiceKm),
            last_oil_change_km: Number(
              stateRef.current.vehicleInfo.lastOilChangeKm,
            ),
            tech_review_date: stateRef.current.vehicleInfo.techReviewDate,
          });

        if (upsertError) throw upsertError;

        dispatch({
          type: "UPDATE_VEHICLE_INFO",
          payload: { ...stateRef.current.vehicleInfo, synced: true },
        });
      } catch (err) {
        console.error("Nie udało się zsynchronizować danych pojazdu:", err);
      }
    }

    await saveStateToCache(
      stateRef.current.entries,
      stateRef.current.vehicleInfo,
    );
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const cachedEntries = await AsyncStorage.getItem(
          ASYNC_STORAGE_ENTRIES_KEY,
        );
        const cachedVehicle = await AsyncStorage.getItem(
          ASYNC_STORAGE_VEHICLE_KEY,
        );

        const localEntries: FuelEntry[] = cachedEntries
          ? JSON.parse(cachedEntries)
          : [];
        const localVehicle: VehicleInfo = cachedVehicle
          ? JSON.parse(cachedVehicle)
          : initialVehicleInfo;

        dispatch({
          type: "LOAD_DATA",
          payload: { entries: localEntries, vehicleInfo: localVehicle },
        });
      } catch (err) {
        console.error("Błąd ładowania pamięci podręcznej:", err);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        await fetchFreshData(session.user.id);
      } else {
        setUserId(null);
      }
    };

    initializeData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          await syncOfflineData(session.user.id);
        } else {
          setUserId(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchFreshData, syncOfflineData]);

  const addEntry = async (entry: FuelEntry) => {
    const localId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const calculatedTotal = Number(entry.liters) * Number(entry.pricePerLiter);

    const newLocalEntry: FuelEntry = {
      ...entry,
      id: localId,
      totalCost: calculatedTotal,
      synced: false,
    };

    dispatch({ type: "ADD_ENTRY", payload: newLocalEntry });
    const updatedEntries = [newLocalEntry, ...state.entries];

    await saveStateToCache(updatedEntries, state.vehicleInfo);

    if (userId) {
      try {
        const { data, error: insertError } = await supabase
          .from("entries")
          .insert({
            user_id: userId,
            station: entry.station,
            date: entry.date || new Date().toISOString(),
            liters: Number(entry.liters),
            price_per_liter: Number(entry.pricePerLiter),
            total_cost: calculatedTotal,
            odometer: Number(entry.odometer),
            image_uri: entry.imageUri || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (data) {
          const cloudEntry: FuelEntry = {
            id: data.id.toString(),
            station: data.station,
            date: data.date,
            liters: Number(data.liters),
            pricePerLiter: Number(data.price_per_liter),
            totalCost: Number(data.total_cost),
            odometer: Number(data.odometer),
            imageUri: data.image_uri || undefined,
            synced: true,
          };

          dispatch({
            type: "UPDATE_ENTRY_ID",
            payload: { oldId: localId, syncedEntry: cloudEntry },
          });

          const finalEntries = updatedEntries.map((e) =>
            e.id === localId ? cloudEntry : e,
          );
          await saveStateToCache(finalEntries, state.vehicleInfo);
        }
      } catch (error) {
        console.log(
          "Błąd zapisu w chmurze (Wpis bezpieczny jako OFFLINE):",
          error,
        );
      }
    }
  };

  const deleteEntry = async (id: string) => {
    dispatch({ type: "DELETE_ENTRY", payload: id });
    const finalEntries = state.entries.filter((e) => e.id !== id);
    await saveStateToCache(finalEntries, state.vehicleInfo);

    if (userId && !id.startsWith("local_")) {
      try {
        const { error: deleteError } = await supabase
          .from("entries")
          .delete()
          .eq("id", id)
          .eq("user_id", userId);

        if (deleteError) throw deleteError;
      } catch (error) {
        console.log(
          "Usunięto tylko lokalnie (brak synchronizacji sieciowej):",
          error,
        );
      }
    }
  };

  const updateVehicleInfo = async (info: VehicleInfo) => {
    const localVehicle: VehicleInfo = { ...info, synced: false };

    dispatch({ type: "UPDATE_VEHICLE_INFO", payload: localVehicle });
    await saveStateToCache(state.entries, localVehicle);

    if (userId) {
      try {
        const { error: upsertError } = await supabase
          .from("vehicle_info")
          .upsert({
            user_id: userId,
            next_service_km: Number(info.nextServiceKm),
            last_oil_change_km: Number(info.lastOilChangeKm),
            tech_review_date: info.techReviewDate,
          });

        if (upsertError) throw upsertError;

        const syncedVehicle = { ...info, synced: true };
        dispatch({ type: "UPDATE_VEHICLE_INFO", payload: syncedVehicle });
        await saveStateToCache(state.entries, syncedVehicle);
      } catch (error) {
        console.log(
          "Dane pojazdu zapisane lokalnie. Synchronizacja odłożona w czasie:",
          error,
        );
      }
    }
  };

  return (
    <FuelContext.Provider
      value={{
        state,
        addEntry,
        deleteEntry,
        updateVehicleInfo,
        syncOfflineData,
      }}
    >
      {children}
    </FuelContext.Provider>
  );
};

export const useFuel = () => {
  const context = useContext(FuelContext);
  if (!context) throw new Error("useFuel must be used within a FuelProvider");
  return context;
};
