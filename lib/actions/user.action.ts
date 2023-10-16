"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetUserByIdParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
// import Tag from "@/database/tag.model";
// import { redirect } from "next/navigation";


// Create User
export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    // get destructured params to create the user
    const newUser = await User.create(userData);

    return newUser;

  } catch (error) {
    console.log(error);
    throw error;
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
    throw error;
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
      throw new Error('User to be deleted not found');
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
    throw error;
  }
};


// Get User by Id
export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;
    // console.log('clerkId: ', userId);
    const user = await User.findOne({ clerkId: userId });

    // my injected code to resolve error page when 
    // unauthorised user is accessing ask-question page
    if(!user) return;
    // console.log('mongoUser: ', user);
    return user;

  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get all users - done by me
export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const users = await User.find({})
      .sort({ createdAt: -1 })

    return { users };

  } catch (error) {
    console.log(error);
    throw error;
  }
};
