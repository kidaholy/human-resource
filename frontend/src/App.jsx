import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/authContext.jsx"
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
import DepartmentEmployeeProfile from "./components/employee/DepartmentEmployeeProfile"
import Welcome from "./pages/Welcome.jsx"
import PublicVacancies from "./pages/PublicVacancies.jsx"
import ApplicantRegistration from "./pages/ApplicantRegistration.jsx"
import ApplyJob from "./pages/ApplyJob.jsx"
import ApplicantDashboard from "./pages/ApplicantDashboard.jsx"
import ManageApplicants from "./components/applicant/ManageApplicants.jsx"
import ApplicantDetails from "./components/applicant/ApplicantDetails.jsx"
import EditApplicant from "./components/applicant/EditApplicant.jsx"
import RequestVacancy from "./components/vacancy/RequestVacancy.jsx"
import ManageVacancyRequests from "./components/vacancy/ManageVacancyRequests.jsx"
import DepartmentVacancyRequests from "./components/vacancy/DepartmentVacancyRequests.jsx"
import VacancyDetails from "./components/vacancy/VacancyDetails.jsx"
import EditVacancy from "./components/vacancy/EditVacancy.jsx"
import EmployeeSalaryHistory from "./components/salary/EmployeeSalaryHistory.jsx"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/vacancies" element={<PublicVacancies />}></Route>
          <Route path="/register" element={<ApplicantRegistration />}></Route>
          <Route path="/apply/:id" element={<ApplyJob />}></Route>

          {/* Applicant Routes */}
          <Route
            path="/applicant-dashboard"
            element={
              <PrivateRoutes>
                <RoleBasedRoutes requiredRole={["applicant"]}>
                  <ApplicantDashboard />
                </RoleBasedRoutes>
              </PrivateRoutes>
            }
          ></Route>

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
            <Route path="/admin-dashboard/vacancy/:id" element={<VacancyDetails />}></Route>
            <Route path="/admin-dashboard/edit-vacancy/:id" element={<EditVacancy />}></Route>
            <Route path="/admin-dashboard/applicants" element={<ManageApplicants />}></Route>
            <Route path="/admin-dashboard/applicants/:id" element={<ApplicantDetails />}></Route>
            <Route path="/admin-dashboard/edit-applicant/:id" element={<EditApplicant />}></Route>
            <Route path="/admin-dashboard/vacancy-requests" element={<ManageVacancyRequests />}></Route>
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
            <Route path="/department-head-dashboard/employee/:id" element={<DepartmentEmployeeProfile />}></Route>
            <Route path="/department-head-dashboard/request-vacancy" element={<RequestVacancy />}></Route>
            <Route
              path="/department-head-dashboard/my-vacancy-requests"
              element={<DepartmentVacancyRequests />}
            ></Route>
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
            <Route path="/employee-dashboard/salary" element={<EmployeeSalaryHistory />}></Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
