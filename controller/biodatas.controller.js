import { biodatasCollection } from "../db/mongoConnect.js";

const createBiodata = async (req, res) => {
  const biodata = req.body;

  try {
    const existingUser = await biodatasCollection.findOne({
      contactEmail: biodata.contactEmail,
    });

    if (existingUser) {
      await biodatasCollection
        .findOneAndUpdate(
          { contactEmail: biodata.contactEmail },
          { $set: { ...biodata, updatedAt: new Date() } }
        )
        .then((data) => {
          res.status(200).json({message: "Updated Successfully", data});
        });
    } else {
      const lastBiodata = await biodatasCollection.findOne(
        {},
        { sort: { createdAt: -1 } }
      );
      const lastBiodataId = lastBiodata ? lastBiodata?.biodataId : null;

      const biodataId = lastBiodataId ? lastBiodataId + 1 : 1;

      const newBio = {
        ...biodata,
        biodataId,
        isAdmin: false,
        isPremium: false,
        isPremiumPending: false,
        isAdminPending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newBiodata = await biodatasCollection.insertOne(newBio);
      res.json(newBiodata);
    }
  } catch (error) {
    res.json(error);
  }
};

const getBiodatas = async (req, res) => {
  try {
    const biodatas = await biodatasCollection.find().toArray();
    res.json(biodatas);
  } catch (error) {
    res.json(error);
  }
};
const getBiodataById = async (req, res) => {
  const id = req.params.id;
  try {
    const biodata = await biodatasCollection.findOne({
      biodataId: parseInt(id),
    });

    res.json(biodata);
  } catch (error) {
    res.json(error);
  }
};
const getBiodata = async (req, res) => {
  const { email } = req.user;
  try {
    const biodata = await biodatasCollection.findOne({ contactEmail: email });
    res.json(biodata);
  } catch (error) {
    res.json(error);
  }
};

const deleteBiodata = async (req, res) => {
  const id = req.params.id;
  try {
    await biodatasCollection.findOneAndDelete({ _id: id });
    res.json("Biodata deleted successfully");
  } catch (error) {
    res.json(error);
  }
};

const updateBiodata = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  try {
    const updatedBiodata = await biodatasCollection.findOneAndUpdate(
      { _id: id },
      { $set: updatedData },
      { returnOriginal: false }
    );
    res.json(updatedBiodata);
  } catch (error) {
    res.json(error);
  }
};

export {
  createBiodata,
  getBiodataById,
  deleteBiodata,
  updateBiodata,
  getBiodatas,
  getBiodata,
};
