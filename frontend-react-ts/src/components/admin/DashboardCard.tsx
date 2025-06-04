import { DollarSign } from "lucide-react";

interface DashboardCardProps {
  title: string
  value: string
  change: string
  icon?: React.ReactNode
}

export default function DashboardCard({
  title,
  value,
  change,
  icon = <DollarSign className="h-4 w-4 text-gray-400" />
}: DashboardCardProps) {
  return (  
    <div className="bg-white font-nunito text-white rounded p-6 shadow-md w-full max-w-xs">
      <div className="flex items-center justify-between text-sm text-font-color">
        <span>{title}</span>
        {icon}
      </div>
      <div className="mt-2 text-2xl font-bold text-black">{value}</div>
      <div className="mt-1 text-sm text-green">{change}</div>
      {/* <div className="text-xs text-gray-500">{changeDescription}</div> */}
    </div>
  )
}
