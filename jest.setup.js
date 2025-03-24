import 'react-native-gesture-handler/jestSetup';
import { NativeModules } from 'react-native';

// Mock the Realm module
jest.mock('realm', () => {
  const mockRealm = {
    open: jest.fn().mockResolvedValue({
      objects: jest.fn().mockReturnValue({
        filtered: jest.fn().mockReturnThis(),
        addListener: jest.fn(),
      }),
      write: jest.fn(callback => callback()),
      create: jest.fn(),
      objectForPrimaryKey: jest.fn(),
      delete: jest.fn(),
      close: jest.fn(),
      isClosed: false
    })
  };
  return mockRealm;
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
  useLocalSearchParams: jest.fn().mockReturnValue({}),
  Link: 'Link',
}));

// Mock expo-camera
jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  CameraType: {
    back: 'back',
    front: 'front'
  },
  useCameraPermissions: jest.fn().mockReturnValue([
    { granted: true },
    jest.fn()
  ]),
}));

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Mock uuid
jest.mock('react-native-uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid')
}));

// Mock notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
  scheduleNotificationAsync: jest.fn(),
}));

// Mock TaskManager 
jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
  isTaskRegisteredAsync: jest.fn().mockResolvedValue(false),
}));

// Mock BackgroundFetch
jest.mock('expo-background-fetch', () => ({
  registerTaskAsync: jest.fn(),
  BackgroundFetchResult: {
    NewData: 'newData',
    NoData: 'noData',
    Failed: 'failed',
  },
}));

// Mock the fetch function for OpenFoodFacts API
global.fetch = jest.fn();

// Mock Alert
NativeModules.AlertManager = {
  alertWithArgs: jest.fn(),
};