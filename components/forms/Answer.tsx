"use client"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import z from "zod";
import { AnswerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { toast } from "../ui/use-toast";

interface AnswerParams {
  authorId: string;
  questionId: string;
  question: string;
};

const AnswerForm = ({ questionId, authorId, question }: AnswerParams) => {
  const { mode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);

  const editorRef = useRef(null);
  const pathname = usePathname();

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: ""
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true);
    try {
      await createAnswer({
        content: values.answer,
        question: JSON.parse(questionId),
        author: JSON.parse(authorId),
        path: pathname,
      });

      form.reset();

      toast({
        title: 'Answer submitted successfully!',
        className: 'subtle-medium text-dark400_light900 background-light700_dark400',
      });

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent('');
      }

    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle AI Button click function
  const generateAIAnswer = async () => {
    if (!authorId) {
      return toast({
        title: 'Please log in',
        description: `You must be logged in to perform this action`,
        className: 'subtle-medium text-dark400_light900 background-light700_dark400',
      })
    }
    setIsSubmittingAI(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
        method: 'POST',
        body: JSON.stringify({ question })
      });
      const aiAnswer = await response.json();
      // alert(aiAnswer.reply);
      console.log(aiAnswer);

      if (!aiAnswer.reply) {
        return toast({
          title: 'AI Answer Failed',
          description: `The AI encountered an error while generating an answer!`,
          className: 'subtle-medium text-dark400_light900 background-light700_dark400',
        });
      }
      
      const formattedAIAnswer = aiAnswer.reply.replace(/\n/g, '<br />');

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAIAnswer);
        toast({
          title: 'AI Answer Generated',
          description: 'The AI has successfully generated an answer based on your query.',
          className: 'subtle-medium text-dark400_light900 background-light700_dark400',
        });
      }

    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmittingAI(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="text-dark400_light800 h2-semibold">
          Write your answers here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none"
          onClick={generateAIAnswer}
        >
          {isSubmittingAI ? (
            <>Generating...</>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                alt="star"
                width={12}
                height={12}
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  {/* TODO: Add an editor component */}
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor}}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    initialValue={editorRef.current || ''}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen', 'insertdatetime', 'media', 'table'
                      ],
                      toolbar: 'undo redo | ' +
                      'codesample | bold italic forecolor | alignleft aligncenter |' +
                      'alignright alignjustify | bullist numlist',
                      content_style: 'body { font-family:Inter; font-size:16px }',
                      skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: mode === 'dark' ? 'dark' : 'light',
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="primary-gradient w-fit text-white" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>  
  );
};

export default AnswerForm;
