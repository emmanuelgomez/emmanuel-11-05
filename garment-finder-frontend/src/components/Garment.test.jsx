import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Garment from './Garment';

describe('Garment Component', () => {
  test('renders garment', () => {
    const mockGarment = {
        id: '1',
        title: 'Blue T-shirt',
        brand: 'TestBrand',
        price: 20,
        discountedPrice: 18,
        currency: 'USD',
        imageUrl: 'http://example.com/image.jpg'
      }
    
    render(<Garment garment={mockGarment}/>);
    expect(screen.getByText(mockGarment.title)).toBeInTheDocument();
    expect(screen.getByText(`Brand: ${mockGarment.brand}`)).toBeInTheDocument();
    expect(screen.getByText(`Price: ${mockGarment.price} ${mockGarment.currency}`)).toBeInTheDocument();
    expect(screen.getByText(`Discounted Price: ${mockGarment.discountedPrice} ${mockGarment.currency}`)).toBeInTheDocument();
    expect(screen.getByAltText('Blue T-shirt')).toHaveAttribute('src', 'http://example.com/image.jpg');

  });
});
