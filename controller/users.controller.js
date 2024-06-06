import {
  biodatasCollection,
  favouritesCollection,
  reviewsCollection,
  usersCollection,
} from "../db/mongoConnect.js";
import { ApiResponse } from "../helpers/apiResponse.js";
import { ApiError } from "../helpers/errorHandler.js";

import jwt from "jsonwebtoken";

export const generateToken = async (req, res) => {
  const user = req.body;
  try {
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
      const token = jwt.sign(existingUser, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.send({ token, user: existingUser });
    } else {
      const newUserBeforeSave = {
        ...user,
        isAdmin: false,
        isPremium: false,
        isPremiumPending: false,
        isAdminPending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newUser = await usersCollection.insertOne(newUserBeforeSave);
      const savedUser = await usersCollection.findOne(newUser.insertedId);

      const token = jwt.sign(savedUser, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.send({ token, user: savedUser });
    }
  } catch (error) {
    res.json(new ApiError(500, null, "Internal Server Error"));
  }
};

export const createBiodatas = async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    res.json(new ApiResponse(200, "Users retrieved successfully", users));
  } catch (error) {
    res.json(new ApiError(500, null, "Internal Server Error"));
  }
};

export const makeRequest = async () => {
  const { biodataId } = req.body;

  // Code to make a request
};

export const deleteUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Code to delete a user from the database
    await usersCollection.findOneAndDelete({ email });

    res.json(new ApiResponse(200, "User deleted successfully"));
  } catch (error) {
    // Code to handle errors
    res.json(new ApiError(500, null, "Internal Server Error"));
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email } = req.body;
    const updatedData = req.body;

    // Code to update a user in the database
    const updatedUser = await usersCollection.findOneAndUpdate(
      { email },
      { $set: updatedData },
      { returnOriginal: false }
    );

    if (updatedUser) {
      // Code to send a success response
      res.json(new ApiResponse(200, "User updated successfully", updatedUser));
    } else {
      // Code to handle user not found
      res.json(new ApiError(404, null, "User not found"));
    }
  } catch (error) {
    // Code to handle errors
    res.json(new ApiError(500, null, "Internal Server Error"));
  }
};

export const makePremium = async (req, res) => {
  const { email } = req.user;

  try {
    await usersCollection.findOneAndUpdate(
      {
        email: email,
      },
      {
        $set: {
          isPremiumPending: true,
        },
      }
    );

    res.send({ message: "Premium request sent" });
  } catch (error) {
    res.json(new ApiError(500, null, "Internal Server Error"));
  }
};

export const FavoriteController = async (req, res) => {
  const user = req.user;

  const { biodataId } = req.body;


  const favoriteData = {
    user: user.email,
    biodataId,
    createdAt: new Date(),
    name: req.body.name,
    email: req.body.contactEmail,
    permanentDivision: req.body.permanentDivision,
    occupation: req.body.occupation,
  };

  try {
    await favouritesCollection.insertOne(favoriteData);
    res.json({ isExist: true });
  } catch (error) {
    res.json(new ApiError(500, null, "Internal Server Error"));
  }
};

export const deleteFromFavorite = async (req, res) => {
  const { email } = req.user;

  const { biodataId } = req.params;


  await favouritesCollection.findOneAndDelete({
    user: email,
    biodataId: parseInt(biodataId),
  });
  res.json({ isExist: false });
};

export const checkFavorite = async (req, res) => {
  const { email } = req.user;

  const { biodataId } = req.params;

  const favorite = await favouritesCollection.findOne({
    user: email,
    biodataId: parseInt(biodataId),
  });

  if (favorite) {
    res.json({ isExist: true });
  }
};

export const allFavorite = async (req, res) => {
  const allFavorite = await favouritesCollection.find().toArray();

  res.json(allFavorite);
};

export const ReviewController = async (req, res) => {
  const { email } = req.user;


  const reviewData = {
    user: email,
    ...req.body,
    createdAt: new Date(),
  };

  await reviewsCollection.insertOne(reviewData).then(() => {
    res.json("Review added successfully");
  });
};

export const allReview = async (req, res) => {
  const allReviews = await reviewsCollection
    .find()
    .sort({ createdAt: -1 })
    .toArray();


  res.json(allReviews);
};

export const getFilterData = async (req, res) => {
  const query = req.query;

  const searchQuery = {
    age: query.age,
    biodataType: query.biodataType,
    permanentDivision: query.division,
  };

  if (query.age || query.biodataType || query.division) {
    const filterData = await biodatasCollection
      .find({
        $or: [
          { age: searchQuery.age },
          { biodataType: searchQuery.biodataType },
          { permanentDivision: searchQuery.permanentDivision },
        ],
      })
      .toArray();
    res.json(filterData);
  } else {
    const filterData = await biodatasCollection.find().toArray();
    res.json(filterData);
  }
};

export const getPremium = async (req, res) => {
  const premiumUsers = await biodatasCollection
    .find({ isPremium: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray();
  res.json(premiumUsers);
};
