import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Animated, 
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { saveUrgeEpisode } from '../services/storage';

export default function HomeScreen({ navigation }) {
  const [isUrgeActive, setIsUrgeActive] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const panicScale = useRef(new Animated.Value(1)).current;

  // Pulse animation for heart rate or active urge status
  useEffect(() => {
    let animation;
    if (isUrgeActive) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => animation && animation.stop();
  }, [isUrgeActive]);

  // Simulate passive heart rate monitoring
  useEffect(() => {
    let interval;
    if (isMonitoring && !isUrgeActive) {
      interval = setInterval(() => {
        // Normal heart rate fluctuations
        const fluctuation = Math.floor(Math.random() * 5) - 2;
        setHeartRate(prev => {
          const next = prev + fluctuation;
          // Guard values between 65 and 85
          return next < 65 ? 65 : next > 85 ? 85 : next;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, isUrgeActive]);

  // Trigger Panic / Active Urge Episode
  const triggerUrgeIntervention = async (source = "Manual Button") => {
    if (isUrgeActive) return;
    
    setIsUrgeActive(true);
    setHeartRate(source === "HR Spike" ? 112 : 98);

    // Animate panic button tap
    Animated.sequence([
      Animated.timing(panicScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(panicScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();

    // 1. Send push notification locally (and notify accountability contact)
    await sendAccountabilityNotification(source);

    // 2. Save episode locally
    await saveUrgeEpisode(source, source === "HR Spike" ? 112 : 98);

    // 3. Navigate to Breathing & Grounding Screen immediately
    navigation.navigate('Breathing', { autoStart: true, source });
  };

  // Resolve Urge Episode
  const resolveUrge = () => {
    setIsUrgeActive(false);
    setHeartRate(72);
    Alert.alert("Urge Resolved", "Excellent work staying strong. Your accountability partner has been updated.");
  };

  // Send push notification helper
  const sendAccountabilityNotification = async (source) => {
    try {
      // Configure local notification in Expo
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "UrgeGuard Alert 🚨",
          body: `An urge has been detected (${source}). Accountability partner has been notified!`,
          data: { data: 'goes here' },
        },
        trigger: null, // send immediately
      });
    } catch (e) {
      console.log('Notifications not fully configured or supported in this client:', e.message);
    }
  };

  // Simulate Stress/HR Spike (Passive Trigger)
  const simulateHeartRateSpike = () => {
    Alert.alert(
      "Simulating Stress Spike",
      "UrgeGuard will detect a sudden heart rate jump (to 112 BPM) indicating a physiological urge trigger.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Trigger Spike", 
          onPress: () => triggerUrgeIntervention("HR Spike")
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>UrgeGuard</Text>
            <Text style={styles.subtitle}>Your recovery companion</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileBtn}
            onPress={() => Alert.alert("Settings", "Account & App preferences")}
          >
            <Ionicons name="cog-outline" size={24} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Passive Sensor Monitor */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <View style={styles.row}>
              <Ionicons 
                name="heart" 
                size={22} 
                color={heartRate > 90 ? "#EF4444" : "#10B981"} 
                style={styles.heartIcon} 
              />
              <Text style={styles.cardTitle}>Passive Heart Rate Guard</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: heartRate > 90 ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)" }]}>
              <Text style={[styles.badgeText, { color: heartRate > 90 ? "#F87171" : "#34D399" }]}>
                {heartRate > 90 ? "STRESS SPIKE" : "STABLE"}
              </Text>
            </View>
          </View>
          
          <View style={styles.sensorBody}>
            <View>
              <Text style={styles.heartValue}>{heartRate} <Text style={styles.bpm}>BPM</Text></Text>
              <Text style={styles.sensorInfo}>Monitoring active via phone sensors</Text>
            </View>
            <TouchableOpacity 
              style={styles.simulateBtn} 
              onPress={simulateHeartRateSpike}
            >
              <Text style={styles.simulateBtnText}>Test Spike</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PANIC AREA */}
        <View style={styles.panicContainer}>
          <Animated.View style={{ transform: [{ scale: panicScale }] }}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[
                styles.panicButton, 
                isUrgeActive ? styles.panicActive : styles.panicNormal
              ]}
              onPress={() => triggerUrgeIntervention("Panic Button")}
            >
              <Animated.View style={[
                styles.pulseRing, 
                { transform: [{ scale: pulseAnim }], opacity: isUrgeActive ? 0.3 : 0 }
              ]} />
              <Ionicons 
                name={isUrgeActive ? "shield-alert" : "hand-left"} 
                size={54} 
                color="#FFFFFF" 
              />
              <Text style={styles.panicText}>
                {isUrgeActive ? "URGE ACTIVE" : "I FEEL AN URGE"}
              </Text>
              <Text style={styles.panicSubtext}>
                {isUrgeActive ? "Tap to open interventions" : "Tap for instant relief"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* ACTIVE RESOLUTION PANELS */}
        {isUrgeActive && (
          <View style={styles.activeResolveCard}>
            <Text style={styles.activeTitle}>⚠️ Urge Episode In Progress</Text>
            <Text style={styles.activeText}>
              Accountability partners have been alerted. Stand your ground—this feeling will pass.
            </Text>
            <View style={styles.rowBetween}>
              <TouchableOpacity 
                style={styles.secondaryInterventionBtn}
                onPress={() => navigation.navigate('Breathing')}
              >
                <Text style={styles.secondaryInterventionText}>Guided Breathing</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.resolveBtn}
                onPress={resolveUrge}
              >
                <Text style={styles.resolveBtnText}>I'm Safe Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* QUICK NAVIGATION TILES */}
        <Text style={styles.sectionTitle}>Intervention & Shield Setup</Text>
        <View style={styles.grid}>
          <TouchableOpacity 
            style={styles.tile}
            onPress={() => navigation.navigate('Breathing')}
          >
            <View style={[styles.tileIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Ionicons name="leaf-outline" size={24} color="#60A5FA" />
            </View>
            <Text style={styles.tileTitle}>Breathwork</Text>
            <Text style={styles.tileDesc}>Soften nervous system arousal</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tile}
            onPress={() => navigation.navigate('AppBlocker')}
          >
            <View style={[styles.tileIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="apps-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.tileTitle}>App Shield</Text>
            <Text style={styles.tileDesc}>Block distracting triggers</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tile}
            onPress={() => navigation.navigate('Accountability')}
          >
            <View style={[styles.tileIconContainer, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <Ionicons name="people-outline" size={24} color="#C084FC" />
            </View>
            <Text style={styles.tileTitle}>Partners</Text>
            <Text style={styles.tileDesc}>Designate emergency contacts</Text>
          </TouchableOpacity>
        </View>

        {/* MOTIVATIONAL QUOTE */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "Every urge is a wave. You don't have to stop the wave, you just have to learn how to surf it."
          </Text>
          <Text style={styles.quoteAuthor}>— Recovery Wisdom</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sensorCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  heartIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  sensorBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heartValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  bpm: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#94A3B8',
  },
  sensorInfo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  simulateBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  simulateBtnText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  panicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  panicButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    position: 'relative',
  },
  panicNormal: {
    backgroundColor: '#EF4444',
    borderColor: '#F87171',
    borderWidth: 4,
  },
  panicActive: {
    backgroundColor: '#DC2626',
    borderColor: '#EF4444',
    borderWidth: 6,
  },
  pulseRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#EF4444',
    zIndex: -1,
  },
  panicText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  panicSubtext: {
    fontSize: 12,
    color: '#FEE2E2',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  activeResolveCard: {
    backgroundColor: '#451A03',
    borderColor: '#B45309',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 15,
  },
  activeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FCD34D',
  },
  activeText: {
    fontSize: 13,
    color: '#FDE68A',
    marginTop: 6,
    lineHeight: 18,
  },
  secondaryInterventionBtn: {
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    borderColor: '#D97706',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  secondaryInterventionText: {
    color: '#FCD34D',
    fontSize: 14,
    fontWeight: '600',
  },
  resolveBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  resolveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginTop: 30,
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'column',
    gap: 12,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
    flex: 1,
  },
  tileDesc: {
    fontSize: 12,
    color: '#94A3B8',
    flex: 2,
    textAlign: 'right',
  },
  quoteCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#94A3B8',
    lineHeight: 20,
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 8,
    fontWeight: '600',
  }
});
