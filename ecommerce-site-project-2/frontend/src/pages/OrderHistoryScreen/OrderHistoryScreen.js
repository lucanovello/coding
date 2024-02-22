import { Helmet } from 'react-helmet-async';
import orderHistoryScreenStyle from './OrderHistoryScreen.module.css';
import { Fragment, useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
import { getError } from '../../utils';
import LoadingBox from '../../components/LoadingBox/LoadingBox';
import ErrorBox from '../../components/ErrorBox/ErrorBox';
import axios from 'axios';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                orders: action.payload,
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

const OrderHistoryScreen = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: false,
        error: false,
        orders: [],
    });

    useEffect(() => {
        if (!userInfo) {
            return navigate('./signin');
        }
        const fetchOrders = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(`/api/orders/mine`, {
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
        fetchOrders();
    }, [userInfo, navigate]);

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <ErrorBox>{error}</ErrorBox>
    ) : (
        <Fragment>
            <Helmet>
                <title>Order History</title>
            </Helmet>
            <div className={orderHistoryScreenStyle.orderHistoryScreenContainer}>
                <h2 className={orderHistoryScreenStyle.orderHistoryScreenTitle}>
                    {`Order History`}
                </h2>

                <div className={orderHistoryScreenStyle.orderHistoryScreenItemsContainer}>
                    {orders.length > 0 ? (
                        <ul className={orderHistoryScreenStyle.orderHistoryScreenItems}>
                            {orders
                                .slice(0)
                                .reverse()
                                .map((order, index) => (
                                    <li
                                        className={orderHistoryScreenStyle.orderContainer}
                                        key={index}
                                    >
                                        <Link
                                            to={`/order/${order._id}`}
                                            className={
                                                orderHistoryScreenStyle.orderSummaryContainer
                                            }
                                        >
                                            <div
                                                className={
                                                    orderHistoryScreenStyle.orderSummaryInnerContainer
                                                }
                                            >
                                                <h3
                                                    className={
                                                        orderHistoryScreenStyle.orderHistoryScreenSubTitle
                                                    }
                                                >
                                                    Order #
                                                </h3>
                                                <p>{order._id.replace(/\D+/g, '')}</p>
                                            </div>

                                            <div
                                                className={
                                                    orderHistoryScreenStyle.orderSummaryInnerContainer
                                                }
                                            >
                                                <h3
                                                    className={
                                                        orderHistoryScreenStyle.orderHistoryScreenSubTitle
                                                    }
                                                >
                                                    Order Placed
                                                </h3>
                                                <p>
                                                    {new Date(order.createdAt).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        }
                                                    )}
                                                </p>
                                            </div>

                                            <div
                                                className={
                                                    orderHistoryScreenStyle.orderSummaryInnerContainer
                                                }
                                            >
                                                <h3
                                                    className={
                                                        orderHistoryScreenStyle.orderHistoryScreenSubTitle
                                                    }
                                                >
                                                    Ship To
                                                </h3>
                                                <p>{order.shippingAddress.fullName}</p>
                                            </div>

                                            <div
                                                className={orderHistoryScreenStyle.orderSummaryTax}
                                            >
                                                <h3
                                                    className={
                                                        orderHistoryScreenStyle.orderHistoryScreenSubTitle
                                                    }
                                                >
                                                    Tax
                                                </h3>
                                                <p>${order.taxPrice.toFixed(2)}</p>
                                            </div>

                                            <div
                                                className={
                                                    orderHistoryScreenStyle.orderSummaryTotal
                                                }
                                            >
                                                <h3
                                                    className={
                                                        orderHistoryScreenStyle.orderHistoryScreenSubTitle
                                                    }
                                                >
                                                    Total
                                                </h3>
                                                <p>${order.totalPrice.toFixed(2)}</p>
                                            </div>
                                        </Link>

                                        <ul className={orderHistoryScreenStyle.orderItemsContainer}>
                                            {order.orderItems.map((item, index) => (
                                                <li key={index}>
                                                    <Link
                                                        to={`/products/${item.slug}`}
                                                        className={
                                                            orderHistoryScreenStyle.orderItemContainer
                                                        }
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className={
                                                                orderHistoryScreenStyle.cartScreenItemImage
                                                            }
                                                        />
                                                        <div
                                                            className={
                                                                orderHistoryScreenStyle.cartScreenItemDetails
                                                            }
                                                        >
                                                            <div
                                                                className={
                                                                    orderHistoryScreenStyle.cartScreenItemDetailWrapper
                                                                }
                                                            >
                                                                <h4
                                                                    className={
                                                                        orderHistoryScreenStyle.cartScreenItemDetailsName
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </h4>

                                                                <p
                                                                    className={
                                                                        orderHistoryScreenStyle.cartScreenItemDetailsArtist
                                                                    }
                                                                >
                                                                    {item.artist ? item.artist : ''}
                                                                </p>
                                                            </div>
                                                            <div
                                                                className={
                                                                    orderHistoryScreenStyle.cartScreenItemDetailWrapper
                                                                }
                                                            >
                                                                <p
                                                                    className={
                                                                        orderHistoryScreenStyle.cartScreenItemDetailsDevice
                                                                    }
                                                                >
                                                                    {item.device ? item.device : ''}
                                                                </p>
                                                                <p
                                                                    className={
                                                                        orderHistoryScreenStyle.cartScreenItemDetailsDevice
                                                                    }
                                                                >
                                                                    {item.quantity
                                                                        ? `Qty: ${item.quantity}`
                                                                        : ''}
                                                                </p>
                                                            </div>
                                                            <div
                                                                className={
                                                                    orderHistoryScreenStyle.cartScreenItemDetailWrapper
                                                                }
                                                            >
                                                                <p
                                                                    className={
                                                                        orderHistoryScreenStyle.cartScreenItemDetailsPrice
                                                                    }
                                                                >
                                                                    $
                                                                    {(
                                                                        item.price * item.quantity
                                                                    ).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <div className={orderHistoryScreenStyle.orderContainerNone}>
                            No order history available.
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default OrderHistoryScreen;
