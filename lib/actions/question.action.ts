"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

// Like API Get - Get All questions
export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 })
    return { questions };

  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Like API POST - Create a question
export async function createQuestion(params: CreateQuestionParams) {
  // eslint-disable-next-line no-empty
  try {
    // connect to the database
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({ title, content, author });

    // Create tags or get them if already exist
    const tagDocuments = [];

    for (const tag of tags) {
      const existingTags = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // find tag by name
        { $setOnInsert: { name: tag }, $push: { questions: question._id, followers: author } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTags._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments }}
    });

    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get a question by question ID
export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const question = await Question.findById(params.questionId)
      .populate({ path: 'tags', model: Tag, select: '_id name' })
      .populate({ path: 'author', model: User, select: '_id clerkId name picture' })

    return { question };

  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Upvoting a question server action
export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId }};
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId }
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId }};
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });

    if (!question) throw new Error('Question not found')

    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  }
  
}

// Downvoting a question server action
export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId }};
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId }
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId }};
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });

    if (!question) throw new Error('Question not found')

    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  }
  
}
