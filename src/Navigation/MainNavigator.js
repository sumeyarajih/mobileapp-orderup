import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import screens - Make sure this path is correct
import NotificationScreen from "../Screens/notification";

// Import other screens
import Splash1 from "../Screens/Splash/Splash1";
import Splash2 from "../Screens/Splash/Splash2";
import Homepage from "../Screens/HomePage";
import Cart from "../Screens/Cart";
import Profile from "../Screens/Profile";
import foodDetails from "../foodDetails"; 
import PaymentPage from "../payment/PaymentPage"; 
import AuthScreen from "../auth/AuthScreen";
import ForgotPasswordScreen from "../auth/ForgotPasswordScreen";
import OTPScreen from "../auth/OTPScreen";

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash1"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash1" component={Splash1} />
        <Stack.Screen name="Splash2" component={Splash2} />
        <Stack.Screen name="HomePage" component={Homepage} />
        <Stack.Screen name="foodDetails" component={foodDetails} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen 
          name="Notification" 
          component={NotificationScreen}
        />
        <Stack.Screen name="PaymentPage" component={PaymentPage} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;