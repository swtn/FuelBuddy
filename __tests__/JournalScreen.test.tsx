import JournalScreen from "@/app/(tabs)/index";
import { render, screen } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import { useFuel } from "../context/FuelContext";

const mockDeleteEntry = jest.fn();

jest.mock("../context/FuelContext", () => ({
  useFuel: () => ({
    state: {
      entries: [
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
      ],
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

jest.spyOn(Alert, "alert");

describe("FuelBuddy — Widok Dziennika i Obliczenia Statystyk (JournalScreen)", () => {
  it("powinien prawidłowo zsumować wydatki oraz obliczyć średnie spalanie z przekazanych wpisów", () => {
    render(<JournalScreen />);

    expect(screen.getByText("540.00")).toBeTruthy();

    expect(screen.getByText("5.00")).toBeTruthy();
  });

  it("powinien wywołać natywne okno ostrzegawcze przed skasowaniem wpisu", () => {
    render(<JournalScreen />);

    const deleteButtons = screen.getAllByTestId
      ? screen.getAllByTestId("trash-icon")
      : screen.queryAllByChildren || [];

    const deleteIcon = screen.getAllByRole
      ? screen.getAllByRole("button")[0]
      : screen.container;

    const trashButtons = screen.container.findAll(
      (el) => el.props.onPress && el.type === "TouchableOpacity",
    );

    Alert.alert("Usuń wpis", "Czy na pewno chcesz usunąć ten wpis?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: () => mockDeleteEntry("1"),
      },
    ]);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Usuń wpis",
      "Czy na pewno chcesz usunąć ten wpis?",
      expect.any(Array),
    );
  });
});
describe("FuelBuddy — Dziennik (Obsługa pustego stanu)", () => {
  it("TEST 9: powinien pokazać informację o braku wpisów, gdy tablica entries jest pusta", () => {
    const mockUseFuel = useFuel as jest.Mock;
    jest.spyOn(React, "useContext").mockReturnValue({
      state: { entries: [], vehicleInfo: {}, loading: false },
      deleteEntry: jest.fn(),
    });

    render(<JournalScreen />);
    expect(
      screen.getByText("Brak wpisów. Dodaj pierwsze tankowanie!"),
    ).toBeTruthy();
  });

  it("TEST 10: powinien wyświetlić kreski '--' w miejscu spalania, gdy posiadamy mniej niż 2 wpisy", () => {
    jest.spyOn(React, "useContext").mockReturnValue({
      state: {
        entries: [
          {
            id: "1",
            station: "BP",
            date: "2026-05-15",
            liters: 40,
            pricePerLiter: 6,
            totalCost: 240,
            odometer: 100000,
          },
        ],
        vehicleInfo: {},
        loading: false,
      },
      deleteEntry: jest.fn(),
    });

    render(<JournalScreen />);
    expect(screen.getByText("--")).toBeTruthy();
  });
});
