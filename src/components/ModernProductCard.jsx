import  { useState } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";
import { ShoppingCart, Heart, Star, Package, Eye } from 'lucide-react';
import { Link } from "react-router-dom";


import "react-loading-skeleton/dist/skeleton.css";

// Modern Product Card Component using Bootstrap
const ModernProductCard = ({ product, onAddToCart, onViewProduct }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Generate mock variants based on product category
  const generateVariants = (category) => {
    if (category === "men's clothing" || category === "women's clothing") {
      return [
        { id: 1, name: "S", available: true, stock: Math.floor(Math.random() * 20) + 1 },
        { id: 2, name: "M", available: true, stock: Math.floor(Math.random() * 15) + 1 },
        { id: 3, name: "L", available: Math.random() > 0.3, stock: Math.floor(Math.random() * 10) },
        { id: 4, name: "XL", available: Math.random() > 0.5, stock: Math.floor(Math.random() * 8) }
      ];
    } else if (category === "jewelery") {
      return [
        { id: 1, name: "Gold", available: true, stock: Math.floor(Math.random() * 5) + 1 },
        { id: 2, name: "Silver", available: Math.random() > 0.2, stock: Math.floor(Math.random() * 8) }
      ];
    } else if (category === "electronics") {
      return [
        { id: 1, name: "Black", available: true, stock: Math.floor(Math.random() * 12) + 1 },
        { id: 2, name: "White", available: Math.random() > 0.4, stock: Math.floor(Math.random() * 6) }
      ];
    }
    return [];
  };

  const variants = generateVariants(product.category);
  const [selectedVariant, setSelectedVariant] = useState(
    variants.find(v => v.available) || variants[0] || null
  );

  const isOutOfStock = variants.length > 0 && selectedVariant && !selectedVariant.available;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      onAddToCart(product);
    }
  };

  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    overflow: 'hidden'
  };

  const imageContainerStyle = {
    position: 'relative',
    aspectRatio: '1',
    overflow: 'hidden',
    backgroundColor: '#f8f9fa'
  };

  const overlayStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    opacity: 0,
    transition: 'opacity 0.2s ease'
  };

  const badgeStyle = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '500'
  };

  return (
    <div 
      className="card h-100 border-0"
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        const overlay = e.currentTarget.querySelector('.hover-overlay');
        if (overlay) overlay.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        const overlay = e.currentTarget.querySelector('.hover-overlay');
        if (overlay) overlay.style.opacity = '0';
      }}
    >
      {/* Image Container */}
      <div style={imageContainerStyle}>
        {!imageLoaded && (
          <div 
            className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: '#e9ecef' }}
          >
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <img
          src={product.image}
          alt={product.title}
          className="w-100 h-100 p-3"
          style={{ 
            objectFit: 'contain',
            transition: 'transform 0.5s ease',
            opacity: imageLoaded ? 1 : 0
          }}
          onLoad={() => setImageLoaded(true)}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        
        {/* Overlay Elements */}
        <div className="hover-overlay" style={overlayStyle}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className={`btn btn-sm rounded-circle ${
              isWishlisted ? 'btn-danger' : 'btn-light'
            }`}
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            <Heart className={`${isWishlisted ? 'text-white' : 'text-secondary'}`} size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewProduct(product.id);
            }}
            className="btn btn-light btn-sm rounded-circle"
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            <Eye className="text-secondary" size={16} />
          </button>
        </div>

        {/* Stock Status Badge */}
        {isOutOfStock && (
          <div style={badgeStyle}>
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="card-body d-flex flex-column">
        {/* Category */}
        <small className="text-primary text-uppercase fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
          {product.category}
        </small>

        {/* Title */}
        <h6 className="card-title fw-semibold text-dark mb-2" style={{ 
          minHeight: '2.5rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.title}
        </h6>

        {/* Description */}
        <p className="card-text text-muted small mb-3" style={{ 
          minHeight: '2rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          fontSize: '0.85rem'
        }}>
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="d-flex align-items-center mb-3">
            <div className="d-flex align-items-center me-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={star <= Math.floor(product.rating.rate) ? 'text-warning' : 'text-light'}
                  size={14}
                  fill={star <= Math.floor(product.rating.rate) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <small className="text-muted">
              ({product.rating.count || Math.floor(Math.random() * 200) + 10})
            </small>
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          <span className="h5 fw-bold text-dark">
            ${product.price}
          </span>
        </div>

        {/* Variants Dropdown */}
        {variants.length > 0 && (
          <div className="mb-3">
            <label className="form-label small fw-medium text-dark">
              {product.category.includes('clothing') ? 'Size' : 'Options'}
            </label>
            <select
              value={selectedVariant?.id || ''}
              onChange={(e) => {
                const variant = variants.find(v => v.id === parseInt(e.target.value));
                setSelectedVariant(variant);
              }}
              className="form-select form-select-sm"
            >
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id} disabled={!variant.available}>
                  {variant.name} {!variant.available ? '(Out of Stock)' : variant.stock > 0 ? `(${variant.stock} left)` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex gap-2 mt-auto">
          <Link
            to={`/product/${product.id}`}
            className="btn btn-outline-secondary btn-sm flex-fill"
            style={{ fontSize: '0.85rem' }}
          >
            Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 ${
              isOutOfStock ? 'btn-secondary' : 'btn-dark'
            }`}
            style={{ fontSize: '0.85rem' }}
          >
            <ShoppingCart size={16} />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};


export default ModernProductCard;