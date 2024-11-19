import Image from "next/image";
import arrowDown from '../../public/arrow-down.svg';
import arrowUp from '../../public/arrow-up.svg';

export default function CharMappings({mappings, mode}: any) {
  // For displaying how each item in the set of chars in originalText is mapped to a target char. 
  let charMapElements = (!mappings || mappings.keys().size === 0) ? "" : 
  Array.from(mappings.keys()).sort().map(c => 
    <div key={c}>
      <p className="text-center text-black bg-white border-solid border-2 border-black w-8 h-8">{c}</p>
      <Image
        src={mode === "encrypt" ? arrowDown : arrowUp}
        alt={mode === "encrypt" ? "down arrow" : "up arrow"}
        className="w-8 h-8 p-1"
      >
      </Image>
      <p className="text-center text-black bg-white border-solid border-2 border-black w-8 h-8">
        {mappings.get(c)}
      </p>
    </div>
  ) 

  return (
    <div className="">
      <h2 className={"m-1 text-lg font-bold" + (mappings.size < 1 ? " hidden" : "")}>Letter Mappings</h2>
      <div className="flex flex-row">
        {charMapElements}
      </div>
    </div>
  )
}