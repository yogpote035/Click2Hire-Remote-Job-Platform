import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ImCross } from "react-icons/im";

import {
  createEmployeeProfile,
  updateEmployeeProfile,
  getEmployeeProfile,
} from "../../../AllStateStore/JobSeeker/JobSeekerProfileSlice";
import toast from "react-hot-toast";

export default function CreateJobSeekerProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, jobseeker } = useSelector(
    (state) => state.jobseekerProfile
  );
  const [profileFile, setProfileFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    fullName: "",
    email: "",
    mobileNumber: "",
    profilePicture: "",
    skills: [],
    experience: "",
    projects: [],
    education: [],
    certifications: [],
    languages: [],
    linkedinProfile: "",
    githubProfile: "",
    location: "",
    about: "",
    resumeUrl: "",
    role: "jobseeker",
    portfolioUrl: "",
    jobPreferences: "",
    availability: "Available",
    expectedSalary: "",
  });

  // Populate form if editing
  useEffect(() => {
    if (id) dispatch(getEmployeeProfile(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (jobseeker) {
      setForm({
        ...form,
        ...jobseeker,
        skills: jobseeker.skills || [],
        languages: jobseeker.languages || [],
        certifications: jobseeker.certifications || [],
        projects: jobseeker.projects || [],
        education: jobseeker.education || [],
      });
    }
  }, [jobseeker]);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addToList = (key, value) => {
    if (!value || !String(value).trim()) return;
    setForm((prev) => ({
      ...prev,
      [key]: Array.from(new Set([...(prev[key] || []), String(value).trim()])),
    }));
  };

  const removeFromList = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((v) => v !== value),
    }));

  const addProject = () =>
    setForm((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          title: "",
          description: "",
          skills: [],
          technologies: [],
          sourceCode: "",
          liveUrl: "",
        },
      ],
    }));

  const updateProject = (idx, patch) =>
    setForm((prev) => {
      const next = [...(prev.projects || [])];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, projects: next };
    });

  const removeProject = (idx) =>
    setForm((prev) => {
      const next = [...(prev.projects || [])];
      next.splice(idx, 1);
      return { ...prev, projects: next };
    });

  const addEducation = () =>
    setForm((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          degree: "",
          institution: "",
          year: "",
          CGPA: "",
        },
      ],
    }));

  const updateEducation = (idx, patch) =>
    setForm((prev) => {
      const next = [...(prev.education || [])];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, education: next };
    });

  const removeEducation = (idx) =>
    setForm((prev) => {
      const next = [...(prev.education || [])];
      next.splice(idx, 1);
      return { ...prev, education: next };
    });

  // Append form fields
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
    setSaving(true);

    if (!form.fullName || !form.email || !form.mobileNumber) {
      setSaving(false);
      return toast.error("Full name, email, and mobile number are required.");
    }

    try {
      // Convert object to FormData
      const formData = objectToFormData(form);

      // Append files
      if (profileFile) formData.append("profilePicture", profileFile);
      if (resumeFile) formData.append("resumeUrl", resumeFile);

      if (id) {
        console.log("Updating employee profile...");
        await dispatch(updateEmployeeProfile(id, formData, navigate));
      } else {
        console.log("Creating employee profile...");
        await dispatch(createEmployeeProfile(formData, navigate));
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">
          {id ? "Edit Job Seeker Profile" : "Create Job Seeker Profile"}
        </h1>
      </header>

      {(error || loading) && (
        <div className="space-y-2 mb-4">
          {loading && <div className="text-blue-600">Loading…</div>}
          {error && <div className="text-red-600">{error}</div>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Basic Information">
          <Grid>
            <TextInput
              required
              label="Full Name*"
              value={form.fullName}
              onChange={(v) => setField("fullName", v)}
            />
            <TextInput
              required
              label="Email*"
              type="email"
              value={form.email}
              onChange={(v) => setField("email", v)}
            />
            <TextInput
              required
              label="Mobile Number*"
              type="number"
              pattern="[0-9]{10}"
              value={form.mobileNumber}
              onChange={(v) => setField("mobileNumber", v)}
            />
            <TextInput
              required
              label="Location"
              value={form.location}
              onChange={(v) => setField("location", v)}
            />
          </Grid>
          <Grid>
            <TextInput
              required
              label="LinkedIn"
              type="url"
              value={form.linkedinProfile}
              onChange={(v) => setField("linkedinProfile", v)}
            />
            <TextInput
              required
              label="GitHub"
              type="url"
              value={form.githubProfile}
              onChange={(v) => setField("githubProfile", v)}
            />
            <TextInput
              required
              label="Portfolio URL"
              type="url"
              value={form.portfolioUrl}
              onChange={(v) => setField("portfolioUrl", v)}
            />
            <div className="mt-1 grid">
              <label htmlFor="" className="text-sm block mb-1 text-gray-700">
                Profile Picture
              </label>
              <input
                accept="image/*"
                className="p-2 rounded border-1"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setProfileFile(file); // store for upload
                  if (file) {
                    setProfilePreview(URL.createObjectURL(file)); // preview locally
                  }
                }}
              />
              {/* Preview new image if selected */}
            </div>
          </Grid>
          {(profilePreview || jobseeker?.profilePicture) && (
            <div className="flex justify-between border border-rose-200 rounded-2xl mt-2 p-2">
              {profilePreview && (
                <div className="p-2">
                  <p className="block text-red-700 mb-2">
                    New Image For Upload
                  </p>
                  {profilePreview && (
                    <img
                      src={profilePreview}
                      alt="New Profile Preview"
                      className="h-50 w-60 object-cover rounded"
                    />
                  )}
                </div>
              )}
              {jobseeker && jobseeker?.profilePicture?.url && (
                <div className=" p-2">
                  {/* Show existing profile picture */}
                  <p className="block text-yellow-700 mb-2">
                    Uploaded Profile Image
                  </p>

                  <img
                    src={jobseeker.profilePicture.url}
                    alt="Previous Profile Picture"
                    className="h-50 w-60 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}
        </Section>

        <Section title="About & Preferences">
          <Grid>
            <TextArea
              required
              label="About"
              value={form.about}
              onChange={(v) => setField("about", v)}
            />
            <TextInput
              required
              label="Job Preferences"
              value={form.jobPreferences}
              onChange={(v) => setField("jobPreferences", v)}
            />
            <Select
              label="Availability"
              required
              value={form.availability}
              options={["Available", "Not Available", "Open to Offers"]}
              onChange={(v) => setField("availability", v)}
            />
            <NumberInput
              label="Expected Salary"
              value={form.expectedSalary}
              onChange={(v) => setField("expectedSalary", v)}
              required
            />
            <div className="mt-1">
              <label htmlFor="" className="text-sm text-gray-700">
                Select Resume
                <span className="text-red-400">PDF/DOC/DOCX</span>
              </label>
              <input
                accept=".pdf,.doc,.docx"
                type="file"
                className="p-2 rounded border-1"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
              {jobseeker && jobseeker?.resumeUrl?.url && (
                <a
                  href={`${jobseeker?.resumeUrl?.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-indigo-500 hover:underline font-light hover:font-normal"
                >
                  View Existing Resume
                </a>
              )}{" "}
            </div>
          </Grid>
          {/* remove letter */}
          {/* <Grid>
            {/* <TextInput
              required
              label="Resume URL"
              value={form.resumeUrl}
              onChange={(v) => setField("resumeUrl", v)}
              /> */}
          {/* </Grid> */}
        </Section>

        <Section title="Skills, Languages & Certifications">
          <ChipEditor
            label="Skills"
            items={form.skills}
            onAdd={(val) => addToList("skills", val)}
            onRemove={(val) => removeFromList("skills", val)}
            placeholder="e.g. React"
            required
          />
          <ChipEditor
            label="Languages"
            items={form.languages}
            onAdd={(val) => addToList("languages", val)}
            onRemove={(val) => removeFromList("languages", val)}
            placeholder="e.g. English"
            required
          />
          <ChipEditor
            required
            label="Certifications"
            items={form.certifications}
            onAdd={(val) => addToList("certifications", val)}
            onRemove={(val) => removeFromList("certifications", val)}
            placeholder="e.g. AWS SAA"
          />
        </Section>

        <Section title="Education">
          <button
            type="button"
            onClick={addEducation}
            className="px-3 py-2 rounded bg-black text-white text-sm mb-3"
          >
            + Add Education
          </button>
          <div className="space-y-4">
            {form.education?.map((ed, idx) => (
              <div key={idx} className="border rounded p-3">
                <Grid>
                  <TextInput
                    required
                    label="Degree"
                    value={ed.degree}
                    onChange={(v) => updateEducation(idx, { degree: v })}
                  />
                  <TextInput
                    required
                    label="Institution"
                    value={ed.institution}
                    onChange={(v) => updateEducation(idx, { institution: v })}
                  />
                  <TextInput
                    required
                    label="Year"
                    value={ed.year}
                    onChange={(v) => updateEducation(idx, { year: v })}
                  />
                  <TextInput
                    required
                    label="CGPA"
                    value={ed.CGPA}
                    onChange={(v) => updateEducation(idx, { CGPA: v })}
                  />
                </Grid>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Projects">
          <button
            type="button"
            onClick={addProject}
            className="px-3 py-2 rounded bg-black hover:bg-gray-800 text-white text-sm mb-3"
          >
            + Add Project
          </button>
          <div className="space-y-4">
            {form.projects?.map((pr, idx) => (
              <div key={idx} className="border rounded p-3">
                <Grid>
                  <TextInput
                    required
                    label="Title"
                    value={pr.title}
                    onChange={(v) => updateProject(idx, { title: v })}
                  />
                  <TextInput
                    required
                    label="Source Code URL"
                    value={pr.sourceCode}
                    onChange={(v) => updateProject(idx, { sourceCode: v })}
                  />
                  <TextInput
                    required
                    label="Live URL"
                    value={pr.liveUrl}
                    onChange={(v) => updateProject(idx, { liveUrl: v })}
                  />
                </Grid>
                <TextArea
                  label="Description"
                  value={pr.description}
                  onChange={(v) => updateProject(idx, { description: v })}
                />
                <div className="mt-3">
                  <ChipEditor
                    label="Project Skills"
                    items={pr.skills || []}
                    onAdd={(val) =>
                      updateProject(idx, {
                        skills: [...(pr.skills || []), val],
                      })
                    }
                    onRemove={(val) =>
                      updateProject(idx, {
                        skills: (pr.skills || []).filter((s) => s !== val),
                      })
                    }
                    placeholder="e.g. Redux"
                  />
                  <ChipEditor
                    label="Technologies"
                    items={pr.technologies || []}
                    onAdd={(val) =>
                      updateProject(idx, {
                        technologies: [...(pr.technologies || []), val],
                      })
                    }
                    onRemove={(val) =>
                      updateProject(idx, {
                        technologies: (pr.technologies || []).filter(
                          (t) => t !== val
                        ),
                      })
                    }
                    placeholder="e.g. Node.js"
                  />
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {saving ? "Saving..." : id ? "Update Profile" : "Create Profile"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="border rounded p-4">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
  );
}

function TextInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded px-3 py-2 focus:outline-none outline-none"
      />
    </label>
  );
}

function NumberInput({ label, value, onChange, min }) {
  //here update min salary number
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        required
        className="mt-1 w-full border rounded px-3 py-2 focus:outline-none outline-none"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block md:col-span-2">
      <span className="text-sm text-gray-700">{label}</span>
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded px-3 py-2 focus:outline-none outline-none"
      />
    </label>
  );
}

function Select({ label, value, options = [], onChange }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded px-3 py-2 focus:outline-none outline-none "
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChipEditor({ label, items = [], onAdd, onRemove, placeholder }) {
  const [val, setVal] = useState("");
  const handleAdd = () => {
    const v = val.trim();
    if (!v) return;
    onAdd(v);
    setVal("");
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };
  return (
    <div className="mb-3">
      <span className="block text-sm text-gray-700 mb-1  focus:outline-none outline-none">
        {label}
      </span>
      <div className="flex gap-2 mb-2">
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 border rounded px-3 py-2   focus:outline-none outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-2 bg-black hover:bg-gray-800 text-white rounded text-sm"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="text-red-600 hover:text-gray-900"
            >
              <ImCross size={15} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
