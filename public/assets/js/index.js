const socket = io("/");
const usersVideo = document.getElementById("meeting");
const roomId = location.search.split("myParam=")[1];

var peer = new Peer();

const myVideo = document.createElement("video");
myVideo.muted = true;

let videoStream;

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

      call.on("stream", (videoStream) => {
        console.log("11121");
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

function connectUser(userId, stream) {
  console.log(stream);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (videoStream) => {
    addVideoStream(video, videoStream);
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    console.log("loaded");
    video.id = Math.random() * 10;
    video.play();
  });

  usersVideo.append(video);
  console.log(usersVideo);
}
