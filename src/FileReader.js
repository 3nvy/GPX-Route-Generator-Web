import React from "react";
import Button from "@material-ui/core/Button";
import EjectIcon from "@material-ui/icons/Eject";
import ReactFileReader from "react-file-reader";

const FileReader = ({ cb }) => {
  let fileReader;

  const handleFileRead = () => {
    const content = fileReader.result.split("\n");

    const filteredLines = content.filter((l) => l.includes("lat=") && l.includes("lon="));

    const coordinates = filteredLines.reduce((acc, c) => {
      const lat = c.match('lat="(.*?)"');
      const lon = c.match('lon="(.*?)"');

      if (lat && lon) acc.push(`${lat[1]}, ${lon[1]}`);
      return acc;
    }, []);

    if (!coordinates.length) alert("No valid coordinates were found on the document");

    if (cb) cb(coordinates.join("\n"));
  };

  const handleFileUpload = (fileList) => {
    fileReader = new window.FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(fileList[0]);
  };

  return (
    <ReactFileReader fileTypes={[".gpx"]} multipleFiles={false} handleFiles={handleFileUpload}>
      <Button className="inject-btn" variant="contained">
        <EjectIcon />
      </Button>
    </ReactFileReader>
  );
};

export default FileReader;
