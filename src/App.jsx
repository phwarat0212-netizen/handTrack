import React from 'react'
import HandTracker from './components/HandTracker'
import './App.css'

function App() {
  return (
    <div id="root-container">
      <header className="app-header">
        <h1>HandSense AI</h1>
        <p>Real-time Neural Hand Landmark Detection</p>
      </header>

      <main className="app-main">
        <HandTracker />
      </main>

      <footer className="app-footer">
        <p>Created by Warat</p>
        <p>Powered by MediaPipe Vision Tasks</p>
      </footer>
    </div>
  )
}

export default App
