"use server"

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
// import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    // author and question are actually authorId and questionId
    const { author, question, content, path } = params;

    // const answer = new Answer({ author, content, question });
    const answer = await Answer.create({ author, content, question });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id }
    });

    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function getAnswersPerQuestion(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId, sortBy } = params;
    let sortOptions = {};

    switch (sortBy) {
      case "highestupvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestupvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
    
      default:
        break;
    }

    const answers = await Answer.find({question: questionId})
      .populate("author", "_id clerkId name picture")
      .sort(sortOptions)

    return { answers };

  } catch (error) {
    console.log(error);
    throw error;
  }
}


// Upvoting an answer server action
export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });

    if (!answer) throw new Error('Answer not found')

    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  }
  
}

// Downvoting a question server action
export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });

    if (!answer) throw new Error('Answer not found')

    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  }
  
};

export async function deleteAnswer(params:DeleteAnswerParams) {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error('Answer not found');
    }

    await Answer.deleteOne({ _id: answerId });
    await Question.updateMany({ _id: answer.question }, { $pull: { answers: answerId }});
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  }
};
