"use client";
import { useState, SetStateAction, ChangeEvent, MouseEvent, KeyboardEvent } from "react";
import CharMappings from "./char-mappings";

const ALPHABETS : Record<string, string[]> = {
  "latin": [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z'
  ], 
  "russian": [
    'А', 'Б', 'В', 'Г', 'Д', 'Е',
    'Ё', 'Ж', 'З', 'И', 'Й', 'К',
    'Л', 'М', 'Н', 'О', 'П', 'Р',
    'С', 'Т', 'У', 'Ф', 'Х', 'Ц',
    'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь',
    'Э', 'Ю', 'Я'
  ], 
  "greek": [
    'Α', 'Β', 'Γ', 'Δ', 'Ε',
    'Ζ', 'Η', 'Θ', 'Ι', 'Κ',
    'Λ', 'Μ', 'Ν', 'Ξ', 'Ο',
    'Π', 'Ρ', 'Σ', 'Τ', 'Υ',
    'Φ', 'Χ', 'Ψ', 'Ω'
  ]
}


export default function CipherControlPanel({originalText, currentText, onUpdateText, mode}: any) {
  const [cipher, setCipher] = useState("shift");
  const [alphabet, setAlphabet] = useState(ALPHABETS.latin);
  const [mappings, setMappings] : [Map<string, string>, React.Dispatch<SetStateAction<Map<string, string>>>] = useState(initCharMapping());
  const [options, setOptions] = useState({removeWhitespace: true, removeNonAlpha: true, preserveCase: false, useGroups: true});

  function initCharMapping() {
    let m : Map<string, string> = new Map(); 
    if (alphabet) {
      for (const chr of alphabet) {
        m.set(chr, chr);
      }
      console.log(m);
    }
    return m; 
  }

  function handleOptionsChange(event: ChangeEvent<HTMLInputElement>): void {
    let tempOpts = options; 
    switch (event.currentTarget.name) {
      case "rmWhitespace": 
        tempOpts.removeWhitespace = event.currentTarget.checked; 
        break; 
      case "rmNonAlpha": 
        tempOpts.removeNonAlpha = event.currentTarget.checked; 
        break; 
      case "preserveCase": 
        tempOpts.preserveCase = event.currentTarget.checked;
        break;  
      case "useGroups": 
        tempOpts.useGroups = event.currentTarget.checked;
        break; 
      default: 
        console.log(`Something strange is happening.`);
        return; 
    }
    console.log(tempOpts);
    setOptions(tempOpts);
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
    let groupSize = 0; 
    if (options.useGroups) {
      groupSize = parseInt(event.currentTarget.elements.groupSize.value); 
    }

    // Set up tempMap for the current cipher     
    if (cipher === "shift") {
      let shiftVal = parseInt(event.currentTarget.elements.shift.value); 
      if (mode === "decrypt") {
        shiftVal *= -1; 
      }
      for (let i = 0; i < alphabet.length; i++) {
        let outIdx = i + shiftVal;
        if (outIdx < 0) {
          outIdx += alphabet.length; 
        } else if (outIdx > alphabet.length - 1) {
          outIdx -= alphabet.length; 
        }
        tempMap.set(alphabet[i], alphabet[outIdx]);
        if (options.preserveCase === true) {
          tempMap.set(alphabet[i].toLowerCase(), alphabet[outIdx].toLowerCase());
        }
      }
    } else if (cipher === "atbash") {
      for (let i = 0; i < alphabet.length; i++) {
        tempMap.set(alphabet[i], alphabet[alphabet.length - 1 - i]);
        if (options.preserveCase === true) {
          tempMap.set(alphabet[i].toLowerCase(), alphabet[alphabet.length - 1 - i].toLowerCase());
        }
      }
    } else if (cipher === "mono") {
      let keyword = event.currentTarget.elements.keyword.value; 
      keyword = keyword.toUpperCase(); 

      let i = 0; 
      for (i = 0; i < keyword.length; i++) {
        let a = alphabet[i];
        let b = keyword.charAt(i); 

        // set letter mappings 
        if (mode === "encrypt") {
          tempMap.set(a, b);
          if (options.preserveCase === true) {
            tempMap.set(a.toLowerCase(), b.toLowerCase());
          }
        } else if (mode === "decrypt") {
          tempMap.set(b, a);
          if (options.preserveCase === true) {
            tempMap.set(b.toLowerCase(), a.toLowerCase());
          }
        }
      }
      
      // deal with any part of the alphabet remaining (i.e., if keyword.length < alphabet.length)
      for (i = i; i < ALPHABETS.latin.length; i++) {
        let a = alphabet[i];
        tempMap.set(a, a);
        if (options.preserveCase === true) {
          tempMap.set(a.toLowerCase(), a.toLowerCase());
        }
      }
    } else if (cipher === "vigenere") {
      console.log(`Vigenere Cipher not yet implemented`);
    }
    setMappings(tempMap);

    let counter = 0; 
    for (let i = 0; i < originalText.length; i++) {
      // if useGroups is on, insert a space if one is needed 
      if (options.useGroups === true && counter === groupSize) {
        tempText += ' ';
        counter = 0; 
      } 

      let inChar = originalText.charAt(i);
      if (alphabet.includes(inChar.toUpperCase())) {
        if (inChar !== inChar.toUpperCase() && options.preserveCase === false) {
          tempText += tempMap.get(inChar.toUpperCase());
        } else {
          tempText += tempMap.get(inChar);
        }
        counter++; 
      } else if (inChar === ' ' && options.removeWhitespace === false && options.useGroups === false) {
        tempText += inChar;
        counter++; 
      } else if (inChar !== ' ' && !alphabet.includes(inChar) && options.removeNonAlpha === false) {
        tempText += inChar; 
        counter++; 
      }
    }
    // pad the final block if needed 
    if (options.useGroups === true && counter > 0) {
      while (counter < groupSize) {
        tempText += tempMap.get(alphabet[alphabet.length - 1]);
        counter++; 
      }
    }
    console.log(tempText);
    onUpdateText(tempText);
  }

  return (
    <div className={"flex grow flex-col h-fit w-1/2 rounded-lg p-2 border bg-white/55 backdrop-blur-md" + (!originalText ? " text-slate-500" : " text-black")}>
      <h2 className="m-1 text-lg font-bold">Cipher Settings</h2>
      <div className="m-1">
        <label htmlFor="ciphers">Select a cipher type: </label>
        <select id="ciphers" name="ciphers" className="rounded-md p-1" defaultValue={"select"} onChange={handleCipherChange} disabled={!originalText}>
          <option value="shift">Caesar (Shift)</option>
          <option value="atbash">Atbash (Reverse Alphabet)</option>
          <option value="mono">Monoalphabetic Substitution</option>
          <option value="vigenere" disabled>Vigenère (Coming Soon)</option>
        </select>
      </div>
      <form onSubmit={applyCipher}>
        <div className="m-1">
          <label htmlFor="alphabet">Select an alphabet: </label>
          <select id="alphabet" name="alphabet" className="rounded-md p-1" defaultValue={"latin"} disabled={!originalText} onChange={e => setAlphabet(ALPHABETS[e.currentTarget.value])}>
            <option value="latin">Latin</option>
            <option value="russian">Russian</option>
            <option value="greek">Greek</option>
            <option value="auto" disabled>Auto-Detect (Coming Soon)</option>
            <option value="custom" disabled>Define Custom Alphabet (Coming Soon)</option>
          </select>
        </div>
        <div className="m-1">
          <label htmlFor="alphabetDisplay">Current Alphabet: </label>
          <input type="text" id="alphabetDisplay" name="alphabetDisplay" className={"rounded-md p-1 bg-white/60 w-full"} disabled value={alphabet.join("")}></input>
        </div>
        <div className={"m-1" + (cipher !== "shift" ? " hidden" : "")}>
          <label htmlFor="shift" >Shift Value: </label>
          <input type="number" id="shift" name="shift" className={"rounded-md p-1 bg-white/60 hover:bg-white/80"} min={0} max={alphabet.length} defaultValue={0} disabled={!originalText}></input> 
        </div>
        <div className={"m-1" + (!["mono", "vigenere"].includes(cipher) ? " hidden" : "")}>
          <label htmlFor="keyword">Keyword: </label>
          <input type="text" id="keyword" name="keyword" className={"rounded-md p-1 bg-white/60 hover:bg-white/80"} placeholder="keyword" defaultValue="" disabled={!originalText}></input>
        </div>
        <div className="m-1">
          <input type="checkbox" id="rmWhitespace" name="rmWhitespace" disabled={!originalText} defaultChecked onChange={handleOptionsChange}></input>
          <label htmlFor="rmWhitespace" title="Remove all spaces, tabs, and other whitespace characters before processing.">Remove Whitespace</label>
        </div>
        <div className="m-1">
          <input type="checkbox" id="rmNonAlpha" name="rmNonAlpha" disabled={!originalText} defaultChecked onChange={handleOptionsChange}></input>
          <label htmlFor="rmNonAlpha" title="Remove numbers, punctuation, and special characters before processing.">Remove Non-Letter Characters</label>
        </div>
        <div className="m-1">
          <input type="checkbox" id="preserveCase" name="preserveCase" disabled={!originalText} onChange={handleOptionsChange}></input>
          <label htmlFor="preserveCase" title="Map uppercase letters to uppercase letters, and lowercase letters to lowercase letters.">Preserve Case</label>
        </div>        
        <div className="m-1">
          <input type="checkbox" id="useGroups" name="useGroups" disabled={!originalText} defaultChecked onChange={handleOptionsChange}></input>
          <label htmlFor="useGroups" title="Remove whitespace, then break text into equal-sized blocks.">Use Groups</label>
        </div>
        <div className={"m-1" + (!options.useGroups ? " hidden" : "")}>
          <label htmlFor="groupSize">Group Size: </label>
          <input type="number" id="groupSize" name="groupSize" className={"rounded-md p-1 bg-white/60 hover:bg-white/80"} min={0} max={originalText.length} defaultValue={5} disabled={!originalText}></input> 
        </div>
        <input type="submit" value="Apply Changes" className={"bg-white/80 border rounded-md py-1 px-2 m-1" + (!originalText ? "" : " hover:bg-white hover:cursor-pointer")} disabled={!originalText}></input>
      </form>  
      <CharMappings 
        mappings={mappings} 
        mode={mode} 
        alphabet={alphabet}
        key={currentText}>
      </CharMappings>
    </div>
  )
}