"use client"
import { Dropdown, Image, ListGroup, Navbar } from "react-bootstrap";
import { BiLinkExternal, BiFile, BiLinkAlt, BiCopy,BiText, BiDownload } from 'react-icons/bi'
import { Comfortaa } from "next/font/google";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { signout } from "@/components/fb/auth";

const f = Comfortaa({ subsets: ['latin'], preload:true})

function openLink(url){
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

function copy(url){
  navigator.clipboard.writeText(url)
}

function redirect(url){
  window.location.href = url;
}

function ResourceItem({l_type, link}){
  return (
    <ListGroup.Item className="!flex !flex-row items-center justify-between" >
      <span className="!flex !flex-row items-center ">
        {(()=>{
          if(l_type==="site") return <BiLinkAlt className="mr-2"/>
          else if(l_type=="file") return <BiFile className="mr-2"/>
          return <BiText className="mr-2"/>
        })()
        }
        {link}
      </span>
      <span className="!flex !flex-row items-center">
        {(l_type==="site" || l_type==="text")? <BiCopy className="cursor-pointer" onClick={() => copy(link) }/>:''}
        {(l_type==="site")?
          <BiLinkExternal className="ml-3 cursor-pointer" onClick={() => openLink(link)}/>:
          (l_type==="file")?<BiDownload className="ml-3 cursor-pointer" onClick={() => openLink(link)}/>:''
        }
      </span>
    </ListGroup.Item>)
}

function ChatItem({e, msg, user}){
  if(e == "userJoined"){
    return <ListGroup.Item className="mb-1" >
      <div className="!flex gap-1 flex-row border rounded bg-slate-200 p-1 items-center justify-center"><Image src={user.img} alt="Profile Image" className="rounded w-5 mr-1"/> <span className="underline">{user.n}</span> &nbsp;joined the room. </div>
    </ListGroup.Item>
  }else{
    const s = (user.me)? "rounded-br-none": "rounded-bl-none"
    return <ListGroup.Item className="mb-1">
      <div className={`border text-sm p-2 bg-blue-500 text-white ${s} rounded-2xl `}><span className="font-semibold">{user.n}</span>:&nbsp; {msg}</div>
    </ListGroup.Item>
  }
}

function ParticipantItem({user}){
  return <ListGroup.Item className="text-sm !flex flex-row gap-1 items-center" active={user.me}>
    <Image src={user.img} crossOrigin="anonymous" className="rounded w-6 mr-1"/> 
    <div className="w-2/3">{user.n}</div>
      {(user.host)?<div className="!flex gap-1 w-1/3 flex-row border rounded bg-sky-400 text-white p-1 items-center justify-center">Host</div>:null}
    </ListGroup.Item>
}
function UserBar(){
  const { user } = useAuthContext()
  const path = usePathname()
  if(!user) redirect("/signin?c="+path)
  return(
    <Dropdown>
      <Dropdown.Toggle className="!flex p-2 cursor-pointer border rounded-md !text-black !flex-row justify-center items-center bg-white hover:!bg-slate-300 transition-all">
        <Image height={30} referrerPolicy="no-referrer" width={30} src={user.photoURL || ""} className="rounded mr-2"/>
            <span className="hidden md:block">{user.displayName} </span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Header>Account</Dropdown.Header>
        <Dropdown.Item eventKey="1" onClick={()=>{window.location.href = '/signin?signout=true'}}>Signout</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Header>Other</Dropdown.Header>
        <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
        <Dropdown.ItemText>Non-interactive text</Dropdown.ItemText>
      </Dropdown.Menu>
    </Dropdown>
  );
      // return (
      //   <div className="flex p-2 cursor-pointer border rounded-md flex-row justify-center items-center hover:bg-slate-300 transition-all"
      //   onClick={()=> (window.location.href="/signin") }>
      //     <FcGoogle size={20} className="mr-2"/>
      //     Signin
      //   </div>)   
}

function Logo({className}){
  return <div><b className={f.className+' '+className}> &lt;Bootcamp/&gt;</b></div>
}

function NavBar({title}){
return(
      <Navbar expand="lg" bg="light" className='!justify-between border-b-4 p-2 shadow-lg' variant="light">
        <Navbar.Brand className={`ml-5 ${f.className}`}>
          <b>&lt;{(title)?title:"Bootcamp"}/&gt;</b>
        </Navbar.Brand> 
        <UserBar/>
      </Navbar> )
}

export {ResourceItem, ChatItem, ParticipantItem, NavBar, Logo, redirect};