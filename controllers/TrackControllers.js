import Track from "../models/Sound.js";
import cloudinary from "../config/cloudinary.js";
import { parseFile } from "music-metadata";

export const createTrack = async (req, res) => {
  try {
    const audioFile = req.files.audio[0];
    const thumbnailFile = req.files.thumbnail[0];

    const audioRes = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });

    const thumbRes = await cloudinary.uploader.upload(
      thumbnailFile.path,
      { resource_type: "image" }
    );

    const meta = await parseFile(audioFile.path);
    const durationSec = Math.floor(meta.format.duration);

    const track = new Track({
      title: req.body.title,
      audioUrl: audioRes.secure_url,
      thumbnail: thumbRes.secure_url,
      duration: `${Math.floor(durationSec / 60)}:${durationSec % 60}`,
      durationSec,
      teacher: req.body.teacherId,
      category: req.body.categoryId,
    });

    await track.save();

    res.status(201).json(track);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getTracks = async (req, res) => {
  const tracks = await Track.find()
    .populate("teacher")
    .populate("category");

  res.json(tracks);
};