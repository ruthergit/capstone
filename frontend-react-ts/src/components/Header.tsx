import Notification from '../assets/images/component-img/notification-icon.svg?react';

type DashboardHeaderProps = {
  title: string;
};

const DashboardHeader = ({title}: DashboardHeaderProps) => {
  return (
    <div className="border-b border-border px-6 h-14 font-nunito flex justify-between items-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      <button className='px-3'>
        <Notification className='w-4'/>
      </button>
    </div>
  )
}

export default DashboardHeader
