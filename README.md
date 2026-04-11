# ⛽ FUELBUDDY

**FUELBUDDY** to intuicyjna aplikacja mobilna stworzona w React Native (Expo), która pomaga kierowcom monitorować wydatki na paliwo oraz śledzić średnie spalanie pojazdu.

---

## 📱 Podgląd aplikacji

|                                 Ekran Główny                                 |                          Dodawanie Tankowania                          |
| :--------------------------------------------------------------------------: | :--------------------------------------------------------------------: |
| ![Główny Interfejs](https://via.placeholder.com/300x600?text=FUELBUDDY+Home) | ![Dodawanie](https://via.placeholder.com/300x600?text=Add+Entry+Modal) |
|                           _Statystyki i historia_                            |                     _Formularz z obsługą aparatu_                      |

---

## ✨ Funkcje

- **Dziennik Tankowań**: Przejrzysta lista wszystkich wizyt na stacjach paliw z datą i przebiegiem.
- **Automatyczne Statystyki**: Wyliczanie sumy wydatków oraz średniego spalania (l/100km) na podstawie wprowadzonych danych.
- **Zarządzanie Wpisami**: Możliwość łatwego dodawania nowych rekordów oraz usuwania błędnych lub nieaktualnych wpisów.
- **Zdjęcia Paragonów**: Możliwość dołączenia zdjęcia paragonu do każdego tankowania za pomocą aparatu systemowego.
- **Persystencja Danych**: Wszystkie dane są bezpiecznie przechowywane lokalnie na urządzeniu przy użyciu AsyncStorage.

---

## 🛠️ Technologia

- **Framework**: React Native / Expo Router.
- **Język**: TypeScript.
- **State Management**: Context API z użyciem `useReducer` dla zapewnienia spójności danych.
- **Ikony**: Ionicons (@expo/vector-icons).
- **Baza danych**: AsyncStorage (lokalny magazyn danych).

---

## 🚀 Instalacja i Uruchomienie

1. **Sklonuj repozytorium**:
   ```bash
   git clone [https://github.com/TWOJA-NAZWA/fuel-buddy.git](https://github.com/TWOJA-NAZWA/fuel-buddy.git)
   cd fuel-buddy
   ```
2. **Zainstaluj Zalezności**
   ```bash
   npm install
   ```
3. **Uruchom projekt**
   ```bash
   npx expo start
   ```

**Autor: Daniel Świątek**
