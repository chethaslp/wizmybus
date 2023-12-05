"use client";
import { Card, Form } from "react-bootstrap";
import { Logo } from "../util";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner2 } from 'react-icons/im'
import { auth, signin } from "@/components/fb/auth";
import { useState } from "react";
import { createUser } from "@/components/fb/db";
import { useSearchParams } from "next/navigation";
import { signOut } from "firebase/auth";


export default function Page() {
    const [dname, setDname] = useState("");
    const [form_valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form_invalid, setInvalid] = useState(false);
    const forwordURL = useSearchParams().get('c')
    const signout = useSearchParams().get('signout')

    if (signout) signOut(auth)
    return (
        <div className="flex gap-4 flex-col h-screen justify-center items-center">
            <Logo className="text-3xl text-white" />
            <Card className="shadow-lg w-72">
                {(() => {
                    if (loading) {
                        return <div className={`${(loading) ? 'fadeIn' : 'fadeOut'} p-5 flex justify-center items-center`}><ImSpinner2 size={20} className="animate-spin fadeIn"/></div>;
                    }
                    else { 
                        return <>
                        <Card.Header className={(loading) ? 'fadeOut' : 'fadeIn'}>Signin</Card.Header>
                        <Card.Body className={`${(loading) ? 'fadeOut' : 'fadeIn'} gap-2`}>
                    <Form.Group className="mb-3">
                        <Form.Control required isValid={form_valid} isInvalid={form_invalid} type="text"
                            onChange={(e) => {
                                if (e.target.value == "") setValid(false);
                                else { setValid(true); }; setInvalid(false);
                                setDname(e.target.value);
                            }} placeholder="Display Name" />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide a display name.</Form.Control.Feedback>
                    </Form.Group>

                    <div className="flex p-2 cursor-pointer border rounded-md flex-row justify-center items-center hover:bg-sky-200 transition-all"
                        onClick={() => {
                            if (dname == "") setInvalid(true);
                            else {
                                setLoading(true)
                                signin().then((result) => {
                                    createUser(result.user, dname).then(()=>{
                                        (forwordURL)?(window.location.href = forwordURL):(window.location.href = "/host")
                                    })
                                  }).catch((error) => {
                                    setLoading(false);
                                    setValid(false)
                                  });
                                }
                        }}>
                        <FcGoogle size={20} className="mr-2" />
                        Signin with Google
                    </div>
                    </Card.Body>
                </>
                    }
                })()}
                
            </Card>
        </div>
    );
}
