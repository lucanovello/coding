import navbarStyle from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { MdOutlineShoppingBag, MdShoppingBag } from 'react-icons/md';
import { RiPhoneFill } from 'react-icons/ri';
import { Fragment, useContext, useState } from 'react';
import { Store } from '../../Store';
import { FaSearch } from 'react-icons/fa';

function NavbarMenu(props) {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;

    const [isMobileNavExpand, setIsMobileNavExpand] = useState(false);
    const [mobileNavIconClass, setMobileNavIconClass] = useState(
        navbarStyle.mobileNavIconNavWrapper
    );

    const signoutHandler = () => {
        ctxDispatch({ type: 'USER_SIGNOUT' });
        localStorage.removeItem('userInfo');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');
    };

    function closeMobileNavHandler() {
        setIsMobileNavExpand(false);
        !isMobileNavExpand
            ? setMobileNavIconClass(navbarStyle.mobileNavIconNavWrapperClose)
            : setMobileNavIconClass(navbarStyle.mobileNavIconNavWrapper);
    }

    return (
        <div className={navbarStyle.navbarTop}>
            <div className={navbarStyle.navbarLogo}>
                <Link to="/" onClick={closeMobileNavHandler}>
                    <h1>Logo</h1>
                </Link>
            </div>
            <div className={navbarStyle.navbarInfoContainer}>
                <div className={navbarStyle.navbarInfoLine}>
                    <div className={navbarStyle.customerServiceContainer}>
                        <RiPhoneFill className={navbarStyle.navbarIcons} />{' '}
                        <p className={navbarStyle.searchBoxContainerTel}>1.800.123.4567</p>
                        <p className={navbarStyle.separators}>{' | '}</p>
                    </div>
                    {props.userInfo ? (
                        <div className={navbarStyle.profileLinkContainer}>
                            <p className={navbarStyle.profileLinkTitle}> {props.userInfo.name}</p>
                            <div className={navbarStyle.profileLinkDropdownContainer}>
                                <Link to={'./profile'} className={navbarStyle.profileLink}>
                                    Profile
                                </Link>
                                <Link to={'./orderhistory'} className={navbarStyle.profileLink}>
                                    Order History
                                </Link>
                                <Link
                                    to={'./'}
                                    onClick={signoutHandler}
                                    className={navbarStyle.profileLink}
                                >
                                    Sign Out
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className={navbarStyle.customerServiceContainer}>
                            <Link to="/signin" className={navbarStyle.searchBoxContainerLink}>
                                Sign In
                            </Link>
                            {' or '}
                            <Link to="/signup" className={navbarStyle.searchBoxContainerLink}>
                                {'Create an account'}
                            </Link>
                        </div>
                    )}
                </div>

                <div className={navbarStyle.navbarInfoLine}>
                    <div className={navbarStyle.customerServiceContainer}>
                        <Link to="/cart">
                            {cart.cartItems.length > 0 ? (
                                <div className={navbarStyle.customerServiceContainer}>
                                    <div className={navbarStyle.shoppingCartQuantityWrapper}>
                                        <MdShoppingBag
                                            className={navbarStyle.navbarIconsShopping}
                                        />
                                        <p className={navbarStyle.shoppingCartQuantity}>
                                            {cart.cartItems.length}
                                        </p>
                                    </div>
                                    <p className={navbarStyle.searchBoxContainerLink}>
                                        Shopping Cart
                                    </p>
                                </div>
                            ) : (
                                <div className={navbarStyle.customerServiceContainer}>
                                    <div className={navbarStyle.shoppingCartQuantityWrapper}>
                                        <MdOutlineShoppingBag
                                            className={navbarStyle.navbarIconsShopping}
                                        />
                                    </div>
                                    <p className={navbarStyle.searchBoxContainerLink}>
                                        Shopping Cart
                                    </p>
                                </div>
                            )}
                        </Link>
                    </div>

                    <p className={navbarStyle.separators}>{' | '}</p>

                    <div className={navbarStyle.customerServiceContainer}>
                        <form className={navbarStyle.searchBoxContainer}>
                            <input
                                type="search"
                                className={navbarStyle.searchBox}
                                placeholder="Search..."
                            ></input>
                            <button className={navbarStyle.searchButton}>
                                <FaSearch className={navbarStyle.searchButtonIcon} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className={navbarStyle.mobileNavContainer}>
                <div className={navbarStyle.customerServiceContainer}>
                    <Link to="/cart" onClick={closeMobileNavHandler}>
                        {cart.cartItems.length > 0 ? (
                            <div className={navbarStyle.shoppingCartQuantityWrapper}>
                                <MdShoppingBag className={navbarStyle.mobileNavIconShopping} />
                                <p className={navbarStyle.mobileshoppingCartQuantity}>
                                    {cart.cartItems.length}
                                </p>
                            </div>
                        ) : (
                            <div className={navbarStyle.shoppingCartQuantityWrapper}>
                                <MdOutlineShoppingBag
                                    className={navbarStyle.mobileNavIconShopping}
                                />
                            </div>
                        )}
                    </Link>
                </div>
                <div
                    className={mobileNavIconClass}
                    onClick={() => {
                        setIsMobileNavExpand(!isMobileNavExpand);
                        !isMobileNavExpand
                            ? setMobileNavIconClass(navbarStyle.mobileNavIconNavWrapperClose)
                            : setMobileNavIconClass(navbarStyle.mobileNavIconNavWrapper);
                    }}
                >
                    <div
                        className={
                            isMobileNavExpand
                                ? navbarStyle.mobileNavIconNavLineClose1
                                : navbarStyle.mobileNavIconNavLine1
                        }
                    ></div>
                    <div
                        className={
                            isMobileNavExpand
                                ? navbarStyle.mobileNavIconNavLineClose2
                                : navbarStyle.mobileNavIconNavLine2
                        }
                    ></div>
                    <div
                        className={
                            isMobileNavExpand
                                ? navbarStyle.mobileNavIconNavLineClose3
                                : navbarStyle.mobileNavIconNavLine3
                        }
                    ></div>
                    <div
                        className={
                            isMobileNavExpand
                                ? navbarStyle.mobileNavIconNavLineClose4
                                : navbarStyle.mobileNavIconNavLine4
                        }
                    ></div>
                </div>
                <nav
                    className={
                        isMobileNavExpand
                            ? navbarStyle.mobileNavMenuWrapper
                            : navbarStyle.mobileNavMenuWrapperClose
                    }
                >
                    {props.userInfo ? (
                        <Fragment>
                            <Link to={'./profile'} onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Profile</h2>
                            </Link>
                            <Link to={'./orderhistory'} onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Order History</h2>
                            </Link>
                            <Link to="/products/?sort=featured" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Featured</h2>
                            </Link>
                            <Link to="/products/?sort=featured" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Best Sellers</h2>
                            </Link>
                            <Link to="/products/?sort=featured" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>New Arrivals</h2>
                            </Link>
                            <Link to="/products/?sort=featured" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Trending</h2>
                            </Link>
                            <Link to="/products/?sort=artist" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Artists</h2>
                            </Link>
                            <Link to="/products/?sort=genre" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Genres</h2>
                            </Link>
                            <Link
                                to={'./'}
                                onClick={() => {
                                    signoutHandler();
                                    closeMobileNavHandler();
                                }}
                            >
                                <h2 className={navbarStyle.mobileNavMenuLink}>Sign Out</h2>
                            </Link>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Link to="/products/?sort=featured" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Featured</h2>
                            </Link>
                            <Link to="/products/?sort=featured" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Best Sellers</h2>
                            </Link>
                            <Link to="/products/?sort=featured" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>New Arrivals</h2>
                            </Link>
                            <Link to="/products/?sort=featured" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Trending</h2>
                            </Link>
                            <Link to="/products/?sort=artist" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Artists</h2>
                            </Link>
                            <Link to="/products/?sort=genre" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Genres</h2>
                            </Link>
                            <Link to="/signin" onClick={closeMobileNavHandler}>
                                <h2 className={navbarStyle.mobileNavMenuLink}>Sign In</h2>
                            </Link>
                        </Fragment>
                    )}
                </nav>
            </div>
        </div>
    );
}

export default NavbarMenu;
