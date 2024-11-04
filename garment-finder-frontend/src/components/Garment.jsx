import React, { useState } from 'react';
import axios from 'axios';

const Garment = ({garment}) => {
  return (
    <li key={garment.id}>
      <h3>{garment.title}</h3>
      <p>Brand: {garment.brand}</p>
      <p>Price: {garment.price} {garment.currency}</p>
      <p>Discounted Price: {garment.discountedPrice} {garment.currency}</p>
      {garment.imageUrl && <img src={garment.imageUrl} alt={garment.title} style={{ maxWidth: '200px' }} />}
    </li>
  );
}

export default Garment;
