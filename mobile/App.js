import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import LeadsScreen from "./src/screens/LeadsScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <LeadsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f8fb"
  }
});
