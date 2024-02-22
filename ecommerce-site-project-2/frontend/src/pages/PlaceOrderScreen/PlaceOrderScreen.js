import { Fragment, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/CheckoutSteps/CheckoutSteps';
import { Store } from '../../Store';
import PlaceOrderAddress from './PlaceOrderAddress';
import PlaceOrderItems from './PlaceOrderItems';
import PlaceOrderPayment from './PlaceOrderPayment';
import placeOrderScreenStyle from './PlaceOrderScreen.module.css';
import PlaceOrderSummary from './PlaceOrderSummary';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    cart.itemsPrice = cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0).toFixed(2);
    cart.shippingPrice = (0).toFixed(2);
    cart.taxPrice = (cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0) * 0.13).toFixed(
        2
    );
    cart.totalPrice = (
        parseFloat(cart.itemsPrice) +
        parseFloat(cart.shippingPrice) +
        parseFloat(cart.taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (!userInfo) {
            return navigate('./signin');
        }
        if (cart.cartItems.length < 1) {
            return navigate('./');
        }
        if (cart.shippingAddress.length < 1) {
            return navigate('./shipping');
        }
        if (cart.paymentMethod.length < 1) {
            return navigate('./payment');
        }
    }, [cart, navigate, userInfo]);

    return (
        <Fragment>
            <Helmet>
                <title>Preview Order</title>
            </Helmet>
            <CheckoutSteps step1 step2 step3 step4 />

            <div className={placeOrderScreenStyle.placeOrderScreenContainer}>
                <h2 className={placeOrderScreenStyle.placeOrderScreenTitle}>Preview Order</h2>

                <div className={placeOrderScreenStyle.placeOrderScreenInnerContainer}>
                    <div className={placeOrderScreenStyle.placeOrderScreenInnerContainerLeft}>
                        <PlaceOrderAddress cart={cart} />
                        <PlaceOrderPayment cart={cart} />
                        <PlaceOrderItems cart={cart.cartItems} ctxDispatch={ctxDispatch} />
                    </div>

                    <PlaceOrderSummary cart={cart} userInfo={userInfo} ctxDispatch={ctxDispatch} />
                </div>
            </div>
        </Fragment>
    );
};

export default PlaceOrderScreen;
