const mongoose = require("mongoose");
const User = require("../models/UserSchema");
const Jobs = require("../models/JobSchema");
//1.user profile completion
exports.completeUserProfile = async (req, res) => {
  try {
    const { name, mobile, location } = req.body;
    const user = req.user;

    if (!name || !mobile) {
      return res.status(400).json({ error: "Name and mobile are required" });
    }

    if (
      !location ||
      !location.coordinates ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or missing location data" });
    }

    const newUser = new User({
      authId: user.authId,
      name,
      mobile,
      location,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Profile completed successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error in completeUserProfile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//2.fetching jobs
exports.getJobs = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      limit = 10,
      cursor,
      skills,
      latitude,
      longitude,
      city,
      state,
      pincode,
    } = req.query;

    const jobsLimit = parseInt(limit);
    let filter = {};

    if (skills) {
      filter.skills = {
        $in: skills.split(",").map((skill) => new RegExp(skill.trim(), "i")),
      };
    }
    if (cursor) {
      filter._id = { $gt: cursor };
    }

    if (city) {
      filter["location.city"] = { $regex: new RegExp(city, "i") };
    }

    if (state) {
      filter["location.state"] = { $regex: new RegExp(state, "i") };
    }

    if (pincode) {
      filter["location.pincode"] = pincode;
    }

    if (!city && !state && !pincode && latitude && longitude) {
      filter["location.coordinates"] = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(longitude), parseFloat(latitude)],
            10 / 6371,
          ],
        },
      };
    }

    const jobs = await Jobs.find(filter)
      .sort({ _id: 1 })
      .limit(jobsLimit + 1);

    let nextCursor = null;
    if (jobs.length > jobsLimit) {
      nextCursor = jobs.pop()._id;
    }

    res.status(200).json({
      jobs,
      nextCursor,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.checkProfile = async (req, res) => {
  try {
    const user = req.user; // This comes from middleware
    const userProfile = await User.findOne({ authId: user.authId });

    if (userProfile) {
      return res.status(200).json({ profileComplete: true });
    } else {
      return res.status(404).json({ profileComplete: false });
    }
  } catch (error) {
    console.error("Error checking profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
