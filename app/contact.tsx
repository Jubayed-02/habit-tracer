import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import {
    Appbar,
    Button,
    Card,
    Text,
    TextInput,
    useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactScreen() {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendEmail = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const subject = `Contact from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailto = `mailto:support@yourapp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailto).catch(() => {
      Alert.alert("Error", "No email app found on your device");
    });
  };

  const handleDiscord = () => {
    Linking.openURL("https://discord.gg/your-server");
  };

  const handleTwitter = () => {
    Linking.openURL("https://twitter.com/your-handle");
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
        <Appbar.Content title="Contact Us" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Send us a message
            </Text>

            <TextInput
              label="Your Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Message"
              value={message}
              onChangeText={setMessage}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
              left={<TextInput.Icon icon="message-text" />}
            />

            <Button
              mode="contained"
              onPress={handleSendEmail}
              style={styles.sendButton}
              icon="send"
            >
              Send Message
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Other ways to reach us
            </Text>

            <Button
              mode="outlined"
              onPress={handleDiscord}
              style={styles.socialButton}
              icon="discord"
            >
              Join our Discord
            </Button>

            <Button
              mode="outlined"
              onPress={handleTwitter}
              style={styles.socialButton}
              icon="twitter"
            >
              Follow us on Twitter
            </Button>

            <View style={styles.emailInfo}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                📧 support@yourapp.com
              </Text>
            </View>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 12,
  },
  sendButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  socialButton: {
    marginBottom: 12,
    borderRadius: 8,
  },
  emailInfo: {
    marginTop: 16,
    alignItems: "center",
  },
});
