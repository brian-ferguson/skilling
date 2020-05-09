import React, {useState, useEffect, useContext } from 'react'
import { PlayerContext } from "../context";
import Activity from '../components/Activity';
import axios from 'axios'

const activity_styles = {
	display: 'flex',
	flexDirection: 'row',
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

const chat_span_styles = {
	padding: '5px 0 0 5px'
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

const View = () => {
	const playerContext = useContext(PlayerContext);
	const { locationActivities, locationActions, messages, user, setUser } = playerContext
	const [chat, setChat] = useState([])
	const [visible, setVisible] = useState(true)
	const [query, setQuery] = useState('')

	useEffect(() => {
		setChat([...messages].reverse())
	}, [messages])

	const login = (e) => {
		e.preventDefault()
		axios.get('http://localhost:5000/users/')
			.then(res => {
				if (res.data.filter(e => e.username === query).length){
					setUser(query)
				} else {
					axios.post('http://localhost:5000/users/add', {username: query})
					setUser(query)
				}
			})
	}

	const logout = () => {
		setUser(null)
	}

	const onChange = (e) => {
		setQuery(e.target.value)
	}

	return <div style={{flexGrow: 2, background: '#C0FFEE', display: 'flex', flexDirection: 'column'}}>
		{/* Titan Panel */}
		{!user
			? <div style={titan_panel_styles}>
				<form style={{ margin: 8}}>
					<input value={query} onChange={onChange}/>
					<button onClick={login}>login</button>
				</form>
			</div>
			: <div style={titan_panel_styles}>
				<p style={{color: '#FFF'}}>Welcome {user}</p>
				<button onClick={logout}>logout</button>
			</div>}

		{/* Activities */}
		<div style={activity_styles}>
			{locationActivities.map((e, i) => <Activity key={i} id={e.id} name={e.name} source={e.source} actions={locationActions[i]} />)}
		</div>

		{/* System Logs */}
		<span style={chat_title_styles} onClick={() => setVisible(!visible)}>System Logs</span>
		{visible && <div style={chat_styles}>
			{chat.map((e, i) => <span style={chat_span_styles} key={i}>{e}</span>)}
		</div>}
	</div>
}

export default View
