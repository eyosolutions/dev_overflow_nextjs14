import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const responseData = await response.json();
    console.log(responseData);

  } catch (error: any) {
    return NextResponse.json({ error: error.message});
  }
};
