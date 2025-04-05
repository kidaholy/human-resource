import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx"
import DepartmentHeadDashboard from "./pages/DepartmentHeadDashboard.jsx"
import PrivateRoutes from "./utils/PrivateRoutes.jsx"
import RoleBasedRoutes from "./utils/RoleBasedRoutes.jsx"
import AdminSummary from "./components/dashboard/AdminSummary.jsx"
import DepartmentList from "./components/department/DepartmentList.jsx"
import AddDepartment from "./components/department/AddDepartment.jsx"
import EditDepartment from "./components/department/EditDepartment.jsx"
import List from "./components/employee/List.jsx"
import Add from "./components/employee/Add.jsx"
import View from "./components/employee/View.jsx"
import Edit from "./components/employee/Edit.jsx"
import AddSalary from "./components/salary/AddSalary.jsx"
import ViewSalary from "./components/salary/ViewSalary.jsx"
import RequestLeave from "./components/leave/RequestLeave.jsx"
import LeaveHistory from "./components/leave/LeaveHistory.jsx"
import ManageLeave from "./components/leave/ManageLeave.jsx"
import DepartmentHeadLeaveManagement from "./components/leave/DepartmentHeadLeaveManagement.jsx"
import EmployeeProfile from "./components/employee/EmployeeProfile.jsx"
import EmployeeDashboardSummary from "./components/employee/EmployeeDashboardSummary.jsx"
import DepartmentHeadSummary from "./components/dashboard/DepartmentHeadSummary.jsx"
import JobVacancyList from "./components/vacancy/JobVacancyList.jsx"
import AddVacancy from "./components/vacancy/AddVacancy.jsx"
import DepartmentEmployeeList from "./components/department/DepartmentEmployeeList.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}></Route>
        <Route path="/login" element={<Login />}></Route>

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />}></Route>
          <Route path="/admin-dashboard/departments" element={<DepartmentList />}></Route>
          <Route path="/admin-dashboard/add-department" element={<AddDepartment />}></Route>
          <Route path="/admin-dashboard/department/:id" element={<EditDepartment />}></Route>
          <Route path="/admin-dashboard/employees" element={<List />}></Route>
          <Route path="/admin-dashboard/add-employee" element={<Add />}></Route>
          <Route path="/admin-dashboard/employees/:id" element={<View />}></Route>
          <Route path="/admin-dashboard/employees/edit/:id" element={<Edit />}></Route>
          <Route path="/admin-dashboard/salary/add" element={<AddSalary />}></Route>
          <Route path="/admin-dashboard/employees/salary/:id" element={<ViewSalary />}></Route>
          <Route path="/admin-dashboard/leave" element={<ManageLeave />}></Route>
          <Route path="/admin-dashboard/vacancies" element={<JobVacancyList />}></Route>
          <Route path="/admin-dashboard/add-vacancy" element={<AddVacancy />}></Route>
        </Route>

        {/* Department Head Routes */}
        <Route
          path="/department-head-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={["department_head"]}>
                <DepartmentHeadDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<DepartmentHeadSummary />}></Route>
          <Route path="/department-head-dashboard/leave-requests" element={<DepartmentHeadLeaveManagement />}></Route>
          <Route path="/department-head-dashboard/profile" element={<EmployeeProfile />}></Route>
          <Route path="/department-head-dashboard/request-leave" element={<RequestLeave />}></Route>
          <Route path="/department-head-dashboard/leave-history" element={<LeaveHistory />}></Route>
          <Route path="/department-head-dashboard/department-employees" element={<DepartmentEmployeeList />}></Route>
        </Route>

        {/* Employee Routes */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeDashboardSummary />}></Route>
          <Route path="/employee-dashboard/profile" element={<EmployeeProfile />}></Route>
          <Route path="/employee-dashboard/request-leave" element={<RequestLeave />}></Route>
          <Route path="/employee-dashboard/leave-history" element={<LeaveHistory />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

