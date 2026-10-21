import React, { useState } from 'react'
import styles from "./item.module.css"
import api from '../utils/api'
import { useDispatch, useSelector } from 'react-redux';
import { addcart, addcartcount } from '../redux/action';
import { useNavigate } from 'react-router-dom';
import FoodImage from './FoodImage';
import cartIcon from '../assets/svg/cart.svg';

const Item = ({_id,image,price,title,desc}) => {
    const [count,setCount]= useState(0)
    const navigate= useNavigate();
    const cart= useSelector((state)=>state.cart);
    const dispatch = useDispatch();
  return (
    <div className={styles.innerbox} >
      <FoodImage onClick={()=>{
        navigate(`/menu/${_id}`)
      }} src={image} alt={title} />
      <div>
        <h3 className={styles.title} >{title}</h3>
        <p><span style={{fontSize:"11px",background:"red",color:"red",borderRadius:"50%"}} >12</span> Non veg</p>
        <h3>{price}</h3>       
        <p className={styles.desc} >{desc}</p>
        <div className={styles.cartbutton}
        
        >
          <h3> {!count?(<p className={styles.addto}
            onClick={ ()=>{
            setCount(count+1)
            const el={
                id:_id,image,price,title,desc,qty:count+1
            }
            api.post("/api/productcart/cart",el)
            .then(()=>dispatch(addcart(el)))
            
            }}> Add to cart</p>):(<div>

              
            <button
            className={styles.minus}
            onClick={()=>{setCount(count-1)
             const el={
                id:_id,image,price,title,desc,qty:count-1
            }
            api.put(`/api/productcart/cart/${_id}`,el)
            .then(()=>{
              dispatch(addcartcount(el));
            })
            } }>&#8211;</button>

            <span>{count}</span>


            <button 
            className={styles.plus}
            onClick={()=>{setCount(count+1)
            const el={
                id:_id,image,price,title,desc,qty:count+1
            }
            api.put(`/api/productcart/cart/${_id}`,el)
            .then(()=>{
              dispatch(addcartcount(el));
            })
            }} >&#43;</button>


           </div>)} </h3>
          <img 
          style={{cursor:"pointer"}}
          onClick={()=>{
            navigate("/cart")
          }} src={cartIcon} alt="Open cart" />
       </div>
      </div>
    </div>
  )
}

export default Item