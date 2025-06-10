import React from "react";

export default function Button({text, onClick, cName, id, style, ariaLabel, ...rest}) {
    return (
        <button onClick={onClick}
        className={cName} id={id} style={style}
        aria-label={ariaLabel}{...rest}>{text}</button>
    )
}
