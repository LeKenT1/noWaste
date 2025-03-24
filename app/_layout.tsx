import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import Realm from 'realm';
import realmConfig from '../database/realmConfig';

const BACKGROUND_TASK = "check-expiring-aliments";

TaskManager.defineTask(BACKGROUND_TASK, async () => {
  try {
    const realm = await Realm.open(realmConfig);
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const expiringAliments = realm
      .objects('Aliment')
      .filtered('datePeremption >= $0 && datePeremption < $1', now, tomorrow);

    for (let aliment of expiringAliments) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Alerte expiration",
          body: `L'aliment "${aliment.nom}" va expirer dans moins de 24h`,
          sound: true,
        },
        trigger: null,
      });
    }

    realm.close();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Error in background task:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

async function registerBackgroundTask() {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK);
  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
      minimumInterval: 60 * 60,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
}

export default function RootLayout() {
  useEffect(() => {
    async function setupNotifications() {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission for notifications is required!');
        return;
      }

      await registerBackgroundTask();
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    }

    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' }
        }}
      />
    </SafeAreaProvider>
  );
}
