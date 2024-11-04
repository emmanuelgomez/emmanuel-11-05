import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Garment Search heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Garment Search/i);
  expect(headingElement).toBeInTheDocument();
});