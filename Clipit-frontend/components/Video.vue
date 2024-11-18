<template>
  <div class="video-player-container">
    <div
      class="video-wrapper"
      v-for="(video, index) in videos"
      :key="index"
      ref="videos"
    >
      <video
        :src="video.src"
        class="video"
        loop
        @click="togglePlay($event)"
        :autoplay="index === currentVideo"
        :muted="true"
      ></video>
    </div>
    <div class="controls">
      <button @click="previousVideo">Previous</button>
      <button @click="nextVideo">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videos: [
        {
          src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        },
        {
          src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
        },
        {
          src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4",
        },
      ],
      currentVideo: 0,
    };
  },
  methods: {
    togglePlay(event) {
      const video = event.target;
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    },
    nextVideo() {
      this.currentVideo = (this.currentVideo + 1) % this.videos.length;
      this.updateVideoPlayingState();
    },
    previousVideo() {
      this.currentVideo =
        (this.currentVideo - 1 + this.videos.length) % this.videos.length;
      this.updateVideoPlayingState();
    },
    updateVideoPlayingState() {
      this.$refs.videos.forEach((video, index) => {
        if (index === this.currentVideo) {
          video.play();
        } else {
          video.pause();
        }
      });
    },
  },
  mounted() {
    this.$refs.videos[0].play(); // Start playing the first video on load
  },
};
</script>

<style>
.video-player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-wrapper {
  max-width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video {
  max-width: 100%;
  height: auto;
  cursor: pointer;
}

.controls {
  position: fixed;
  bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

button {
  background-color: #ff5050;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #ff2020;
}
</style>
