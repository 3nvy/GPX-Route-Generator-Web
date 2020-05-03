import React from "react";
import MuiAlert from "@material-ui/lab/Alert";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} style={{ width: "100%", borderRadius: 0 }} />;
};

export default Alert;
