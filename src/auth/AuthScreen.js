import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Alert,
} from "react-native";

const { width } = Dimensions.get("window");

// Use your computer's IP address instead of localhost
// Replace 'YOUR_COMPUTER_IP' with your actual IP address
const API_BASE_URL = "http://192.168.1.3:3000/api"; // Change this to your computer's IP

export default function AuthScreen({ navigation }) {
  const animation = useRef(new Animated.Value(0)).current;
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });

  const slideTo = (value) => {
    Animated.timing(animation, {
      toValue: value,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSwitch = (loginMode) => {
    setIsLogin(loginMode);
    slideTo(loginMode ? 0 : -width * 0.92);
  };

  // Handle login
  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting login...");
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email.trim().toLowerCase(),
          password: loginData.password,
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
        Alert.alert("Success", "Login successful!");
        // Navigate to HomePage after successful login
        navigation.navigate("HomePage");
      } else {
        Alert.alert("Error", data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error details:", error);
      Alert.alert(
        "Network Error", 
        `Cannot connect to server. Please check:\n\n1. Your computer's IP address\n2. Server is running on port 3000\n3. Both devices are on same network\n\nError: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async () => {
    // Validate all fields
    if (!signupData.fullName || !signupData.email || !signupData.phoneNumber || !signupData.password || !signupData.confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phoneRegex.test(signupData.phoneNumber)) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    // Password validation
    if (signupData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting signup...");
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: signupData.fullName.trim(),
          email: signupData.email.trim().toLowerCase(),
          phoneNumber: signupData.phoneNumber.trim(),
          password: signupData.password,
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
        Alert.alert("Success", "Registration successful! Please verify your OTP.");
        // Navigate to OTP screen after successful registration
        navigation.navigate("OTPScreen", { email: signupData.email });
      } else {
        Alert.alert("Error", data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error details:", error);
      Alert.alert(
        "Network Error", 
        `Cannot connect to server. Please check:\n\n1. Your computer's IP address\n2. Server is running on port 3000\n3. Both devices are on same network\n\nError: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Update login form data
  const updateLoginData = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update signup form data
  const updateSignupData = (field, value) => {
    setSignupData(prev => ({
      ...prev,
      [field]: value
    }));
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
          {/* Header Text */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              {isLogin ? "Log in to your account" : "Sign up to create your account"}
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => handleSwitch(true)}
              style={[styles.tab, isLogin && styles.activeTab]}
            >
              <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                Log In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSwitch(false)}
              style={[styles.tab, !isLogin && styles.activeTab]}
            >
              <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Animated Forms */}
          <View style={styles.formContainer}>
            <Animated.View
              style={{
                flexDirection: "row",
                width: width * 1.85,
                transform: [{ translateX: animation }],
              }}
            >
              {/* LOGIN */}
              <View style={[styles.form, { width: width * 0.92 }]}>
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  placeholderTextColor="#999"
                  value={loginData.email}
                  onChangeText={(text) => updateLoginData("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  style={styles.input}
                  placeholderTextColor="#999"
                  value={loginData.password}
                  onChangeText={(text) => updateLoginData("password", text)}
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, loading && styles.buttonDisabled]} 
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Logging in..." : "Log In"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* SIGNUP */}
              <View style={[styles.form, { width: width * 0.92 }]}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  <TextInput
                    placeholder="Full Name"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={signupData.fullName}
                    onChangeText={(text) => updateSignupData("fullName", text)}
                    autoComplete="name"
                  />
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={signupData.email}
                    onChangeText={(text) => updateSignupData("email", text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                  <TextInput
                    placeholder="Phone Number"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={signupData.phoneNumber}
                    onChangeText={(text) => updateSignupData("phoneNumber", text)}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                  />
                  <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={signupData.password}
                    onChangeText={(text) => updateSignupData("password", text)}
                    autoComplete="password-new"
                  />
                  <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={signupData.confirmPassword}
                    onChangeText={(text) => updateSignupData("confirmPassword", text)}
                    autoComplete="password-new"
                  />
                  <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]} 
                    onPress={handleSignup}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? "Creating Account..." : "Sign Up"}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </Animated.View>
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
    paddingVertical: 25,
    paddingHorizontal: 20,
    elevation: 6,
    maxHeight: "80%",
    overflow: "hidden",
    alignSelf: "center",
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E6E6E6",
    borderRadius: 25,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#39B54A",
  },
  tabText: {
    color: "#777",
    fontWeight: "600",
    fontSize: 16,
  },
  activeTabText: {
    color: "#fff",
  },
  formContainer: {
    height: 400,
    overflow: "hidden",
  },
  form: {
    paddingHorizontal: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  input: {
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: "100%",
    alignSelf: "center",
    color: "#000", // This ensures text is black
  },
  button: {
    backgroundColor: "#39B54A",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    alignSelf: "center",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "#39B54A",
    alignSelf: "flex-start",
    marginBottom: 15,
    fontWeight: "600",
    marginLeft: 5,
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