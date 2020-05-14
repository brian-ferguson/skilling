import React from 'react'

const container_styles = {
    height: 20,
    width: '100%',
    background: '#888',
    marginTop: 10
}

const progress_styles = {
    height: '100%',
    background: 'green'
}

const ProgressBar = ({ children, width = 20 }) => {
    return <div style={container_styles}>
        <div style={{...progress_styles, width: `${width}%`}}>{children}</div>
    </div>
}

export default ProgressBar
