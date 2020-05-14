import React, {useState, useContext } from 'react'
import { PlayerContext } from "../context";
import Activity from '../components/Activity';
import axios from 'axios'


//CSS Styles
const activity_styles = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	flexGrow: 2
}

const chat_styles = {
	alignSelf: 'flex-end',
	display: 'flex',
	flexDirection: 'column',
	background: '#FFF',
	height: 200,
	width: '100%',
	overflow: 'auto'
}

const chat_title_styles = {
	borderTop: '2px solid #333',
	borderBottom: '2px solid #333',
	textAlign: 'center',
	userSelect: 'none',
	cursor: 'pointer',
	background: '#FFF',
	fontSize: 18
}

const titan_panel_styles = {
	width: '100%',
	height: 40,
	background: '#333',
	borderBottom: '1px solid #FFF',
	display: 'flex',
	flexDirection: 'row'
}

const register_header_styles = {
	textAlign: 'center',
	width: '50%'
}

const register_container_styles = {
	position: 'absolute', 
	top: 0, right: 0, left: 0, bottom: 0, 
	width: '100%', 
	background: '#937251'
}

const header_styles = {
	width: 300, 
	height: 400,
	margin: '100px auto 0', 
	background: '#FFF', 
	border: '2px solid #333'
}

const menu_styles = {
	width: 150, 
	margin: '10px auto 0', 
	border: '2px solid #333', 
	display: 'flex', 
	userSelect: 'none', 
	cursor: 'pointer'
}

const login_register = {
	width: '75%', 
	margin: '10px auto 0', 
	background: '#FFF', 
	border: '2px solid #333', 
	textAlign: 'center'
}

const form_styles = {
	display: 'flex', 
	flexDirection: 'column', 
	width: 150, 
	margin: '0 auto'
}

const button_styles = {
	border: '1px solid #7D7D7D',
	borderRadius: '0.25rem',
	background: '#505050',
	color: '#FFF',
	fontFamily: 'system-ui',
	fontSize: '1rem',
	lineHeight: 1.2,
	whiteSPace: 'nowrap',
	textDecoration: 'none',
	padding: '0.25rem 0.5rem',
	cursor: 'pointer'
}


/* ****************************
* Start of Register Component *
******************************/
const Register = ({ query, onChange, login}) => {
	const [status, setStatus] = useState('login')

	return <div style={register_container_styles}>
		<div style={header_styles}>

			{/* Title */}
			<div style={{textAlign: 'center', fontSize: 36, padding: 25}}>
				Welcome to Skilling
			</div>

			{/* Toggle Login / Register Menu */}
			<div style={menu_styles}>
				<div 
					style={{...register_header_styles, borderRight: '2px solid #333', background: status === 'login' ? 'Gainsboro' : '#FFF'}} 
					onClick={() => setStatus('login')}
				>Login</div>
				<div 
					style={{...register_header_styles, background: status !== 'login' ? 'Gainsboro' : '#FFF'}} 
					onClick={() => setStatus('register')}
				>Register</div>
			</div>

			{/* Display Login / Register Forms */}
			{status === 'login' 
				// Login Forms
				? <div style={login_register}>
					<form style={form_styles}>
						username: <input value={query} onChange={onChange}/>
						password: <input />
						<button 
							style={{...button_styles, marginTop: 10, marginBottom: 10}} 
							onClick={login}
						>Login</button>
					</form>
				</div> 
				// Register Forms
				: <div style={login_register}>
					<form style={form_styles}>
						email: <input value={query} onChange={onChange}/>
						username: <input value={query} onChange={onChange}/>
						password: <input />
						confirm password: <input />
						<button 
							style={{...button_styles, marginTop: 10, marginBottom: 10}} 
							onClick={() => console.log('Place Register Function Here')}
						>Register</button>
					</form>
				</div>}
		</div>
	</div>
}


/* ************************
* Start of Game Component *
**************************/
const Game = ({ logout }) => {
	const playerContext = useContext(PlayerContext)
	const { locationActivities, locationActions, user } = playerContext
	const [visible, setVisible] = useState(true)
	
	return <div style={{flexGrow: 2, background: '#C0FFEE', display: 'flex', flexDirection: 'column'}}>
		{/* Titan Panel */}
		<div style={titan_panel_styles}>
			<p style={{color: '#FFF'}}>Welcome {user.username}</p>
			<button onClick={logout} style={button_styles}>logout</button>
		</div>

		{/* Activities */}
		<div style={activity_styles}>
			{locationActivities.map((e, i) => <Activity key={i} id={e.id} name={e.name} source={e.source} actions={locationActions[i]} />)}
		</div>

		{/* System Logs */}
		<span style={chat_title_styles} onClick={() => setVisible(!visible)}>System Logs</span>
		{visible && <div style={chat_styles}>
			
		</div>}
	</div> 
}

/* ************************
* Start of View Component *
**************************/
const View = () => {
	const playerContext = useContext(PlayerContext);
	const { user, setUser } = playerContext
	const [query, setQuery] = useState('')

	const login = (e) => {
		e.preventDefault()
		axios.get('http://localhost:5000/users/')
			.then(res => {
				if (res.data.filter(e => e.username.toLowerCase() === query.toLowerCase()).length){
					setUser(res.data[res.data.map(i => i.username).indexOf(query.toLowerCase())])
				} else {
					axios.post('http://localhost:5000/users/add', {username: query.toLowerCase()})
					setUser(res.data[res.data.map(i => i.username).indexOf(query.toLowerCase())])
				}
			})
	}

	const logout = () => {
		setUser(null)
		setQuery('')
	}

	const onChange = (e) => {
		setQuery(e.target.value)
	}

	//return statement starts here.
	//If a user is logged in, display the game
	//If no user is logged in, display the register/login screen
	if (!user) {
		return <Register onChange={onChange} query={query} login={login} />
	} else {
		return <Game logout={logout} />
	}
}

export default View
