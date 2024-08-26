import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or context. Follow these guidelines:

1.Create clear and concise questions for the front of the flashcard.
2.Provide accurate and informative answers for the back of the flashcard.
3.Ensure each flashcard covers a single concept or fact.
4.Use simple and straightforward language.
5.Aim for brevity while maintaining completeness.
6.Include examples or explanations if they enhance understanding.
7.Organize the flashcards in a logical sequence if they are part of a set.
8.Avoid overly complex or ambiguous questions and answers.
9.Make sure the content is relevant to the topic or context provided.
10.Review and revise the flashcards to ensure clarity and accuracy."
11. Make sure to only generate 10 flashcards.

You must return the response in the following JSON format with nothing else whatsoever
{
    "flashcards": [
        {
            "front": str,
            "back": str
        },
        {
            "front": str,
            "back": str
        }
    ]
}
`;

export async function POST(req) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  const data = await req.text();

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data },
    ],
    model: "meta-llama/llama-3.1-8b-instruct:free",
    response_format_type: { type: "json_object" },
  });

  console.log(completion.choices[0].message.content);
  const flashcards = JSON.parse(completion.choices[0].message.content);

  return NextResponse.json(flashcards.flashcards);
}
