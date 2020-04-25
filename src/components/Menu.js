import React, { useState } from 'react'
import Inventory from './Inventory'
import Stats from './Stats'

const nav_styles = {
    textAlign: 'center', 
    background: '#F8F8F8', 
    width: '100%',
    height: 30, paddingTop: 10,
    border: '1px solid black',
    userSelect: 'none',
    cursor: 'pointer'
}

const Menu = () => {
    const [menu, setMenu] = useState("Inventory")

    const handleMenuChange = () => {
        if (menu === "Inventory") {
            setMenu("Stats")
        } else {
            setMenu("Inventory")
        }
    }

    return <div>
        {/* Menu */}
    	<div style={{display: 'flex'}}>
            <div onClick={handleMenuChange} style={nav_styles}>Inventory</div>
            <div onClick={handleMenuChange} style={nav_styles}>Stats</div>
        </div>

        {menu === "Inventory"
            ? <Inventory />
            : <Stats />
        }
    </div>
}

export default Menu