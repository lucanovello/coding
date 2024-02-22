import { Link } from 'react-router-dom';
import checkoutStepsStyle from './CheckoutSteps.module.css';

const CheckoutSteps = (props) => {
    return (
        <div className={checkoutStepsStyle.checkoutStepsContainer}>
            <div
                className={`${checkoutStepsStyle.wrapper} ${
                    props.step2
                        ? checkoutStepsStyle.wrapperActive
                        : checkoutStepsStyle.wrapperDisabled
                }`}
            >
                {props.step1 ? (
                    <Link
                        to={`/cart`}
                        className={`${checkoutStepsStyle.circle} ${
                            props.step1 ? checkoutStepsStyle.active : checkoutStepsStyle.disabled
                        }`}
                    >
                        <p
                            className={`${checkoutStepsStyle.text} ${
                                props.step1
                                    ? checkoutStepsStyle.textActive
                                    : checkoutStepsStyle.textDisabled
                            }`}
                        >
                            Cart
                        </p>
                    </Link>
                ) : (
                    <div
                        className={`${checkoutStepsStyle.circle} ${
                            props.step1 ? checkoutStepsStyle.active : checkoutStepsStyle.disabled
                        }`}
                    >
                        <p
                            className={`${checkoutStepsStyle.text} ${
                                props.step1
                                    ? checkoutStepsStyle.textActive
                                    : checkoutStepsStyle.textDisabled
                            }`}
                        >
                            Cart
                        </p>
                    </div>
                )}
            </div>

            <div
                className={`${checkoutStepsStyle.wrapper} ${
                    props.step3
                        ? checkoutStepsStyle.wrapperActive
                        : checkoutStepsStyle.wrapperDisabled
                }`}
            >
                {props.step2 ? (
                    <Link
                        to={`/shipping`}
                        className={`${checkoutStepsStyle.circle} ${
                            props.step2 ? checkoutStepsStyle.active : checkoutStepsStyle.disabled
                        }`}
                    >
                        <p
                            className={`${checkoutStepsStyle.text} ${
                                props.step2
                                    ? checkoutStepsStyle.textActive
                                    : checkoutStepsStyle.textDisabled
                            }`}
                        >
                            Shipping
                        </p>
                    </Link>
                ) : (
                    <div
                        to={`/shipping`}
                        className={`${checkoutStepsStyle.circle} ${
                            props.step2 ? checkoutStepsStyle.active : checkoutStepsStyle.disabled
                        }`}
                    >
                        <p
                            className={`${checkoutStepsStyle.text} ${
                                props.step2
                                    ? checkoutStepsStyle.textActive
                                    : checkoutStepsStyle.textDisabled
                            }`}
                        >
                            Shipping
                        </p>
                    </div>
                )}
            </div>

            <div
                className={`${checkoutStepsStyle.wrapper} ${
                    props.step4
                        ? checkoutStepsStyle.wrapperActive
                        : checkoutStepsStyle.wrapperDisabled
                }`}
            >
                {props.step3 ? (
                    <Link
                        to={`/payment`}
                        className={`${checkoutStepsStyle.circle} ${
                            props.step3 ? checkoutStepsStyle.active : checkoutStepsStyle.disabled
                        }`}
                    >
                        <p
                            className={`${checkoutStepsStyle.text} ${
                                props.step3
                                    ? checkoutStepsStyle.textActive
                                    : checkoutStepsStyle.textDisabled
                            }`}
                        >
                            Payment
                        </p>
                    </Link>
                ) : (
                    <div
                        className={`${checkoutStepsStyle.circle} ${
                            props.step3 ? checkoutStepsStyle.active : checkoutStepsStyle.disabled
                        }`}
                    >
                        <p
                            className={`${checkoutStepsStyle.text} ${
                                props.step3
                                    ? checkoutStepsStyle.textActive
                                    : checkoutStepsStyle.textDisabled
                            }`}
                        >
                            Payment
                        </p>
                    </div>
                )}
            </div>

            <div
                className={`${checkoutStepsStyle.wrapper} ${
                    props.step3
                        ? checkoutStepsStyle.wrapperActive
                        : checkoutStepsStyle.wrapperDisabled
                }`}
            >
                {props.step4 ? (
                    <Link
                        to={`/placeorder`}
                        className={`${checkoutStepsStyle.circle} ${
                            props.step4 ? checkoutStepsStyle.active : checkoutStepsStyle.disabled
                        }`}
                    >
                        <p
                            className={`${checkoutStepsStyle.text} ${
                                props.step4
                                    ? checkoutStepsStyle.textActive
                                    : checkoutStepsStyle.textDisabled
                            }`}
                        >
                            Place Order
                        </p>
                    </Link>
                ) : (
                    <div
                        className={`${checkoutStepsStyle.circle} ${
                            props.step4 ? checkoutStepsStyle.active : checkoutStepsStyle.disabled
                        }`}
                    >
                        <p
                            className={`${checkoutStepsStyle.text} ${
                                props.step4
                                    ? checkoutStepsStyle.textActive
                                    : checkoutStepsStyle.textDisabled
                            }`}
                        >
                            Place Order
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutSteps;
