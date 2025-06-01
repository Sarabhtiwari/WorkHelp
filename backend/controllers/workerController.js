//all methods related to worker

const WorkerProfile = require("../models/WorkerProfile");
const AuthData = require("../models/AuthDetails");

const Jobs = require("../models/JobSchema");
//1. complete profile

exports.completeProfile = async (req, res) => {
  try {
    const user = req.user;

    const { name, age, mobile, gender, skills, experience, fees, location } =
      req.body;

    if (
      !name ||
      !age ||
      !mobile ||
      !gender ||
      !skills ||
      !experience ||
      !fees ||
      !location || 
      !location.coordinates ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 ||
      !location.city ||
      !location.state ||
      !location.pincode
    ) {
      return res.status(400).json({ error: "complete profile please" });
    }

    if (!user || !user.authId) {
      return res.status(401).json({ error: "Unauthorized user" });
    } 
    const updatedUser = await WorkerProfile.findOneAndUpdate(
      { authId: user.authId }, 
      { name, age, mobile, gender, skills, experience, fees, location },
      { new: true, upsert: true, setDefaultsOnInsert: true } 
    );
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 2. Role select

exports.setRole = async (req, res) => {
  try {
    const user = req.user;
    const { role } = req.body;

    const updatedUser = await AuthData.findByIdAndUpdate(
      user.authId, 
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
};

//3.post jobs

exports.postJob = async (req, res) => {
  try {
    const user = req.user;

    const existingJob = await Jobs.findOne({ authId: user.authId });
    if (existingJob) {
      return res.status(409).json({ error: "Job already posted" });
    }

  
    console.log(user.authId);
    const worker = await WorkerProfile.findOne({
      authId: user.authId, 
    }).select("-authId");

    if (!worker) {
      return res
        .status(404)
        .json({ error: "Worker not found: First complete profile" });
    }
    const newJob = new Jobs({
      authId: user.authId,
      name: worker.name,
      gender: worker.gender,
      age: worker.age,
      skills: worker.skills,
      experience: worker.experience,
      mobile: worker.mobile,
      fees: worker.fees,
      location: worker.location,
    });
    await newJob.save();

    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    console.error("Error in postJob:", error);

    res.status(500).json({ error: "Internal Server Error" });
  }
};

//4. Unpost Jobs

exports.unPostJob = async (req, res) => {
  try {
    const user = req.user;

    const deletedJob = await Jobs.findOneAndDelete({ authId: user.authId });

    if (!deletedJob) {
      return res.status(404).json({ error: "No job found to delete" });
    }

    res.status(200).json({ message: "Job unposted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// //5.  to toggle role of worker to user

// exports.toggleWorkerToUser = async() =>{
//   const user = req.user;

//   if(user.role !== worker){
//     return res.status(400).json({error: "user can not toggle mode"});
//   }

//   const updatedWorkerAsUser = WorkerProfile.////findByIdAndUpdate()
// }
// Get a single worker's details by ID
exports.getWorkerDetails = async (req, res) => {
  try {
    const workerId = req.params.id;
    const worker = await Jobs.findById(workerId); 
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.status(200).json(worker); 
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
