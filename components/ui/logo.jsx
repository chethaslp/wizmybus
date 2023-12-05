import { Comfortaa } from "next/font/google";

const f = Comfortaa({ subsets: ['latin'],preload:true })
export function Logo(){
    return <div className={`${f.className} text-center`}><b>dmu.</b></div>
  }