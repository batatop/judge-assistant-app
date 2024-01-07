import React from 'react'

export default function AppButton(props) {
  return (
    <div className='appButton' onClick={props.onClick}>{props.value}</div>
  )
}
