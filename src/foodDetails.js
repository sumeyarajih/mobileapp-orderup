import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.2:3000';

const FoodDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const { foodItem } = route.params || {};

  if (!foodItem) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Food Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.center}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#555" }}>
            No food item found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const price = parseFloat(foodItem.price) || 0;
  const totalPrice = (price * quantity).toFixed(2);

  const foodName = foodItem.name || foodItem.title || 'Food Item';
  const foodImage = foodItem.image;
  const foodRating = foodItem.rating || '4.5';
  const foodDescription = foodItem.description || 'No description available.';
  const foodCategory = foodItem.category || 'Uncategorized';

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const addToCart = async () => {
    try {
      setAddingToCart(true);
      
      // Get token from separate userToken key (as stored in AuthScreen)
      const token = await AsyncStorage.getItem('userToken');
      const userDataString = await AsyncStorage.getItem('userData');
      
      console.log('🍕 FoodDetails - Token available:', token ? 'Yes' : 'No');
      console.log('🍕 FoodDetails - User data available:', userDataString ? 'Yes' : 'No');

      if (!token) {
        Alert.alert(
          'Login Required',
          'Please login to add items to cart',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => navigation.replace('Auth') }
          ]
        );
        return;
      }

      // Call the add to cart API
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodItemId: foodItem.id,
          quantity: quantity
        })
      });

      console.log('🍕 Add to cart API response status:', response.status);

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          'Added to Cart ✅',
          `Added ${quantity} ${foodName}(s) to cart for $${totalPrice}`,
          [
            {
              text: 'Continue Shopping',
              style: 'cancel',
              onPress: () => navigation.goBack(),
            },
            {
              text: 'View Cart',
              onPress: () => navigation.navigate('Cart'),
            },
          ]
        );
      } else {
        // Handle specific error cases
        if (response.status === 400 && result.message === "Food item is not available") {
          Alert.alert('Not Available', 'This item is currently not available.');
        } else if (response.status === 404) {
          Alert.alert('Not Found', 'Food item not found.');
        } else if (response.status === 401) {
          // Token expired
          await AsyncStorage.multiRemove(['userToken', 'userData']);
          Alert.alert(
            'Session Expired',
            'Please login again',
            [{ text: 'OK', onPress: () => navigation.replace('Auth') }]
          );
        } else {
          Alert.alert('Error', result.message || 'Failed to add item to cart');
        }
      }
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      if (error.message.includes('Network request failed')) {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'Failed to add item to cart. Please try again.');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  // Check if image is a URL or emoji
  const isImageUrl = (image) => {
    return typeof image === 'string' && 
           (image.startsWith('http') || image.startsWith('https'));
  };

  const isEmoji = (image) => {
    return typeof image === 'string' && image.length <= 3;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Food Image */}
        <View style={styles.foodImageContainer}>
          {isImageUrl(foodImage) ? (
            <Image
              source={{ uri: foodImage }}
              style={styles.foodImage}
              resizeMode="cover"
            />
          ) : isEmoji(foodImage) ? (
            <Text style={styles.foodEmoji}>{foodImage}</Text>
          ) : (
            <View style={styles.foodImagePlaceholder}>
              <Text style={styles.foodImagePlaceholderText}>🍽️</Text>
              <Text style={styles.foodImagePlaceholderSubtext}>No Image</Text>
            </View>
          )}
        </View>

        {/* Food Info */}
        <View style={styles.foodInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.foodTitle}>{foodName}</Text>
            <Text style={styles.foodPrice}>${price.toFixed(2)}</Text>
          </View>

          {/* Category and Rating */}
          <View style={styles.metaInfo}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{foodCategory}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.foodRating}>{foodRating}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.description}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {foodDescription}
            </Text>
          </View>

          {/* Nutrition Information - Show real data if available */}
          {(foodItem.calories || foodItem.protein || foodItem.carbs || foodItem.fat) && (
            <View style={styles.nutrition}>
              <Text style={styles.nutritionTitle}>Nutrition Information</Text>
              <View style={styles.nutritionGrid}>
                {foodItem.calories && (
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{foodItem.calories}</Text>
                    <Text style={styles.nutritionLabel}>Calories</Text>
                  </View>
                )}
                {foodItem.protein && (
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{foodItem.protein}g</Text>
                    <Text style={styles.nutritionLabel}>Protein</Text>
                  </View>
                )}
                {foodItem.carbs && (
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{foodItem.carbs}g</Text>
                    <Text style={styles.nutritionLabel}>Carbs</Text>
                  </View>
                )}
                {foodItem.fat && (
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{foodItem.fat}g</Text>
                    <Text style={styles.nutritionLabel}>Fat</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                onPress={decreaseQuantity}
                disabled={quantity === 1}
              >
                <Text style={[styles.quantityButtonText, quantity === 1 && styles.quantityButtonTextDisabled]}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={increaseQuantity}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Price */}
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>${totalPrice}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.addToCartButton, addingToCart && styles.addToCartButtonDisabled]}
          onPress={addToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.addToCartButtonText}>Adding to Cart...</Text>
            </View>
          ) : (
            <Text style={styles.addToCartButtonText}>Add to Cart - ${totalPrice}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  foodImageContainer: {
    height: 250,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodEmoji: {
    fontSize: 100,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodImagePlaceholderText: {
    fontSize: 60,
    marginBottom: 10,
  },
  foodImagePlaceholderSubtext: {
    fontSize: 16,
    color: '#666',
  },
  foodInfo: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  foodTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  foodPrice: {
    fontSize: 22,
    color: '#2e7d32',
    fontWeight: '700',
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingStar: {
    fontSize: 16,
    marginRight: 4,
  },
  foodRating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  description: {
    marginBottom: 25,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  descriptionText: {
    color: '#666',
    lineHeight: 22,
    fontSize: 15,
  },
  nutrition: {
    marginBottom: 25,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    padding: 5,
  },
  quantityButton: {
    backgroundColor: '#2e7d32',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  quantityButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityButtonTextDisabled: {
    color: '#999',
  },
  quantity: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2e7d32',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: 30,
  },
  addToCartButton: {
    backgroundColor: '#2e7d32',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FoodDetails;