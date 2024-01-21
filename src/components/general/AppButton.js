import React from 'react'

export default function AppButton(props) {
  return (
    <div className='appButton' onClick={props.onClick}>
      <img src={props.icon} alt={props.value} className="iconStyle" />
      <div className="textStyle">{props.value}</div>
    </div>
  )
}
