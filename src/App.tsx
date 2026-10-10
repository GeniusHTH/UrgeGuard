import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';

// Import our two screen components from their separate files
import HomeScreen from './HomeScreen';
import BreathingScreen from './BreathingScreen';

// This is the root component of the UrgeGuard app.
// It keeps track of which screen the user is currently looking at.
export default function App() {
  // We use useState to remember whether we are on the 'home' screen or 'breathing' screen.
  // The app starts on the 'home' screen by default.
  const [currentScreen, setCurrentScreen] = useState<'home' | 'breathing'>('home');

  // Function called when the user taps the HELP button on the home screen
  const handleOpenBreathing = () => {
    setCurrentScreen('breathing');
  };

  // Function called when the user taps "I'm okay now" on the breathing screen
  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  return (
    // SafeAreaView prevents content from hiding behind the phone's camera notch or home bar
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Conditional rendering: if currentScreen is 'home', show HomeScreen */}
        {currentScreen === 'home' && (
          <HomeScreen onPressPanic={handleOpenBreathing} />
        )}

        {/* If currentScreen is 'breathing', show BreathingScreen */}
        {currentScreen === 'breathing' && (
          <BreathingScreen onFinish={handleBackToHome} />
        )}
      </View>
    </SafeAreaView>
  );
}

// Styles for the root App container
const styles = StyleSheet.create({
  // Fills the safe boundaries of the mobile device with dark background
  safeArea: {
    flex: 1,
    backgroundColor: '#11161d',
  },
  // Container that occupies 100% of the available screen height and width
  container: {
    flex: 1,
    backgroundColor: '#11161d',
    width: '100%',
    height: '100%',
    maxWidth: 500, // Keeps the layout looking neat and phone-sized on wide screens
    alignSelf: 'center',
  },
});
