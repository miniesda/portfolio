import React from 'react';
import './App.css';
import ThreeRenderer from './renderer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Portfolio</h1>
        <h2>Work in Progress</h2>
        <ThreeRenderer path='/portfolio/glb/chibi.glb' 
        animated={true} animatedMP4Model={['/portfolio/img/screen.mp4']}animatedModelName={['screen']}>
        </ThreeRenderer>
      </header>
    </div>
  );
}

export default App;
