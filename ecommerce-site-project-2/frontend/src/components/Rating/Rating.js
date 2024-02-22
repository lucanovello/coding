import ratingStyle from './Rating.module.css';
import { RiStarFill, RiStarHalfFill, RiStarLine } from 'react-icons/ri';

function Rating(props) {
  const { rating, numReviews } = props;

  return (
    <div className={props.class}>
      <div className={ratingStyle.featuredItemStars}>
        {rating >= 1 ? (
          <RiStarFill />
        ) : rating >= 0.5 ? (
          <RiStarHalfFill />
        ) : (
          <RiStarLine />
        )}
        {rating >= 2 ? (
          <RiStarFill />
        ) : rating >= 1.5 ? (
          <RiStarHalfFill />
        ) : (
          <RiStarLine />
        )}
        {rating >= 3 ? (
          <RiStarFill />
        ) : rating >= 2.5 ? (
          <RiStarHalfFill />
        ) : (
          <RiStarLine />
        )}
        {rating >= 4 ? (
          <RiStarFill />
        ) : rating >= 3.5 ? (
          <RiStarHalfFill />
        ) : (
          <RiStarLine />
        )}
        {rating >= 5 ? (
          <RiStarFill />
        ) : rating >= 4.5 ? (
          <RiStarHalfFill />
        ) : (
          <RiStarLine />
        )}
      </div>
      <div className={ratingStyle.featuredItemNumReviews}>
        {props.numReviews && `(${numReviews})`}
      </div>
    </div>
  );
}

export default Rating;
