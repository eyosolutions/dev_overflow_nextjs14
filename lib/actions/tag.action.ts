"use server"

import Tag, { ITag } from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    // const user = await User.findById(userId);

    // if (!user) throw new Error('User not found');

    const tags = await Tag.find({
      followers: { $elemMatch: { $eq: `${JSON.parse(userId)}` } }
    })

    return { tags };
   
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 20, filter, searchQuery } = params;
    // const { searchQuery, filter } = params;
    let sortOptions = {};

    const query: FilterQuery<typeof Tag> = searchQuery
      ? {$or: [
        { name: { $regex: new RegExp(searchQuery, 'i') } },
      ]}
      : { };
    
    switch (filter) {
      case "popular":
        sortOptions = { questions: -1}
        break;
      case "recent":
        sortOptions = { createdOn: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdOn: 1 };
        break;
    
      default:
        break;
    }
    
    const totalTags = await Tag.countDocuments(query);
    // const totalPages = Math.ceil(totalTags / pageSize);
    const skipAmount = (page > 0 && !Number.isNaN(page)) ? (page - 1) * pageSize : totalTags;

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)

    const isNext = totalTags > (skipAmount + tags.length);
    return { tags, isNext };

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();

    // const { tagId, searchQuery } = params;
    const { tagId, page = 1, pageSize = 20, searchQuery } = params;

    // Adrian's approach
    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const questionsByTag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
      ? {$or: [{ title: { $regex: searchQuery, $options: 'i' } },
      { content: { $regex: searchQuery, $options: 'i' } }]}
      : {},
    });
    const totalQuestionsByTag = questionsByTag.questions.length;
    const skipAmount = (page > 0 && !Number.isNaN(page)) ? (page - 1) * pageSize : totalQuestionsByTag;

    const tagResult = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
      ? {$or: [{ title: { $regex: searchQuery, $options: 'i' } },
      { content: { $regex: searchQuery, $options: 'i' } }]}
      : {},
      options: {
        skip: skipAmount,
        limit: pageSize,
        sort: { createdAt: -1 }
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' }
      ]
    });

    // const query: FilterQuery<typeof Question> = searchQuery
    // ? { $or: [
    //   { title: { $regex: new RegExp(searchQuery, 'i')} },
    //   { content: { $regex: new RegExp(searchQuery, 'i')} },
    // ]}
    // : { };

    // const tagResult = await Tag.findById(tagId).populate({
    //   path: 'questions',
    //   match: query,
    //   options: {
    //     sort: { createdAt: -1 }
    //   },
    //   populate: [
    //     { path: 'tags', model: Tag, select: '_id name' },
    //     { path: 'author', model: User, select: '_id clerkId name picture' }
    //   ]
    // })
    
    if (!tagResult) throw new Error("Tag not found");

    const isNext = totalQuestionsByTag > (skipAmount + tagResult.questions.length);
    return { tagResult, isNext };

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();
    
    const popularTags = Tag.aggregate([
      {
        $project: { name: 1 , numberOfQuestions: { $size: "$questions" } }
      },
      {
        $sort: { numberOfQuestions: -1 }
      },
      {
        $limit: 5
      }
    ]);

    return popularTags;

  } catch (error) {
    console.log(error);
    throw error;
  }
}
