# UrgeGuard

A biometric-aware addiction recovery app for Android built with React Native + Expo.

## Features
- Manual panic button with instant intervention trigger
- Passive heart rate monitoring with stress spike detection
- Box breathing & 5-4-3-2-1 grounding exercises
- Accountability partner notifications
- App blocker via Android Accessibility Services

## Tech Stack
- React Native + Expo
- AsyncStorage for local persistence
- Expo Notifications
- Kotlin (Android Accessibility Service for app blocking)

## Getting Started
```bash
npm install
npx expo start
```

## Project Structure
```
screens/     # App screens
services/    # Local storage layer
android/     # Native Kotlin module for app blocking
```
