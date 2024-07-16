import { useEffect, useRef, useState } from "react";
import QRFrame from "../assets/qr-frame.svg";
import QrScanner from "qr-scanner";

const QRReader = ({ scanner, onScanSuccess, onScanFail }) => {
  //   const scanner = useRef();
  const videoRef = useRef(null);
  const qrBoxRef = useRef(null);

  const [qrCodeOn, setQrCodeOn] = useState(true);

  useEffect(() => {
    if (videoRef?.current && !scanner.current) {
      scanner.current = new QrScanner(videoRef?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxRef?.current,
      });

      scanner?.current
        ?.start()
        .then(() => setQrCodeOn(true))
        .catch((err) => {
          if (err) setQrCodeOn(false);
        });
    }

    return () => {
      if (!videoRef?.current) {
        scanner?.current?.stop();
      }
    };
  }, [qrCodeOn]);

  useEffect(() => {
    if (!qrCodeOn) {
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and reload"
      );
    }
  }, [qrCodeOn]);

  return (
    <div className="qr-reader">
      {/* OR */}
      <video ref={videoRef}></video>
      <div ref={qrBoxRef} className="qr-box">
        {/* {!videoRef?.current && ( */}
        <img src={QRFrame} alt="" className="qr-frame" />
        {/* )} */}
      </div>

      {/* {qrContent && (
    <p
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 99999,
        color: "white",
      }}
    >
      Scanned Result: {qrContent}
    </p>
  )} */}
    </div>
  );
};
export default QRReader;
