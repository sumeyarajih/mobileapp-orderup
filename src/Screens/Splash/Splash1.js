import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Image, StatusBar } from "react-native";

const Splash1 = ({ navigation }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current; // for logo bounce
  const slideAnim = useRef(new Animated.Value(0)).current;  // for white page slide
  const bgColorAnim = useRef(new Animated.Value(0)).current; // for background color

  useEffect(() => {
    // Step 1: Bounce logo, then slide, then color change
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 2,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(bgColorAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // After full animation, wait a bit and go to Splash2
      setTimeout(() => {
        navigation?.navigate("Splash2"); // 👈 automatically go to Splash2.js
      }, 500); // slight delay for smoothness
    });
  }, []);

  // Interpolate animations
  const slideY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000],
  });

  const bgColor = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffffff", "#39B54A"], // from white to dark green
  });

  const scale = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar hidden />

      {/* White sliding overlay */}
      <Animated.View
        style={[
          styles.whiteSlide,
          {
            transform: [{ translateY: slideY }],
          },
        ]}
      />

      {/* Logo */}
      <Animated.Image
        source={require("../../assets/Images/order-logo.png")}
        style={[
          styles.logo,
          {
            transform: [{ scale }],
          },
        ]}
      />

      {/* Welcome text */}
      <Animated.Text style={styles.text}>Welcome</Animated.Text>
    </Animated.View>
  );
};

export default Splash1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  text: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  whiteSlide: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    zIndex: 2,
  },
});
