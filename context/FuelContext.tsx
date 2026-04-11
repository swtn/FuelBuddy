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

type State = {
  entries: FuelEntry[];
  loading: boolean;
};

type Action =
  | { type: "LOAD_ENTRIES"; payload: FuelEntry[] }
  | { type: "ADD_ENTRY"; payload: FuelEntry }
  | { type: "DELETE_ENTRY"; payload: string };

const STORAGE_KEY = "@fuel_buddy_data";

const fuelReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOAD_ENTRIES":
      return { ...state, entries: action.payload, loading: false };
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
    default:
      return state;
  }
};

const FuelContext = createContext<
  | {
      state: State;
      addEntry: (entry: FuelEntry) => Promise<void>;
      deleteEntry: (id: string) => Promise<void>;
    }
  | undefined
>(undefined);

export const FuelProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(fuelReducer, {
    entries: [],
    loading: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved)
          dispatch({ type: "LOAD_ENTRIES", payload: JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to load fuel entries", e);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
  }, [state.entries]);

  const addEntry = async (entry: FuelEntry) => {
    dispatch({ type: "ADD_ENTRY", payload: entry });
  };

  const deleteEntry = async (id: string) => {
    dispatch({ type: "DELETE_ENTRY", payload: id });
  };

  return (
    <FuelContext.Provider value={{ state, addEntry, deleteEntry }}>
      {children}
    </FuelContext.Provider>
  );
};

export const useFuel = () => {
  const context = useContext(FuelContext);
  if (!context) throw new Error("useFuel must be used within a FuelProvider");
  return context;
};
