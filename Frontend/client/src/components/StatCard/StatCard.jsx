function StatCard({ title, value, icon }) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-green-200 hover:-translate-y-2">
      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
        {icon}
      </div>

      {/* Value */}
      <h4 className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
        {value}
      </h4>

      {/* Title */}
      <p className="text-gray-600 font-medium">{title}</p>

      {/* Decorative line */}
      <div className="mt-4 w-12 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}

export default StatCard;
