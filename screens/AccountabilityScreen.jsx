import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { savePartner, loadPartner } from '../services/storage';

export default function AccountabilityScreen({ navigation }) {
  const [partnerName, setPartnerName] = useState('Sarah Jenkins');
  const [partnerPhone, setPartnerPhone] = useState('+1 (555) 349-2091');
  const [customMessage, setCustomMessage] = useState(
    "Hi Sarah, I'm feeling a strong urge right now and just triggered my UrgeGuard SOS. Please check in on me or give me a call when you can."
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadPartnerData = async () => {
      const data = await loadPartner();
      if (data) {
        setPartnerName(data.name || '');
        setPartnerPhone(data.phone || '');
        setCustomMessage(data.message || '');
      }
    };
    loadPartnerData();
  }, []);

  const savePartnerDetails = async () => {
    if (!partnerName.trim() || !partnerPhone.trim()) {
      Alert.alert("Error", "Please fill in both the contact name and phone number.");
      return;
    }

    setIsSaving(true);
    try {
      await savePartner(partnerName, partnerPhone, customMessage);
      Alert.alert('Saved', 'Accountability partner details saved.');
    } catch (error) {
      Alert.alert('Error', 'Could not save details.');
    } finally {
      setIsSaving(false);
    }
  };

  const testTriggerMessage = () => {
    Alert.alert(
      "Send Test SMS Alert",
      `This will simulate sending your SOS message to ${partnerName} via SMS gateway or push relay.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send Test", 
          onPress: () => Alert.alert("SMS Outgoing", `Test message sent successfully to ${partnerPhone}`) 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accountability Contact</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.banner}>
          <Ionicons name="people" size={32} color="#A855F7" style={styles.bannerIcon} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Accountability Partner</Text>
            <Text style={styles.bannerDesc}>
              A designated supportive partner who will receive immediate push notifications and SMS triggers when you activate the Panic Button or experience a physiological stress peak.
            </Text>
          </View>
        </View>

        {/* Input Form */}
        <Text style={styles.sectionLabel}>PARTNER DETAILS</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={20} color="#64748B" style={styles.fieldIcon} />
            <TextInput
              style={styles.input}
              value={partnerName}
              onChangeText={setPartnerName}
              placeholder="e.g. Sarah Jenkins"
              placeholderTextColor="#475569"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Phone Number / Contact URI</Text>
          <View style={styles.inputRow}>
            <Ionicons name="call-outline" size={20} color="#64748B" style={styles.fieldIcon} />
            <TextInput
              style={styles.input}
              value={partnerPhone}
              onChangeText={setPartnerPhone}
              placeholder="e.g. +1 (555) 349-2091"
              placeholderTextColor="#475569"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>AUTOMATED SOS SMS MESSAGE</Text>
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={customMessage}
            onChangeText={setCustomMessage}
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
            placeholder="Type your automated SOS alert message..."
            placeholderTextColor="#475569"
          />
        </View>
        <Text style={styles.fieldDesc}>
          This exact message will be dispatched during any Panic trigger, along with a secure map coordinate showing your current distress status.
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.saveBtn} 
          onPress={savePartnerDetails}
          disabled={isSaving}
        >
          <Text style={styles.saveBtnText}>
            {isSaving ? "Saving..." : "Save Partner Config"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testBtn} 
          onPress={testTriggerMessage}
        >
          <Ionicons name="paper-plane-outline" size={18} color="#A855F7" style={{ marginRight: 8 }} />
          <Text style={styles.testBtnText}>Dispatch Test Alert Message</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A855F7',
    padding: 16,
    flexDirection: 'row',
    marginBottom: 25,
  },
  bannerIcon: {
    marginRight: 14,
    alignSelf: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: '#C084FC',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 6,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
  },
  fieldIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    height: 44,
  },
  messageInputContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    marginBottom: 8,
  },
  messageInput: {
    color: '#F8FAFC',
    fontSize: 14,
    minHeight: 100,
    lineHeight: 20,
  },
  fieldDesc: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 25,
  },
  saveBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: '#A855F7',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
  },
  testBtnText: {
    color: '#C084FC',
    fontSize: 14,
    fontWeight: 'bold',
  }
});
