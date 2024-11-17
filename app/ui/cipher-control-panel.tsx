"use client";

import { useState, SetStateAction, ChangeEvent } from "react";
// import ShiftCipherOptions from "./shift-cipher-options";
// import MonoCipherOptions from "./mono-cipher-options";
// import PolyCipherOptions from "./poly-cipher-options";
import CharMapping from "./char-mapping";
import CharMappings from "./char-mappings";

export default function CipherControlPanel({originalText, currentText, onUpdateText, mode}: any) {
  const [cipher, setCipher] = useState("");
  const [mappings, setMappings] : [Map<string, string>, React.Dispatch<SetStateAction<Map<string, string>>>] = useState(new Map());

  function initCharMapping() {
    let m : Map<string, string> = new Map(); 
    for (let i = 0; i < currentText.length; i++) {
      m.set(currentText.charAt(i), currentText.charAt(i));
    }
    console.log(m);
    return m; 
  }
    
  function handleCipherChange(event: ChangeEvent<HTMLSelectElement>): void {
    setCipher(event.currentTarget.value);
    setMappings(initCharMapping());
  }

  function applyCipher(event: any) {
    console.log(`called applyCipher(${event})`);
    event.preventDefault(); 
    let tempMap = new Map(); 
    let tempText = "";

    if (cipher === "shift") {
      let shiftVal = parseInt(event.currentTarget.elements.shift.value); 
      let ignoreWhitespace = event.currentTarget.elements.whitespace.checked; 
      let ignorePunctuation = event.currentTarget.elements.punctuation.checked; 

      if (mode == "decrypt") {
        shiftVal *= -1; 
      }

      for (let i = 0; i < currentText.length; i++) {
        let c = currentText.charAt(i);

        if ((`,.?;:!-()'"`.includes(c) && ignorePunctuation)) {
          tempText += c;
        } else if (c === ' ' && ignoreWhitespace) {
          tempText += c; 
        } else {
          let pCode = c.charCodeAt(0) + shiftVal;
          if (ignorePunctuation && ignoreWhitespace) {
            if (c.toUpperCase() === c) {
              if (pCode < "A".charCodeAt(0) || pCode > "Z".charCodeAt(0)) {
                if (mode === "encrypt") {
                  pCode -= 26; 
                } else {
                  pCode += 26; 
                }
              }
            } else {
              if (pCode < "a".charCodeAt(0) || pCode > "z".charCodeAt(0)) {
                if (mode === "encrypt") {
                  pCode -= 26; 
                } else {
                  pCode += 26; 
                }
              }
            }
          } 
          let p = String.fromCharCode(pCode);
          tempText += p;
          tempMap.set(c, p);
        }
      }
    }
    console.log(tempText);
    setMappings(tempMap);
    onUpdateText(tempText);
  }

  return (
    <div className="flex grow flex-col">
      <CharMappings mappings={mappings} mode={mode}></CharMappings>
      <div className="flex flex-col">
        <label htmlFor="mode-select">Select a cipher type:</label>
        <select className={!originalText ? "text-slate-400" : "text-black"} name="ciphers" id="cipher-select" defaultValue={"select"} onChange={handleCipherChange} disabled={!originalText}>
          <option value="shift">Shift</option>
          <option value="mono">Monoalphabetic Substitution</option>
          <option value="poly">Polyalphabetic Substitution</option>
        </select>
      </div>
      <form onSubmit={applyCipher}>
        {cipher === "shift" ? 
          <input type="number" name="shift" className="text-black" min={0} max={26} defaultValue={0} disabled={!originalText}></input> 
          : cipher === "mono" ?
          <input className="rounded-md p-1 m-1" type="text" name="keyword" placeholder="keyword" disabled={!originalText}></input>
          : ""
        }
        <div>
          <input type="checkbox" name="whitespace" defaultChecked disabled={!originalText}></input>
          <label htmlFor="whitespace">Ignore Whitespace</label>
        </div>
        <div>
          <input type="checkbox" name="punctuation" defaultChecked disabled={!originalText}></input>
          <label htmlFor="punctuation">Ignore Punctuation</label>
        </div>
        <input type="submit" id="submit" disabled={!originalText}></input>
      </form>  
    </div>
  )
}