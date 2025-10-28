import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Platform,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import BottomNavbar from '../Components/ButtomNavbar';

const { width, height } = Dimensions.get('window');
const NAVBAR_HEIGHT = 80;

const Cart = ({ navigation }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Sample cart items - you can replace with actual cart data
  const cartItems = [
    { id: 1, title: "Animal food", price: "25.00", quantity: 1, image: "🍖" },
    { id: 2, title: "Sugar Bugs", price: "12.50", quantity: 2, image: "🍬" },
  ];

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  };

  const handleProceedToPay = () => {
    setShowPaymentModal(true);
  };

  const handleContinuePayment = () => {
    if (selectedPaymentMethod) {
      // Navigate to PaymentPage with selected payment method
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
        <Text style={styles.itemEmoji}>{item.image}</Text>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityBtn}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityBtn}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeBtn}>
        <Icon name="trash-2" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

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
        <Text style={styles.title}>Shopping Cart</Text>
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
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>${(parseFloat(calculateTotal()) + 2.99).toFixed(2)}</Text>
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

      {/* Fixed Bottom Navbar */}
      <View style={styles.bottomNavbarWrapper}>
        <SafeAreaView style={styles.bottomNavbarSafe}>
          <BottomNavbar navigation={navigation} currentRoute="Cart" />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

// ... (styles remain the same as previous code)
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
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemEmoji: {
    fontSize: 24,
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
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantity: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
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
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: height * 0.5,
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
});

export default Cart;