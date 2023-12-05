"use client"
import { Comfortaa } from "next/font/google";
import { ImSpinner2 } from 'react-icons/im'


const f = Comfortaa({ subsets: ['latin'], preload:true })

export default function Loading({msg}) {
    return (
        <div className={`${f.className} flex text-white gap-3  h-screen w-screen flex-col z-50`}>
            <div className="flex text-4xl justify-center items-center h-full w-full animate-pulse transition-all drop-shadow-xl">
                <b>&lt;Bootcamp/&gt;</b>
            </div> 
            <div className="flex justify-center items-center mb-10 flex-row gap-2 text-gray-100 text-center">
                <ImSpinner2 className="animate-spin"/>
                <small>{msg}</small>
            </div>
        </div>
    )
  }

  