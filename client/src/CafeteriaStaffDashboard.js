// CafeteriaStaffDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CafeteriaStaffDashboard.css';
import Web3 from 'web3';

// Update the ABI and contract address based on your MenuManagement contract
import { Order_ABI, Order_ADDRESS, Cafe_ABI, Cafe_ADDRESS } from './config.js';


function CafeteriaStaffDashboard() {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [menuItemIds, setMenuItemIds] = useState([]);
  const [menuItemDetails, setMenuItemDetails] = useState({
    id: 0,
    name: '',
    price: 0,
    available: false,
  });

  // Initialize Web3 and contract on component mount
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const w3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:7545');
        const cafeContract = new w3.eth.Contract(Cafe_ABI, Cafe_ADDRESS);
        const accounts = await w3.eth.getAccounts();
        const manager = accounts[1];
        setWeb3(w3);
        setContract(cafeContract);

        // Check if the current account is the owner (manager)
        if (manager == accounts[1]) {
          // Load menu item ids if needed
          const ids = await cafeContract.methods.nextItemId().call();
          setMenuItemIds([...Array(parseInt(ids)).keys()]);
        } else {
          // Redirect to the home page if not the manager
          navigate('/');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    };

    initWeb3();
  }, [navigate]);

  const handleBackToHome = () => {
    // Navigate back to the home page
    navigate('/');
  };

  const handleViewMenuItem = async (itemId) => {
    try {
      const details = await contract.methods.getMenuItem(itemId).call();
      setMenuItemDetails({
        id: details[0],
        name: details[1],
        price: details[2],
        available: details[3],
      });
    } catch (error) {
      console.error('Error viewing menu item:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Cafeteria Staff Dashboard</h2>

      <div className="menu-actions">
        <h3>Menu Actions</h3>

        <div>
          <button className="blue-button" onClick={() => handleViewMenuItem(0)}>
            View Menu Item
          </button>{' '}
          <br />
          <div>
            <label>Item ID : </label>
            <input
              type="number"
              value={menuItemDetails.id}
              onChange={(e) =>
                setMenuItemDetails({ ...menuItemDetails, id: e.target.value })
              }
            />
            &nbsp; &nbsp;
            <button
              className="blue-button"
              onClick={() => handleViewMenuItem(menuItemDetails.id)}
            >
              View Item
            </button>
            <div>
              <strong>Item Name:</strong> {menuItemDetails.name}
            </div>
            <div>
              <strong>Item Price:</strong> {menuItemDetails.price}
            </div>
            <div>
              <strong>Item Availability:</strong>{' '}
              {menuItemDetails.available ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        <div>
          <button className="button" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default CafeteriaStaffDashboard;
