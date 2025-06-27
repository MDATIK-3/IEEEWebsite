import React, { useState } from "react";

// Sample data for 2025 and 2024 (extend as needed)
const executiveData = {
  2025: {
    SB: {
      faculty: [
        { name: "Dr.Aminur Rahman ", role: "BRANCH COUNSRLOR", img: "../../src/Images/AMN.jpg" },
        { name: "Dr.Ahmed Al Mansur", role: "MENTOR", img: "../../src/Images/AHMED.jpg" },
        { name: "MD.Rajibul Palas", role: "MENTOR", img: "../../src/Images/RJBUL.jpg" },
      ],
      students: [
        { name: "Faysal Hossain Tomal", role: "Chair", img: "../../src/Images/Faysal Hossain Tomal No BG.png" },
        { name: "S. M Shakib Mahmud Shefat", role: "Vice-chair (Activity)", img: "../../src/Images/Sakib Mahmud.jpeg" },
        { name: "Fahim Mahmud", role: "Vice-chair (Technical)", img: "../../src/Images/Fahim Mahmud.jpg" },
        { name: "Shahadat Hosen Nishan", role: "General Secretary", img: "../../src/Images/Shahadat Hosen Nishan.jpg" },
        { name: "Esrat Ahmed Eva", role: "Joint Secretary", img: "../../src/Images/Eva.JPG" },
        { name: "Md. Abu Rayhan Imran", role: "Treasurer", img: "../../src/Images/Md. Abu Rayhan Imran No BG.png" },
        { name: "Pritam Saha Turja", role: "Organizing Secretary", img: "../../src/Images/Pritam Saha Turja.jpg" },
        { name: "Antu Marma", role: "Joint Organizing Secretary", img: "../../src/Images/antumarma.jpg" },
        { name: "Nasibul Hasan Naem", role: "Publication Secretary", img: "../../src/Images/Nasibul Hasan Naem.jpeg" },
        { name: "Dip Barman", role: "Programme Co-Ordinator", img: "../../src/Images/Dip Barman.png" },
        { name: "Md. Rifat Bin Hasan", role: "Programme Co-Ordinator", img: "../../src/Images/Screenshot 2025-06-22 235847.png" },
        { name: "Promod Chandra Das", role: "Membership Development Co-Ordinator", img: "../../src/Images/Promod Chandra Das .jpg" },
        { name: "Afsa Akter Shawla", role: "Student Activity Co-Ordinator", img: "../../src/Images/Afsa Akter Shawla.jpeg" },
        { name: "Md.Mainul Islam Nerob", role: "Publicity Co-Ordinator", img: "../../src/Images/Md.Mainul Islam Nerob.jpg" },
        { name: "Atikur Rahman", role: "Information Secretary", img: "../../src/Images/Atikur_Rahman (1).jpg" },
        { name: "S M Naymuzzaman Nahid", role: "Graphics Designer", img: "../../src/Images/S M Naymuzzaman Nahid .jpg" },
        { name: "Md Miadul Islam Nizzan", role: "Asst Graphics Designer", img: "../../src/Images/Miadul Islam Nizzan.jpg" },
        { name: "Maheer Jabin Priya", role: "Web master & Newsletter editor", img: "../../src/Images/Maheer Jabin Priya.jpg" },
        { name: "Tonmoy Kanti Das", role: "Executive Member", img: "../../src/Images/Tonmoy Das.jpeg" },
        { name: "Shakib Hasan", role: "Executive Member", img: "../../src/Images/IMG_20250519_223416.jpg" },
      ],

    },
    CS: {
      faculty: [{ name: "Dr. Ahmed Al Mansur", role: "Mentor", img: "../../src/Images/AHMED.jpg" }],
      students: [{ name: "Md. Abu Rayhan Imran", role: "Treasurer", img: "../../src/Images/Md. Abu Rayhan Imran No BG.png" }],
    },
    MAIN: {
      faculty: [{ name: "MD.Rajibul Palas", role: "Mentor", img: "../../src/Images/RJBUL.jpg" }],
      students: [{ name: "Esrat Ahmed Eva", role: "Joint Secretary", img: "../../src/Images/Eva.JPG" }],
    },
  },
  2024: {
    SB: {
      faculty: [{ name: "Dr. Rifat Jahan", role: "Moderator", img: "https://i.imgur.com/Wm4FSlO.png" }],
      students: [{ name: "Zahid Khan", role: "President", img: "https://i.imgur.com/qCN5WwL.png" }],
    },
    CS: {
      faculty: [],
      students: [{ name: "Fatema Ruma", role: "Vice President", img: "https://i.imgur.com/2GwCzFy.png" }],
    },
    MAIN: {
      faculty: [],
      students: [],
    },
  },
  2023: {
    SB: {
      faculty: [{ name: "Dr. Rifat Jahan", role: "Moderator", img: "https://i.imgur.com/Wm4FSlO.png" }],
      students: [{ name: "Zahid Khan", role: "President", img: "https://i.imgur.com/qCN5WwL.png" }],
    },
    CS: {
      faculty: [],
      students: [{ name: "Fatema Ruma", role: "Vice President", img: "https://i.imgur.com/2GwCzFy.png" }],
    },
    MAIN: {
      faculty: [],
      students: [],
    },
  },
  2022: {
    SB: {
      faculty: [{ name: "Dr. Rifat Jahan", role: "Moderator", img: "https://i.imgur.com/Wm4FSlO.png" }],
      students: [{ name: "Zahid Khan", role: "President", img: "https://i.imgur.com/qCN5WwL.png" }],
    },
    CS: {
      faculty: [],
      students: [{ name: "Fatema Ruma", role: "Vice President", img: "https://i.imgur.com/2GwCzFy.png" }],
    },
    MAIN: {
      faculty: [],
      students: [],
    },
  },
  2021: {
    SB: {
      faculty: [{ name: "Dr. Rifat Jahan", role: "Moderator", img: "https://i.imgur.com/Wm4FSlO.png" }],
      students: [{ name: "Zahid Khan", role: "President", img: "https://i.imgur.com/qCN5WwL.png" }],
    },
    CS: {
      faculty: [],
      students: [{ name: "Fatema Ruma", role: "Vice President", img: "https://i.imgur.com/2GwCzFy.png" }],
    },
    MAIN: {
      faculty: [],
      students: [],
    },
  },
};

