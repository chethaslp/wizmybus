import { Comfortaa } from "next/font/google";
import { RiBusWifiFill } from "react-icons/ri";

const f = Comfortaa({ subsets: ['latin'],preload:true })
export function Logo(){
    return <div className={`${f.className} text-center`}><RiBusWifiFill /></div>
  }