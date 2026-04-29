import { generateGroqResponse } from "../../ai/groqService.js";

export const generateResponseNode = async (state) =>{

    const prompt= `User feels ${state.emotion}. Respond like a calm meditation coach:\n${state.message}`;

    const res= await generateGroqResponse(prompt);
    console.log("FINAL RESPONSE:", res);

    return {...state, response:res};
};