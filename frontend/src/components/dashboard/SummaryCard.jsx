const SummaryCard = ({ icon, text, number, color = "bg-primary-600" }) => {
  return (
    <div className="card overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row">
        <div className={`text-3xl flex justify-center items-center ${color} text-white p-4 sm:p-6`}>{icon}</div>
        <div className="flex-1 p-4 flex flex-col justify-center items-center sm:items-start">
          <p className="text-sm font-medium text-gray-500">{text}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{number}</p>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard

