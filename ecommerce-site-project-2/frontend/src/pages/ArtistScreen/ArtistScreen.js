import axios from 'axios';
import React, { Fragment, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import ErrorBox from '../../components/ErrorBox/ErrorBox';
import FeaturedItems from '../../components/FeaturedItems/FeaturedItems';
import LoadingBox from '../../components/LoadingBox/LoadingBox';
import Product from '../../components/Product/Product';
import { getError } from '../../utils';
import artistScreenStyle from './ArtistScreen.module.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        artistResult: action.payload.artist,
        loading: false,
        error: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ArtistScreen(props) {
  const [{ loading, error, artistResult }, dispatch] = useReducer(reducer, {
    artistResult: [],
    loading: true,
    error: '',
  });

  const params = useParams();
  const { artist } = params;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/artists/${artist}`);

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: result.data,
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [artist]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <ErrorBox error={error} />
  ) : (
    <div className={artistScreenStyle.artistScreenResultsContainer}>
      <Helmet>
        <title>{props.headerTitle ? props.headerTitle : 'Artist Page'}</title>
      </Helmet>

      {/* RESULTS INNER SECTION */}
      <div className={artistScreenStyle.artistScreenResultsInnerContainer}>
        <div className={artistScreenStyle.artistScreenResultsText}>
          <h1 className={artistScreenStyle.artistScreenResultsTitle}>
            {artist.replace('_', ' ')}
          </h1>
          <p className={artistScreenStyle.artistScreenResultsDescription}>
            {artistResult[0].description}
          </p>
        </div>
        <div className={artistScreenStyle.productWrapper}>
          {artistResult.map((product) => (
            <Product product={product} key={product._id}></Product>
          ))}
        </div>
      </div>

      <FeaturedItems
        mainTitle={`More Related Items`}
        content={artistResult[0].category}
        route="/api/featuredItems/category"
      />
    </div>
  );
}

export default ArtistScreen;
