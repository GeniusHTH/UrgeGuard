import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, StatusBar } from 'react-native';

// This is the Breathing Screen component.
// It receives a function called "onFinish" from App.tsx, which gets called when the user taps "I'm okay now".
interface BreathingScreenProps {
  onFinish: () => void;
}

// Box breathing has four steps. Each step lasts 4 seconds (4000 milliseconds).
const PHASE_DURATION_MS = 4000;

// The text to display for each of the 4 steps in box breathing
const PHASES = [
  'Breathe in',  // Step 0: Lungs fill up, circle expands
  'Hold',        // Step 1: Lungs stay full, circle stays big
  'Breathe out', // Step 2: Lungs empty out, circle shrinks
  'Hold',        // Step 3: Lungs stay empty, circle stays small
];

export default function BreathingScreen({ onFinish }: BreathingScreenProps) {
  // Store which step we are currently in (0, 1, 2, or 3)
  const [phaseIndex, setPhaseIndex] = useState(0);

  // Store a countdown number (4, 3, 2, 1) to help the user count the seconds
  const [secondsLeft, setSecondsLeft] = useState(4);

  // Animated value that controls the circle size. Starts at 1.0 (normal size).
  const circleScale = useRef(new Animated.Value(1.0)).current;

  // This effect runs the 4-second box breathing animation cycle
  useEffect(() => {
    // Keep reference to any active animation so we can stop it cleanly
    let anim: Animated.CompositeAnimation | null = null;

    // 1. If we are breathing in, smoothly grow the circle to 1.5x size over 4 seconds
    if (phaseIndex === 0) {
      anim = Animated.timing(circleScale, {
        toValue: 1.5,
        duration: PHASE_DURATION_MS,
        useNativeDriver: false,
      });
      anim.start();
    }

    // 2. If we are breathing out, smoothly shrink the circle back to 1.0x size over 4 seconds
    if (phaseIndex === 2) {
      anim = Animated.timing(circleScale, {
        toValue: 1.0,
        duration: PHASE_DURATION_MS,
        useNativeDriver: false,
      });
      anim.start();
    }

    // Reset the seconds counter to 4 at the start of every phase
    setSecondsLeft(4);

    // Set up a 1-second interval to count down 4, 3, 2, 1
    const countdownTimer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    // Set up a 4-second timer to move to the next breathing phase
    const phaseTimer = setTimeout(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, PHASE_DURATION_MS);

    // Clean up both timers and stop active animation when the phase changes or if the user leaves the screen
    return () => {
      clearInterval(countdownTimer);
      clearTimeout(phaseTimer);
      if (anim) {
        anim.stop();
      }
    };
  }, [phaseIndex, circleScale]);

  return (
    // Main dark container filling the screen
    <View style={styles.container}>
      {/* Light status bar icons for dark background */}
      <StatusBar barStyle="light-content" />

      {/* Top section showing the current step instruction */}
      <View style={styles.headerArea}>
        <Text style={styles.instructionText}>{PHASES[phaseIndex]}</Text>
        <Text style={styles.countdownText}>{secondsLeft}</Text>
      </View>

      {/* Middle section holding the expanding and shrinking breathing circle */}
      <View style={styles.circleContainer}>
        {/* Faint outer guide ring showing the maximum size of the circle */}
        <View style={styles.outerGuideRing} />

        {/* The animated circle that grows and shrinks smoothly with your breath */}
        <Animated.View
          style={[
            styles.breathingCircle,
            {
              transform: [{ scale: circleScale }],
            },
          ]}
        />
      </View>

      {/* Bottom section with the large exit button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={onFinish}
          activeOpacity={0.8}
          accessibilityLabel="I am feeling okay now, return home"
        >
          <Text style={styles.doneButtonText}>I'm okay now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// All styles for the Breathing Screen
const styles = StyleSheet.create({
  // Fills the entire screen with calm dark slate
  container: {
    flex: 1,
    backgroundColor: '#11161d',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  // Area holding instruction text and countdown
  headerArea: {
    alignItems: 'center',
    marginTop: 20,
  },
  // Large, soothing instruction text ("Breathe in", "Hold", etc.)
  instructionText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#38bdf8', // Gentle sky blue
    letterSpacing: 1,
    marginBottom: 8,
  },
  // Number showing remaining seconds in this breath phase
  countdownText: {
    fontSize: 22,
    color: '#94a3b8',
    fontWeight: '500',
  },
  // Center area for the circle
  circleContainer: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Faint guide ring so the user sees the target breath size
  outerGuideRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    borderStyle: 'dashed',
  },
  // The breathing circle that scales up and down
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#0284c7', // Calm ocean blue
    opacity: 0.85,
    // Soft glowing shadow around the circle
    elevation: 10,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  // Container for the bottom button
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  // Large, easy-to-tap button for when the user feels grounded
  doneButton: {
    width: '100%',
    maxWidth: 320,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e293b',
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Clear text on the done button
  doneButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
  },
});
