const socket = io("/");
const usersVideo = document.getElementById("meeting");
const roomId = location.search.split("myParam=")[1];
const textField = document.getElementById("input");
const element = document.querySelector("form");
const messages = document.getElementById("messages");
let videoStream;

var peer = new Peer();

const myVideo = document.createElement("video");
myVideo.muted = true;

element.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("message", textField.value);
  textField.value = "";
});

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
      connectUser(userId, stream);
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", roomId, id);
});

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
    addVideoStream(video, videoStream);
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.id = Math.random() * 10;
    video.play();
  });

  usersVideo.append(video);
}
