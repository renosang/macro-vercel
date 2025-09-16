// src/app/admin/AdminTabs.tsx
"use client";

import { useState } from "react";
import BroadcastManagement from "./BroadcastManagement";
import MacroManagement from "./MacroManagement";
import UserManagement from "./UserManagement";
import CategoryManagement from "./CategoryManagement";

const tabs = [
  { name: "Danh mục", component: <CategoryManagement /> },
  { name: "Macro", component: <MacroManagement /> },
  { name: "Thành viên", component: <UserManagement /> },
  { name: "Thông báo", component: <BroadcastManagement /> },
];

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState("Danh mục");

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`
              py-2 px-4 text-sm font-medium focus:outline-none transition-colors duration-200
              ${
                activeTab === tab.name
                  ? "border-b-2 border-red-500 text-red-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {tabs.find((tab) => tab.name === activeTab)?.component}
      </div>
    </div>
  );
}