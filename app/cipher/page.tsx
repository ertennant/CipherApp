"use client";

import TextWorkspace from '@/app/ui/text-workspace';
import CipherControlPanel from '../ui/cipher-control-panel';
import { useState } from 'react';

export default function Page() {
  const [originalText, setOriginalText] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [mode, setMode] = useState("encrypt");

  function handleInputText(text: string) {
    setOriginalText(text);
    setCurrentText(text);
  }

  function handleUpdateText(text: string) {
    console.log(`called handleUpdateText(${text})`)
    setCurrentText(text);
  }

  function handleChangeMode(newMode: string) {
    setMode(newMode);
  }

  return (
    <div className="flex h-screen flex-col p-6">
      <header className="text-center">Cipher Tool</header>
      <main className="flex grow flex-row gap-4">
        <TextWorkspace 
          originalText={originalText}
          currentText={currentText} 
          onTextInput={handleInputText} 
          mode={mode}
          onModeChange={handleChangeMode}
        />
        <CipherControlPanel 
          originalText={originalText}
          currentText={currentText}
          onUpdateText={handleUpdateText}
          mode={mode}
        />
      </main>
      <footer className="text-center">
        &copy; Elizabeth Tennant 2024
      </footer>
    </div>
  )
}