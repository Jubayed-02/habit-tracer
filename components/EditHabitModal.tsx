import React, { useState } from "react";
import { StyleSheet, View, Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Button,
  Chip,
  Dialog,
  Modal,
  Portal,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Habit, HabitCategory } from "../context/HabitsContext";

interface EditHabitModalProps {
  visible: boolean;
  habit: Habit | null;
  onDismiss: () => void;
  onSave: (updatedHabit: Habit) => void;
  onDelete: (habitId: string) => void;
}

const CATEGORIES: HabitCategory[] = ["Health", "Study", "Fitness", "Personal", "Work"];

export default function EditHabitModal({
  visible,
  habit,
  onDismiss,
  onSave,
  onDelete,
}: EditHabitModalProps) {
  const theme = useTheme();
  const [habitName, setHabitName] = useState("");
  const [habitTime, setHabitTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [category, setCategory] = useState<HabitCategory>("Personal");
  const [note, setNote] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showDiscardWarning, setShowDiscardWarning] = useState(false);
  const [originalData, setOriginalData] = useState({
    name: "",
    time: "",
    note: "",
    category: "Personal" as HabitCategory,
    enableNotifications: false,
  });

  React.useEffect(() => {
    if (habit) {
      setHabitName(habit.name);
      setHabitTime(habit.time);
      setEnableNotifications(habit.enableNotifications);
      setCategory(habit.category || "Personal");
      setNote(habit.note || "");
      setOriginalData({
        name: habit.name,
        time: habit.time,
        note: habit.note || "",
        category: habit.category || "Personal",
        enableNotifications: habit.enableNotifications,
      });
      
      const [timeStr, period] = habit.time.split(" ");
      const [hours, minutes] = timeStr.split(":").map(Number);
      let hour = hours;
      if (period?.toLowerCase() === "pm" && hours !== 12) hour += 12;
      if (period?.toLowerCase() === "am" && hours === 12) hour = 0;
      
      const date = new Date();
      date.setHours(hour, minutes || 0, 0, 0);
      setSelectedDate(date);
    }
  }, [habit, visible]);

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
    return (
      habitName !== originalData.name ||
      habitTime !== originalData.time ||
      note !== originalData.note ||
      category !== originalData.category ||
      enableNotifications !== originalData.enableNotifications
    );
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

  const handleSave = () => {
    if (habit && habitName.trim() && habitTime) {
      const updatedHabit: Habit = {
        ...habit,
        name: habitName.trim(),
        time: habitTime,
        enableNotifications,
        category,
        note: note.trim(),
      };
      onSave(updatedHabit);
      onDismiss();
    }
  };

  const handleDelete = () => {
    if (habit) {
      onDelete(habit.id);
      setConfirmDelete(false);
      onDismiss();
    }
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
            marginBottom: 100,
          },
        ]}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {!confirmDelete ? (
              <>
                <Text style={[styles.title, { color: theme.colors.primary }]}>
                  Edit Habit
                </Text>

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

                <TextInput
                  label="Note (optional)"
                  value={note}
                  onChangeText={setNote}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="note-text" />}
                  multiline
                  numberOfLines={2}
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

                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => setConfirmDelete(true)}
                    style={[styles.button, styles.deleteButton]}
                    textColor={theme.colors.error}
                    icon="delete"
                  >
                    Delete
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.button}
                    disabled={!habitName.trim() || !habitTime}
                  >
                    Save
                  </Button>
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.title, { color: theme.colors.error }]}>
                  Delete Habit?
                </Text>
                <Text style={styles.confirmText}>
                  Are you sure you want to delete "{habit?.name}"? This action
                  cannot be undone.
                </Text>
                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => setConfirmDelete(false)}
                    style={styles.button}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleDelete}
                    style={[styles.button, { backgroundColor: theme.colors.error }]}
                  >
                    Delete
                  </Button>
                </View>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
    maxHeight: "85%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  deleteButton: {
    borderColor: "#f44336",
  },
  confirmText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
});