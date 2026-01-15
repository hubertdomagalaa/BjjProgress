<p align="center">
  <img src="https://img.shields.io/badge/Platform-iOS-000000?style=for-the-badge&logo=apple&logoColor=white" alt="iOS" />
  <img src="https://img.shields.io/badge/React_Native-0.76.9-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-SDK_52-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/App_Store-5.0_★-0D96F6?style=for-the-badge&logo=app-store&logoColor=white" alt="App Store Rating" />
</p>

<h1 align="center">🥋 BJJProgress</h1>

<p align="center">
  <strong>The Ultimate Brazilian Jiu-Jitsu Training Tracker</strong><br/>
  Track your journey from white belt to black belt with detailed analytics and insights
</p>

<p align="center">
  <a href="https://apps.apple.com/app/bjjprogress/id6755962774">
    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on App Store" height="50" />
  </a>
</p>

---

## 📱 Overview

**BJJProgress** is a modern, feature-rich iOS application designed specifically for Brazilian Jiu-Jitsu practitioners who want to take their training to the next level. Whether you're a beginner tracking your first month or a seasoned competitor analyzing years of data, BJJProgress provides the tools you need to visualize your growth and optimize your training.

### ⭐ App Store Reviews

> *"Since I started using this app I got two stripes on my blue belt in 3 months"* - **Buggyslayer**

> *"That's insane! That's the app I needed, very good, clear and easy app for tracking your progress"* - **evildikson**

> *"The best app for tracking your BJJ stats"* - **Clown550**

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 📊 **Comprehensive Training Logs**
- Track Gi and No-Gi sessions separately
- Record training duration and techniques drilled
- Log sparring rounds, submissions given & received
- Add detailed notes and personal reflections

</td>
<td width="50%">

### 📈 **Advanced Analytics Dashboard**
- Visual progress charts and statistics
- Training frequency analysis
- Submission success rate tracking
- Performance trends over time

</td>
</tr>
<tr>
<td width="50%">

### 👥 **Social Features**
- Connect with training partners
- Share progress milestones
- Compare statistics with friends
- Community motivation & accountability

</td>
<td width="50%">

### 🎨 **Premium User Experience**
- Dark mode sport aesthetics
- Glassmorphism design elements
- Smooth animations & haptic feedback
- Intuitive, fighter-focused interface

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native 0.76.9 with Expo SDK 52 |
| **Language** | TypeScript 5.3 |
| **Styling** | NativeWind (TailwindCSS for React Native) |
| **State Management** | React Context API + TanStack Query |
| **Backend** | Appwrite (BaaS) |
| **Payments** | RevenueCat (In-App Purchases) |
| **Navigation** | React Navigation (Native Stack) |
| **Charts** | react-native-gifted-charts |
| **Animations** | Moti + Lottie + React Native Reanimated |
| **Analytics** | PostHog + Sentry |
| **i18n** | i18next + react-i18next |

---

## 🏗️ Architecture

```
BjjProgress/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # Application screens
│   │   ├── HomeScreen     # Training log overview
│   │   ├── AddLogScreen   # New training entry form
│   │   ├── StatsScreen    # Analytics & charts
│   │   ├── FriendsScreen  # Social features
│   │   ├── SettingsScreen # User preferences
│   │   └── PaywallScreen  # Premium subscription
│   ├── context/           # React Context providers
│   ├── lib/               # Third-party service configs
│   ├── constants/         # App-wide constants
│   ├── i18n/              # Internationalization
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Helper functions
├── backend/               # Server-side functions
└── landing-page/          # Next.js marketing website
```

---

## 📦 Key Dependencies

```json
{
  "react-native": "0.76.9",
  "expo": "~52.0.25",
  "typescript": "^5.3.3",
  "nativewind": "^4.2.1",
  "@tanstack/react-query": "^5.90.11",
  "react-native-appwrite": "^0.19.0",
  "react-native-purchases": "^9.6.10",
  "react-native-reanimated": "~3.16.1",
  "react-native-gifted-charts": "^1.4.68",
  "moti": "^0.30.0",
  "lottie-react-native": "7.1.0"
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Xcode 15+ (for iOS development)
- Expo CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/hubertdomagalaa/BjjProgress.git

# Navigate to project directory
cd BjjProgress/BjjProgress

# Install dependencies
npm install

# Start development server
npx expo start
```

### Running on iOS

```bash
# Run on iOS Simulator
npx expo run:ios

# Or scan QR code with Expo Go app
npx expo start
```

---

## 🔐 Environment Configuration

Create a `.env` file in the root directory:

```env
APPWRITE_ENDPOINT=your_appwrite_endpoint
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_DATABASE_ID=your_database_id
REVENUECAT_API_KEY=your_revenuecat_key
POSTHOG_API_KEY=your_posthog_key
SENTRY_DSN=your_sentry_dsn
```

---

## 📊 Data Model

### Training Log Schema

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | String | User identifier |
| `date` | DateTime | Training date & time |
| `duration_minutes` | Integer | Session duration |
| `type` | Enum | "GI" or "NO-GI" |
| `technique_notes` | String | Techniques practiced |
| `reflection_notes` | String | Personal insights |
| `sparring_rounds` | Integer | Number of rolls |
| `submissions_given` | Integer | Successful submissions |
| `submissions_received` | Integer | Times submitted |

---

## 🎨 Design System

The app follows a modern **Dark Mode Sport Aesthetic** with neobrutalism influences:

- **Background**: `#6d636f` (Deep Dark Grey)
- **Primary Accent**: `#b123c7` (Vivid Purple)
- **Text**: `#fefcfe` (White)
- **Borders**: Large radius (20px)
- **Effects**: Glassmorphism, semi-transparent overlays

---

## 🗺️ Roadmap

- [x] Core training log functionality
- [x] Statistics and analytics dashboard
- [x] Social/friends features
- [x] Premium subscription (RevenueCat)
- [x] App Store release
- [ ] Apple Watch companion app
- [ ] Competition tracking mode
- [ ] AI-powered technique recommendations
- [ ] Belt progression predictions

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👨‍💻 Developer

**Hubert Domagała**

[![App Store](https://img.shields.io/badge/App_Store-Developer-0D96F6?style=flat-square&logo=app-store&logoColor=white)](https://apps.apple.com/developer/hubert-domagala/id1857641989)
[![GitHub](https://img.shields.io/badge/GitHub-hubertdomagalaa-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/hubertdomagalaa)

---

<p align="center">
  <strong>🥋 Track Your Progress. Master Your Craft. 🥋</strong>
</p>

<p align="center">
  <a href="https://apps.apple.com/app/bjjprogress/id6755962774">
    <img src="https://img.shields.io/badge/Download_Now-App_Store-0D96F6?style=for-the-badge&logo=app-store&logoColor=white" alt="Download" />
  </a>
</p>
