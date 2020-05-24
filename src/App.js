import React, { useState, useEffect } from "react";
import fileDownload from "js-file-download";
import worker from "workerize-loader!./worker"; // eslint-disable-line import/no-webpack-loader-syntax

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import MapIcon from "@material-ui/icons/Map";
import DeleteIcon from "@material-ui/icons/Delete";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Alert from "./components/Alert";
import Slider from "./components/Slider";
import LoopIcon from "@material-ui/icons/Loop";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import Fab from "@material-ui/core/Fab";
import Info from "./components/Info";
import FileReader from "./FileReader";

const workerInstance = worker();
const APP_VERSION = process.env.REACT_APP_VERSION;

const checkDataFormat = (coords) => {
  return (
    coords &&
    coords
      .split("\n")
      .filter((i) => i)
      .reduce((acc, l) => {
        const [lat, lng] = l.split(",");
        if (isNaN(lat) || isNaN(lng)) acc = false;
        return acc;
      }, true)
  );
};

const App = () => {
  const [coords, setCoords] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [normalPath, setNormalPath] = useState(true);
  const [twoOptCount, setTwoOptCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const saveFile = (fileData) => {
    const filename = prompt("Select file name", "default");
    setLoading(false);
    if (!filename) return;
    fileDownload(fileData, `${filename}.gpx`);
    setSuccess(true);

    setCoords("");
  };

  // Check for updates
  useEffect(() => {
    fetch("/api/info")
      .then((res) => res.json())
      .then((data) => {
        const latestVersion = data.latest_version;
        navigator.serviceWorker.ready.then(() => {
          if (latestVersion !== APP_VERSION)
            navigator.serviceWorker.controller.postMessage({
              type: "CLEAR_CACHE",
              version: latestVersion,
            });

          navigator.serviceWorker.addEventListener("message", (event) => event.data.msg === "CACHE_CLEARED" && window.location.reload(true));
        });
      });
  }, []);

  // Web worker listener
  useEffect(() => {
    workerInstance.addEventListener("message", ({ data: fileData }) => {
      if (typeof fileData !== "string") return;
      saveFile(fileData);
    });
  }, []);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const isRightFormat = checkDataFormat(coords);

    if (isRightFormat) {
      console.log(`${twoOptCount} iteractions`);

      setLoading(true);
      workerInstance.calculateRoute({ normalPath, coords, twoOptCount });
    } else {
      setError(true);
    }
  };

  const handleSliderChange = (evt) => {
    const value = +evt.target.textContent;
    value && setTwoOptCount(value);
  };

  const handleSuccessClose = () => setSuccess(false);

  const handleErrorClose = () => setError(false);

  const handleChange = (el) => setCoords(el.target.value);

  const clearCoordinates = () => setCoords("");

  const terminateWorker = () => {
    workerInstance.terminate();
    setLoading(false);
  };

  return (
    <React.Fragment>
      <CssBaseline />

      <Backdrop className="cover" open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Info open={showInfo} show={setShowInfo} />

      <AppBar position="relative">
        <Toolbar>
          <div className="header-logo">
            <MapIcon />
            <Typography variant="h6" color="inherit" noWrap>
              GPX Route Generator
            </Typography>
            <span className="app-version">{APP_VERSION}</span>
          </div>

          {loading ? (
            <IconButton aria-label="terminate" style={{ color: "white" }} onClick={terminateWorker}>
              <HighlightOffIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="delete" style={{ color: "white" }} onClick={clearCoordinates}>
              <DeleteIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="sm" id="main-container">
          <div className="row">
            <Fab className="floating-icon" color="primary" aria-label="add" onClick={() => setShowInfo(true)}>
              <PriorityHighIcon />
            </Fab>
            <Typography className="mobile-hidden" variant="h2" component="h2">
              GPX File Generation
            </Typography>
          </div>
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

          <div className="btn-group">
            <FileReader cb={setCoords} />
            <Button className={`path-btn ${normalPath ? "selected" : ""}`} variant="contained" color="primary" onClick={() => setNormalPath(true)}>
              Normal Path
            </Button>
            <Button className={`path-btn ${!normalPath ? "selected" : ""}`} variant="contained" color="primary" onClick={() => setNormalPath(false)}>
              Optimized Path
            </Button>
          </div>

          <div className={`slider-group  ${normalPath ? "is-hidden" : ""}`}>
            <LoopIcon className="slider-icon" />
            <Slider valueLabelDisplay="auto" aria-label="pretto slider" defaultValue={5} min={1} max={50} onChange={handleSliderChange} />
          </div>

          <Button className="submit-btn" variant="contained" color="primary" onClick={handleSubmit}>
            Generate {normalPath ? "Normal" : "Optimized"} GPX File
          </Button>
        </Container>
      </main>
    </React.Fragment>
  );
};

export default App;
