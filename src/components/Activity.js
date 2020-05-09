import  React, { useState, useEffect, useContext } from "react";
import { PlayerContext } from "../context";
import ProgressBar from '../tools/ProgressBar'
import actions_json from '../json/actions.json'
import activities_json from '../json/activities.json'

const container_styles = {
	border: '1px solid #7D7D7D',
	borderRadius: 4,
	width: 200,
	height: 150,
	margin: '10px 0 0 10px',
	cursor: 'pointer',
	userSelect: 'none',
	background: '#FFF'
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
	margin: '10px 0 0 10px',
	cursor: 'pointer'
}

const Activity = (props) => {
	const playerContext = useContext(PlayerContext);
	const { doActivity, work, setWork, checkInventoryRequirements, getObject } = playerContext;
	const [time, setTime] = useState(0)
	const [available, setAvailable] = useState(true)
	const [action, setAction] = useState("")

	const divisor = 2

	const timeSwitch = () => {
		switch(true){
			case(time < 100):
				setTime(time + divisor)
				doActivity(id, action)
				break;
			default:
				setWork(false)
				setAvailable(true)
				setTime(0)
		}
	}

	useEffect(() => {
		//get the item requirements from the action object
		let actionObject = getObject(action, actions_json["actions"]);
		let activitiesObject = getObject(props.id, activities_json["activities"])
		if(!available){
			const interval = setInterval(() => {
				if(activitiesObject.type === 'Collect') {
					timeSwitch()
				} else {
					if(actionObject.itemRequirements && checkInventoryRequirements(actionObject.itemRequirements)) {
						timeSwitch()
					} else {
						setWork(false)
						setAvailable(true)
						setTime(0)
					}
				}
			}, 125);
			return () => clearInterval(interval);
		}
	// eslint-disable-next-line
    }, [time, work, props.id, doActivity, setWork, available, action, checkInventoryRequirements, getObject])

	const startActivity = (e) => {
		setAction(e.target.id)
        if(!work) {
			setAvailable(false)
			setWork(true)
			setTime(divisor)
			doActivity(props.id, e.target.id)
        }
    }

	const cancelActivity = () => {
		setAvailable(true)
		setWork(false)
		setTime(0)
	}

	return <div style={container_styles}>

		{/* Header Container */}
		<div style={{display: 'flex', justifyContent: 'space-evenly'}}>
			{/* Image */}
			<img
				src={process.env.PUBLIC_URL + props.source}
				alt=""
				style={{ width: 50, height: 50, margin: '10px 0 0 10px' }}
			/>

			{/* Title */}
			<p style={{margin: '25px 0 0 10px', fontSize: 18}}>{name}</p>
		</div>

		{/* <Line percent={time} strokeWidth="10" trailWidth="10" strokeColor={time === 100 ? 'green' : 'brown'} strokeLinecap="square" style={{margin: 5}} /> */}
		<ProgressBar width={time} />

		{/* Button Container */}
		<div style={{display: 'flex', width: '100%', justifyContent: 'space-evenly'}}>

			{/* Buttons */}
			{!available
				? <button id={id} onClick={cancelActivity} style={{...button_styles, background: 'red'}}>Stop</button>
				: actions !== undefined
					? actions.map((e, i) => <button id={e.id} key={e.id} onClick={startActivity} style={button_styles}>{e.name}</button>)
					: null
			}
		</div>
	</div>
};

export default Activity;
