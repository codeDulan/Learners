import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for the chart
const sessionData = [
  { name: "Jan", sessions: 2 },
  { name: "Feb", sessions: 3 },
  { name: "Mar", sessions: 5 },
  { name: "Apr", sessions: 7 },
  { name: "May", sessions: 6 },
  { name: "Jun", sessions: 8 },
];

const DashboardSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Bookings", value: "24", icon: "📅" },
          { title: "Pending Payments", value: "$120", icon: "💰" },
          { title: "Completed Sessions", value: "15", icon: "✅" },
          { title: "Next Class", value: "April 2", icon: "📆" },
        ].map((card) => (
          <div key={card.title} className="p-5 bg-gray-700 rounded-lg">
            <div className="text-3xl mb-2">{card.icon}</div>
            <h2 className="text-sm text-gray-400">{card.title}</h2>
            <p className="text-xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-700 p-5 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Completed Training Sessions</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sessionData}>
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="sessions" 
                stroke="#4F46E5" 
                fill="url(#colorSessions)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Upcoming Sessions Preview */}
      <div className="bg-gray-700 p-5 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
          <button className="text-blue-400 text-sm hover:underline">View All</button>
        </div>
        
        <div className="space-y-3">
          {[
            { 
              title: "Motorcycle Practical Training", 
              date: "April 2, 2025", 
              time: "10:00 AM",
              type: "Practical"
            },
            { 
              title: "Road Rules Review", 
              date: "April 5, 2025", 
              time: "2:00 PM",
              type: "Theory"
            },
          ].map((session, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded">
              <div>
                <h3 className="font-medium">{session.title}</h3>
                <p className="text-sm text-gray-400">{session.date} at {session.time}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                session.type === "Practical" 
                  ? "bg-green-900 text-green-300" 
                  : "bg-blue-900 text-blue-300"
              }`}>
                {session.type}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Materials Preview */}
      <div className="bg-gray-700 p-5 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Training Materials</h2>
          <button 
            className="text-blue-400 text-sm hover:underline"
            onClick={() => window.location.hash = "materials"}
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { 
              title: "Motorcycle Safety Guide.pdf", 
              date: "April 15, 2025",
              type: "PDF"
            },
            { 
              title: "Road Signs Handbook.pdf", 
              date: "April 10, 2025",
              type: "PDF"
            },
          ].map((material, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">📄</span>
                <div>
                  <h3 className="font-medium">{material.title}</h3>
                  <p className="text-sm text-gray-400">Added on {material.date}</p>
                </div>
              </div>
              <button className="px-2 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;