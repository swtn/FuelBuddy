# ⛽ FuelBuddy — Twój Asystent Wydatków na Paliwo

FuelBuddy to nowoczesna aplikacja mobilna stworzona w architekturze **React Native (Expo)** i zintegrowana z chmurą **Supabase**. Narzędzie pozwala kierowcom na pełną kontrolę nad wydatkami na paliwo, monitorowanie średniego spalania pojazdu, śledzenie historii tankowań z możliwością cyfrowej archiwizacji dowodów zakupu (aparat) oraz sprawdzanie lokalizacji najbliższych stacji benzynowych w czasie rzeczywistym.

---

## 📱 Prezentacja Interfejsu (UI/UX)

### Część 1: Autentykacja i Zarządzanie Tankowaniami

|                                                          Ekran Logowania                                                           |                                                      Dziennik Tankowań                                                       |                                                           Dodawanie Nowego Wpisu                                                           |
| :--------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: |
|                                            ![Ekran Logowania](/assets/images/login.jpg)                                            |                                        ![Dziennik Tankowań](/assets/images/fuel.jpg)                                         |                                                ![Dodawanie Wpisu](/assets/images/modal.jpg)                                                |
| **Opis Funkcji:**<br>Czysty i minimalistyczny ekran logowania użytkownika z opcją szybkiego przejścia do rejestracji nowego konta. | **Opis Funkcji:**<br>Główny pulpit z podsumowaniem wydatków, średnim spalaniem oraz listą wpisów z możliwością ich usuwania. | **Opis Funkcji:**<br>Intuicyjny formularz wprowadzania danych o tankowaniu (stacja, litry, cena) wraz z opcją załączenia zdjęcia paragonu. |

### Część 2: Analityka, Status Pojazdu i Profil

|                                                         Statystyki i Wykresy                                                          |                                                             Serwisowanie & Status                                                             |                                                            Ustawienia Aplikacji                                                             |
| :-----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: |
|                                                ![Statystyki](/assets/images/stats.jpg)                                                |                                                 ![Status Pojazdu](/assets/images/vehicle.jpg)                                                 |                                                 ![Ustawienia](/assets/images/settings.jpg)                                                  |
| **Opis Funkcji:**<br>Wizualizacja trendów cenowych paliwa oraz objętości tankowań na interaktywnych wykresach liniowych i słupkowych. | **Opis Funkcji:**<br>Monitorowanie aktualnego przebiegu, odliczanie kilometrów do serwisu olejowego oraz przypomnienie o badaniu technicznym. | **Opis Funkcji:**<br>Zarządzanie profilem zalogowanego użytkownika, dostęp do polityki prywatności oraz bezpieczne wylogowanie z aplikacji. |

---

---

## ⚡ Szybki Start

Postępuj zgodnie z poniższymi krokami, aby błyskawicznie postawić lokalne środowisko deweloperskie:

### 1. Klonowanie repozytorium i instalacja zależności

Otwórz terminal i wykonaj następujące polecenia:

```bash
git clone [https://github.com/swtn/fuel-buddy.git](https://github.com/TWOJ-LOGIN/fuel-buddy.git)
cd fuel-buddy
npm install
```

### 2. Konfiguracja zmiennych środowiskowych .env

Utwórz plik o nazwie .env w głównym katalogu projektu i wklej do niego parametry połączenia ze swoją instancją Supabase:

