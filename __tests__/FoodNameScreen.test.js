const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  useLocalSearchParams: () => ({
    scannedData: 'Test Scanned Data'
  }),
  Link: 'MockedLink'
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FoodNameScreen from './../app/food-name';

const customRender = (ui) => {
  const originalRender = render(ui);
  
  return {
    ...originalRender,
  };
};

describe('FoodNameScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders correctly with scanned data', () => {
    const { getByPlaceholderText, getByText } = customRender(<FoodNameScreen />);
    
    const input = getByPlaceholderText('Nom du produit');
    expect(input.props.value).toBe('Test Scanned Data');
    
    expect(getByText('Poulet')).toBeTruthy();
    expect(getByText('Lait')).toBeTruthy();
    expect(getByText('Steack')).toBeTruthy();
  });

  it('updates input when food chip is pressed', () => {
    const { getByPlaceholderText, getByText } = customRender(<FoodNameScreen />);
    
    const input = getByPlaceholderText('Nom du produit');
    const pouletChip = getByText('Poulet');
    
    fireEvent.press(pouletChip);
    
    expect(input.props.value).toBe('Poulet');
  });

  it('navigates to date screen when next button is pressed with valid input', () => {
    const { getByText } = customRender(<FoodNameScreen />);
    
    const nextButton = getByText('Suivant');
    
    fireEvent.press(nextButton);
    
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/date',
      params: { foodName: 'Test Scanned Data' }
    });
  });
});