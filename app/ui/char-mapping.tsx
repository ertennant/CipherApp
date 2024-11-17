import Image from "next/image";
import arrowDown from '../../public/arrow-down.svg';
import arrowUp from '../../public/arrow-up.svg';

export default function CharMapping({a, b, mode}: any) {
  return (
    <div>
      <p className="text-center text-black bg-white border-solid border-2 border-black w-8 h-8">{a}</p>
      <Image
        src={mode == "encrypt" ? arrowDown : arrowUp}
        alt={mode == "encrypt" ? "down arrow" : "up arrow"}
        className="w-8 h-8 p-1"
      >
      </Image>
      <p className="text-center text-black bg-white border-solid border-2 border-black w-8 h-8">
        {b}
      </p>
    </div>
  )
}