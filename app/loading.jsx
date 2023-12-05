"use client"
import { Comfortaa } from "next/font/google";
import { ImSpinner2 } from 'react-icons/im'
import { Logo } from "../components/ui/logo";


const f = Comfortaa({ subsets: ['latin'],preload:true })

export default function Loading({msg}) {
    return (
        <div className={`flex text-black gap-3  h-screen w-screen flex-col z-50`}>
            <div className="flex text-6xl justify-center items-center h-full w-full animate-pulse transition-all">
                <Logo/>
            </div> 
            <div className="flex justify-center items-center mb-10 flex-row gap-2 text-gray-700 text-center">
                <ImSpinner2 className="animate-spin"/>
                <small>{msg}</small>
            </div>
        </div>
    )
  }

  