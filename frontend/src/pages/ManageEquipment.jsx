import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Popup from '../components/Popup';

const ManageEquipment = () => {
  // State for selecting which equipment type to manage (null, "truck", or "trailer")
  const [selectedType, setSelectedType] = useState(null);

  // Truck states
  const [trucks, setTrucks] = useState([]);
  const [truckFormData, setTruckFormData] = useState({
    truckID: '',
    make_model: '',
    license_plate: '',
    odometer: '',
    carrier: '',
    jurisdiction: '',
    in_service: true,
  });
  const [editingTruckId, setEditingTruckId] = useState(null);
  const [showTruckAddPopup, setShowTruckAddPopup] = useState(false);
  const [showTruckEditPopup, setShowTruckEditPopup] = useState(false);

  // Trailer states
  const [trailers, setTrailers] = useState([]);
  const [trailerFormData, setTrailerFormData] = useState({
    trailerID: '',
    make_model: '',
    license_plate: '',
    carrier: '',
    jurisdiction: '',
    in_service: true,
  });
  const [editingTrailerId, setEditingTrailerId] = useState(null);
  const [showTrailerAddPopup, setShowTrailerAddPopup] = useState(false);
  const [showTrailerEditPopup, setShowTrailerEditPopup] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Truck functions
  const fetchTrucks = async () => {
    try {
      const { data } = await api.get('/api/truck/data/');
      setTrucks(data);
    } catch (error) {
      console.error('Error fetching trucks:', error);
    }
  };

  const addTruck = async () => {
    try {
      await api.post('/api/truck/add/', truckFormData);
      alert("Truck added successfully!");
      fetchTrucks();
      setShowTruckAddPopup(false);
      setTruckFormData({
        truckID: '',
        make_model: '',
        license_plate: '',
        odometer: '',
        carrier: '',
        jurisdiction: '',
        in_service: true,
      });
    } catch (error) {
      console.error('Error adding truck:', error);
    }
  };

  const updateTruck = async (id) => {
    try {
      await api.put(`/api/truck/update/${id}/`, truckFormData);
      alert("Truck updated successfully!");
      fetchTrucks();
      setShowTruckEditPopup(false);
      setEditingTruckId(null);
      setTruckFormData({
        truckID: '',
        make_model: '',
        license_plate: '',
        odometer: '',
        carrier: '',
        jurisdiction: '',
        in_service: true,
      });
    } catch (error) {
      console.error('Error updating truck:', error);
    }
  };

  // Deactivate truck by setting in_service to false.
  const deactivateTruck = async (truck) => {
    try {
      const payload = {
        truckID: Number(truck.truckID),
        make_model: truck.make_model,
        license_plate: truck.license_plate,
        odometer: Number(truck.odometer),
        carrier: truck.carrier,
        jurisdiction: truck.jurisdiction,
        in_service: false
      };
      await api.put(`/api/truck/update/${truck.truckID}/`, payload);
      alert("Truck deactivated successfully!");
      fetchTrucks();
    } catch (error) {
      console.error('Error deactivating truck:', error);
    }
  };

  // Activate truck by setting in_service to true.
  const activateTruck = async (truck) => {
    try {
      const payload = {
        truckID: Number(truck.truckID),
        make_model: truck.make_model,
        license_plate: truck.license_plate,
        odometer: Number(truck.odometer),
        carrier: truck.carrier,
        jurisdiction: truck.jurisdiction,
        in_service: true
      };
      await api.put(`/api/truck/update/${truck.truckID}/`, payload);
      alert("Truck activated successfully!");
      fetchTrucks();
    } catch (error) {
      console.error('Error activating truck:', error);
    }
  };

  const startEditingTruck = (truck) => {
    setEditingTruckId(truck.truckID);
    setTruckFormData({
      truckID: truck.truckID || '',
      make_model: truck.make_model || '',
      license_plate: truck.license_plate || '',
      odometer: truck.odometer || '',
      carrier: truck.carrier || '',
      jurisdiction: truck.jurisdiction || '',
      in_service: truck.in_service,
    });
    setShowTruckEditPopup(true);
  };

  // Trailer functions
  const fetchTrailers = async () => {
    try {
      const { data } = await api.get('/api/trailer/data/');
      setTrailers(data);
    } catch (error) {
      console.error('Error fetching trailers:', error);
    }
  };

  const addTrailer = async () => {
    try {
      await api.post('/api/trailer/add/', trailerFormData);
      alert("Trailer added successfully!");
      fetchTrailers();
      setShowTrailerAddPopup(false);
      setTrailerFormData({
        trailerID: '',
        make_model: '',
        license_plate: '',
        carrier: '',
        jurisdiction: '',
        in_service: true,
      });
    } catch (error) {
      console.error('Error adding trailer:', error);
    }
  };

  const updateTrailer = async (id) => {
    try {
      await api.put(`/api/trailer/update/${id}/`, trailerFormData);
      alert("Trailer updated successfully!");
      fetchTrailers();
      setShowTrailerEditPopup(false);
      setEditingTrailerId(null);
      setTrailerFormData({
        trailerID: '',
        make_model: '',
        license_plate: '',
        carrier: '',
        jurisdiction: '',
        in_service: true,
      });
    } catch (error) {
      console.error('Error updating trailer:', error);
    }
  };

  // Deactivate trailer by setting in_service to false.
  const deactivateTrailer = async (trailer) => {
    try {
      const payload = {
        trailerID: Number(trailer.trailerID),
        make_model: trailer.make_model,
        license_plate: trailer.license_plate,
        odometer: Number(trailer.odometer),
        carrier: trailer.carrier,
        jurisdiction: trailer.jurisdiction,
        in_service: false
      };
      await api.put(`/api/trailer/update/${trailer.trailerID}/`, payload);
      alert("Trailer deactivated successfully!");
      fetchTrailers();
    } catch (error) {
      console.error('Error deactivating trailer:', error);
    }
  };

  // Activate trailer by setting in_service to true.
  const activateTrailer = async (trailer) => {
    try {
      const payload = {
        trailerID: Number(trailer.trailerID),
        make_model: trailer.make_model,
        license_plate: trailer.license_plate,
        carrier: trailer.carrier,
        jurisdiction: trailer.jurisdiction,
        in_service: true
      };
      await api.put(`/api/trailer/update/${trailer.trailerID}/`, payload);
      alert("Trailer activated successfully!");
      fetchTrailers();
    } catch (error) {
      console.error('Error activating trailer:', error);
    }
  };

  const startEditingTrailer = (trailer) => {
    setEditingTrailerId(trailer.trailerID);
    setTrailerFormData({
      trailerID: trailer.trailerID || '',
      make_model: trailer.make_model || '',
      license_plate: trailer.license_plate || '',
      carrier: trailer.carrier || '',
      jurisdiction: trailer.jurisdiction || '',
      in_service: trailer.in_service,
    });
    setShowTrailerEditPopup(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch equipment list when selected type changes.
  useEffect(() => {
    if (selectedType === 'truck') {
      fetchTrucks();
    } else if (selectedType === 'trailer') {
      fetchTrailers();
    }
  }, [selectedType]);

  return (
    <div>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen}>

        {/* If no equipment type is selected, show the two choice buttons */}
        {!selectedType && (
          <div className="flex justify-center space-x-8 mt-8">
            <button 
              className="px-8 py-4 bg-orange-500 text-white text-2xl rounded-lg"
              onClick={() => setSelectedType('truck')}
            >
              Truck Manager
            </button>
            <button 
              className="px-8 py-4 bg-orange-500 text-white text-2xl rounded-lg"
              onClick={() => setSelectedType('trailer')}
            >
              Trailer Manager
            </button>
          </div>
        )}

        {/* Equipment Management Section */}
        {selectedType && (
          <div>
            {/* Header row with Back button, title, and Add button */}
            <div className="flex items-center justify-between mb-4">
              <button 
                className="px-4 py-2 ml-4 mt-3 bg-orange-500 text-white rounded-md"
                onClick={() => setSelectedType(null)}
              >
                Back
              </button>
              <h3 className="text-2xl font-semibold">
                {selectedType === 'truck' ? 'Truck Management' : 'Trailer Management'}
              </h3>
              {selectedType === 'truck' ? (
                <button 
                  className="px-4 py-2 mr-4 mt-3 bg-blue-600 text-white rounded-md"
                  onClick={() => setShowTruckAddPopup(true)}
                >
                  Add Truck
                </button>
              ) : (
                <button 
                  className="px-4 py-2 mr-4 mt-3 bg-blue-600 text-white rounded-md"
                  onClick={() => setShowTrailerAddPopup(true)}
                >
                  Add Trailer
                </button>
              )}
            </div>

            {/* Truck Management Section */}
            {selectedType === 'truck' && (
              <div>
                {showTruckAddPopup && (
                  <Popup onClose={() => setShowTruckAddPopup(false)}>
                    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
                      <h2 className="text-2xl font-semibold text-gray-800 text-center">Add Truck</h2>
                      <input
                        type="text"
                        name="truckID"
                        placeholder="Truck ID"
                        value={truckFormData.truckID}
                        onChange={(e) => setTruckFormData({ ...truckFormData, truckID: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="make_model"
                        placeholder="Make & Model"
                        value={truckFormData.make_model}
                        onChange={(e) => setTruckFormData({ ...truckFormData, make_model: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="license_plate"
                        placeholder="License Plate"
                        value={truckFormData.license_plate}
                        onChange={(e) => setTruckFormData({ ...truckFormData, license_plate: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="number"
                        name="odometer"
                        placeholder="Odometer"
                        value={truckFormData.odometer}
                        onChange={(e) => setTruckFormData({ ...truckFormData, odometer: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="carrier"
                        placeholder="Carrier"
                        value={truckFormData.carrier}
                        onChange={(e) => setTruckFormData({ ...truckFormData, carrier: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="jurisdiction"
                        placeholder="Jurisdiction"
                        value={truckFormData.jurisdiction}
                        onChange={(e) => setTruckFormData({ ...truckFormData, jurisdiction: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            name="in_service"
                            checked={truckFormData.in_service}
                            onChange={(e) => setTruckFormData({ ...truckFormData, in_service: e.target.checked })}
                            className="mr-2"
                          />
                          In Service
                        </label>
                      </div>
                      <button 
                        onClick={addTruck}
                        className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md"
                      >
                        Add Truck
                      </button>
                    </div>
                  </Popup>
                )}
                {showTruckEditPopup && (
                  <Popup onClose={() => setShowTruckEditPopup(false)}>
                    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
                      <h2 className="text-2xl font-semibold text-gray-800 text-center">Edit Truck</h2>
                      <input
                        type="text"
                        name="truckID"
                        placeholder="Truck ID"
                        value={truckFormData.truckID}
                        onChange={(e) => setTruckFormData({ ...truckFormData, truckID: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="make_model"
                        placeholder="Make & Model"
                        value={truckFormData.make_model}
                        onChange={(e) => setTruckFormData({ ...truckFormData, make_model: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="license_plate"
                        placeholder="License Plate"
                        value={truckFormData.license_plate}
                        onChange={(e) => setTruckFormData({ ...truckFormData, license_plate: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="number"
                        name="odometer"
                        placeholder="Odometer"
                        value={truckFormData.odometer}
                        onChange={(e) => setTruckFormData({ ...truckFormData, odometer: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="carrier"
                        placeholder="Carrier"
                        value={truckFormData.carrier}
                        onChange={(e) => setTruckFormData({ ...truckFormData, carrier: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="jurisdiction"
                        placeholder="Jurisdiction"
                        value={truckFormData.jurisdiction}
                        onChange={(e) => setTruckFormData({ ...truckFormData, jurisdiction: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            name="in_service"
                            checked={truckFormData.in_service}
                            onChange={(e) => setTruckFormData({ ...truckFormData, in_service: e.target.checked })}
                            className="mr-2"
                          />
                          In Service
                        </label>
                      </div>
                      <button 
                        onClick={() => updateTruck(editingTruckId)}
                        className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md"
                      >
                        Update Truck
                      </button>
                    </div>
                  </Popup>
                )}
                <div className="overflow-x-hidden overflow-y-auto max-h-[60vh] mt-4">
                  <table className="w-full table-auto border-collapse">
                    <thead className="bg-gray-800 text-white sticky top-0 z-10">
                      <tr>
                        <th className="p-3 border border-gray-700">Truck ID</th>
                        <th className="p-3 border border-gray-700">Make &amp; Model</th>
                        <th className="p-3 border border-gray-700">License Plate</th>
                        <th className="p-3 border border-gray-700">Odometer</th>
                        <th className="p-3 border border-gray-700">Carrier</th>
                        <th className="p-3 border border-gray-700">Jurisdiction</th>
                        <th className="p-3 border border-gray-700">In Service</th>
                        <th className="p-3 border border-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trucks.length > 0 ? (
                        trucks.map((truck) => (
                          <tr
                            key={truck.truckID}
                            className="cursor-pointer hover:bg-gray-100 even:bg-gray-50 transition duration-200"
                          >
                            <td className="p-3 border border-gray-300">{truck.truckID}</td>
                            <td className="p-3 border border-gray-300">{truck.make_model}</td>
                            <td className="p-3 border border-gray-300">{truck.license_plate}</td>
                            <td className="p-3 border border-gray-300">{truck.odometer}</td>
                            <td className="p-3 border border-gray-300">{truck.carrier}</td>
                            <td className="p-3 border border-gray-300">{truck.jurisdiction}</td>
                            <td className="p-3 border border-gray-300">{truck.in_service ? 'Yes' : 'No'}</td>
                            <td className="p-3 border border-gray-300">
                              <div className="flex flex-wrap items-center gap-1">
                                <button
                                  onClick={() => startEditingTruck(truck)}
                                  className="px-2 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-md hover:bg-yellow-600 transition duration-200"
                                >
                                  Edit
                                </button>
                                {truck.in_service ? (
                                  <button
                                    onClick={() => deactivateTruck(truck)}
                                    className="px-2 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition duration-200"
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => activateTruck(truck)}
                                    className="px-2 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition duration-200"
                                  >
                                    Activate
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center p-6 text-gray-500">
                            No trucks found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Trailer Management Section */}
            {selectedType === 'trailer' && (
              <div>
                {showTrailerAddPopup && (
                  <Popup onClose={() => setShowTrailerAddPopup(false)}>
                    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
                      <h2 className="text-2xl font-semibold text-gray-800 text-center">Add Trailer</h2>
                      <input
                        type="text"
                        name="trailerID"
                        placeholder="Trailer ID"
                        value={trailerFormData.trailerID}
                        onChange={(e) => setTrailerFormData({ ...trailerFormData, trailerID: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="make_model"
                        placeholder="Make &amp; Model"
                        value={trailerFormData.make_model}
                        onChange={(e) => setTrailerFormData({ ...trailerFormData, make_model: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="license_plate"
                        placeholder="License Plate"
                        value={trailerFormData.license_plate}
                        onChange={(e) => setTrailerFormData({ ...trailerFormData, license_plate: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="carrier"
                        placeholder="Carrier"
                        value={trailerFormData.carrier}
                        onChange={(e) => setTrailerFormData({ ...trailerFormData, carrier: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="jurisdiction"
                        placeholder="Jurisdiction"
                        value={trailerFormData.jurisdiction}
                        onChange={(e) => setTrailerFormData({ ...trailerFormData, jurisdiction: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            name="in_service"
                            checked={trailerFormData.in_service}
                            onChange={(e) => setTrailerFormData({ ...trailerFormData, in_service: e.target.checked })}
                            className="mr-2"
                          />
                          In Service
                        </label>
                      </div>
                      <button 
                        onClick={addTrailer}
                        className="w-full py-3 mt-4 bg-green-600 text-white rounded-md"
                      >
                        Add Trailer
                      </button>
                    </div>
                  </Popup>
                )}
                {showTrailerEditPopup && (
                  <Popup onClose={() => setShowTrailerEditPopup(false)}>
                    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
                      <h2 className="text-2xl font-semibold text-gray-800 text-center">Edit Trailer</h2>
                      <input
                        type="text"
                        name="trailerID"
                        placeholder="Trailer ID"
                        value={trailerFormData.trailerID}
                        onChange={(e) => setTrailerFormData({ ...trailerFormData, trailerID: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="make_model"
                        placeholder="Make &amp; Model"
                        value={trailerFormData.make_model}
                        onChange={(e) => setTrailerFormData({ ...trailerFormData, make_model: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="license_plate"
                        placeholder="License Plate"
                        value={trailerFormData.license_plate}
                        onChange={(e) => setTrailerFormData({ ...trailerFormData, license_plate: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="carrier"
                        placeholder="Carrier"
                        value={trailerFormData.carrier}
                        onChange={(e) => setTrailerFormData({ ...trailerFormData, carrier: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="jurisdiction"
                        placeholder="Jurisdiction"
                        value={trailerFormData.jurisdiction}
                        onChange={(e) => setTrailerFormData({ ...trailerFormData, jurisdiction: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            name="in_service"
                            checked={trailerFormData.in_service}
                            onChange={(e) => setTrailerFormData({ ...trailerFormData, in_service: e.target.checked })}
                            className="mr-2"
                          />
                          In Service
                        </label>
                      </div>
                      <button 
                        onClick={() => updateTrailer(editingTrailerId)}
                        className="w-full py-3 mt-4 bg-green-600 text-white rounded-md"
                      >
                        Update Trailer
                      </button>
                    </div>
                  </Popup>
                )}
                <div className="overflow-x-hidden overflow-y-auto max-h-[60vh] mt-4">
                  <table className="w-full table-auto border-collapse">
                    <thead className="bg-gray-800 text-white sticky top-0 z-10">
                      <tr>
                        <th className="p-3 border border-gray-700">Trailer ID</th>
                        <th className="p-3 border border-gray-700">Make &amp; Model</th>
                        <th className="p-3 border border-gray-700">License Plate</th>
                        <th className="p-3 border border-gray-700">Carrier</th>
                        <th className="p-3 border border-gray-700">Jurisdiction</th>
                        <th className="p-3 border border-gray-700">In Service</th>
                        <th className="p-3 border border-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trailers.length > 0 ? (
                        trailers.map((trailer) => (
                          <tr
                            key={trailer.trailerID}
                            className="cursor-pointer hover:bg-gray-100 even:bg-gray-50 transition duration-200"
                          >
                            <td className="p-3 border border-gray-300">{trailer.trailerID}</td>
                            <td className="p-3 border border-gray-300">{trailer.make_model}</td>
                            <td className="p-3 border border-gray-300">{trailer.license_plate}</td>
                            <td className="p-3 border border-gray-300">{trailer.carrier}</td>
                            <td className="p-3 border border-gray-300">{trailer.jurisdiction}</td>
                            <td className="p-3 border border-gray-300">{trailer.in_service ? 'Yes' : 'No'}</td>
                            <td className="p-3 border border-gray-300">
                              <div className="flex flex-wrap items-center gap-1">
                                <button
                                  onClick={() => startEditingTrailer(trailer)}
                                  className="px-2 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-md hover:bg-yellow-600 transition duration-200"
                                >
                                  Edit
                                </button>
                                {trailer.in_service ? (
                                  <button
                                    onClick={() => deactivateTrailer(trailer)}
                                    className="px-2 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition duration-200"
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => activateTrailer(trailer)}
                                    className="px-2 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition duration-200"
                                  >
                                    Activate
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center p-6 text-gray-500">
                            No trailers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Sidebar>
    </div>
  );
};

export default ManageEquipment;
