import React from 'react';
import './App.css';
import renderer from './renderer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Portfolio</h1>
        <h2>Work in Progress</h2>
        {renderer('./glb/chibi.glb', 0, true, './img/ezgif-309121c2291ff113.mp4', 'screen')}
      </header>
    </div>
  );
}

export default App;
