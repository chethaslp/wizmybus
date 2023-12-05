"use client";
import { Button, Card, Form } from "react-bootstrap";
import { Logo } from "@/app/util";
import { MdDashboard } from "react-icons/md";
import { signin } from "@/components/fb/auth";
import { useState } from "react";
import { createUser } from "@/components/fb/db";
import { useSearchParams } from "next/navigation";


export default function Page() {
    const [dname, setDname] = useState("");
    const [form_valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form_invalid, setInvalid] = useState(false);
    const forwordURL = useSearchParams().get('c')

    return (
        <div className="flex gap-4 flex-col h-screen justify-center items-center">
            <Logo className="text-3xl text-white" />
            <Card className="shadow-lg w-72">
                <Card.Header className={(loading) ? 'fadeOut' : 'fadeIn'}>Signin</Card.Header>
                <Card.Body className={`gap-2 flex justify-center items-center`}>
                    <Button onClick={()=> (window.location.href = '/host')}><div className="flex flex-row gap-2 items-center"><MdDashboard/> Dashboard</div></Button>
                </Card.Body>
            </Card>
        </div>
    );
}
