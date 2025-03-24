import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

// Comprehensive Realm mock
jest.mock('realm', () => {
  const createMockRealm = () => {
    const mockItems = [
      {
        id: '1',
        nom: 'Milk',
        datePeremption: new Date(Date.now() - 86400000)
      },
      {
        id: '2',
        nom: 'Eggs', 
        datePeremption: new Date(Date.now() + 86400000)
      }
    ];

    return {
      open: jest.fn().mockImplementation(() => 
        Promise.resolve({
          objects: jest.fn().mockReturnValue({
            [Symbol.iterator]: function* () {
              yield* mockItems;
            },
            addListener: jest.fn((callback) => {
              callback(mockItems);
              return { remove: jest.fn() };
            })
          }),
          objectForPrimaryKey: jest.fn().mockReturnValue(mockItems[0]),
          write: jest.fn(callback => callback()),
          delete: jest.fn(),
          removeAllListeners: jest.fn(),
          close: jest.fn(),
          isClosed: false,
          addListener: jest.fn((event, callback) => {
            callback();
            return { remove: jest.fn() };
          })
        })
      )
    };
  };

  return createMockRealm();
});

// Mock expo-router
jest.mock('expo-router', () => ({
  Link: jest.fn(({ children }) => children)
}));

// Import the component to test
import ListScreen from '../app/list';

describe('ListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.skip('renders correctly with items from Realm', async () => {
    let renderResult;

    await act(async () => {
      renderResult = render(<ListScreen />);
    });

    const { getByText } = renderResult;

    expect(getByText('Date passée :')).toBeTruthy();
    expect(getByText('Date à venir :')).toBeTruthy();
    expect(getByText('Menu')).toBeTruthy();
    expect(getByText('Milk')).toBeTruthy();
    expect(getByText('Eggs')).toBeTruthy();
  });

  it.skip('deletes an item when delete button is pressed', async () => {
    let renderResult;

    await act(async () => {
      renderResult = render(<ListScreen />);
    });

    const { getAllByText } = renderResult;

    const deleteButtons = getAllByText('X');
    expect(deleteButtons.length).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.press(deleteButtons[0]);
    });
  });
});