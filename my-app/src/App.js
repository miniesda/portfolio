import React from 'react';
import './App.css';
import renderer from './renderer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Portfolio</h1>
        <h2>Work in Progress</h2>
        {renderer('my-app/src/glb/chibi.glb')}
      </header>
    </div>
  );
}

export default App;
