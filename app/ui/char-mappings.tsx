import Image from "next/image";
import arrowDown from '../../public/arrow-down.svg';
import arrowUp from '../../public/arrow-up.svg';

type AppProps = {
  mappings: Map<string, string>, 
  alphabet: string[], 
  mode: string
}

export default function CharMappings({mappings, alphabet, mode}: AppProps) {
  // For displaying how each item in the set of chars in originalText is mapped to a target char. 
  let charMapElements = (!mappings || mappings.size === 0) ? "" : 
  Array.from(mappings.keys()).map(c => 
    alphabet.includes(c) ? 
      <div key={c} className="my-2">
        <p className="text-center text-black bg-white border-solid border-y-2 border-x border-black w-8 h-8">{c}</p>
        <Image
          src={mode === "encrypt" ? arrowDown : arrowUp}
          alt={mode === "encrypt" ? "down arrow" : "up arrow"}
          className="w-8 h-8 p-1"
        >
        </Image>
        <p className="text-center text-black bg-white border-solid border-y-2 border-x border-black w-8 h-8">
          {mappings.get(c)}
        </p>
      </div>
    : ""
  ) 

  return (
    <div className="">
      <h2 className={"m-1 text-lg font-bold" + (mappings.size < 1 ? " hidden" : "")}>Letter Mappings</h2>
      <div className="flex flex-row flex-wrap">
        {charMapElements}
      </div>
    </div>
  )
}