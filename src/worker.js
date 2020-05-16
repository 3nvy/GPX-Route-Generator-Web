var GetGPXFile = require("gpx-route-generator-core");

export const calculateRoute = ({ normalPath, coords, twoOptCount }) => {
  var fileData = normalPath ? GetGPXFile(coords) : GetGPXFile(coords, "2OPT", twoOptCount);
  postMessage(fileData);
};
