"use client"
import { formatNumberWithPostfix } from '@/lib/utils';
import Metric from './Metric';
import { useEffect } from 'react';
import { getQuestionViews } from '@/lib/actions/question.action';
import { useViews } from '@/context/ViewsProvider';

interface Props {
  typeViews: number;
  typeId: string;
};

const ViewsMetric = ({ typeId, typeViews }: Props) => {
  const { initialView, setInitialView, views, setViews } = useViews();
  // const [views, setViews] = useState(typeViews);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const result = await getQuestionViews({
          questionId: JSON.parse(typeId)
        });
        setViews(result?.views);
        setInitialView(result?.views);
        // console.log('API Result: ', result);
        
      } catch (error) {
        console.error('Error fetching updated views: ', error);
      }
    }

    if (typeViews !== views) {
      fetchViews();
    }

  }, [typeViews, views, typeId, setViews, setInitialView])

  return (
    <>
      <Metric
        imgUrl="/assets/icons/eye.svg"
        alt="Eye"
        value={formatNumberWithPostfix(initialView === 0 ? typeViews : initialView)}
        title=" Views"
        textStyles="small-medium text-dark400_light800"
      />
    </>
  );
};

export default ViewsMetric;
