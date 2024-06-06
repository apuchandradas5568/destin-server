import { ObjectId } from "mongodb";
import {
  biodatasCollection,
  paymentsCollection,
  reviewsCollection,
  usersCollection,
} from "../db/mongoConnect.js";
import {
  sendAdminMail,
  sendPremiumConfirmationMail,
  sendRemoveAdminMail,
} from "../nodemailer/nodeMailer.js";

const getApprovedListController = async (req, res) => {
  const getApprovedListFromBio = await biodatasCollection
    .find({ isPremium: true })
    .toArray();

  res.json(getApprovedListFromBio);
};

const getPendingListController = async (req, res) => {
  const getPendingList = await biodatasCollection
    .find({ isPremiumPending: true })
    .toArray();

  console.log(getApprovedListController);

  res.json(getPendingList);
};

const getUsersListController = async (req, res) => {
  const getUsersList = await usersCollection.find().toArray();
  res.json(getUsersList);
};

const approveUserController = async (req, res) => {
  const body = req.body;
  const { email } = req.user;
};

const cancelPremiumMembershipController = async (req, res) => {
  const body = req.body;

  const userfromBioData = await biodatasCollection.findOneAndUpdate(
    { biodataId: body.biodataId },
    { $set: { isPremium: false, isPremiumPending: false } }
  );

  const userFromUsers = await usersCollection.findOneAndUpdate(
    {
      email: body.contactEmail,
    },
    { $set: { isPremium: false, isPremiumPending: false } }
  );

  res.json({ message: "successful" });
};

const deleteUserController = async (req, res) => {
  const { email } = req.params;
  await biodatasCollection.findOneAndDelete({ contactEmail: email });

  await usersCollection.findOneAndDelete({ email: email });

  res.json("User deleted successfully");
};

const makeAdminController = async (req, res) => {
  const { email } = req.params;

  await usersCollection
    .findOneAndUpdate(
      { email: email },
      {
        $set: {
          isAdmin: true,
        },
      }
    )
    .then(() => {
      sendAdminMail(email);
    });

  res.json({ message: "User Role Changed." });
};

const removeAdminController = async (req, res) => {
  const { email } = req.params;

  await usersCollection
    .findOneAndUpdate(
      { email: email },
      {
        $set: {
          isAdmin: false,
        },
      }
    )
    .then(() => {
      sendRemoveAdminMail(email);
    });

  res.json({ message: "User Role Changed." });
};

const makePremiumController = async (req, res) => {
  const { email } = req.params;
  await biodatasCollection.findOneAndUpdate(
    { contactEmail: email },
    { $set: { isPremium: true, isPremiumPending: false } }
  );

  await usersCollection
    .findOneAndUpdate(
      { email: email },
      { $set: { isPremium: true, isPremiumPending: false } }
    )
    .then(() => {
      sendPremiumConfirmationMail(email);
    });

  res.json("User approved successfully");
};

const cancelPremiumController = async (req, res) => {
  const { email } = req.params;
  await biodatasCollection.findOneAndUpdate(
    { contactEmail: email },
    { $set: { isPremium: false, isPremiumPending: false } }
  );

  await usersCollection.findOneAndUpdate(
    { email: email },
    { $set: { isPremium: false, isPremiumPending: false } }
  );
  res.json("Removed from Premium");
};

const adminDashboardDataController = async (req, res) => {
  const totalUsers = await usersCollection.find().count();
  const totalPremium = await usersCollection.find({ isPremium: true }).count();
  const totalAdmins = await usersCollection.find({ isAdmin: true }).count();
  const totalPending = await biodatasCollection
    .find({ isPremiumPending: true })
    .count();
  const totalApproved = await biodatasCollection
    .find({ isPremium: true })
    .count();
  const totalBiodatas = await biodatasCollection.find().count();

  const MaleBiodatas = await biodatasCollection
    .find({ biodataType: "Male" })
    .count();
  const FamaleBiodatas = await biodatasCollection
    .find({ biodataType: "Famale" })
    .count();

  const totalPayments = (await paymentsCollection.find().count()) * 5;

  const totalPaymentsInEachMonth = await paymentsCollection
    .aggregate([
      {
        $addFields: {
          date: { $toDate: "$date" },
        },
      },
      {
        $project: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          price: 1,
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          total: { $sum: "$price" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ])
    .toArray();

  const allSuccessStories = await reviewsCollection
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  res.json({
    totalUsers,
    totalPremium,
    totalAdmins,
    totalPending,
    totalApproved,
    totalBiodatas,
    MaleBiodatas,
    FamaleBiodatas,
    totalPayments,
    totalPaymentsInEachMonth,
    allSuccessStories,
  });
};

const deleteStoryController = async (req, res) => {
  const { id } = req.params;
  const data = await reviewsCollection.findOneAndDelete({ _id: new ObjectId(id) });
  res.json(data);
};

export {
  getApprovedListController,
  getPendingListController,
  getUsersListController,
  approveUserController,
  cancelPremiumMembershipController,
  deleteUserController,
  makeAdminController,
  removeAdminController,
  makePremiumController,
  cancelPremiumController,
  adminDashboardDataController,
  deleteStoryController,
};
