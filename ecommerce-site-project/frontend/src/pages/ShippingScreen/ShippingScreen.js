import React, { Fragment, useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/CheckoutSteps/CheckoutSteps';
import { Store } from '../../Store';
import shippingScreenStyle from './ShippingScreen.module.css';

const ShippingScreen = () => {
    const { dispatch: ctxDispatch } = useContext(Store);
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                address,
                city,
                province,
                postalCode,
                country,
            },
        });
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify({
                fullName,
                address,
                city,
                province,
                postalCode,
                country,
            })
        );
        navigate('/payment');
    };

    return (
        <Fragment>
            <Helmet>
                <title>Shipping Address</title>
            </Helmet>
            <CheckoutSteps step1 step2 />
            <div className={shippingScreenStyle.shippingScreenContainer}>
                <div className={shippingScreenStyle.shippingScreenTitle}>Shipping Address</div>
                <div className={shippingScreenStyle.shippingScreenFormContainer}>
                    <form onSubmit={onSubmitHandler}>
                        <div className={shippingScreenStyle.shippingScreenFullNameContainer}>
                            <label
                                htmlFor={'fullName'}
                                className={shippingScreenStyle.shippingScreenFullNameLabel}
                            >
                                Full Name<span>*</span>
                            </label>
                            <input
                                type={'fullName'}
                                id={'fullName'}
                                className={shippingScreenStyle.shippingScreenFullNameInput}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={shippingScreenStyle.shippingScreenAddressContainer}>
                            <label
                                htmlFor={'address'}
                                className={shippingScreenStyle.shippingScreenAddressLabel}
                            >
                                Street Address<span>*</span>
                            </label>
                            <input
                                type={'address'}
                                id={'address'}
                                className={shippingScreenStyle.shippingScreenAddressInput}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className={shippingScreenStyle.shippingScreenCityFormRow}>
                            <div className={shippingScreenStyle.shippingScreenCityContainer}>
                                <label
                                    htmlFor={'city'}
                                    className={shippingScreenStyle.shippingScreenCityLabel}
                                >
                                    City<span>*</span>
                                </label>
                                <input
                                    type={'city'}
                                    id={'city'}
                                    className={shippingScreenStyle.shippingScreenCityInput}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={shippingScreenStyle.shippingScreenProvinceContainer}>
                                <label
                                    htmlFor={'province'}
                                    className={shippingScreenStyle.shippingScreenProvinceLabel}
                                >
                                    Province<span>*</span>
                                </label>
                                <select
                                    id="province"
                                    name="province"
                                    className={shippingScreenStyle.shippingScreenProvinceInput}
                                    defaultValue=""
                                    onChange={(e) => setProvince(e.target.value)}
                                    required
                                >
                                    <option value="" hidden disabled></option>
                                    <option>Alberta</option>
                                    <option>British Columbia</option>
                                    <option>Manitoba</option>
                                    <option>New Brunswick</option>
                                    <option>Newfoundland and Labrador</option>
                                    <option>Northwest Territories</option>
                                    <option>Nova Scotia</option>
                                    <option>Nunavut</option>
                                    <option>Ontario</option>
                                    <option>Prince Edward Island</option>
                                    <option>Quebec</option>
                                    <option>Saskatchewan</option>
                                    <option>Yukon</option>
                                </select>
                            </div>
                        </div>
                        <div className={shippingScreenStyle.shippingScreenCityFormRow}>
                            <div className={shippingScreenStyle.shippingScreenPostalCodeContainer}>
                                <label
                                    htmlFor={'postalCode'}
                                    className={shippingScreenStyle.shippingScreenPostalCodeLabel}
                                >
                                    Postal Code<span>*</span>
                                </label>
                                <input
                                    type={'postalCode'}
                                    id={'postalCode'}
                                    className={shippingScreenStyle.shippingScreenPostalCodeInput}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={shippingScreenStyle.shippingScreenCountryContainer}>
                                <label
                                    htmlFor={'country'}
                                    className={shippingScreenStyle.shippingScreenCountryLabel}
                                >
                                    Country<span>*</span>
                                </label>
                                <input
                                    type={'country'}
                                    id={'country'}
                                    className={shippingScreenStyle.shippingScreenCountryInput}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className={shippingScreenStyle.shippingScreenButton}>
                            Continue
                        </button>
                    </form>
                    <p className={shippingScreenStyle.shippingScreenlegend}>*required</p>
                </div>
            </div>
        </Fragment>
    );
};

export default ShippingScreen;
