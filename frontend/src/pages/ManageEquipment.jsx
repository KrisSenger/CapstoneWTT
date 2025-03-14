import React, { useState, useEffect } from 'react';
import api from '../api';
import ReturnHome from "../components/ReturnHome";

const ManageEquipment = () => {
  // Truck states
  const [trucks, setTrucks] = useState([]);
  const [truckFormData, setTruckFormData] = useState({
    truckID: '',
    make_model: '',
    license_plate: '',
    odometer: '',
    carrier: '',
    jurisdiction: '',
  });
  const [editingTruckId, setEditingTruckId] = useState(null);

  // Trailer states
  const [trailers, setTrailers] = useState([]);
  const [trailerFormData, setTrailerFormData] = useState({
    trailerID: '',
    make_model: '',
    license_plate: '',
    carrier: '',
    jurisdiction: '',
  });
  const [editingTrailerId, setEditingTrailerId] = useState(null);

  // Fetch trucks from API
  const fetchTrucks = async () => {
    try {
      const { data } = await api.get('/api/truck/data/');
      setTrucks(data);
    } catch (error) {
      console.error('Error fetching trucks:', error);
    }
  };

  // Fetch trailers from API
  const fetchTrailers = async () => {
    try {
      const { data } = await api.get('/api/trailer/data/');
      setTrailers(data);
    } catch (error) {
      console.error('Error fetching trailers:', error);
    }
  };

  useEffect(() => {
    fetchTrucks();
    fetchTrailers();
  }, []);

  // Truck form change handler
  const handleTruckChange = (e) => {
    const { name, value } = e.target;
    setTruckFormData({
      ...truckFormData,
      [name]: value,
    });
  };

  // Trailer form change handler
  const handleTrailerChange = (e) => {
    const { name, value } = e.target;
    setTrailerFormData({
      ...trailerFormData,
      [name]: value,
    });
  };

  // Truck CRUD operations
  const addTruck = async () => {
    try {
      await api.post('/api/truck/add/', truckFormData);
      fetchTrucks();
      setTruckFormData({
        truckID: '',
        make_model: '',
        license_plate: '',
        odometer: '',
        carrier: '',
        jurisdiction: '',
      });
    } catch (error) {
      console.error('Error adding truck:', error);
    }
  };

  const updateTruck = async (id) => {
    try {
      const payload = { ...truckFormData };
      // uncomment if we want to remove truckID from the payload so user can't change it.
      //   delete payload.truckID;
      await api.put(`/api/truck/update/${id}/`, payload);
      fetchTrucks();
      setEditingTruckId(null);
      setTruckFormData({
        truckID: '',
        make_model: '',
        license_plate: '',
        odometer: '',
        carrier: '',
        jurisdiction: '',
      });
    } catch (error) {
      console.error('Error updating truck:', error);
    }
  };

  const deleteTruck = async (id) => {
    try {
      await api.delete(`/api/truck/delete/${id}/`);
      fetchTrucks();
    } catch (error) {
      console.error('Error deleting truck:', error);
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
    });
  };

  // Trailer CRUD operations
  const addTrailer = async () => {
    try {
      await api.post('/api/trailer/add/', trailerFormData);
      fetchTrailers();
      setTrailerFormData({
        trailerID: '',
        make_model: '',
        license_plate: '',
        carrier: '',
        jurisdiction: '',
      });
    } catch (error) {
      console.error('Error adding trailer:', error);
    }
  };

  const updateTrailer = async (id) => {
    try {
      const payload = { ...trailerFormData };
    // uncomment if we want to remove truckID from the payload so user can't change it.
    //   delete payload.trailerID;
      await api.put(`/api/trailer/update/${id}/`, payload);
      fetchTrailers();
      setEditingTrailerId(null);
      setTrailerFormData({
        trailerID: '',
        make_model: '',
        license_plate: '',
        carrier: '',
        jurisdiction: '',
      });
    } catch (error) {
      console.error('Error updating trailer:', error);
    }
  };

  const deleteTrailer = async (id) => {
    try {
      await api.delete(`/api/trailer/delete/${id}/`);
      fetchTrailers();
    } catch (error) {
      console.error('Error deleting trailer:', error);
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
    });
  };

  return (
    <div>
        <ReturnHome />
      <h1>Equipment Manager</h1>
      {/* Truck Management Section */}
      <div>
        <h2>Truck Management</h2>
        <div>
          <h3>{editingTruckId ? 'Edit Truck' : 'Add Truck'}</h3>
          <input
            type="text"
            name="truckID"
            placeholder="Truck ID"
            value={truckFormData.truckID}
            onChange={handleTruckChange}
          />
          <input
            type="text"
            name="make_model"
            placeholder="Make & Model"
            value={truckFormData.make_model}
            onChange={handleTruckChange}
          />
          <input
            type="text"
            name="license_plate"
            placeholder="License Plate"
            value={truckFormData.license_plate}
            onChange={handleTruckChange}
          />
          <input
            type="number"
            name="odometer"
            placeholder="Odometer"
            value={truckFormData.odometer}
            onChange={handleTruckChange}
          />
          <input
            type="text"
            name="carrier"
            placeholder="Carrier"
            value={truckFormData.carrier}
            onChange={handleTruckChange}
          />
          <input
            type="text"
            name="jurisdiction"
            placeholder="Jurisdiction"
            value={truckFormData.jurisdiction}
            onChange={handleTruckChange}
          />
          {editingTruckId ? (
            <button onClick={() => updateTruck(editingTruckId)}>Update Truck</button>
          ) : (
            <button onClick={addTruck}>Add Truck</button>
          )}
        </div>
        <div>
          <h3>Truck List</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Truck ID</th>
                <th>Make &amp; Model</th>
                <th>License Plate</th>
                <th>Odometer</th>
                <th>Carrier</th>
                <th>Jurisdiction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map((truck) => (
                <tr key={truck.truckID}>
                  <td>{truck.truckID}</td>
                  <td>{truck.make_model}</td>
                  <td>{truck.license_plate}</td>
                  <td>{truck.odometer}</td>
                  <td>{truck.carrier}</td>
                  <td>{truck.jurisdiction}</td>
                  <td>
                    <button onClick={() => startEditingTruck(truck)}>Edit</button>
                    <button onClick={() => deleteTruck(truck.truckID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trailer Management Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Trailer Management</h2>
        <div>
          <h3>{editingTrailerId ? 'Edit Trailer' : 'Add Trailer'}</h3>
          <input
            type="text"
            name="trailerID"
            placeholder="Trailer ID"
            value={trailerFormData.trailerID}
            onChange={handleTrailerChange}
          />
          <input
            type="text"
            name="make_model"
            placeholder="Make &amp; Model"
            value={trailerFormData.make_model}
            onChange={handleTrailerChange}
          />
          <input
            type="text"
            name="license_plate"
            placeholder="License Plate"
            value={trailerFormData.license_plate}
            onChange={handleTrailerChange}
          />
          <input
            type="text"
            name="carrier"
            placeholder="Carrier"
            value={trailerFormData.carrier}
            onChange={handleTrailerChange}
          />
          <input
            type="text"
            name="jurisdiction"
            placeholder="Jurisdiction"
            value={trailerFormData.jurisdiction}
            onChange={handleTrailerChange}
          />
          {editingTrailerId ? (
            <button onClick={() => updateTrailer(editingTrailerId)}>Update Trailer</button>
          ) : (
            <button onClick={addTrailer}>Add Trailer</button>
          )}
        </div>
        <div>
          <h3>Trailer List</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Trailer ID</th>
                <th>Make &amp; Model</th>
                <th>License Plate</th>
                <th>Carrier</th>
                <th>Jurisdiction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trailers.map((trailer) => (
                <tr key={trailer.trailerID}>
                  <td>{trailer.trailerID}</td>
                  <td>{trailer.make_model}</td>
                  <td>{trailer.license_plate}</td>
                  <td>{trailer.carrier}</td>
                  <td>{trailer.jurisdiction}</td>
                  <td>
                    <button onClick={() => startEditingTrailer(trailer)}>Edit</button>
                    <button onClick={() => deleteTrailer(trailer.trailerID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageEquipment;