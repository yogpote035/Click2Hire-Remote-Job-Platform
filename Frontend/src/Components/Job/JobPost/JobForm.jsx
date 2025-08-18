import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
const JobForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    employmentType: "Full-Time",
    minSalary: "",
    maxSalary: "",
    currency: "INR",
    skillsRequired: "",
    experienceLevel: "Entry",
    status: "Open",
    vacancies: 1,
    deadline: "",
    jobCategory: "",
    educationRequired: "",
    benefits: "",
    remoteOption: "On-site",
    jobLevel: "Entry-Level",
    workSchedule: "Day Shift",
    languagesRequired: "",
    applicationMethod: "Easy Apply",
    companyPerks: "",
    postedBy: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        ...formData,
        ...initialData,
        skillsRequired: initialData.skillsRequired
          ? initialData.skillsRequired.join(", ")
          : "",
        benefits: initialData.benefits ? initialData.benefits.join(", ") : "",
        languagesRequired: initialData.languagesRequired
          ? initialData.languagesRequired.join(", ")
          : "",
        companyPerks: initialData.companyPerks
          ? initialData.companyPerks.join(", ")
          : "",
        minSalary: initialData.salaryRange?.min || "",
        maxSalary: initialData.salaryRange?.max || "",
        currency: initialData.salaryRange?.currency || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      skillsRequired: formData.skillsRequired
        ? formData.skillsRequired.split(",").map((s) => s.trim())
        : [],
      benefits: formData.benefits
        ? formData.benefits.split(",").map((s) => s.trim())
        : [],
      languagesRequired: formData.languagesRequired
        ? formData.languagesRequired.split(",").map((s) => s.trim())
        : [],
      companyPerks: formData.companyPerks
        ? formData.companyPerks.split(",").map((s) => s.trim())
        : [],
      salaryRange: {
        min: formData.minSalary,
        max: formData.maxSalary,
        currency: formData.currency,
      },
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 mt-8 max-w-2xl mx-auto">
      <h1 className="text-3xl text-center font-bold mb-4">
        {initialData && initialData._id ? "Edit Job Post" : "Create Job Post"}
      </h1>
      {/* Job Title */}
      <div>
        <label className="block font-semibold mb-1">Job Title</label>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
      </div>
      {/* Job Description */}
      <div>
        <label className="block font-semibold mb-1">Job Description</label>
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
      </div>
      {/* Location */}
      <div>
        <label className="block font-semibold mb-1">Location</label>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
      </div>
      {/* Employment Type */}
      <div>
        <label className="block font-semibold mb-1">Employment Type</label>
        <select
          name="employmentType"
          required
          value={formData.employmentType}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
      </div>
      {/* Salary Currency */}
      <div>
        <label className="block font-semibold mb-1">Employment Type</label>
        <select
          name="currency"
          required
          value={formData.currency}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option disabled value="">
            Select Currency
          </option>
          <option value="INR">Indian Rupees</option>
          <option value="USD">USD</option>
          <option value="EURO">EURO</option>
          <option value="POUND">POUND</option>
        </select>
      </div>
      {/* Salary */}
      <div>
        <label className="block font-semibold mb-1">Salary Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            name="minSalary"
            placeholder="Min Salary"
            value={formData.minSalary}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="maxSalary"
            placeholder="Max Salary"
            value={formData.maxSalary}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>
      {/* Skills */}
      <div>
        <label className="block font-semibold mb-1">Skills Required</label>
        <input
          type="text"
          name="skillsRequired"
          placeholder="Skills (comma separated)"
          value={formData.skillsRequired}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      {/* Experience Level */}
      <div>
        <label className="block font-semibold mb-1">Experience Level</label>
        <select
          name="experienceLevel"
          required
          value={formData.experienceLevel}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
          <option value="Lead">Lead</option>
        </select>
      </div>
      {/* Vacancies */}
      <div>
        <label className="block font-semibold mb-1">Number of Vacancies</label>
        <input
          type="number"
          name="vacancies"
          placeholder="Number of Vacancies"
          value={formData.vacancies}
          onChange={handleChange}
          required
          min={1}
          className="border p-2 rounded w-full"
        />
      </div>
      {/* Deadline */}
      <div>
        <label className="block font-semibold mb-1">Application Deadline</label>
        <input
          type="date"
          name="deadline"
          value={
            formData.deadline
              ? format(new Date(formData.deadline), "yyyy-MM-dd")
              : ""
          }
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      {/* Job Category */}
      <div>
        <label className="block font-semibold mb-1">Job Category</label>
        <input
          type="text"
          name="jobCategory"
          placeholder="Job Category"
          value={formData.jobCategory}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      {/* Education Required */}
      <div>
        <label className="block font-semibold mb-1">Education Required</label>
        <input
          type="text"
          name="educationRequired"
          placeholder="Education Required"
          value={formData.educationRequired}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      {/* Benefits */}
      <div>
        <label className="block font-semibold mb-1">Benefits</label>
        <input
          type="text"
          name="benefits"
          placeholder="Benefits (comma separated)"
          value={formData.benefits}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      {/* Remote Option */}
      <div>
        <label className="block font-semibold mb-1">Work Location</label>
        <select
          required
          name="remoteOption"
          value={formData.remoteOption}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="On-site">On-site</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>
      {/* Job Level */}
      <div>
        <label className="block font-semibold mb-1">Job Level</label>
        <select
          required
          name="jobLevel"
          value={formData.jobLevel}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="Internship">Internship</option>
          <option value="Entry-Level">Entry-Level</option>
          <option value="Mid-Level">Mid-Level</option>
          <option value="Senior-Level">Senior-Level</option>
          <option value="Director">Director</option>
          <option value="Executive">Executive</option>
        </select>
      </div>
      {/* Work Schedule */}
      <div>
        <label className="block font-semibold mb-1">Work Schedule</label>
        <select
          required
          name="workSchedule"
          value={formData.workSchedule}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="Day Shift">Day Shift</option>
          <option value="Night Shift">Night Shift</option>
          <option value="Flexible">Flexible</option>
          <option value="Rotational">Rotational</option>
        </select>
      </div>
      {/* Languages */}
      <div>
        <label className="block font-semibold mb-1">Languages Required</label>
        <input
          required
          type="text"
          name="languagesRequired"
          placeholder="Languages (comma separated)"
          value={formData.languagesRequired}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      {/* Application Method */}
      <div>
        <label className="block font-semibold mb-1">Application Method</label>
        <select
          name="applicationMethod"
          value={formData.applicationMethod}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="Easy Apply">Easy Apply</option>
          <option value="External Link">External Link</option>
          <option value="Email">Email</option>
        </select>
      </div>
      {/* status */}
      <div>
        <label className="block font-semibold mb-1">Application Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="Closed">Closed</option>
          <option value="Open">Open</option>
          <option value="Draft">Draft</option>
        </select>
      </div>
      {/* Company Perks */}
      <div>
        <label className="block font-semibold mb-1">Company Perks</label>
        <input
          type="text"
          name="companyPerks"
          placeholder="Company Perks (comma separated)"
          value={formData.companyPerks}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      {/* Posted By */}
      <div>
        <label className="block font-semibold mb-1">Posted By</label>
        <input
          type="text"
          name="postedBy"
          placeholder="HR / Recruiter Name"
          value={formData.postedBy}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        {initialData && initialData._id ? "Update Job" : "Create Job"}
      </button>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="bg-red-600 text-white px-4 py-2 rounded mt-4"
      >
        {initialData && initialData._id
          ? "Cancel Update Job"
          : "Cancel Create Job"}
      </button>
    </form>
  );
};

export default JobForm;
