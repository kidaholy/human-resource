"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/authContext"

const RequestVacancy = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [departmentId, setDepartmentId] = useState("")

  // For debugging user info
  useEffect(() => {
    console.log("Current user:", user);
  }, [user]);

  const [formData, setFormData] = useState({
    position: "",
    quantity: 1,
    salary: "",
    experience: "",
    eduLevel: "Bachelor's Degree",
    endDate: "",
    gender: "any",
    description: "",
    justification: "",
    cgpa: "",
  })

  useEffect(() => {
    // Get department ID for the department head
    const fetchDepartmentId = async () => {
      try {
        // Make sure we have the user ID
        const userId = user?._id || user?.id;
        if (!userId) {
          setError("User information is missing. Please log in again.");
          return;
        }

        console.log("Fetching department ID for user:", userId);
        
        // Fixed API endpoint to get employee information
        const response = await axios.get(`http://localhost:5000/api/employees/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log("Employee response:", response.data);
        
        if (response.data?.success && response.data.employee?.department?._id) {
          setDepartmentId(response.data.employee.department._id);
          console.log("Department ID set:", response.data.employee.department._id);
        } else {
          setError("Could not find your department. Please contact an administrator.");
        }
      } catch (error) {
        console.error("Error fetching department:", error);
        setError("Failed to fetch your department information. Please try again later.");
      }
    };

    if (user) {
      fetchDepartmentId();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const userId = user?._id || user?.id;
      if (!userId) {
        setError("User information is missing. Please log in again.");
        setLoading(false);
        return;
      }

      if (!departmentId) {
        setError("Department information is missing. Please refresh the page or contact an administrator.");
        setLoading(false);
        return;
      }

      // Format the data to match what the backend expects
      const requestData = {
        position: formData.position,
        department: departmentId,
        quantity: parseInt(formData.quantity),
        salary: parseInt(formData.salary),
        experience: formData.experience,
        eduLevel: formData.eduLevel,
        endDate: formData.endDate,
        gender: formData.gender,
        description: formData.description,
        justification: formData.justification,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : undefined,
        requestedBy: userId
      }

      // Check if all required fields are present
      if (!requestData.position || !requestData.department || !requestData.quantity || 
          !requestData.salary || !requestData.experience || !requestData.eduLevel || 
          !requestData.endDate || !requestData.description || !requestData.justification) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      console.log("Submitting vacancy request:", requestData);
      
      // Get the token
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setLoading(false);
        return;
      }
      
      // Correct API endpoint
      const response = await axios.post("http://localhost:5000/api/vacancies/request", requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Response:", response.data);
      setSuccess(true);
      setLoading(false);

      // Redirect to vacancy requests list after 2 seconds
      setTimeout(() => {
        navigate("/department-head-dashboard/my-vacancy-requests");
      }, 2000);
    } catch (err) {
      setLoading(false);
      console.error("Vacancy submission error:", err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        "Failed to submit vacancy request. Please check your connection and try again."
      );
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Request New Position</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Why Request a New Position?</h3>
        <p className="text-blue-700">
          Use this form to request a new position when your department needs additional staff. Provide a detailed
          justification explaining why this role is necessary for your department's operations.
        </p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {success ? (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          Your vacancy request has been submitted successfully! It will be reviewed by HR. Redirecting to your vacancy
          requests...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position Title*</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., Senior Software Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary (Annual)*</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., 80000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level*</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Select Experience Level</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level*</label>
              <select
                name="eduLevel"
                value={formData.eduLevel}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="High School">High School</option>
                <option value="Associate Degree">Associate Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Positions*</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline*</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender Preference</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum CGPA (Optional)</label>
              <input
                type="number"
                name="cgpa"
                value={formData.cgpa || ""}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., 3.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Provide a detailed description of the position, including responsibilities, requirements, and any other relevant information..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Justification for New Position*</label>
            <div className="mb-2 text-sm text-gray-500">
              Explain why this position is necessary. Consider including:
              <ul className="list-disc ml-5 mt-1">
                <li>Current workload challenges</li>
                <li>Department growth or changes</li>
                <li>New projects or initiatives requiring additional staff</li>
                <li>Impact on department performance if position is not filled</li>
              </ul>
            </div>
            <textarea
              name="justification"
              value={formData.justification}
              onChange={handleChange}
              required
              rows={5}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Provide a detailed justification for why this position is needed..."
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/department-head-dashboard")}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default RequestVacancy

