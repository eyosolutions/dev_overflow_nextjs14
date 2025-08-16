"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import Answer from "@/database/answer.model";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import { NextResponse } from "next/server";

const searchableTypes = ['question', 'answer', 'user', 'tag'];
interface JobsProps {
  page?: number;
  numOfPages?: number;
  searchQuery?: string | undefined;
  location?: string;
};

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
};

// Get all countries from rest-countries api
export const getCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const responseData = await response.json();
    // console.log(responseData);
    const countries = responseData.map((country: any) => (
      { name: country.name.common, flag: country.flags.svg }
    ));

    return NextResponse.json({ countries }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message});
  }
};

// Get all jobs by query or location
export const getAllJobsOrByFilter = async (params: JobsProps) => {
  // Define parameters for fetch/axios
  const url = 'https://jsearch.p.rapidapi.com/search';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': `${process.env.NEXT_X_RAPIDAPI_API_KEY}`,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };
  
  try {
    const { page = 1, numOfPages = 1, searchQuery = '', location = 'United States' } = params;
    const pageSize = 10;
    const pageNumber = (page > 0 && !Number.isNaN(page)) ? page : 1;

    // Encode the query properly
    const encodedQuery = encodeURIComponent(`${searchQuery} in ${location}`);
    const urlQuery = `${url}?query=${encodedQuery}&page=${pageNumber}&num_pages=${numOfPages}`;
    
    // Get searched Jobs
    const response = await fetch(urlQuery, options);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const searchedJobs = await response.json();
    
    // Check if API returned valid data
    if (!searchedJobs || searchedJobs.status !== 'OK') {
      console.warn('Jobs API returned no data or error status:', searchedJobs);
      return NextResponse.json({ 
        searchedJobs: { status: 'ERROR', data: [] }, 
        isNext: false 
      }, { status: 200 });
    }

    // Try to get total count, but don't fail if this doesn't work
    let totalJobs = 0;
    let isNext = false;
    
    try {
      const countUrlQuery = `https://jsearch.p.rapidapi.com/search-filters?query=${encodedQuery}`;
      const countResponse = await fetch(countUrlQuery, options);
      
      if (countResponse.ok) {
        const countJobs = await countResponse.json();
        
        if (countJobs?.data?.job_titles && Array.isArray(countJobs.data.job_titles)) {
          totalJobs = countJobs.data.job_titles
            .map((item: any) => item.est_count || 0)
            .reduce((acc: number, cur: number) => (acc + cur), 0);
          
          isNext = totalJobs > (page * pageSize);
        }
      }
    } catch (countError) {
      console.warn('Failed to get job count, using fallback:', countError);
      // Fallback: assume there might be more if we got results
      isNext = searchedJobs?.data && Array.isArray(searchedJobs.data) && searchedJobs.data.length >= pageSize;
    }

    return NextResponse.json({ searchedJobs, isNext }, { status: 200 });

  } catch (error: any) {
    console.error('Jobs API error:', error);
    return NextResponse.json({ 
      error: error.message,
      searchedJobs: { status: 'ERROR', data: [] }, 
      isNext: false 
    }, { status: 200 });
  }
};

export const getUserCountry = async () => {
  try {
    // API Call - no api-key required for non-commercial use
    const response = await fetch('http://ip-api.com/json/?fields=country', { cache: 'no-store' });
    const userCountry = await response.json();

    return NextResponse.json({ userCountry }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message});
  }
};
