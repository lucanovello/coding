import Axios from 'axios';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import signInScreenStyle from './SignInScreen.module.css';
import { Store } from '../../Store';
import { getError } from '../../utils';

const SignInScreen = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : './';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await Axios.post('./api/users/signin', {
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
                <title>Sign In</title>
            </Helmet>

            <form className={signInScreenStyle.signInContainer} onSubmit={onSubmitHandler}>
                <div className={signInScreenStyle.signInTitle}>Sign In</div>
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

                <button type="submit" className={signInScreenStyle.signInButton}>
                    Sign In
                </button>
            </form>
            <div className={signInScreenStyle.signInCreateNew}>
                {'New customer? '}
                <Link to={`/signup?redirect=${redirect}`}>
                    <div className={signInScreenStyle.signInCreateNewLink}>
                        {'Create an account'}
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default SignInScreen;
