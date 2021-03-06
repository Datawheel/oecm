import React from "react";

const AnchorList = ({items, name, url}) =>
  <span>
    {items.map((item, index) =>
      <span key={index}>
        {index && index === items.length - 1 ? " and " : null }
        <a href={url(item)}>{name(item)}</a>
        {items.length !== 2 ? index < items.length - 1 ? ", " : null : null}
      </span>
    )}
  </span>;

export default AnchorList;
