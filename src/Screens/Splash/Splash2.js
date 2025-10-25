import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Splash2 = ({ navigation }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const currentIndex = useRef(0);

  // Slide-in animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  // Auto-scroll images
  useEffect(() => {
    const totalImages = 3;
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % totalImages;
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: currentIndex.current * width,
          animated: true,
        });
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.3, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.View style={[styles.content, { transform: [{ translateY }] }]}>
        {/* Image Carousel */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Image
            source={require("../../assets/Images/salad.png")}
            style={styles.image}
          />
          <Image
            source={require("../../assets/Images/burger.png")}
            style={styles.image}
          />
          <Image
            source={require("../../assets/Images/pizza.png")}
            style={styles.image}
          />
        </ScrollView>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Fast delivery at{"\n"}your doorstep</Text>
          <Text style={styles.subtitle}>
            Home delivery and online reservation system{"\n"}for restaurants & cafés
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Auth")}
        >
          <Text style={styles.buttonText}>Let’s Explore</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Splash2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#39B54A",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.05,
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    resizeMode: "cover",
    marginHorizontal: (width - width * 0.5) / 2,
  },
  textContainer: {
    alignItems: "center",
    marginTop: height * 0.03, // small gap between image and text
    marginBottom: height * 0.06, // less gap before button
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: height * 0.015,
  },
  subtitle: {
    fontSize: width * 0.035,
    color: "#F5F5F5",
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.25,
    marginBottom: height * 0.05,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#39B54A",
    fontSize: width * 0.045,
    fontWeight: "700",
  },
});

