// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   SafeAreaView,
//   StatusBar,
//   Image,
//   ActivityIndicator
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width, height } = Dimensions.get('window');
// const API_BASE_URL = 'http://192.168.1.2:3000';

// const TopNavbar = ({ 
//   title = "OrderUp", 
//   onNotificationPress, 
//   onProfilePress, 
//   showNotification = true, 
//   showProfile = true,
//   refreshTrigger = 0 // Add this prop to trigger refreshes
// }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [imageError, setImageError] = useState(false);

//   useEffect(() => {
//     loadUserData();
//   }, [refreshTrigger]); // Refresh when refreshTrigger changes

//   // Add this to listen for storage changes
//   useEffect(() => {
//     const interval = setInterval(() => {
//       loadUserData();
//     }, 5000); // Check every 5 seconds for updates

//     return () => clearInterval(interval);
//   }, []);

//   const loadUserData = async () => {
//     try {
//       setLoading(true);
//       setImageError(false);
      
//       const userDataString = await AsyncStorage.getItem('userData');
//       console.log('🔄 TopNavbar - Loading user data:', userDataString ? 'Data found' : 'No data');
      
//       if (userDataString) {
//         const userData = JSON.parse(userDataString);
//         console.log('👤 TopNavbar - User data loaded:', {
//           name: userData.fullName,
//           hasProfileImage: !!userData.profileImage,
//           profileImage: userData.profileImage
//         });
//         setUser(userData);
//       } else {
//         console.log('❌ TopNavbar - No user data found in storage');
//         setUser(null);
//       }
//     } catch (error) {
//       console.error('❌ TopNavbar - Error loading user data:', error);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNotificationPress = () => {
//     if (onNotificationPress) {
//       onNotificationPress();
//     } else {
//       console.log('Notification pressed');
//     }
//   };

//   const handleProfilePress = () => {
//     if (onProfilePress) {
//       onProfilePress();
//     } else {
//       console.log('Profile pressed');
//     }
//   };

//   const getProfileImageSource = () => {
//     if (!user?.profileImage) {
//       console.log('🖼️ TopNavbar - No profile image, using fallback');
//       return require('../assets/Images/order-logo.png');
//     }
    
//     console.log('🖼️ TopNavbar - Profile image URL:', user.profileImage);
    
//     // Handle different URL formats
//     if (user.profileImage.startsWith('http')) {
//       return { uri: user.profileImage };
//     } else if (user.profileImage.startsWith('file://')) {
//       return { uri: user.profileImage };
//     } else {
//       // Handle relative paths
//       const fullUrl = user.profileImage.startsWith('/') 
//         ? `${API_BASE_URL}${user.profileImage}`
//         : `${API_BASE_URL}/${user.profileImage}`;
//       console.log('🖼️ TopNavbar - Full image URL:', fullUrl);
//       return { uri: fullUrl };
//     }
//   };

//   const handleImageError = (error) => {
//     console.log('❌ TopNavbar - Image load error:', error.nativeEvent.error);
//     setImageError(true);
//   };

//   const renderProfileImage = () => {
//     if (loading) {
//       return (
//         <View style={[styles.profileImage, styles.loadingContainer]}>
//           <ActivityIndicator size="small" color="#4caf50" />
//         </View>
//       );
//     }

//     // If we have a profile image and no error, show the image
//     if (user?.profileImage && !imageError) {
//       return (
//         <Image 
//           source={getProfileImageSource()}
//           style={styles.profileImage}
//           resizeMode="cover"
//           onError={handleImageError}
//           onLoad={() => console.log('✅ TopNavbar - Image loaded successfully')}
//         />
//       );
//     }

//     // Fallback - user initial or default icon
//     console.log('🔄 TopNavbar - Using fallback profile display');
//     return (
//       <View style={[styles.profileImage, styles.defaultProfile]}>
//         <Text style={styles.profileInitial}>
//           {user?.fullName ? user.fullName.charAt(0).toUpperCase() : '👤'}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#4caf50" barStyle="dark-content" />
//       <SafeAreaView>
//         <View style={styles.navbar}>
//           <View style={styles.navContainer}>
//             {/* Logo on left */}
//             <View style={styles.navLogo}>
//               <Image 
//                 source={require('../assets/Images/order-logo.png')} 
//                 style={styles.logoImage}
//                 resizeMode="contain"
//               />
//             </View>
            
