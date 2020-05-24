import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import EjectIcon from "@material-ui/icons/Eject";

const Info = ({ open, show }) => (
  <Dialog className="info-dialog" open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
    <DialogTitle id="alert-dialog-title" className="info-title">
      <div className="row">
        <CloseIcon onClick={() => show(false)} />
        Information
      </div>
    </DialogTitle>

    <DialogContent>
      <DialogTitle id="alert-dialog-title" style={{ paddingLeft: 0 }}>
        <div className="row">
          <EjectIcon />
          Import GPX File
        </div>
      </DialogTitle>
      <DialogContentText id="alert-dialog-description">
        Grabs the coordinates of a GPX files and place them on the textarea for optimization.
      </DialogContentText>

      <br></br>

      <DialogTitle id="alert-dialog-title" style={{ paddingLeft: 0 }}>
        Normal Path
      </DialogTitle>
      <DialogContentText id="alert-dialog-description">
        Generates a GPX File based on the order you provided, no optimization is done.
      </DialogContentText>

      <br></br>

      <DialogTitle id="alert-dialog-title" style={{ paddingLeft: 0 }}>
        Optimized Path
      </DialogTitle>
      <DialogContentText id="alert-dialog-description">
        Generates a GPX File using an optimization algorithm. When selected, you will be presented with a slider from 1 to 50. This represents the
        number of interactions the algorithm will perform optimizations on your coordinates. The higher the number, the more optimized your route will
        be, but at the cost of being slower to calculate. For performance reasons, I've capped the max to 50 interactions as there's little to no
        benefit over that number, and the calculation time will increase exponentially.
      </DialogContentText>
      <DialogContentText id="alert-dialog-description">
        Depending on the number of coordinates and number of interactions, the algorithm can take several minutes to calculate, so if it feels like
        the app crashed, don't worry, it's still calculating on the background.
      </DialogContentText>
      <DialogContentText id="alert-dialog-description">
        You can also terminate the calculation at any time by pressing the close button at the top-right corner and adjust the interaction number if
        it's taking too long.
      </DialogContentText>
      <br></br>
    </DialogContent>
  </Dialog>
);

export default Info;
