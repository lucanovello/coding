import footerStyle from './Footer.module.css';
import {
    RiFacebookFill,
    RiTwitterFill,
    RiLinkedinFill,
    RiInstagramLine,
    RiGithubFill,
} from 'react-icons/ri';
import { Link } from 'react-router-dom';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <div className={footerStyle.footerContainer}>
            <div className={footerStyle.footerLinksContainer}>
                <div className={footerStyle.footerLogo}>
                    <Link to="/">{'Logo'}</Link>
                </div>
                <Link to="/" className={footerStyle.footerLinksTitle}>
                    {'Links'}
                </Link>
                <div className={footerStyle.footerAbout}>
                    <p>Sit amet mauris commodo venenatis imperdiet massa tincidunt nunc.</p>
                    <p>
                        Odio morbi quis commodo odio aenean sed adipiscing. Tempor orci eu lobortis
                        elementum nibh.
                    </p>
                </div>
                <div className={footerStyle.footerLinksList}>
                    <ul>
                        <li>
                            <Link to="/products/?sort=featured">Featured</Link>
                        </li>
                        <li>
                            <Link to="/products/?sort=featured">Best Sellers</Link>
                        </li>
                        <li>
                            <Link to="/products/?sort=featured">New Arrivals</Link>
                        </li>
                        <li>
                            <Link to="/products/?sort=featured">Trending</Link>
                        </li>
                        <li>
                            <Link to="/products/?sort=artist">Artists</Link>
                        </li>
                        <li>
                            <Link to="/products/?sort=genre">Genres</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={footerStyle.footerCopyright}>
                <div className={footerStyle.footerCopyrightSocial}>
                    {' '}
                    <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                        {' '}
                        <RiFacebookFill
                            className={`${footerStyle.footerCopyrightSocialLink} ${footerStyle.footerCopyrightSocialFacebook}`}
                        />
                    </a>
                    <a href="https://twitter.com/" target="_blank" rel="noreferrer">
                        {' '}
                        <RiTwitterFill
                            className={`${footerStyle.footerCopyrightSocialLink} ${footerStyle.footerCopyrightSocialTwitter}`}
                        />
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                        {' '}
                        <RiInstagramLine
                            className={`${footerStyle.footerCopyrightSocialLink} ${footerStyle.footerCopyrightSocialInstagram}`}
                        />
                    </a>
                    <a href="https://ca.linkedin.com/" target="_blank" rel="noreferrer">
                        {' '}
                        <RiLinkedinFill
                            className={`${footerStyle.footerCopyrightSocialLink} ${footerStyle.footerCopyrightSocialLinkedin}`}
                        />
                    </a>
                    <a
                        href="https://github.com/lunovello/ecommerce-site-project"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {' '}
                        <RiGithubFill
                            className={`${footerStyle.footerCopyrightSocialLink} ${footerStyle.footerCopyrightSocialGithub}`}
                        />
                    </a>
                </div>
                <p className={footerStyle.footerCopyrightText}>
                    {' '}
                    Copyright &copy; {year}
                    {' | '}
                    <a
                        className={footerStyle.footerCopyrightName}
                        href="https://www.lucanovello.com"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Luca Novello
                    </a>
                    {' | '}All rights Reserved
                </p>
            </div>
        </div>
    );
};

export default Footer;
