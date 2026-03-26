import express from "express";
import Teacher from "../models/Teacher.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const upload = multer({ dest: "Uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: "Image is required " });
    }

    // uplaod in cloudinary
    const Res = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const count= await Teacher.countDocuments();

    // save in db
    const teacher = new Teacher({
      id: count+1,
      name: req.body.name,
      image: Res.secure_url,
      imagePublicId:Res.public_id,
      rating: req.body.rating,
      reviews: req.body.reviews,
      expertise: req.body.expertise,
      session: req.body.session,
      bio: req.body.bio,
      students: req.body.students,
    });

    await teacher.save();

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
});

router.get("/id/:id", async(req,res) =>{

  try {
    
    const teacher= await Teacher.find({
      id:req.params.id,
    });

    if (!teacher) {
      return res.status(404).json({
        message: "Category not found ❌",
      });
    }

    res.json(teacher);

  } catch (error) {
    res.status(500).json({ error: err.message });
  }
})

router.delete("/id/:id", async(req, res) =>{

    try {
        
        const teacher= await Teacher.findOne({id:req.params.id});

        if(!teacher){
            return res.status(404).json({ message: "Teacher not found" });
        }

        
        if(teacher.imagePublicId){
            await cloudinary.uploader.destroy(teacher.imagePublicId);
        }

        await Teacher.deleteOne({id:req.params.id});

        res.json({message:"Deleted successfully ✅"});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;
