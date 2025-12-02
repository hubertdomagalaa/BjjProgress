PROJECT_CONTEXT.md - BJJ Progress AppUWAGA DLA AI: Ten plik zawiera absolutną prawdę o stanie projektu. Zawsze odnoś się do tych definicji, kolorów i struktur danych podczas generowania kodu. Nie wymyślaj nowych konwencji, jeśli są już tutaj zdefiniowane.1. Informacje o ProjekcieNazwa: BJJ Progress (możliwa nazwa robocza: BjjTrack)Cel: Aplikacja do śledzenia progresu w Brazylijskim Jiu-Jitsu, zapisywania treningów (logów), sparingów i analizy statystyk.Platformy: iOS, Android (via Expo Go).Język: TypeScript.2. Tech Stack & BibliotekiFramework: React Native (Expo SDK 50+).Język: TypeScript.Styling: NativeWind (TailwindCSS dla RN).Backend / Baza danych: Appwrite.Nawigacja: React Navigation (Native Stack).Wykresy: react-native-gifted-charts lub react-native-svg.Płatności: Stripe (@stripe/stripe-react-native).Zarządzanie stanem: React Context API (dla Auth) + lokalny stan komponentów.Formularze: react-hook-form.3. Design System (Dark Mode Sport Aesthetics)Background (Tło): #6d636f (Deep Dark Grey)Primary Accent (Główny kolor/Przyciski): #b123c7 (Vivid Purple)Text Main (Tekst): #fefcfe (White)Secondary Elements: Efekt glassmorphism, półprzezroczyste białe tła.Styl: Neobrutalism / Modern Sport. Duże zaokrąglenia (rounded-xl / 20px).4. Architektura Danych (Appwrite Schema)Kolekcja: training_logsPoleTypOpisuser_idStringID użytkownika (relacja do Auth)dateDatetimeData i godzina treninguduration_minutesIntegerCzas trwania w minutachtypeStringEnum: "GI" lub "NO-GI"technique_notesStringOpis techniki (Długi tekst)reflection_notesStringWnioski / Co poprawić (Długi tekst)sparring_roundsIntegerLiczba walksubmissions_givenIntegerIle razy poddałemsubmissions_receivedIntegerIle razy zostałem poddany5. Aktualna Struktura Plików(Tę sekcję należy aktualizować w miarę rozwoju projektu. Poniżej stan początkowy)/ (root)
├── App.tsx             # Główny punkt wejścia
├── app.json            # Konfiguracja Expo
├── babel.config.js     # Konfiguracja Babel (NativeWind)
├── tailwind.config.js  # Konfiguracja Tailwind
├── tsconfig.json       # Konfiguracja TypeScript
├── src/
│   ├── components/     # Komponenty wielokrotnego użytku (Button, Input, Card)
│   ├── screens/        # Ekrany aplikacji
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── AddLogScreen.tsx
│   │   └── StatsScreen.tsx
│   ├── lib/            # Konfiguracja zewnętrznych usług
│   │   └── appwrite.ts # Klient Appwrite
│   ├── context/        # React Context
│   │   └── AuthContext.tsx
│   └── types/          # Definicje typów TS
6. Status Realizacji (Roadmapa)[ ] Krok 1: Inicjalizacja projektu Expo i instalacja bibliotek.[ ] Krok 2: Konfiguracja NativeWind i Tailwind.[ ] Krok 3: Implementacja nawigacji (Stack Navigator).[ ] Krok 4: UI Shell (Puste ekrany z podstawowym layoutem i kolorami).[ ] Krok 5: Konfiguracja Appwrite SDK i AuthContext (Logowanie).[ ] Krok 6: Ekran AddLogScreen (Formularz dodawania treningu).[ ] Krok 7: Ekran HomeScreen (Lista kafelków z treningami).[ ] Krok 8: Ekran StatsScreen (Logika obliczania statystyk i wykresy).[ ] Krok 9: Edycja logów.[ ] Krok 10: Integracja Stripe (Subskrypcje).Instrukcja dla AI:Podczas generowania kodu, upewnij się, że używasz klas Tailwind zgodnych z NativeWind (np. className="bg-[#6d636f] flex-1"). Wszystkie importy muszą być zgodne z powyższą strukturą plików.