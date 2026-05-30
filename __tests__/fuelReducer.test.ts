import {
    Action,
    FuelEntry,
    fuelReducer,
    State,
    VehicleInfo,
} from "@/context/FuelContext";

describe("FuelBuddy - testy Reducera", () => {
  const initialVehicle: VehicleInfo = {
    nextServiceKm: 15000,
    lastOilChangeKm: 0,
    techReviewDate: "2026-01-01",
  };

  const initialState: State = {
    entries: [],
    vehicleInfo: initialVehicle,
    loading: true,
  };

  it("powinien dodać nowy wpis tankowania na początek listy (ADD_ENTRY)", () => {
    const newEntry: FuelEntry = {
      id: "1",
      station: "Orlen",
      date: "2026-05-30",
      liters: 40,
      pricePerLiter: 6.5,
      totalCost: 260,
      odometer: 120000,
    };

    const action: Action = { type: "ADD_ENTRY", payload: newEntry };
    const newState = fuelReducer(initialState, action);

    expect(newState.entries.length).toBe(1);
    expect(newState.entries[0]).toEqual(newEntry);
  });

  it("powinien usunąć wskazany wpis z historii po ID (DELETE_ENTRY)", () => {
    const stateWithEntries: State = {
      ...initialState,
      entries: [
        {
          id: "1",
          station: "Shell",
          date: "2026-05-28",
          liters: 10,
          pricePerLiter: 6,
          totalCost: 60,
          odometer: 100,
        },
        {
          id: "2",
          station: "BP",
          date: "2026-05-29",
          liters: 20,
          pricePerLiter: 6,
          totalCost: 120,
          odometer: 200,
        },
      ],
    };

    const action: Action = { type: "DELETE_ENTRY", payload: "1" };
    const newState = fuelReducer(stateWithEntries, action);

    expect(newState.entries.length).toBe(1);
    expect(newState.entries[0].id).toBe("2");
  });

  it("powinien zaktualizowac dane techniczne pojazdu bez modyfikacji wpisow (UPDATE_VEHICLE_INFO)", () => {
    const updatedVehicle: VehicleInfo = {
      nextServiceKm: 20000,
      lastOilChangeKm: 120000,
      techReviewDate: "2027-01-01",
    };

    const action: Action = {
      type: "UPDATE_VEHICLE_INFO",
      payload: updatedVehicle,
    };
    const newState = fuelReducer(initialState, action);

    expect(newState.vehicleInfo.nextServiceKm).toBe(20000);
    expect(newState.vehicleInfo.lastOilChangeKm).toBe(120000);
    expect(newState.vehicleInfo.techReviewDate).toBe("2027-01-01");
  });
});
