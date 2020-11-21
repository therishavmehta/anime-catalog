import { React, useLayoutEffect, useState } from 'react';
import { ContentCard, Spinner } from '../../components';
import './styles.css';

function Catalog(props) {
    const [cards, setCards] = useState([]);
    const [queries, setQueries] = useState({
        text: '',
        limit: 16,
        page: 1,
    });
    const [inputValue, setInputValue] = useState('');
    const [isLoadingMore, setLoadingMore] = useState(false);
    const [api, setApi] = useState('');
    const {uri, topic} = props;

    useLayoutEffect(() => {
        (function() {
            if (queries.text.length) {
                getCards();
            }
        })();
    }, [queries.page, queries.text, props]);

    const getData = async (queries) => {
        const {text='', limit, page=1 } = queries;
        try {
            setLoadingMore(() => true);
            const notSensitiveText = text.toLowerCase();
            const query = `${uri}/search/${topic}?q=${notSensitiveText}&limit=${limit}&page=${page}`;
            setApi(() => (`${uri}/search/${topic}?q=${notSensitiveText}`));
            const getResponse = await fetch(query);
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
        if(results) {
            const newCards = getCardInstance(results);
            newCards.length && setCards((cards) => ([...cards, newCards]));
        }
    }

    const getCardInstance = (list=[]) => {
        const cards = [];
        list.length && list.forEach((anime) => {
            const {mal_id, ...otherProps} = anime;
            cards.push(<ContentCard key={mal_id} {...otherProps}/>)
        });
        return cards;
    }
    const loadMore = () => {
        setQueries(({page=1, ...otherProps}) => ({page: page+1, ...otherProps}));
    }


    const handleInputValue = (event) => {
        event.preventDefault();
        setInputValue(event.target.value);
    }

    const triggerEvent = (event) => {
        if (event.key === 'Enter') {
            getNewData(event);
        }
    }

    const getNewData = async (event) => {
        event.preventDefault();
        if(inputValue.length < 3) {
            alert("Error: Requires atleast 3 or more characters");
            return;
        } else if (queries.text !== inputValue) {
            setCards([]);
            setQueries(({ text, page, ...otherProps }) => ({ text: inputValue, page: 1, ...otherProps }));
        }
    }

    return (
        <div className="catalog-container">
            <div className="search-box">
                <input id="search-query" name="text" type="text" value={inputValue}
                    placeholder="search for an anime, e.g. Naruto" autoComplete="off"
                    onChange={(event) => handleInputValue(event)} onKeyDown={event => triggerEvent(event)}/>
                <button className="search-button" onClick={(event) => getNewData(event)}>Go</button>
            </div>
            <div>
                <span className="requesting">Requesting: </span>
                <span className="api-text">{api || 'API Request URL will appear here'}</span>
            </div>
            <div className="card-content">
                {cards}
            </div>
            {isLoadingMore && <Spinner />}
            {!isLoadingMore && cards.length ? <a className="loadMore" onClick={loadMore}>Load more...</a>: null}
        </div>
    )
}

export default Catalog;
