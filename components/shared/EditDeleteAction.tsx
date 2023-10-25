"use client"

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation";

interface Props {
  type: string;
  typeId: string;
};

const EditDeleteAction = ({ type, typeId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(typeId)}`);
  };

  const handleDelete = async () => {
    if (type === 'Question') {
      // delete a question
      await deleteQuestion({ questionId: JSON.parse(typeId), path: pathname });

    } else if (type === 'Answer') {
      // delete an answer
      await deleteAnswer({ answerId: JSON.parse(typeId), path: pathname });

    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="edit"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
