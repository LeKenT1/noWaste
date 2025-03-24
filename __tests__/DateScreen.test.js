jest.mock('realm', () => ({
  open: jest.fn(() => Promise.resolve({
    write: jest.fn(cb => cb()),
    create: jest.fn(),
    close: jest.fn()
  }))
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  useLocalSearchParams: () => ({
    foodName: 'Test Food'
  }),
  Link: 'MockedLink'
}));

jest.mock('@react-native-community/datetimepicker', () => 'MockedDateTimePicker');

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DateScreen from './../app/date';
import Realm from 'realm';

const customRender = (ui) => {
  const Wrapper = ({ children }) => {
    const MockedLink = ({ href, asChild, children }) => {
      return React.cloneElement(children, { 
        testID: `link-${href}`,
        onPress: () => {}
      });
    };
    
    return children;
  };
  
  return render(ui, { wrapper: Wrapper });
};

describe('DateScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    Realm.open.mockClear();
  });

  it('renders correctly with food name from params', () => {
    const { getByText } = customRender(<DateScreen />);
    
    expect(getByText('Test Food')).toBeTruthy();
    
    expect(getByText('Sélectionner une date')).toBeTruthy();
  });

  it('shows date picker when button is pressed', () => {
    const { getByText } = customRender(<DateScreen />);
    
    const dateButton = getByText('Sélectionner une date');
    fireEvent.press(dateButton);
    
  });

  it('saves food item to Realm when save button is pressed', async () => {
    const { getByText } = customRender(<DateScreen />);
    
    const saveButton = getByText('Enregistrer');
    fireEvent.press(saveButton);
    
    expect(Realm.open).toHaveBeenCalled();
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(mockPush).toHaveBeenCalledWith('/list');
  });
});