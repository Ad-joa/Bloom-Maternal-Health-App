import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return false;
  }
  
  return true;
}

export async function scheduleDailyReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "How are you feeling today? 🌸",
      body: "Take a moment to log your symptoms and track your pregnancy journey.",
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}

export async function scheduleHydrationReminder(hour: number, minute: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to hydrate! 💧",
      body: "Drinking water is essential for you and your baby.",
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}

export async function scheduleMedicationReminder(hour: number, minute: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medication / Vitamin Reminder 💊",
      body: "Don't forget to take your daily vitamins!",
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}
