import React from "react";
import './InfoBox.css'
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({onClick, active, isRed, title, total, cases}) {
  return (
    <Card onClick={onClick} className={`infobox ${active && "infoBox--selected" } ${isRed && "infoBox--red"}`}>
      <CardContent>
          <Typography className="infoBox__title" color="textSecondary">
              {title}
          </Typography>
          <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>
          <Typography className="infoBox__total" color="textSecondary">
              {total} Total
          </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
