import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestPermissionsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permission not granted for notifications');
      return false;
    }
    return true;
  } else {
    console.log('Must use physical device for notifications');
    return false;
  }
}

export function parseTimeString(time: string): { hour: number; minute: number } | null {
  const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/;
  const match = time.match(timeRegex);
  
  if (!match) {
    console.error('Invalid time format:', time);
    return null;
  }

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3]?.toLowerCase();

  if (period === 'pm' && hour !== 12) {
    hour += 12;
  } else if (period === 'am' && hour === 12) {
    hour = 0;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    console.error('Invalid time values:', { hour, minute });
    return null;
  }

  return { hour, minute };
}

export async function scheduleHabitReminder(habitName: string, time: string, habitId: string) {
  try {
    const parsedTime = parseTimeString(time);
    
    if (!parsedTime) {
      console.error('Cannot schedule notification - invalid time:', time);
      return undefined;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('habits', {
        name: 'Habit Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Habit Reminder',
        body: `Time to complete: ${habitName}`,
        data: { habitId },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: parsedTime.hour,
        minute: parsedTime.minute,
      },
    });

    console.log('Scheduled notification:', identifier);
    return identifier;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return undefined;
  }
}

export async function scheduleLastChanceReminder(habitName: string, habitId: string) {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('last-chance', {
        name: 'Last Chance Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF0000',
      });
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 Last Chance!',
        body: `You haven't completed "${habitName}" today! Complete it before midnight to keep your streak!`,
        data: { habitId, type: 'last-chance' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 23,
        minute: 55,
      },
    });

    console.log('Scheduled last chance notification:', identifier);
    return identifier;
  } catch (error) {
    console.error('Error scheduling last chance notification:', error);
    return undefined;
  }
}

export async function cancelHabitReminder(notificationId: string) {
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}