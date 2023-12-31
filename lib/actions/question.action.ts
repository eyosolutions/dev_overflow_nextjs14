"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams, RecommendedParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import Answer from "@/database/answer.model";
import { FilterQuery } from "mongoose";

// Like API Get - Get All questions
export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    let sortOptions = {};

    const query: FilterQuery<typeof Question> = searchQuery
    ? {$or: [
      { title: { $regex: new RegExp(searchQuery, 'i')} },
      { content: { $regex: new RegExp(searchQuery, 'i')} }
    ]}
    : { };

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      // case "recommended":
      //   sortOptions = { upvotes: -1 };
      //   break;
    
      default:
        break;
    }

    const totalQuestions = await Question.countDocuments(query);
    // const totalPages = Math.ceil(totalQuestions / pageSize);
    const skipAmount = (page > 0 && !Number.isNaN(page)) ? (page - 1) * pageSize : totalQuestions;
  
    const questions = await Question.find(query)
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)

    const isNext = totalQuestions > skipAmount + questions.length;
    return { questions, isNext };

  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get recommended questions
export async function getRecommended(params: RecommendedParams) {
  try {
    connectToDatabase();
    const { searchQuery, userId, page = 1, pageSize = 20 } = params;
    // find a user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Find user interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate('tags')
      .exec();

    // Extract tags
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    // Get distinct tags IDs from user's interactions
    const distinctUserTagIds = [
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    // // Get distinct tags IDs from user's interactions
    // const userViewedQuestionIds = [
    //   ...new Set(userInteractions.map((item: any) => item.question._id)),
    // ];
    // console.log('QuestionIDs:', userViewedQuestionIds);
    // console.log('interactions:', userInteractions);

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } },
        { author: { $ne: user._id } }
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i'}},
      ]
    }

    const totalQuestions = await Question.countDocuments(query);
    const skipAmount = (page > 0 && !Number.isNaN(page)) ? (page - 1) * pageSize : totalQuestions;

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: 'tags',
        model: Tag,
      })
      .populate({
        path: 'author',
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize)

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;
    return { questions: recommendedQuestions, isNext };

  } catch (error) {
    console.error('Error getting recommended questions: ', error);
    throw error;
  }
}

// Gell all questions by selected filter
// export async function getQuestionsByFilter(params:GetQuestionsParams) {
//   try {
//     connectToDatabase();

//     const { searchQuery } = params;

//     let questions: any;

//     // const result = await Question.find({})
//     //   .populate({ path: 'tags', model: Tag })
//     //   .populate({ path: 'author', model: User })
//     //   .populate({ path: 'answers', model: Answer })
//     //   .sort({ createdAt: -1 })

//     if (searchQuery === 'newest') {
//       questions = await Question.find({})
//       .populate({ path: 'tags', model: Tag })
//       .populate({ path: 'author', model: User })
//       .sort({ createdAt: -1 })

//     } else if (searchQuery === 'frequent') {
//       questions = await Question.find({})
//       .populate({ path: 'tags', model: Tag })
//       .populate({ path: 'author', model: User })
//       .sort({ views: -1 })

//     }else if (searchQuery === 'unanswered') {
//       const result = await Question.find({})
//       .populate({ path: 'tags', model: Tag })
//       .populate({ path: 'author', model: User })
//       .populate({ path: 'answers', model: Answer })
    
//       questions = result.filter((item) => item.answers.length === 0)
//       // questions = result.answers.map((item:any) => item).filter((item) => item.length === 0)
//       // console.log(questions);

//     } else if (searchQuery === 'recommended') {
//       questions = await Question.find({})
//       .populate({ path: 'tags', model: Tag })
//       .populate({ path: 'author', model: User })
//       .sort({ upvotes: -1 })
//     }

//     return { questions };

//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

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

    // Creating interaction record for the ask-question action
    await Interaction.create({
      user: author,
      action: 'ask_question',
      question: question._id,
      tags: tagDocuments,
    });

    // Updating Reputation Score
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

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

    if (!question) throw new Error('Question not found');

    // Updating Reputation Score
    await User.findByIdAndUpdate(userId, { $inc: { reputation: hasupVoted ? -1 : 1 } });
    await User.findByIdAndUpdate(question.author, { $inc: { reputation: hasupVoted ? -10 : 10 } });

    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  }
  
};

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

    if (!question) throw new Error('Question not found');

    // Updating Reputation Score
    await User.findByIdAndUpdate(userId, { $inc: { reputation: hasdownVoted ? -1 : 1 } });
    await User.findByIdAndUpdate(question.author, { $inc: { reputation: hasdownVoted ? -10 : 10 } });

    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  }
  
};

export async function deleteQuestion(params:DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany({ questions: questionId }, { $pull: { questions: questionId }});
    await User.updateMany({ saved: questionId }, { $pull: { saved: questionId }});

    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate('tags');

    if (!question) {
      throw new Error("Question not found!");
    }

    question.title = title;
    question.content = content;

    question.save();
    revalidatePath(path);

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopQuestions() {
  try {
    connectToDatabase();
    const topQuestions = Question.find()
      .sort({ upvotes: -1, views: -1 })
      .limit(5)

    return topQuestions;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Get updated views
export async function getQuestionViews(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const updatedQuestion = await Question.findById(questionId);
    const views = updatedQuestion.views;

    return { views }

  } catch (error) {
    console.log(error);
    throw error;
  }
}
