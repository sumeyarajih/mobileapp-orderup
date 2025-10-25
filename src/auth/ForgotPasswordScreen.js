import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from "react-native";

export default function ForgotPasswordScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/Images/food.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you an OTP to reset your password
          </Text>
          <TextInput 
            placeholder="Enter your email" 
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("OTP")}
          >
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
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
    marginBottom: 25,
    lineHeight: 20,
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
  },
  button: {
    backgroundColor: "#39B54A",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#39B54A",
    fontSize: 14,
    fontWeight: "600",
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