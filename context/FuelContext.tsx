import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useReducer } from "react";

export type FuelEntry = {
  id: string;
  station: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  odometer: number;
  imageUri?: string;
};

export interface VehicleInfo {
  nextServiceKm: number;
  lastOilChangeKm: number;
  techReviewDate: string;
}

type State = {
  entries: FuelEntry[];
  vehicleInfo: VehicleInfo;
  loading: boolean;
};

type Action =
  | { type: "LOAD_DATA"; payload: { entries: FuelEntry[]; vehicleInfo: VehicleInfo } }
  | { type: "ADD_ENTRY"; payload: FuelEntry }
  | { type: "DELETE_ENTRY"; payload: string }
  | { type: "UPDATE_VEHICLE_INFO"; payload: VehicleInfo };

const STORAGE_KEY = "@fuel_buddy_data";

const initialVehicleInfo: VehicleInfo = {
  nextServiceKm: 15000,
  lastOilChangeKm: 0,
  techReviewDate: new Date().toISOString().split('T')[0],
};

const fuelReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOAD_DATA":
      return { 
        ...state, 
        entries: action.payload.entries, 
        vehicleInfo: action.payload.vehicleInfo, 
        loading: false 
      };
    case "ADD_ENTRY":
      const l = Number(action.payload.liters);
      const p = Number(action.payload.pricePerLiter);
      const calculatedTotal = l * p;
      const newEntry = {
        ...action.payload,
        totalCost: calculatedTotal,
      };
      return { ...state, entries: [newEntry, ...state.entries] };
    case "DELETE_ENTRY":
      return {
        ...state,
        entries: state.entries.filter((e) => e.id !== action.payload),
      };
    case "UPDATE_VEHICLE_INFO":
      return { ...state, vehicleInfo: action.payload };
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
    }
  | undefined
>(undefined);

export const FuelProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(fuelReducer, {
    entries: [],
    vehicleInfo: initialVehicleInfo,
    loading: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch({ 
            type: "LOAD_DATA", 
            payload: {
              entries: Array.isArray(parsed) ? parsed : (parsed.entries || []),
              vehicleInfo: parsed.vehicleInfo || initialVehicleInfo
            }
          });
        }
      } catch (e) {
        console.error("Failed to load fuel entries", e);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!state.loading) {
      const dataToSave = {
        entries: state.entries,
        vehicleInfo: state.vehicleInfo
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [state.entries, state.vehicleInfo, state.loading]);

  const addEntry = async (entry: FuelEntry) => {
    dispatch({ type: "ADD_ENTRY", payload: entry });
  };

  const deleteEntry = async (id: string) => {
    dispatch({ type: "DELETE_ENTRY", payload: id });
  };

  const updateVehicleInfo = async (info: VehicleInfo) => {
    dispatch({ type: "UPDATE_VEHICLE_INFO", payload: info });
  };

  return (
    <FuelContext.Provider value={{ state, addEntry, deleteEntry, updateVehicleInfo }}>
      {children}
    </FuelContext.Provider>
  );
};

export const useFuel = () => {
  const context = useContext(FuelContext);
  if (!context) throw new Error("useFuel must be used within a FuelProvider");
  return context;
};