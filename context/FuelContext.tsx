import React, { createContext, useReducer, useContext, ReactNode } from 'react';

export type FuelEntry = {
    id: string;
    date: string;
    amount: number;
    price: number;
    station: string;
    liters: number;
    image: string | null;
}

type State = {
    entries: FuelEntry[];
}

type Action = | { type: 'ADD_ENTRY'; payload: FuelEntry }
              | { type: 'DELETE_ENTRY'; payload: string };
            
const initialState: State = {
    entries: [],
}

const FuelReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_ENTRY':
            return{
                ...state,
                entries: [action.payload, ...state.entries],
            }
        case 'DELETE_ENTRY':
            return{
                ...state,
                entries: state.entries.filter(entry => entry.id !== action.payload),
            }
        default:
            return state;
    }
}

const FuelContext = createContext<{
    state: State;
    addEntry: (entry: FuelEntry) => void;
    deleteEntry: (id: string) => void;
} | undefined>(undefined)

export const FuelProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(FuelReducer, initialState);

    const addEntry = (entry: FuelEntry) => {
        dispatch({ type: 'ADD_ENTRY', payload: entry });
    }

    const deleteEntry = (id: string) => {
        dispatch({ type: 'DELETE_ENTRY', payload: id });
    }

    return (
        <FuelContext.Provider value={{ state, addEntry, deleteEntry }}>
            {children}
        </FuelContext.Provider>
    )
}

export const useFuel = () => {
    const context = useContext(FuelContext);
    if (!context) {
        throw new Error('useFuel must be used within a FuelProvider');
    }
    return context;
}