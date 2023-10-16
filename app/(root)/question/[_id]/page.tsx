// import { ParamsProps } from "@/types";

const DetailQuestionPage = ({ params }: { params: { id: string }}) => {
  const { id } = params;
  return (
    <div>DetailQuestionPage {`ID: ${id}`}</div>
  );
};

export default DetailQuestionPage;