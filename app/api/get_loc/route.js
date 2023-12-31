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

const getBuses = async (to,from) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("select * from public.bus_list where bus_route like '%"+to+" % "+from+"%'", (error, results) => {
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
  const to = req.nextUrl.searchParams.get("to");
  
  const from = req.nextUrl.searchParams.get("from");
  // const t = req.nextUrl.searchParams.get("t");

  if (!to) {
    return NextResponse.json(
      { error: 'Missing "to".' },
      { status: 400 }
    );
  } else if (!from) {
    return NextResponse.json(
      { error: 'Missing "from".' },
      { status: 400 }
    );
  }
   const a = await getBuses(to,from)
   
   return NextResponse.json({s: (a.length!=0), data: JSON.stringify(a)})
  }