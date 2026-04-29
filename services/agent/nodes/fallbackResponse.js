import { generateOllamaResponse } from "../../ai/ollamaService.js"


export const fallbackNode= async (state) =>{

    try {

        const res= await generateOllamaResponse(state.message);
        return {...state, res};
    } catch (error) {
        return {...state, response: "Take a deep breath. You are safe." };
    }
    
};