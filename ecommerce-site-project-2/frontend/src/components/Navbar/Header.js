import headerStyling from './Header.module.css';
import { RiCloseLine } from 'react-icons/ri';
import { useState } from 'react';

function Header(props) {
    const [isHeaderOpen, setIsHeaderOpen] = useState(true);

    return !isHeaderOpen ? (
        <header
            id="Header"
            className={`${headerStyling.HeaderContainer} ${headerStyling.collapse}`}
        >
            <p>{props.text}</p>
        </header>
    ) : (
        <header id="Header" className={headerStyling.HeaderContainer}>
            <div>{props.text}</div>
            <button
                className={headerStyling.HeaderCloseContainer}
                onClick={() => setIsHeaderOpen(false)}
            >
                <RiCloseLine className={headerStyling.HeaderCloseIcon} />
            </button>
        </header>
    );
}

export default Header;
