export const suggestMeditationNode = async (state) => {
  let suggestion = "";

  if (state.emotion === "anxiety")
    suggestion = "Try 5-min breathing meditation";
  else if (state.emotion === "sadness") suggestion = "Try gratitude meditation";
  else suggestion = "Try mindfulness meditation";

  return { ...state, suggestion };
};
