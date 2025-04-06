import Layout from "../components/layout/Layout"
import RequestVacancy from "../components/vacancy/RequestVacancy"
import DepartmentVacancyRequests from "../components/vacancy/DepartmentVacancyRequests"
import { Route } from "react-router-dom"

function DepartmentHeadDashboard() {
  return (
    <Layout>
      <Route path="/request-vacancy" element={<RequestVacancy />} />
      <Route path="/my-vacancy-requests" element={<DepartmentVacancyRequests />} />
    </Layout>
  )
}

export default DepartmentHeadDashboard

