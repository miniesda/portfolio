import React from 'react';
import './App.css';
import ThreeRenderer from './renderer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Portfolio</h1>
        <h2>Work in Progress</h2>
        <ThreeRenderer path='https://raw.githubusercontent.com/miniesda/portfolio/main/my-app/src/glb/chibi.glb' 
        animated={true} animatedMP4Model='https://raw.githubusercontent.com/miniesda/portfolio/main/my-app/src/img/ezgif-309121c2291ff113.mp4' animatedModelName='screen'/>
      </header>
    </div>
  );
}

export default App;
