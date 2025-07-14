import express from 'express'
import {GoogleGenAI} from '@google/genai';

export const AiSchedul = async ( req , res )=>{
    console.log("hello")
    const {Standerd , Subject ,Time} = req.body ;
    console.log(Standerd , Subject ,Time)
const ai = new GoogleGenAI({apiKey: process.env.GOGGLE_AI_API});

  try{
     const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents:
          `I am a ${Standerd} class student . Only ${Time} days left for my ${Subject} exam. Create a study schedule in JSON format, with keys like day, morning, afternoon, evening, and topic.`,
      });

      const rawText = result.candidates[0].content.parts[0].text;

      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);

      if (!jsonMatch || !jsonMatch[1]) {
        throw new Error("Failed to extract JSON block.");
      }

      const jsonString = jsonMatch[1];
      const schedule = JSON.parse(jsonString);
    //    if(schedule){
            res.status(200).json({schedule , message : " got it "})
    //    }
      
  }
  catch(error){
     console.log(error)
  }
    console.log(req.body)

}
