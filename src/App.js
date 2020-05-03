import React, { useState } from "react";
import fileDownload from "js-file-download";
import GetGPXFile from "gpx-route-generator-core";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import MapIcon from "@material-ui/icons/Map";
import DeleteIcon from "@material-ui/icons/Delete";
import Alert from "./components/Alert";

const checkDataFormat = (coords) => {
  return coords
    .split("\n")
    .filter((i) => i)
    .reduce((acc, l) => {
      const [lat, lng] = l.split(",");
      if (isNaN(lat) || isNaN(lng)) acc = false;
      return acc;
    }, true);
};

const App = () => {
  const [coords, setCoords] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const isRightFormat = checkDataFormat(coords);

    if (isRightFormat) {
      const fileData = GetGPXFile(coords);
      const filename = prompt("Select file name", "default");

      if (!filename) return;

      fileDownload(fileData, `${filename}.gpx`);
      setSuccess(true);
      setCoords("");
    } else {
      setError(true);
    }
  };

  const handleSuccessClose = () => setSuccess(false);

  const handleErrorClose = () => setError(false);

  const handleChange = (el) => setCoords(el.target.value);

  const clearCoordinates = () => setCoords("");

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <div className="header-logo">
            <MapIcon />
            <Typography variant="h6" color="inherit" noWrap>
              GPX Route Generator
            </Typography>
          </div>
          <IconButton aria-label="delete" style={{ color: "white" }} onClick={clearCoordinates}>
            <DeleteIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="sm" id="main-container">
          <Typography className="mobile-hidden" variant="h2" component="h2">
            GPX File Generation
          </Typography>
          <textarea className="coords-textarea" placeholder="Paste coordinates here..." value={coords} onChange={handleChange}></textarea>

          {error ? (
            <Alert className="notification-snack" severity="error" onClose={handleErrorClose}>
              Error on the coordinates format
            </Alert>
          ) : (
            ""
          )}

          {success ? (
            <Alert className="notification-snack" severity="success" onClose={handleSuccessClose}>
              File generated with success
            </Alert>
          ) : (
            ""
          )}

          <Button className="submit-btn" variant="contained" color="primary" onClick={handleSubmit}>
            Generate GPX File
          </Button>
        </Container>
      </main>
    </React.Fragment>
  );
};

export default App;
