import Track from "../models/Sound.js";
import cloudinary from "../config/cloudinary.js";
import { parseFile } from "music-metadata";
import Category from "../models/Category.js";
import Teacher from "../models/Teacher.js";
import fs from 'fs'

export const createTrack = async (req, res) => {
  try {
    const audioFile = req.files?.audio?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    const audioRes = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });

    const thumbRes = await cloudinary.uploader.upload(
      thumbnailFile.path,
      { resource_type: "image" }
    );

    const meta = await parseFile(audioFile.path);
    const durationSec = Math.floor(meta.format.duration);

    let category= await Category.findOne({
            catname:req.body.category,
    });


    if(!category){

        const count= await Category.countDocuments();

        category = new Category({
            id: count+1,
            catname:req.body.category,
            tracks:[],
        });

        await category.save();
    }

    if(!category){
        return res.status(404).json({
            message:"category not found",
        });
    }

    const teacher=  await Teacher.findOne({
        id:req.body.id,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const trackCount=category.tracks.length;


    const NewTrack={
      id:trackCount+1,
      title: req.body.title,
      audioUrl: audioRes.secure_url,
      thumbnail: thumbRes.secure_url,
      duration: `${Math.floor(durationSec / 60)}:${durationSec % 60}`,
      durationSec,
      teacher: teacher._id,
    };

    category.tracks.push(NewTrack);

    await category.save();

    fs.unlinkSync(audioFile.path);
    fs.unlinkSync(thumbnailFile.path);

    res.status(201).json({
        message:"Track added inside",
        category,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getTracks = async (req, res) => {
  
  try {
    
    const categories= await Category.find().populate("tracks.teacher","id name image rating");

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTracksById= async (req, res) =>{

  try {
    
    const category= await Category.find({
      id:req.params.id,
    }).populate("tracks.teacher","id name image rating reviews expertise bio session students");

    console.log("PARAM ID:", req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found ❌",
      });
    }

    res.json(category);

  } catch (error) {
    res.status(500).json({error:error.message});
  }
}

export const deleteCategory= async (req,res) =>{

  try {
    
    const deleted= await Category.findOneAndDelete({
      id:req.params.id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    for(let track of deleted.tracks){

      const publicIdAudio= track.audioUrl.split("/").pop().split(".")[0];
      const publicIdImage= track.thumbnail.split("/").pop().split(".")[0];


      await cloudinary.uploader.destroy(publicIdAudio,{
        resource_type:"video",
      });

      await cloudinary.uploader.destroy(publicIdImage);
    }

    res.json({
      message:"Category deleted successfully ✅",
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}