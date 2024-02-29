import { connectToMongoDB } from "@/lib/db";
import Note from "@/models/notes";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (reqest: NextRequest) => {
  try {
    const { searchParams } = reqest.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          message: "Invalid or missing userId",
        },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const user = await User.findById(userId);

    // check if the user exists
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const notes = await Note.find({ user: new Types.ObjectId(userId) });

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error: any) {
    console.log("Error in fetching notes" + error.message);
    return NextResponse.json(
      {
        message: `Error in fetching notes : ${error.message}`,
      },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    const body = await request.json();
    const { title, description } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId!" },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const user = await User.findById(userId);

    // check if the user exists
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newNote = new Note({
      title,
      description,
      user: new Types.ObjectId(userId),
    });

    await newNote.save();

    return NextResponse.json(
      { message: "Note created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("Errro while creating notes" + error.message);
    return NextResponse.json(
      {
        message: `Errro while creating notes : ${error.message}`,
      },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { noteId, title, description } = body;

    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    if (!noteId || !Types.ObjectId.isValid(noteId)) {
      return NextResponse.json(
        { message: "Invalid or missing noteId!" },
        { status: 400 }
      );
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId!" },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    // check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // find the note and ensure it belongs to the user
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) {
      return NextResponse.json(
        { message: "Note not found or doesn't belong to the user" },
        { status: 404 }
      );
    }

    const updatedNotes = await Note.findByIdAndUpdate(
      noteId,
      { title, description },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Note updated successfully",
        note: {
          title: updatedNotes.title,
          description: updatedNotes.description,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error while updating notes" + error.message);
    return NextResponse.json(
      {
        message: `Error while updating notes : ${error.message}`,
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");
    const noteId = searchParams.get("noteId");

    if (!noteId || !Types.ObjectId.isValid(noteId)) {
      return NextResponse.json(
        { message: "Invalid or missing noteId!" },
        { status: 400 }
      );
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId!" },
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
        { message: "Note not found or doesn't belong to teh user" },
        { status: 404 }
      );
    }

    await Note.findByIdAndDelete(noteId);
    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error while deleting notes" + error.message);

    return NextResponse.json(
      {
        message: `Error while deleting notes : ${error.message}`,
      },
      {
        status: 200,
      }
    );
  }
};
