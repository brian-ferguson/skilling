import React from 'react';
import {PlayerContextProvider} from "./context";
import Activity from "./components/Activity";
import Inventory from "./components/Inventory";

var snek = {
	"name": "Snake",
	"id": "d57d89e2-c088-4726-bcfe-e1af37d80f3c",
	"source": "/imgs/snek.svg",
  	"stacks": true,
  	"quantity": 1,
};

var frog = {
	"name": "Frog",
	"id": "d6a58a3d-957e-493b-a7ba-8aca50668e57",
	"source": "/imgs/frog.svg",
  	"stacks": true,
 	"quantity": 1,
};

const App = () => {
	return <PlayerContextProvider>
		<div className="App" style={{display: 'flex', flexDirection: 'column'}}>
			<Activity name="SnekNest" source='/imgs/sneknest.png' dropClicks={10} drop={snek} id="d57d89e2-c088-4726-bcfe-e1af37d80f3c" />
    		<Activity name="FrogNest" source='/imgs/sneknest.png' dropClicks={10} drop={frog} id="d6a58a3d-957e-493b-a7ba-8aca50668e57" />
			<Inventory />
		</div>
	</PlayerContextProvider>
}

export default App;
