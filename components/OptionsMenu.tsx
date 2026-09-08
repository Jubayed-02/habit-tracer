import { router } from "expo-router";
import React, { useState } from "react";
import { BackHandler } from "react-native";
import { Appbar, Menu } from "react-native-paper";

export default function OptionsMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleContact = () => {
    setMenuVisible(false);
    router.push("/contact");
  };

  const handleDonate = () => {
    setMenuVisible(false);
    router.push("/donate");
  };

  const handleManual = () => {
    setMenuVisible(false);
    router.push("/manual");
  };

  const handleExit = () => {
    setMenuVisible(false);
    try {
      BackHandler.exitApp();
    } catch (error) {
      console.log("Exit not supported on this platform");
    }
  };

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => setMenuVisible(true)}
        />
      }
      anchorPosition="bottom"
    >
      <Menu.Item
        onPress={handleManual}
        title="Help"
        leadingIcon="help-circle-outline"
      />
      <Menu.Item
        onPress={handleContact}
        title="Contact"
        leadingIcon="email-outline"
      />
      <Menu.Item
        onPress={handleDonate}
        title="Donate"
        leadingIcon="heart-outline"
      />
      <Menu.Item onPress={handleExit} title="Exit" leadingIcon="exit-to-app" />
    </Menu>
  );
}