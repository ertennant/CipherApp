"use client";

import { useState } from "react";
import Image from "next/image"

type TextPanelProps = {
  title: string, 
  content: string, 
  placeholder: string, 
  readOnly: boolean, 
  // isExpanded?: number, 
  onSubmit?: any, 
  onClick?: any, 
  visibility: string, 
}

export default function TextPanel({title, content, placeholder, readOnly, onSubmit, onClick, visibility}: TextPanelProps) {
  const [value, setValue] = useState(content);

  return (
    <div className={
      (visibility === "all" ? "px-2 pb-2 row-span-9 md:row-span-10 " : visibility === "md" ? "px-2 pb-2 justify-center align-center md:row-span-10 " : "row-span-1 justify-center align-center ") + 
      (readOnly ? "order-2 xl:row-span-5 " : "order-1 xl:row-span-6 ") + 
      "w-full h-full md:col-span-2 xl:pb-2 xl:px-2 flex flex-col border border-primary shadow-[0_-8px_10px_-5px] shadow-slate-800/40 dark:shadow-slate-900/80"}>
      <div className="flex flex-row items-center">
        <div className="basis-1/6">
        </div>
        <h2 className="cursor-pointer basis-2/3 text-lg font-bold text-center hover:text-white" onClick={onClick}>{title}</h2>
        <div className="basis-1/6 text-right">
          <button 
            className={(visibility === "all" ? "inline-block" : visibility === "md" ? "hidden md:inline-block" : "hidden") + " xl:inline-block rounded-full hover:bg-primary/60 p-2"}
            onClick={!readOnly ? () => navigator.clipboard.writeText(value) : () => navigator.clipboard.writeText(content)}
            title="Copy Text"
          >
            <Image
              className="dark:invert"
              src="./copy-icon.svg"
              alt="Copy Text"
              height={20}
              width={20}
            >
            </Image>
          </button>
          {/* {!readOnly ?
            <button className="rounded-full hover:bg-primary/60 p-2">
              <Image
                src="./edit-icon.svg"
                alt="Edit Text"
                height={20}
                width={20}
              ></Image>
            </button>
            : ""
          } */}
        </div>
      </div>
      <div className={(visibility === "all" ? "block" : visibility === "md" ? "hidden md:block" : "hidden") + " xl:block flex flex-col grow"}>
        <textarea 
          name="textinput"
          className="rounded-lg p-1 text-lg resize-none font-mono h-full w-full bg-primary/60 hover:bg-primary/80 hover:cursor-text" 
          placeholder={placeholder}
          disabled={readOnly}
          value={!readOnly ? value : content}
          onChange={(e) => setValue(e.currentTarget.value)}
        ></textarea>
      </div>
      {!readOnly ? 
        <button 
          type="button" 
          onClick={() => onSubmit(value)}
          className={(visibility === "all" ? "block" : visibility === "md" ? "hidden md:block" : "hidden") + " xl:block bg-primary/80 mt-1 rounded-md w-full p-2 hover:bg-primary dark:hover:bg-violet-700 active:bg-blue-400 active:shadow-inner active:shadow-blue-800 cursor-pointer transition duration-300"}
        >
          Done
        </button>
        : ""
      }
    </div>

  )
}