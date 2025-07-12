import React, { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem } from "../types";
import ProgressBar from "./ProgressBar";

export type StoriesProps = {
  mediaItems: MediaItem[];
  duration: number; // Duration for images in ms
};

const Stories: React.FC<StoriesProps> = ({ mediaItems, duration }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  console.log(progress);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentItem = mediaItems[currentIndex];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToNext = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setProgress(0);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
  }, [mediaItems]);

  const handleVideoEnd = () => {
    goToNext();
  };

  const updateProgress = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      const elapsed = timestamp - startTimeRef.current;
      if (currentItem.type === "image") {
        const percentage = Math.min((elapsed / duration) * 100, 100);
        setProgress(percentage);
        if (percentage >= 100) {
          goToNext();
        } else rafRef.current = requestAnimationFrame(updateProgress);
      }

      if (currentItem.type === "video" && videoRef.current && !isBuffering) {
        const video = videoRef.current;
        const percentage = (video.currentTime / video.duration) * 100;
        setProgress(percentage);
        if (percentage >= 100) goToNext();
        else rafRef.current = requestAnimationFrame(updateProgress);
      }
    },
    [currentItem.type, duration, goToNext, isBuffering]
  );

  useEffect(() => {
    startTimeRef.current = 0;
    setProgress(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (currentItem.type === "image") {
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  }, [currentIndex]);

  useEffect(() => {
    const currentItem = mediaItems[currentIndex];
    clearTimer();
    if (currentItem.type === "image") {
      timerRef.current = window.setTimeout(() => {
        goToNext();
      }, duration);
    }
    return () => {
      if (timerRef.current) {
        clearTimer();
      }
    };
  }, [clearTimer, currentIndex, duration, goToNext, mediaItems]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentItem.type !== "video") return;

    const handlePlaying = () => setIsBuffering(false);
    const handleWaiting = () => setIsBuffering(true);
    const handleEnded = () => goToNext();

    video.addEventListener("playing", handlePlaying);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("ended", handleEnded);

    // Start progress animation when video can play
    video.addEventListener("canplay", () => {
      rafRef.current = requestAnimationFrame(updateProgress);
    });

    return () => {
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "1000px",
        backgroundColor: "#000",
        border: "2px solid blue",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <ProgressBar progress={progress} />
        {currentItem.type === "image" ? (
          <img
            src={currentItem.url}
            alt={currentItem.title}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        ) : (
          <video
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            ref={videoRef}
            controls
            autoPlay
            muted
            preload="auto"
            playsInline
            onEnded={handleVideoEnd}
          >
            <source src={currentItem.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {isBuffering && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.9rem",
            }}
          >
            Buffering...
            {/* Add shimmer component */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
