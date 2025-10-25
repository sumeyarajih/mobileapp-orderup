// App.tsx
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigator from "./src/Navigation/MainNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <MainNavigator />
    </SafeAreaProvider>
  );
}
