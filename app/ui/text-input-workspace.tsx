import Image from "next/image";
import copyIcon from '../../public/copy-icon.svg';
import revertIcon from '../../public/revert-icon.svg';

export default function TextInputWorkspace({text, onTextChange, mode, onModeChange}: any) {
  return (
    <div className="flex grow flex-col">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row justify-start">
          <div className={mode==="encrypt" ? "font-bold" : ""}>
            <input className="hidden" type="radio" id="encrypt" name="encdir" value="encrypt" checked={mode==="encrypt"} onChange={(e) => onModeChange(e.currentTarget.value)}></input>
            <label className="bg-blue-950 rounded-md p-2 hover:bg-blue-900 hover:cursor-pointer" htmlFor="encrypt">Encrypt</label>
          </div>
          <div className={mode==="decrypt" ? "font-bold" : ""}>
            <input className="hidden" type="radio" id="decrypt" name="encdir" value="decrypt" checked={mode==="decrypt"} onChange={(e) => onModeChange(e.currentTarget.value)}></input>
            <label className="bg-blue-950 rounded-md p-2 hover:bg-blue-900 hover:cursor-pointer" htmlFor="decrypt">Decrypt</label>
          </div>
        </div>
        <div className="flex flex-row justify-end">
          <button className="rounded-full hover:bg-blue-900 p-2">
            <Image
              src={copyIcon}
              alt="Copy Text"
            >
            </Image>
          </button>
          <button className="justify-self-end rounded-full hover:bg-blue-900 p-2">
            <Image
              src={revertIcon}
              alt="Revert Changes"
            ></Image>
          </button>
        </div>
      </div>
      <textarea 
        value={text} 
        onChange={e => onTextChange(e.currentTarget.value)} 
        className="rounded-lg p-1 text-black text-lg resize-none font-mono" 
        rows={12} 
        placeholder="Enter your message here!"
      ></textarea>
    </div>
  )
}