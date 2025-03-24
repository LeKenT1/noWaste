import { fetchProductData } from '@/services/openFoodFacts';

// Mock global fetch
global.fetch = jest.fn();

describe('OpenFoodFacts Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it.skip('returns product name when API call is successful', async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        product: {
          product_name: 'Test Product'
        }
      })
    });

    const result = await fetchProductData('1234567890123');
    
    // Check if fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith(
      'https://world.openfoodfacts.org/api/v0/product/1234567890123.json'
    );
    
    // Check if the function returns the product name
    expect(result).toBe('Test Product');
  });

  it('returns null when API call fails', async () => {
    // Mock failed API response
    fetch.mockResolvedValueOnce({
      ok: false
    });

    const result = await fetchProductData('invalid-barcode');
    
    // Check if the function returns null
    expect(result).toBe(null);
  });

  it('returns null when product is not found', async () => {
    // Mock API response with no product
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        status: 0,
        product: null
      })
    });

    const result = await fetchProductData('1234567890123');
    
    // Check if the function returns null
    expect(result).toBe(null);
  });

  it('handles errors during API call', async () => {
    // Mock fetch throwing an error
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchProductData('1234567890123');
    
    // Check if the function returns null on error
    expect(result).toBe(null);
  });
});