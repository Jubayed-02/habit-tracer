import React, { useState } from "react";
import { StyleSheet, StatusBar } from "react-native";
import {
  Appbar,
  BottomNavigation,
  Surface,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import OptionsMenu from "../components/OptionsMenu";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";

export default function Index() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    profile: ProfileScreen,
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      
      <Surface style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Appbar.Header
          style={[
            styles.appBar,
            { backgroundColor: theme.colors.surface },
          ]}
          statusBarHeight={0}
        >
          <Appbar.Content title="☕" />
          <OptionsMenu />
        </Appbar.Header>

        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={{ backgroundColor: theme.colors.surface }}
        />
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
  },
  appBar: {
    elevation: 0,
  },
});