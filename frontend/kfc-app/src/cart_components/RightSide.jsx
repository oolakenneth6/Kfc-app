import React, { useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../utils/api";
import { FaTags } from "react-icons/fa";
import "../pages/Cart.css"

const RightSide = () => {
    const [input, setInput] = useState(false);
    const [stotal,setstotal]= useState(0);
    const paymentKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
    const paymentMode = (
      process.env.REACT_APP_PAYMENT_MODE || (paymentKey ? "razorpay" : "demo")
    ).toLowerCase();
    const [demoPaymentOpen, setDemoPaymentOpen] = useState(false);
    const [demoOrder, setDemoOrder] = useState(null);
    const [demoOrderError, setDemoOrderError] = useState("");
    const [demoOrderSubmitting, setDemoOrderSubmitting] = useState(false);
    const cart= useSelector((state)=>state.cart)
    const navigate= useNavigate();
    const location = useLocation();
    console.log(location.pathname)
    let path= location.pathname;

    useEffect(()=>{
      let total= cart.reduce((acc,el)=>{
        const price = Number(el.price.replace(/[^\d.]/g, ""));
        return acc + price * el.qty;
    },0)
    setstotal(Math.round(total * 100) / 100)
    },[cart])
    
    const handleInput = () => {
      setInput(!input);
    };

    const initPayment = (data) => {
      if (typeof window.Razorpay !== "function") {
        window.alert("Razorpay Checkout did not load. Please refresh and try again.");
        return;
      }

      const options = {
        key: paymentKey,
        amount: data.amount,
        currency: data.currency,
        name: "Kentucky Fried Chicken",
        description: "You Total Amount",
        order_id: data.id,
        handler: async (response) => {
          try {
            const { data: verification } = await api.post("/api/payment/verify", response);
            window.alert(verification.message);
          } catch (err) {
            window.alert("Payment verification failed. Please contact support.");
            console.error("Payment verification failed:", err);
          }
        },
        theme: {
          color: "#a50000",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    };

    const handlePayment = async () => {
      if (cart.length === 0) {
        window.alert("Add items to your cart before paying.");
        return;
      }

      if (paymentMode === "demo") {
        setDemoOrder(null);
        setDemoOrderError("");
        setDemoPaymentOpen(true);
        return;
      }

      if (paymentMode !== "razorpay") {
        window.alert("The selected payment mode is not supported.");
        return;
      }

      if (!paymentKey) {
        window.alert("Online payment is not configured for this app.");
        return;
      }

      try {
        const { data } = await api.post("/api/payment/orders", {
          items: cart.map(({ id, qty }) => ({ id, qty })),
        });
        initPayment(data.data);
      } catch (err) {
        window.alert(
          err.response?.data?.message || "Unable to start payment. Please try again."
        );
        console.error("Unable to start payment:", err);
      }
    };

    const completeDemoOrder = async () => {
      setDemoOrderSubmitting(true);
      setDemoOrderError("");

      try {
        const { data } = await api.post("/api/payment/demo-orders", {
          items: cart.map(({ id, qty }) => ({ id, qty })),
        });
        setDemoOrder(data.order);
      } catch (err) {
        setDemoOrderError(
          err.response?.data?.message || "Unable to place the demo order. Please try again."
        );
        console.error("Unable to place demo order:", err);
      } finally {
        setDemoOrderSubmitting(false);
      }
    };
    
  return (
    <>
         <h2 className="reciept_heading">{cart.length} ITEMS</h2>
          <div className="offers_deals_container">
            <FaTags size={22} color="#e4002b" aria-hidden="true" />
            <span className="cart_offers_text">Apply Offers & Deals</span>
            <button className="viewAll_button">View All</button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <div>SubTotal</div>
            <div>₹{stotal}</div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <div>GST</div>
            <div>₹{stotal}</div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <div style={{ marginRight: "20px" }}>
              Restaurant Handling (Incl. Taxes)
            </div>
            <div>₹{stotal}</div>
          </div>
          {input ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <div style={{ marginRight: "20px" }}>Add Hope</div>
              <div>₹5</div>
            </div>
          ) : (
            ""
          )}

          <hr
            style={{ color: "grey", marginTop: "20px", marginBottom: "20px" }}
          />
          <div className="donation_box">
            <div>
              <input onInput={handleInput} type="checkbox" />
            </div>
            <div style={{ marginTop: "-17px" }}>
              <p>Donate ₹5.00 Tick to Add Hope.</p>
              <p>Our goal is to feed 20 million people by 2022.</p>
            </div>
            <div>
              <img
                src="data:image/png;base64,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"
                alt=""
              />
            </div>
          </div>
          {path=="/cart"?(   <button onClick={()=>navigate("/checkout")} className="redButton">
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <p>Checkout</p>
              <p>₹{!input?stotal:stotal+5}</p>
            </div>
          </button>):(   <button onClick={handlePayment} className="redButton">
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <p>{paymentMode === "demo" ? "Pay (Demo)" : "Payment"}</p>
              <p>₹{!input?stotal:stotal+5}</p>
            </div>
          </button>)}
          {demoPaymentOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="demo-payment-title"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                display: "grid",
                placeItems: "center",
                padding: "1rem",
                background: "rgba(0, 0, 0, 0.55)",
              }}
            >
              <div
                style={{
                  width: "min(100%, 28rem)",
                  padding: "2rem",
                  borderRadius: "0.5rem",
                  background: "white",
                  color: "#202124",
                }}
              >
                <h2 id="demo-payment-title">{demoOrder ? "Demo order placed" : "Demo order"}</h2>
                <p>
                  {demoOrder
                    ? `Order ${demoOrder.orderNumber} was saved for ₹${(demoOrder.amountPaise / 100).toFixed(2)}. This is a demo only: no money was taken and the order will not be fulfilled.`
                    : `Place a demo order for ₹${!input ? stotal : stotal + 5}? No real payment will be made.`}
                </p>
                {demoOrderError && <p role="alert">{demoOrderError}</p>}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {!demoOrder && (
                    <button
                      type="button"
                      onClick={completeDemoOrder}
                      className="redButton"
                      disabled={demoOrderSubmitting}
                    >
                      {demoOrderSubmitting ? "Placing order..." : "Place demo order"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setDemoPaymentOpen(false)}
                    disabled={demoOrderSubmitting}
                  >
                    {demoOrder ? "Close" : "Cancel"}
                  </button>
                </div>
              </div>
            </div>
          )}
       
    </>
  )
}

export default RightSide