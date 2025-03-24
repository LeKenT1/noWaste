// Get the background task handler
const BACKGROUND_TASK = "check-expiring-aliments";
let backgroundTaskHandler;

// Mock Notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
  scheduleNotificationAsync: jest.fn()
}));

// Capture the task handler when it's defined
jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn((taskName, handler) => {
    if (taskName === BACKGROUND_TASK) {
      backgroundTaskHandler = handler;
    }
  }),
  isTaskRegisteredAsync: jest.fn().mockResolvedValue(false)
}));

// Mock BackgroundFetch
jest.mock('expo-background-fetch', () => ({
  registerTaskAsync: jest.fn(),
  BackgroundFetchResult: {
    NewData: 'newData',
    NoData: 'noData',
    Failed: 'failed'
  }
}));

// Mock Realm
jest.mock('realm', () => ({
  open: jest.fn().mockImplementation(() => Promise.resolve({
    objects: jest.fn().mockReturnValue({
      filtered: jest.fn().mockReturnValue([])
    }),
    close: jest.fn()
  }))
}));

// Mock expo-router with Stack component
jest.mock('expo-router', () => ({
  Stack: 'MockedStack'
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children
}));

// Mock expo StatusBar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'MockedStatusBar'
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import RootLayout from './../app/_layout';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import Realm from 'realm';

describe('RootLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    // Use a custom render function that provides the necessary context
    const customRender = (ui) => {
      return render(ui);
    };
    
    // Render the component
    customRender(<RootLayout />);
    
    // Check if Notifications.setNotificationHandler was called
    expect(Notifications.setNotificationHandler).toHaveBeenCalled();
    
    // Check if Notifications.requestPermissionsAsync was called
    expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    
    // Check if TaskManager.isTaskRegisteredAsync was called
    expect(TaskManager.isTaskRegisteredAsync).toHaveBeenCalledWith(BACKGROUND_TASK);
  });

  it('registers background task if not already registered', async () => {
    render(<RootLayout />);
    
    // Wait for the useEffect to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check if BackgroundFetch.registerTaskAsync was called
    expect(BackgroundFetch.registerTaskAsync).toHaveBeenCalledWith(BACKGROUND_TASK, {
      minimumInterval: 60 * 60,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  });

  it('background task schedules notifications for expiring aliments', async () => {
    // Mock Realm to return expiring aliments
    const mockExpiringAliments = [
      { nom: 'Milk', datePeremption: new Date(Date.now() + 3600000) } // Expires in 1 hour
    ];
    
    Realm.open.mockImplementationOnce(() => Promise.resolve({
      objects: jest.fn().mockReturnValue({
        filtered: jest.fn().mockReturnValue(mockExpiringAliments)
      }),
      close: jest.fn()
    }));
    
    // Render the component to ensure the task is defined
    render(<RootLayout />);
    
    // Execute the background task handler
    const result = await backgroundTaskHandler();
    
    // Check if notifications were scheduled
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: "Alerte expiration",
        body: `L'aliment "Milk" va expirer dans moins de 24h`,
        sound: true,
      },
      trigger: null,
    });
    
    // Check if the task returned the correct result
    expect(result).toBe(BackgroundFetch.BackgroundFetchResult.NewData);
  });

  it('background task handles errors gracefully', async () => {
    // Mock Realm to throw an error
    Realm.open.mockRejectedValueOnce(new Error('Test error'));
    
    // Render the component to ensure the task is defined
    render(<RootLayout />);
    
    // Execute the background task handler
    const result = await backgroundTaskHandler();
    
    // Check if the task returned the correct result
    expect(result).toBe(BackgroundFetch.BackgroundFetchResult.Failed);
  });
});