import Axios from 'axios';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import signInScreenStyle from './SignInScreen.module.css';
import { Store } from '../../Store';
import { getError } from '../../utils';

const SignUpScreen = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectUrl ? redirectUrl : './';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            const { data } = await Axios.post('./api/users/signup', {
                name,
                email,
                password,
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || './');
        } catch (err) {
            toast.error(getError(err));
        }
    };

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    return (
        <div className={signInScreenStyle.signInScreenContainer}>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>

            <form className={signInScreenStyle.signInContainer} onSubmit={onSubmitHandler}>
                <div className={signInScreenStyle.signInTitle}>Sign Up</div>
                <div className={signInScreenStyle.signInEmailContainer}>
                    <label htmlFor={'name'} className={signInScreenStyle.signInEmailLabel}>
                        Name
                    </label>
                    <input
                        type={'text'}
                        id={'name'}
                        className={signInScreenStyle.signInEmailInput}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className={signInScreenStyle.signInEmailContainer}>
                    <label htmlFor={'email'} className={signInScreenStyle.signInEmailLabel}>
                        Email address
                    </label>
                    <input
                        type={'email'}
                        id={'email'}
                        className={signInScreenStyle.signInEmailInput}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={signInScreenStyle.signInPasswordContainer}>
                    <label htmlFor={'password'} className={signInScreenStyle.signInPasswordLabel}>
                        Password
                    </label>
                    <input
                        type={'password'}
                        id={'password'}
                        className={signInScreenStyle.signInPasswordInput}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={'off'}
                        required
                    />
                </div>
                <div className={signInScreenStyle.signInPasswordContainer}>
                    <label
                        htmlFor={'confirmPassword'}
                        className={signInScreenStyle.signInPasswordLabel}
                    >
                        Confirm Password
                    </label>
                    <input
                        type={'password'}
                        id={'confirmPassword'}
                        className={signInScreenStyle.signInPasswordInput}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete={'off'}
                        required
                    />
                </div>

                <button type="submit" className={signInScreenStyle.signInButton}>
                    Create Account
                </button>
            </form>
            <div className={signInScreenStyle.signInCreateNew}>
                {'Already have an account? '}
                <Link to={`/signin?redirect=${redirect}`}>
                    <div className={signInScreenStyle.signInCreateNewLink}>{'Sign In'}</div>
                </Link>
            </div>
        </div>
    );
};

export default SignUpScreen;
