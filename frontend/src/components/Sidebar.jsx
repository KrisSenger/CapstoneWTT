import React from 'react';


const Sidebar = ({ isSidebarOpen, children }) => {

    return (
        <div className='flex'>
            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-[#21016A] text-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-transform 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col justify-between">
                    <ul className="space-y-2 font-semibold">
                        <li>
                            <a href="/" className="block p-4 text-white rounded-lg hover:bg-gray-100 hover:text-gray-600 transition">Home</a>
                        </li>
                        <li>
                            <a href="/Manage-Users" className="block p-4 text-white rounded-lg hover:bg-gray-100 hover:text-gray-600 transition">Manage Users</a>
                        </li>
                        <li>
                            <a href="/Manage-Equipment" className="block p-4 text-white rounded-lg hover:bg-gray-100 hover:text-gray-600 transition">Manage Equipment</a>
                        </li>
                        <li>
                            <a href="/Logs" className="block p-4 text-white rounded-lg hover:bg-gray-100 hover:text-gray-600 transition">Logs</a>
                        </li>
                        <li>
                            <a href="/Incidents" className="block p-4 text-white rounded-lg hover:bg-gray-100 hover:text-gray-600 transition">Incidents</a>
                        </li>
                        {/* <li>
                            <a href="/Profile" className="block p-4 text-white rounded-lg hover:bg-gray-100 hover:text-gray-600 transition">Profile</a>
                        </li> */}
                    </ul>
                    <div className="mt-auto">
                        <a href="/logout" className="w-full block p-4 text-white hover:text-gray-600 rounded-lg hover:bg-gray-100 transition dark:text-gray-400 dark:hover:bg-gray-700">Logout</a>
                    </div>
                </div>
            </aside>
            <div className={`pt-16 flex-1 transition-all ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
                {children}
            </div>

        </div>
    )
};

export default Sidebar;