const ExecutiveList = () => {
  const years = Object.keys(executiveData).sort((a, b) => b - a);

  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedGroup, setSelectedGroup] = useState("SB");

  const data = executiveData[selectedYear]?.[selectedGroup] || { faculty: [], students: [] };

  return (
    <div className="px-4 max-w-7xl mx-auto py-10 min-h-screen">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-600">IEEE Executives</h1>
        <p className="text-gray-600">Meet the dedicated executives who have led the IEEE STUDENT BRANCH GUB</p>
      </div>

      {/* Year Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => {
              setSelectedYear(year);
              setSelectedGroup("SB"); // reset to SB when year changes
            }}
            className={`px-4 py-1 rounded border ${selectedYear === year
                ? "bg-blue-600 text-white font-semibold"
                : "bg-white text-gray-700 hover:bg-gray-100"
              } transition`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* SB / CSB / MAIN Buttons */}
      <div className="flex gap-3 mb-10">
        {["SB", "CS", "MAIN"].map((group) => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`px-4 py-1 rounded border ${selectedGroup === group
                ? "bg-green-600 text-white font-semibold"
                : "bg-white text-gray-700 hover:bg-gray-100"
              } transition`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Faculty Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">🎓 Faculty Advisors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.faculty.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
              <img
                src={member.img}
                alt={member.name}
                className="mx-auto h-24 w-24 object-cover rounded-full ring-4 ring-blue-100 mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
              <p className="text-sm text-blue-600 font-medium mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Section */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">🧑‍💻 Student Executives</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.students.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
              <img
                src={member.img}
                alt={member.name}
                className="mx-auto h-20 w-20 object-cover rounded-full ring-4 ring-blue-100 mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveList;
