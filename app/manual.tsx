import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Appbar,
  Card,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManualScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <Appbar.Header
        style={[
          styles.appBar,
          { backgroundColor: theme.colors.surface },
        ]}
        statusBarHeight={0}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="How to Use" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              ➕ Adding a Habit
            </Text>
            <Text variant="bodyMedium" style={styles.text}>
              Tap the "+" button at the bottom right. Enter a name, choose a
              time, and set a daily reminder if you want. Tap the arrow to
              continue, then select a category and add an optional note.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              ✅ Completing a Habit
            </Text>
            <Text variant="bodyMedium" style={styles.text}>
              Tap the "Complete" button on any habit card. The streak will
              increase. You have 4 seconds to undo if you tapped by mistake.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              ✏️ Editing or Deleting
            </Text>
            <Text variant="bodyMedium" style={styles.text}>
              Long press on any habit card to open the edit menu. You can
              change the name, time, category, note, or delete the habit.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📊 Weekly Progress
            </Text>
            <Text variant="bodyMedium" style={styles.text}>
              Each habit card shows 7 circles representing the week (Friday to
              Thursday). Green means completed, gray means missed, outlined
              means today, and colored means future day.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              🔥 Streaks
            </Text>
            <Text variant="bodyMedium" style={styles.text}>
              Complete a habit on consecutive days to build a streak. If you
              miss a day, the streak breaks and is saved in the Profile tab
              under "Streak History".
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              🔔 Notifications
            </Text>
            <Text variant="bodyMedium" style={styles.text}>
              When you enable notifications, you'll get a reminder at your
              chosen time. If you haven't completed the habit by 11:55 PM,
              you'll get a "last chance" notification.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📈 Statistics
            </Text>
            <Text variant="bodyMedium" style={styles.text}>
              In the Profile tab, you can see your habits by category, daily,
              weekly, and monthly completion rates, and your streak history.
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
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    lineHeight: 22,
  },
});