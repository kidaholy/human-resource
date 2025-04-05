"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import DataTable from "react-data-table-component"
import { DepartmentButtons } from "../../utils/DepartmentHelper"
import axios from "axios"

const DepartmentList = () => {
  const [departments, setDepartments] = useState([])
  const [depLoading, setDepLoading] = useState(false)
  const [filteredDepartments, setFilterDepartments] = useState([])

  const onDepartmentDelete = async (id) => {
    const data = departments.filter((dep) => dep._id !== id)
    setDepartments(data)
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true)
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
            departmentHead: dep.departmentHead
              ? dep.departmentHead.userId
                ? dep.departmentHead.userId.name
                : "Not Assigned"
              : "Not Assigned",
            action: <DepartmentButtons _id={dep._id} onDepartmentDelete={onDepartmentDelete} />,
          }))
          setDepartments(data)
          setFilterDepartments(data)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          console.log(error.response.data.error)
        }
      } finally {
        setDepLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const filterDepartments = (e) => {
    const records = departments.filter((dep) => dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase()))
    setFilterDepartments(records)
  }

  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      width: "70px",
    },
    {
      name: "Department Name",
      selector: (row) => row.dep_name,
      sortable: true,
    },
    {
      name: "Department Head",
      selector: (row) => row.departmentHead,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => row.action,
    },
  ]

  return (
    <>
      {depLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-5">
          <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Departments</h3>
          </div>
          <div className="flex justify-between items-center">
            <input type="text" placeholder="Search by dep name" className="px-4 py-0.5" onChange={filterDepartments} />
            <Link to="/admin-dashboard/add-department" className="px-4 py-1 bg-teal-600 rounded text-white">
              Add New Department
            </Link>
          </div>
          <div className="mt-5">
            <DataTable columns={columns} data={filteredDepartments} pagination />
          </div>
        </div>
      )}
    </>
  )
}

export default DepartmentList

