import { useEffect } from "react";
import NotificationDropdown from "./ui/NotificationDropdown";
import NotificationIcon from "../assets/images/component-img/notification-icon.svg?react";
import { useNotificationStore } from "../store/useNotificationStore";
import { useUserStore } from "../store/useUserStore";

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const applicantId = useUserStore((s) => s.user?.applicant_id); 
  const { notifications, fetch, markOneAsRead } = useNotificationStore();

  // Fetch notifications when header mounts
  useEffect(() => {
    if (applicantId) fetch(applicantId);
  }, [applicantId, fetch]);

  const handleItemClick = async (id: string) => {
    if (!applicantId) return;
    await markOneAsRead(applicantId, id);
  };

  return (
    <div className="border-b border-border px-6 h-14 font-nunito flex justify-between items-center">
      <h1 className="text-xl font-semibold">{title}</h1>

      <NotificationDropdown
        notifications={notifications}
        onItemClick={handleItemClick}
        icon={<NotificationIcon className="w-5 h-5" />}
      />
    </div>
  );
};

export default Header;
