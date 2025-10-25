// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Dimensions,
//   SafeAreaView,
//   Platform,
// } from 'react-native';
// import BottomNavbar from '../Components/ButtomNavbar';
// import TopNavbar from '../Components/topNavbar';
// import FoodCard from '../Components/foodCard'; // Import the FoodCard component

// const { width, height } = Dimensions.get('window');
// const NAVBAR_HEIGHT = 80; // approximate height of your bottom navbar

// const Homepage = ({ navigation }) => {
//   const [activeCategory, setActiveCategory] = useState('Food Finds');
//   const [filteredFoodItems, setFilteredFoodItems] = useState([]);

//   const foodItems = [
//     { id: 1, title: 'Animal food', price: '25.00', rating: '8.4', image: '🍖', category: 'Food Finds' },
//     { id: 2, title: 'Animal food', price: '19.99', rating: '9.4', image: '🥩', category: 'Food Finds' },
//     { id: 3, title: 'Sugar Bugs', price: '12.50', rating: '7.8', image: '🍬', category: 'Vegetables' },
//     { id: 4, title: 'Pizza Eater', price: '15.75', rating: '8.9', image: '🍕', category: 'Dizcary' },
//     { id: 5, title: 'Fresh Carrots', price: '8.99', rating: '9.1', image: '🥕', category: 'Vegetables' },
//     { id: 6, title: 'Magic Potion', price: '22.50', rating: '8.7', image: '🧪', category: 'Dizcary' },
//   ];

//   const categories = ['Food Finds', 'Vegetables', 'Dizcary'];

//   // Filter food items based on active category
//   const filterFoodItems = (category) => {
//     if (category === 'Food Finds') {
//       setFilteredFoodItems(foodItems);
//     } else {
//       const filtered = foodItems.filter(item => item.category === category);
//       setFilteredFoodItems(filtered);
//     }
//   };

//   // Initialize filtered items on component mount and when active category changes
//   React.useEffect(() => {
//     filterFoodItems(activeCategory);
//   }, [activeCategory]);

//   const handleNotificationPress = () => {
//     console.log('Notification pressed');
//   };

//   const handleProfilePress = () => {
//     navigation.navigate('Profile');
//   };



//   const handleViewItem = (item) => {
//     navigation.navigate('foodDetails', { foodItem: item });

//   };

//   const handleCategoryPress = (category) => {
//     setActiveCategory(category);
//     filterFoodItems(category);
//   };

//   const CategoryTab = ({ title, isActive, onPress }) => (
//     <TouchableOpacity
//       style={[styles.categoryTab, isActive && styles.categoryTabActive]}
//       onPress={onPress}
//     >
//       <Text
//         style={[
//           styles.categoryTabText,
//           isActive && styles.categoryTabTextActive,
//         ]}
//       >
//         {title}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* Top Navbar */}
//       <TopNavbar
//         title="OrderUP"
//         onNotificationPress={handleNotificationPress}
//         onProfilePress={handleProfilePress}
//       />

//       {/* Main Scrollable Content */}
//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.searchSection}>
//           <Text style={styles.mainTitle}>Find your food</Text>

//           <View style={styles.searchContainer}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search Food"
//               placeholderTextColor="#888"
//             />
//           </View>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.categoriesScroll}
//             contentContainerStyle={styles.categoriesContainer}
//           >
//             {categories.map((category) => (
//               <CategoryTab
//                 key={category}
//                 title={category}
//                 isActive={activeCategory === category}
//                 onPress={() => handleCategoryPress(category)}
//               />
//             ))}
//           </ScrollView>
//         </View>

//         <View style={styles.foodGrid}>
//           {filteredFoodItems.map((item) => (
//             <FoodCard 
//               key={item.id} 
//               item={item} 
//               onPress={handleViewItem}
//             />
//           ))}
//         </View>

//         {/* Add bottom padding to prevent cutoff */}
//         <View style={{ height: NAVBAR_HEIGHT + 40 }} />
//       </ScrollView>

//       {/* Fixed Bottom Navbar */}
//       <View style={styles.bottomNavbarWrapper}>
//         <SafeAreaView style={styles.bottomNavbarSafe}>
//           <BottomNavbar navigation={navigation} />
//         </SafeAreaView>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   searchSection: {
//     padding: width * 0.05,
//     paddingTop: height * 0.02,
//   },
//   mainTitle: {
//     fontSize: width * 0.07,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: height * 0.02,
//     textAlign: 'left',
//   },
//   searchContainer: {
//     marginBottom: height * 0.02,
//   },
//   searchInput: {
//     width: '100%',
//     padding: height * 0.018,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 12,
//     fontSize: width * 0.04,
//     backgroundColor: 'white',
//     paddingHorizontal: width * 0.05,
//   },
//   categoriesScroll: {
//     marginHorizontal: -width * 0.05,
//   },
//   categoriesContainer: {
//     paddingHorizontal: width * 0.05,
//     flexDirection: 'row',
//     gap: width * 0.03,
//   },
//   categoryTab: {
//     paddingHorizontal: width * 0.05,
//     paddingVertical: height * 0.012,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 20,
//     backgroundColor: 'white',
//     minWidth: width * 0.28,
//     alignItems: 'center',
//   },
//   categoryTabActive: {
//     backgroundColor: '#4caf50',
//     borderColor: '#4caf50',
//   },
//   categoryTabText: {
//     color: '#666',
//     fontWeight: '600',
//     fontSize: width * 0.035,
//     textAlign: 'center',
//   },
//   categoryTabTextActive: {
//     color: 'white',
//   },
//   foodGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: width * 0.05,
//     gap: width * 0.04,
//   },

