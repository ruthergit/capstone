import Header from "../../components/Header";
import Calendar from "../../components/ui/Calendar";
const SchoolEvents = () => {
  return (
    <div className="bg-bg w-full">
      <Header title="School Events" />
      <div className="px-6 py-6">
        <div className="max-w-4xl">
          <Calendar/>
        </div>
        
      </div>
    </div>
  )
}

export default SchoolEvents
