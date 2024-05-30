import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Image, Money } from '@shopify/hydrogen';
import { AddToCartButton } from './AddToCartButton';

function QuantitySelector({ product }) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
  const handleChange = (e) => setQuantity(parseInt(e.target.value) || 1);

  const handleAddToCart = () => {
    toast(
      <div className={`addedToCart ${product.description.split(", ")[0].split('- ')[1].slice(0, 5).toLowerCase()}`}>
        <Image
          data={product.images.nodes[0]}
          aspectRatio="1/1"
          sizes="(min-width: 45em) 20vw, 50vw"
          style={{ pointerEvents: 'none' }}
        />
        <div className="addedToCartInfo">
          <p className="addedText">{quantity} Product(s) Added to cart</p>
          <p className="title">{product.title}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="quantity-selector">
      <button className="quantity-button" onClick={handleDecrease}>-</button>
      <input
        type="number"
        value={quantity}
        onChange={handleChange}
        min="1"
        className="quantity-input"
      />
      <button className="quantity-button" onClick={handleIncrease}>+</button>

      <AddToCartButton
        lines={[
          {
            merchandiseId: product.variants.nodes[0].id,
            quantity: quantity,
          },
        ]}
        onClick={handleAddToCart}
      >
        Add to Cart
      </AddToCartButton>
    </div>
  );
}

export default QuantitySelector;
