"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import Answer from "@/database/answer.model";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";

const searchableTypes = ['question', 'answer', 'user', 'tag'];

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();

    const { query, type } = params;
    const regexQuery = { $regex: query, $options: 'i' };

    let results = [];

    const modelsAndTypes = [
      { model: Question, searchField: 'title', type: 'question' },
      { model: Answer, searchField: 'content', type: 'answer' },
      { model: User, searchField: 'name', type: 'user' },
      { model: Tag, searchField: 'name', type: 'tag' },
    ]

    const typeLower = type?.toLowerCase();

    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // search across everything
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model.find({ [searchField]: regexQuery}).limit(2)

        results.push(
          ...queryResults.map((item) => ({
            title: type === 'answer'
              ? `Answers containing ${query}`
              : item[searchField],
            type,
            id: type === 'user'
              ? item.clerkId
              : type === 'answer'
                ? item.question
                : item._id
          }))
        )
      }
    } else {
      // search across specific type
      const modelInfo = modelsAndTypes.find((item) => item.type === typeLower);

      if (!modelInfo) {
        throw new Error('Invalide search type');
      }

      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8)

      results = queryResults.map((item) => ({
        title: type === 'answer'
          ? `Answers containing ${query}`
          : item[modelInfo.searchField],
        type,
        id: type === 'user'
          ? item.clerkId
          : type === 'answer'
            ? item.question
            : item._id
      }))
    }

    return JSON.stringify(results);

  } catch (error) {
    console.log(`Error fetching global result: ${error}`);
    throw error;
  }
}