import axios from 'axios';
import React, { Fragment, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import ErrorBox from '../../components/ErrorBox/ErrorBox';
import FeaturedItems from '../../components/FeaturedItems/FeaturedItems';
import LoadingBox from '../../components/LoadingBox/LoadingBox';
import Product from '../../components/Product/Product';
import { getError } from '../../utils';
import productsScreenStyle from './ProductsScreen.module.css';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                artists: action.payload.artist,
                categories: action.payload.category,
                nationalities: action.payload.nationality,
                loading: false,
                error: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

function ProductsScreen(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [{ loading, error, products, artists, categories, nationalities }, dispatch] = useReducer(
        reducer,
        {
            products: [],
            artists: [],
            categories: [],
            nationalities: [],
            loading: true,
            error: '',
        }
    );
    const [currentQuery, setCurrentQuery] = useState([]);
    const [currentTitle, setCurrentTitle] = useState('All');
    const [currentSort, setCurrentSort] = useState(
        searchParams.get('sort') === 'isFeatured' ||
            searchParams.get('sort') === 'name' ||
            searchParams.get('sort') === 'artist' ||
            searchParams.get('sort') === 'category' ||
            searchParams.get('sort') === 'year' ||
            searchParams.get('sort') === 'rating' ||
            searchParams.get('sort') === 'price'
            ? searchParams.get('sort')
            : 'isFeatured'
    );

    const queryParams = {
        artist: searchParams.get('artist') ? searchParams.get('artist').toLowerCase() : '',
        genre: searchParams.get('genre') ? searchParams.get('genre').toLowerCase() : '',
        nationality: searchParams.get('nationality')
            ? searchParams.get('nationality').toLowerCase()
            : '',
    };
    const sortParams = searchParams.get('sort');

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/api/products/all`);
                setCurrentQuery(result.data.products);
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: result.data,
                });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const finalQuery = {};

        const getResults = (key, value) => {
            const getResultsArr = [];
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                if (product[key].toLowerCase() === value.toLowerCase()) getResultsArr.push(product);
            }
            const sortedResults = getResultsArr.sort((a, b) => {
                const itemA = a[currentSort];
                const itemB = b[currentSort];
                if (itemA < itemB) {
                    return currentSort === 'rating' ? 1 : -1;
                } else {
                    return currentSort === 'rating' ? -1 : 1;
                }
            });

            setCurrentTitle(value.toLowerCase());
            setCurrentQuery(sortedResults);
        };

        queryParams.artist
            ? getResults('artist', queryParams.artist)
            : queryParams.genre
            ? getResults('category', queryParams.genre)
            : queryParams.nationality
            ? getResults('nationality', queryParams.nationality)
            : setCurrentQuery(
                  products
                      .sort((a, b) => {
                          const itemA = a[currentSort];
                          const itemB = b[currentSort];
                          if (itemA < itemB) {
                              return currentSort === 'rating' ? 1 : -1;
                          } else {
                              return currentSort === 'rating' ? -1 : 1;
                          }
                      })
                      .slice(0, 70)
              );

        queryParams.artist && (finalQuery.artist = queryParams.artist);
        queryParams.genre && (finalQuery.genre = queryParams.genre);
        queryParams.nationality && (finalQuery.nationality = queryParams.nationality);
        sortParams ? (finalQuery.sort = currentSort) : (finalQuery.sort = 'isFeatured');

        setSearchParams(finalQuery);
    }, [
        queryParams.artist,
        queryParams.genre,
        queryParams.nationality,
        currentSort,
        sortParams,
        products,
        setSearchParams,
    ]);

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <Fragment>
            <ErrorBox error={error} />
            <FeaturedItems mainTitle="Related Items" />
        </Fragment>
    ) : (
        <div className={productsScreenStyle.productsScreenOuterContainer}>
            <Helmet>
                <title>{props.headerTitle ? props.headerTitle : 'Products Page'}</title>
            </Helmet>

            <div className={productsScreenStyle.productsScreenInnerContainer}>
                {/* RESULTS INNER SECTION */}
                <div className={productsScreenStyle.productsScreenResultsContainer}>
                    <div className={productsScreenStyle.queryMenuQueryItem}>
                        <form className={productsScreenStyle.sortContainer}>
                            <h5>Sort By</h5>
                            <select
                                className={productsScreenStyle.sortSelect}
                                name="sort"
                                id="sort"
                                value={
                                    currentSort === 'isfeatured'
                                        ? 'featured'
                                        : currentSort === 'category'
                                        ? 'genre'
                                        : currentSort
                                }
                                onChange={(e) => {
                                    setCurrentSort(e.target.value.toLowerCase());
                                }}
                            >
                                <option className={productsScreenStyle.sortOption} disabled hidden>
                                    {currentSort}
                                </option>
                                <option
                                    className={productsScreenStyle.sortOption}
                                    value="isFeatured"
                                >
                                    Featured
                                </option>
                                <option className={productsScreenStyle.sortOption} value="name">
                                    Name
                                </option>
                                <option className={productsScreenStyle.sortOption} value="artist">
                                    Artist
                                </option>
                                <option className={productsScreenStyle.sortOption} value="category">
                                    Genre
                                </option>
                                <option className={productsScreenStyle.sortOption} value="year">
                                    Year
                                </option>
                                <option className={productsScreenStyle.sortOption} value="rating">
                                    Avg Rating
                                </option>
                                <option className={productsScreenStyle.sortOption} value="price">
                                    Price
                                </option>
                            </select>
                        </form>

                        <form className={productsScreenStyle.sortContainer}>
                            <h5>Artists</h5>
                            <select
                                className={productsScreenStyle.sortSelect}
                                name="artist"
                                id="artist"
                                onChange={(e) => {
                                    setSearchParams({
                                        artist: e.target.value.toLowerCase(),
                                    });
                                }}
                            >
                                {artists.map((artist, index) => (
                                    <option className={productsScreenStyle.sortOption} key={index}>
                                        {artist}
                                    </option>
                                ))}
                            </select>
                        </form>

                        <form className={productsScreenStyle.sortContainer}>
                            <h5>Genres</h5>
                            <select
                                className={productsScreenStyle.sortSelect}
                                name="genres"
                                id="genres"
                                onChange={(e) => {
                                    console.log(e);
                                    setSearchParams({
                                        genre: e.target.value.toLowerCase(),
                                    });
                                }}
                            >
                                {categories.map((genre, index) => (
                                    <option
                                        className={productsScreenStyle.sortOption}
                                        value={genre}
                                        key={index}
                                    >
                                        {genre}
                                    </option>
                                ))}
                            </select>
                        </form>

                        <form className={productsScreenStyle.sortContainer}>
                            <h5>Nationality</h5>
                            <select
                                className={productsScreenStyle.sortSelect}
                                name="nationalities"
                                id="nationalities"
                                onChange={(e) => {
                                    console.log(e);
                                    setSearchParams({
                                        nationality: e.target.value.toLowerCase(),
                                    });
                                }}
                            >
                                {nationalities.map((nationality, index) => (
                                    <option
                                        className={productsScreenStyle.sortOption}
                                        value={nationality}
                                        key={index}
                                    >
                                        {nationality}
                                    </option>
                                ))}
                            </select>
                        </form>
                    </div>
                    <div className={productsScreenStyle.productsScreenResultsTextWrapper}>
                        <div
                            className={
                                productsScreenStyle.productsScreenResultsTextTitleSortWrapper
                            }
                        >
                            <h2
                                className={productsScreenStyle.productsScreenResultsTitle}
                            >{`${currentTitle}`}</h2>
                            {currentTitle === queryParams.artist ? (
                                <p className={productsScreenStyle.productsScreenResultsDescription}>
                                    {currentQuery[0].description}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className={productsScreenStyle.productWrapper}>
                        {currentQuery.slice(0, 70).map((product) => (
                            <Product product={product} key={product._id}></Product>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductsScreen;
