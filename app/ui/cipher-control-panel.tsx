"use client";
import { useState, SetStateAction, ChangeEvent, MouseEvent, KeyboardEvent } from "react";
import CharMappings from "./char-mappings";

const ALPHABETS : Map<string, string[]> = new Map([
  ["latin", [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z'
  ]], 
  ["russian", [
    'А', 'Б', 'В', 'Г', 'Д', 'Е',
    'Ё', 'Ж', 'З', 'И', 'Й', 'К',
    'Л', 'М', 'Н', 'О', 'П', 'Р',
    'С', 'Т', 'У', 'Ф', 'Х', 'Ц',
    'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь',
    'Э', 'Ю', 'Я'
  ]], 
  ["greek", [
    'Α', 'Β', 'Γ', 'Δ', 'Ε',
    'Ζ', 'Η', 'Θ', 'Ι', 'Κ',
    'Λ', 'Μ', 'Ν', 'Ξ', 'Ο',
    'Π', 'Ρ', 'Σ', 'Τ', 'Υ',
    'Φ', 'Χ', 'Ψ', 'Ω'
  ]], 
  ["ukrainian", [
    'А', 'Б', 'В', 'Г', 'Ґ',
    'Д', 'Е', 'Є', 'Ж', 'З',
    'И', 'І', 'Ї', 'Й', 'К', 
    'Л', 'М', 'Н', 'О', 'П',
    'Р', 'С', 'Т', 'У', 'Ф', 
    'Х', 'Ц', 'Ч', 'Ш', 'Щ', 
    'Ь', 'Ю', 'Я'
  ]]
])

type AppProps = {
  originalText: string, 
  currentText: string, 
  onUpdateText: any, 
  mode: string
  isExpanded: boolean, 
  onClick: any, 
  className?: string, 
}

