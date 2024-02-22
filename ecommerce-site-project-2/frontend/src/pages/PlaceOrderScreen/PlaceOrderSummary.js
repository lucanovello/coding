import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../../utils';
import placeOrderScreenStyle from './PlaceOrderScreen.module.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loading: false,
      };
    case 'CREATE_FAIL':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

const PlaceOrderSummary = (props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(
    placeOrderScreenStyle.placeOrderScreenCheckoutBtnActive
  );
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  useEffect(() => {
    if (props.cart.cartItems.length < 1) {
      setIsLoading(
        `${placeOrderScreenStyle.placeOrderScreenCheckoutBtnDisabled} ${placeOrderScreenStyle.placeOrderScreenCheckoutBtn}`
      );
    } else if (loading) {
      setIsLoading(
        `${placeOrderScreenStyle.placeOrderScreenCheckoutBtnDisabled} ${placeOrderScreenStyle.placeOrderScreenCheckoutBtn}`
      );
    } else {
      setIsLoading(
        `${placeOrderScreenStyle.placeOrderScreenCheckoutBtnActive} ${placeOrderScreenStyle.placeOrderScreenCheckoutBtn}`
      );
    }
  }, [props.cart.cartItems.length, loading]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        'api/orders',
        {
          orderItems: props.cart.cartItems,
          shippingAddress: props.cart.shippingAddress,
          paymentMethod: props.cart.paymentMethod,
          itemsPrice: props.cart.itemsPrice,
          shippingPrice: props.cart.shippingPrice,
          taxPrice: props.cart.taxPrice,
          totalPrice: props.cart.totalPrice,
          isPaid: true,
          paidAt: new Date(),
          deliveredAt: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
        },
        {
          headers: {
            authorization: `Bearer ${props.userInfo.token}`,
          },
        }
      );
      props.ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div className={placeOrderScreenStyle.placeOrderScreenTotal}>
      <h2 className={placeOrderScreenStyle.placeOrderSubTitle}>
        Order Summary
      </h2>

      <div className={placeOrderScreenStyle.placeOrderScreenTotalWrapper}>
        <p>{'Subtotal:'}</p>
        <span>
          {props.cart.cartItems
            ? `$${props.cart.itemsPrice}`
            : `$${(0).toFixed(2)}`}
        </span>
      </div>

      <div className={placeOrderScreenStyle.placeOrderScreenTotalWrapper}>
        <p>{'Shipping:'}</p>
        <span>{'FREE'}</span>
      </div>

      <div className={placeOrderScreenStyle.placeOrderScreenTotalWrapper}>
        <p>{'Tax:'}</p>
        <span>
          {props.cart.cartItems
            ? `$${props.cart.taxPrice}`
            : `$${(0).toFixed(2)}`}
        </span>
      </div>

      <div className={placeOrderScreenStyle.placeOrderScreenTotalWrapper}>
        <p>{'Order Total'}</p>
        <span>
          {props.cart.cartItems
            ? `$${props.cart.totalPrice}`
            : `$${(0).toFixed(2)}`}
        </span>
      </div>

      <button
        type="button"
        className={isLoading}
        onClick={onSubmitHandler}
        disabled={props.cart.cartItems.length < 1}
      >
        {loading
          ? 'Processing...'
          : props.cart.cartItems.length < 1
          ? 'Cart is emtpy'
          : 'Place Order'}
      </button>
    </div>
  );
};

export default PlaceOrderSummary;
