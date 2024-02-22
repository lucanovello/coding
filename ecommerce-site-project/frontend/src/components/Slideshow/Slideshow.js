import { Link } from 'react-router-dom';
import LoadingBox from '../LoadingBox/LoadingBox';
import slideshowStyles from './Slideshow.module.css';

function Slideshow(props) {
    return props.loading ? (
        <LoadingBox />
    ) : (
        <div
            className={slideshowStyles.slideshowContainer}
            style={{
                background: `radial-gradient(rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7)), center / cover no-repeat url(${props.slide.image})`,
                // background: `radial-gradient(rgba(0,0,0,0.1) ,rgba(0,0,0,0.8)) , 70% / cover no-repeat url(${props.slide.image})`,
                // background: `50% 50% / cover no-repeat url('./images/wassily-kandinsky-title.jpg')`,
            }}
        >
            <div className={slideshowStyles.slideshowText}>
                <h1>Brand Name</h1>
                <span></span>
                <p>Call to action statement now!</p>
                <Link to="/products">
                    <button className={slideshowStyles.slideshowBtn}>Learn More</button>
                </Link>
            </div>
        </div>
    );
}

export default Slideshow;
