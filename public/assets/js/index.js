const socket = io("/");
const usersVideo = document.getElementById("meeting");
const roomId = location.search.split("meetingId=")[1];
const textField = document.getElementById("input");
const element = document.querySelector("form");
const messages = document.getElementById("messages");

let videoStream;

var peer = new Peer();
const peers = {};
let user = null;

document.querySelector(".logout").addEventListener("click", () => {
  socket.disconnect();
  window.location.replace(window.location.origin);
});
document.querySelector(".mic-toggle").addEventListener("click", muteUnmute);
document.querySelector(".video-toggle").addEventListener("click", playStop);

const myVideo = document.createElement("video");
myVideo.muted = true;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    videoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      video.muted = true;

      call.on("stream", (videoStream) => {
        addVideoStream(video, videoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      user = userId;
      connectUser(userId, stream);
    });
  });

peer.on("open", (id) => {
  console.log(roomId);
  socket.emit("join-room", roomId, id);
});

socket.on("user-disconnected", (userId) => {
  removeVideoStream(userId);
});

function removeVideoStream(id) {
  if (peer[id]) {
    peer[id].close();
  }
  document.getElementById(id).remove();
}

socket.on("createMessage", (message) => {
  messages.innerHTML += `<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
  <div class="d-flex w-100 justify-content-between">
    <h6 class="mb-1">List group item heading</h6>
    <small>${new Date().getHours() + ":" + new Date().getMinutes()}</small>
  </div>
  <p class="mb-1">${message}</p>
</a>
`;
});

function connectUser(userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (videoStream) => {
    addVideoStream(video, videoStream, userId);
  });

  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream, userId) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.id = userId || Math.floor(Math.random() * 10000000);
    video.play();
  });

  usersVideo.append(video);
}

function removeVideo() {
  // console.log(user);
  // const video = document.getElementById(user);
  // video.remove();
}

element.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("message", textField.value);
  textField.value = "";
});

function muteUnmute() {
  const enabled = videoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    videoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    videoStream.getAudioTracks()[0].enabled = true;
  }
}

function setMuteButton() {
  const html = `
  <span class="material-icons">mic</span>
  `;
  document.querySelector(".mic-toggle").innerHTML = html;
}

function setUnmuteButton() {
  const html = `
  <span class="material-icons">mic_off</span>
  `;
  document.querySelector(".mic-toggle").innerHTML = html;
}

function playStop() {
  let enabled = videoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    videoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    videoStream.getVideoTracks()[0].enabled = true;
  }
}

function setStopVideo() {
  const html = `
  <span class="material-icons">videocam</span>
  `;
  document.querySelector(".video-toggle").innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <span class="material-icons">videocam_off</span>

  `;
  document.querySelector(".video-toggle").innerHTML = html;
};
