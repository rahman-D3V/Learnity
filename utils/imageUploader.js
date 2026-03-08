import { configDotenv } from "dotenv";
import ImageKit from "imagekit";

configDotenv();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_publicKey,
  privateKey: process.env.IMAGEKIT_privateKey,
  urlEndpoint: process.env.IMAGEKIT_urlEndpoint,
});

export const imageUpload = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const result = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/Learnity",
    });

    return result.url;
  } catch (error) {
    throw new Error("Image upload failed: " + error.message);
  }
};

// Note: Always attach upload.single("file") middleware in the route
// before calling this function from any controller. It parses the incoming multipart/form-data
// and makes the uploaded file available as req.file.
// Without it, the thumbnail upload logic will not work
