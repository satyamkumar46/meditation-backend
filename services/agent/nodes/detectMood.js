
import { generateEmotionAndResponse } from "../../ai/groqService.js";


export const detectMoodNode= async (state) =>{

    const result= await generateEmotionAndResponse({
        text:state.message,
        userId: state.userId,
    });

    return {...state, emotion: result.emotion, response:result.response};
};