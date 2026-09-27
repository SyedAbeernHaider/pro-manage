import { useState } from 'react';

function Navbar() {
  // --------------------------------
  // 1. Konsa dropdown open hai?
  // --------------------------------

  const [openDropdown, setOpenDropdown] = useState(null);

  // --------------------------------
  // 2. User ne kya select kiya?
  // --------------------------------

  const [status, setStatus] = useState('All');
  const [time, setTime] = useState('Today');
  const [priority, setPriority] = useState('All');

  // --------------------------------
  // 3. Dropdown options
  // --------------------------------

  const statusOptions = ['All', 'Active', 'Completed', 'Cancelled'];

  const timeOptions = ['Today', 'This Week', 'This Month', 'This Year'];

  const priorityOptions = ['All', 'Low', 'Medium', 'High'];

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-4">
      {/* =========================
          LOGO
      ========================= */}

      <h1 className="text-xl font-bold text-gray-900">Kanbrix</h1>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="flex items-center gap-3">
        {/* =========================
            STATUS DROPDOWN
        ========================= */}

        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Status: {status}
            <span>{openDropdown === 'status' ? '▲' : '▼'}</span>
          </button>

          {/* Status Options */}

          {openDropdown === 'status' && (
            <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setStatus(option);
                    setOpenDropdown(null);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =========================
            TIME DROPDOWN
        ========================= */}

        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Time: {time}
            <span>{openDropdown === 'time' ? '▲' : '▼'}</span>
          </button>

          {/* Time Options */}

          {openDropdown === 'time' && (
            <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              {timeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setTime(option);
                    setOpenDropdown(null);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =========================
            PRIORITY DROPDOWN
        ========================= */}

        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'priority' ? null : 'priority')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Priority: {priority}
            <span>{openDropdown === 'priority' ? '▲' : '▼'}</span>
          </button>

          {/* Priority Options */}

          {openDropdown === 'priority' && (
            <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              {priorityOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setPriority(option);
                    setOpenDropdown(null);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
