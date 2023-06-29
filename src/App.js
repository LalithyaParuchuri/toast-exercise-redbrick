import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";

import Header from "./Header";
import Content from "./Content";

import { saveLikedFormSubmission, onMessage } from "./service/mockServer";

// Number of times to fetch the data even when the server throws error
const MAX_RETRIES = 3;

function App() {
  const [formData, setFormData] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [disableLikeButton, setDisableLikeButton] = useState(false);
  const [retry, setRetry] = useState({count: 0, error: false});

  useEffect(() => {
    if (retry.count < MAX_RETRIES && retry.error ) {
      onClickLikeButton();
    } else {
      disableLikeButton && setDisableLikeButton(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retry]);

  const onClickLikeButton = async (val) => {
    try {
      const data = { ...formData, data: { ...formData.data, liked: true } };
      const response = await saveLikedFormSubmission(data);
      if (response.status === 202) {
        retry.error && setRetry({...retry, error: false});
        setShowToast(false);
      }
    } catch (error) {
      console.log(error);
      setRetry({...retry, count: val ? 1 : retry.count + 1, error: true});
    }
  };

  function handleFormSubmission(data) {
    if (data) {
      setFormData(data);
      if (!showToast) {
        setShowToast(true);
        setDisableLikeButton && setDisableLikeButton(false);
      }
    }
  }

  onMessage(handleFormSubmission);

  return (
    <>
      <Header
        data={formData}
        showToast={showToast}
        setShowToast={setShowToast}
        onClickLikeButton={() => { setDisableLikeButton(true);  onClickLikeButton(true); }}
        disableLikeButton={disableLikeButton}
        setDisableLikeButton={setDisableLikeButton}
      />
      <Container>
        <Content />
      </Container>
    </>
  );
}

export default App;
