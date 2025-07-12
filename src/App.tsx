import "./App.css";
import Stories from "./components/Stories";
import type { MediaItem } from "./types";

function App({ duration = 2000 }) {
  const animeVideos: MediaItem[] = [
    {
      title: "Lofi Girl Study Lamp",
      url: "https://cdn.pixabay.com/video/2024/05/30/214500_large.mp4",
      type: "video",
    },
    {
      title: "Demon Girl Woman",
      url: "https://cdn.pixabay.com/video/2021/07/23/82515-580137713_large.mp4",
      type: "video",
    },
    {
      title: "Lofi Girl Study Lamp",
      url: "https://cdn.pixabay.com/video/2024/05/30/214500_large.mp4",
      type: "video",
    },
    {
      title: "Demon Girl Woman",
      url: "https://cdn.pixabay.com/video/2021/07/23/82515-580137713_large.mp4",
      type: "video",
    },
    {
      title: "Lofi Girl Study Lamp",
      url: "https://cdn.pixabay.com/video/2024/05/30/214500_large.mp4",
      type: "video",
    },
    {
      title: "Demon Girl Woman",
      url: "https://cdn.pixabay.com/video/2021/07/23/82515-580137713_large.mp4",
      type: "video",
    },
  ];
  return (
    <>
      <Stories mediaItems={animeVideos} duration={duration} />
    </>
  );
}

export default App;
