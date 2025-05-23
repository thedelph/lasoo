import { useState } from "react";
import { MapPin, Clock, Briefcase, Building, Settings } from "lucide-react";
import CompanyDetailsTab from "./tabs/CompanyDetailsTab";
import ServiceAreaTab from "./tabs/ServiceAreaTab";
import WorkingHoursTab from "./tabs/WorkingHoursTab";
import ServicesAndPricesTab from "./tabs/ServicesAndPricesTab";
import AccountSettingsTab from "./tabs/AccountSettingsTab";

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("company");

  const tabs = [
    {
      id: "company",
      label: "Company Details",
      icon: <Building className="h-4 w-4" />,
      component: <CompanyDetailsTab />
    },
    {
      id: "service",
      label: "Service Area",
      icon: <MapPin className="h-4 w-4" />,
      component: <ServiceAreaTab />
    },
    {
      id: "hours",
      label: "Working Hours",
      icon: <Clock className="h-4 w-4" />,
      component: <WorkingHoursTab />
    },
    {
      id: "prices",
      label: "Services & Prices",
      icon: <Briefcase className="h-4 w-4" />,
      component: <ServicesAndPricesTab />
    },
    {
      id: "settings",
      label: "Account Settings",
      icon: <Settings className="h-4 w-4" />,
      component: <AccountSettingsTab />
    }
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="mb-6 border-b">
        <div className="flex flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
}