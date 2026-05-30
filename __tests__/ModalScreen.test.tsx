import ModalScreen from "@/app/modal";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert } from "react-native";

const mockAddEntry = jest.fn();
jest.mock("../context/FuelContext", () => ({
  useFuel: () => ({
    addEntry: mockAddEntry,
  }),
}));

const mockBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: mockCanGoBack,
    replace: jest.fn(),
  }),
}));

jest.spyOn(Alert, "alert");

describe("FuelBuddy — Ekran Formularza Tankowania (ModalScreen)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("powinien wyświetlić komunikat błędu, jeśli użytkownik spróbuje zapisać niekompletny formularz", () => {
    render(<ModalScreen />);

    const saveButton = screen.getByText("Zapisz tankowanie");
    fireEvent.press(saveButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Błąd",
      "Proszę wypełnić wszystkie pola poprawnie",
    );
    expect(mockAddEntry).not.toHaveBeenCalled();
  });

  it("powinien poprawnie przetworzyć dane wejściowe, wywołać addEntry i cofnąć ekran", () => {
    render(<ModalScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText("np. Orlen, Shell"),
      "Circle K",
    );
    fireEvent.changeText(screen.getAllByPlaceholderText("0.00")[0], "50"); // Litry
    fireEvent.changeText(screen.getAllByPlaceholderText("0.00")[1], "6.00"); // Cena za litr
    fireEvent.changeText(screen.getByPlaceholderText("np. 125400"), "155000"); // Przebieg

    const saveButton = screen.getByText("Zapisz tankowanie");
    fireEvent.press(saveButton);

    expect(mockAddEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        station: "Circle K",
        liters: 50,
        pricePerLiter: 6,
        totalCost: 300,
        odometer: 155000,
      }),
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it("powinien wywołać natywny aparat urządzenia po uzyskaniu uprawnień od użytkownika", async () => {
    jest.spyOn(ImagePicker, "requestCameraPermissionsAsync").mockResolvedValue({
      status: ImagePicker.PermissionStatus.GRANTED,
      granted: true,
      expires: "never",
      canAskAgain: true,
    });

    const spyLaunch = jest
      .spyOn(ImagePicker, "launchCameraAsync")
      .mockResolvedValue({
        canceled: false,
        assets: [{ uri: "file://receipt.jpg", width: 100, height: 100 }],
      });

    render(<ModalScreen />);

    const photoButton = screen.getByText("Dodaj zdjęcie paragonu");
    fireEvent.press(photoButton);

    expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
    await screen.findByText("Zmień zdjęcie paragonu");
    expect(spyLaunch).toHaveBeenCalled();
  });
});
