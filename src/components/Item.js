import React from 'react';
import PropTypes from 'prop-types';

const Item = (props) => {
	return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<img
			src={process.env.PUBLIC_URL + props.source}
			alt=""
			style={{ width: 24, height: 24 }}
		/>
		<span>1</span>
	</div>
}

Item.propTypes = {
	name: PropTypes.string.isRequired,
	source: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
};

export default Item;
