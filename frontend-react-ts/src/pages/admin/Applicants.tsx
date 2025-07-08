import Header from "../../components/Header";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { FileUser } from "lucide-react";
import { useState, useEffect } from "react";
import { getApplicant, type Applicant } from "../../services/scholarship";

const Documents = () => {
  dayjs.extend(advancedFormat);
  dayjs.extend(utc);
  const [applicants, setApplicantList] = useState<Applicant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApplicant();
        setApplicantList(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  });

  return (
    <div className="bg-bg w-full">
      <Header title="Applicants" />

      <div className="bg-white  rounded shadow-md p-6 w-full max-w-4xl m-6 font-nunito">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileUser className="mb-1 w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">
              Scholarship Applicants
            </h2>
          </div>
        </div>

        <div className="overflow-auto h-[370px] rounded border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">File</th>
                <th className="px-4 py-2 font-medium">Date & Time</th>
              </tr>
            </thead>
            {applicants.map((applicant) => (
              <tbody key={applicant.id} className="bg-white text-gray-800">
                <tr className="border-t">
                  <td className="px-4 py-3">{applicant.user_name}</td>
                  <td className="px-4 py-3">{applicant.user_email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded cursor-pointer">
                      {applicant.original_name}
                    </span>
                  </td>
                  <td className="px-4 py-3"> {dayjs.utc(applicant.created_at).local().format('MMMM D, YYYY h:mm A')}</td>
                </tr>

                {/* Add more rows as needed */}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;
