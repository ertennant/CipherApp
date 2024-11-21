"use client";
import { useState, SetStateAction, ChangeEvent, useEffect } from "react";
import CharMappings from "./char-mappings";

const ALPHABETS = {
  "latin": {
    "upper": "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 
    "lower": "abcdefghijklmnopqrstuvwxyz" 
  },
  "en": {
    "upper": "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 
    "lower": "abcdefghijklmnopqrstuvwxyz" 
  },
  "fr": {
    "upper": "AÀÂÆBCÇDEÉÈÊËFGHIÎÏJKLMNOÔŒPQRSTUÙÛÜVWXYŸZ", 
    "lower": "aàâæbcçdeéèêëfghiîïjklmnoôœpqrstuùûüvwxyÿz" 
  }
}


export default function CipherControlPanel({originalText, currentText, onUpdateText, mode}: any) {
  const [cipher, setCipher] = useState("shift");
  const [mappings, setMappings] : [Map<string, string>, React.Dispatch<SetStateAction<Map<string, string>>>] = useState(initCharMapping());
  const [alphabet, setAlphabet] = useState("latin");
  const [options, setOptions] = useState({encryptWhitespace: false, removeWhitespace: false, encryptPunctuation: false, removePunctuation: false, uppercaseOnly: false});

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
    let tempMap = mappings; 
    let tempText = "";
    let newOptions = {
      encryptWhitespace: event.currentTarget.elements.whitespace.checked, 
      removeWhitespace: event.currentTarget.elements.rmWhitespace.checked,
      encryptPunctuation: event.currentTarget.elements.punctuation.checked, 
      removePunctuation: event.currentTarget.elements.rmPunctuation.checked,
      caseSensitive: true,  
      uppercaseOnly: event.currentTarget.elements.uppercaseOnly.checked
    }
    setOptions(newOptions);

    if (cipher === "shift") {
      let shiftVal = parseInt(event.currentTarget.elements.shift.value); 

      if (mode == "decrypt") {
        shiftVal *= -1; 
      }

      for (let i = 0; i < originalText.length; i++) {
        let c = originalText.charAt(i);

        if ((`,.?;:!-()'"`.includes(c))) {
          if (newOptions.removePunctuation) {
            continue; 
          }
          if (!newOptions.encryptPunctuation) {
            tempText += c;
          }
        } else if (c === ' ') {
          if (newOptions.removeWhitespace) {
            continue; 
          }
          if (!newOptions.encryptWhitespace) {
            tempText += c; 
          }
        } else {
          let pCode = c.charCodeAt(0) + shiftVal;
          if (!newOptions.encryptPunctuation && !newOptions.encryptWhitespace) {
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
      if (newOptions.uppercaseOnly) {
        keyword = keyword.toUpperCase(); 
      }

      let i = 0; 
      for (i = 0; i < keyword.length; i++) {
        let a = ALPHABETS.latin.upper.charAt(i);
        let b = keyword.charAt(i).toUpperCase(); 

        // if (keyword.charAt(i) === keyword.charAt(i).toUpperCase()) {
        //   a = ALPHABETS.latin.upper.charAt(i);
        // } else {
        //   a = ALPHABETS.latin.lower.charAt(i); 
        // }

        if (mode === "encrypt") {
          tempMap.set(a, b);
          tempMap.set(a.toLowerCase(), b.toLowerCase());
        } else if (mode === "decrypt") {
          tempMap.set(b, a);
          tempMap.set(b.toLowerCase(), a.toLowerCase());
        }

      }

      for (i = i; i < ALPHABETS.latin.upper.length; i++) {
        let a = ALPHABETS.latin.upper.charAt(i);
        tempMap.set(a, a);
        tempMap.set(a.toLowerCase(), a.toLowerCase());
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
    <div className={"flex grow flex-col h-fit w-1/2 rounded-lg p-2 border bg-white/55 backdrop-blur-md" + (!originalText ? " text-slate-500" : " text-black")}>
      <h2 className="m-1 text-lg font-bold">Cipher Settings</h2>
      <div className="m-1">
        <label htmlFor="ciphers">Select a cipher type: </label>
        <select name="ciphers" className="rounded-md p-1" defaultValue={"select"} onChange={handleCipherChange} disabled={!originalText}>
          <option value="shift">Shift</option>
          <option value="mono">Monoalphabetic Substitution</option>
          <option value="poly" disabled>Polyalphabetic Substitution (Coming Soon)</option>
        </select>
      </div>
      <form onSubmit={applyCipher}>
        <div className="m-1">
          <label htmlFor="alphabet">Select an alphabet: </label>
          <select name="alphabet" className="rounded-md p-1" defaultValue={"latin"} disabled={!originalText} onChange={e => setAlphabet(e.currentTarget.value)}>
            <option value="latin">Latin</option>
            <option value="custom" disabled>Define Custom Alphabet (Coming Soon)</option>
          </select>
        </div>
        <div className="m-1">
          <label htmlFor="shift" className={cipher !== "shift" ? "hidden" : ""}>Shift Value: </label>
          <input type="number" name="shift" className={"rounded-md p-1 bg-white/60 hover:bg-white/80" + (cipher !== "shift" ? " hidden" : "")} min={0} max={26} defaultValue={0} disabled={!originalText}></input> 
        </div>
        <div className="m-1">
          <label htmlFor="keyword" className={cipher !== "mono" ? "hidden" : ""}>Keyword: </label>
          <input type="text" name="keyword" className={"rounded-md p-1 bg-white/60 hover:bg-white/80" + (cipher !== "mono" ? " hidden" : "")} placeholder="keyword" defaultValue="" disabled={!originalText}></input>
        </div>
        <div className="m-1">
          <input type="checkbox" className="" name="whitespace" disabled={!originalText}></input>
          <label htmlFor="whitespace" title="Apply the encryption algorithm to spaces and other whitespace characters.">{mode==="encrypt" ? "Encrypt" : "Decrypt"} Whitespace</label>
        </div>
        <div className="m-1">
          <input type="checkbox" className="" name="rmWhitespace" disabled={!originalText}></input>
          <label htmlFor="rmWhitespace" title="Remove all spaces, tabs, and other whitespace characters before processing.">Remove Whitespace</label>
        </div>
        <div className="m-1">
          <input type="checkbox" name="punctuation" disabled={!originalText}></input>
          <label htmlFor="punctuation" title="Apply the encryption algorithm to punctuation characters.">{mode==="encrypt" ? "Encrypt" : "Decrypt"} Punctuation</label>
        </div>
        <div className="m-1">
          <input type="checkbox" name="rmPunctuation" disabled={!originalText}></input>
          <label htmlFor="rmPunctuation" title="Remove all punctuation characters before processing.">Remove Punctuation</label>
        </div>
        <div className="m-1">
          <input type="checkbox" name="uppercaseOnly" disabled={!originalText}></input>
          <label htmlFor="uppercaseOnly" title="Converts all lowercase letters to their uppercase equivalent before processing.">Convert to Uppercase</label>
        </div>
        <input type="submit" value="Apply Changes" className={"bg-white/80 border rounded-md py-1 px-2 m-1" + (!originalText ? "" : " hover:bg-white hover:cursor-pointer")} disabled={!originalText}></input>
      </form>  
      <CharMappings 
        mappings={mappings} 
        mode={mode} 
        key={currentText}>
      </CharMappings>
    </div>
  )
}