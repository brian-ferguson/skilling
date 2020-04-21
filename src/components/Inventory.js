import React, {useContext} from "react";
//import clsx from "clsx";

import {PlayerContext} from "../context";
import Item from "../components/Item";

const Inventory = props => {

  const playerContext = useContext(PlayerContext);
  const {inventory} = playerContext;



  return(
    <div className="inventory">
      <h2>Inventory: </h2>

        {inventory.map((item, index) => {

          return(
            <div key={index}>
              <Item name={item.name} source={item.source} id={item.id}/>
            </div>
          );

        })}

    </div>
  );




};

export default Inventory;
