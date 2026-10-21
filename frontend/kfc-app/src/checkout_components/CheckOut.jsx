import React from "react";
import RightSide from "../cart_components/RightSide";
import "./Checkout.css";
import ContactInfo from "./ContactInfo";
import DeliveryInfo from "./DeliveryInfo";
import DeliveryOpt from "./DeliveryOpt";
import { FaLock } from "react-icons/fa";

const CheckOut = () => {
  return (
    <div  className="checkout_container">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAeCAYAAAB5c901AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABNSURBVHgB7c9BDQAgAMPAgQ4c4F8KDvABFuBHSe+9LGmZ6SsXWkY52b3yW/M5A+kMpDOQzkA6A+kMpDOQzkA6A+kMpDOQzkA6A+kMpNu9MQhKmC+cDgAAAABJRU5ErkJggg=="
        alt=""
      />
      <h1>CHECKOUT</h1>
      <div style={{  display: "flex", marginLeft: "40%", marginTop: "-20px" }}>
        <FaLock size={16} aria-hidden="true" />
        <h4 style={{marginLeft: "10px"}}>Secure Checkout</h4>
      </div>
      <div style={{display:"flex"}} >
        <div>
          <DeliveryInfo />
          <DeliveryOpt />
          <ContactInfo />
        </div>
        <div>
           <RightSide/>
        </div>

      </div>
      
    </div>
  );
};

export default CheckOut;
