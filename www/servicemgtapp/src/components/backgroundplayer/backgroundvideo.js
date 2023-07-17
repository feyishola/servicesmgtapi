import ReactPlayer from "react-player";
import Servicemgtvideo from "./ssmgt.mp4";

const BackgroundPlayer = ({ children }) => {
  return (
    <div className="backgroundPlayer">
      <div
        className="backgroundOverlay"
        style={{
          // position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          // backgroundBlendMode: "darken",
          backgroundColor: "rgba(0,0,0,0.75)",
          filter: "brightness(40%)",
        }}
      >
        <ReactPlayer
          url={Servicemgtvideo}
          playing
          loop
          muted
          width="100%"
          height="100%"
        />
      </div>
      {/* Other content or components */}
      <div className="contentWrapper">{children}</div>
    </div>
  );
};

export default BackgroundPlayer;
