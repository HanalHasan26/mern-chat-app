import React from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
function App() {
  return (
    <div className="App">
       <Route path="/" exact>
          <HomePage/> 
       </Route>
       <Route path="/chats">
          <ChatPage/>
       </Route>
    </div> 
  );
}

export default App;
