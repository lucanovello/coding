import axios from 'axios';
import { React, useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Store } from '../../Store';
import { getError } from '../../utils';
import profileScreenStyle from './ProfileScreen.module.css';

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };

        default:
            return state;
    }
};

function ProfileScreen() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false,
    });

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            const { data } = await axios.put(
                '/api/users/profile',
                {
                    name,
                    email,
                    password,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Profile Updated');
        } catch (err) {
            dispatch({
                type: 'FETCH_FAIL',
            });
            toast.error(getError(err));
        }
    };

    return (
        <div className={profileScreenStyle.profileScreenContainer}>
            <Helmet>
                <title>User Profile</title>
            </Helmet>
            <h2 className={profileScreenStyle.profileTitle}>{`User Profile`}</h2>
            <form className={profileScreenStyle.profileContainer} onSubmit={onSubmitHandler}>
                <div className={profileScreenStyle.profileWrapper}>
                    <label htmlFor={'name'} className={profileScreenStyle.profileLabel}>
                        Name
                    </label>
                    <input
                        type={'text'}
                        id={'name'}
                        value={name}
                        className={profileScreenStyle.profileInput}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className={profileScreenStyle.profileWrapper}>
                    <label htmlFor={'email'} className={profileScreenStyle.profileLabel}>
                        Email address
                    </label>
                    <input
                        type={'email'}
                        id={'email'}
                        value={email}
                        className={profileScreenStyle.profileInput}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={profileScreenStyle.profileWrapper}>
                    <label htmlFor={'password'} className={profileScreenStyle.profileLabel}>
                        New Password
                    </label>
                    <input
                        type={'password'}
                        id={'password'}
                        className={profileScreenStyle.profileInput}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={'off'}
                        required
                    />
                </div>

                <div className={profileScreenStyle.profileWrapper}>
                    <label htmlFor={'confirmPassword'} className={profileScreenStyle.profileLabel}>
                        Confirm New Password
                    </label>
                    <input
                        type={'password'}
                        id={'confirmPassword'}
                        className={profileScreenStyle.profileInput}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete={'off'}
                        required
                    />
                </div>

                <button type="submit" className={profileScreenStyle.profileButton}>
                    Update Profile
                </button>
            </form>
        </div>
    );
}

export default ProfileScreen;
