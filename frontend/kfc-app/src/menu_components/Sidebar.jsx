import smoothScrollTo from "../utils/smoothScrollTo"
import styles from "./item.module.css"
import { FaTag } from "react-icons/fa"

export const Sidebar= ()=>{



    return (
        <div className={styles.sidebox}>
          <FaTag size={32} color="#e4002b" aria-hidden="true" />
          <h1>KFC MENU</h1>
          <h3 onClick={()=>{
            smoothScrollTo("chicken")
          }} >CHICKEN BUCKETS</h3>
          <h3 onClick={()=>{
            smoothScrollTo("launch")
          }} >NEW LAUNCH</h3>
          <h3 onClick={()=>{
            smoothScrollTo("rolls")
          }} >CHICKEN ROLLS</h3>
          <h3 onClick={()=>{
            smoothScrollTo("biryani")
          }} >BIRYANI BUCKETS</h3>
          <h3 onClick={()=>{
            smoothScrollTo("box")
          }} >BOX MEALS</h3>
          <h3 onClick={()=>{
            smoothScrollTo("burger")
          }} >BURGERS</h3>
          <h3 onClick={()=>{
            smoothScrollTo("stayhome")
          }} >STAY HOME SPECIALS</h3>
          <h3 onClick={()=>{
            smoothScrollTo("snacks")
          }} >SNACKS</h3>
          <h3 onClick={()=>{
            smoothScrollTo("beverage")
          }} >BEVERAGES</h3>
        </div>
    )
}