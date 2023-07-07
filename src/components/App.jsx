import Die from "./Die"
import { useEffect, useState } from "react"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'
import images from '../assets/images'

export default function App() {
  function allNewDice(){
    const randomArray = []
    for(let i = 0; i < 10; i++){
      randomArray.push({
        value: (Math.floor(Math.random()*6) + 1), 
        isHeld: false,
        id: nanoid()
      })
    }
    return randomArray
  }
  console.log(allNewDice())

  const [diceValue, setDiceValue] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)

  // function checkNumber(){
  //   const firstItem = diceValue[0].value
  //   for(let i = 0; i < diceValue.length; i++){
  //       if (diceValue[i].value !== firstItem ){
  //         return false
  //       }
  //   }
  //   return true;
  // }

  // function checkHeld(){
  //   for(let i = 0; i < diceValue.length; i++){
  //     if (diceValue[i].isHeld === false){
  //       return false
  //     }
  //   }
  //   return true;
  // }

  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [bestTime, setBestTime] = useState(localStorage.getItem("timeRecord") ? localStorage.getItem("timeRecord") : 60)
  const [bestRoll, setBestRoll] = useState(localStorage.getItem("rollRecord") ? localStorage.getItem("rollRecord") : 30)


  useEffect(()=>{
    localStorage.setItem("timeRecord", bestTime)
  },[bestTime])

  useEffect(()=>{
    localStorage.setItem("rollRecord", bestRoll)
  },[bestRoll])

  useEffect(()=>{
    const held = diceValue.every(dice => dice.isHeld)
    const firstValue = diceValue[0].value
    const sameValue = diceValue.every(dice => dice.value === firstValue)
    if(held && sameValue){
      setTenzies(true)
      const duration = endTime - startTime
      console.log("It took you " + duration/1000 + " seconds")
      if (duration/1000 < bestTime){
        setBestTime((duration/1000).toFixed(1))
      }
      if (count < bestRoll){
        setBestRoll(count)
      }
    }else{
      setTenzies(false)
    }
    setEndTime(new Date())
  },[diceValue])

  function rollDice(){
    if (!tenzies){
      setCount(prevCount => prevCount + 1)
      setDiceValue(oldDice => oldDice.map(dice =>{
        if (dice.isHeld){
          return dice
        } else{
          return {
            ...dice,
            value:(Math.floor(Math.random()*6) + 1)
          }
        }
      }))
    } else{
      setCount(0)
      setStartTime(new Date())
      setDiceValue(oldDice => oldDice.map(dice =>{
        return{
          ...dice,
          isHeld: false,
          value: Math.floor(Math.random()*6) + 1,
        }
      }))
    }
  }

    // function toggle(){
  //   setDiceValue((prevState)=>{
  //     return{
  //       ...prevState,
  //       isHeld: !prevState.isHeld}
  //   })
  //   console.log(diceValue)
  // }
  const [count, setCount] = useState(0)

  function holdDice(id){
    console.log(id)
    setDiceValue(oldDice => oldDice.map(dice =>{
      if (dice.id === id){
        return{
          ...dice,
          isHeld: !dice.isHeld
        }
      } else{
        return dice
      }
    }
    ))
  }

  const diceElements = diceValue.map(die => <Die 
      key={die.id} 
      value={die.value} 
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />)

  return(
    <>
      <main>
        {tenzies && <Confetti/>}
        <div className="main-container">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
          <div className="grid-container">
            {diceElements}
          </div>
          <button className="roll-button" onClick={rollDice}>{tenzies ? "New Game": "Roll"}</button>
          <p>Roll Counter: {count}</p>
          <p>Best Time: {bestTime} seconds</p>
          <p>Best Roll: {bestRoll} times</p>
        </div>
      </main>
    </>
  )
}

