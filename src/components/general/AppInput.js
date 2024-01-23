import React from 'react'

export default function AppInput(props) {
  return (
    <input
      className={props.large ? 'appInput large' : 'appInput'}
      value={props.value}
      onChange={props.onChange}
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          props.onEnter(e);
        }
      }}
    />
  )
}
