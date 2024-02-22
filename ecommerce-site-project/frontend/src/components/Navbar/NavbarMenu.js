import { Link } from 'react-router-dom';
import navbarStyle from './Navbar.module.css';

function NavbarMenu() {
  return (
    <div className={navbarStyle.navbarMainMenu}>
      <ul className={navbarStyle.navbarMenuOptions}>
        <Link
          className={navbarStyle.navbarMenuLink}
          to="/products/?sort=featured"
        >
          <li>Featured</li>
        </Link>
        <Link
          className={navbarStyle.navbarMenuLink}
          to="/products/?sort=featured"
        >
          <li>Best Sellers</li>
        </Link>
        <Link
          className={navbarStyle.navbarMenuLink}
          to="/products/?sort=featured"
        >
          <li>New Arrivals</li>
        </Link>
        <Link
          className={navbarStyle.navbarMenuLink}
          to="/products/?sort=featured"
        >
          <li>Trending</li>
        </Link>
        <Link
          className={navbarStyle.navbarMenuLink}
          to="/products/?sort=artist"
        >
          <li>Artists</li>
        </Link>
        <Link className={navbarStyle.navbarMenuLink} to="/products/?sort=genre">
          <li>Genres</li>
        </Link>
      </ul>
    </div>
  );
}

export default NavbarMenu;
