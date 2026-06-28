import AsyncStorage from '@react-native-async-storage/async-storage';

// Save an urge episode locally
export const saveUrgeEpisode = async (source, heartRate) => {
  try {
    const episode = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      source,
      resolved: false,
      initialHeartRate: heartRate,
    };
    const existing = await getUrgeEpisodes();
    existing.push(episode);
    await AsyncStorage.setItem('urge_episodes', JSON.stringify(existing));
    return episode;
  } catch (e) {
    console.log('Failed to save episode:', e.message);
  }
};

// Get all urge episodes
export const getUrgeEpisodes = async () => {
  try {
    const data = await AsyncStorage.getItem('urge_episodes');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// Save accountability partner details
export const savePartner = async (name, phone, message) => {
  try {
    await AsyncStorage.setItem('accountability_partner', JSON.stringify({ name, phone, message }));
  } catch (e) {
    console.log('Failed to save partner:', e.message);
  }
};

// Load accountability partner details
export const loadPartner = async () => {
  try {
    const data = await AsyncStorage.getItem('accountability_partner');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

// Save app blacklist
export const saveBlacklist = async (blacklist) => {
  try {
    await AsyncStorage.setItem('app_blacklist', JSON.stringify(blacklist));
  } catch (e) {
    console.log('Failed to save blacklist:', e.message);
  }
};

// Load app blacklist
export const loadBlacklist = async () => {
  try {
    const data = await AsyncStorage.getItem('app_blacklist');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};
