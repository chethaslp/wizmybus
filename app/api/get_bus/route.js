import { db } from "@/components/fb/db";
import { NextResponse } from "next/server";

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "chethas123",
  port: 5432,
});

const getBus = async (id) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("select * from route_"+id, (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};

export async function GET(req) {
  const id = req.nextUrl.searchParams.get("id");
  
  // const from = req.nextUrl.searchParams.get("from");
  // const t = req.nextUrl.searchParams.get("t");

  if (!id) {
    return NextResponse.json(
      { error: 'Missing "id".' },
      { status: 400 }
    );
  } 
  // else if (!from) {
  //   return NextResponse.json(
  //     { error: 'Missing "from".' },
  //     { status: 400 }
  //   );
   const a = await getBus(id)
   if(a.length ==0) {
    return NextResponse.json(
      { error: "Bus Route doesn't exist." },
      { status: 404 })
   }
   return NextResponse.json({s: (a.length!=0), data: JSON.stringify(a)})
  }