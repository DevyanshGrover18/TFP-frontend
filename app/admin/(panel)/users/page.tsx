const users = [
  { name: "Aarav Mehta", email: "aarav@example.com", status: "Active" },
  { name: "Sara Khan", email: "sara@example.com", status: "Pending" },
  { name: "Riya Sharma", email: "riya@example.com", status: "Active" },
];

export default function UsersPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
          Users
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Users</h1>
        <p className="mt-2 text-sm text-gray-500">
          User management placeholder for the admin panel.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-5 py-4 font-medium">Name</th>
              <th className="px-5 py-4 font-medium">Email</th>
              <th className="px-5 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-t border-gray-100">
                <td className="px-5 py-4 font-medium text-gray-900">{user.name}</td>
                <td className="px-5 py-4 text-gray-600">{user.email}</td>
                <td className="px-5 py-4 text-gray-600">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
