import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // Get User Detail from Frontend
    const { username, email, fullName, password } = req.body;
    console.log("User Details: ", username, email, fullName, password);

    // Validation - not empty
    if ([username, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists in DB (by username or email)
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // console.log("files", req.files)
    // Check if avatar and cover image files are present
    const avatarLocalPath = req.files?.avatar?.[0]?.path;  // Optional chaining to avoid crash
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // Avatar is required, cover image is optional
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // Upload files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // Ensure avatar was successfully uploaded..
    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    // Create user object in database
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "" // Optional chaining in case coverImage is not uploaded
    });
 
    // Retrieve created user excluding sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // Check if user creation was successful
    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    // Return success response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});
export {
    registerUser,
};
