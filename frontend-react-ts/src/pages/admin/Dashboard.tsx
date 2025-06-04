import Header from "../../components/Header";
import DashboardCard from "../../components/admin/DashboardCard";
import { FilePlus, Hourglass, Users, CalendarClock } from "lucide-react";
import AuditTrailsCard from "../../components/admin/AuditTrailsCard";

const AdminDashboard = () => {
  return (
    <div className="bg-bg w-full">
      <Header title="Dashboard" />
      <div className="px-6 py-6 flex gap-5 ">
        <DashboardCard
          title="New Proposals"
          value="4"
          change="Tara Kape Proposal"
          icon={<FilePlus className="h-4 w-4 text-gray-400" />}
        />
        <DashboardCard
          title="Pending Approvals"
          value="3"
          change="CCS Capade"
          icon={<Hourglass className="h-4 w-4 text-gray-400" />}
        />
        <DashboardCard
          title="New Applicants"
          value="2"
          change="John Doe"
          icon={<Users className="h-4 w-4 text-gray-400" />}
        />
        <DashboardCard
          title="Upcoming Events"
          value="5"
          change="COE Event"
          icon={<CalendarClock className="h-4 w-4 text-gray-400" />}
        />
      </div>
      <div className=" px-6 flex gap-5">
        <AuditTrailsCard />
        <div className="w-1/4 h-[480px] overflow-auto p-4 bg-white rounded shadow-md">
          <h1>
            Lorem ipsum dolor sit amet fd fd consectetur adipisicing elit.
            Officiis unde distinctio esse commodi rem aspernatur sunt
            blanditiis, possimus corrupti totam quo. Facere, soluta saepe
            molestias recusandae provident voluptatem non sint! Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Ipsa quam, asperiores
            reiciendis, pariatur saepe, temporibus repellendus expedita cumque
            hic quia reprehenderit dolores. Ad mollitia maiores architecto quas!
            Rerum, vel eaque?Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Dolorum, totam. Accusantium, qui vel maiores fuga dolorem
            voluptatibus at molestiae saepe repellat sed nesciunt veniam ullam
            molestias voluptatem eaque. Laboriosam, quisquam?
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
