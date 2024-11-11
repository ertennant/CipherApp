"use client";

import TextInputWorkspace from '@/app/ui/text-input-workspace';
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
    setCurrentText(text);
  }

  function handleChangeMode(newMode: string) {
    setMode(newMode);
  }

  return (
    <div className="flex min-h-screen flex-col p-6">
      <header className="text-center">Cipher Tool</header>
      <main className="flex grow flex-row gap-4">
        <TextInputWorkspace 
          text={currentText} 
          onTextChange={handleInputText} 
          mode={mode}
          onModeChange={handleChangeMode}
        />
        <CipherControlPanel 
          currentText={currentText}
          originalText={originalText}
          updateText={handleUpdateText}
          mode={mode}
        />
      </main>
      <footer className="text-center">
        &copy; Elizabeth Tennant 2024
      </footer>
    </div>
  )
}