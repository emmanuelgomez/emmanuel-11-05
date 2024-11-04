import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import GarmentSearch from './GarmentSearch';

// Mock axios
jest.mock('axios');
jest.mock('./Garment', () => () => <div>GarmentMocked</div>);


describe('GarmentSearch Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
      });
   
      afterEach(() => {
        console.error.mockRestore();
      });

  test('renders search input and button', () => {
    render(<GarmentSearch />);
    expect(screen.getByPlaceholderText('Search for garments...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('handles search submission', async () => {
    const mockGarments = [
      {
        id: '1',
        title: 'Blue T-shirt',
        brand: 'TestBrand',
        price: 20,
        discountedPrice: 18,
        currency: 'USD',
        imageUrl: 'http://example.com/image.jpg'
      }
    ];

    axios.get.mockResolvedValueOnce({ data: mockGarments });

    render(<GarmentSearch />);

    const input = screen.getByPlaceholderText('Search for garments...');
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.type(input, 'blue shirt');
    await userEvent.click(button);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/garments/search?query=blue shirt`);
      expect(screen.getByText('GarmentMocked')).toBeInTheDocument();
    });
  });

  test('handles error during search', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<GarmentSearch />);

    const input = screen.getByPlaceholderText('Search for garments...');
    const button = screen.getByRole('button', { name: /search/i });

    userEvent.type(input, 'error test');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('An error occurred while searching for garments.')).toBeInTheDocument();
    });
  });

  test('displays "No results found" when search returns empty array', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<GarmentSearch />);

    const input = screen.getByPlaceholderText('Search for garments...');
    const button = screen.getByRole('button', { name: /search/i });

    userEvent.type(input, 'nonexistent item');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('No results found.')).toBeInTheDocument();
    });
  });
});
