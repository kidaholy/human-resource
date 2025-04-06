"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaGraduationCap,
  FaBuilding,
  FaFileUpload,
} from "react-icons/fa"
import { useAuth } from "../context/authContext"

const ApplyJob = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [vacancy, setVacancy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    degree: "",
    institution: "",
    graduationYear: "",
    cgpa: "",
    experience: "",
    resume: null,
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/vacancies/${id}`)
        if (response.data.success) {
          setVacancy(response.data.vacancy)
        } else {
          // If API doesn't return success, use mock data
          setVacancy({
            _id: id,
            position: "Senior Lecturer",
            department: { _id: "dep1", dep_name: "Computer Science" },
            quantity: 2,
            salary: 50000,
            experience: "Minimum 5 years of teaching experience",
            eduLevel: "PhD in Computer Science or related field",
            endDate: "2023-12-31",
            status: "active",
            createdAt: "2023-05-15",
            description:
              "We are looking for a Senior Lecturer to join our Computer Science department. The ideal candidate will have extensive teaching experience and research background in computer science.",
          })
        }
      } catch (error) {
        console.error("Error fetching vacancy:", error)
        // Use mock data if API fails
        setVacancy({
          _id: id,
          position: "Senior Lecturer",
          department: { _id: "dep1", dep_name: "Computer Science" },
          quantity: 2,
          salary: 50000,
          experience: "Minimum 5 years of teaching experience",
          eduLevel: "PhD in Computer Science or related field",
          endDate: "2023-12-31",
          status: "active",
          createdAt: "2023-05-15",
          description:
            "We are looking for a Senior Lecturer to join our Computer Science department. The ideal candidate will have extensive teaching experience and research background in computer science.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVacancy()

    // Pre-fill form if user is logged in
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }))
    }
  }, [id, user])

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "resume" && files.length > 0) {
      setFormData({
        ...formData,
        resume: files[0],
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    // Required fields
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "dob",
      "gender",
      "degree",
      "institution",
      "graduationYear",
      "cgpa",
    ]

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} is required`
      }
    })

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    // CGPA validation
    if (formData.cgpa && (isNaN(formData.cgpa) || formData.cgpa < 0 || formData.cgpa > 4.0)) {
      errors.cgpa = "CGPA must be a number between 0 and 4.0"
    }

    // Graduation year validation
    if (formData.graduationYear) {
      const year = Number.parseInt(formData.graduationYear)
      const currentYear = new Date().getFullYear()
      if (isNaN(year) || year < 1950 || year > currentYear) {
        errors.graduationYear = `Graduation year must be between 1950 and ${currentYear}`
      }
    }

    // Resume validation
    if (!formData.resume) {
      errors.resume = "Resume is required"
    } else if (formData.resume.size > 5 * 1024 * 1024) {
      // 5MB limit
      errors.resume = "Resume file size must be less than 5MB"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setError("")

    try {
      // Create form data for file upload
      const submitData = new FormData()
      submitData.append("vacancyId", id)
      submitData.append("fullName", formData.fullName)
      submitData.append("email", formData.email)
      submitData.append("phone", formData.phone)
      submitData.append("dob", formData.dob)
      submitData.append("gender", formData.gender)
      submitData.append("degree", formData.degree)
      submitData.append("institution", formData.institution)
      submitData.append("graduationYear", formData.graduationYear)
      submitData.append("cgpa", formData.cgpa)
      submitData.append("experience", formData.experience)
      submitData.append("resume", formData.resume)

      // If user is not logged in, create account option
      if (!user && document.getElementById("createAccount").checked) {
        submitData.append("createAccount", true)
        submitData.append("password", document.getElementById("password").value)
      }

      const response = await axios.post("http://localhost:5000/api/applicants/apply", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(user ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}),
        },
      })

      if (response.data.success) {
        setSuccess(true)
        // If account was created, store token
        if (response.data.token) {
          localStorage.setItem("token", response.data.token)
        }
        // Scroll to top
        window.scrollTo(0, 0)
      }
    } catch (error) {
      console.error("Application submission error:", error)
      setError(error.response?.data?.error || "Failed to submit application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <img src="/wolkite.png" alt="Wolkite University" className="h-12 mr-3" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Wolkite University</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-800 hover:text-teal-600 font-medium">
                Home
              </Link>
              <Link to="/vacancies" className="text-gray-800 hover:text-teal-600 font-medium">
                Careers
              </Link>
              <Link to="/login" className="text-gray-800 hover:text-teal-600 font-medium">
                Login
              </Link>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Application Submitted!</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                  <svg
                    className="h-12 w-12 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
                <p className="text-gray-600 text-center mb-6">
                  Your application for <span className="font-semibold">{vacancy.position}</span> has been successfully
                  submitted.
                </p>
                <p className="text-gray-600 text-center mb-6">We will review your application and contact you soon.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/vacancies"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                  >
                    Browse More Jobs
                  </Link>
                  {user ? (
                    <Link
                      to="/applicant-dashboard"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-md transition-colors"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-md transition-colors"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/wolkite.png" alt="Wolkite University" className="h-12 mr-3" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Wolkite University</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-800 hover:text-teal-600 font-medium">
              Home
            </Link>
            <Link to="/vacancies" className="text-gray-800 hover:text-teal-600 font-medium">
              Careers
            </Link>
            <Link to="/register" className="text-gray-800 hover:text-teal-600 font-medium">
              Register
            </Link>
            <Link to="/login" className="text-gray-800 hover:text-teal-600 font-medium">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/vacancies" className="inline-flex items-center text-teal-600 hover:text-teal-700">
            <FaArrowLeft className="mr-2" /> Back to Vacancies
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
              <div className="bg-teal-600 p-6 text-white">
                <h2 className="text-xl font-bold">Job Details</h2>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{vacancy.position}</h3>
                <p className="text-teal-600 font-medium mb-4">{vacancy.department.dep_name} Department</p>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">POSITIONS</h4>
                    <p className="text-gray-800">{vacancy.quantity}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">SALARY</h4>
                    <p className="text-gray-800">{formatCurrency(vacancy.salary)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">REQUIRED EDUCATION</h4>
                    <p className="text-gray-800">{vacancy.eduLevel}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">REQUIRED EXPERIENCE</h4>
                    <p className="text-gray-800">{vacancy.experience}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">APPLICATION DEADLINE</h4>
                    <p className="text-gray-800">{new Date(vacancy.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">JOB DESCRIPTION</h4>
                  <p className="text-gray-800">{vacancy.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-teal-600 p-6 text-white">
                <h2 className="text-xl font-bold">Application Form</h2>
                <p className="mt-2">Fill out the form below to apply for this position</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          formErrors.fullName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {formErrors.fullName && <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          formErrors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          formErrors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          formErrors.dob ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {formErrors.dob && <p className="mt-1 text-sm text-red-600">{formErrors.dob}</p>}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`py-2 px-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.gender ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {formErrors.gender && <p className="mt-1 text-sm text-red-600">{formErrors.gender}</p>}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-4">Education</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                      Highest Degree *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaGraduationCap className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="degree"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          formErrors.degree ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g., PhD in Computer Science"
                      />
                    </div>
                    {formErrors.degree && <p className="mt-1 text-sm text-red-600">{formErrors.degree}</p>}
                  </div>

                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                      Institution *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaBuilding className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          formErrors.institution ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g., Harvard University"
                      />
                    </div>
                    {formErrors.institution && <p className="mt-1 text-sm text-red-600">{formErrors.institution}</p>}
                  </div>

                  <div>
                    <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                      Graduation Year *
                    </label>
                    <input
                      type="number"
                      id="graduationYear"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className={`py-2 px-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.graduationYear ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., 2020"
                    />
                    {formErrors.graduationYear && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.graduationYear}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 mb-1">
                      CGPA *
                    </label>
                    <input
                      type="number"
                      id="cgpa"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      max="4.0"
                      className={`py-2 px-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        formErrors.cgpa ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., 3.5"
                    />
                    {formErrors.cgpa && <p className="mt-1 text-sm text-red-600">{formErrors.cgpa}</p>}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-4">Experience</h3>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Relevant Experience
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows="4"
                    className="py-2 px-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Describe your relevant work experience"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                    Resume/CV (PDF) *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="resume"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="resume"
                            name="resume"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={handleChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                    </div>
                  </div>
                  {formData.resume && (
                    <p className="mt-2 text-sm text-gray-600">Selected file: {formData.resume.name}</p>
                  )}
                  {formErrors.resume && <p className="mt-1 text-sm text-red-600">{formErrors.resume}</p>}
                </div>

                {/* Account Creation Option (for non-logged in users) */}
                {!user && (
                  <div className="border-t pt-4 mt-6">
                    <div className="flex items-center mb-4">
                      <input
                        id="createAccount"
                        type="checkbox"
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="createAccount" className="ml-2 block text-sm text-gray-700">
                        Create an account to track your application status
                      </label>
                    </div>

                    <div id="accountFields" className="space-y-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="py-2 px-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Create a password"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting Application...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/wolkite.png" alt="Wolkite University" className="h-10 mr-3" />
              <h3 className="text-xl font-bold">Wolkite University</h3>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© {new Date().getFullYear()} Wolkite University. All rights reserved.</p>
              <p className="text-sm text-gray-500 mt-1">Human Resource Management System</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ApplyJob

