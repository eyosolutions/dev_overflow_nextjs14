"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, userId } = params;

    const updatedQuestion = await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 }});
    const views = updatedQuestion.views;

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: 'view',
        question: questionId,
      });
      
      if (existingInteraction) {
        return console.log('User has already viewed');
      }

      // Create Interaction
      await Interaction.create({
        user: userId,
        action: 'view',
        question: questionId,
      })
    }

    return { views } 

  } catch (error) {
    console.log(error);
    throw error;
  }
}