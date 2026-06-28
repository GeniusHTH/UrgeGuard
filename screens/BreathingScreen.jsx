import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated, 
  Easing, 
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BREATH_PHASES = [
  { text: 'Inhale', duration: 4000, targetScale: 2 },
  { text: 'Hold', duration: 4000, targetScale: 2 },
  { text: 'Exhale', duration: 4000, targetScale: 1 },
  { text: 'Hold', duration: 4000, targetScale: 1 }
];

export default function BreathingScreen({ route, navigation }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [activeTab, setActiveTab] = useState('breathing'); // 'breathing' | 'grounding'

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;
  const phaseTimerRef = useRef(null);
  const secondTimerRef = useRef(null);

  // 5-4-3-2-1 Grounding steps
  const groundingSteps = [
    { title: "5 Things you can SEE", desc: "Look around you. Name 5 objects in your immediate sight (e.g. table, ceiling fan, blue pen, chair, clock)." },
    { title: "4 Things you can TOUCH", desc: "Feel the tactile surface of 4 objects nearby (e.g. the fabric of your jeans, key ring, cold desk surface, rough wall)." },
    { title: "3 Things you can HEAR", desc: "Listen carefully to the surrounding environment. Detect 3 sounds (e.g. distant traffic, hum of air conditioning, birds chirping)." },
    { title: "2 Things you can SMELL", desc: "Breathe deep. Try to identify 2 scents or aromas (e.g. laundry detergent on your shirt, coffee, fresh rain)." },
    { title: "1 Thing you can TASTE", desc: "Focus on your mouth. Name 1 taste you can distinguish (e.g. mint toothpaste, tea, or just a deep clean swallow)." }
  ];
  const [groundingProgress, setGroundingProgress] = useState(0);

  // Handle Box Breathing loops
  useEffect(() => {
    if (activeTab !== 'breathing') return;

    // Start timer for countdown (runs every second)
    setCountdown(4);
    secondTimerRef.current = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 4));
    }, 1000);

    // Function to run a single phase
    const runPhase = (index) => {
      const phase = BREATH_PHASES[index];
      
      // Animate scale to target
      Animated.timing(scaleAnim, {
        toValue: phase.targetScale,
        duration: phase.duration,
        easing: Easing.linear,
        useNativeDriver: true
      }).start();

      // Animate opacity pulse
      Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 1, duration: phase.duration / 2, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.7, duration: phase.duration / 2, useNativeDriver: true })
      ]).start();

      // Set timeout for next phase transition
      phaseTimerRef.current = setTimeout(() => {
        setPhaseIndex(prev => {
          const next = (prev + 1) % 4;
          if (next === 0) setBreathCount(c => c + 1);
          runPhase(next);
          return next;
        });
      }, phase.duration);
    };

    runPhase(phaseIndex);

    return () => {
      clearTimeout(phaseTimerRef.current);
      clearInterval(secondTimerRef.current);
    };
  }, [activeTab]);

  const toggleTab = (tab) => {
    // Reset timers when switching
    clearTimeout(phaseTimerRef.current);
    clearInterval(secondTimerRef.current);
    setActiveTab(tab);
    setPhaseIndex(0);
    setCountdown(4);
  };

  const handleGroundingNext = () => {
    if (groundingProgress < groundingSteps.length - 1) {
      setGroundingProgress(prev => prev + 1);
    } else {
      Alert.alert(
        "Grounding Complete",
        "Sensory awareness fully re-centered. How do you feel now?",
        [
          { text: "Finish", onPress: () => navigation.goBack() },
          { text: "Reset Guide", onPress: () => setGroundingProgress(0) }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Urge Guard Interventions</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'breathing' && styles.activeTab]}
          onPress={() => toggleTab('breathing')}
        >
          <Ionicons name="leaf" size={18} color={activeTab === 'breathing' ? '#3B82F6' : '#94A3B8'} style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'breathing' && styles.activeTabText]}>Box Breathing</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'grounding' && styles.activeTab]}
          onPress={() => toggleTab('grounding')}
        >
          <Ionicons name="compass" size={18} color={activeTab === 'grounding' ? '#3B82F6' : '#94A3B8'} style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'grounding' && styles.activeTabText]}>5-4-3-2-1 Grounding</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {activeTab === 'breathing' ? (
        <View style={styles.breathingContent}>
          <Text style={styles.instructions}>
            Box breathing triggers the parasympathetic nervous system to decrease stress hormone response.
          </Text>

          {/* Core Animated Breathing Circle */}
          <View style={styles.breathingCircleContainer}>
            {/* Pulsing ring */}
            <Animated.View style={[
              styles.breathPulseOuter,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim
              }
            ]} />
            <View style={styles.breathCircleInner}>
              <Text style={styles.countdownText}>{countdown}</Text>
              <Text style={styles.phaseName}>{BREATH_PHASES[phaseIndex].text.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statText}>Cycles Completed: <Text style={styles.statHighlight}>{breathCount}</Text></Text>
          </View>

          <View style={styles.breathingInstructionsList}>
            {BREATH_PHASES.map((p, i) => (
              <View 
                key={i} 
                style={[
                  styles.phaseCard, 
                  phaseIndex === i ? styles.phaseCardActive : styles.phaseCardInactive
                ]}
              >
                <Text style={[styles.phaseNum, phaseIndex === i ? styles.textActive : styles.textInactive]}>{i + 1}</Text>
                <Text style={[styles.phaseTitle, phaseIndex === i ? styles.textActive : styles.textInactive]}>{p.text}</Text>
                <Text style={styles.phaseDuration}>{p.duration / 1000}s</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.safeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.safeBtnText}>I Feel Re-Centered</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.groundingContent}>
          <Text style={styles.instructions}>
            Focus entirely on your physical senses. Reconnect to the physical world and quiet the internal mental storm.
          </Text>

          {/* Current Grounding Step */}
          <View style={styles.groundingCard}>
            <View style={styles.stepIndicatorRow}>
              <Text style={styles.stepIndicatorText}>Step {groundingProgress + 1} of 5</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${((groundingProgress + 1) / 5) * 100}%` }]} />
              </View>
            </View>

            <Text style={styles.groundingStepTitle}>{groundingSteps[groundingProgress].title}</Text>
            <Text style={styles.groundingStepDesc}>{groundingSteps[groundingProgress].desc}</Text>

            <TouchableOpacity 
              style={styles.groundingActionBtn}
              onPress={handleGroundingNext}
            >
              <Text style={styles.groundingActionText}>
                {groundingProgress === groundingSteps.length - 1 ? "Complete Exercise" : "I've Noticed These"}
              </Text>
              <Ionicons 
                name={groundingProgress === groundingSteps.length - 1 ? "checkmark-circle" : "arrow-forward"} 
                size={18} 
                color="#FFFFFF" 
                style={{ marginLeft: 8 }} 
              />
            </TouchableOpacity>
          </View>

          {/* Quick-Access Tips */}
          <Text style={styles.tipsHeader}>Tips for de-escalating an urge:</Text>
          <View style={styles.tipRow}>
            <Ionicons name="water-outline" size={20} color="#60A5FA" style={styles.tipIcon} />
            <Text style={styles.tipText}>Splash cold water on your face to trigger the mammalian dive reflex.</Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="walk-outline" size={20} color="#F59E0B" style={styles.tipIcon} />
            <Text style={styles.tipText}>Change your physical location. Walk out of the trigger room.</Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="timer-outline" size={20} color="#10B981" style={styles.tipIcon} />
            <Text style={styles.tipText}>Delay for 10 minutes. The peak of an urge typically lasts less than 15 mins.</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  instructions: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  breathingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
    paddingTop: 10,
  },
  breathingCircleContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 15,
  },
  breathPulseOuter: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderWidth: 2,
    borderColor: '#60A5FA',
  },
  breathCircleInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  countdownText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  phaseName: {
    fontSize: 12,
    color: '#60A5FA',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  statsRow: {
    marginBottom: 10,
  },
  statText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  statHighlight: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  breathingInstructionsList: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  phaseCard: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  phaseCardActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
  },
  phaseCardInactive: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  phaseNum: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  phaseTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  phaseDuration: {
    fontSize: 10,
    color: '#64748B',
  },
  textActive: {
    color: '#F8FAFC',
  },
  textInactive: {
    color: '#94A3B8',
  },
  safeBtn: {
    backgroundColor: '#10B981',
    width: '90%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  safeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  groundingContent: {
    padding: 20,
  },
  groundingCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepIndicatorText: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    width: 120,
    backgroundColor: '#0F172A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  groundingStepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  groundingStepDesc: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
    marginBottom: 25,
  },
  groundingActionBtn: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  groundingActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  tipsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E2E8F0',
    marginTop: 10,
    marginBottom: 15,
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  }
});
