import { useState } from "react";

export default function MonoCipherOptions({originalText}: any) { 
  const [chars, setChars] : [Map<string, number[]>, React.Dispatch<React.SetStateAction<Map<string, number[]>>>] = useState(initCharIndices());
  const [mappings, setMappings] : [Map<string, string>, React.Dispatch<React.SetStateAction<Map<string, string>>>] = useState(new Map());

  // Create a Map that assigns each distinct character in originalText to an array of the indices where it occurs. 
  function initCharIndices() {
    let indices : Map<string, number[]> = new Map(); 
    for (let i = 0; i < originalText.length; i++) {
      let p : string = originalText.charAt(i);
      if (!indices.has(p)) {
        indices.set(p, [i]);
      } else {
        indices.get(p)?.push(i);
      }
    }
    console.log(indices);
    return indices; 
  }

  // Generate the set of plaintext-to-ciphertext char mapping HTML inputs for originalText. 
  const charMappings = chars != null && chars.size > 0 ? [...chars.keys()].sort().map(p => 
    <div key={p}>
      <label className="p-1 text-center font-mono" htmlFor={"map-"+p}>{p+":"}</label>
      <input className="rounded-md p-1 w-8 h-8 text-center text-black" name={"map-"+p} type="text" placeholder={p} defaultValue={mappings.get(p) ?? ""} onChange={e => updateMapping(p, e.currentTarget.value)}></input>
    </div>
  ) : "";

  function applyKeyword(keyword: string) {
    console.log(`applyKeyword(${keyword}) not yet implemented`);
    let latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  }

  function updateMapping(p: string, c: string) {
    // console.log(`updateMapping(${p}, ${c}) not yet implemented`);
    let temp = mappings; 
    temp.set(p, c);
    setMappings(temp);
  }

  return (
    <div className="p-1">
      <input className="rounded-md p-1 mt-1 mb-1" type="text" name="keyword" placeholder="keyword" onChange={e => applyKeyword(e.currentTarget.value)}></input>
      <div className="grid gap-1">
        {charMappings}
      </div>
    </div>  
    )
}
