import Image from "next/image";
import copyIcon from '../../public/copy-icon.svg';
import editIcon from '../../public/edit-icon.svg';
import { FormEvent, SetStateAction, useState } from "react";
import TextPanel from "./text-panel";

type AppProps = {
  originalText: string, 
  currentText: string, 
  onTextInput: any, 
  mode: string, 
  onModeChange: any,
  activePanel: string, 
  setActivePanel: any, 
  className?: string, 
}

export default function TextWorkspace({originalText, currentText, onTextInput, mode, onModeChange, activePanel, setActivePanel, className}: AppProps) {
  const [text, setText] : [string, React.Dispatch<SetStateAction<string>>] = useState(currentText);
  // function copyInputText() {
  //   // console.log(`called copyInputText()`);
  //   navigator.clipboard.writeText(originalText);
  // }

  // function copyOutputText() {
  //   // console.log(`called copyOutputText()`);
  //   navigator.clipboard.writeText(currentText);
  // }

  function editInputText() {
    // console.log(`called editInputText()`);
    onTextInput("");
  }

  // function handleSubmit(event: FormEvent<any>) {
  //   event.preventDefault();
  //   // console.log(event.currentTarget.elements.textinput.value);
  //   onTextInput(event.currentTarget.elements.textinput.value);
  // }

  return (
    <div className={"grow flex flex-col text-text-normal"}>
      <TextPanel
        title={mode === "encrypt" ? "Plaintext" : "Ciphertext"}
        content={originalText}
        placeholder="Enter your message here."
        readOnly={false}
        isExpanded={activePanel === "input"}
        onSubmit={onTextInput}
        onClick={() => setActivePanel("input")}
      >
      </TextPanel>
      <TextPanel
        title={mode === "encrypt" ? "Ciphertext" : "Plaintext"}
        content={currentText}
        isExpanded={activePanel === "output"}
        placeholder="Result will be displayed here."
        readOnly={true}
        onClick={() => setActivePanel("output")}
      >
      </TextPanel>
    </div>
  )
}