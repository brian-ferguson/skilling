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

const App = () => {
	return <PlayerContextProvider>
		<div className="App" style={{display: 'flex', flexDirection: 'column'}}>
			<Area name="Nest" source='/imgs/sneknest.png' dropClicks={10} drop={snek} id="d57d89e2-c088-4726-bcfe-e1af37d80f3c" />
			<Inventory />
		</div>
	</PlayerContextProvider>
}

export default App;
