import React from 'react';
import {PlayerContextProvider} from "./context";

import Item from "./components/Item";
import Area from "./components/Area";
import Inventory from "./components/Inventory";

var snek = {
  "name": "Snake",
  "id": "d57d89e2-c088-4726-bcfe-e1af37d80f3c",
  "source": "/imgs/snek.svg"
};

function App() {
  
  return (
    <div className="App">

      <PlayerContextProvider>
        <Inventory/>

        <h4>Area:</h4>

        <Area name="Nest" source='/imgs/sneknest.png' dropClicks={10} drop={snek} id="d57d89e2-c088-4726-bcfe-e1af37d80f3c"/>
      </PlayerContextProvider>




    </div>
  );
}

export default App;
