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
} from "react-native";

// Use the same API base URL
const API_BASE_URL = "http://192.168.1.100:3000/api"; // Change this to your computer's IP

export default function OTPScreen({ navigation, route }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const email = route.params?.email || "";
  
  const inputRefs = [
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
      if (value && index < 3) {
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
    
    if (otpString.length !== 4) {
      Alert.alert("Error", "Please enter the complete 4-digit OTP");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email not found. Please sign up again.");
      return;
    }

    setLoading(true);
    try {
      console.log("Verifying OTP...");
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otpString,
        }),
      });

      console.log("Response status:", response.status);
      
      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid server response");
      }

      if (response.ok) {
        Alert.alert("Success", "OTP verified successfully! Your account has been created.");
        // Navigate to HomePage after successful OTP verification
        navigation.navigate("HomePage");
      } else {
        Alert.alert("Error", data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error details:", error);
      Alert.alert(
        "Network Error", 
        `Cannot connect to server. Please check your connection and try again.\n\nError: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Email not found. Please go back and sign up again.");
      return;
    }

    setLoading(true);
    try {
      console.log("Resending OTP...");
      const response = await fetch(`${API_BASE_URL}/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log("Response status:", response.status);
      
      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid server response");
      }

      if (response.ok) {
        Alert.alert("Success", "OTP has been resent to your email.");
      } else {
        Alert.alert("Error", data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error details:", error);
      Alert.alert(
        "Network Error", 
        `Cannot connect to server. Please check your connection and try again.\n\nError: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            We've sent a 4-digit code to your email. Enter it below to verify.
          </Text>
          <Text style={styles.emailText}>{email}</Text>
          
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput 
                key={index} 
                ref={inputRefs[index]}
                style={styles.otpInput} 
                maxLength={1} 
                keyboardType="numeric" 
                value={otp[index]}
                onChangeText={(value) => handleOtpChange(value, index)}
                selectTextOnFocus
                color="#000" // Ensure black text
              />
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
              <Text style={[styles.link, loading && styles.linkDisabled]}>Resend OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
              <Text style={[styles.link, loading && styles.linkDisabled]}>Change Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🌿 Fresh & Healthy</Text>
        </View>
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
  emailText: {
    fontSize: 14,
    color: "#39B54A",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    color: "#000", // Black text for OTP inputs
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
});