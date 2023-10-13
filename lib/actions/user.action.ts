"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, GetUserByIdParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";


// Create User
export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    // get destructured params to create the user
    const newUser = await User.create(userData);

    return newUser;

  } catch (error) {
    console.log(error);
    throw(error);
  }
};


// Update User
export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    // get destructured params to create the user
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    })

    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw(error);
  }
};


// Delete User
export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    // get destructured params to create the user
    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error('User not found');
    }

    // Delete user from database and associated 
    // questions, answers, comments, etc.
    
    // get user question ids
    // const userQuestionIds = await Question.find({ author: user._id}).distinct('_id');

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete answers, comments, etc by user

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;

  } catch (error) {
    console.log(error);
    throw(error);
  }
};


// Get User by Id
export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;

  } catch (error) {
    console.log(error);
    throw error;
  }
};
