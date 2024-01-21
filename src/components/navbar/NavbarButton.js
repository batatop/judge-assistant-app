import React from 'react'

export default function NavbarButton(props) {
    return (
        <div className='navbarButton' onClick={props.onClick}>
            <img src={props.icon} alt={props.text} className="iconStyle" />
            <div className="textStyle">{props.text}</div>
        </div>
    )
}
