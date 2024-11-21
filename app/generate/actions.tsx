"use server"
import axios from "axios";
import {DOMParser} from "xmldom";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { z } from "zod";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";



const CURRENT_MODEL = "gpt-4o-mini";
const DEFAULT_SLIDE_COUNT = 10;

const openai = new OpenAI({
    apiKey: "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",
});




const TitleAndDescriptionSchema = z.object({
    title: z.string(),
    description: z.string(),
});

const arrayOfObjectsSchema = z.object({
    arrayOfObjects: z.array(
      z.object({
        title: z.string(),
        content: z.array(z.string()),
      })
    ),
  });
  

type SlideContent = {
    title: string;
    content: string[];
  };

type VideoMetaData = {
    length: number | null;
    subtitlesURL: string | null;
};

type SubtitleItem = {
  text: string;
}

type TitleDescription = z.infer<typeof TitleAndDescriptionSchema>;


export async function CreatePowerpoint(videoId: string) {
    const{ getUser} = getKindeServerSession();
    const user = await getUser();
    if(!user || !user.id) {
        redirect("/");
    }
    const dbUser = await db.user.findFirst({
        where: {
            id: user.id,
        }
    }); 
    const{ length, subtitlesURL} = await GetVideoLengthAndSubtitles(videoId);
    console.log(length, subtitlesURL);

    if(length && length>1801){
        throw new Error("Video needs to be less than 30 minutes");
    }

    if(!subtitlesURL){
        throw new Error("No subtitles found");
    }

    const parsedSubtitles = await parseXMLContent(subtitlesURL);
   if(!parsedSubtitles){
    throw new Error("Failed to parse subtitles");
   }

    const fullText = parsedSubtitles?.map((item)=>item.text).join(" ");  
    
    const [titleAndDescription, slideContent] = await Promise.all([
        CreateTitleAndDescription(fullText),
        ConvertToObjects(fullText),
    ]);

    console.log(titleAndDescription, slideContent);

    if(!dbUser) {
        redirect("/");
}
}

export async function GetVideoLengthAndSubtitles(videoId: string): Promise<VideoMetaData>{
    try{
      
        const options = {
            method: "GET",
            url: 'https://yt-api.p.rapidapi.com/video/info?id=arj7oStGLkU',
            params: {
                id: videoId,
            },
            headers: {
              'x-rapidapi-key': '24f2bd2528msh5abb36f346659e1p147a93jsn4b3d60b053f0',
               'x-rapidapi-host': 'yt-api.p.rapidapi.com'
            },
        }as const;
        const response = await axios.request(options);
        return{
            length: response.data.lengthSeconds,
            subtitlesURL: response.data.subtitles.subtitles.find((subtitle:{
              languageCode: string;
            })=>subtitle.languageCode === "en")?.url || null,
        }
    }catch(error){
        console.error(error);
        throw new Error("Failed to fetch video metadata");
  }
}

export async function parseXMLContent(url: string): Promise<SubtitleItem[] | null> {
    try{
        const response = await axios.get(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, "application/xml");
        const textElements = doc.getElementsByTagName("text");
        return Array.from(textElements).map((element)=>({
            text: element.textContent || "",
        }));
    }catch (error){
        console.error(error);
        throw new Error("Something went wrong");
    }
}

export async function CreateTitleAndDescription(
    transcript: string
  ): Promise<TitleDescription> {
    const promptTemplate = `Generate a title and description for this Powerpoint presentation based on the following transcript. 
      Requirements: 
      - Title should be fewer than 20 words 
      - description should be fewer than 35 words 
      - Focus on content rather than speaker 
      - make sure the output is in English 
  
      Transcript: ${transcript}
      `;

      try {
        const completion = await openai.beta.chat.completions.parse({
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant designed to generate titles and descriptions",
            },
            {
              role: "user",
              content: promptTemplate,
            },
          ],
          model: CURRENT_MODEL,
          response_format: zodResponseFormat(TitleAndDescriptionSchema, "title"),
        });
    
        const result = completion.choices[0].message.parsed;
    
        if (!result) {
          throw new Error("Failed to generate title and description");
        }
    
        return result;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to generate title and description");
      }
    }

export async function ConvertToObjects(
        text: string,
        slideCount = DEFAULT_SLIDE_COUNT
      ): Promise<SlideContent[] | null> {
        const promptTemplate = `Condense and tidy up the following text to make it suitable for a Powerpoint presentation. Transform it 
              into an array of objects. I have provided the schema for the output. Make sure that the content array has between 3 and 4 items, 
              and each content string should be between 160 and 170 characters. You can add to the content based on the transcript.. 
              The length of the array should be ${slideCount}.
              The text to process is as follows: ${text}
          `;
      
        try {
          const completion = await openai.beta.chat.completions.parse({
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant designed to convert text into objects. You output JSON based on a schema I provide.",
              },
              {
                role: "user",
                content: promptTemplate,
              },
            ],
            model: CURRENT_MODEL,
            response_format: zodResponseFormat(
              arrayOfObjectsSchema,
              "arrayOfObjects"
            ),
          });
      
          const result = completion.choices[0].message.parsed;
      
          if (!result) {
            throw new Error("Failed to convert to objects");
          }
      
          return result.arrayOfObjects;
        } catch (error) {
          console.error(error);
          throw new Error("Failed to convert to objects");
        }
      }