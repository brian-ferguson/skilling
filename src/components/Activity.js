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
	const [actionTime, setActionTime] = useState(0)
	const [available, setAvailable] = useState(true)
	const [action, setAction] = useState("")

	const timeSwitch = (actionType, actionTime, actionInterval) => {

		//increment the time state by 1 second
		setTime(time + 1);

		if(time === actionTime){
			if(actionType === "Craft"){
				doActivity(props.id, action)
			}
			
			setWork(false)
			setAvailable(true)
			setTime(0)
		}else if(time % actionInterval === 0  && time !== 0){
			//if the action type is of type collected
			if(actionType === "Collect" || actionType === "Refine"){
				doActivity(props.id, action)
			}else if(actionType === "Fishing"){
				//50% of the time return an item drop
				let maximum = 1;
				let mininum = 0;
				let bite = Math.random() * (maximum - mininum) + mininum;

				console.log("bite: ", bite);
				//if a bite occurs
				if(bite === 1){
					console.log("bite");
					doActivity(props.id, action);
				}
			}
		}
		/*
		switch(true){
			case(time < actionTime):
				setTime(time + 1)
				console.log("time: ", time);
				if(actionType === "Collect" || actionType === "Refine"){
					doActivity(props.id, action)
				}
				break;
			default:
				setWork(false)
				setAvailable(true)
				setTime(0)
				//if the action type is of type refine
				if(actionType === "Craft"){
					doActivity(props.id, action)
				}
		}
		*/
	}

	useEffect(() => {
		//get the item requirements from the action object
		let actionObject = getObject(action, actions_json["actions"]);
		if(actionObject){
			if(!available){
				//get the time per cycle of the action object
				let cycleSeconds = actionObject.cycleSeconds;
				let totalCyclesAvailable = 1;
				let cycleTime = cycleSeconds * totalCyclesAvailable;
				let cycleInterval = actionObject.actionInterval;

				//each second update the state time and check if the time is at an interval to call doActivity
				const interval = setInterval(() => {

					if(actionObject.type === 'Collect') {
						timeSwitch(actionObject.type, cycleTime, cycleInterval)
					}else{

						if(actionObject.itemRequirements && checkInventoryRequirements(actionObject.itemRequirements)) {
							timeSwitch(actionObject.type, cycleTime, cycleInterval)
						}else{
							setWork(false)
							setAvailable(true)
							setTime(0)
						}
					}
			}, 1000);

			return () => clearInterval(interval);
		}
	}else{
		setTime(0);
		setActionTime(1);
	}


	// eslint-disable-next-line
    }, [time, work, props.id, doActivity, setWork, available, action, checkInventoryRequirements, getObject])



	//activate the interval inside useEffect() by setting available to false
	const startActivity = (e) => {

		//set the current action by id
		setAction(e.target.id)

		//get the action objects
		let actionObject = getObject(e.target.id, actions_json["actions"]);

		//get the action objects cycleSeconds
		let actionCycleSeconds = actionObject.cycleSeconds;

		//[check if the players associated skill level allows for loop iteration of actions]
		let actionLoopIterations = 1;

		let actionTotalTime = actionCycleSeconds * actionLoopIterations;

		setActionTime(actionTotalTime);

		//if the action is currently iterating
		if(!work) {
			setAvailable(false)
			setWork(true)
			setTime(0)
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

		<ProgressBar width={(time / actionTime) * 100} />

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
