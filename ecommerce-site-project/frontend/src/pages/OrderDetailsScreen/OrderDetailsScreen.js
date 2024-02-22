import { Helmet } from 'react-helmet-async';
import orderDetailsScreenStyle from './OrderDetailsScreen.module.css';
import LoadingBox from '../../components/LoadingBox/LoadingBox';
import ErrorBox from '../../components/ErrorBox/ErrorBox';
import { Fragment, useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../Store';
import axios from 'axios';
import { getError } from '../../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {
                ...state,
                loading: true,
                error: '',
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                error: '',
                order: action.payload,
            };
        case 'FETCH_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

const OrderDetailsScreen = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;

    const [{ loading, error, order }, dispatch] = useReducer(reducer, {
        loading: false,
        error: {},
        order: '',
    });

    useEffect(() => {
        if (!userInfo) {
            return navigate('/signin');
        }
        if (!order._id || (order._id && order._id !== orderId)) {
            const fetchOrder = async () => {
                dispatch({ type: 'FETCH_REQUEST' });
                try {
                    const { data } = await axios.get(`/api/orders/${orderId}`, {
                        headers: { authorization: `Bearer ${userInfo.token}` },
                    });
                    dispatch({
                        type: 'FETCH_SUCCESS',
                        payload: data,
                    });
                } catch (err) {
                    dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
                }
            };
            fetchOrder();
        }
    }, [userInfo, order, orderId, navigate]);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        navigate('/orderhistory');
    };

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <ErrorBox />
    ) : (
        <Fragment>
            <Helmet>
                <title>Order Details</title>
            </Helmet>
            <div className={orderDetailsScreenStyle.orderDetailsScreenContainer}>
                <h2 className={orderDetailsScreenStyle.orderDetailsScreenTitle}>
                    {`Order #${orderId.replace(/\D+/g, '')}`}
                </h2>

                <div className={orderDetailsScreenStyle.orderDetailsScreenInnerContainer}>
                    <div className={orderDetailsScreenStyle.orderDetailsScreenInnerContainerLeft}>
                        {/* SHIPPING ADDRESS */}

                        <div className={orderDetailsScreenStyle.orderDetailsScreenItems}>
                            <h2 className={orderDetailsScreenStyle.orderDetailsScreenSubTitleItems}>
                                Shipping Address
                            </h2>
                            <div className={orderDetailsScreenStyle.orderDetailsScreenAddress}>
                                <p>{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{`${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.postalCode}`}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                            <p
                                className={
                                    order.isDelivered
                                        ? `${orderDetailsScreenStyle.orderDetailsScreenDeliveredTrue} ${orderDetailsScreenStyle.orderDetailsScreenUpdates}`
                                        : `${orderDetailsScreenStyle.orderDetailsScreenDeliveredFalse} ${orderDetailsScreenStyle.orderDetailsScreenUpdates}`
                                }
                            >
                                {order.isDelivered
                                    ? `Delivered at ${order.deliveredAt}.`
                                    : `Your order is scheduled to arrive on ${new Date(
                                          order.deliveredAt
                                      ).toLocaleDateString('en-US', {
                                          weekday: 'long',
                                          month: 'long',
                                          day: 'numeric',
                                          year: 'numeric',
                                      })}.`}
                            </p>
                        </div>

                        {/* PAYMENT METHOD */}
                        <div className={orderDetailsScreenStyle.orderDetailsScreenItemsContainer}>
                            <div className={orderDetailsScreenStyle.orderDetailsScreenItems}>
                                <h2
                                    className={
                                        orderDetailsScreenStyle.orderDetailsScreenSubTitleItems
                                    }
                                >
                                    Payment Method
                                </h2>

                                <div className={orderDetailsScreenStyle.orderDetailsScreenAddress}>
                                    <p>{order.paymentMethod}</p>
                                </div>
                                <p
                                    className={
                                        order.isPaid
                                            ? `${orderDetailsScreenStyle.orderDetailsScreenPaidTrue} ${orderDetailsScreenStyle.orderDetailsScreenUpdates}`
                                            : `${orderDetailsScreenStyle.orderDetailsScreenPaidFalse} ${orderDetailsScreenStyle.orderDetailsScreenUpdates}`
                                    }
                                >
                                    {order.isPaid
                                        ? `Paid on ${new Date(order.paidAt).toLocaleDateString(
                                              'en-US',
                                              {
                                                  weekday: 'long',
                                                  month: 'long',
                                                  day: 'numeric',
                                                  year: 'numeric',
                                              }
                                          )}.`
                                        : `Not Paid.`}
                                </p>
                            </div>
                        </div>

                        {/* ORDER ITEMS */}
                        <div className={orderDetailsScreenStyle.orderDetailsScreenItemsContainer}>
                            <ul className={orderDetailsScreenStyle.orderDetailsScreenItems}>
                                <h2
                                    className={
                                        orderDetailsScreenStyle.orderDetailsScreenSubTitleItems
                                    }
                                >
                                    Items
                                </h2>
                                {order.orderItems.map((item, index) => (
                                    <Link
                                        to={`/products/${item.slug}`}
                                        className={orderDetailsScreenStyle.Link}
                                        key={index}
                                    >
                                        <li
                                            className={
                                                orderDetailsScreenStyle.orderDetailsScreenItem
                                            }
                                        >
                                            <div
                                                className={
                                                    orderDetailsScreenStyle.orderDetailsScreenItemImageWrapper
                                                }
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className={
                                                        orderDetailsScreenStyle.orderDetailsScreenItemImage
                                                    }
                                                />
                                            </div>
                                            <div
                                                className={
                                                    orderDetailsScreenStyle.orderDetailsScreenItemDetails
                                                }
                                            >
                                                <div
                                                    me={
                                                        orderDetailsScreenStyle.orderDetailsScreenItemDetail
                                                    }
                                                >
                                                    <h4
                                                        className={
                                                            orderDetailsScreenStyle.orderDetailsScreenItemDetailsName
                                                        }
                                                    >
                                                        {item.name}
                                                    </h4>
                                                    <p
                                                        className={
                                                            orderDetailsScreenStyle.orderDetailsScreenItemDetailsArtist
                                                        }
                                                    >
                                                        {item.artist}
                                                    </p>

                                                    <p
                                                        className={
                                                            orderDetailsScreenStyle.orderDetailsScreenItemDetailsDevice
                                                        }
                                                    >
                                                        {item.device}
                                                    </p>
                                                    <p
                                                        className={
                                                            orderDetailsScreenStyle.orderDetailsScreenItemDetailsQty
                                                        }
                                                    >
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <div
                                                    className={
                                                        orderDetailsScreenStyle.orderDetailsScreenItemDetail
                                                    }
                                                >
                                                    <p
                                                        className={
                                                            orderDetailsScreenStyle.orderDetailsScreenItemDetailsPrice
                                                        }
                                                    >
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ORDER SUMMARY */}
                    <div className={orderDetailsScreenStyle.orderDetailsScreenTotal}>
                        <h2 className={orderDetailsScreenStyle.orderDetailsScreenSubTitle}>
                            Order Summary
                        </h2>

                        <div className={orderDetailsScreenStyle.orderDetailsScreenTotalWrapper}>
                            <p>{'Subtotal:'}</p>
                            <span>${order.itemsPrice.toFixed(2)}</span>
                        </div>

                        <div className={orderDetailsScreenStyle.orderDetailsScreenTotalWrapper}>
                            <p>{'Shipping:'}</p>
                            <span>${order.shippingPrice.toFixed(2)}</span>
                        </div>

                        <div className={orderDetailsScreenStyle.orderDetailsScreenTotalWrapper}>
                            <p>{'Tax:'}</p>
                            <span>${order.taxPrice.toFixed(2)}</span>
                        </div>

                        <div className={orderDetailsScreenStyle.orderDetailsScreenTotalWrapper}>
                            <p>{'Order Total'}</p>
                            <span>${order.totalPrice.toFixed(2)}</span>
                        </div>

                        <button
                            type="button"
                            className={`${orderDetailsScreenStyle.orderDetailsScreenCheckoutBtnActive} ${orderDetailsScreenStyle.orderDetailsScreenCheckoutBtn}`}
                            onClick={onSubmitHandler}
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default OrderDetailsScreen;
