"use client"
import { formatNumberWithPostfix, getTimestamp } from '@/lib/utils';
import Metric from './Metric';
import { useEffect, useState } from 'react';
import { viewQuestion } from '@/lib/actions/interaction.action';

interface Props {
  numberOfAnswers: number;
  questionViews: number;
  questionCreatedAt: string;
  typeId: string;
  authorId: string;
};

const QuestionMetric = ({
  typeId,
  authorId,
  questionViews,
  numberOfAnswers,
  questionCreatedAt,
}: Props) => {

  const [views, setViews] = useState(questionViews);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const result = await viewQuestion({
          userId: authorId ? JSON.parse(authorId) : undefined,
          questionId: JSON.parse(typeId)
        });
        setViews(result?.views);
        console.log('API Result: ', result?.views);
        
      } catch (error) {
        console.error('Error fetching updated views: ', error);
      }
    }
    
    console.log('Question Views: ', questionViews)
    console.log('Views: ', views)
    
    if (questionViews === views) {
      fetchViews();
    }
    
  })

  return (
    <>
      <Metric
        imgUrl="/assets/icons/clock.svg"
        alt="clock icon"
        value={` asked ${getTimestamp(questionCreatedAt)}`}
        title=""
        textStyles="small-medium text-dark400_light800"
      />
      <Metric
        imgUrl="/assets/icons/message.svg"
        alt="Message"
        value={formatNumberWithPostfix(numberOfAnswers)}
        title=" Answers"
        textStyles="small-medium text-dark400_light800"
      />
      <Metric
        imgUrl="/assets/icons/eye.svg"
        alt="Eye"
        value={formatNumberWithPostfix(views)}
        title=" Views"
        textStyles="small-medium text-dark400_light800"
      />
    </>
  );
};

export default QuestionMetric;
