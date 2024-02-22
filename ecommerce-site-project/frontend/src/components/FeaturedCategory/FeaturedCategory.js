import featuredCategoryStyle from './FeaturedCategory.module.css';
import LoadingBox from '../LoadingBox/LoadingBox';
import { Fragment, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        results: action.payload,
        loading: false,
        error: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function FeaturedCategory(props) {
  const [{ loading, error, results }, dispatch] = useReducer(reducer, {
    results: [],
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
            size: props.size ? props.size : 7,
          },
        });
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: result.data.results,
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
      }
    };
    fetchData();
  }, [props.content, props.route, props.size]);
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <Fragment />
  ) : (
    <section className={featuredCategoryStyle.featuredCategoryOuterContainer}>
      {props.mainTitle && (
        <h2 className={featuredCategoryStyle.featuredCategoryMainTitle}>
          {props.mainTitle}
        </h2>
      )}
      <div
        className={featuredCategoryStyle.featuredCategoryImageOuterContainer}
      >
        {results.map((item, index) => (
          <Link
            to={`/products/?${props.content}=${item[0][props.content]}`}
            key={index}
          >
            <div
              className={
                featuredCategoryStyle.featuredCategoryImageInnerContainer
              }
            >
              <div
                className={featuredCategoryStyle.featuredCategoryImageContainer}
              >
                <div
                  className={featuredCategoryStyle.featuredCategoryImageWrapper}
                >
                  {item[0].image ? (
                    <img
                      className={featuredCategoryStyle.featuredCategoryImage}
                      src={item[0].image}
                      alt={item[0].name}
                    />
                  ) : null}
                </div>
                <div
                  className={featuredCategoryStyle.featuredCategoryImageWrapper}
                >
                  {item[1].image ? (
                    <img
                      className={featuredCategoryStyle.featuredCategoryImage}
                      src={item[1].image}
                      alt={item[1].name}
                    />
                  ) : null}
                </div>
                <div
                  className={featuredCategoryStyle.featuredCategoryImageWrapper}
                >
                  {item[2].image ? (
                    <img
                      className={featuredCategoryStyle.featuredCategoryImage}
                      src={item[2].image}
                      alt={item[2].name}
                    />
                  ) : null}
                </div>
                <div
                  className={featuredCategoryStyle.featuredCategoryImageWrapper}
                >
                  {item[3].image ? (
                    <img
                      className={featuredCategoryStyle.featuredCategoryImage}
                      src={item[3].image}
                      alt={item[3].name}
                    />
                  ) : null}
                </div>
              </div>
              <h3 className={featuredCategoryStyle.featuredCategoryImageTitle}>
                {item[0][props.content]}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCategory;
