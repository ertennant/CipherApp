"use client";
import { useState, SetStateAction, ChangeEvent, useEffect } from "react";
import CharMappings from "./char-mappings";

const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CYRILLIC = ""; // to do: other major alphabets 

export default function CipherControlPanel({originalText, currentText, onUpdateText, mode}: any) {
  const [cipher, setCipher] = useState("shift");
  const [mappings, setMappings] : [Map<string, string>, React.Dispatch<SetStateAction<Map<string, string>>>] = useState(initCharMapping());

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
    let ignoreWhitespace = event.currentTarget.elements.whitespace.checked; 
    let ignorePunctuation = event.currentTarget.elements.punctuation.checked; 

    if (cipher === "shift") {
      let shiftVal = parseInt(event.currentTarget.elements.shift.value); 

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
    } else if (cipher === "mono") {
      let keyword = event.currentTarget.elements.keyword.value; 
      for (let i = 0; i < keyword.length; i++) {
        let a = "";
        let b = keyword.charAt(i);

        if (keyword.charAt(i) === keyword.charAt(i).toUpperCase()) {
          a = LATIN.charAt(i);
        } else {
          a = LATIN.charAt(i).toLowerCase(); 
        }

        if (mode === "encrypt") {
          tempMap.set(a, b);
        } else if (mode === "decrypt") {
          tempMap.set(b, a);
        }

      }
      
      for (let i = 0; i < originalText.length; i++) {
        console.log(`tempMap.get(${originalText.charAt(i)}) = ${tempMap.get(originalText.charAt(i))}`)
        tempText += tempMap.get(originalText.charAt(i));
      }
      // To Do Later: add code for user to set chars manually (i.e., including spaces and punctuation)
    }
    console.log(tempText);
    setMappings(tempMap);
    onUpdateText(tempText);
  }

  return (
    <div className={"flex grow flex-col h-fit rounded-lg p-2 border bg-white/55 backdrop-blur-md" + (!originalText ? " text-slate-500" : " text-black")}>
      <h2 className="m-1 text-lg font-bold">Cipher Settings</h2>
      <div className="m-1">
        <label htmlFor="mode-select">Select a cipher type: </label>
        <select name="ciphers" className="rounded-md p-1" defaultValue={"select"} onChange={handleCipherChange} disabled={!originalText}>
          <option value="shift">Shift</option>
          <option value="mono">Monoalphabetic Substitution</option>
          <option value="poly">Polyalphabetic Substitution</option>
        </select>
      </div>
      <form onSubmit={applyCipher}>
        <div className="m-1">
          <label htmlFor="shift" className={cipher !== "shift" ? "hidden" : ""}>Shift Value: </label>
          <input type="number" name="shift" className={"rounded-md p-1 bg-white/60 hover:bg-white/80" + (cipher !== "shift" ? " hidden" : "")} min={0} max={26} defaultValue={0} disabled={!originalText}></input> 
        </div>
        <div className="m-1">
          <label htmlFor="keyword" className={cipher !== "mono" ? "hidden" : ""}>Keyword: </label>
          <input type="text" name="keyword" className={"rounded-md p-1 bg-white/60 hover:bg-white/80" + (cipher !== "mono" ? " hidden" : "")} placeholder="keyword" defaultValue="" disabled={!originalText}></input>
        </div>
        <div className="m-1">
          <input type="checkbox" className="" name="whitespace" defaultChecked disabled={!originalText}></input>
          <label htmlFor="whitespace">Ignore Whitespace</label>
        </div>
        <div className="m-1">
          <input type="checkbox" name="punctuation" defaultChecked disabled={!originalText}></input>
          <label htmlFor="punctuation">Ignore Punctuation</label>
        </div>
        <input type="submit" value="Apply Changes" className={"bg-white/80 border rounded-md py-1 px-2 m-1" + (!originalText ? "" : " hover:bg-white hover:cursor-pointer")} disabled={!originalText}></input>
      </form>  
      <CharMappings mappings={mappings} mode={mode} key={currentText}></CharMappings>
    </div>
  )
}