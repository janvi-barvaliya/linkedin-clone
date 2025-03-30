import { auth, provider } from "../Firebase";
import db from "../Firebase";
import { GET_ARTICLES, SET_LOADING_STATUS, SET_USER } from "./ActionType";
import { uploadToCloudinary } from "../utils/cloudinary"; // Import Cloudinary upload function

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  payload: payload,
});

export function signInAPI() {
  return (dispatch) => {
    auth
      .signInWithPopup(provider)
      .then((payload) => {
        dispatch(setUser(payload.user));
      })
      .catch((error) => alert(error.message));
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
}

/**
 * Uploads post content (image/video) to Cloudinary and saves it in Firestore.
 * @param {Object} payload - Post data (image, video, description, user, timestamp).
 */
export function postArticleAPI(payload) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    let mediaUrl = "";

    if (payload.image) {
      // Upload image to Cloudinary
      mediaUrl = await uploadToCloudinary(payload.image);
    } else if (payload.video) {
      // Upload video to Cloudinary
      mediaUrl = await uploadToCloudinary(payload.video);

      // Ensure Cloudinary video URL is correctly formatted
      if (mediaUrl) {
        mediaUrl = mediaUrl.replace("/upload/", "/upload/f_auto/"); // Ensures video is optimized
      }

    }
    // Debugging: Check if mediaUrl exists
    console.log("Final media URL to be saved:", mediaUrl);

    // Store post details in Firestore
    try {
      await db.collection("articles").add({
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video ? mediaUrl : "", // Store video URL if available
        sharedImg: payload.image ? mediaUrl : "", // Store image URL if available
        comments: 0,
        description: payload.description,
      });

      dispatch(setLoading(false));
      console.log("Post successfully uploaded!");
    } catch (error) {
      console.error("Error uploading post:", error);
      dispatch(setLoading(false));
    }
  };
}

/**
 * Fetches articles from Firestore and updates Redux state.
 */
export function getArticlesAPI() {
  return (dispatch) => {
    let payload;

    db.collection("articles").orderBy("actor.date", "desc").onSnapshot((snapshot) => {
      const payload = snapshot.docs.map((doc) => {
        console.log("Fetched Post Data:", doc.data()); // Debugging
        return doc.data();
      });
      dispatch(getArticles(payload));
    });
  };
}
