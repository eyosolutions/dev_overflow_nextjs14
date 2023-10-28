"use server"

import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
import User from "@/database/user.model";
// import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    // const user = await User.findById(userId);

    // if (!user) throw new Error('User not found');

    const tags = await Tag.find({
      followers: { $elemMatch: { $eq: `${JSON.parse(userId)}` } }
    })
    // const tags = [
    //     {_id: '1', name: 'tag1'},
    //     {_id: '2', name: 'tag2'},
    //     {_id: '3', name: 'tag3'},
    //   ];
  
    // if (!tags) return [];

    return { tags };
   
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

     // const { page = 1, pageSize = 20, filter, searchQuery } = params;
     const tags = await Tag.find({});

     return { tags };

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();

    const { tagId, searchQuery } = params;
    // const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    // Adrian's approach
    // const tagFilter: FilterQuery<ITag> = { _id: tagId };
    // const tag = await Tag.findOne(tagFilter).populate({
    //   path: 'questions',
    //   match: searchQuery
    //   ? { title: { $regex: searchQuery, $options: 'i' } }
    //   : {},
    //   options: {
    //     sort: { createdAt: -1 }
    //   },
    //   populate: [
    //     { path: 'tags', model: Tag, select: '_id name' },
    //     { path: 'author', model: User, select: '_id clerkId name picture' }
    //   ]
    // });

    const query: FilterQuery<typeof Tag> = searchQuery
    ? { title: { $regex: new RegExp(searchQuery, 'i')} }
    : { };

    const tagResult = await Tag.findById(tagId).populate({
      path: 'questions',
      match: query,
      options: {
        sort: { createdAt: -1 }
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' }
      ]
    })
    
    if (!tagResult) throw new Error("User not found");

    // const questionsByTagId = result.questions;

    return tagResult;

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
