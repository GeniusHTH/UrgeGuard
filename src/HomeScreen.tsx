import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';

// This is the Home Screen component.
// It receives a function called "onPressPanic" from App.tsx, which gets called when the user taps the panic button.
interface HomeScreenProps {
  onPressPanic: () => void;
}

export default function HomeScreen({ onPressPanic }: HomeScreenProps) {
  return (
    // The main container fills the entire screen with a calm dark background
    <View style={styles.container}>
      {/* Light status bar icons (battery, clock, wifi) so they are readable on our dark screen */}
      <StatusBar barStyle="light-content" />

      {/* Gentle app title at the top to reassure the user without clutter */}
      <Text style={styles.appName}>UrgeGuard</Text>

      {/* A short, calming subtitle */}
      <Text style={styles.subTitle}>You are safe. Take a moment.</Text>

      {/* The big panic button placed in the center of the screen */}
      <TouchableOpacity
        style={styles.panicButton}
        onPress={onPressPanic}
        activeOpacity={0.8}
        accessibilityLabel="Emergency breathing button"
      >
        <Text style={styles.panicButtonText}>HELP</Text>
      </TouchableOpacity>

      {/* Reassuring note at the bottom */}
      <Text style={styles.helperText}>Tap the button to breathe through this urge</Text>
    </View>
  );
}

// All styles are defined cleanly below using StyleSheet.create
const styles = StyleSheet.create({
  // Fills the whole screen with a deep slate/dark blue background
  container: {
    flex: 1,
    backgroundColor: '#11161d',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  // Clean, soft title text at the top
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e2e8f0',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  // Calming subtitle text
  subTitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 48,
    textAlign: 'center',
  },
  // The large circular panic button
  panicButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    // Soft shadow for depth
    elevation: 8,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  // Large, easy-to-read text inside the button
  panicButtonText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 2,
  },
  // Subtle guidance text under the button
  helperText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 48,
    textAlign: 'center',
  },
});
