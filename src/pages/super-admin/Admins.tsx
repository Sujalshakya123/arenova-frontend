import { FiShield } from "react-icons/fi";
import { platformAdmins } from "./adminData";

const roleStyle: Record<string, string> = {
  Owner: "bg-blue-50 text-blue-700",
  Admin: "bg-violet-50 text-violet-700",
  Support: "bg-emerald-50 text-emerald-700",
};

const Admins = () => (
  <div className="space-y-6">
    <p className="text-sm text-gray-700">
      Super admin accounts on this demo. Creating or inviting admins will need a
      backend API later.
    </p>

    <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead className="bg-gray-50 text-left text-gray-700">
          <tr>
            <th className="px-5 py-3 font-medium">Admin</th>
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Last active</th>
          </tr>
        </thead>
        <tbody>
          {platformAdmins.map((admin) => (
            <tr key={admin.id} className="border-t border-gray-100">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${admin.avatarColor}`}
                  >
                    {admin.initials}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{admin.name}</p>
                    <p className="text-gray-700 text-sm">{admin.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${roleStyle[admin.role]}`}
                >
                  <FiShield size={12} />
                  {admin.role}
                </span>
              </td>
              <td className="px-5 py-4 text-gray-700">{admin.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Admins;
