export default function ShiftCipherOptions() {  
  return (
    <div>
      <input type="number" name="shift" className="text-black" min={0} max={26} defaultValue={0}></input>
    </div>  
    )
}
