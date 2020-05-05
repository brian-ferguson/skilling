import  React, { useState, useEffect, useContext } from "react";
import { PlayerContext } from "../context";
import ProgressBar from '../tools/ProgressBar'
import actions_json from '../json/actions.json'
import items_json from '../json/items.json'

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
	const { doActivity, work, setWork, checkInventoryRequirements } = playerContext;
	const [time, setTime] = useState(0)
	const [available, setAvailable] = useState(true)
	const [action, setAction] = useState("")

	const divisor = 2

	useEffect(() => {
        if(!available){
            const interval = setInterval(() => {
				if(checkInventoryRequirements()) {
					if(time < 100) {
						setTime(time + divisor)
						doActivity(props.id, action)
					} else {
						setWork(false)
						setAvailable(true)
						setTime(0)
					}
				}
            }, 1250);
            return () => clearInterval(interval);
        }
    }, [time, work, props.id, doActivity, setWork, available, action, checkInventoryRequirements])

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
			<p style={{margin: '25px 0 0 10px', fontSize: 18}}>{props.name}</p>
		</div>

		{/* <Line percent={time} strokeWidth="10" trailWidth="10" strokeColor={time === 100 ? 'green' : 'brown'} strokeLinecap="square" style={{margin: 5}} /> */}
		<ProgressBar width={time} />

		{/* Button Container */}
		<div style={{display: 'flex', width: '100%', justifyContent: 'space-evenly'}}>

			{/* Buttons */}
			{!available 
				? <button id={props.id} onClick={cancelActivity} style={{...button_styles, background: 'red'}}>Stop</button>
				: props.actions !== undefined 
					? props.actions.map((e, i) => <button id={e.id} key={e.id} onClick={startActivity} style={button_styles}>{e.name}</button>)
					: null
			}
		</div>
	</div>
};

export default Activity;
