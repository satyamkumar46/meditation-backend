import User from "../models/User.js"


export const updateUserActivity= async ({userId,minutes=1}) =>{

    const user= await User.findById(userId);

    if (!user) throw new Error("User not found");

    const now= new Date();

    const today= new Date(now.setHours(0,0,0,0));

    const last= user.lastSessionDate ? new Date(new Date (user.lastSessionDate).setHours(0,0,0,0)) : null;

    if(!last){
        user.streak=1;
    }
    else{

        const diffDays= (today-last)/(1000*60*60*24);

        if(diffDays===1){
            user.streak+=1;
        }
        else if(diffDays>1){
            user.streak=1;
        }
    }

    user.session+=1;
    user.minutes+=minutes;
    user.lastSessionDate= new Date();

    await user.save();

    return{
        streak: user.streak,
        session: user.session,
        minutes: user.minutes,
    };

};