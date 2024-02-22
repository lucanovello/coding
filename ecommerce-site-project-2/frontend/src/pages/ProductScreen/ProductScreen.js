import React, {
  useReducer,
  useEffect,
  useContext,
  Fragment,
  useState,
  useRef,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import productScreenStyle from './ProductScreen.module.css';
import Rating from '../../components/Rating/Rating';
import LoadingBox from '../../components/LoadingBox/LoadingBox';
import ErrorBox from '../../components/ErrorBox/ErrorBox';
import Devices from './Devices';
import { Store } from '../../Store';
import FeaturedItems from '../../components/FeaturedItems/FeaturedItems';
import QuantityBox from '../../components/QuantityBox/QuantityBox';
import { Helmet } from 'react-helmet-async';
import { getError } from '../../utils';
import { toast } from 'react-toastify';
import { BsFillBagCheckFill } from 'react-icons/bs';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        product: action.payload.product,
        devices: action.payload.devices,
        loading: false,
        error: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen(props) {
  const [{ loading, error, product, devices }, dispatch] = useReducer(reducer, {
    product: [],
    devices: [],
    loading: true,
    error: '',
  });
  const [productQty, setProductQty] = useState(1);
  const [isDeviceValid, setIsDeviceValid] = useState(false);
  const [currentImage, setCurrentImage] = useState(product.image);
  const device = useRef(null);
  const params = useParams();
  const { slug } = params;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const toastId = useRef(null);

  const toastMessage = async (message) => {
    toast.clearWaitingQueue();
    toastId.current = message;
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/${slug}`);
        setCurrentImage(result.data.product.image);

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: result.data,
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
    setProductQty(1);
    setIsDeviceValid(false);
  }, [slug, props.location]);

  const addToCartHandler = async () => {
    const itemExists = cart.cartItems.find(
      (x) =>
        x.sku ===
        `${product.slug}_${device.current.value
          .replace(/\s+/g, '-')
          .toLowerCase()}`
    );
    const quantity = itemExists
      ? parseInt(itemExists.quantity) + parseInt(productQty)
      : parseInt(productQty);
    await ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        ...product,
        sku: `${product.slug}_${device.current.value
          .replace(/\s+/g, '-')
          .toLowerCase()}`,
        quantity: quantity,
        device: device.current.value,
      },
    });
    setProductQty(1);
    toastMessage(
      toast.success('Added to Cart', {
        toastId: 'Added_to_Cart',
        icon: <BsFillBagCheckFill />,
      })
    );
  };

  const changeImageHandler = (image) => {
    setCurrentImage(image);
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <Fragment>
      <ErrorBox error={error} />
      <FeaturedItems mainTitle="Related Items" />
    </Fragment>
  ) : (
    <div className={productScreenStyle.productScreenContainer}>
      <Helmet>
        <title>{`${product.name} Phone Case`}</title>
      </Helmet>
      <div className={productScreenStyle.productContainer}>
        <div className={productScreenStyle.productImageContainer}>
          <div className={productScreenStyle.productImageMainContainer}>
            <img
              className={`${productScreenStyle.productImage3} ${
                currentImage === product.image3
                  ? productScreenStyle.appear
                  : `${productScreenStyle.disappear} ${productScreenStyle.none}`
              }`}
              src={product.image3}
              alt={product.name}
            />
            <img
              className={`${productScreenStyle.productImage} ${
                productScreenStyle.productImage2
              } ${
                currentImage === product.image2
                  ? productScreenStyle.appear
                  : `${productScreenStyle.disappear} ${productScreenStyle.none}`
              }`}
              src={product.image2}
              alt={product.name}
            />
            <img
              className={`${productScreenStyle.productImage} ${
                productScreenStyle.productImage
              } ${
                currentImage === product.image
                  ? productScreenStyle.appear
                  : `${productScreenStyle.disappear} ${productScreenStyle.none}`
              }`}
              src={product.image}
              alt={product.name}
            />
          </div>
          <div className={productScreenStyle.productImageAlts}>
            <div
              className={`${productScreenStyle.productImageAltWrapper} ${
                currentImage === product.image &&
                productScreenStyle.productImageAltActive
              }`}
            >
              <img
                className={productScreenStyle.productImageAlt}
                src={product.image}
                alt={product.name}
                onClick={() => changeImageHandler(product.image)}
              />
            </div>

            <div
              className={`${productScreenStyle.productImageAlt2Wrapper}  ${
                currentImage === product.image2 &&
                productScreenStyle.productImageAltActive
              }`}
            >
              <img
                className={productScreenStyle.productImageAlt2}
                src={product.image2}
                alt={product.name}
                onClick={() => changeImageHandler(product.image2)}
              />
            </div>

            <div
              className={`${productScreenStyle.productImageAlt3Wrapper} ${
                currentImage === product.image3 &&
                productScreenStyle.productImageAltActive
              }`}
            >
              <img
                className={productScreenStyle.productImageAlt3}
                src={product.image3}
                alt={product.name}
                onClick={() => changeImageHandler(product.image3)}
              />
            </div>
          </div>
        </div>

        <div className={productScreenStyle.productDetails}>
          <div>
            <h4
              className={productScreenStyle.productTitle}
            >{`${product.name}, ${product.year}`}</h4>

            <Link to={`/${product.artist.replace(' ', '_')}`}>
              <h5 className={productScreenStyle.productArtist}>
                {product.artist}
              </h5>
            </Link>

            <p className={productScreenStyle.productDescription}>
              {product.description}
            </p>
            <Rating
              class={productScreenStyle.productRating}
              rating={product.rating}
              numReviews={product.numReviews}
            />
          </div>

          <div className={productScreenStyle.productOptionsContainer}>
            <div className={productScreenStyle.productQuantityBoxContainer}>
              <QuantityBox
                value={productQty}
                setQty={setProductQty}
                item={product}
                ctxDispatch={false}
                quantityBoxContainerStyle={
                  productScreenStyle.productQuantityContainer
                }
                quantityBoxLabelStyle={productScreenStyle.productQuantityLabel}
                quantityBoxInputStyle={productScreenStyle.productQuantity}
              />
            </div>
            <Devices
              devices={devices}
              className={productScreenStyle.productDeviceContainer}
              refValue={device}
              setIsDeviceValid={setIsDeviceValid}
            />
            <button
              type="button"
              className={`${productScreenStyle.productButton}
              ${
                isDeviceValid
                  ? productScreenStyle.productButtonActive
                  : productScreenStyle.productButtonDisabled
              }`}
              onClick={addToCartHandler}
              disabled={!isDeviceValid}
            >
              {!isDeviceValid ? 'Please select a device' : 'Add To Cart'}
            </button>
            <h5 className={productScreenStyle.productPrice}>
              ${product.price}
            </h5>
          </div>
        </div>
      </div>
      <FeaturedItems
        mainTitle={`More from ${product.artist}`}
        content={product.artist}
        location={props.location}
        route="/api/featuredItems/artist"
      />
      <FeaturedItems
        mainTitle={`More from the ${product.category} Movement`}
        content={product.category}
        location={props.location}
        route="/api/featuredItems/category"
      />
      <FeaturedItems
        mainTitle={`More from the ${Math.floor(product.year / 100) * 100}'s`}
        content={product.year}
        location={props.location}
        route="/api/featuredItems/year"
      />
    </div>
  );
}

export default ProductScreen;
