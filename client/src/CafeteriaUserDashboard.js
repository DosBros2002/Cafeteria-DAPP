import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import './CafeteriaUserDashboard.css';
import { Cafe_ABI, Cafe_ADDRESS, Order_ABI, Order_ADDRESS } from './config.js';

function CafeteriaUserDashboard() {
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [menuDetails, setMenuDetails] = useState({
    itemIds: [],
    itemNames: [],
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderProcessingContract, setOrderProcessingContract] = useState(null);
  const [orderId, setOrderId] = useState(0);
  const [cafeContract, setCafeContract] = useState(null);
  
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);


  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const w3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:7545');
        const orderContract = new w3.eth.Contract(Order_ABI, Order_ADDRESS);
        //const accounts = await w3.eth.getAccounts();
        const manager = await requestAccount();
        console.log(manager);
        setWeb3(w3);
        setContract(orderContract);

        // if (true) {
        //   const ids = await orderContract.methods.nextItemId().call();
        //   setMenuItemIds([...Array(parseInt(ids)).keys()]);
        // } else {
        //   navigate('/');
        // }
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

  const fetchMenuItems = async () => {
    try {

      const contract = new web3.eth.Contract(Cafe_ABI, Cafe_ADDRESS);
      const manager = await requestAccount();
      console.log(manager);
      setCafeContract(contract);

      // Call the viewMenu function from the OrderProcessing contract
      const menuDetails = await contract.methods.getMenuItem(0).call();
      console.log('Fetched Menu Details:', menuDetails);

      setMenuDetails({
        itemIds: menuDetails[0].map(Number),
        itemNames: menuDetails[1],
      });
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };


  const handlePlaceOrder = async () => {
    console.log("here");
    try {
      // Check if items are selected

      // Convert selectedItems and quantities to arrays of integers
      const account_address = await requestAccount();       
      const itemIds = parseInt(orderId);
      const quantitiesArray = parseInt(orderQuantity);
      const discount = parseInt(discountPercentage);
      // Call the placeOrder function from the OrderProcessing contract
      console.log(orderId);
      console.log(orderQuantity);
      console.log(typeof(discountPercentage));
      await contract.methods.placeOrder([itemIds],[quantitiesArray], discount).send({from: account_address});
      // Clear selected items, quantities, and reset order details
      setSelectedItems([]);
      setQuantities([]);
      setTotalPrice(0);
      setOrderId(0);
      setOrderQuantity(0);
      setDiscountPercentage(0);
    } catch (error) {
      console.error('Error placing order:', error);
      //alert('Failed to place the order. Please try again.');
    }
  };

  const handleGetTotalPrice = async () => {
    try {
      const itemIds = selectedItems.map(Number);
      const quantitiesArray = quantities.map(Number);
      const totalPrice = await orderProcessingContract.methods
        .getTotalPrice(itemIds, quantitiesArray, discountPercentage)
        .call({ from: (await web3.eth.getAccounts())[0] }); // Replace with the actual account

      // Update the state with the calculated total price
      setTotalPrice(totalPrice);
    } catch (error) {
      console.error('Error getting total price:', error);
    }
  };

  const handleCheckboxChange = (itemId, isChecked) => {
    // Update selected items based on checkbox selection
    if (isChecked) {
      setSelectedItems((prevItems) => [...prevItems, itemId]);
    } else {
      setSelectedItems((prevItems) =>
        prevItems.filter((item) => item !== itemId)
      );
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    // Update quantities based on input change
    setQuantities((prevQuantities) => {
      const updatedQuantities = [...prevQuantities];
      const index = selectedItems.indexOf(itemId);

      if (index !== -1) {
        updatedQuantities[index] = quantity;
      }

      return updatedQuantities;
    });
  };

  useEffect(() => {
    // Fetch menu items on component mount
    fetchMenuItems();
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div className="dashboard">
      <h2>Cafeteria User Dashboard</h2>

      {/* Display menu items and checkboxes for selection */}
      <div>
        {menuDetails.itemIds.map((itemId, index) => (
          <div key={itemId}>
            <input
              type="checkbox"
              checked={selectedItems.includes(itemId)}
              onChange={(e) => handleCheckboxChange(itemId, e.target.checked)}
            />
            <span>{menuDetails.itemNames[index]}</span>
            <input
              type="number"
              value={quantities[selectedItems.indexOf(itemId)] || ''}
              onChange={(e) => handleQuantityChange(itemId, e.target.value)}
              disabled={!selectedItems.includes(itemId)}
            />
          </div>
        ))}
      </div>

      {/* Enter Order ID, Order Quantity, and Discount Percentage */}
      <div>
        <label>Order ID:</label>
        <input
          type="number"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      </div>
      <div>
        <label>Order Quantity:</label>
        <input
          type="number"
          value={orderQuantity}
          onChange={(e) => setOrderQuantity(e.target.value)}
        />
      </div>
      <div>
        <label>Discount ID:</label>
        <input
          type="number"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
        />
      </div>

      {/* View Total Price */}
      <div>
        <button className="blue-button" onClick={handleGetTotalPrice}>
          View Total Price
        </button>{' '}
        <br />
        {totalPrice > 0 && <div>Total Price: {totalPrice}</div>}
      </div>

      {/* Place Order */}
      <div>
        <button className="blue-button" onClick={handlePlaceOrder}>
          Place Order
        </button>{' '}
        <br />
      </div>

      <div>
        <button className="button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default CafeteriaUserDashboard;
