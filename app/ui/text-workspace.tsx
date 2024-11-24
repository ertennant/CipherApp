import Image from "next/image";
import copyIcon from '../../public/copy-icon.svg';
import editIcon from '../../public/edit-icon.svg';
import { FormEvent, SetStateAction, useState } from "react";

type AppProps = {
  originalText: string, 
  currentText: string, 
  onTextInput: any, 
  mode: string, 
  onModeChange: any
}

export default function TextWorkspace({originalText, currentText, onTextInput, mode, onModeChange}: AppProps) {
  const [text, setText] : [string, React.Dispatch<SetStateAction<string>>] = useState(currentText);
  function copyInputText() {
    // console.log(`called copyInputText()`);
    navigator.clipboard.writeText(originalText);
  }

  function copyOutputText() {
    // console.log(`called copyOutputText()`);
    navigator.clipboard.writeText(currentText);
  }

  function editInputText() {
    // console.log(`called editInputText()`);
    onTextInput("");
  }

  function handleSubmit(event: FormEvent<any>) {
    event.preventDefault();
    // console.log(event.currentTarget.elements.textinput.value);
    onTextInput(event.currentTarget.elements.textinput.value);
  }

  return (
    <div className="flex flex-col w-1/2 text-text-normal">
      <div className="flex flex-col border border-primary bg-primary/55 backdrop-blur-md rounded-lg h-1/2 pl-2 pr-2 pb-2 mb-1">
        <div className="flex flex-row items-center">
          <div className="basis-1/3">
            <div className="inline-block">
              <input className="hidden" type="radio" id="encrypt" name="encdir" value="encrypt" checked={mode==="encrypt"} onChange={(e) => onModeChange(e.currentTarget.value)}></input>
              <label className={"rounded-md p-2 hover:bg-primary/80 hover:cursor-pointer" + (mode==="encrypt" ? " bg-primary/60 font-bold" : "")} htmlFor="encrypt">Encrypt</label>
            </div>
            <div className="inline-block">
              <input className="hidden" type="radio" id="decrypt" name="encdir" value="decrypt" checked={mode==="decrypt"} onChange={(e) => onModeChange(e.currentTarget.value)}></input>
              <label className={"rounded-md p-2 hover:bg-primary/80 hover:cursor-pointer" + (mode==="decrypt" ? " font-bold bg-primary/60" : "")} htmlFor="decrypt">Decrypt</label>
            </div>
          </div>
          <h2 className="basis-1/3 text-lg font-bold text-center">{mode==="encrypt" ? "Plaintext" : "Ciphertext"}</h2>
          <div className="basis-1/3 text-right">
            <button className="rounded-full hover:bg-primary/60 p-2" onClick={copyInputText}>
              <Image
                src={copyIcon}
                alt="Copy Text"
              >
              </Image>
            </button>
            <button className="rounded-full hover:bg-primary/60 p-2" onClick={editInputText}>
              <Image
                src={editIcon}
                alt="Edit Text"
              ></Image>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col grow">
          <textarea 
            name="textinput"
            className="rounded-lg p-1 text-lg resize-none font-mono h-full bg-primary/60 hover:bg-primary/80 hover:cursor-text" 
            placeholder="Enter your message here!"
            disabled={originalText != ""}
          ></textarea>
          <input type="submit" 
            className={"bg-slate-200 mt-1 rounded-md p-2 hover:bg-primary/60 hover:cursor-pointer" + (currentText != "" ? " hidden" : "")}>
          </input>
        </form>
      </div>
      <div className="flex flex-col border border-primary bg-primary/55 backdrop-blur-md rounded-lg h-1/2 pl-2 pr-2 pb-2 mb-1">
        <div className="flex flex-row items-center">
          <div className="basis-1/3"></div>
          <h2 className="basis-1/3 text-lg font-bold text-center">{mode==="encrypt" ? "Ciphertext" : "Plaintext"}</h2>
          <div className="basis-1/3 text-right">
            <button className="rounded-full hover:bg-slate-200 p-2" onClick={copyOutputText}>
              <Image
                src={copyIcon}
                alt="Copy Text"
              >
              </Image>
            </button>
          </div>
        </div>
        <textarea 
          disabled 
          name="outputTextArea"
          className={"bg-primary/60 font-mono text-lg resize-none w-full p-1 rounded-lg grow bg-primary/60 hover:bg-primary/80 hover:cursor-text" + (!currentText ? " text-slate-400" : "")}
          value={!currentText ? "Result will be displayed here." : currentText}
        ></textarea>
      </div>
    </div>
  )
}