"use client";

import TextPanel from '../ui/text-panel';
import CipherControlPanel from '../ui/cipher-control-panel';
import { useState } from 'react';
import RadioButtonGroup from '../ui/radio-button-group';

export default function Page() {
  const [originalText, setOriginalText] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [mode, setMode] = useState("encrypt");
  const [activePanel, setActivePanel] = useState("input");
  const [lastActiveText, setLastActiveText] = useState("input");

  function handleInputText(text: string) {
    console.log(`called handleInputText(${text})`);
    setOriginalText(text);
    setCurrentText(text);
    setLastActiveText("output");
    setActivePanel("settings");
    console.log(`lastActiveText = ${lastActiveText}, activePanel = ${activePanel}`);
  }

  function handleUpdateText(text: string) {
    console.log(`called handleUpdateText(${text})`);
    setCurrentText(text);
    setLastActiveText("output");
    setActivePanel("output");
    console.log(`lastActiveText = ${lastActiveText}, activePanel = ${activePanel}`);
  }

  return (
    <main className="text-text-normal h-full grid content-start grid-rows-12 md:grid-flow-col md:grid-cols-5 bg-primary/55 dark:bg-primary/75 backdrop-blur-md shadow-[0_8px_10px_-5px] shadow-slate-800/40">
      <RadioButtonGroup
        active={mode}
        options={["encrypt", "decrypt"]}
        onChange={setMode}
      >
      </RadioButtonGroup>
      <TextPanel
        title={mode === "encrypt" ? "Plaintext" : "Ciphertext"}
        content={originalText}
        placeholder="Enter your message here."
        readOnly={false}
        // isExpanded={activePanel === "input" ? 2 : activeText === "input" ? 1 : 0}
        onSubmit={handleInputText}
        onClick={() => {setActivePanel("input"); setLastActiveText("input");}}
        visibility={activePanel === "input" ? "all" : lastActiveText === "input" ? "md" : "xl"}
      >
      </TextPanel>
      <TextPanel
        title={mode === "encrypt" ? "Ciphertext" : "Plaintext"}
        content={currentText}
        // isExpanded={activePanel === "output" ? 2 : activeText === "output" ? 1 : 0}
        placeholder="Result will be displayed here."
        readOnly={true}
        onClick={() => {setActivePanel("output"); setLastActiveText("output");}}
        visibility={activePanel === "output" ? "all" : lastActiveText === "output" ? "md" : "xl"}
      >
      </TextPanel>
      <CipherControlPanel 
        originalText={originalText}
        currentText={currentText}
        isExpanded={activePanel === "settings"}
        onClick={() => setActivePanel("settings")}
        onUpdateText={handleUpdateText}
        mode={mode}
      />
    </main>
  )
}