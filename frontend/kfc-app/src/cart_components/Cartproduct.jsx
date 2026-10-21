import React, { useState } from 'react'
import styles from "./cart.module.css"
import api from "../utils/api";
import { useDispatch } from 'react-redux'
import { addcartcount } from '../redux/action'
import FoodImage from '../menu_components/FoodImage'

const Cartproduct = ({desc,id,image,price,qty,title,_id, fetchData}) => {
const dispatch= useDispatch();
const [count,setCount]= useState(qty);
let acprice=price.substring(1)
acprice=Number(acprice);

const handleRemove = () =>{
  api.delete(`/api/productcart/cart/${id}`)
  fetchData();
  console.log("Deleted")
}

  return (
    <div className={styles.cartproductmain} >
        <div className={styles.cartproductleft}>
            <FoodImage src={image} alt={title} />
            <div>
                <h3>{title}</h3>
                <ul>
                    <li>{desc}</li>
                </ul>
                <h3
                style={{cursor:'pointer'}}
                onClick={handleRemove}
                >Remove</h3>
            </div>
        </div>
        <div className={styles.cartproductright} >
            
                <button disabled={qty==1||count==1}
                onClick={()=>{
                  const el={
                    id:id,image,price,title,desc,qty:count-1
                  }
                  api.put(`/api/productcart/cart/${id}`,el)
                  .then(({data})=>{
                    dispatch(addcartcount(el));
                    setCount(count-1);
                    
                  })
                }
                }
                >&#8211;</button>
                <h4>{count}</h4>
                <button
                onClick={()=>{
                  
                  
                const el={
                id:id,image,price,title,desc,qty:count+1
                }
                api.put(`/api/productcart/cart/${id}`,el)
               .then(({data})=>{
                setCount(count+1)
                dispatch(addcartcount(el));
                })
                }}
                
                >&#43;</button>
                <h3>{Math.round(acprice*count)}</h3>
            
        </div>
    </div>
  )
}

export default Cartproduct