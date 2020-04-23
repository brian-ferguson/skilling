import React from 'react';
import { PlayerContextProvider } from "./context";
import Inventory from "./components/Inventory";
import Sidebar from './components/Sidebar.js';
import View from './components/View.js';
import './main.css';

const App = () => {
	return <div style={{width: '100%', height: '100%', display: 'flex', position: 'absolute'}}>
		<PlayerContextProvider>
			<Sidebar />
			<View />
			<Inventory />
		</PlayerContextProvider>
	</div>
}

export default App;
