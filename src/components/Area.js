import  React, {useContext, useState} from "react";
import {PlayerContext} from "../context";

const Area = (props) => {

	const playerContext = useContext(PlayerContext);
  const {inventory, addItem} = playerContext;


	const handleRefresh = e => {
		var item_drop = props.drop;
		addItem(item_drop);

  return(
		<div style={{display: 'flex', flexDirection: 'column', paddingTop: 18, margin: '0px auto', alignItems: 'center'}}>
		    <img
					id={props.id}
					onClick={handleRefresh}
		      src={process.env.PUBLIC_URL + props.source}
		      alt=""
		      style={{ width: 24, height: 24, paddingBottom: 5 }}
		    />
		  </div>
  );

};

export default Area;
