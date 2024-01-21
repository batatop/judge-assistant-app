import React from 'react'

export default function Logo(props) {
  const { big } = props;
  const logoPrefix = big ? 'logo big' : 'logo';
  return (
    <div className='logoContainer'>
        <div className={`${logoPrefix} dark`}  style={{position: 'absolute', top: 0}}>JAI</div>
        <div className={logoPrefix} >JAI</div>
    </div>
  )
}
