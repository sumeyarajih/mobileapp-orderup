import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const PaymentPage = ({ route, navigation }) => {
  const { paymentMethod, totalAmount, cartItems } = route.params;
  const [mobileNumber, setMobileNumber] = useState('+2519');
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = () => {
    // Validate mobile number
    if (!validateMobileNumber(mobileNumber)) {
      Alert.alert('Invalid Number', 'Please enter a valid Ethiopian mobile number starting with +2519 followed by 8 digits');
      return;
    }

    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to success page or show success message
      Alert.alert(
        'Payment Successful',
        `Your payment of $${totalAmount} has been processed successfully!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('HomePage')
          }
        ]
      );
    }, 2000);
  };

  const validateMobileNumber = (number) => {
    // Validate Ethiopian mobile number: +2519 followed by 8 digits
    const ethiopianMobileRegex = /^\+2519[0-9]{8}$/;
    return ethiopianMobileRegex.test(number);
  };

  const formatMobileNumber = (text) => {
    // Remove all non-digit characters except +
    let cleaned = text.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +2519
    if (!cleaned.startsWith('+2519')) {
      cleaned = '+2519' + cleaned.replace(/^\+2519/, '');
    }
    
    // Limit to 13 characters (+2519 + 8 digits)
    if (cleaned.length > 13) {
      cleaned = cleaned.substring(0, 13);
    }
    
    setMobileNumber(cleaned);
  };

  const getPaymentMethodDetails = () => {
    switch (paymentMethod) {
      case 'ebirr':
        return {
          name: 'E-birr',
          icon: '📱',
          description: 'Mobile Money Payment',
          instructions: 'Enter your E-birr registered mobile number'
        };
      case 'arifpay':
        return {
          name: 'Arif Pay',
          icon: '💳',
          description: 'Digital Payment',
          instructions: 'Enter your Arif Pay registered mobile number'
        };
      default:
        return {
          name: 'Payment',
          icon: '💰',
          description: 'Payment Gateway',
          instructions: 'Enter your mobile number'
        };
    }
  };

  const paymentDetails = getPaymentMethodDetails();

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
        <Text style={styles.title}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Payment Method Card */}
        <View style={styles.paymentMethodCard}>
          <View style={styles.paymentMethodHeader}>
            <Text style={styles.paymentIcon}>{paymentDetails.icon}</Text>
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodName}>{paymentDetails.name}</Text>
              <Text style={styles.paymentMethodDescription}>{paymentDetails.description}</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.map((item, index) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.title}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>${(parseFloat(item.price) * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>${totalAmount}</Text>
          </View>
        </View>

        {/* Mobile Number Input */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Mobile Number</Text>
          <Text style={styles.instructions}>{paymentDetails.instructions}</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.mobileInput}
              value={mobileNumber}
              onChangeText={formatMobileNumber}
              placeholder="+2519XXXXXXXX"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={13}
            />
            <View style={styles.inputStatus}>
              {validateMobileNumber(mobileNumber) ? (
                <Icon name="check-circle" size={20} color="#4caf50" />
              ) : (
                <Icon name="alert-circle" size={20} color="#ff9800" />
              )}
            </View>
          </View>

          {!validateMobileNumber(mobileNumber) && mobileNumber.length > 0 && (
            <Text style={styles.errorText}>
              Please enter a valid Ethiopian mobile number (13 digits total)
            </Text>
          )}
        </View>

        {/* Pay Button */}
        <TouchableOpacity 
          style={[
            styles.payButton,
            (!validateMobileNumber(mobileNumber) || isLoading) && styles.payButtonDisabled
          ]}
          onPress={handlePay}
          disabled={!validateMobileNumber(mobileNumber) || isLoading}
        >
          {isLoading ? (
            <Text style={styles.payButtonText}>Processing...</Text>
          ) : (
            <Text style={styles.payButtonText}>Pay ${totalAmount}</Text>
          )}
        </TouchableOpacity>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Icon name="shield" size={16} color="#4caf50" />
          <Text style={styles.securityText}>
            Your payment is secure and encrypted
          </Text>
        </View>
      </ScrollView>
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
  paymentMethodCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#666',
  },
  orderSummary: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  inputSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  mobileInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  inputStatus: {
    padding: 15,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 8,
  },
  payButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityNotice: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  securityText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default PaymentPage;