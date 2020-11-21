import { React } from 'react';
import './styles.css';

function ContentCard(props) {
    const { image_url, title, url } = props;

    const openCardInNewTab = (url) => {
        window.open(url, "_blank");
    }

    return (
        <a className="card" onClick={() => openCardInNewTab(url)}>
            <div className="card-image">
                <img src={image_url} alt={title} />
            </div>
            <div className="card-name">
                <h4>{title}</h4>
            </div>
        </a>
    )
}

export default ContentCard;
