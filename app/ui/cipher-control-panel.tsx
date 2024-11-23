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
  ], 
  "ukrainian": [
    'А', 'Б', 'В', 'Г', 'Ґ',
    'Д', 'Е', 'Є', 'Ж', 'З',
    'И', 'І', 'Ї', 'Й', 'К', 
    'Л', 'М', 'Н', 'О', 'П',
    'Р', 'С', 'Т', 'У', 'Ф', 
    'Х', 'Ц', 'Ч', 'Ш', 'Щ', 
    'Ь', 'Ю', 'Я'
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

  function applyMonoCipher(event: any) {
    console.log(`called applyMonoCipher(${event})`);
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
    } 
    setMappings(tempMap);

    let g = 0; // group index counter
    for (let i = 0; i < originalText.length; i++) {
      // if useGroups is on, insert a space if one is needed 
      if (options.useGroups === true && g === groupSize) {
        tempText += ' ';
        g = 0; 
      } 

      let inChar = originalText.charAt(i);
      if (alphabet.includes(inChar.toUpperCase())) {
        if (inChar !== inChar.toUpperCase() && options.preserveCase === false) {
          tempText += tempMap.get(inChar.toUpperCase());
        } else {
          tempText += tempMap.get(inChar);
        }
        g++; 
      } else if (inChar === ' ' && options.removeWhitespace === false && options.useGroups === false) {
        tempText += inChar;
        g++; 
      } else if (inChar !== ' ' && !alphabet.includes(inChar) && options.removeNonAlpha === false) {
        tempText += inChar; 
        g++; 
      }
    }
    // pad the final block if needed 
    if (options.useGroups === true && g > 0) {
      while (g < groupSize) {
        tempText += tempMap.get(alphabet[alphabet.length - 1]);
        g++; 
      }
    }
    console.log(tempText);
    onUpdateText(tempText);
  }

  function applyPolyCipher(event: any) {
    console.log(`called applyPolyCipher(${event})`);
    let tempText = "";
    let groupSize = 0; 
    if (options.useGroups) {
      groupSize = parseInt(event.currentTarget.elements.groupSize.value); 
    }

    if (cipher === "vigenere") {
      let keyword = event.currentTarget.elements.keyword.value; 
      keyword = keyword.toUpperCase(); 

      let g = 0; // group index counter 
      let k = 0; // keyword index 
      for (let i = 0; i < originalText.length; i++) {
        if (options.useGroups === true && g === groupSize) {
          tempText += ' ';
          g = 0; 
        } 

        let inChar = originalText.charAt(i);
        let charIdx = alphabet.indexOf(inChar.toUpperCase());

        if (alphabet.includes(inChar.toUpperCase())) {
          if (mode === "encrypt") {
            charIdx += alphabet.indexOf(keyword.charAt(k));
            if (charIdx >= alphabet.length) {
              charIdx -= alphabet.length;
            }
          } else if (mode === "decrypt") {
            charIdx -= alphabet.indexOf(keyword.charAt(i));
            if (charIdx < 0) {
              charIdx += alphabet.length; 
            }
          }

          if (inChar === inChar.toUpperCase() || options.preserveCase === false) {
            tempText += alphabet[charIdx];
          } else {
            tempText += alphabet[charIdx].toLowerCase();
          }
          g++; // increment current group size 

        } else if (inChar === ' ' && options.removeWhitespace === false && options.useGroups === false) {
          tempText += inChar;
          g++; 
        } else if (inChar !== ' ' && !alphabet.includes(inChar) && options.removeNonAlpha === false) {
          tempText += inChar; 
          g++; 
        }
  
        k++; // move to next keyword letter; go back to keyword[0] if you're at the end 
        if (k == keyword.length) {
          k = 0; 
        }
      }
      // pad the final block if needed 
      if (options.useGroups === true && g > 0) {
        while (g < groupSize) {
          let charIdx = alphabet.length - 1; 
          if (mode === "encrypt") {
            charIdx += alphabet.indexOf(keyword.charAt(k));
            if (charIdx > alphabet.length) {
              charIdx -= alphabet.length;
            }
          } else if (mode === "decrypt") {
            charIdx -= alphabet.indexOf(keyword.charAt(k));
            if (charIdx < 0) {
              charIdx += alphabet.length; 
            }
          }
          tempText += alphabet[charIdx];
          k++; 
          if (k === keyword.length) {
            k = 0; 
          }
          g++; 
        }
      }
    }    
    console.log(tempText);
    onUpdateText(tempText);
  }

  function applyCipher(event: any) {
    console.log(`called applyCipher(${event})`);
    event.preventDefault(); 

    if (["shift", "atbash", "mono"].includes(cipher)) {
      applyMonoCipher(event);
    } else if (["vigenere"].includes(cipher)) {
      applyPolyCipher(event);
    }
  }

  return (
    <div className={"flex grow flex-col h-fit w-1/2 rounded-lg p-2 border border-primary bg-primary/55 backdrop-blur-md" + (!originalText ? " text-text-disabled" : " text-text-normal")}>
      <h2 className="m-1 text-lg font-bold">Cipher Settings</h2>
      <div className="m-1">
        <label htmlFor="ciphers">Select a cipher type: </label>
        <select id="ciphers" name="ciphers" className="rounded-md p-1 bg-primary/60 hover:bg-primary/80" defaultValue={"select"} onChange={handleCipherChange} disabled={!originalText}>
          <option value="shift">Caesar (Shift)</option>
          <option value="atbash">Atbash (Reverse Alphabet)</option>
          <option value="mono">Monoalphabetic Substitution</option>
          <option value="vigenere">Vigenère</option>
        </select>
      </div>
      <form onSubmit={applyCipher}>
        <div className="m-1">
          <label htmlFor="alphabet">Select an alphabet: </label>
          <select id="alphabet" name="alphabet" className="rounded-md p-1 bg-primary/60 hover:bg-primary/80" defaultValue={"latin"} disabled={!originalText} onChange={e => setAlphabet(ALPHABETS[e.currentTarget.value])}>
            <option value="latin">Latin</option>
            <option value="greek">Greek</option>
            <option value="russian">Russian</option>
            <option value="ukrainian">Ukrainian</option>
            <option value="auto" disabled>Auto-Detect (Coming Soon)</option>
            <option value="custom" disabled>Define Custom Alphabet (Coming Soon)</option>
          </select>
        </div>
        <div className="m-1">
          <label htmlFor="alphabetDisplay">Current Alphabet: </label>
          <input type="text" id="alphabetDisplay" name="alphabetDisplay" className={"rounded-md p-1 bg-primary/60 w-full"} disabled value={alphabet.join("")}></input>
        </div>
        <div className={"m-1" + (cipher !== "shift" ? " hidden" : "")}>
          <label htmlFor="shift" >Shift Value: </label>
          <input type="number" id="shift" name="shift" className={"rounded-md p-1 bg-primary/60 hover:bg-primary/80"} min={0} max={alphabet.length} defaultValue={0} disabled={!originalText}></input> 
        </div>
        <div className={"m-1" + (!["mono", "vigenere"].includes(cipher) ? " hidden" : "")}>
          <label htmlFor="keyword">Keyword: </label>
          <input type="text" id="keyword" name="keyword" className={"rounded-md p-1 bg-primary/60 hover:bg-primary/80"} placeholder="keyword" defaultValue="" disabled={!originalText}></input>
        </div>
        <div className="m-1">
          <input type="checkbox" id="rmWhitespace" name="rmWhitespace" disabled={!originalText} defaultChecked onChange={handleOptionsChange}></input>
          <label htmlFor="rmWhitespace" title="Remove all spaces, tabs, and other whitespace characters before processing."> Remove Whitespace</label>
        </div>
        <div className="m-1">
          <input type="checkbox" id="rmNonAlpha" name="rmNonAlpha" disabled={!originalText} defaultChecked onChange={handleOptionsChange}></input>
          <label htmlFor="rmNonAlpha" title="Remove numbers, punctuation, and special characters before processing."> Remove Non-Letter Characters</label>
        </div>
        <div className="m-1">
          <input type="checkbox" id="preserveCase" name="preserveCase" disabled={!originalText} onChange={handleOptionsChange}></input>
          <label htmlFor="preserveCase" title="Map uppercase letters to uppercase letters, and lowercase letters to lowercase letters."> Preserve Case</label>
        </div>        
        <div className="m-1">
          <input type="checkbox" id="useGroups" name="useGroups" disabled={!originalText} defaultChecked onChange={handleOptionsChange}></input>
          <label htmlFor="useGroups" title="Remove whitespace, then break text into equal-sized blocks."> Use Groups</label>
        </div>
        <div className={"m-1" + (!options.useGroups ? " hidden" : "")}>
          <label htmlFor="groupSize">Group Size: </label>
          <input type="number" id="groupSize" name="groupSize" className={"rounded-md p-1 bg-primary/60 hover:bg-primary/80"} min={0} max={originalText.length} defaultValue={5} disabled={!originalText}></input> 
        </div>
        <input type="submit" value="Apply Changes" className={"bg-primary/80 border border-primary rounded-md py-1 px-2 m-1" + (!originalText ? "" : " hover:bg-primary hover:cursor-pointer")} disabled={!originalText}></input>
      </form> 
      {["shift", "atbash", "mono"].includes(cipher) ? 
        <CharMappings 
          mappings={mappings} 
          mode={mode} 
          alphabet={alphabet}
          key={currentText}>
        </CharMappings>
        : ""
      }
    </div>
  )
}