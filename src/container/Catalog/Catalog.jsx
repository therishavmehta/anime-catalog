import { React, useLayoutEffect, useState } from 'react';
import { ContentCard } from '../../components';
import './styles.css';

function Catalog(props) {
    const [searchResult, setResult] = useState({});
    const [cards, setCards] = useState([]);
    useLayoutEffect(async () => {
        const getResponse = await fetch('https://api.jikan.moe/v3/search/anime?q=naruto&limit=16');
        const response =await getResponse.json();
        const {results} = response;
        // setCards(getCards(results));
        setResult(results);
        setCards(getCards(results));
    }, []);

    const getCards = (list) => {
        const cards = [];
        list.forEach((anime) => {
            const {mal_id, ...otherProps} = anime;
            cards.push(<ContentCard key={mal_id} {...otherProps}/>)
        });
        return cards;
    }
    return (
        <div className="catalog-container">
            <div>
                <div className="search-box">
                    <input id="search-query" type="text" placeholder="search for an anime, e.g. Naruto" />
                    <button id="search">Go</button>
                </div>
                <div className="card-content">
                    {cards}
                </div>
            </div>
        </div>
    )
}

export default Catalog;
