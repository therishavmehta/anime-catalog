import logo from './logo.svg';
import './App.css';
import { Catalog } from './container';


const uri = 'https://api.jikan.moe/v3';
const topic = 'anime';

function App() {
  return (
    <div className="app">
      <Catalog uri={uri} topic={topic}/>
    </div>
  );
}

export default App;