export default function CipherControlPanel({originalText, currentText, onUpdateText, mode, isExpanded=true, onClick, className}: AppProps) {
  const [cipher, setCipher] = useState("shift");
  const [alphabet, setAlphabet] = useState("latin");
  const [mappings, setMappings] : [Map<string, string>, React.Dispatch<SetStateAction<Map<string, string>>>] = useState(new Map());
  const [options, setOptions] = useState({removeWhitespace: true, removeNonAlpha: true, preserveCase: false, useGroups: true, usePadding: true});

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

  function defineCustomAlphabet(event: any): void {
    event.preventDefault();
    // validate, then set
    let userInput = (event.currentTarget.elements.namedItem('alphabetInput') as HTMLInputElement).value; 
    if (userInput == "") {
      alert("Error: custom alphabet cannot be empty.");
      return; 
    } 
    let userAlpha = [];
    for (let i = 0; i < userInput.length; i++) {
      if (userAlpha.indexOf(userInput.charAt(i)) === -1) {
        userAlpha.push(userInput.charAt(i));
      } else {
        alert("Error: custom alphabets cannot have duplicate letters.");
        return; 
      }
    }
    ALPHABETS.set("user1", userAlpha);
    setAlphabet("user1");
  }

  function handleOptionsChange(event: ChangeEvent<HTMLInputElement>): void {
    let tempOpts = {...options}; 
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
        tempOpts.usePadding = tempOpts.useGroups; // padding is only relevant when groups are used 
        if (tempOpts.useGroups) {
          // If you use groups but don't remove whitespace, the results can contain multiple consecutive spaces, some meaningful and others not. This is almost certainly bad. 
          tempOpts.removeWhitespace = true; 
        }
        break; 
      case "usePadding":
        tempOpts.usePadding = event.currentTarget.checked; 
        if (tempOpts.usePadding) {
          tempOpts.useGroups = true; 
        }
        break; 
      default: 
        console.warn(`Warning: handleOptionsChange was called by unknown element ${event.currentTarget.name}`);
        return; 
    }
    setOptions(tempOpts);
  }
    
  function applyMonoCipher(event: any) {
    // console.log(`called applyMonoCipher(${event})`);
    let currAlphabet = ALPHABETS.get(alphabet) ?? []; 

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
      for (let i = 0; i < currAlphabet.length; i++) {
        let outIdx = i + shiftVal;
        if (outIdx < 0) {
          outIdx += currAlphabet.length; 
        } else if (outIdx > currAlphabet.length - 1) {
          outIdx -= currAlphabet.length; 
        }
        tempMap.set(currAlphabet[i], currAlphabet[outIdx]);
        if (options.preserveCase === true) {
          tempMap.set(currAlphabet[i].toLowerCase(), currAlphabet[outIdx].toLowerCase());
        }
      }
    } else if (cipher === "atbash") {
      for (let i = 0; i < currAlphabet.length; i++) {
        tempMap.set(currAlphabet[i], currAlphabet[currAlphabet.length - 1 - i]);
        if (options.preserveCase === true) {
          tempMap.set(currAlphabet[i].toLowerCase(), currAlphabet[currAlphabet.length - 1 - i].toLowerCase());
        }
      }
    } else if (cipher === "mono") {
      let keyword = event.currentTarget.elements.keyword.value; 
      keyword = keyword.toUpperCase(); 

      let i = 0; 
      for (i = 0; i < keyword.length; i++) {
        let a = currAlphabet[i];
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
      for (i = i; i < currAlphabet.length; i++) {
        let a = currAlphabet[i];
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
      if (currAlphabet.includes(inChar.toUpperCase())) {
        if (inChar !== inChar.toUpperCase() && options.preserveCase === false) {
          tempText += tempMap.get(inChar.toUpperCase());
        } else {
          tempText += tempMap.get(inChar);
        }
        g++; 
      } else if (inChar === ' ' && options.removeWhitespace === false && options.useGroups === false) {
        tempText += inChar;
        g++; 
      } else if (inChar !== ' ' && !currAlphabet.includes(inChar) && options.removeNonAlpha === false) {
        tempText += inChar; 
        g++; 
      }
    }
    // pad the final block if needed 
    if (options.useGroups && options.usePadding && g > 0) {
      let nullChar = event.currentTarget.elements.nullChar.value; 
      if (!currAlphabet.includes(nullChar)) {
        nullChar = currAlphabet[currAlphabet.length - 1];
      }
      while (g < groupSize) {
        tempText += tempMap.get(nullChar);
        g++; 
      }
    }
    console.log(tempText);
    onUpdateText(tempText);
  }

  function applyPolyCipher(event: any) {
    // console.log(`called applyPolyCipher(${event})`);
    let currAlphabet = ALPHABETS.get(alphabet) ?? [];
    let tempText = "";
    let groupSize = 0; 
    if (options.useGroups) {
      groupSize = parseInt(event.currentTarget.elements.groupSize.value); 
    }

    if (cipher === "vigenere") {
      let keyword = event.currentTarget.elements.keyword.value; 
      if (!keyword) {
        console.log("keyword is empty");
        return; 
      }
      keyword = keyword.toUpperCase(); 

      let g = 0; // group index counter 
      let k = 0; // keyword index 
      for (let i = 0; i < originalText.length; i++) {
        if (options.useGroups === true && g === groupSize) {
          tempText += ' ';
          g = 0; 
        } 

        let inChar = originalText.charAt(i);
        let charIdx = currAlphabet.indexOf(inChar.toUpperCase());

        if (currAlphabet.includes(inChar.toUpperCase())) {
          if (mode === "encrypt") {
            charIdx += currAlphabet.indexOf(keyword.charAt(k));
            if (charIdx >= currAlphabet.length) {
              charIdx -= currAlphabet.length;
            }
          } else if (mode === "decrypt") {
            charIdx -= currAlphabet.indexOf(keyword.charAt(i));
            if (charIdx < 0) {
              charIdx += currAlphabet.length; 
            }
          }

          if (inChar === inChar.toUpperCase() || options.preserveCase === false) {
            tempText += currAlphabet[charIdx];
          } else {
            tempText += currAlphabet[charIdx].toLowerCase();
          }
          g++; // increment current group size 

        } else if (inChar === ' ' && options.removeWhitespace === false && options.useGroups === false) {
          tempText += inChar;
          g++; 
        } else if (inChar !== ' ' && !currAlphabet.includes(inChar) && options.removeNonAlpha === false) {
          tempText += inChar; 
          g++; 
        }
  
        k++; // move to next keyword letter; go back to keyword[0] if you're at the end 
        if (k == keyword.length) {
          k = 0; 
        }
      }
      // pad the final block if needed 
      if (options.useGroups && options.usePadding && g > 0) {
        let nullChar = event.currentTarget.elements.nullChar.value; 
        if (!currAlphabet.includes(nullChar)) {
          nullChar = currAlphabet[currAlphabet.length - 1];
        }
        while (g < groupSize) {
          let charIdx = currAlphabet.indexOf(nullChar); 
          if (mode === "encrypt") {
            charIdx += currAlphabet.indexOf(keyword.charAt(k));
            if (charIdx > currAlphabet.length) {
              charIdx -= currAlphabet.length;
            }
          } else if (mode === "decrypt") {
            charIdx -= currAlphabet.indexOf(keyword.charAt(k));
            if (charIdx < 0) {
              charIdx += currAlphabet.length; 
            }
          }
          tempText += currAlphabet[charIdx];
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
    // console.log(`called applyCipher(${event})`);
    event.preventDefault(); 

    if (alphabet === "custom") {
      defineCustomAlphabet(event.currentTarget.elements.alphabetInput.value);
    }

    if (["shift", "atbash", "mono"].includes(cipher)) {
      applyMonoCipher(event);
    } else if (["vigenere"].includes(cipher)) {
      applyPolyCipher(event);
    }
  }

  return (
    <div className={(isExpanded ? "row-span-9 px-2 pb-2 " : "row-span-1 align-center ") + "order-3 md:col-span-3 md:row-span-full justify-center md:justify-start flex flex-col p-2 border border-primary shadow-[0_-8px_10px_-5px] shadow-slate-800/40"}>
      <h2 className="m-1 text-lg text-center md:text-left hover:text-white font-bold cursor-pointer" onClick={onClick}>Cipher Settings</h2>
      <div className={(!isExpanded ? "hidden md:block" : "md:block") + " overflow-scroll"}>
        <div className="m-1">
          <label htmlFor="ciphers">Select a cipher type: </label>
          <select id="ciphers" name="ciphers" className="rounded-md p-1 bg-primary/60 hover:bg-primary/80" value={cipher} onChange={e => setCipher(e.currentTarget.value)} disabled={!originalText}>
            <option value="shift">Caesar (Shift)</option>
            <option value="atbash">Atbash (Reverse Alphabet)</option>
            <option value="mono">Monoalphabetic Substitution</option>
            <option value="vigenere">Vigenère</option>
          </select>
        </div>
        <div className="m-1">
          <label htmlFor="alphabet">Select an alphabet: </label>
          <select id="alphabet" name="alphabet" className="rounded-md p-1 bg-primary/60 hover:bg-primary/80" value={alphabet} disabled={!originalText} onChange={e => setAlphabet(e.currentTarget.value)}>
            {(Array.from(ALPHABETS.keys()).map(e => 
              <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
            ))}
            <option value="custom">Define Custom Alphabet</option>
          </select>
        </div>
        <form onSubmit={e => defineCustomAlphabet(e)} className={"m-1 flex flex-col items-start" + (alphabet !== "custom" ? " hidden" : "")}>
          <label htmlFor="alphabetInput">Enter <strong>only</strong> the <u>uppercase letters</u> of your alphabet, <u>in order</u>:</label>
          <input type="text" id="alphabetInput" name="alphabetInput" className={"rounded-md p-1 bg-primary/60 self-stretch"} placeholder="ABCDEFGHIJKLMNOPQRSTUVWXYZ"></input>
          <input type="submit" value="Save" className={"bg-primary/80 border border-primary rounded-md py-1 px-2 m-1 self-center" + (!originalText ? "" : " hover:bg-primary hover:cursor-pointer")}></input>
        </form>
        <form onSubmit={applyCipher} className="flex flex-col items-start">
          <div className={"m-1 self-stretch" + (alphabet === "custom" ? " hidden" : "")}>
            <label htmlFor="alphabetDisplay">Current Alphabet: </label>
            <input type="text" id="alphabetDisplay" name="alphabetDisplay" className={"rounded-md p-1 bg-primary/60 w-full"} disabled value={ALPHABETS.get(alphabet)?.join("") ?? "Error: Alphabet Not Found"}></input>
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
            <input type="checkbox" id="rmWhitespace" name="rmWhitespace" disabled={!originalText || options.useGroups} checked={options.removeWhitespace} onChange={handleOptionsChange}></input>
            <label htmlFor="rmWhitespace" title="Remove all spaces, tabs, and other whitespace characters before processing."> Remove Whitespace</label>
          </div>
          <div className="m-1">
            <input type="checkbox" id="rmNonAlpha" name="rmNonAlpha" disabled={!originalText} checked={options.removeNonAlpha} onChange={handleOptionsChange}></input>
            <label htmlFor="rmNonAlpha" title="Remove numbers, punctuation, and special characters before processing."> Remove Non-Letter Characters</label>
          </div>
          <div className="m-1">
            <input type="checkbox" id="preserveCase" name="preserveCase" disabled={!originalText} checked={options.preserveCase} onChange={handleOptionsChange}></input>
            <label htmlFor="preserveCase" title="Map uppercase letters to uppercase letters, and lowercase letters to lowercase letters."> Preserve Case</label>
          </div>        
          <div className="flex flex-row align-center gap-8">
            <div>
              <div className="m-1">
                <input type="checkbox" id="useGroups" name="useGroups" disabled={!originalText} checked={options.useGroups} onChange={handleOptionsChange}></input>
                <label htmlFor="useGroups" title="Remove whitespace, then break text into equal-sized blocks."> Use Groups</label>
              </div>
              <div className="m-1">
                <label htmlFor="groupSize">Group Size: </label>
                <input type="number" id="groupSize" name="groupSize" className={"rounded-md p-1 bg-primary/60 hover:bg-primary/80"} min={0} max={originalText.length} defaultValue={5} disabled={!originalText || !options.useGroups}></input> 
              </div>
            </div>
            <div>            
              <div className="m-1">
                <input type="checkbox" id="usePadding" name="usePadding" disabled={!originalText || !options.useGroups} checked={options.usePadding} onChange={handleOptionsChange}></input>
                <label htmlFor="usePadding" title="Fill any extra space in the final block with a specific letter before processing."> Pad End</label>
              </div>
              <div className="m-1">
                <label htmlFor="nullChar">Null Character: </label>
                <input type="text" id="nullChar" name="nullChar" className={"rounded-md p-1 bg-primary/60 hover:bg-primary/80 w-8"} maxLength={1} defaultValue={alphabet !== "custom" ? ALPHABETS.get(alphabet)![ALPHABETS.get(alphabet)!.length - 1] : "X"} disabled={!originalText || !options.usePadding}></input> 
              </div>
            </div>
          </div>
          <input 
            type="submit" 
            value="Apply Changes" 
            className={"bg-primary/80 rounded-md py-1 px-2 m-1 w-min self-center cursor-pointer transition duration-300 " + (originalText ? "hover:bg-primary dark:hover:bg-violet-700 active:bg-blue-400 active:shadow-inner active:shadow-blue-800" : "")} 
            disabled={!originalText}
          ></input>
        </form> 
        {alphabet !== "custom" && ["shift", "atbash", "mono"].includes(cipher) ? 
          <CharMappings 
            mappings={mappings} 
            mode={mode} 
            alphabet={ALPHABETS.get(alphabet) ?? []}
            key={currentText}>
          </CharMappings>
          : ""
        }
      </div>
    </div>
  )
}