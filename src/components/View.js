import React, {useState, useEffect, useContext } from 'react'
import { PlayerContext } from "../context";
import Activity from '../components/Activity';

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

const View = () => {
	const playerContext = useContext(PlayerContext);
	const { locationActivities, locationActions, messages } = playerContext
	const [chat, setChat] = useState([])
	const [visible, setVisible] = useState(true)

	useEffect(() => {
		setChat([...messages].reverse())
	}, [messages])

	return <div style={{flexGrow: 2, background: '#C0FFEE', display: 'flex', flexDirection: 'column'}}>
		<div style={activity_styles}>

		{locationActivities.map((e, i) => <Activity key={i} id={e.id} name={e.name} source={e.source} actions={locationActions[i]} />)}

		</div>

		<span style={chat_title_styles} onClick={() => setVisible(!visible)}>System Logs</span>

		{visible && <div style={chat_styles}>
			{chat.map((e, i) => <span style={chat_span_styles} key={i}>{e}</span>)}
		</div>}
	</div>
}

export default View
