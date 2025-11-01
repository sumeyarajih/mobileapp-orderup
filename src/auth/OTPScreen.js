import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Alert,
  Modal,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const API_BASE_URL = "http://192.168.1.2:3000/api";

export default function OTPScreen({ navigation, route }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const phoneNumber = route.params?.phoneNumber || "";
  
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
      }
      
      // Auto-focus previous input on backspace
      if (value === "" && index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit OTP");
      return;
    }

    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not found. Please sign up again.");
      return;
    }

    setLoading(true);
    try {
      console.log("Verifying OTP for phone:", phoneNumber);
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          otp: otpString,
        }),
      });

      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        Alert.alert("Verification Failed", data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      Alert.alert(
        "Network Error", 
        `Cannot connect to server. Please check your connection and try again.\n\nError: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    navigation.navigate("HomePage");
  };

  const handleResendOtp = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not found. Please go back and sign up again.");
      return;
    }

    setLoading(true);
    try {
      console.log("Resending OTP to phone:", phoneNumber);
      const response = await fetch(`${API_BASE_URL}/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        Alert.alert("Success", "OTP has been resent to your phone number.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs[0].current.focus();
      } else {
        Alert.alert("Error", data.error || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      Alert.alert(
        "Network Error", 
        `Cannot connect to server. Please check your connection and try again.\n\nError: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs[0].current.focus();
  };

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (phone.length === 10) {
      return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`;
    }
    return phone;
  };

  return (
    <ImageBackground
      source={require("../assets/Images/food.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to your phone number
          </Text>
          <Text style={styles.phoneText}>{formatPhoneNumber(phoneNumber)}</Text>
          
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TextInput 
                key={index} 
                ref={inputRefs[index]}
                style={styles.otpInput} 
                maxLength={1} 
                keyboardType="numeric" 
                value={otp[index]}
                onChangeText={(value) => handleOtpChange(value, index)}
                selectTextOnFocus
                color="#000"
              />
            ))}
          </View>

          <View style={styles.otpActions}>
            <TouchableOpacity onPress={clearOtp} disabled={loading}>
              <Text style={[styles.actionText, loading && styles.actionTextDisabled]}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Verifying..." : "Verify Code"}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
              <Text style={[styles.link, loading && styles.linkDisabled]}>
                Resend Code
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
              <Text style={[styles.link, loading && styles.linkDisabled]}>
                Change Phone Number
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🌿 Fresh & Healthy</Text>
        </View>

        {/* Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.successIcon}>
                  <Text style={styles.successIconText}>✓</Text>
                </View>
                
                <Text style={styles.modalTitle}>Registration Successful!</Text>
                
                <Text style={styles.modalMessage}>
                  Your account has been successfully created and verified. 
                  You can now enjoy all the features of our app.
                </Text>
                
                <TouchableOpacity 
                  style={styles.continueButton}
                  onPress={handleContinue}
                >
                  <Text style={styles.continueButtonText}>Continue to Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(57, 181, 74, 0.6)",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    width: "100%",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 25,
    elevation: 6,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#39B54A",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 20,
  },
  phoneText: {
    fontSize: 14,
    color: "#39B54A",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  otpInput: {
    width: 45,
    height: 55,
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    color: "#000",
  },
  otpActions: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  actionText: {
    color: "#39B54A",
    fontSize: 14,
    fontWeight: "600",
  },
  actionTextDisabled: {
    color: "#cccccc",
  },
  button: {
    backgroundColor: "#39B54A",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  link: {
    color: "#39B54A",
    fontSize: 14,
    fontWeight: "600",
  },
  linkDisabled: {
    color: "#cccccc",
  },
  footer: {
    marginTop: 30,
  },
  footerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContent: {
    padding: 30,
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#39B54A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successIconText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#39B54A",
    marginBottom: 15,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  continueButton: {
    backgroundColor: "#39B54A",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    width: "100%",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});