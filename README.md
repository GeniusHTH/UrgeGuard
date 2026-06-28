# UrgeGuard — Setup Guide

## Running in GitHub Codespaces

1. Open this repo in Codespaces
2. In the terminal run:
   ```
   npm install
   npx expo start --tunnel
   ```
3. Scan the QR code with Expo Go on your Android phone

## Project Structure

```
UrgeGuard/
├── App.js                        # Navigation & notification setup
├── package.json                  # Dependencies
├── screens/
│   ├── HomeScreen.jsx            # Main screen with panic button
│   ├── BreathingScreen.jsx       # Box breathing + 5-4-3-2-1 grounding
│   ├── AppBlockerScreen.jsx      # App blacklist management
│   └── AccountabilityScreen.jsx  # Emergency contact setup
├── services/
│   └── storage.js                # Local AsyncStorage (no Firebase needed)
└── android/
    └── app/src/main/
        ├── java/com/urgeguard/
        │   └── AppBlockerService.kt        # Kotlin accessibility service
        └── res/xml/
            └── accessibility_service_config.xml
```

## Notes

- No Firebase required — all data is saved locally with AsyncStorage
- Heart rate monitoring is simulated (Expo cannot access real HR sensors)
- The Kotlin AppBlockerService only works in a full Android build, not Expo Go
- To enable app blocking in production, register the service in AndroidManifest.xml
