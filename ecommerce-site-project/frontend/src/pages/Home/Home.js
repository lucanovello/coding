import Slideshow from '../../components/Slideshow/Slideshow';
import LoadingBox from '../../components/LoadingBox/LoadingBox';
import ErrorBox from '../../components/ErrorBox/ErrorBox';
import { Fragment, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { getError } from '../../utils';
import FeaturedCategory from '../../components/FeaturedCategory/FeaturedCategory';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, data: action.payload, loading: false, error: null };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

function Home(props) {
    const [{ loading, error, data }, dispatch] = useReducer(reducer, {
        data: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get('./api/seed/slideshow');
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err.message) });
            }
        };
        fetchData();
    }, [props.location]);

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <ErrorBox error={error} />
    ) : (
        <Fragment>
            <Helmet>
                <title>
                    {props.headerTitle ? props.headerTitle : 'Luca Novello | Ecommerce Website'}
                </title>
            </Helmet>
            <Slideshow slide={data.slideshow[3]} />
            <FeaturedCategory
                mainTitle="Featured Genres"
                route="/api/categories/featuredCategory"
                content="category"
                size={7}
            />
            <FeaturedCategory
                mainTitle="Featured Artists"
                route="/api/categories/featuredArtist"
                content="artist"
                size={7}
            />

            {/* <FeaturedItems mainTitle="Best Sellers" route="/api/featuredItems/" /> */}
            {/* <FeaturedItems mainTitle="Trending" route="/api/featuredItems/" />  */}
            {/* <FeaturedItems mainTitle="Featured Items" route="/api/featuredItems/" /> */}
        </Fragment>
    );
}

export default Home;
