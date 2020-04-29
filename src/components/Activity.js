import  React, { useContext } from "react";
import { PlayerContext } from "../context";

const container_styles = {
	border: '1px solid #7D7D7D',
	borderRadius: 4,
	width: 200,
	height: 120,
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

	const { doActivity } = playerContext;

	const handleActivity = e => {
		doActivity(e.target.id)
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

		{/* Button Container */}
		<div style={{display: 'flex', width: '100%', justifyContent: 'space-evenly'}}>

			{/* Button */}
			<button id={props.id} onClick={handleActivity} style={button_styles}>{props.type}</button>
		</div>
	</div>
};

export default Activity;
