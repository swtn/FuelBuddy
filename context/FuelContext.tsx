import { supabase } from "@/lib/supabase";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
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
};

export interface VehicleInfo {
  nextServiceKm: number;
  lastOilChangeKm: number;
  techReviewDate: string;
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
  | { type: "SET_LOADING"; payload: boolean };

const initialVehicleInfo: VehicleInfo = {
  nextServiceKm: 15000,
  lastOilChangeKm: 0,
  techReviewDate: new Date().toISOString().split("T")[0],
};

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

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        fetchUserData(session.user.id);
      } else {
        setUserId(null);
        dispatch({
          type: "LOAD_DATA",
          payload: { entries: [], vehicleInfo: initialVehicleInfo },
        });
      }
    };

    checkInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          fetchUserData(session.user.id);
        } else {
          setUserId(null);
          dispatch({
            type: "LOAD_DATA",
            payload: { entries: [], vehicleInfo: initialVehicleInfo },
          });
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (uid: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data: entriesData, error: entriesError } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", uid)
        .order("date", { ascending: false });

      if (entriesError) throw entriesError;

      const mappedEntries: FuelEntry[] = (entriesData || []).map((e) => ({
        id: e.id.toString(),
        station: e.station,
        date: e.date,
        liters: Number(e.liters),
        pricePerLiter: Number(e.price_per_liter),
        totalCost: Number(e.total_cost),
        odometer: Number(e.odometer),
        imageUri: e.image_uri || undefined,
      }));

      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicle_info")
        .select("*")
        .eq("user_id", uid)
        .single();

      let mappedVehicle: VehicleInfo = initialVehicleInfo;

      if (vehicleError && vehicleError.code !== "PGRST116") {
        throw vehicleError;
      }

      if (vehicleData) {
        mappedVehicle = {
          nextServiceKm: Number(vehicleData.next_service_km),
          lastOilChangeKm: Number(vehicleData.last_oil_change_km),
          techReviewDate: vehicleData.tech_review_date,
        };
      }

      dispatch({
        type: "LOAD_DATA",
        payload: { entries: mappedEntries, vehicleInfo: mappedVehicle },
      });
    } catch (error) {
      console.error("Błąd podczas pobierania danych z Supabase:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addEntry = async (entry: FuelEntry) => {
    if (!userId) return;

    try {
      const calculatedTotal =
        Number(entry.liters) * Number(entry.pricePerLiter);

      const { data, error } = await supabase
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

      if (error) throw error;

      if (data) {
        const newLocalEntry: FuelEntry = {
          id: data.id.toString(),
          station: data.station,
          date: data.date,
          liters: Number(data.liters),
          pricePerLiter: Number(data.price_per_liter),
          totalCost: Number(data.total_cost),
          odometer: Number(data.odometer),
          imageUri: data.image_uri || undefined,
        };
        dispatch({ type: "ADD_ENTRY", payload: newLocalEntry });
      }
    } catch (error) {
      console.error("Błąd dodawania wpisu w Supabase:", error);
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("entries")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;

      dispatch({ type: "DELETE_ENTRY", payload: id });
    } catch (error) {
      console.error("Błąd usuwania wpisu z Supabase:", error);
      throw error;
    }
  };

  const updateVehicleInfo = async (info: VehicleInfo) => {
    if (!userId) return;

    try {
      const { error } = await supabase.from("vehicle_info").upsert({
        user_id: userId,
        next_service_km: Number(info.nextServiceKm),
        last_oil_change_km: Number(info.lastOilChangeKm),
        tech_review_date: info.techReviewDate,
      });

      if (error) throw error;

      dispatch({ type: "UPDATE_VEHICLE_INFO", payload: info });
    } catch (error) {
      console.error("Błąd aktualizacji danych pojazdu w Supabase:", error);
      throw error;
    }
  };

  return (
    <FuelContext.Provider
      value={{ state, addEntry, deleteEntry, updateVehicleInfo }}
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
