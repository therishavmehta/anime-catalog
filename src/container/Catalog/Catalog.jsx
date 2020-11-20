import { React, useLayoutEffect, useState } from 'react';
import { ContentCard, Spinner } from '../../components';
import './styles.css';

function Catalog(props) {
    const [cards, setCards] = useState([]);
    const [queries, setQueries] = useState({
        text: 'naruto',
        limit: 16,
        page: 1,
    });
    const [isLoadingMore, setLoadingMore] = useState(false);

    useLayoutEffect(() => {
        getCards();
    }, [queries.page]);

    const getData = async (queries) => {
        const {text='', limit, page=1} = queries;
        try {
            const notSensitiveText = text.toLowerCase();
            setLoadingMore(true);
            const getResponse = await fetch(`https://api.jikan.moe/v3/search/anime?q=${notSensitiveText}&limit=${limit}&page=${page}`);
            const response = await getResponse.json();
            return response;
        } catch(error) {
            throw error;
        } finally {
            setLoadingMore(false);
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
    const loadMore = () => {
        setQueries(({page=1, ...otherProps}) => ({page: page+1, ...otherProps}));
    }

    const handleInputChange = (event) => {
        setQueries(({text, ...otherProps}) => ({[event.target.name]: event.target.value, ...otherProps}));
    }

    const fetchNewData = () => {
        setCards([]);
        setQueries(({page, ...otherProps}) => ({page:1, ...otherProps}));
        getCards();
    }

    return (
        <div className="catalog-container">
            <div className="search-box">
                <input id="search-query" name="text" type="text" value={queries.text}
                placeholder="search for an anime, e.g. Naruto"
                onChange={(event) => handleInputChange(event)}/>
                <button id="search" onClick={() => fetchNewData()}>Go</button>
            </div>
            <div className="card-content">
                {cards}
            </div>
            <Spinner />
            <a className="loadMore" onClick={loadMore}>Load more...</a>
        </div>
    )
}

export default Catalog;
