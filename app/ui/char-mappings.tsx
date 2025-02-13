/** Component for displaying plaintext-to-ciphertext letter mappings (for monoalphabetic ciphers only).
  * Path: /cipher-app/app/ui/char-mappings.tsx
  */

import Image from "next/image";
import arrowDown from '../../public/arrow-down.svg';
import arrowUp from '../../public/arrow-up.svg';

type AppProps = {
  mappings: Map<string, string>, 
  alphabet: string[], 
  mode: string,
  visibility: string, 
}

export default function CharMappings({mappings, alphabet, mode, visibility}: AppProps) {
  // For displaying how each item in the set of chars in originalText is mapped to a target char. 
  let charMapElements = (!mappings || mappings.size === 0) ? "" : 
  Array.from(mappings.keys()).map(c => 
    alphabet.includes(c) ? 
      <div key={c} className="my-2">
        <p className="font-bold text-center text-text-normal bg-primary border-solid border-y-2 border-x border-text-normal leading-8 w-8 h-8">{c}</p>
        <Image
          src={mode === "encrypt" ? arrowDown : arrowUp}
          alt={mode === "encrypt" ? "down arrow" : "up arrow"}
          className="w-8 h-8 p-1 dark:invert"
        >
        </Image>
        <p className="font-bold text-center text-text-normal bg-primary border-solid border-y-2 border-x border-text-normal leading-8  w-8 h-8">
          {mappings.get(c)}
        </p>
      </div>
    : ""
  ) 

  return (
    <div className="">
      <div className={(visibility === "all" ? "flex flex-row flex-wrap" : visibility === "md" ? "hidden md:flex md:flex-row md:flex-wrap" : "hidden")}>
        {charMapElements}
      </div>
    </div>
  )
}