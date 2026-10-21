import React, { useState } from "react";
import fallbackImage from "../assets/menu-food-fallback.svg";
import biryaniImage from "../assets/menu-biryani.jpg";
import bucketImage from "../assets/menu-bucket.jpg";
import burgerImage from "../assets/menu-burger.jpg";
import chickenImage from "../assets/menu-chicken.jpg";
import dessertImage from "../assets/menu-dessert.jpg";
import drinkImage from "../assets/menu-drink.jpg";
import friesImage from "../assets/menu-fries.jpg";
import popcornImage from "../assets/menu-popcorn.jpg";
import minglesImage from "../assets/menu-mingles.jpg";
import smokyRedImage from "../assets/menu-smoky-red.jpg";
import rollImage from "../assets/menu-roll.jpg";

const getFallbackImage = (title = "") => {
  const itemName = title.toLowerCase();

  if (itemName.includes("5pc smoky red chicken")) {
    return smokyRedImage;
  }

  if (itemName.includes("mingles bucket meal")) {
    return minglesImage;
  }

  if (itemName.includes("bucket for two")) {
    return bucketImage;
  }

  if (/\b(roll|rolls|wrap|twister)\b/.test(itemName)) {
    return rollImage;
  }

  if (/\b(pepsi|cola|soda|beverage|drink|water)\b/.test(itemName)) {
    return drinkImage;
  }

  if (/\bpopcorn\b/.test(itemName)) {
    return popcornImage;
  }

  if (itemName.includes("classic chicken biryani bucket")) {
    return biryaniImage;
  }

  if (/\b(biryani|rice)\b/.test(itemName)) {
    return biryaniImage;
  }

  if (/\b(bucket|feast|mingles)\b/.test(itemName)) {
    return bucketImage;
  }

  if (/\b(burger|zinger|krispers|krunch|sandwich)\b/.test(itemName)) {
    return burgerImage;
  }

  if (/\b(fr[iy]es|potato)\b/.test(itemName)) {
    return friesImage;
  }

  if (/\b(choco|dessert|pie|cake)\b/.test(itemName)) {
    return dessertImage;
  }

  return chickenImage;
};

const FoodImage = ({ src, alt, ...imageProps }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const categoryImage = getFallbackImage(alt);
  const imageSrc =
    failedSrc === categoryImage
      ? fallbackImage
      : src && src !== failedSrc
      ? src
      : categoryImage;

  return (
    <img
      {...imageProps}
      src={imageSrc}
      alt={alt || "Menu item"}
      onError={() => {
        if (imageSrc !== fallbackImage) {
          setFailedSrc(imageSrc);
        }
      }}
    />
  );
};

export default FoodImage;
