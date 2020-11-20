import { React } from 'react';
import './styles.css';

function ContentCard(props) {
    const { image_url = "https://cdn.myanimelist.net/images/anime/2/18209.jpg?s=17387dbd01b8d7ff42e8ef4573da36db", title = "test", airing, synopsis, episodes, score, start_date, rated, members, end_date, url = "https://myanimelist.net/anime/7580/Ikkitousen__Xtreme_Xecutor", type} = props;

    const openCardInNewTab = (url) => {
        window.open(url, "_blank");
    }

    return (
        <a className="card" onClick={() => openCardInNewTab(url)}>
            <div className="card-image">
                <img src={image_url} alt="Avatar" />
            </div>
            <div className="card-name">
                <h4>{title}</h4>
            </div>
        </a>
    )
}

export default ContentCard;