//   // Fixed bottom navbar section
//   bottomNavbarWrapper: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     elevation: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   bottomNavbarSafe: {
//     paddingBottom: Platform.OS === 'ios' ? 20 : 10,
//   },
// });

// export default Homepage;
//////////////////////////////////////
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import BottomNavbar from '../Components/ButtomNavbar';
import TopNavbar from '../Components/topNavbar';
import FoodCard from '../Components/foodCard'; // Import the FoodCard component

const { width, height } = Dimensions.get('window');
const NAVBAR_HEIGHT = 80; // approximate height of your bottom navbar

const Homepage = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('Food Finds');
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const userName = "John"; // You can replace this with dynamic user data

  const foodItems = [
    { id: 1, title: 'Animal food', price: '25.00', rating: '8.4', image: '🍖', category: 'Food Finds' },
    { id: 2, title: 'Animal food', price: '19.99', rating: '9.4', image: '🥩', category: 'Food Finds' },
    { id: 3, title: 'Sugar Bugs', price: '12.50', rating: '7.8', image: '🍬', category: 'Vegetables' },
    { id: 4, title: 'Pizza Eater', price: '15.75', rating: '8.9', image: '🍕', category: 'Dizcary' },
    { id: 5, title: 'Fresh Carrots', price: '8.99', rating: '9.1', image: '🥕', category: 'Vegetables' },
    { id: 6, title: 'Magic Potion', price: '22.50', rating: '8.7', image: '🧪', category: 'Dizcary' },
  ];

  const categories = ['Food Finds', 'Vegetables', 'Dizcary'];

  // Filter food items based on active category
  const filterFoodItems = (category) => {
    if (category === 'Food Finds') {
      setFilteredFoodItems(foodItems);
    } else {
      const filtered = foodItems.filter(item => item.category === category);
      setFilteredFoodItems(filtered);
    }
  };

  // Initialize filtered items on component mount and when active category changes
  React.useEffect(() => {
    filterFoodItems(activeCategory);
  }, [activeCategory]);

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleViewItem = (item) => {
    navigation.navigate('foodDetails', { foodItem: item });
  };

  const handleCategoryPress = (category) => {
    setActiveCategory(category);
    filterFoodItems(category);
  };

  const CategoryTab = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.categoryTab, isActive && styles.categoryTabActive]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.categoryTabText,
          isActive && styles.categoryTabTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navbar */}
      <TopNavbar
        title="OrderUP"
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchSection}>
          {/* Updated greeting section */}
          <View style={styles.greetingContainer}>
            <Text style={styles.mainTitle}>Hi, </Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          
          <Text style={styles.subTitle}>Find your food</Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Food"
              placeholderTextColor="#888"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <CategoryTab
                key={category}
                title={category}
                isActive={activeCategory === category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.foodGrid}>
          {filteredFoodItems.map((item) => (
            <FoodCard 
              key={item.id} 
              item={item} 
              onPress={handleViewItem}
            />
          ))}
        </View>

        {/* Add bottom padding to prevent cutoff */}
        <View style={{ height: NAVBAR_HEIGHT + 40 }} />
      </ScrollView>

      {/* Fixed Bottom Navbar */}
      <View style={styles.bottomNavbarWrapper}>
        <SafeAreaView style={styles.bottomNavbarSafe}>
          <BottomNavbar navigation={navigation} currentRoute="HomePage" />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  searchSection: {
    padding: width * 0.05,
    paddingTop: height * 0.02,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.005,
  },
  mainTitle: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  userName: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#4caf50', // Green color for the name
    textAlign: 'left',
  },
  subTitle: {
    fontSize: width * 0.045,
    color: '#666',
    marginBottom: height * 0.02,
    textAlign: 'left',
  },
  searchContainer: {
    marginBottom: height * 0.02,
  },
  searchInput: {
    width: '100%',
    padding: height * 0.018,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    fontSize: width * 0.04,
    backgroundColor: 'white',
    paddingHorizontal: width * 0.05,
  },
  categoriesScroll: {
    marginHorizontal: -width * 0.05,
  },
  categoriesContainer: {
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    gap: width * 0.03,
  },
  categoryTab: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.012,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: 'white',
    minWidth: width * 0.28,
    alignItems: 'center',
  },
  categoryTabActive: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  categoryTabText: {
    color: '#666',
    fontWeight: '600',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
  categoryTabTextActive: {
    color: 'white',
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    gap: width * 0.04,
  },

  // Fixed bottom navbar section
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
});

export default Homepage;