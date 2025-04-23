const SummaryCard = ({ icon, text, number, color = "bg-primary-600", trend = null }) => {
  return (
    <div className="card overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row h-full">
        <div className={`text-3xl flex justify-center items-center ${color} text-white p-4 sm:p-6`}>{icon}</div>
        <div className="flex-1 p-4 flex flex-col justify-center items-center sm:items-start">
          <p className="text-sm font-medium text-gray-500 mb-1">{text}</p>
          <div className="flex items-center">
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{number}</p>

            {trend && (
              <span
                className={`ml-2 text-xs font-medium flex items-center ${
                  trend.direction === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.direction === "up" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard
