import React from 'react';
import PropTypes from 'prop-types';

const Item = (props) => (
	<div className="form-group">
    <div style={{display: 'flex', flexDirection: 'column', paddingTop: 18, margin: '0px auto', alignItems: 'center'}}>
      <img
        src={process.env.PUBLIC_URL + props.source}
        alt=""
        style={{ width: 24, height: 24, paddingBottom: 5 }}
      />
    </div>
	</div>
);

Item.propTypes = {
	name: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default Item;
