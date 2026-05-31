import JournalScreen from "@/app/(tabs)/index";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

const defaultEntries = [
  {
    id: "1",
    station: "Shell",
    date: "2026-05-30T10:00:00.000Z",
    liters: 50,
    pricePerLiter: 6.0,
    totalCost: 300,
    odometer: 101000,
  },
  {
    id: "2",
    station: "Orlen",
    date: "2026-05-15T10:00:00.000Z",
    liters: 40,
    pricePerLiter: 6.0,
    totalCost: 240,
    odometer: 100000,
  },
];

let mockEntries = [...defaultEntries];

const mockDeleteEntry = jest.fn();

jest.mock("../context/FuelContext", () => ({
  useFuel: () => ({
    state: {
      entries: mockEntries,
      vehicleInfo: {},
      loading: false,
    },
    deleteEntry: mockDeleteEntry,
  }),
}));

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@expo/vector-icons", () => {
  const ReactComponent = require("react");
  const { Text } = require("react-native");

  return {
    Ionicons: ({ name, testID }: any) =>
      ReactComponent.createElement(Text, { testID }, name),
    FontAwesome: ({ name, testID }: any) =>
      ReactComponent.createElement(Text, { testID }, name),
    MaterialIcons: ({ name, testID }: any) =>
      ReactComponent.createElement(Text, { testID }, name),
  };
});

describe("FuelBuddy — Widok Dziennika i Obliczenia Statystyk (JournalScreen)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert");
    mockEntries = [...defaultEntries];
  });

  it("powinien prawidłowo zsumować wydatki oraz obliczyć średnie spalanie z przekazanych wpisów", () => {
    render(<JournalScreen />);

    expect(screen.getByText(/540\.00/)).toBeTruthy();
    expect(screen.getByText(/5\.00/)).toBeTruthy();
  });

  it("powinien wywołać natywne okno ostrzegawcze przed skasowaniem wpisu", () => {
    render(<JournalScreen />);

    const deleteButton =
      screen.queryAllByTestId("trash-icon")[0] ||
      screen.getAllByText(/trash|delete|bin/i)[0];

    fireEvent.press(deleteButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Usuń wpis",
      "Czy na pewno chcesz usunąć ten wpis?",
      expect.any(Array),
    );
  });
});

describe("FuelBuddy — Dziennik (Obsługa pustego stanu)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("TEST 9: powinien pokazać informację o braku wpisów, gdy tablica entries jest pusta", () => {
    mockEntries = [];

    render(<JournalScreen />);
    expect(
      screen.getByText(/Brak wpisów\. Dodaj pierwsze tankowanie!/),
    ).toBeTruthy();
  });

  it("TEST 10: powinien wyświetlić kreski '--' w miejscu spalania, gdy posiadamy mniej niż 2 wpisy", () => {
    mockEntries = [
      {
        id: "1",
        station: "BP",
        date: "2026-05-15",
        liters: 40,
        pricePerLiter: 6,
        totalCost: 240,
        odometer: 100000,
      },
    ];

    render(<JournalScreen />);
    expect(screen.getByText(/--/)).toBeTruthy();
  });
});
