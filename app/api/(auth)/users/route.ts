import { connectToMongoDB } from "@/lib/db";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connectToMongoDB();
    const users = await User.find();

    return NextResponse.json(
      { message: "users fetched successfully", data: users },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: `error fetching users : ${error}` },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    await connectToMongoDB();

    const newUser = new User(body);
    await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        user: newUser?.username,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in creating new User");
    return NextResponse.json(
      { message: `Error in creating new User : ${error}` },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;

    await connectToMongoDB();

    if (!userId || !newUsername) {
      return NextResponse.json(
        { message: "userId and newUsername are required" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found or didn't updated successfully" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: { email: updatedUser.email, username: updatedUser.username },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating data");
    return NextResponse.json(
      { message: `Error in updating data : ${error}` },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    // validate the userId
    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    await connectToMongoDB();
    // TODO: delete all the notes of this user

    const deleteUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

    if (!deleteUser) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "user deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in deleting data : ${error}`);
    return NextResponse.json(
      { message: `Error in deleting data : ${error}` },
      { status: 500 }
    );
  }
};
