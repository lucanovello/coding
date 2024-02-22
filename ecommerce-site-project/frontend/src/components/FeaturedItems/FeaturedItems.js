import featuredItems from './FeaturedItems.module.css';
import Product from '../Product/Product';
import LoadingBox from '../LoadingBox/LoadingBox';
import { Fragment, useEffect, useReducer } from 'react';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function FeaturedItems(props) {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(props.route, {
          params: {
            content: props.content,
          },
        });

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: result.data.featuredItems,
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
      }
    };
    fetchData();
  }, [props.location, props.content, props.route]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <Fragment />
  ) : (
    <section className={featuredItems.featuredItemsOuterContainer}>
      {props.mainTitle && (
        <h2 className={featuredItems.featuredItemsMainTitle}>
          {props.mainTitle}
        </h2>
      )}

      <div className={featuredItems.featuredItemsInnerContainer}>
        {products.map((product) => (
          <Product product={product} key={product._id}></Product>
        ))}
      </div>
    </section>
  );
}

export default FeaturedItems;
