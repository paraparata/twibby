import {
  DetailedHTMLProps,
  VideoHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Twibbon.module.scss";

const downloader = (uri: string, name = "twibbon.png") => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove();
};

const Twibbon = () => {
  const video = useRef<
    | DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
    | any
  >({});
  const canvas = useRef<any>({});
  const [streaming, setStreaming] = useState(false);
  const [outputImg, setOutputImg] = useState<any>();
  const [currentHeight, setCurrentHeight] = useState(0);
  const width = 320;
  let height = 0;

  const handleVideo = () => {
    if (!streaming) {
      height = video.current.videoHeight / (video.current.videoWidth / width);
      setCurrentHeight(height);

      video.current.setAttribute("width", width);
      video.current.setAttribute("height", height);
      canvas.current.setAttribute("width", width);
      canvas.current.setAttribute("height", height);
      setStreaming(true);
    }
  };

  const handleOnCapture = (e: any) => {
    const context = canvas.current.getContext("2d");
    if (width && currentHeight) {
      console.log(currentHeight);
      canvas.current.width = width;
      canvas.current.height = currentHeight;
      context.drawImage(video.current, 0, 0, width, currentHeight);
      context.drawImage(
        document.getElementById("frame"),
        0,
        0,
        width,
        currentHeight
      );

      const data = canvas.current.toDataURL("image/png");

      setOutputImg(data);
    } else {
      setOutputImg(undefined);
    }
    e.preventDefault();
  };

  const handleOnDownload = () => {
    downloader(outputImg);
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        video.current.srcObject = stream;
        video.current.play();
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
  }, []);

  return (
    <div className={styles.root}>
      <div>
        <div className={styles.preview}>
          <video ref={video} onCanPlay={handleVideo}>
            Video stream not available.
          </video>
          <img
            id="frame"
            src="/assets/img/frame-twibbon.png"
            alt="The screen capture will appear in this box."
          />
        </div>
        <div>
          <button onClick={handleOnCapture}>Take photo</button>
          <button onClick={handleOnDownload}>Download</button>
        </div>
      </div>
      <div>
        <canvas ref={canvas} style={{ display: "none" }}></canvas>
        <div className="output">
          {outputImg && (
            <img
              src={outputImg}
              alt="The screen capture will appear in this box."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Twibbon;