```bash
# Adres URL Twojego projektu Supabase
EXPO_PUBLIC_SUPABASE_URL=

# Publiczny klucz anonimowy do autoryzacji zapytań API
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

### 3. Uruchom serwer

```bash
npx expo start
```

### 4. Wyświetlenie aplikacji na urządzeniu

- Fizyczny telefon: Pobierz darmową aplikację Expo Go z App Store lub Google Play i zeskanuj kod QR wyświetlony w terminalu.

- Sieć lokalna (w razie problemów): Jeśli Twoje urządzenia są w różnych podsieciach lub router izoluje klientów, uruchom serwer w trybie tunelowania bezpiecznego: npx expo start --tunnel.

- Symulator: Naciśnij klawisz i (dla iOS) lub a (dla Androida) bezpośrednio w terminalu.

🛠️ Stos Technologiczny (Tech Stack & Zależności)
Aplikacja bazuje na nowoczesnych, natywnych modułach gwarantujących wysoką wydajność:

- Framework: Expo SDK 51+ z systemem nawigacji opartej na plikach (Expo Router).

- Język programowania: TypeScript (pełne, ścisłe typowanie interfejsów i stanów bazodanowych).

- Baza danych & Autentykacja: Supabase (PostgreSQL, bezpieczne zarządzanie sesjami użytkowników przez JWT, Supabase Auth).

- Zarządzanie Stanem: React Context API w połączeniu z architekturą Reducera (useReducer).

- Moduły Natywne:

- expo-image-picker – obsługa systemowego aparatu i galerii zdjęć.

- expo-location – bezpośredni dostęp do systemowego modułu GPS urządzenia.

- react-native-maps – renderowanie natywnych map Google Maps (Android) oraz Apple Maps (iOS).

🧠 Decyzje Architektoniczne i Komponentowe (Dlaczego, a nie Co?)
Kod źródłowy projektu został zaprojektowany z naciskiem na elastyczność i odporność na błędy. Poniżej opisano kluczowe decyzje inżynieryjne:

🔴 Globalny State Management (FuelContext.tsx)

- DLACZEGO? Zamiast wdrażać zewnętrzne, ciężkie systemy zarządzania stanem jak Redux czy Zustand, aplikacja wykorzystuje natywne useReducer. Biznesowa logika wyliczania wydatków paliwowych, średniego spalania ($l/100km$) na podstawie stanu odometru oraz sumowania kosztów jest ze sobą ściśle powiązana. Zamknięcie jej w czystych funkcjach redukujących gwarantuje atomowość operacji, pełną przewidywalność stanów oraz całkowitą separację logiki obliczeniowej od warstwy prezentacji (UI).

🔴 Reaktywny Strażnik Autentykacji (app/\_layout.tsx)

- DLACZEGO? Przekierowania użytkownika między ekranem logowania a prywatnymi zakładkami menu ((tabs)) nie są wywoływane manualnie w funkcjach obsługi przycisków. Zamiast tego zaimplementowano globalny nasłuch sesji supabase.auth.onAuthStateChange. Gwarantuje to automatyczną i natychmiastową reakcję aplikacji na wygaśnięcie tokenu JWT lub zdalne wylogowanie z bazy – aplikacja bezkompromisowo blokuje dostęp do danych, eliminując błędy typu unauthorized api call.

🔴 Dynamiczna separacja zachowania klawiatury (KeyboardAvoidingView)

- DLACZEGO? W formularzach logowania (auth.tsx) oraz dodawania transakcji (modal.tsx) zachowanie komponentu unikania klawiatury jest uzależnione od systemu operacyjnego za pomocą warunku Platform.OS === 'ios' ? 'padding' : 'height'. Silniki renderujące systemów iOS i Android zupełnie inaczej kalkulują przestrzeń roboczą okna. To podejście zapobiega tzw. "podwójnemu skakaniu" inputów i zapewnia, że aktywne pole tekstowe plasuje się zawsze dokładnie 15-20 pikseli nad klawiaturą, niezależnie od wielkości ekranu smartfona.

🔴 Izolacja sieciowa zapytań Overpass API (app/(tabs)/map.tsx)

- DLACZEGO? W celu uniknięcia płatnych kluczy Google Places, dane o stacjach paliw są pobierane na żywo z serwerów OpenStreetMap za pomocą zapytania języka Overpass QL. Publiczne serwery bywają jednak przeciążone i w momentach szczytowych zwracają kod błędu w formacie HTML zamiast JSON. Wprowadzona walidacja nagłówka odpowiedzi (contentType.includes("application/json")) przechwytuje te awarie w bloku catch i zamienia je na bezpieczne ostrzeżenia wizualne (console.warn / baner w UI), dzięki czemu awaria zewnętrznej sieci nie powoduje krytycznego błędu całego interfejsu (crash aplikacji).

Lista Funkcjonalności

1. System Autentykacji: Rejestracja i logowanie użytkowników, zabezpieczenie tras przed niezalogowanymi, opcja podglądu hasła.

2. Dziennik Pojazdu: Rejestr tankowań zbierający dane o cenie za litr, sumarycznym koszcie, ilości zatankowanego paliwa oraz przebiegu.

3. Analityka Spalania: Automatyczny algorytm wyliczający ekonomię jazdy na podstawie różnic przebiegów pomiędzy kolejnymi wpisami.

4. Zdjęcia Paragonów: Integracja z aparatem fotograficznym w celu lokalnego przechowywania dokumentów fiskalnych związanych z pojazdem.

5. Panel Powiadomień: Monitorowanie progów serwisowych (wymiana oleju, termin ważności badania technicznego).

##### PROJEKT ZALICZENIOWY Z PRZEDMIOTU JĘZYKI PROGRAMOWANIA URZĄDZEŃ MOBILNYCH

###### Wykonanie Daniel Świątek
