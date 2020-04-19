import React from 'react';
import PropTypes from 'prop-types';

const Area = (props) => (
	<div className="form-group" onClick={props.controlFunc}>
    <div style={{display: 'flex', flexDirection: 'column', paddingTop: 18, margin: '0px auto', alignItems: 'center'}}>
      <img
        src={process.env.PUBLIC_URL + props.source}
        alt=""
        style={{ width: 24, height: 24, paddingBottom: 5 }}
      />
    </div>
	</div>
);

Area.propTypes = {
	name: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  dropClicks: PropTypes.number.isRequired,
  drop: PropTypes.object.isRequired,
  controlFunc: PropTypes.func.isRequired,
};

export default Area;
