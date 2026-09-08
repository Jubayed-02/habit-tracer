import React, { useContext, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Banner,
  Card,
  IconButton,
  Text,
  useTheme
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CategoryDonutChart from "../components/CategoryDonutChart";
import CompletionRate from "../components/CompletionRate";
import EditProfileModal from "../components/EditProfileModal";
import { HabitsContext, StreakRecord } from "../context/HabitsContext";
import { calculateStreaks } from "../utils/streaks";

export default function ProfileScreen() {
  const theme = useTheme();
  const { habits, streakHistory } = useContext(HabitsContext);
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [avatar, setAvatar] = useState("account-circle");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  // Load profile data from AsyncStorage
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedName = await AsyncStorage.getItem("profileName");
      const savedSubtitle = await AsyncStorage.getItem("profileSubtitle");
      const savedAvatar = await AsyncStorage.getItem("profileAvatar");

      if (savedName) {
        setName(savedName);
      } else {
        setShowWelcomeBanner(true);
      }
      if (savedSubtitle) {
        setSubtitle(savedSubtitle);
      }
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const saveProfile = async (newName: string, newSubtitle: string, newAvatar: string) => {
    try {
      await AsyncStorage.setItem("profileName", newName);
      await AsyncStorage.setItem("profileSubtitle", newSubtitle);
      await AsyncStorage.setItem("profileAvatar", newAvatar);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const { longestStreak, activeStreaks, totalStreaks } =
    calculateStreaks(habits);
  const totalHabits = habits.length;
  const completedToday = habits.filter(
    (h) => h.lastUpdated === new Date().toDateString(),
  ).length;

  // Calculate weekly stats
  const getWeeklyStats = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    let fridayOffset;
    if (dayOfWeek >= 5) {
      fridayOffset = dayOfWeek - 5;
    } else {
      fridayOffset = dayOfWeek + 2;
    }
    
    const friday = new Date(today);
    friday.setDate(today.getDate() - fridayOffset);
    
    let weeklyCompleted = 0;
    let weeklyTotal = 0;
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(friday);
      day.setDate(friday.getDate() + i);
      
      if (day <= today) {
        weeklyTotal += habits.length;
        
        habits.forEach((habit) => {
          const history = habit.completionHistory || [];
          if (history.includes(day.toDateString())) {
            weeklyCompleted += 1;
          }
        });
      }
    }
    
    return { weeklyCompleted, weeklyTotal };
  };

  // Calculate monthly stats
  const getMonthlyStats = () => {
    const today = new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    let monthlyCompleted = 0;
    let monthlyTotal = 0;
    
    const daysInMonth = today.getDate();
    
    for (let i = 0; i < daysInMonth; i++) {
      const day = new Date(firstOfMonth);
      day.setDate(firstOfMonth.getDate() + i);
      
      if (day <= today) {
        monthlyTotal += habits.length;
        
        habits.forEach((habit) => {
          const history = habit.completionHistory || [];
          if (history.includes(day.toDateString())) {
            monthlyCompleted += 1;
          }
        });
      }
    }
    
    return { monthlyCompleted, monthlyTotal };
  };

  const { weeklyCompleted, weeklyTotal } = getWeeklyStats();
  const { monthlyCompleted, monthlyTotal } = getMonthlyStats();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <Banner
          visible={showWelcomeBanner}
          actions={[
            {
              label: "Set Profile",
              onPress: () => {
                setShowWelcomeBanner(false);
                setEditModalVisible(true);
              },
            },
            {
              label: "Later",
              onPress: () => setShowWelcomeBanner(false),
            },
          ]}
          icon="account-star"
        >
          Welcome! Set up your profile to personalize your experience.
        </Banner>
      )}

      <Card.Title
        title={name || "Your Name"}
        subtitle={subtitle || "Tap to set your profile"}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon={avatar}
            style={{ backgroundColor: theme.colors.primary }}
          />
        )}
        right={(props) => (
          <IconButton
            {...props}
            icon="pencil"
            onPress={() => setEditModalVisible(true)}
          />
        )}
      />

      <ScrollView>
        {/* Category Donut Chart */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📊 Habits by Category
            </Text>
            <CategoryDonutChart habits={habits} />
          </Card.Content>
        </Card>

        {/* Completion Rate */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📈 Completion Rate
            </Text>
            <CompletionRate
              dailyCompleted={completedToday}
              dailyTotal={totalHabits}
              weeklyCompleted={weeklyCompleted}
              weeklyTotal={weeklyTotal}
              monthlyCompleted={monthlyCompleted}
              monthlyTotal={monthlyTotal}
            />
          </Card.Content>
        </Card>

        {/* Streak Statistics */}
        <View style={styles.statsContainer}>
          <Text variant="titleMedium" style={styles.statsTitle}>
            Streak Statistics
          </Text>

          <View style={styles.statsRow}>
            <StatCard
              icon="trophy"
              value={longestStreak}
              label="Longest Streak"
            />
            <StatCard
              icon="fire"
              value={activeStreaks}
              label="Active Streaks"
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard icon="star" value={totalStreaks} label="Total Streaks" />
            <StatCard
              icon="check-circle"
              value={completedToday}
              label="Done Today"
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              icon="format-list-bulleted"
              value={totalHabits}
              label="Total Habits"
            />
          </View>
        </View>

        {/* Streak History Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              🏆 Streak History
            </Text>
            
            {streakHistory.length === 0 ? (
              <Text variant="bodyMedium" style={styles.emptyText}>
                No broken streaks yet! Keep going! 💪
              </Text>
            ) : (
              streakHistory.map((record: StreakRecord) => (
                <View key={record.id} style={styles.historyItem}>
                  <View style={styles.historyInfo}>
                    <Text variant="bodyMedium" style={styles.historyName}>
                      {record.habitName}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      Broken on: {record.dateBroken}
                    </Text>
                  </View>
                  <View style={[styles.streakBadge, { backgroundColor: theme.colors.error }]}>
                    <Text style={styles.streakNumber}>{record.streakCount}</Text>
                    <Text style={styles.streakLabel}>days</Text>
                  </View>
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <EditProfileModal
        visible={editModalVisible}
        onDismiss={() => setEditModalVisible(false)}
        currentName={name}
        currentSubtitle={subtitle}
        currentAvatar={avatar}
        onSave={(newName: string, newSubtitle: string, newAvatar: string) => {
          setName(newName);
          setSubtitle(newSubtitle);
          setAvatar(newAvatar);
          saveProfile(newName, newSubtitle, newAvatar);
        }}
      />
    </View>
  );
}

interface StatCardProps {
  icon: string;
  value: number;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  const theme = useTheme();

  return (
    <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.statContent}>
        <IconButton icon={icon} size={24} iconColor={theme.colors.primary} />
        <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
          {value}
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {label}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
  },
  statsContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  statsTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 8,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  historyInfo: {
    flex: 1,
    marginRight: 12,
  },
  historyName: {
    fontWeight: "500",
    marginBottom: 4,
  },
  streakBadge: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  streakLabel: {
    fontSize: 10,
    color: "white",
    opacity: 0.9,
  },
});