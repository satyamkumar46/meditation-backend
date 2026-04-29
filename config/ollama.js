import axios from "axios";

export const ollamClient= axios.create({
    baseURL:"http://localhost:11434/api",
});