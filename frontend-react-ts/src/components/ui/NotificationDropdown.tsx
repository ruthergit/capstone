import { useState, useRef, useEffect } from "react";
import { type Notification } from "../../types/notification";

type NotificationDropdownProps = {
  notifications: Notification[];
  onItemClick?: (id: string) => void;
  icon: React.ReactNode;
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onItemClick,
  icon,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        {icon}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => onItemClick?.(String(n.id))}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex flex-col border-b last:border-0"
                >
                  <span className="text-sm text-gray-800">{n.message}</span>
                  <span className="text-xs text-gray-500">{n.time}</span>
                </li>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                No notifications
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
