export function MyApp() {
  let socket = null;

  function init(uid, mid) {
    processServer();
  }

  function processServer() {
    socket = io.connect();
    socket.on("connect", () => {
      alert("Socket connectet to client side");
    });
  }

  return {
    _init: function (uid, mid) {
      init(uid, mid);
    },
  };
}
