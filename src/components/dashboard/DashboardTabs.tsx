import { useState } from "react";
import CompanyDetailsTab from "./tabs/CompanyDetailsTab";
import ServiceAreaTab from "./tabs/ServiceAreaTab";
import WorkingHoursTab from "./tabs/WorkingHoursTab";
import ServicesAndPricesTab from "./tabs/ServicesAndPricesTab";

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="w-full">
      <div className="tabs tabs-boxed justify-center mb-6">
        <button
          className={`tab ${activeTab === "company" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("company")}
        >
          Company Details
        </button>
        <button
          className={`tab ${activeTab === "service" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("service")}
        >
          Service Area
        </button>
        <button
          className={`tab ${activeTab === "hours" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("hours")}
        >
          Working Hours
        </button>
        <button
          className={`tab ${activeTab === "prices" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("prices")}
        >
          Services & Prices
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {activeTab === "company" && <CompanyDetailsTab />}
          {activeTab === "service" && <ServiceAreaTab />}
          {activeTab === "hours" && <WorkingHoursTab />}
          {activeTab === "prices" && <ServicesAndPricesTab />}
        </div>
      </div>
    </div>
  );
}