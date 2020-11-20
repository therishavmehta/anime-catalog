import { React, useLayoutEffect, useState } from 'react';
import { ContentCard } from '../../components';
import './styles.css';

function Catalog(props) {
    const [cards, setCards] = useState([]);
    const [queries, setQueries] = useState({
        text: 'naruto',
        limit: 16,
        page: 1,
    });

    useLayoutEffect(() => {
        getCards();
    }, [queries]);

    const getData = async (queries) => {
        const {text, limit, page=1} = queries;
        try {
            const getResponse = await fetch(`https://api.jikan.moe/v3/search/anime?q=${text}&limit=${limit}&page=${page}`);
            const response = await getResponse.json();
            return response;
        } catch(error) {
            throw error;
        }
    }

    const getCards = async () => {
        const { results } = await getData(queries);
        const newCards = getCardInstance(results);
        setCards((cards) => ([...cards, newCards]));
    }

    const getCardInstance = (list) => {
        const cards = [];
        list.forEach((anime) => {
            const {mal_id, ...otherProps} = anime;
            cards.push(<ContentCard key={mal_id} {...otherProps}/>)
        });
        return cards;
    }
    const loadMore = async () => {
        setQueries(({page, ...otherProps}) => ({page: page+1, ...otherProps}));
    }
    return (
        <div className="catalog-container">
            <div className="search-box">
                <input id="search-query" type="text" placeholder="search for an anime, e.g. Naruto" />
                <button id="search">Go</button>
            </div>
            <div className="card-content">
                {cards}
            </div>
            <a id="loadMore" onClick={() => loadMore()}>Load more...</a>
        </div>
    )
}

export default Catalog;
