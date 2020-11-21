import { React, useLayoutEffect, useState } from 'react';
import { ContentCard, Spinner } from '../../components';
import './styles.css';

/**
 * Prepares the catlog of anime category
 */
function Catalog(props) {
    const { uri, topic } = props;
    const [cards, setCards] = useState([]);
    const [queries, setQueries] = useState({
        text: '',
        limit: 16,
        page: 1,
    });
    const [inputValue, setInputValue] = useState('');
    const [isLoadingMore, setLoadingMore] = useState(false);
    const [api, setApi] = useState('');

    useLayoutEffect(() => {
        (function() {
            if (queries.text.length) {
                getCards();
            }
        })();
    }, [queries.page, queries.text, props]);

    /**
     *
     * @param {Object} queries - get data for the queries.
     */
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

    /**
     * append cards
     */
    const getCards = async () => {
        const { results } = await getData(queries);
        if(results) {
            const newCards = getCardInstance(results);
            newCards.length && setCards((cards) => ([...cards, newCards]));
        }
    }

    /**
     *
     * @param {Array} list - list of cards
     * create react node and saves it in the state
     */
    const getCardInstance = (list=[]) => {
        const cards = [];
        list.length && list.forEach((anime) => {
            const {mal_id, ...otherProps} = anime;
            cards.push(<ContentCard key={mal_id} {...otherProps}/>)
        });
        return cards;
    }

    /**
     * update query with page
     */
    const loadMore = () => {
        setQueries(({page=1, ...otherProps}) => ({page: page+1, ...otherProps}));
    }

    /**
     *
     * @param {Object} event - event object
     * sets input value
     */
    const handleInputValue = (event) => {
        event.preventDefault();
        setInputValue(event.target.value);
    }

    /**
     *
     * @param {Object} event - event object
     * trigger data fetch when enter is captured in input
     */
    const triggerEvent = (event) => {
        if (event.key === 'Enter') {
            getNewData(event);
        }
    }

    /**
     *
     * @param {Object} event - event object
     * trigger the new data fetch and update the steps
     */
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
                    placeholder="search for an anime, e.g. Deathnote" autoComplete="off"
                    onChange={(event) => handleInputValue(event)} onKeyDown={event => triggerEvent(event)}/>
                <button className="search-button" onClick={(event) => getNewData(event)}>Go</button>
            </div>
            <div style={{alignSelf: 'left'}}>
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
