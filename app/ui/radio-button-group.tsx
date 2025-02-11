type RadioButtonGroupProps = {
  active: string, // currently active option  
  options: string[], // array of options 
  onChange: any, // function called when an option is selected 
}

export default function RadioButtonGroup({active, options, onChange}: RadioButtonGroupProps) {
  return (
    <div className="row-span-1 flex flex-row items-center px-2  border border-primary md:col-span-2">
      {options.map(opt => 
        <div className="inline-block" key={opt}>
          <input className="hidden" type="radio" id={opt} name={opt} value={opt} checked={opt === active} onChange={() => onChange(opt)}></input>
          <label className={"cursor-pointer px-2 py-1 rounded-md " + (opt === active ? "font-black bg-blue-400 dark:bg-cyan-700 shadow-inner shadow-blue-800 dark:shadow-cyan-900" : "text-gray-600 hover:text-gray-700 dark:hover:text-gray-500")} htmlFor={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</label>
        </div>
      )}
    </div>
  )
}