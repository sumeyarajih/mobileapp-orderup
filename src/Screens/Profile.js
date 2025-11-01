import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  PermissionsAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import BottomNavbar from '../Components/ButtomNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');
const NAVBAR_HEIGHT = 80;
const API_BASE_URL = 'http://192.168.1.2:3000';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const menuItems = [
    { icon: 'shopping-bag', label: 'My Orders', count: stats?.orders || 0 },
    { icon: 'map-pin', label: 'Addresses', count: stats?.addresses || 0 },
    { icon: 'credit-card', label: 'Payment Methods' },
    { icon: 'bell', label: 'Notifications' },
    { icon: 'settings', label: 'Settings' },
    { icon: 'help-circle', label: 'Help & Support' },
  ];

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      const userDataString = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('userToken');
      
      console.log('🔍 Profile Check - Stored user data:', userDataString ? 'Yes' : 'No');
      console.log('🔍 Profile Check - Stored token:', token ? 'Yes' : 'No');
      
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('🔍 All AsyncStorage keys:', allKeys);
      
      if (!userDataString) {
        console.log('❌ No user data found in Profile');
        
        for (let key of allKeys) {
          if (key.includes('user') || key.includes('User')) {
            const value = await AsyncStorage.getItem(key);
            console.log(`🔍 Found alternative key ${key}:`, value);
          }
        }
        
        navigation.replace('Auth');
        return;
      }

      const userData = JSON.parse(userDataString);
      console.log('✅ User data found:', userData);
      
      setUser(userData);

      if (token) {
        try {
          console.log('🔄 Fetching fresh profile data from API...');
          const [profileResponse, statsResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/profile`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }),
            fetch(`${API_BASE_URL}/api/profile/stats`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })
          ]);

          console.log('📊 Profile API status:', profileResponse.status);
          console.log('📊 Stats API status:', statsResponse.status);

          if (profileResponse.ok && statsResponse.ok) {
            const profileData = await profileResponse.json();
            const statsData = await statsResponse.json();
            
            console.log('✅ API Profile data received:', profileData);
            console.log('✅ API Stats data received:', statsData);
            
            setUser(profileData.user || userData);
            setStats(statsData.stats);
            
            // Update AsyncStorage with fresh data
            if (profileData.user) {
              await AsyncStorage.setItem('userData', JSON.stringify(profileData.user));
            }
          } else {
            console.log('⚠️ API response not OK, using stored data');
            if (profileResponse.status === 401 || statsResponse.status === 401) {
              console.log('🔐 Token expired, clearing storage');
              await AsyncStorage.multiRemove(['userToken', 'userData']);
              navigation.replace('Auth');
              return;
            }
          }
        } catch (apiError) {
          console.error('🌐 API fetch error, using stored data:', apiError.message);
        }
      } else {
        console.log('ℹ️ No token found, using stored user data only');
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error.message);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera permission to take photos.',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs storage permission to access photos.',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePicker = (type) => {
    setImageModalVisible(false);
    
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      includeBase64: false,
    };

    const handleImageSelection = async () => {
      try {
        let result;
        
        if (type === 'camera') {
          const hasCameraPermission = await requestCameraPermission();
          if (!hasCameraPermission) {
            Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
            return;
          }
          result = await launchCamera(options);
        } else {
          const hasStoragePermission = await requestStoragePermission();
          if (!hasStoragePermission) {
            Alert.alert('Permission Denied', 'Storage permission is required to access photos.');
            return;
          }
          result = await launchImageLibrary(options);
        }

        if (result.didCancel) {
          console.log('User cancelled image picker');
        } else if (result.errorCode) {
          console.log('ImagePicker Error: ', result.errorMessage);
          Alert.alert('Error', 'Failed to pick image: ' + result.errorMessage);
        } else if (result.assets && result.assets.length > 0) {
          const selectedImage = result.assets[0];
          await uploadProfileImage(selectedImage);
        }
      } catch (error) {
        console.error('Error in image selection:', error);
        Alert.alert('Error', 'Failed to process image selection');
      }
    };

    handleImageSelection();
  };


const uploadProfileImage = async (image) => {
  try {
    setUploading(true);
    
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Error', 'Please login again');
      navigation.replace('Auth');
      return;
    }

    console.log('📤 Starting upload...', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
      size: image.fileSize
    });

    // Create form data
    const formData = new FormData();
    formData.append('profileImage', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || `profile_${Date.now()}.jpg`,
    });

    console.log('📤 Sending request to server...');
    
    const response = await fetch(`${API_BASE_URL}/api/profile/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    console.log('📊 Upload response status:', response.status);
    console.log('📊 Upload response headers:', response.headers);

    const responseText = await response.text();
    console.log('📊 Upload response text:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON:', parseError);
      throw new Error('Invalid response from server');
    }

    if (response.ok) {
      console.log('✅ Image upload successful:', result);
      
      // Update user state with new image
      const updatedUser = {
        ...user,
        profileImage: result.profileImage || result.user?.profileImage
      };
      
      setUser(updatedUser);
      
      // Update AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      Alert.alert('Success', 'Profile image updated successfully!');
    } else {
      console.error('❌ Upload failed with status:', response.status);
      console.error('❌ Upload error response:', result);
      
      if (response.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        await AsyncStorage.multiRemove(['userToken', 'userData']);
        navigation.replace('Auth');
      } else if (response.status === 400) {
        Alert.alert('Upload Failed', result.error || 'Invalid image file');
      } else {
        Alert.alert(
          'Upload Failed', 
          result.error || 'Failed to upload profile image. Please try again.'
        );
      }
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    console.error('❌ Upload error stack:', error.stack);
    Alert.alert(
      'Error', 
      `Failed to upload image: ${error.message}. Please check your connection and try again.`
    );
  } finally {
    setUploading(false);
  }
};





  const handleRefresh = () => {
    setRefreshing(true);
    loadProfileData();
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality would go here');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['userToken', 'userData', 'user']);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };

  const handleMenuItemPress = (label) => {
    const implementedScreens = ['My Orders', 'Addresses'];
    
    if (implementedScreens.includes(label)) {
      switch (label) {
        case 'My Orders':
          navigation.navigate('Orders');
          break;
        case 'Addresses':
          navigation.navigate('Addresses');
          break;
        default:
          break;
      }
    } else {
      Alert.alert(
        'Coming Soon', 
        `${label} functionality will be available soon!`,
        [{ text: 'OK' }]
      );
    }
  };

  const MenuItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={() => handleMenuItemPress(item.label)}
    >
      <View style={styles.menuLeft}>
        <Icon name={item.icon} size={24} color="#4caf50" />
        <Text style={styles.menuLabel}>{item.label}</Text>
      </View>
      <View style={styles.menuRight}>
        {item.count > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{item.count}</Text>
          </View>
        )}
        <Icon name="chevron-right" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  // Image Picker Modal
  const ImagePickerModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={imageModalVisible}
      onRequestClose={() => setImageModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Profile Photo</Text>
            <TouchableOpacity 
              onPress={() => setImageModalVisible(false)}
              style={styles.closeButton}
            >
              <Icon name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalOptions}>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleImagePicker('camera')}
            >
              <View style={styles.optionIconContainer}>
                <Icon name="camera" size={28} color="#4caf50" />
              </View>
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleImagePicker('gallery')}
            >
              <View style={styles.optionIconContainer}>
                <Icon name="image" size={28} color="#4caf50" />
              </View>
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4caf50" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="user-x" size={64} color="#ff6b6b" />
          <Text style={styles.errorText}>Unable to load profile</Text>
          <Text style={styles.errorSubtext}>
            Please make sure you're logged in and try again.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadProfileData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.replace('Auth')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Icon name="edit-3" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4caf50']}
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity 
              style={styles.avatar}
              onPress={() => setImageModalVisible(true)}
              disabled={uploading}
            >
              {uploading ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="small" color="white" />
                </View>
              ) : user?.profileImage ? (
                <Image 
                   source={{ 
      uri: user.profileImage.startsWith('http') 
        ? user.profileImage 
        : `${API_BASE_URL}${user.profileImage}`
    }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : '👤'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.cameraButton, uploading && styles.cameraButtonDisabled]}
              onPress={() => setImageModalVisible(true)}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Icon name="camera" size={16} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.fullName || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'No email provided'}</Text>
          <Text style={styles.phone}>{user?.phoneNumber || 'No phone number'}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.orders || 0}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.reviews || 0}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.years || 1}</Text>
            <Text style={styles.statLabel}>Years</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon name="log-out" size={24} color="#ff4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Add bottom padding to prevent cutoff */}
        <View style={{ height: NAVBAR_HEIGHT + 40 }} />
      </ScrollView>

      {/* Image Picker Modal */}
      <ImagePickerModal />

      {/* Fixed Bottom Navbar */}
      <View style={styles.bottomNavbarWrapper}>
        <SafeAreaView style={styles.bottomNavbarSafe}>
          <BottomNavbar navigation={navigation} currentRoute="Profile" />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4caf50',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#e8f5e8',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
    color: 'white',
  },
  uploadingContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  cameraButtonDisabled: {
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  phone: {
    fontSize: 14,
    color: '#888',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  menuSection: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 10,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomNavbarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bottomNavbarSafe: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalOptions: {
    padding: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIconContainer: {
    width: 50,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
});

export default Profile;