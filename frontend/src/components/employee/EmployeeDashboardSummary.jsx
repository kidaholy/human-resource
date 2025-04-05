import SummaryCard from "../dashboard/SummaryCard"
import { FaCalendarCheck, FaCalendarTimes, FaCalendarWeek, FaMoneyBillWave, FaUserClock } from "react-icons/fa"

const EmployeeDashboardSummary = () => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Employee Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard icon={<FaUserClock />} text="Working Days" number={22} color="bg-teal-600" />
        <SummaryCard icon={<FaMoneyBillWave />} text="Current Salary" number={"$3,500"} color="bg-green-600" />
        <SummaryCard icon={<FaCalendarWeek />} text="Leave Balance" number={15} color="bg-blue-600" />
      </div>

      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold">Leave Status</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SummaryCard icon={<FaCalendarCheck />} text="Approved Leaves" number={3} color="bg-green-600" />
          <SummaryCard icon={<FaCalendarTimes />} text="Rejected Leaves" number={1} color="bg-red-600" />
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow">
        <h4 className="text-xl font-bold mb-4">Recent Notifications</h4>
        <div className="space-y-4">
          <div className="border-l-4 border-teal-500 pl-4 py-2">
            <p className="font-medium">Salary Credited</p>
            <p className="text-sm text-gray-600">Your salary for May 2023 has been credited to your account.</p>
            <p className="text-xs text-gray-500 mt-1">2 days ago</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="font-medium">Leave Approved</p>
            <p className="text-sm text-gray-600">Your leave request for June 10-12 has been approved.</p>
            <p className="text-xs text-gray-500 mt-1">1 week ago</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <p className="font-medium">Department Meeting</p>
            <p className="text-sm text-gray-600">Reminder: Department meeting scheduled for tomorrow at 10:00 AM.</p>
            <p className="text-xs text-gray-500 mt-1">Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboardSummary

