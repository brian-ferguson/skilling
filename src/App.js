import React from 'react';
import { PlayerContextProvider } from "./context";
import Menu from "./components/Menu";
import Sidebar from './components/Sidebar.js';
import View from './components/View.js';
import './main.css';

const App = () => {
	return <div style={{width: '100%', height: '100%', display: 'flex', position: 'absolute'}}>
		<PlayerContextProvider>
			<Sidebar />
			<View />
			<Menu />
		</PlayerContextProvider>
	</div>
}

export default App;
