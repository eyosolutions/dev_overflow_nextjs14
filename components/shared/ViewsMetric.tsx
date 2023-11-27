"use client"
import { formatNumberWithPostfix } from '@/lib/utils';
import Metric from './Metric';
import { useEffect, useState } from 'react';
import { getQuestionViews } from '@/lib/actions/question.action';

interface Props {
  typeViews: number;
  typeId: string;
};

const ViewsMetric = ({
  typeId,
  typeViews,
}: Props) => {

  const [views, setViews] = useState(typeViews);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const result = await getQuestionViews({
          questionId: JSON.parse(typeId)
        });
        setViews(result?.views);
        // console.log('API Result: ', result);
        
      } catch (error) {
        console.error('Error fetching updated views: ', error);
      }
    }

    fetchViews();

  }, [typeViews, views, typeId])

  return (
    <>
      <Metric
        imgUrl="/assets/icons/eye.svg"
        alt="Eye"
        value={formatNumberWithPostfix(views || typeViews)}
        title=" Views"
        textStyles="small-medium text-dark400_light800"
      />
    </>
  );
};

export default ViewsMetric;
