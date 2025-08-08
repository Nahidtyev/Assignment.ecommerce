import React, { useState } from 'react';
import './ProductCard.css';

export default function ProductCard({
  imageUrl,
  name,
  price,
  variants = [],
  inStock = true,
  onAddToCart = () => {}
}) {
  const [selectedVariant, setSelectedVariant] = useState(
    variants.length > 0 ? variants[0] : null
  );

  const handleVariantChange = (e) => {
    const variant = variants.find(v => v.id === e.target.value);
    setSelectedVariant(variant);
  };

  const handleAdd = () => {
    if (!inStock) return;
    onAddToCart({ name, price, variant: selectedVariant });
  };

  return (
    <div className="product-card">
      <img
        src={imageUrl}
        alt={name}
      />
      <div className="product-details">
        <h2>{name}</h2>
        <p className="price">${price.toFixed(2)}</p>

        {variants.length > 0 && (
          <select value={selectedVariant?.id || ''} onChange={handleVariantChange}>
            {variants.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        )}

        {inStock ? (
          <button className="btn btn-primary" onClick={handleAdd}>
            Add to Cart
          </button>
        ) : (
          <button className="btn btn-disabled" disabled />
        )}
      </div>
    </div>
  );
}
