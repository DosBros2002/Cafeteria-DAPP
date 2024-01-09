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
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(0);

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
        if (manager === accounts[1]) {
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

  const handleAddMenuItem = async () => {
    try {
      // Convert price to wei (assuming Ether)
      const priceInWei = web3.utils.toWei(newItemPrice.toString(), 'ether');

      // Call the addMenuItem function from the contract to add the new item
      await contract.methods
        .addMenuItem(newItemName, priceInWei)
        .send({ from: (await web3.eth.getAccounts())[0] });

      // Reload the menu item ids after adding a new item
      const ids = await contract.methods.nextItemId().call();
      setMenuItemIds([...Array(parseInt(ids)).keys()]);
    } catch (error) {
      console.error('Error adding menu item:', error);
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
          {/* Existing code to view menu item */}
        </div>

        <div>
          <h3>Add New Menu Item</h3>
          <div>
            <label>Item Name:</label>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
          </div>
          <div>
            <label>Item Price (Ether):</label>
            <input
              type="number"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
            />
          </div>
          <button className="blue-button" onClick={handleAddMenuItem}>
            Add Menu Item
          </button>
        </div>
      </div>

      <div>
        <button className="button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default CafeteriaStaffDashboard;
