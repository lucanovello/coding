import { React, Fragment, useState, useContext, useEffect } from 'react';
import CheckoutSteps from '../../components/CheckoutSteps/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import paymentScreenStyle from './PaymentScreen.module.css';
import { Store } from '../../Store';
import { useNavigate } from 'react-router-dom';

const PaymentScreen = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { shippingAddress, paymentMethod },
        userInfo,
    } = state;
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin');
        } else if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate, userInfo]);

    const [paymentMethodName, setPaymentMethodName] = useState(paymentMethod || 'Paypal');

    const onSubmitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_PAYMENT_METHOD',
            payload: paymentMethodName,
        });
        localStorage.setItem('paymentMethod', paymentMethodName);
        navigate('/placeorder');
    };

    return (
        <Fragment>
            <CheckoutSteps step1 step2 step3 />
            <div className={paymentScreenStyle.paymentScreenContainer}>
                <Helmet>
                    <title>Payment Method</title>
                </Helmet>
                <div className={paymentScreenStyle.paymentScreenTitle}>Payment Method</div>
                <div className={paymentScreenStyle.paymentScreenFormContainer}>
                    <form onSubmit={onSubmitHandler}>
                        <div className={paymentScreenStyle.paymentScreenWrapper}>
                            <input
                                className={paymentScreenStyle.paymentScreenInput}
                                type={'radio'}
                                id="Paypal"
                                label="Paypal"
                                value="Paypal"
                                checked={paymentMethodName === 'Paypal'}
                                onChange={(e) => {
                                    setPaymentMethodName(e.target.value);
                                }}
                            />
                            <label
                                htmlFor={'Paypal'}
                                className={paymentScreenStyle.paymentScreenLabel}
                            >
                                Paypal
                            </label>
                        </div>

                        <div className={paymentScreenStyle.paymentScreenWrapper}>
                            <input
                                className={paymentScreenStyle.paymentScreenInput}
                                type={'radio'}
                                id="Stripe"
                                label="Stripe"
                                value="Stripe"
                                checked={paymentMethodName === 'Stripe'}
                                onChange={(e) => {
                                    setPaymentMethodName(e.target.value);
                                }}
                            />
                            <label
                                htmlFor={'Stripe'}
                                className={paymentScreenStyle.paymentScreenLabel}
                            >
                                Stripe
                            </label>
                        </div>

                        <div className={paymentScreenStyle.paymentScreenWrapper}>
                            <input
                                className={paymentScreenStyle.paymentScreenInput}
                                type={'radio'}
                                id="Debit"
                                label="Debit"
                                value="Debit"
                                checked={paymentMethodName === 'Debit'}
                                onChange={(e) => {
                                    setPaymentMethodName(e.target.value);
                                }}
                            />
                            <label
                                htmlFor={'Debit'}
                                className={paymentScreenStyle.paymentScreenLabel}
                            >
                                Debit
                            </label>
                        </div>

                        <div className={paymentScreenStyle.paymentScreenWrapper}>
                            <input
                                className={paymentScreenStyle.paymentScreenInput}
                                type={'radio'}
                                id="Credit Card"
                                label="Credit Card"
                                value="Credit Card"
                                checked={paymentMethodName === 'Credit Card'}
                                onChange={(e) => {
                                    setPaymentMethodName(e.target.value);
                                }}
                            />
                            <label
                                htmlFor={'Credit Card'}
                                className={paymentScreenStyle.paymentScreenLabel}
                            >
                                Credit Card
                            </label>
                        </div>

                        <button type="submit" className={paymentScreenStyle.paymentScreenButton}>
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default PaymentScreen;
