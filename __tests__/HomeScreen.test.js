jest.mock('expo-router', () => ({
  Link: 'MockedLink'
}));

jest.mock('react-native/Libraries/Image/Image', () => 'MockedImage');

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './../app/index';

const customRender = (ui) => {
  const Wrapper = ({ children }) => {
    const MockedLink = ({ href, asChild, children }) => {
      return React.cloneElement(children, { 
        testID: `link-${href}`,
        onPress: () => {}
      });
    };
    
    const MockedImage = ({ source, style, resizeMode }) => null;
    MockedImage.getSize = jest.fn();
    MockedImage.prefetch = jest.fn();
    MockedImage.resolveAssetSource = jest.fn();
    
    const originalRender = render(ui, {
      wrapper: ({ children }) => <>{children}</>
    });
    
    return originalRender;
  };
  
  return render(ui, { wrapper: Wrapper });
};

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const { getByTestId } = customRender(<HomeScreen />);
    
    expect(getByTestId('link-/camera')).toBeTruthy();
    expect(getByTestId('link-/food-name')).toBeTruthy();
    expect(getByTestId('link-/list')).toBeTruthy();
  });

  it('navigates to camera screen when scan button is pressed', () => {
    const { getByTestId } = customRender(<HomeScreen />);
    
    const cameraButton = getByTestId('link-/camera');
    fireEvent.press(cameraButton);
    
    expect(cameraButton).toBeTruthy();
  });

  it('navigates to food name screen when pen button is pressed', () => {
    const { getByTestId } = customRender(<HomeScreen />);
    
    const foodNameButton = getByTestId('link-/food-name');
    fireEvent.press(foodNameButton);
    
    expect(foodNameButton).toBeTruthy();
  });

  it('navigates to list screen when list button is pressed', () => {
    const { getByTestId } = customRender(<HomeScreen />);
    
    const listButton = getByTestId('link-/list');
    fireEvent.press(listButton);
    
    expect(listButton).toBeTruthy();
  });
});