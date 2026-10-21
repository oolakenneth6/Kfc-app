import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Item from "../menu_components/Item";
import styles from "./cart.module.css";
import api from "../utils/api";
const Bottom = () => {
  let [recom, setrecom] = useState([]);
  useEffect(() => {
    api
      .get("/api/searchapi/item/?search=meal")
      .then(({ data }) => {
        setrecom(data);
      });
  }, []);

  return (
    <>
      <h2>Top Recommended Meals</h2>
      <div className={styles.toprecom}>
        {recom.map((el, index) => {
          return <Item key={index} {...el} />;
        })}
      </div>
    </>
  );
};

export default Bottom;
