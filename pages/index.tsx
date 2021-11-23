import {
  DetailedHTMLProps,
  VideoHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "../styles/Home.module.scss";
import { Button, Input } from "../components";
import { downloader } from "../utils";

const Home: NextPage = () => {
  const video = useRef<
    | DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
    | any
  >({});
  const canvas = useRef<any>({});
  const [streaming, setStreaming] = useState(false);
  const [outputImg, setOutputImg] = useState<any>();
  const [currentHeight, setCurrentHeight] = useState(0);
  const [selectedImage, setSelectedImage] = useState<any>();
  const [step, setStep] = useState<"booth" | "result">("booth");
  const width = 400;
  let height = 0;

  const handleUploadImage = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleVideo = () => {
    if (!streaming) {
      height = video.current.videoHeight / (video.current.videoWidth / width);
      setCurrentHeight(height);
      console.log(video.current.videoHeight, video.current.videoWidth);

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
      canvas.current.height = width;
      context.drawImage(
        video.current,
        -(0.125 * video.current.videoWidth) /
          (video.current.videoHeight / width),
        0,
        video.current.videoWidth / (video.current.videoHeight / width),
        width
      );
      context.drawImage(document.getElementById("frame"), 0, 0, width, width);

      const data = canvas.current.toDataURL("image/png");

      setOutputImg(data);
      setStep("result");
    } else {
      setOutputImg(undefined);
    }
    e.preventDefault();
  };

  const handleOnDownload = () => {
    downloader(outputImg);
  };

  useEffect(() => {
    if (step) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(function (stream) {
          video.current.srcObject = stream;
          video.current.play();
        })
        .catch(function (err) {
          console.log("An error occurred: " + err);
        });
    }
  }, [step]);

  return (
    <div className={styles.root}>
      <Head>
        <title>Twibby</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <span data-title="true">twibby</span>
      </header>
      <main>
        {step === "booth" ? (
          <motion.div
            key="booth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className={styles.booth}
          >
            <div className={styles.preview}>
              <canvas ref={canvas} style={{ display: "none" }}></canvas>
              <video ref={video} onCanPlay={handleVideo}>
                Video stream not available.
              </video>
              {selectedImage && (
                <img
                  id="frame"
                  src={URL.createObjectURL(selectedImage)}
                  alt="The screen capture will appear in this box."
                />
              )}
              <Input
                accept="image/*"
                type="file"
                placeholder="Upload frame"
                onChange={handleUploadImage}
              />
            </div>
            <div>
              <Button
                icon
                style={{ position: "relative" }}
                onClick={handleOnCapture}
              >
                <Image src="/camera.svg" alt="capture" width={30} height={30} />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className={styles.result}
          >
            <div className="output">
              {outputImg && (
                <img
                  src={outputImg}
                  alt="The screen capture will appear in this box."
                />
              )}
            </div>
            <Button block onClick={() => setStep("booth")}>
              Back
            </Button>
            <Button block onClick={handleOnDownload}>
              Download
            </Button>
          </motion.div>
        )}
      </main>
      <footer>
        Brought to you by{" "}
        <a
          href="https://paraparata.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>paraparata.github.io</span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
