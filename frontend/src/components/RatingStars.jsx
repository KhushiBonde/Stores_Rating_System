import { useState } from 'react';
import { HiStar } from 'react-icons/hi';

const RatingStars = ({ rating, onRate, readonly = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'stars-sm',
    md: 'stars-md',
    lg: 'stars-lg',
  };

  return (
    <div className={`rating-stars ${sizeClasses[size]} ${readonly ? 'readonly' : 'interactive'}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${
            star <= (hoverRating || rating) ? 'filled' : 'empty'
          }`}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
          id={`star-${star}`}
          title={`${star} star${star > 1 ? 's' : ''}`}
        >
          <HiStar />
        </button>
      ))}
      {rating !== null && rating !== undefined && (
        <span className="rating-value">{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
      )}
    </div>
  );
};

export default RatingStars;
