import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  Switch, 
  FlatList, 
  Alert, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveBlacklist, loadBlacklist } from '../services/storage';

export default function AppBlockerScreen({ navigation }) {
  const [isShieldEnabled, setIsShieldEnabled] = useState(true);
  const [accessibilityActive, setAccessibilityActive] = useState(false);
  
  // List of triggering apps to shield
  const [blacklist, setBlacklist] = useState([
    { id: '1', name: 'Instagram', packageName: 'com.instagram.android', blocked: true },
    { id: '2', name: 'TikTok', packageName: 'com.zhiliaoapp.musically', blocked: true },
    { id: '3', name: 'X / Twitter', packageName: 'com.twitter.android', blocked: false },
    { id: '4', name: 'Reddit', packageName: 'com.reddit.frontpage', blocked: true },
    { id: '5', name: 'Chrome Browser', packageName: 'com.android.chrome', blocked: false },
  ]);

  const toggleShield = (value) => {
    setIsShieldEnabled(value);
  };

  const toggleAppBlock = (id) => {
    setBlacklist(prev => prev.map(app => 
      app.id === id ? { ...app, blocked: !app.blocked } : app
    ));
  };

  const toggleAccessibilityService = () => {
    if (!accessibilityActive) {
      Alert.alert(
        "Enable Accessibility Service",
        "To enforce App Blocking, UrgeGuard requires the Android Accessibility Service. This is used to detect when blacklisted apps are launched and redirect you to breathing tools.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Enable in Android Settings", onPress: () => setAccessibilityActive(true) }
        ]
      );
    } else {
      setAccessibilityActive(false);
    }
  };

  const renderAppItem = ({ item }) => (
    <View style={styles.appCard}>
      <View style={styles.appDetails}>
        <Ionicons 
          name={item.blocked ? "shield-checkmark" : "shield-outline"} 
          size={20} 
          color={item.blocked ? "#F59E0B" : "#475569"} 
          style={styles.shieldIcon}
        />
        <View>
          <Text style={styles.appName}>{item.name}</Text>
          <Text style={styles.appPackage}>{item.packageName}</Text>
        </View>
      </View>
      <Switch 
        value={item.blocked}
        onValueChange={() => toggleAppBlock(item.id)}
        trackColor={{ false: '#334155', true: '#B45309' }}
        thumbColor={item.blocked ? '#F59E0B' : '#64748B'}
        disabled={!isShieldEnabled}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Shield Setup</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={blacklist}
        keyExtractor={item => item.id}
        renderItem={renderAppItem}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* Explanatory Banner */}
            <View style={styles.banner}>
              <Ionicons name="lock-closed" size={32} color="#F59E0B" style={styles.bannerIcon} />
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Trigger Interception</Text>
                <Text style={styles.bannerDesc}>
                  When you feel an active urge or a heart rate spike is detected, blacklisted apps are locked down so you can focus on breathing exercises instead of scrolling.
                </Text>
              </View>
            </View>

            {/* Master Toggle */}
            <View style={styles.masterRow}>
              <View>
                <Text style={styles.masterTitle}>Enforce App Shield</Text>
                <Text style={styles.masterDesc}>Block listed apps during active episodes</Text>
              </View>
              <Switch 
                value={isShieldEnabled}
                onValueChange={toggleShield}
                trackColor={{ false: '#334155', true: '#10B981' }}
                thumbColor={isShieldEnabled ? '#34D399' : '#64748B'}
              />
            </View>

            {/* Accessibility Settings Integration */}
            <View style={styles.accessibilityCard}>
              <View style={styles.row}>
                <Ionicons 
                  name="construct-outline" 
                  size={20} 
                  color={accessibilityActive ? "#10B981" : "#F59E0B"} 
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.accessibilityTitle}>Android Accessibility Service</Text>
              </View>
              
              <Text style={styles.accessibilityDesc}>
                Enables Kotlin backend hook to scan app-switching activities and block forbidden activities.
              </Text>

              <View style={styles.rowBetween}>
                <Text style={styles.serviceStatus}>
                  Status: <Text style={{ color: accessibilityActive ? '#10B981' : '#F59E0B', fontWeight: 'bold' }}>
                    {accessibilityActive ? 'ACTIVE / RUNNING' : 'STOPPED'}
                  </Text>
                </Text>
                <TouchableOpacity 
                  style={[styles.accBtn, { backgroundColor: accessibilityActive ? '#EF4444' : '#3B82F6' }]}
                  onPress={toggleAccessibilityService}
                >
                  <Text style={styles.accBtnText}>{accessibilityActive ? "Deactivate" : "Configure Service"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Blocked Apps Blacklist</Text>
          </>
        }
        ListFooterComponent={
          <View style={styles.footerNote}>
            <Ionicons name="information-circle-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.footerNoteText}>
              System-level apps and Emergency Dialers are always whitelisted and cannot be blocked.
            </Text>
          </View>
        }
      />
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
  scrollContent: {
    padding: 20,
  },
  banner: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B45309',
    padding: 16,
    flexDirection: 'row',
    marginBottom: 20,
  },
  bannerIcon: {
    marginRight: 14,
    alignSelf: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  masterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  masterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E2E8F0',
  },
  masterDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  accessibilityCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 25,
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
  accessibilityTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#E2E8F0',
  },
  accessibilityDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  serviceStatus: {
    fontSize: 12,
    color: '#94A3B8',
  },
  accBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  accBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  appCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  appDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldIcon: {
    marginRight: 12,
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  appPackage: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  footerNoteText: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    flex: 1,
  }
});
