import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavbar from '../Components/ButtomNavbar';
import TopNavbar from '../Components/topNavbar';
import FoodCard from '../Components/foodCard';

const { width, height } = Dimensions.get('window');
const NAVBAR_HEIGHT = 80;

const Homepage = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner'];

  // Load user data from AsyncStorage
  useEffect(() => {
    loadUserData();
    fetchFoodItems();
  }, []);

  // Filter food items when category or search query changes
  useEffect(() => {
    filterFoodItems();
  }, [activeCategory, foodItems, searchQuery]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        console.log('Loaded user data:', parsedData);
        setUserName(parsedData.fullName || parsedData.name || 'User');
      } else {
        setUserName('User');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserName('User');
    }
  };

  const fetchFoodItems = async () => {
    try {
      setApiLoading(true);
      const response = await fetch('http://192.168.1.2:3000/api/food-items');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched food items:', data);
      
      // If the API returns an array directly
      if (Array.isArray(data)) {
        setFoodItems(data);
      } 
      // If the API returns an object with data property
      else if (data.data && Array.isArray(data.data)) {
        setFoodItems(data.data);
      }
      // If the API returns an object with items property
      else if (data.items && Array.isArray(data.items)) {
        setFoodItems(data.items);
      }
      else {
        console.warn('Unexpected API response format:', data);
        setFoodItems([]);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      // Fallback to sample data if API fails
      setFoodItems([
        {
          id: '1',
          name: 'Grilled Salmon with Vegetables',
          description: 'Tender salmon fillet served with steamed broccoli and carrots',
          price: 18.99,
          image: 'https://media.istockphoto.com/id/1214416414/photo/barbecued-salmon-fried-potatoes-and-vegetables-on-wooden-background.jpg?s=612x612&w=0&k=20&c=Y8RYbZFcvec-FXMMuoU-qkprC3TUFNiw3Ysoe8Drn6g=',
          category: 'Dinner',
          rating: 4.8,
          calories: 470,
          protein: '40g',
          carbs: '8g',
          fat: '28g'
        },
        {
          id: '2',
          name: 'Avocado Toast',
          description: 'Fresh avocado on whole grain bread with cherry tomatoes',
          price: 12.50,
          image: '🥑',
          category: 'Breakfast',
          rating: 4.5,
          calories: 320,
          protein: '15g',
          carbs: '35g',
          fat: '18g'
        },
        {
          id: '3',
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with Caesar dressing and croutons',
          price: 14.75,
          image: '🥗',
          category: 'Lunch',
          rating: 4.3,
          calories: 280,
          protein: '12g',
          carbs: '20g',
          fat: '22g'
        }
      ]);
    } finally {
      setApiLoading(false);
      setLoading(false);
    }
  };

  const filterFoodItems = () => {
    let filtered = [...foodItems];

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => 
        item.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    }

    setFilteredFoodItems(filtered);
  };

  const handleCategoryPress = (category) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleViewItem = (item) => {
    navigation.navigate('foodDetails', { foodItem: item });
  };

  const handleRefresh = () => {
    fetchFoodItems();
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4caf50" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navbar */}
      <TopNavbar
        title="OrderUP"
        onNotificationPress={() => console.log('Notification pressed')}
        onProfilePress={() => navigation.navigate('Profile')}
        showRefresh={true}
        onRefresh={handleRefresh}
        refreshing={apiLoading}
      />

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={apiLoading}
            onRefresh={handleRefresh}
            colors={['#4caf50']}
            tintColor="#4caf50"
          />
        }
      >
        <View style={styles.searchSection}>
          {/* Greeting section with dynamic user name */}
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
              value={searchQuery}
              onChangeText={handleSearchChange}
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

        {/* Food Items Grid */}
        {apiLoading ? (
          <View style={styles.loadingFoodContainer}>
            <ActivityIndicator size="large" color="#4caf50" />
            <Text style={styles.loadingFoodText}>Loading food items...</Text>
          </View>
        ) : filteredFoodItems.length > 0 ? (
          <View style={styles.foodGrid}>
            {filteredFoodItems.map((item) => (
              <FoodCard 
                key={item.id} 
                item={{
                  id: item.id,
                  title: item.name,
                  price: item.price.toString(),
                  rating: item.rating?.toString() || '4.5',
                  image: item.image,
                  category: item.category,
                  description: item.description
                }} 
                onPress={handleViewItem}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No food items found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try adjusting your search' : `No ${activeCategory !== 'All' ? activeCategory : ''} items available`}
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
    color: '#4caf50',
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
  loadingFoodContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 15,
  },
  loadingFoodText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
});

export default Homepage;