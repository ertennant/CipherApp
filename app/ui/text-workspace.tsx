import Image from "next/image";
import copyIcon from '../../public/copy-icon.svg';
import revertIcon from '../../public/revert-icon.svg';
import { FormEvent, SetStateAction, useState } from "react";

export default function TextWorkspace({originalText, currentText, onTextInput, mode, onModeChange}: any) {
  const [text, setText] : [string, React.Dispatch<SetStateAction<string>>] = useState(currentText);
  function copyText() {
    console.log(`called copyText()`);
    navigator.clipboard.writeText(currentText);
  }

  function handleSubmit(event: FormEvent<any>) {
    event.preventDefault();
    console.log(event.currentTarget.elements.textinput.value);
    onTextInput(event.currentTarget.elements.textinput.value);
  }

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
          <button className="rounded-full hover:bg-blue-900 p-2" onClick={copyText}>
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
      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea 
          name="textinput"
          className="rounded-lg p-1 text-black text-lg resize-none font-mono" 
          rows={12} 
          placeholder="Enter your message here!"
          disabled={originalText != ""}
        ></textarea>
        <input type="submit"></input>
      </form>
      <p className={!currentText ? "bg-white text-slate-400 font-mono text-lg p-1 rounded-lg" : "bg-white text-black font-mono text-lg p-1 rounded-lg"}>{!currentText ? "Result will be displayed here." : currentText}</p>
    </div>
  )
}