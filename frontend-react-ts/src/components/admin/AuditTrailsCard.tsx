import { FileSearch } from "lucide-react";

export default function AuditTrailsCard() {
  return (
    <div className="bg-white rounded shadow-md p-6 w-full max-w-4xl mx-auto font-nunito">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800">Audit Trails</h2>
        </div>
        <div>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none">
            <option>SITES</option>
            {/* Add other site options as needed */}
          </select>
        </div>
      </div>

      <div className="overflow-auto h-[370px] rounded border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800">
            <tr className="border-t">
              <td className="px-4 py-3">Tara Kape Proposal</td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded">
                  Not seen yet
                </span>
              </td>
              <td className="px-4 py-3">28/04/2025</td>
              <td className="px-4 py-3">10:40 pm</td>
            </tr>
            
            
            
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
