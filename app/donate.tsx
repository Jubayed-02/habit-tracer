import { router } from "expo-router";
import React from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Card, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DonateScreen() {
  const theme = useTheme();

  const handleDonate = (amount: string) => {
    const donationUrl = `https://www.buymeacoffee.com/your-handle`;
    Linking.openURL(donationUrl).catch(() => {
      Alert.alert("Error", "Could not open donation page");
    });
  };

  const handlePatreon = () => {
    Linking.openURL("https://www.patreon.com/your-handle");
  };

  const handleKoFi = () => {
    Linking.openURL("https://ko-fi.com/your-handle");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <Appbar.Header
        style={[
          styles.appBar,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
        statusBarHeight={0}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Support Us" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.heroCard}>
          <Card.Content style={styles.heroContent}>
            <Text style={styles.heroIcon}>☕</Text>
            <Text variant="headlineSmall" style={styles.heroTitle}>
              Support Our App
            </Text>
            <Text variant="bodyMedium" style={styles.heroText}>
              Help us keep the app running and add new features. Every
              contribution makes a difference! ❤️
            </Text>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          One-time Donation
        </Text>

        <View style={styles.donationGrid}>
          <Card style={styles.donationCard} onPress={() => handleDonate("3")}>
            <Card.Content style={styles.donationContent}>
              <Text variant="headlineMedium">☕</Text>
              <Text variant="titleMedium">$3</Text>
              <Text variant="bodySmall">Buy us a coffee</Text>
            </Card.Content>
          </Card>

          <Card style={styles.donationCard} onPress={() => handleDonate("5")}>
            <Card.Content style={styles.donationContent}>
              <Text variant="headlineMedium">🍕</Text>
              <Text variant="titleMedium">$5</Text>
              <Text variant="bodySmall">Buy us a slice</Text>
            </Card.Content>
          </Card>

          <Card style={styles.donationCard} onPress={() => handleDonate("10")}>
            <Card.Content style={styles.donationContent}>
              <Text variant="headlineMedium">🎉</Text>
              <Text variant="titleMedium">$10</Text>
              <Text variant="bodySmall">Big supporter</Text>
            </Card.Content>
          </Card>
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Monthly Support
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handlePatreon}
              style={styles.platformButton}
              icon="patreon"
              buttonColor="#FF424D"
            >
              Support on Patreon
            </Button>

            <Button
              mode="contained"
              onPress={handleKoFi}
              style={styles.platformButton}
              icon="coffee"
              buttonColor="#FF5E5B"
            >
              Support on Ko-fi
            </Button>
          </Card.Content>
        </Card>

        <Card
          style={[
            styles.thankYouCard,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Card.Content style={styles.thankYouContent}>
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              Thank you for your support! 🙏
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onPrimaryContainer, marginTop: 8 }}
            >
              Every contribution helps us maintain and improve the app.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    elevation: 0,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  heroCard: {
    marginBottom: 24,
    elevation: 4,
  },
  heroContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  heroText: {
    textAlign: "center",
    opacity: 0.8,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },
  donationGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  donationCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  donationContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  platformButton: {
    marginBottom: 12,
    borderRadius: 8,
  },
  thankYouCard: {
    marginBottom: 24,
    elevation: 2,
  },
  thankYouContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
});
