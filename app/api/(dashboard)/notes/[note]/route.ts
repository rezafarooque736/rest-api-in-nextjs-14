import { connectToMongoDB } from "@/lib/db";
import Note from "@/models/notes";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params: { note } }: { params: { note: string } }
) => {
  const noteId = note;
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missng user Id" },
        { status: 400 }
      );
    }

    if (!noteId || !Types.ObjectId.isValid(noteId)) {
      return NextResponse.json(
        { message: "Invalid or missng note Id" },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    // check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // check if the note exists and it belongs to the user
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) {
      return NextResponse.json(
        { message: "Note not found or doesn't belong to the user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ note }, { status: 200 });
  } catch (error: any) {
    console.log("Error while fetching note data" + error.message);
    return NextResponse.json(
      { message: `Error while fetching note : ${error.message}` },
      { status: 500 }
    );
  }
};
