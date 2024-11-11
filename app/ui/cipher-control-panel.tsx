"use client";

import { useState, ChangeEvent } from "react";
import ShiftCipherOptions from "./shift-cipher-options";
import MonoCipherOptions from "./mono-cipher-options";
import PolyCipherOptions from "./poly-cipher-options";

export default function CipherControlPanel({currentText, originalText, updateText, mode}: any) {
  const [cipher, setCipher] = useState("");

  function handleCipherChange(event: ChangeEvent<HTMLSelectElement>): void {
    setCipher(event.currentTarget.value);
  }

  function processChanges(event: any) {
    event.preventDefault(); 
    if (event.currentTarget.elements.shift) {
      let shift = parseInt(event.currentTarget.elements.shift.value); 
      if (mode == "decrypt") {
        shift *= -1; 
      }
      let temp = "";
      for (let i = 0; i < currentText.length; i++) {
        if (!event.currentTarget.elements.whitespace.checked || currentText.charAt(i) != ' ') {
          temp += String.fromCharCode(currentText.charCodeAt(i) + shift);
        } else {
          temp += currentText.charAt(i);
        }
      }
      console.log(temp);
      updateText(temp);
    }
  }

  return (
    <div className="flex grow flex-col">
      <div className="flex flex-col">
        <label htmlFor="mode-select">Select a cipher type:</label>
        <select className="text-black" name="ciphers" id="cipher-select" defaultValue={"select"} onChange={handleCipherChange}>
          <option value="select" disabled>-- please select a cipher type --</option>
          <option value="shift">Shift</option>
          <option value="mono">Monoalphabetic Substitution</option>
          <option value="poly">Polyalphabetic Substitution</option>
        </select>
      </div>
      <form onSubmit={processChanges}>
        {cipher === "shift" ? <ShiftCipherOptions></ShiftCipherOptions> : 
        cipher === "mono" ? <MonoCipherOptions originalText={originalText}></MonoCipherOptions> :
        cipher === "poly" ? <PolyCipherOptions></PolyCipherOptions> :
        ""}
        <div>
          <input type="checkbox" name="whitespace"></input>
          <label htmlFor="whitespace">Preserve Whitespace</label>
        </div>
        <div>
          <input type="checkbox" name="caseSensitive" defaultChecked={true} ></input>
          <label htmlFor="whitespace" >Case Sensitive</label>
        </div>
        <div>
          <input type="button" id="submit" onClick={processChanges}></input>
          <label htmlFor="submit" >Submit</label>
        </div>
      </form>
    </div>
  )
}