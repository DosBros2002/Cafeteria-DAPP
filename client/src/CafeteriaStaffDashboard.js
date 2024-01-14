import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CafeteriaStaffDashboard.css';
import Web3 from 'web3';

// Update the ABI and contract address based on your MenuManagement contract
import { Order_ABI, Order_ADDRESS, Cafe_ABI, Cafe_ADDRESS,Discount_ABI,Discount_ADDRESS } from './config.js';

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
  const [menuItems, setMenuItems] = useState([]); 
  const [discountContract, setDiscountContract] = useState(null);
  const [newDiscountDescription, setNewDiscountDescription] = useState('');
  const [newDiscountPercent, setNewDiscountPercent] = useState(0);
  const [newDiscountValidUntil, setNewDiscountValidUntil] = useState('');
  const [discounts, setDiscounts] = useState([]);

  // Initialize Web3 and contract on component mount
  useEffect(() => {
  /*  const initWeb3 = async () => {
      try {
        const w3 = new Web3(window.ethereum);
        const w3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:7545');
        const cafeContract = new w3.eth.Contract(Cafe_ABI, Cafe_ADDRESS);
        //const accounts = await w3.eth.getAccounts();
        const manager = await requestAccount();
        console.log(manager);
        setWeb3(w3);
        setContract(cafeContract);
        const discountContract = new w3.eth.Contract(Discount_ABI, Discount_ADDRESS);
        setDiscountContract(discountContract);
        // if (true) {
        //   const ids = await cafeContract.methods.nextItemId().call();
        //   setMenuItemIds([...Array(parseInt(ids)).keys()]);
        // } else {
        //   navigate('/');
        // }
      } catch (error) {
        console.error('Error initializing Web3:', error);
        alert("Error intializing Web3");
      }
    };
*/
const initWeb3 = async () => {
  try {
    const w3 = new Web3(window.ethereum);
        
    //const w3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:7545');
    const cafeContract = new w3.eth.Contract(Cafe_ABI, Cafe_ADDRESS);
    const discountContract = new w3.eth.Contract(Discount_ABI, Discount_ADDRESS);
    const manager = await requestAccount();
    console.log(manager);
    setWeb3(w3);
    setContract(cafeContract);
    setDiscountContract(discountContract);
  } catch (error) {
    console.error('Error initializing Web3:', error);
    alert(`Error initializing Web3: ${error.message}`);
  }
};

    initWeb3();
  }, [navigate]);




  const handleBackToHome = () => {
    // Navigate back to the home page
    navigate('/');
  };

  async function requestAccount() {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      return accounts[0];
    } catch (error) {
      console.error('User denied account access');
      return null;
    }
  }

  const handleViewMenu = async () => {
    try {
      const ids = await contract.methods.nextItemId().call();
      const menuItems = [];
      for (let i = 0; i < ids; i++) {
        const details = await contract.methods.getMenuItem(i).call();
        menuItems.push({
          id: parseInt(details[0]),
          name: details[1],
          price: parseInt(details[2]),
          available: details[3],
        });
      }
      setMenuItems(menuItems);
    } catch (error) {
      console.error('Error viewing menu:', error);
    }
  };

  const handleAddDiscount = async () => {
    try {
      const account_address = await requestAccount();
      const validUntilTimestamp = new Date(newDiscountValidUntil).getTime() / 1000;
      await discountContract.methods.addDiscount(newDiscountDescription, newDiscountPercent, validUntilTimestamp).send({
        from: account_address,
      });
    } catch (error) {
      console.error('Error adding discount:', error);
    }
  };


  const handleViewDiscounts = async () => {
    try {
      const ids = await discountContract.methods.nextDiscountId().call();
      const fetchedDiscounts = [];
      for (let i = 0; i < ids; i++) {
        const discount = await discountContract.methods.getDiscount(i).call();
        fetchedDiscounts.push({
          id : parseInt(discount[0]),
          description: discount[1],
          discountPercent: parseInt(discount[2]),
          validUntil: parseInt(discount[3]),
        });
      }
      setDiscounts(fetchedDiscounts);
    } catch (error) {
      console.error('Error viewing discounts:', error);
    }
  };



  const handleAddMenuItem = async () => {
    console.log('Button clicked');
    try {
      const account_address = await requestAccount();
      const priceInWei = parseInt(newItemPrice);
      console.log(typeof(priceInWei));
      // Call the addMenuItem function from the contract to add the new item
      await contract.methods.addMenuItem(newItemName, priceInWei).send({
        from: account_address,
        gasLimit: Web3.utils.toHex(150000), // Example gas limit, adjust based on your needs
        gasPrice: Web3.utils.toHex(Web3.utils.toWei('10', 'wei')) // Example gas price, adjust based on current network conditions
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  return (
      <div className="dashboard">
        <h2>Cafeteria Staff Dashboard</h2>
    
        {/* Menu Item Management Section */}
        <div className="menu-actions">
          <h3>Menu Actions</h3>
    
          {/* View Menu Items */}
          <div>
            <button className="blue-button" onClick={handleViewMenu}>
              View Menu
            </button>
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  ID {item.id} - {item.name} - Price: {item.price} FSC - Available: {item.available ? 'Yes' : 'No'}
                </li>
              ))}
            </ul>
          </div>
    
          {/* Add New Menu Item */}
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
              <label>Item Price:</label>
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
    
        {/* Discount Management Section */}
        <div className="discount-actions">
          <h3>Discount Actions</h3>
    
          {/* Add New Discount */}
          <div>
            <h4>Add New Discount</h4>
            <div>
              <label>Description:</label>
              <input
                type="text"
                value={newDiscountDescription}
                onChange={(e) => setNewDiscountDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Discount Percent:</label>
              <input
                type="number"
                value={newDiscountPercent}
                onChange={(e) => setNewDiscountPercent(e.target.value)}
              />
            </div>
            <div>
              <label>Valid Until:</label>
              <input
                type="date"
                value={newDiscountValidUntil}
                onChange={(e) => setNewDiscountValidUntil(e.target.value)}
              />
            </div>
            <button className="blue-button" onClick={handleAddDiscount}>
              Add Discount
            </button>
          </div>
    
          {/* View Discounts */}
          <div>
            <button className="blue-button" onClick={handleViewDiscounts}>
              View Discounts
            </button>
            <ul>
              {discounts.map((discount, index) => (
                <li key={index}>
                  ID {discount.id} - {discount.description} - {discount.discountPercent}% - Valid Until: {new Date(discount.validUntil * 1000).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
    
        {/* Navigation Button */}
        <div>
          <button className="button" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    );
}

export default CafeteriaStaffDashboard;
