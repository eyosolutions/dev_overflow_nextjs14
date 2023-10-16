"use server"

import Tag from "@/database/tag.model";
// import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
// import User from "@/database/user.model";

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
