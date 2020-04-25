import React from 'react';
import PropTypes from 'prop-types';

const Item = (props) => {
	return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none'}}>
		<img
			src={process.env.PUBLIC_URL + props.source}
			alt=""
			style={{ width: 24, height: 24 }}
		/>
		<span>{props.quantity}</span>
	</div>
}

Item.propTypes = {
	name: PropTypes.string.isRequired,
	source: PropTypes.string.isRequired,
	id: PropTypes.number.isRequired,
	stacks: PropTypes.bool.isRequired,
	quantity: PropTypes.number.isRequired,
};

export default Item;
