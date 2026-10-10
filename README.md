# UrgeGuard (prototype)

A panic button for people recovering from addiction. When an urge hits, it walks you through a calming breathing exercise.

I went through an addiction phase myself and know how hard it is to stop. I built UrgeGuard to help me stay on track, and to make that kind of help easy to reach for anyone who needs it.

> **This is an early web prototype.** The goal is a real Android app. For now I'm building and testing the core flow in the browser, one piece at a time, so I understand every part of it.

## What works today
- Home screen with a panic (HELP) button
- Box breathing exercise (in 4s, hold 4s, out 4s, hold 4s) with an animated circle and countdown
- "I'm okay now" button to return home

## Planned
- 5-4-3-2-1 grounding exercise
- Urge log with a streak counter
- Accountability partner alerts
- "Get urgent help" button with crisis helplines
- Heart rate based stress detection
- App blocking through Android Accessibility Services
- Move to a real Android app (React Native with Expo)

## How it was made
The idea, features and direction are mine. It's an early prototype that I'm building piece by piece and learning as I go.

## Tech
React and TypeScript, using React Native components through `react-native-web`, built with Vite.

## Run it locally
```bash
npm install
npm run dev
```
Then open http://localhost:3000.
