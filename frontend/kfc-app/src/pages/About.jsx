import React from 'react';
import styles from "./CareersAbout.module.css";

let imgsrc = require("./about.jpg");

const About = () => {
  return (
    <div className={styles.careersDiv}>
      <img src={imgsrc} alt="About KFC" />
    </div>
  );
}

export default About;