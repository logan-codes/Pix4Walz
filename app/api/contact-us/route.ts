// app/api/contact-us/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, number, message, timestamp } = body;

    if (!name || !number || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Save message using Prisma ORM
    const newMessage = await prisma.userMessage.create({
      data: {
        name,
        number,
        message,
        timestamp: timestamp || new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
