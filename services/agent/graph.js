import { detectMoodNode } from "./nodes/detectMood.js";
import { fallbackNode } from "./nodes/fallbackResponse.js";
import { suggestMeditationNode } from "./nodes/suggestMeditation.js";


export const runAgent= async ({message,userId}) =>{

    let state= {message,userId};

    console.log("INPUT:", message);

    try {
        state= await detectMoodNode(state);
        console.log("EMOTION:", state.emotion);
    } catch (error) {
        console.log("ERROR:", error.message);
        console.log("FULL ERROR:", error.response?.data || error.message);
        console.log("URL:", error.config?.url)
        state= await fallbackNode(state);
    }

    state= await suggestMeditationNode(state);
    console.log("SUGGESTION:", state.suggestion);

    return state;
};