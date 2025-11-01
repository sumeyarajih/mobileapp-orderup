import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

const BottomNavbar = ({ navigation, currentRoute }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const animValues = useRef(
    Array(3)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  // Map route names to indexes
  const routeToIndex = {
    HomePage: 0,
    Cart: 1,
    Profile: 2,
  };

  useEffect(() => {
    const index = routeToIndex[currentRoute];
    if (index !== undefined && index !== activeIndex) {
      setActiveIndex(index);
      animateIcon(index);
    }
  }, [currentRoute]);

  const animateIcon = (index) => {
    animValues.forEach((val) => {
      Animated.spring(val, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }).start();
    });

    Animated.sequence([
      Animated.spring(animValues[index], {
        toValue: -15,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(animValues[index], {
        toValue: -10,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = (index, route) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
    animateIcon(index);

    if (navigation && route) {
      navigation.navigate(route);
    }
  };

  const icons = [
    { name: "home", route: "HomePage" },
    { name: "shopping-cart", route: "Cart" },
    { name: "user", route: "Profile" },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {icons.map((icon, index) => {
          const isActive = activeIndex === index;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => handlePress(index, icon.route)}
              style={styles.touchable}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    transform: [{ translateY: animValues[index] }],
                    backgroundColor: isActive ? "#39B54A" : "transparent",
                  },
                ]}
              >
                <Icon
                  name={icon.name}
                  size={26}
                  color={isActive ? "#fff" : "#555"}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: width,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 6,
    overflow: "hidden",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
  },
  touchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BottomNavbar;
