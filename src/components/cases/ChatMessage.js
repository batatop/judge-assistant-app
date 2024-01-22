import React from 'react'

export default function ChatMessage(props) {
    return (
        <div className={`chatMessageContainer ${props.type}`}>
            <div className={`chatMessage ${props.type}`}>
                <div style={{
                    fontWeight: 'bold',
                    marginBottom: 3
                }}>{props.sender}</div>
                <div>
                    {props.text}
                </div>
                <div style={{
                    textAlign: 'right',
                    fontSize: 12,
                    marginTop: 3,
                    fontWeight: 'bold'
                }}>{props.date}</div>
            </div>
        </div>
    )
}
