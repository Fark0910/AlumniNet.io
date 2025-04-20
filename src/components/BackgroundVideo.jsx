
import React from 'react';
import bgVideo from '../assets/cloud.mp4';




const BackgroundVideo = () => {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1
      }}
    >
      <source src={bgVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default BackgroundVideo;
