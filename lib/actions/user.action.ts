"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";


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

    const { page = 1, pageSize = 10, filter, searchQuery } = params;
    
    let sortOptions = {};

    const query: FilterQuery<typeof User> = searchQuery
    ? {$or: [
      { name: { $regex: new RegExp(searchQuery, 'i')} },
      { username: { $regex: new RegExp(searchQuery, 'i')} }
    ]}
    : { };

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 }
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 }
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 }
        break;

      default:
        break;
    }

    const totalUsers = await User.countDocuments(query);
    // const totalPages = Math.ceil(totalUsers / pageSize);
    const skipAmount = (page > 0 && !Number.isNaN(page)) ? (page - 1) * pageSize : totalUsers;

    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)

    const isNext = totalUsers > (skipAmount + users.length);

    return { users, isNext };

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

    const { clerkId, page = 1, pageSize = 20, filter, searchQuery } = params;
    ;
    let sortOptions = {};

    const query: FilterQuery<typeof Question> = searchQuery
    ? {$or: [
      { title: { $regex: new RegExp(searchQuery, 'i')} },
    ]}
    : { };

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        // sort({ $expr: { $gt: [{ $size: '$myArray' }, 0] } })
        sortOptions = { 'saved.answers': -1 };
        break;
    
      default:
        break;
    }

    const questionsByUser = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
    });
    const totalQuestionsByUser = questionsByUser.saved.length;
    const skipAmount = (page > 0 && !Number.isNaN(page)) ? (page - 1) * pageSize : totalQuestionsByUser;

    const user = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
      options: {
        skip: skipAmount,
        limit: pageSize,
        sort: sortOptions
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
    const isNext = totalQuestionsByUser > (skipAmount + user.saved.length);
    // const isNext = user.saved.length > pageSize;

    // console.log("Saved: ", totalQuestions);
    return {savedQuestions, isNext};

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

    // get total upvotes of all questions by user
    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id }},
      { $project: {
        _id: 0, upVotes: { $size: '$upvotes'}
      }},
      { $group: {
        _id: null,
        totalUpvotes: { $sum: '$upVotes'}
      }}
    ]);

    // get total upvotes of all answers by user
    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id }},
      { $project: {
        _id: 0, upVotes: { $size: '$upvotes'}
      }},
      { $group: {
        _id: null,
        totalUpvotes: { $sum: '$upVotes'}
      }}
    ]);

    // get total views of all questions by user
    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id }},
      { $group: {
        _id: null,
        totalViews: { $sum: '$views'}
      }}
    ]);

    // create a criteria array object
    const criteria = [
      { type: 'QUESTION_COUNT' as BadgeCriteriaType, count: totalQuestions },
      { type: 'ANSWER_COUNT' as BadgeCriteriaType, count: totalAnswers },
      { type: 'QUESTION_UPVOTES' as BadgeCriteriaType, count: questionUpvotes?.totalUpvotes || 0 },
      { type: 'ANSWER_UPVOTES' as BadgeCriteriaType, count: answerUpvotes?.totalUpvotes || 0 },
      { type: 'TOTAL_VIEWS' as BadgeCriteriaType, count: questionViews?.totalViews || 0 },
    ];

    const badgeCounts = assignBadges({ criteria });

    return { user, totalQuestions, totalAnswers, badgeCounts, reputation: user.reputation };

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 20 } = params;
    // const { userId } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });
    const skipAmount = (page > 0 && !Number.isNaN(page)) ? (page - 1) * pageSize : totalQuestions;

    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1})
      .skip(skipAmount)
      .limit(pageSize)
      .populate('tags', '_id name')
      .populate('author', '_id clerkId name picture')

    const isNext = totalQuestions > (skipAmount + userQuestions.length);
    return { totalQuestions, questions: userQuestions, isNext };

  } catch (error) {
    console.log(error);
    throw error;
  }
};


export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 20 } = params;
    // const { userId } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });
    const skipAmount = (page > 0 && !Number.isNaN(page)) ? (page - 1) * pageSize : totalAnswers;

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1})
      .skip(skipAmount)
      .limit(pageSize)
      .populate('question', '_id title createdAt')
      .populate('author', '_id clerkId name picture')

    const isNext = totalAnswers > (skipAmount + userAnswers.length);
    return { totalAnswers, answers: userAnswers, isNext };

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
