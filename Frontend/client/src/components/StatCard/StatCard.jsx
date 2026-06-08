function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <h4>{value}</h4>
      <p>{title}</p>
    </div>
  );
}

export default StatCard;