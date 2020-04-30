import  React, { useState, useEffect, useContext } from "react";
import { PlayerContext } from "../context";
// import { Line } from 'rc-progress'
import ProgressBar from '../tools/ProgressBar'
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
	const { doActivity, work, setWork, checkInventoryRequirements } = playerContext;
	const [time, setTime] = useState(0)
	const [available, setAvailable] = useState(true)

	const divisor = 50

	useEffect(() => {
        if(!available){
            const interval = setInterval(() => {
                if(time < 100) {
                    setTime(time + divisor)
					doActivity(props.id)
                } else {
					setWork(false)
					setAvailable(true)
                    setTime(0)
                }
            }, 1250);
            return () => clearInterval(interval);
        }
    }, [time, work, props.id, doActivity, setWork, available])

	const startActivity = () => {
		let itemRequirements = activities_json[props.id].itemRequirements
        if(!work) {
			if(activities_json[props.id].type === 'Collect') {
				setAvailable(false)
				setWork(true)
			} else {
				if(checkInventoryRequirements(itemRequirements)){
					setAvailable(false)
					setWork(true)
				}
			}
			
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

			{/* Button */}
			{!available 
			? <button id={props.id} onClick={cancelActivity} style={{...button_styles, background: 'red'}}>Stop</button>
			: <button id={props.id} onClick={startActivity} style={button_styles}>{props.type}</button>
			}
		</div>
	</div>
};

export default Activity;