//             {/* Icons on right */}
//             <View style={styles.navActions}>
//               {showNotification && (
//                 <TouchableOpacity 
//                   style={styles.navIcon} 
//                   onPress={handleNotificationPress}
//                   hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                 >
//                   <Icon name="bell" size={width * 0.07} color="#000000" />
//                 </TouchableOpacity>
//               )}
//               {showProfile && (
//                 <TouchableOpacity 
//                   style={styles.profileContainer} 
//                   onPress={handleProfilePress}
//                   hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                 >
//                   {renderProfileImage()}
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#FFFFFF',
//   },
//   navbar: {
//     backgroundColor: '#FFFFFF',
//     paddingVertical: height * 0.015,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     minHeight: 60,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   navContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: width * 0.05,
//   },
//   navLogo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logoImage: {
//     width: width * 0.12,
//     height: width * 0.12,
//   },
//   navActions: {
//     flexDirection: 'row',
//     gap: width * 0.04,
//     alignItems: 'center',
//   },
//   navIcon: {
//     padding: width * 0.01,
//     minWidth: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   profileContainer: {
//     padding: width * 0.005,
//   },
//   profileImage: {
//     width: width * 0.08,
//     height: width * 0.08,
//     borderRadius: width * 0.04,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   loadingContainer: {
//     backgroundColor: '#f0f0f0',
//   },
//   defaultProfile: {
//     backgroundColor: '#4caf50',
//     borderColor: '#4caf50',
//   },
//   profileInitial: {
//     color: 'white',
//     fontSize: width * 0.04,
//     fontWeight: 'bold',
//   },
// });

// export default TopNavbar;
////////////////////////////
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.1.2:3000';

const TopNavbar = ({ 
  title = "OrderUp", 
  onNotificationPress, 
  onProfilePress, 
  showNotification = true, 
  showProfile = true,
  refreshTrigger = 0
}) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [refreshTrigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadUserData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setImageError(false);
      
      const userDataString = await AsyncStorage.getItem('userData');
      console.log('🔄 TopNavbar - Loading user data:', userDataString ? 'Data found' : 'No data');
      
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log('👤 TopNavbar - User data loaded:', {
          name: userData.fullName,
          hasProfileImage: !!userData.profileImage,
          profileImage: userData.profileImage
        });
        setUser(userData);
      } else {
        console.log('❌ TopNavbar - No user data found in storage');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ TopNavbar - Error loading user data:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = () => {
    console.log('🔔 Notification icon pressed');
    
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      // Navigate to Notification screen with error handling
      try {
        console.log('🚀 Attempting to navigate to Notification screen...');
        navigation.navigate('Notification');
        console.log('✅ Navigation command sent successfully');
      } catch (error) {
        console.error('❌ Navigation error:', error);
        Alert.alert('Error', 'Cannot navigate to notifications at the moment');
      }
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      console.log('Profile pressed');
    }
  };

  const getProfileImageSource = () => {
    if (!user?.profileImage) {
      console.log('🖼️ TopNavbar - No profile image, using fallback');
      return require('../assets/Images/order-logo.png');
    }
    
    console.log('🖼️ TopNavbar - Profile image URL:', user.profileImage);
    
    if (user.profileImage.startsWith('http')) {
      return { uri: user.profileImage };
    } else if (user.profileImage.startsWith('file://')) {
      return { uri: user.profileImage };
    } else {
      const fullUrl = user.profileImage.startsWith('/') 
        ? `${API_BASE_URL}${user.profileImage}`
        : `${API_BASE_URL}/${user.profileImage}`;
      console.log('🖼️ TopNavbar - Full image URL:', fullUrl);
      return { uri: fullUrl };
    }
  };

  const handleImageError = (error) => {
    console.log('❌ TopNavbar - Image load error:', error.nativeEvent.error);
    setImageError(true);
  };

  const renderProfileImage = () => {
    if (loading) {
      return (
        <View style={[styles.profileImage, styles.loadingContainer]}>
          <ActivityIndicator size="small" color="#4caf50" />
        </View>
      );
    }

    if (user?.profileImage && !imageError) {
      return (
        <Image 
          source={getProfileImageSource()}
          style={styles.profileImage}
          resizeMode="cover"
          onError={handleImageError}
          onLoad={() => console.log('✅ TopNavbar - Image loaded successfully')}
        />
      );
    }

    console.log('🔄 TopNavbar - Using fallback profile display');
    return (
      <View style={[styles.profileImage, styles.defaultProfile]}>
        <Text style={styles.profileInitial}>
          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : '👤'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4caf50" barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.navbar}>
          <View style={styles.navContainer}>
            {/* Logo on left */}
            <View style={styles.navLogo}>
              <Image 
                source={require('../assets/Images/order-logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            
            {/* Icons on right */}
            <View style={styles.navActions}>
              {showNotification && (
                <TouchableOpacity 
                  style={styles.navIcon} 
                  onPress={handleNotificationPress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name="bell" size={width * 0.07} color="#000000" />
                </TouchableOpacity>
              )}
              {showProfile && (
                <TouchableOpacity 
                  style={styles.profileContainer} 
                  onPress={handleProfilePress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {renderProfileImage()}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  navbar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: height * 0.015,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  navLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: width * 0.12,
    height: width * 0.12,
  },
  navActions: {
    flexDirection: 'row',
    gap: width * 0.04,
    alignItems: 'center',
  },
  navIcon: {
    padding: width * 0.01,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    padding: width * 0.005,
  },
  profileImage: {
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    backgroundColor: '#f0f0f0',
  },
  defaultProfile: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  profileInitial: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});

export default TopNavbar;