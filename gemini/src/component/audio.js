import React, { useState } from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';
import axios from 'axios';
import './audio.css'; // Import the CSS file

const Audio = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [summary, setSummary] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const addAudioElement = (blob) => {
    setAudioBlob(blob);
  };

  const deleteAudio = () => {
    setAudioBlob(null);
    setSummary('');
    setUploadStatus('');
  };

  const handleProcessAudio = async () => {
    if (!audioBlob) return;

    // Convert blob to FormData
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    try {
      setUploadStatus('Uploading...');
      const uploadResponse = await axios.post('https://final-opal-three.vercel.app/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { url } = uploadResponse.data;
      console.log(url);

      setUploadStatus('Processing...');
      const processResponse = await axios.post("https://final-opal-three.vercel.app/process", { fileUrl: url });

      setSummary(processResponse.data.summary);
      setUploadStatus('Completed');
    } catch (error) {
      console.error('Error uploading or processing the file:', error);
      setUploadStatus('Error during processing');
    }
  };

  return (
    <>
    <div className="heading">
      <h1>NOVA AI</h1>
    </div>
    <div className="audio-recorder-container">
      <AudioRecorder 
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }} 
        showVisualizer={true}
        downloadOnSavePress={false}
        className="recorder" // Apply styling class here
      />
      {audioBlob && (
        <div>
          <audio src={URL.createObjectURL(audioBlob)} controls />
          <div className="buttons-container">
            <button onClick={deleteAudio}>Delete</button>
            <button onClick={handleProcessAudio}>Process Audio</button>
            <p>{uploadStatus}</p>
          </div>
        </div>
      )}
      {summary && (
        <div>
          <h3>Audio Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
    </>
  );
};

export default Audio;
