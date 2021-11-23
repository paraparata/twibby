import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Home.module.scss";
import Button from "../components/Button";
import Input from "../components/Input";

import { Context, setData as setGlobalData } from "../stores";
import type { DataType } from "../stores";

const Form = ({ onContinue }: { onContinue: (...args: any) => any }) => {
  const [data, setData] = useState<{
    from: string;
    to: string;
    message?: string;
  }>({
    from: "",
    to: "",
    message: "",
  });

  const handleOnChange = (type: "from" | "to" | "message", e: any) => {
    switch (type) {
      case "from":
        setData((prev: any) => ({ ...prev, from: e.target.value }));
        break;
      case "to":
        setData((prev: any) => ({ ...prev, to: e.target.value }));
        break;
      case "message":
        setData((prev: any) => ({ ...prev, message: e.target.value }));
        break;
      default:
        break;
    }
  };

  const handleOnContinue = () => {
    onContinue(data);
  };

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className={styles.form}
    >
      <div>
        <h3>Hi There!</h3>
        <span>Give him/her a warm light from virtual candle</span>
      </div>
      <div>
        <Input placeholder="From" onChange={(e) => handleOnChange("from", e)} />
        <Input placeholder="To" onChange={(e) => handleOnChange("to", e)} />
        <Input
          placeholder="Message"
          onChange={(e) => handleOnChange("message", e)}
        />
        <Button
          variant="text"
          disabled={!data.from || !data.to}
          onClick={handleOnContinue}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

const Uploader = ({
  onUploadImage,
  onContinue,
  onBack,
}: {
  onUploadImage: (...args: any) => any;
  onContinue: (...args: any) => any;
  onBack: (...args: any) => any;
}) => {
  const [selectedImage, setSelectedImage] = useState<any>();

  const handleUploadImage = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      onUploadImage(e.target.files[0]);
    }
  };

  return (
    <motion.div
      key="uploader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className={styles.uploader}
    >
      <div>
        {selectedImage ? (
          <div className={styles.preview}>
            <img src={URL.createObjectURL(selectedImage)} alt="Img" />
            <Button variant="text" onClick={() => setSelectedImage(null)}>
              Remove This Image
            </Button>
          </div>
        ) : (
          <>
            <span>Upload his/her photo</span>
            <Input accept="image/*" type="file" onChange={handleUploadImage} />
          </>
        )}
      </div>
      <div>
        <Button variant="text" disabled={!selectedImage} onClick={onContinue}>
          Continue
        </Button>
        <Button variant="text" onClick={onBack}>
          Back
        </Button>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(Context);
  const [current, setCurrent] = useState<"Form" | "Uploader">("Form");
  const [data, setData] = useState<DataType>({
    from: "",
    to: "",
    img: undefined,
    message: "",
  });

  const handleUploadImage = (imgData: any) => {
    if (imgData) {
      setData((prev) => ({ ...prev, img: imgData }));
    }
  };

  const handleForm = async (formData: any) => {
    setData((prev) => ({
      ...prev,
      from: formData.from,
      to: formData.to,
      message: formData.message,
    }));
    try {
      const res = await fetch(
        `http://localhost:4002/data/${formData.from}-${formData.to}`
      );
      const resData = await res.json();

      if (resData.status) {
        console.log(resData);

        dispatch(
          setGlobalData({
            from: resData.data.from,
            to: resData.data.to,
            img: resData.data.img,
            message: resData.data.message,
          })
        );
        navigate("/room");
      } else {
        setCurrent("Uploader");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnSave = async () => {
    const formToPost = new FormData();
    formToPost.append("from", data.from);
    formToPost.append("to", data.to);
    formToPost.append("img", data.img);
    formToPost.append("message", data.message || "");

    try {
      const resPost = await fetch(`http://localhost:4002/data`, {
        method: "POST",
        headers: {
          Accept: "multipart/form-data",
        },
        body: formToPost,
        credentials: "include",
      });
      const resPostData = await resPost.json();
      dispatch(
        setGlobalData({
          from: resPostData.from,
          to: resPostData.to,
          img: resPostData.img,
          message: resPostData.message,
        })
      );
      navigate("/room");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.root}>
      <div>
        {current === "Form" ? (
          <Form onContinue={handleForm} />
        ) : (
          <Uploader
            onUploadImage={handleUploadImage}
            onContinue={handleOnSave}
            onBack={() => setCurrent("Form")}
          />
        )}
      </div>
      <footer>
        <span>
          &#8212;{" "}
          <a href="https://paraparata.github.io" target="_blank">
            paraparata.github.io
          </a>{" "}
          &#8212;
        </span>
      </footer>
    </div>
  );
};

export default Home;
