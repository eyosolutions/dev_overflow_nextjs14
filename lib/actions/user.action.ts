"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";


// Create User
export async function createUser(userData: CreateUserParams) {
  try {
    await connectToDatabase();
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
    await connectToDatabase();
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
    await connectToDatabase();
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


// Get User by clerkId
export async function getUserById(params: GetUserByIdParams) {
  try {
    await connectToDatabase();

    const { userId } = params;
    
    const user = await User.findOne({ clerkId: userId });

    return user;

  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get all users - done by me
export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase();

    // const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const { searchQuery } = params;

    const query: FilterQuery<typeof User> = searchQuery
    ? {$or: [
      { name: { $regex: new RegExp(searchQuery, 'i')} },
      { username: { $regex: new RegExp(searchQuery, 'i')} }
    ]}
    : { };

    const users = await User.find(query)
      .sort({ createdAt: -1 })

    return { users };

  } catch (error) {
    console.log(error);
    throw error;
  }
};


export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDatabase();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(userId, { $pull: { saved: questionId }}, { new: true });
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { saved: questionId }}, { new: true });
    }
    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  } 
};

// Get Saved Questions
export async function GetSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    await connectToDatabase();

    // const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;
    const { clerkId, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
    ? {$or: [
      { title: { $regex: new RegExp(searchQuery, 'i')} },
    ]}
    : { };

    const user = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: { createdAt: -1 }
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' }
      ]
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    return savedQuestions;

  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Adrian's Version
export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } =params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalQuestions, totalAnswers };

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    // const { userId, page = 1, pageSize = 10 } = params;
    const { userId } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1})
      .populate('tags', '_id name')
      .populate('author', '_id clerkId name picture')

    return { totalQuestions, questions: userQuestions };

  } catch (error) {
    console.log(error);
    throw error;
  }
};


export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    // const { userId, page = 1, pageSize = 10 } = params;
    const { userId } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1})
      .populate('question', '_id title createdAt')
      .populate('author', '_id clerkId name picture')

    return { totalAnswers, answers: userAnswers };

  } catch (error) {
    console.log(error);
    throw error;
  }
};

// My Version of getUserInfo() server action
// export async function getUserProfile(params: GetUserStatsParams) {
//   try {
//     await connectToDatabase();

//     const { userId } =params;

//     const user = await User.findOne({ clerkId: userId });

//     if (!user) {
//       throw new Error("User not found");
//     }
    
//     const questions = await Question.find({ author: user._id })
//       .populate({ path: 'tags', model: Tag })
//       .populate({ path: 'author', model: User })
//       .sort({ createdAt: -1 })

//     const answers = await Answer.find({ author: user._id })
//       .populate({ path: 'question', model: Question })
//       .sort({ createdAt: -1 })

//     return {user, questions, answers };
    
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
