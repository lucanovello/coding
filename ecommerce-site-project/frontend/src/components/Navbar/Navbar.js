import navbarStyle from './Navbar.module.css';
import NavbarMenu from './NavbarMenu';
import NavbarHeader from './NavbarHeader';
import Header from './Header';

function Navbar(props) {
    return (
        <div className={navbarStyle.navbarContainer}>
            <Header text="Free shipping on all orders. No minimum purchase" />
            <NavbarHeader userInfo={props.userInfo} />
            <NavbarMenu />
        </div>
    );
}

export default Navbar;
