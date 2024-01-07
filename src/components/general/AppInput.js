import React from 'react'

export default function AppInput(props) {
  return (
    <input className='appInput' value={props.value} onChange={props.onChange} type={props.type} name={props.name} placeholder={props.placeholder} />
  )
}
