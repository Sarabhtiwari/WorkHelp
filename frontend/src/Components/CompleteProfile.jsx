import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    location: {
      ...(JSON.parse(localStorage.getItem("userLocation")) || {}),
      city: "",
      state: "",
      pincode: "",
    },
    skills: [],
  });

  useEffect(() => {
    const storedRole = Cookies.get("role");
    if (storedRole && storedRole !== role) {
      setRole(storedRole);
    }
  }, [role]);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setProfile((prevProfile) => ({
      ...prevProfile,
      ...(selectedRole === "worker"
        ? {
            age: "",
            gender: "",
            skills: [],
            experience: "",
            fees: "",
            feesType: "custom",
            customSkill: "",
          }
        : {
            age: undefined,
            gender: undefined,
            skills: undefined,
            experience: undefined,
            fees: undefined,
            feesType: undefined,
            customSkill: undefined,
          }),
    }));
  };

  const isWorker = role === "worker";

  const skillOptions = [
    "Electrician",
    "Painter",
    "Labourer",
    "Mistri",
    "Plumber",
    "Cleaner",
  ];

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      skills: checked
        ? [...prevProfile.skills, value]
        : prevProfile.skills.filter((skill) => skill !== value),
    }));
  };

  const handleCustomSkillAdd = () => {
    setProfile((prevProfile) => {
      const newSkill = prevProfile.customSkill?.trim() || "";
      const currentSkills = Array.isArray(prevProfile.skills)
        ? prevProfile.skills
        : [];

      if (newSkill && !currentSkills.includes(newSkill)) {
        return {
          ...prevProfile,
          skills: [...currentSkills, newSkill],
          customSkill: "",
        };
      }
      return prevProfile;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = "worker/complete-profile";

      let transformedLocation = profile.location;
      if (
        transformedLocation &&
        transformedLocation.latitude &&
        transformedLocation.longitude
      ) {
        transformedLocation = {
          type: "Point",
          coordinates: [
            transformedLocation.longitude,
            transformedLocation.latitude,
          ],
          city: profile.location.city,
          state: profile.location.state,
          pincode: profile.location.pincode,
        };
      }

      const profileData = { ...profile, location: transformedLocation };

      const response = await axios.post(
        `http://localhost:5000/api/${endpoint}`,
        profileData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      alert("Profile submitted successfully!");
      console.log("Response:", response.data);

      navigate("/worker-landing");
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Failed to submit profile. Please try again.");
    }
  };

  if (role === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-100 rounded-lg shadow-xl">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <label className="text-lg font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          required
          onChange={handleChange}
          className="p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="text-lg font-semibold">Mobile No.</label>
        <input
          type="tel"
          name="mobile"
          value={profile.mobile}
          required
          onChange={handleChange}
          className="p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {isWorker && (
          <>
            <label className="text-lg font-semibold">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age || ""}
              min="18"
              required
              onChange={handleChange}
              className="p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-lg font-semibold">Gender</label>
            <input
              type="text"
              name="gender"
              value={profile.gender || ""}
              required
              onChange={handleChange}
              className="p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-lg font-semibold">Skills</label>
            <div className="flex flex-wrap gap-4">
              {skillOptions.map((skill) => (
                <label key={skill} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={skill}
                    checked={profile.skills.includes(skill)}
                    onChange={handleSkillChange}
                    className="text-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  {skill}
                </label>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="customSkill"
                placeholder="Enter custom skill"
                value={profile.customSkill || ""}
                onChange={handleChange}
                className="p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleCustomSkillAdd}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add Skill
              </button>
            </div>

            <label className="text-lg font-semibold">Experience (Years)</label>
            <input
              type="number"
              name="experience"
              min="0"
              value={profile.experience !== undefined ? profile.experience : ""}
              required
              onChange={handleChange}
              className="p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-lg font-semibold">City</label>
            <input
              type="text"
              name="city"
              value={profile.location.city}
              required
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    city: e.target.value,
                  },
                }))
              }
              className="p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-lg font-semibold">State</label>
            <input
              type="text"
              name="state"
              value={profile.location.state}
              required
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    state: e.target.value,
                  },
                }))
              }
              className="p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-lg font-semibold">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={profile.location.pincode}
              required
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    pincode: e.target.value,
                  },
                }))
              }
              className="p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-lg font-semibold">Fees</label>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                name="fees"
                placeholder="Enter Amount"
                value={
                  profile.fees === "as_per_work"
                    ? ""
                    : profile.fees !== undefined
                    ? profile.fees
                    : ""
                }
                disabled={profile.fees === "as_per_work"}
                onChange={handleChange}
                className="p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.fees === "as_per_work"}
                  onChange={() =>
                    setProfile((prevProfile) => ({
                      ...prevProfile,
                      fees:
                        prevProfile.fees === "as_per_work" ? "" : "as_per_work",
                    }))
                  }
                  className="text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                As Per Work
              </label>
            </div>
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
