import { ollamClient } from "../../config/ollama.js"


export const generateOllamaResponse= async (prompt) =>{

    const res= await ollamClient("/generate",{
        model:"llama3",
        prompt,
    });
    return res.data?.response;
};