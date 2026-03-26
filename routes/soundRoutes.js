import express from 'express'
import multer from 'multer';
import { createTrack, deleteCategory, getTracks, getTracksById } from '../controllers/TrackControllers.js';

const router= express.Router();

const upload= multer({dest: "Uploads/"});

const multiUpload= upload.fields([
    {name:'audio', maxCount:1},
    {name:'thumbnail', maxCount:1},
])

router.post("/",multiUpload, createTrack );
router.get("/",getTracks);
router.get("/category/id/:id",getTracksById);
router.delete("/category/id/:id",deleteCategory);

export default router;