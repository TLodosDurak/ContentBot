/*!
 * Start Bootstrap - Bare v5.0.9 (https://startbootstrap.com/template/bare)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project

document
  .getElementById("topic-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const topic = document.getElementById("topic").value;

    // Call your backend API to get the data
    const response = await fetch("http://localhost:3001/create-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    const data = await response.json();
    createVideo(data.top10List, data.imageUrls, data.musicVideoUrl);
  });

async function createVideo(top10List, imageUrls, musicVideoUrl) {
  const canvas = new fabric.Canvas("canvas", { backgroundColor: "white" });
  const musicVideo = document.getElementById("music-video");
  const backgroundMusic = document.getElementById("background-music");

  // Show the canvas
  canvas.getElement().style.display = "block";

  // Load the music video and extract the audio
  musicVideo.src = musicVideoUrl;
  // ...

  // Set up RecordRTC
  const recorder = RecordRTC(canvas, {
    type: "canvas",
    mimeType: "video/webm",
  });
  recorder.startRecording();

  // Draw slides
  for (let i = 0; i < top10List.length; i++) {
    await drawSlide(
      canvas,
      imageUrls[i],
      i + 1,
      top10List[i].country,
      top10List[i].food
    );
  }

  // Stop recording and save the video
  recorder.stopRecording(() => {
    const blob = recorder.getBlob();
    const url = URL.createObjectURL(blob);

    // Display the download button with the video URL
    const downloadBtn = document.getElementById("download-btn");
    downloadBtn.href = url;
    downloadBtn.download = "top-10-video.webm"; // Set a filename for the downloaded video
    downloadBtn.style.display = "block";
  });
}

function drawSlide(canvas, imageUrl, rank, country, foodName) {
  return new Promise(async (resolve) => {
    const image = new fabric.Image.fromURL(imageUrl, (img) => {
      img.scaleToWidth(canvas.width / 2);
      img.set({
        left: canvas.width / 2 - img.width / 2,
        top: canvas.height / 2 - img.height / 2,
      });
      canvas.add(img);
    });

    // Add rank, country, and food name text
    const rankText = new fabric.Text(`#${rank}`, {
      fontSize: 48,
      left: 50,
      top: 50,
    });
    const countryText = new fabric.Text(country, {
      fontSize: 36,
      left: 50,
      top: 110,
    });
    const foodNameText = new fabric.Text(foodName, {
      fontSize: 24,
      left: 50,
      top: 160,
    });

    canvas.add(rankText, countryText, foodNameText);

    // Wait for a certain duration and resolve the promise
    setTimeout(() => {
      // Clear the canvas for the next slide
      canvas.remove(img, rankText, countryText, foodNameText);
      resolve();
    }, 2000); // 2000 ms or any desired duration
  });
}
