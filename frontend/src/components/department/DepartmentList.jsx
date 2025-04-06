"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import DataTable from "react-data-table-component"
import { DepartmentButtons } from "../../utils/DepartmentHelper"
import axios from "axios"
import { FaBuilding, FaSearch, FaPlus, FaUserTie } from "react-icons/fa"

const DepartmentList = () => {
  const [departments, setDepartments] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const onDepartmentDelete = async (id) => {
    const data = departments.filter((dep) => dep._id !== id)
    setDepartments(data)
    setFilteredDepartments(data.filter((dep) => dep.dep_name.toLowerCase().includes(searchTerm.toLowerCase())))
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:5000/api/departments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (response.data.success) {
          let sno = 1
          const data = await response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            description: dep.description || "No description provided",
            departmentHead: dep.departmentHead
              ? dep.departmentHead.userId
                ? `${dep.departmentHead.userId.name}`
                : "Not Assigned"
              : "Not Assigned",
            departmentHeadEmail: dep.departmentHead?.userId?.email || "",
            action: <DepartmentButtons _id={dep._id} onDepartmentDelete={onDepartmentDelete} />,
          }))
          setDepartments(data)
          setFilteredDepartments(data)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          console.log(error.response.data.error)
          setError("Failed to load departments. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)
    const filtered = departments.filter(
      (dep) => dep.dep_name.toLowerCase().includes(value) || dep.departmentHead.toLowerCase().includes(value),
    )
    setFilteredDepartments(filtered)
  }

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f9fafb",
        borderRadius: "0.5rem 0.5rem 0 0",
      },
    },
    headCells: {
      style: {
        fontSize: "0.875rem",
        fontWeight: "600",
        color: "#374151",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        fontSize: "0.875rem",
        fontWeight: "400",
        color: "#1f2937",
        backgroundColor: "white",
        minHeight: "60px",
        "&:not(:last-of-type)": {
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          borderBottomColor: "#e5e7eb",
        },
        "&:hover": {
          backgroundColor: "#f9fafb",
        },
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    pagination: {
      style: {
        borderRadius: "0 0 0.5rem 0.5rem",
        backgroundColor: "white",
      },
    },
  }

  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      width: "70px",
      sortable: true,
    },
    {
      name: "Department Name",
      selector: (row) => row.dep_name,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center py-2">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
            <FaBuilding className="text-teal-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.dep_name}</div>
            <div className="text-xs text-gray-500 max-w-xs truncate">{row.description}</div>
          </div>
        </div>
      ),
      grow: 2,
    },
    {
      name: "Department Head",
      selector: (row) => row.departmentHead,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          {row.departmentHead !== "Not Assigned" ? (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <FaUserTie className="text-blue-600" />
              </div>
              <div>
                <div className="font-medium">{row.departmentHead}</div>
                {row.departmentHeadEmail && <div className="text-xs text-gray-500">{row.departmentHeadEmail}</div>}
              </div>
            </div>
          ) : (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              Not Assigned
            </span>
          )}
        </div>
      ),
      grow: 2,
    },
    {
      name: "Action",
      selector: (row) => row.action,
      center: true,
    },
  ]

  const EmptyTable = () => (
    <div className="flex flex-col items-center justify-center p-8">
      <FaBuilding className="text-gray-300 text-5xl mb-4" />
      <p className="text-gray-500 text-lg font-medium mb-2">No Departments Found</p>
      <p className="text-gray-400 mb-4 text-center">
        {searchTerm ? "Try adjusting your search term" : "Add your first department to get started"}
      </p>
      {!searchTerm && (
        <Link
          to="/admin-dashboard/add-department"
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" /> Add Department
        </Link>
      )}
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Departments</h2>
        <p className="text-gray-600">Create and manage university departments and their leadership</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search departments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              onChange={handleSearch}
            />
          </div>
          <Link
            to="/admin-dashboard/add-department"
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center whitespace-nowrap"
          >
            <FaPlus className="mr-2" /> Add New Department
          </Link>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredDepartments}
            pagination
            highlightOnHover
            responsive
            customStyles={customStyles}
            noDataComponent={<EmptyTable />}
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
          />
        )}
      </div>
    </div>
  )
}

export default DepartmentList

