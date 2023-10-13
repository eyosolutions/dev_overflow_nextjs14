"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
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
        { $setOnInsert: { name: tag }, $push: { question: question._id} },
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
