import axios from "axios";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_URL = (resourceType) =>
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

/**
 * Uploads a file (image/video) or a video URL to Cloudinary.
 * @param {File|string} fileOrUrl - The file (image/video) or video URL.
 * @returns {Promise<string|null>} - The Cloudinary URL of the uploaded file or null if failed.
 */
export const uploadToCloudinary = async (fileOrUrl) => {
  if (!fileOrUrl) {
    console.error("No file or URL provided for upload.");
    return null;
  }

  const isUrl = typeof fileOrUrl === "string"; // Check if it's a URL
  const resourceType = isUrl ? "video" : fileOrUrl.type?.startsWith("image") ? "image" : "video";

  const formData = new FormData();
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("file", fileOrUrl); // Supports both file & URL

  try {
    console.log("Uploading to Cloudinary:", isUrl ? "URL" : "File", fileOrUrl);

    const response = await axios.post(CLOUDINARY_URL(resourceType), formData);

    console.log("Cloudinary Full Response:", response.data); // Debugging

    return response.data.secure_url.replace("/upload/", "/upload/f_auto/");
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.response?.data || error.message);
    return null;
  }
};
