import React, { useState } from "react";
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import {
  Avatar,
  Button,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

interface EditProfileModalProps {
  visible: boolean;
  onDismiss: () => void;
  currentName: string;
  currentSubtitle: string;
  currentAvatar: string;
  onSave: (name: string, subtitle: string, avatar: string) => void;
}

const AVATAR_OPTIONS = [
  "account",
  "account-circle",
  "face-man",
  "face-woman",
  "star",
  "heart",
  "school",
  "briefcase",
  "rocket",
  "cat",
  "dog",
  "bird",
  "flower",
  "food-apple",
  "music",
  "book",
];

export default function EditProfileModal({
  visible,
  onDismiss,
  currentName,
  currentSubtitle,
  currentAvatar,
  onSave,
}: EditProfileModalProps) {
  const theme = useTheme();
  const [tempName, setTempName] = useState(currentName);
  const [tempSubtitle, setTempSubtitle] = useState(currentSubtitle);
  const [tempAvatar, setTempAvatar] = useState(currentAvatar);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
    setTempName(currentName);
    setTempSubtitle(currentSubtitle);
    setTempAvatar(currentAvatar);
  }, [currentName, currentSubtitle, currentAvatar, visible]);

  const handleSave = () => {
    Keyboard.dismiss();
    onSave(tempName, tempSubtitle, tempAvatar);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.container,
          { 
            backgroundColor: theme.colors.surface,
marginBottom: keyboardVisible ? 300 : 20,          },
        ]}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              Edit Profile
            </Text>

            {/* Avatar Preview */}
            <View style={styles.avatarSection}>
              <Avatar.Icon
                icon={tempAvatar}
                size={80}
                style={{ backgroundColor: theme.colors.primary }}
              />
              <Button
                mode="text"
                onPress={() => setShowAvatarPicker(!showAvatarPicker)}
                style={styles.changeAvatarButton}
              >
                {showAvatarPicker ? "Hide Options" : "Change Avatar"}
              </Button>
            </View>

            {/* Avatar Options Grid */}
            {showAvatarPicker && (
              <View style={styles.avatarGrid}>
                {AVATAR_OPTIONS.map((icon) => (
                  <View key={icon} style={styles.avatarOption}>
                    <Avatar.Icon
                      icon={icon}
                      size={48}
                      style={{
                        backgroundColor:
                          tempAvatar === icon
                            ? theme.colors.primary
                            : "#E0E0E0",
                      }}
                      onTouchEnd={() => setTempAvatar(icon)}
                    />
                  </View>
                ))}
              </View>
            )}

            <TextInput
              label="Name"
              value={tempName}
              onChangeText={setTempName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Occupation"
              value={tempSubtitle}
              onChangeText={setTempSubtitle}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="briefcase" />}
              placeholder="e.g., Student, Developer"
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={styles.button}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button}
                disabled={!tempName.trim()}
              >
                Save
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 20,
    borderRadius: 16,
    elevation: 8,
    maxHeight: "85%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  changeAvatarButton: {
    marginTop: 8,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  avatarOption: {
    alignItems: "center",
  },
  input: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});