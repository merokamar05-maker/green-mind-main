// This project uses Firebase Authentication — NextAuth is not used.
// Keeping this file to satisfy Next.js route structure requirements.

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Auth is handled by Firebase." });
}

export async function POST() {
  return NextResponse.json({ message: "Auth is handled by Firebase." });
}