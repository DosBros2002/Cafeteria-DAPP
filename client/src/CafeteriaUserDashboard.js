import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import './CafeteriaUserDashboard.css';
import { Cafe_ABI, Cafe_ADDRESS, Order_ABI, Order_ADDRESS,FastCoin_ABI,FastCoin_ADDRESS,loyalty_ABI,loyalty_ADDRESS,Discount_ABI,Discount_ADDRESS } from './config.js';

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
  const [discounts, setDiscounts] = useState([]);
  const [accountBalance, setAccountBalance] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [fastCoinContract, setFastCoinContract] = useState(null);
  const [discountContract, setDiscountContract] = useState(null);
  const [loyaltyContract, setLoyaltyContract] = useState(null);
  const [menuItems, setMenuItems] = useState([]); 
  const [additionalPoints, setAdditionalPoints] = useState(0);



  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const w3 = new Web3(window.ethereum);
      
        const orderContractInstance = new w3.eth.Contract(Order_ABI, Order_ADDRESS);
        setOrderProcessingContract(orderContractInstance);

        const fastCoinContractInstance = new w3.eth.Contract(FastCoin_ABI, FastCoin_ADDRESS);
        setFastCoinContract(fastCoinContractInstance);

        const discountContractInstance = new w3.eth.Contract(Discount_ABI, Discount_ADDRESS);
        setDiscountContract(discountContractInstance);

        const cafeContractInstance = new w3.eth.Contract(Cafe_ABI, Cafe_ADDRESS);
        setCafeContract(cafeContractInstance);

        const loyaltyContractInstance = new w3.eth.Contract(loyalty_ABI, loyalty_ADDRESS);
        setLoyaltyContract(loyaltyContractInstance);
        const manager = await requestAccount();
        console.log(manager);
        setWeb3(w3);
      
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

  // const fetchMenuItems = async () => {
  //   try {

      
  //     const menuDetails = await contract.methods.getMenuItem(0).call();
  //     console.log('Fetched Menu Details:', menuDetails);

  //     setMenuDetails({
  //       itemIds: menuDetails[0].map(Number),
  //       itemNames: menuDetails[1],
  //     });
  //   } catch (error) {
  //     console.error('Error fetching menu items:', error);
  //   }
  // };

  const handleViewMenu = async () => {
    try {
      const ids = await cafeContract.methods.nextItemId().call();
      const menuItems = [];
      for (let i = 0; i < ids; i++) {
        const details = await cafeContract.methods.getMenuItem(i).call();
        menuItems.push({
          id: parseInt(details[0]),
          name: details[1],
          price: parseInt(details[2]),
          available: details[3],
        });
      }
      console.log(menuItems.price);
      setMenuItems(menuItems);
    } catch (error) {
      console.error('Error viewing menu:', error);
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
      console.log(typeof(discount));
      await orderProcessingContract.methods.placeOrder([itemIds],[quantitiesArray], discount).send({from: account_address});
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

  // Function to view account balance
  const viewAccountBalance = async () => {
    try {
      const account = await requestAccount();
      const balance = await fastCoinContract.methods.getBalance(account).call();
      console.log(balance.toString());
      setAccountBalance(balance.toString());
    } catch (error) {
      console.error('Error fetching account balance:', error);
    }
  };
  
  // Function to view loyalty points
  const viewLoyaltyPoints = async () => {
    try {
      const account = await requestAccount();
      await loyaltyContract.methods.earnPoints(account).call();
      const points = await loyaltyContract.methods.getPoints(account).call();
      await loyaltyContract.methods.earnPoints(account).call();
      console.log(parseInt(points));
      setAdditionalPoints(additionalPoints + 10);
      setLoyaltyPoints(parseInt(points) + additionalPoints);
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
    }
  };

  useEffect(() => {
    // Fetch menu items on component mount
   // fetchMenuItems();
  }, []); // Empty dependency array to run the effect only once on mount

 
  return (
    <div className="dashboard">
      <h2>Cafeteria User Dashboard</h2>
  
      {/* View Menu Items Section */}
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
  
      {/* View Discounts Section */}
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
  
      {/* View Account Balance Section */}
      <div>
        <button className="blue-button" onClick={viewAccountBalance}>
          View Account Balance
        </button>
        <div>Balance: {accountBalance} FSC</div>
      </div>
  
      {/* View Loyalty Points Section */}
      <div>
        <button className="blue-button" onClick={viewLoyaltyPoints}>
          View Loyalty Points
        </button>
        <div>Loyalty Points: {loyaltyPoints}</div>
      </div>
  
      {/* Place Order Section */}
      <div>
        <h3>Place an Order</h3>
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
          <label>Discount Percentage:</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
          />
        </div>
        <div>
          <button className="blue-button" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
  
      {/* Back to Home Button */}
      <div>
        <button className="button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
  
}

export default CafeteriaUserDashboard;