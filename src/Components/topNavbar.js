// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   SafeAreaView,
//   StatusBar
// } from 'react-native';

// const { width, height } = Dimensions.get('window');

// const TopNavbar = ({ 
//   title = "OrderUp", 
//   onNotificationPress, 
//   onProfilePress, 
//   showNotification = true, 
//   showProfile = true 
// }) => {
  
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

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#4caf50" barStyle="light-content" />
//       <SafeAreaView>
//         <View style={styles.navbar}>
//           <View style={styles.navContainer}>
//             <View style={styles.navLogo}>
//               <Text style={styles.logoIcon}>🍽️</Text>
//               <Text style={styles.logoText}>{title}</Text>
//             </View>
//             <View style={styles.navActions}>
//               {showNotification && (
//                 <TouchableOpacity 
//                   style={styles.navIcon} 
//                   onPress={handleNotificationPress}
//                   hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                 >
//                   <Text style={styles.navIconText}>🔔</Text>
//                 </TouchableOpacity>
//               )}
//               {showProfile && (
//                 <TouchableOpacity 
//                   style={styles.navIcon} 
//                   onPress={handleProfilePress}
//                   hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                 >
//                   <Text style={styles.navIconText}>👤</Text>
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
//     backgroundColor: '#4caf50',
//   },
//   navbar: {
//     backgroundColor: '#4caf50',
//     paddingVertical: height * 0.015,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     minHeight: 60,
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
//     flex: 1,
//   },
//   logoIcon: {
//     fontSize: width * 0.06,
//     marginRight: width * 0.02,
//     minWidth: 30,
//   },
//   logoText: {
//     fontSize: width * 0.055,
//     fontWeight: 'bold',
//     color: 'white',
//     includeFontPadding: false,
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
//   navIconText: {
//     fontSize: width * 0.06,
//     textAlign: 'center',
//   },
// });

// export default TopNavbar;
////////////////////////////////////
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';

const { width, height } = Dimensions.get('window');

const TopNavbar = ({ 
  title = "OrderUp", 
  onNotificationPress, 
  onProfilePress, 
  showNotification = true, 
  showProfile = true 
}) => {
  
  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      console.log('Notification pressed');
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      console.log('Profile pressed');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4caf50" barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.navbar}>
          <View style={styles.navContainer}>
            {/* Logo on left - Replace with your actual logo asset */}
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
                  <Text style={styles.notificationIcon}>🔔</Text>
                </TouchableOpacity>
              )}
              {showProfile && (
                <TouchableOpacity 
                  style={styles.profileContainer} 
                  onPress={handleProfilePress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Image 
                    source={require('../assets/Images/order-logo.png')} // Replace with your profile image path
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
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
    backgroundColor: '#4caf50',
  },
  navbar: {
    backgroundColor: '#4caf50',
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
  notificationIcon: {
    fontSize: width * 0.06,
    textAlign: 'center',
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
  },
});

export default TopNavbar;