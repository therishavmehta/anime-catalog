import { React } from 'react';
import './styles.css';

/**
 * Spinner for async events
 */
function Spinner() {
    return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>;
}

export default Spinner;
