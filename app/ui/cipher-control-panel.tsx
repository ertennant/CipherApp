/** Component for displaying and adjusting cipher settings.  
  * Path: /cipher-app/app/ui/cipher-control-panel.tsx
  */

"use client";
import { useState, SetStateAction, ChangeEvent, MouseEvent, KeyboardEvent } from "react";
import CharMappings from "./char-mappings";
import { mapCaesar, mapAtbash, mapMonoSubstitution, processMonoCipherText, applyVigenere } from "../cipher";

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
  onUpdateText: (text: string) => void, 
  mode: string
  isExpanded: boolean, 
  onClick: () => void, 
}

export default function CipherControlPanel({originalText, currentText, onUpdateText, mode, isExpanded=true, onClick}: AppProps) {
  const [cipher, setCipher] = useState("shift");
  const [alphabet, setAlphabet] = useState("latin");
  const [mappings, setMappings] : [Map<string, string>, React.Dispatch<SetStateAction<Map<string, string>>>] = useState(new Map());
  const [options, setOptions] = useState({removeWhitespace: true, removeNonAlpha: true, preserveCase: false, useGroups: true, groupSize: 5, usePadding: true, nullCharacter: alphabet[alphabet.length - 1]});
  const [activeSubPanel, setActiveSubPanel] = useState("controls");  
  
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
      case "groupSize":
        tempOpts.groupSize = parseInt(event.currentTarget.value); 
        break; 
      case "nullChar":
        tempOpts.nullCharacter = event.currentTarget.value; 
        break; 
      default: 
        console.warn(`Warning: handleOptionsChange was called by unknown element ${event.currentTarget.name}`);
        return; 
    }
    setOptions(tempOpts);
  }

  function applyCipher(event: any) {
    event.preventDefault(); 

    if (alphabet === "custom") {
      defineCustomAlphabet(event.currentTarget.elements.alphabetInput.value);
    }

    if (cipher === "vigenere") {
      let keyword = event.currentTarget.elements.keyword.value; 
      if (!keyword) {
        console.log("keyword is empty");
        return; 
      }
      let outputText = applyVigenere(ALPHABETS.get(alphabet)!, originalText, keyword, mode, options);
      onUpdateText(outputText);
      return; 
    } 

    let map; 
    if (cipher === "shift") {
      map = mapCaesar(ALPHABETS.get(alphabet)!, parseInt(event.currentTarget.elements.shift.value), options.preserveCase, mode);
    } else if (cipher === "atbash") {
      map = mapAtbash(ALPHABETS.get(alphabet)!, options.preserveCase);
    } else if (cipher === "mono") {
      map = mapMonoSubstitution(ALPHABETS.get(alphabet)!, event.currentTarget.elements.keyword.value, options.preserveCase, mode);
    }
    setMappings(map!);
    let outputText = processMonoCipherText(ALPHABETS.get(alphabet)!, originalText, map!, options);
    onUpdateText(outputText);
  }

  return (
    <div className={(isExpanded ? "row-span-9 px-2 pb-2 " : "row-span-1 align-center ") + "order-3 md:col-span-3 md:row-span-full justify-start md:justify-start flex flex-col p-2 border border-primary shadow-[0_-8px_10px_-5px] shadow-slate-800/40"}>
      <h2 
        className="m-1 text-lg text-center md:text-left hover:text-white font-bold cursor-pointer" 
        onClick={onClick}
      >{activeSubPanel === "controls" ? "Cipher Settings" : activeSubPanel === "mappings" ? "Letter Mappings" : ""}</h2>
      <div className={(isExpanded && activeSubPanel === "controls" ? "block overflow-scroll" : activeSubPanel === "controls" ? "hidden md:block md:overflow-scroll" : "hidden")}>
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
      </div>
      {alphabet !== "custom" && ["shift", "atbash", "mono"].includes(cipher) ? 
        <CharMappings 
          mappings={mappings} 
          mode={mode} 
          alphabet={ALPHABETS.get(alphabet) ?? []}
          key={currentText}
          visibility={(isExpanded && activeSubPanel === "mappings") ? "all" : activeSubPanel === "mappings" ? "md" : "none"}
        >
        </CharMappings>
        : ""
      }
      <button 
        type="button" 
        className={"bg-primary/80 rounded-md py-1 px-2 m-1 w-min text-nowrap self-center cursor-pointer transition duration-300 " + (originalText ? "hover:bg-primary dark:hover:bg-violet-700 active:bg-blue-400 active:shadow-inner active:shadow-blue-800 " : "") + (isExpanded ? "block" : "md:block hidden")} 
        disabled={!originalText}
        onClick={() => activeSubPanel === "controls" ? setActiveSubPanel("mappings") : setActiveSubPanel("controls")}
      >{activeSubPanel === "controls" ? "View Letter Mappings" : "View Cipher Settings"}</button>
    </div>
  )
}