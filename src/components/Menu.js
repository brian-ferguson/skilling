import React, { useState } from 'react'
import Inventory from './Inventory'
import Stats from './Stats'

const nav_styles = {
    textAlign: 'center', 
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
            <div onClick={handleMenuChange} style={{...nav_styles, background: menu === "Inventory" ? 'Gainsboro' : '#F2F2F2'}}>Inventory</div>
            <div onClick={handleMenuChange} style={{...nav_styles, background: menu === "Stats" ? 'Gainsboro' : '#F2F2F2'}}>Stats</div>
        </div>

        {menu === "Inventory"
            ? <Inventory />
            : <Stats />
        }
    </div>
}

export default Menu