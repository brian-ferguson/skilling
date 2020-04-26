import React, { useState } from 'react'
import Inventory from './Inventory'
import Stats from './Stats'

const nav_styles = {
    textAlign: 'center', 
    width: '100%',
    height: 30, paddingTop: 10,
    userSelect: 'none',
    cursor: 'pointer'
}

const Menu = () => {
    const [menu, setMenu] = useState("Inventory")

    return <div style={{borderLeft: '1px solid black'}}>
        {/* Menu */}
    	<div style={{display: 'flex'}}>
            <div id={"Inventory"} onClick={(e) => setMenu(e.target.id)} style={{...nav_styles, background: menu === "Inventory" ? 'Gainsboro' : '#F2F2F2'}}>Inventory</div>
            <div id={"Stats"} onClick={(e) => setMenu(e.target.id)} style={{...nav_styles, background: menu === "Stats" ? 'Gainsboro' : '#F2F2F2'}}>Stats</div>
        </div>

        {menu === "Inventory"
            ? <Inventory />
            : <Stats />
        }
    </div>
}

export default Menu