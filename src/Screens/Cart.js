import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Platform,
  Modal,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import BottomNavbar from '../Components/ButtomNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const NAVBAR_HEIGHT = 80;
const API_BASE_URL = 'http://192.168.1.2:3000';

const Cart = ({ navigation }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch cart items from API
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      
      // Get token from separate userToken key (as stored in AuthScreen)
      const token = await AsyncStorage.getItem('userToken');
      const userDataString = await AsyncStorage.getItem('userData');
      
      console.log('🛒 Cart - Token available:', token ? 'Yes' : 'No');
      console.log('🛒 Cart - User data available:', userDataString ? 'Yes' : 'No');
      
      if (!token) {
        console.log('❌ No token found in Cart');
        Alert.alert(
          'Login Required',
          'Please login to view your cart',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => navigation.replace('Auth') }
          ]
        );
        setCartItems([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🛒 Cart API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Cart items fetched:', data.length, 'items');
        setCartItems(data);
      } else {
        console.error('❌ Failed to fetch cart items, status:', response.status);
        if (response.status === 401) {
          // Token expired or invalid
          await AsyncStorage.multiRemove(['userToken', 'userData']);
          Alert.alert(
            'Session Expired',
            'Please login again',
            [{ text: 'OK', onPress: () => navigation.replace('Auth') }]
          );
        }
        setCartItems([]);
      }
    } catch (error) {
      console.error('❌ Fetch cart error:', error);
      Alert.alert('Error', 'Failed to load cart items. Please check your connection.');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCartItems();
    });

    return unsubscribe;
  }, [navigation]);

  // Update cart item quantity
  const updateCartItemQuantity = async (itemId, newQuantity) => {
    try {
      setUpdatingItem(itemId);
      
      if (newQuantity < 1) {
        showDeleteConfirmation(itemId);
        return;
      }

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login to update cart');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        await fetchCartItems(); // Refresh cart items
      } else {
        const result = await response.json();
        Alert.alert('Error', result.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Update cart error:', error);
      Alert.alert('Error', 'Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteModal(true);
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login to remove items');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchCartItems(); // Refresh cart items
        setShowDeleteModal(false);
        setItemToDelete(null);
      } else {
        const result = await response.json();
        Alert.alert('Error', result.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.foodItem?.price || '0');
      return total + (itemPrice * item.quantity);
    }, 0).toFixed(2);
  };

  const handleProceedToPay = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart before proceeding to payment.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleContinuePayment = () => {
    if (selectedPaymentMethod) {
      navigation.navigate('PaymentPage', {
        paymentMethod: selectedPaymentMethod,
        totalAmount: (parseFloat(calculateTotal()) + 2.99).toFixed(2),
        cartItems: cartItems
      });
      setShowPaymentModal(false);
      setSelectedPaymentMethod(null);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedPaymentMethod(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete);
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

  const PaymentMethodOption = ({ method, title, description, icon }) => (
    <TouchableOpacity
      style={[
        styles.paymentOption,
        selectedPaymentMethod === method && styles.paymentOptionSelected
      ]}
      onPress={() => setSelectedPaymentMethod(method)}
    >
      <View style={styles.paymentOptionLeft}>
        <View style={[
          styles.radioCircle,
          selectedPaymentMethod === method && styles.radioCircleSelected
        ]}>
          {selectedPaymentMethod === method && (
            <View style={styles.radioInnerCircle} />
          )}
        </View>
        <View style={styles.paymentTextContainer}>
          <Text style={[
            styles.paymentOptionTitle,
            selectedPaymentMethod === method && styles.paymentOptionTitleSelected
          ]}>
            {title}
          </Text>
          <Text style={styles.paymentOptionDescription}>
            {description}
          </Text>
        </View>
      </View>
      <Text style={styles.paymentIcon}>{icon}</Text>
    </TouchableOpacity>
  );

  const CartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImage}>
        {item.foodItem?.image ? (
          isImageUrl(item.foodItem.image) ? (
            <Image
              source={{ uri: item.foodItem.image }}
              style={styles.foodImage}
              resizeMode="cover"
            />
          ) : isEmoji(item.foodItem.image) ? (
            <Text style={styles.itemEmoji}>{item.foodItem.image}</Text>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderEmoji}>🍽️</Text>
            </View>
          )
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>🍽️</Text>
          </View>
        )}
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.foodItem?.name || 'Food Item'}</Text>
        <Text style={styles.itemPrice}>${parseFloat(item.foodItem?.price || '0').toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.quantityBtn, item.quantity === 1 && styles.quantityBtnDisabled]}
            onPress={() => updateCartItemQuantity(item.id, item.quantity - 1)}
            disabled={updatingItem === item.id || item.quantity === 1}
          >
            {updatingItem === item.id ? (
              <ActivityIndicator size="small" color="#4caf50" />
            ) : (
              <Text style={[styles.quantityText, item.quantity === 1 && styles.quantityTextDisabled]}>-</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)}
            disabled={updatingItem === item.id}
          >
            {updatingItem === item.id ? (
              <ActivityIndicator size="small" color="#4caf50" />
            ) : (
              <Text style={styles.quantityText}>+</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.removeBtn}
        onPress={() => showDeleteConfirmation(item.id)}
        disabled={updatingItem === item.id}
      >
        <Icon name="trash-2" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Food  Cart</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4caf50" />
          <Text style={styles.loadingText}>Loading cart...</Text>
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
        <Text style={styles.title}>Food Cart</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cartItems.length > 0 ? (
          <>
            <View style={styles.cartItems}>
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </View>
            
            {/* Total Section */}
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalAmount}>${calculateTotal()}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Delivery</Text>
                <Text style={styles.totalAmount}>$2.99</Text>
              </View>
              <View style={[styles.totalRow, styles.totalRowMain]}>
                <Text style={[styles.totalLabel, styles.totalLabelMain]}>Total</Text>
                <Text style={[styles.totalAmount, styles.totalAmountMain]}>
                  ${(parseFloat(calculateTotal()) + 2.99).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleProceedToPay}
            >
              <Text style={styles.checkoutText}>Proceed to Pay</Text>
            </TouchableOpacity>

            {/* Add bottom padding to prevent cutoff */}
            <View style={{ height: NAVBAR_HEIGHT + 40 }} />
          </>
        ) : (
          <View style={styles.emptyCart}>
            <Icon name="shopping-cart" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Text style={styles.emptySubtext}>Add some delicious items to get started!</Text>
            <TouchableOpacity 
              style={styles.shoppingButton}
              onPress={() => navigation.navigate('HomePage')}
            >
              <Text style={styles.shoppingButtonText}>Start Shopping</Text>
            </TouchableOpacity>
            {/* Add bottom padding to prevent cutoff */}
            <View style={{ height: NAVBAR_HEIGHT + 40 }} />
          </View>
        )}
      </ScrollView>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelPayment}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCancelPayment}
              >
                <Icon name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Payment Options */}
            <View style={styles.paymentOptions}>
              <PaymentMethodOption
                method="ebirr"
                title="E-birr"
                description="Fast and secure mobile payment"
                icon="📱"
              />
              <PaymentMethodOption
                method="arifpay"
                title="Arif Pay"
                description="Digital payment solution"
                icon="💳"
              />
            </View>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelPayment}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.continueButton,
                  !selectedPaymentMethod && styles.continueButtonDisabled
                ]}
                onPress={handleContinuePayment}
                disabled={!selectedPaymentMethod}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteModalIcon}>
              <Icon name="trash-2" size={50} color="#ff4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Remove Item</Text>
            <Text style={styles.deleteModalText}>
              Are you sure you want to remove this item from your cart?
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.deleteConfirmButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fixed Bottom Navbar */}
      <View style={styles.bottomNavbarWrapper}>
        <SafeAreaView style={styles.bottomNavbarSafe}>
          <BottomNavbar navigation={navigation} currentRoute="Cart" />
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
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
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
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  itemEmoji: {
    fontSize: 24,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderEmoji: {
    fontSize: 20,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnDisabled: {
    backgroundColor: '#cccccc',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  quantityTextDisabled: {
    color: '#999999',
  },
  quantity: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 5,
    alignSelf: 'flex-start',
  },
  totalSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalRowMain: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalLabelMain: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmountMain: {
    fontSize: 18,
    color: '#4caf50',
  },
  checkoutButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: height * 0.7,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  shoppingButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  shoppingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  deleteModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  deleteModalIcon: {
    marginBottom: 15,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  deleteModalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  paymentOptions: {
    marginBottom: 30,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentOptionSelected: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: '#4caf50',
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4caf50',
  },
  paymentTextContainer: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  paymentOptionTitleSelected: {
    color: '#4caf50',
  },
  paymentOptionDescription: {
    fontSize: 14,
    color: '#666',
  },
  paymentIcon: {
    fontSize: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  continueButton: {
    backgroundColor: '#4caf50',
  },
  deleteConfirmButton: {
    backgroundColor: '#ff4444',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  deleteConfirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Cart;