import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createEmployerProfile,
  updateEmployerProfile,
  getEmployerProfile,
} from "../../../AllStateStore/Employer/EmployerProfileSlice";
import { toast } from "react-hot-toast";

export default function CreateEmployerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profilePreview, setProfilePreview] = useState();
  const [profileFile, setProfileFile] = useState();
  const { loading, employer, error } = useSelector(
    (state) => state.employerProfile
  );

  const [form, setForm] = useState({
    userId:
      id ||
      useSelector((state) => state.authentication?.user?.userId) ||
      localStorage.getItem("userId"),
    companyName: "",
    email: "",
    mobileNumber: "",
    companyLogo: "",
    companyWebsite: "",
    industry: "",
    companySize: "",
    location: "",
    companyDescription: "",
    contactEmail: "",
    socialLinks: [{ platform: "", url: "" }],
    jobPostLimit: 10000,
    activeJobPosts: 0,
    hiringStatus: "Hiring",
    role: "employer",
  });

  useEffect(() => {
    if (id) dispatch(getEmployerProfile(id));
  }, [id]);

  useEffect(() => {
    if (employer && Array.isArray(employer) && employer.length > 0) {
      const data = employer[0];

      // Ensure socialLinks is parsed and normalized
      let links = [];
      if (Array.isArray(data.socialLinks)) {
        links = data.socialLinks;
      } else if (typeof data.socialLinks === "string") {
        try {
          links = JSON.parse(data.socialLinks);
        } catch {
          links = [];
        }
      }

      setForm((prev) => ({
        ...prev,
        ...data,
        socialLinks:
          Array.isArray(links) && links.length > 0
            ? links
            : [{ platform: "", url: "" }],
      }));
    }
  }, [employer]);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSocialChange = (index, field, value) => {
    const updated = form.socialLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : { ...link }
    );

    setForm((prev) => ({ ...prev, socialLinks: updated }));
  };

  const addSocialLink = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  const removeSocialLink = (index) => {
    const updated = [...form.socialLinks];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, socialLinks: updated }));
  };
  function objectToFormData(obj, form = new FormData(), namespace = "") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const formKey = namespace ? `${namespace}[${key}]` : key;

        if (value instanceof File) {
          // File (profilePicture, resumeUrl)
          form.append(formKey, value);
        } else if (Array.isArray(value)) {
          // Handle arrays
          value.forEach((item, index) => {
            if (typeof item === "object" && !(item instanceof File)) {
              objectToFormData(item, form, `${formKey}[${index}]`);
            } else {
              form.append(`${formKey}[${index}]`, item);
            }
          });
        } else if (typeof value === "object" && value !== null) {
          // Nested objects
          objectToFormData(value, form, formKey);
        } else if (value !== undefined && value !== null) {
          // Primitive values
          form.append(formKey, value);
        }
      }
    }
    return form;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = objectToFormData(form);

    // Append files
    if (profileFile) formData.append("companyLogo", profileFile);
    // console.log("🔍 FormData entries:");
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    try {
      if (id) {
        await dispatch(updateEmployerProfile(id, formData, navigate));
      } else {
        await dispatch(createEmployerProfile(formData, navigate));
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-1">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 border">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
          {id ? "Edit Employer Profile" : "Create Employer Profile"}
        </h2>

        {error && (
          <div className="text-red-600 text-center mb-4 text-sm">{error}</div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Inputs */}
          <InputField
            label="Company Name"
            value={form.companyName}
            onChange={(v) => setField("companyName", v)}
            required
          />
          <InputField
            label="Email"
            value={form.email}
            type="email"
            onChange={(v) => setField("email", v)}
            required
          />
          <InputField
            label="Mobile Number"
            type="number"
            pattern="[0-9]{10}"
            value={form.mobileNumber}
            onChange={(v) => setField("mobileNumber", v)}
            required
          />
          <InputField
            label="Company Website"
            value={form.companyWebsite}
            onChange={(v) => setField("companyWebsite", v)}
            type="url"
            required
          />
          <InputField
            label="Industry"
            value={form.industry}
            onChange={(v) => setField("industry", v)}
            required
          />

          <InputField
            label="Company Size"
            value={form.companySize}
            onChange={(v) => setField("companySize", v)}
            required
          />
          <InputField
            label="Location"
            value={form.location}
            onChange={(v) => setField("location", v)}
            required
          />
          <InputField
            label="Contact Email"
            value={form.contactEmail}
            type="email"
            onChange={(v) => setField("contactEmail", v)}
            required
          />

          {/*   Active Jobs */}
          <InputField
            label="Active Job Posts"
            value={form.activeJobPosts}
            type="number"
            onChange={(v) => setField("activeJobPosts", v)}
          />

          {/* Company Description */}
          <div className="col-span-1 sm:col-span-2">
            <TextArea
              label="Company Description"
              value={form.companyDescription}
              onChange={(v) => setField("companyDescription", v)}
              required
            />
          </div>
          {/* Logo + */}
          <div className="mt-1 block w-full">
            <label htmlFor="" className="text-sm block mb-1 text-gray-700">
              Company Logo
            </label>
            <input
              accept="image/*"
              className="p-2 rounded border-1"
              type="file"
              required={!id}
              onChange={(e) => {
                const file = e.target.files[0];
                setProfileFile(file); // store for upload
                if (file) {
                  setProfilePreview(URL.createObjectURL(file)); // preview locally
                }
              }}
            />
          </div>
          {(profilePreview || form?.companyLogo) && (
            <div className="flex justify-between border border-rose-200 rounded-2xl mt-2 p-2">
              {profilePreview && (
                <div className="p-2">
                  <p className="block text-red-700 mb-2">New Logo For Upload</p>
                  {profilePreview && (
                    <img
                      src={profilePreview}
                      alt="New Profile Preview"
                      className="h-50 w-60 object-cover rounded"
                    />
                  )}
                </div>
              )}
              {form && form?.companyLogo?.url && (
                <div className=" p-2">
                  {/* Show existing Company Logo*/}
                  <p className="block text-yellow-700 mb-2">
                    Uploaded Company Logo
                  </p>

                  <img
                    src={form?.companyLogo?.url}
                    alt="Previous Company Logo"
                    className="h-50 w-60 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}
          {/* Social Links */}
          <div className="col-span-1 sm:col-span-2">
            <h3 className="font-semibold mb-3 text-gray-700">Social Links</h3>
            {form.socialLinks.map((link, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-2 mb-2 w-full"
              >
                <input
                  type="text"
                  placeholder="Platform"
                  value={link.platform}
                  onChange={(e) =>
                    handleSocialChange(idx, "platform", e.target.value)
                  }
                  className="w-full sm:w-1/3 p-2 border rounded"
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) =>
                    handleSocialChange(idx, "url", e.target.value)
                  }
                  className="w-full sm:w-2/3 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(idx)}
                  className="text-red-600 font-bold self-start sm:self-center cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSocialLink}
              className="text-blue-600 font-semibold text-sm"
            >
              + Add Social Link
            </button>
          </div>

          {/* Hiring Status */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block">
              <span className="text-sm text-gray-700">Hiring Status</span>
              <select
                value={form.hiringStatus}
                onChange={(e) => setField("hiringStatus", e.target.value)}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="Hiring">Hiring</option>
                <option value="Not Hiring">Not Hiring</option>
                <option value="On Hold">On Hold</option>
              </select>
            </label>
          </div>

          {/* Submit */}
          <div className="col-span-1 sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-lg"
            >
              {loading ? "Saving..." : id ? "Update Profile" : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Reusable Input */
function InputField({ label, value, onChange, type = "text", required }) {
  return (
    <label className="block w-full">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
        required={required}
      />
    </label>
  );
}

/* Reusable TextArea */
function TextArea({ label, value, onChange, rows = 5, required }) {
  return (
    <label className="block w-full">
      <span className="text-sm text-gray-700">{label}</span>
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
        required={required}
      />
    </label>
  );
}
