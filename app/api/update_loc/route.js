import { db } from "@/components/fb/db";
import { doc, getDoc, collection, setDoc, getDocs, query, where, getFirestore} from "firebase/firestore";
import { Room, roomConv } from '../../../../components/models'
import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";


export async function GET(req) {
  const roomId = req.nextUrl.searchParams.get("rid");
  const uid = req.nextUrl.searchParams.get("uid");
  const dname = req.nextUrl.searchParams.get("name");
  const userImg = req.nextUrl.searchParams.get("img");

  const roomRef = collection(db, "rooms");

  if (!roomId) {
    return NextResponse.json(
      { error: 'Missing "roomId".' },
      { status: 400 }
    );
  } else if (!uid) {
    return NextResponse.json(
      { error: 'Missing "uid".' },
      { status: 400 }
    );
  } else if (!dname) {
    return NextResponse.json(
      { error: 'Missing "name".' },
      { status: 400 }
    );
  } else if (!userImg) {
    return NextResponse.json(
      { error: 'Missing "userImg".' },
      { status: 400 }
    );
  }
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const d = await getDoc(doc(roomRef, roomId).withConverter(roomConv))
  if (d.exists()) {
    const data = d.data()
    const at = new AccessToken(apiKey, apiSecret, { identity: uid, name: dname, metadata: JSON.stringify({img:userImg, host: data.isHost(uid)}) });
    at.addGrant({ roomId, roomJoin: true, canPublish: data.isHost(uid) , canPublishData : true, canSubscribe: true });
    return NextResponse.json({ token: at.toJwt(), room: JSON.stringify(data) });
  } else {
      return NextResponse.json(
        { error: "Room doesn't exist." },
        { status: 404 }
      )
  }
}