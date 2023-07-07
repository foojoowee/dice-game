// import {useState} from "react"

// const [value, setValue] = useState("")
import images from '../assets/images'

export default function Die(props){
    return(
        <div onClick={props.holdDice}className={`die ${props.isHeld ? "die-selected": ""}`}>
            <img className="dice-image" src={images[`dice${props.value}`]}></img>
        </div>
    )
}
