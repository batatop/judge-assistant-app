import React from 'react'

export default function Logo(props) {
  return (
    <div className='logoContainer' style={{ fontSize: props.size }}>
        <div className='logo dark'  style={{position: 'absolute', top: 0}}>JAI</div>
        <div className='logo' >JAI</div>
    </div>
  )
}
