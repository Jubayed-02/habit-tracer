import React, { useState } from "react";
import { StyleSheet, View, Platform, Keyboard } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Button,
  Chip,
  Dialog,
  IconButton,
  Modal,
  Portal,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { HabitCategory } from "../context/HabitsContext";

interface AddHabitModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAdd: (habit: {
    name: string;
    time: string;
    enableNotifications: boolean;
    category: HabitCategory;
    note: string;
  }) => void;
}

const CATEGORIES: HabitCategory[] = ["Health", "Study", "Fitness", "Personal", "Work"];

export default function AddHabitModal({
  visible,
  onDismiss,
  onAdd,
}: AddHabitModalProps) {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const [habitName, setHabitName] = useState("");
  const [habitTime, setHabitTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [category, setCategory] = useState<HabitCategory>("Personal");
  const [note, setNote] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showDiscardWarning, setShowDiscardWarning] = useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  React.useEffect(() => {
    if (visible) {
      setStep(1);
      setHabitName("");
      setHabitTime("");
      setEnableNotifications(false);
      setCategory("Personal");
      setNote("");
    }
  }, [visible]);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      setHabitTime(formatTime(date));
    }
  };

  const hasUnsavedChanges = () => {
    return habitName.trim() !== "" || habitTime !== "" || note.trim() !== "" || enableNotifications;
  };

  const handleDismiss = () => {
    if (hasUnsavedChanges()) {
      setShowDiscardWarning(true);
    } else {
      onDismiss();
    }
  };

  const handleDiscard = () => {
    setShowDiscardWarning(false);
    onDismiss();
  };

  const handleNext = () => {
    Keyboard.dismiss();
    if (habitName.trim() && habitTime) {
      setStep(2);
    }
  };

  const handleAdd = () => {
    Keyboard.dismiss();
    if (habitName.trim() && habitTime) {
      onAdd({
        name: habitName.trim(),
        time: habitTime,
        enableNotifications,
        category,
        note: note.trim(),
      });
      onDismiss();
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            marginBottom: keyboardVisible ? 120 : 20,
          },
        ]}
      >
        {step === 1 && (
          <View>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.primary }]}>
                Add New Habit
              </Text>
              <IconButton
                icon="arrow-right"
                size={28}
                iconColor="white"
                style={[
                  styles.checkButton,
                  { backgroundColor: theme.colors.primary },
                  (!habitName.trim() || !habitTime) && { opacity: 0.4 },
                ]}
                onPress={handleNext}
                disabled={!habitName.trim() || !habitTime}
              />
            </View>

            <TextInput
              label="Habit name"
              value={habitName}
              onChangeText={setHabitName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="pencil" />}
            />

            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(true)}
              style={styles.timeButton}
              icon="clock-outline"
            >
              {habitTime || "Select Time"}
            </Button>

            {showTimePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="time"
                is24Hour={false}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleTimeChange}
              />
            )}

            <View style={styles.notificationRow}>
              <View style={styles.notificationInfo}>
                <Text variant="bodyMedium">Daily reminder</Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Get notified at this time
                </Text>
              </View>
              <Switch
                value={enableNotifications}
                onValueChange={setEnableNotifications}
              />
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <View style={styles.header}>
              <IconButton
                icon="arrow-left"
                size={24}
                onPress={handleBack}
                style={styles.backButton}
              />
              <Text style={[styles.title, { color: theme.colors.primary }]}>
                Details
              </Text>
              <IconButton
                icon="check"
                size={28}
                iconColor="white"
                style={[
                  styles.checkButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={handleAdd}
              />
            </View>

            <TextInput
              label="Note (optional)"
              value={note}
              onChangeText={setNote}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="note-text" />}
              multiline
              numberOfLines={3}
            />

            <Text variant="bodyMedium" style={styles.categoryLabel}>
              Category
            </Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.chip,
                    category === cat && { backgroundColor: theme.colors.primary },
                  ]}
                  textStyle={category === cat ? { color: "white", fontWeight: "bold" } : {}}
                  showSelectedCheck={false}
                >
                  {cat}
                </Chip>
              ))}
            </View>
          </View>
        )}
      </Modal>

      {/* Discard Warning Dialog */}
      <Dialog visible={showDiscardWarning} onDismiss={() => setShowDiscardWarning(false)}>
        <Dialog.Title>Discard changes?</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            You have unsaved changes. Do you want to discard them?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowDiscardWarning(false)}>Keep Editing</Button>
          <Button onPress={handleDiscard} textColor={theme.colors.error}>
            Discard
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    margin: 20,
    borderRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  checkButton: {
    margin: 0,
  },
  backButton: {
    margin: 0,
  },
  input: {
    marginBottom: 16,
  },
  categoryLabel: {
    marginBottom: 8,
    fontWeight: "500",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginBottom: 4,
  },
  timeButton: {
    marginBottom: 16,
    borderRadius: 8,
    paddingVertical: 6,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 8,
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
});