const chatBtns = document.querySelectorAll(".chat-btn");
const partsBtns = document.querySelectorAll(".parts-btn");
const chat = document.getElementById("chat");
const parts = document.getElementById("parts");

chatBtns.forEach((b) =>
  b.addEventListener("click", function () {
    parts.classList.add("d-none");
    chat.classList.add("d-flex");
    chat.classList.remove("d-none");
  })
);

partsBtns.forEach((b) =>
  b.addEventListener("click", function () {
    parts.classList.remove("d-none");
    chat.classList.add("d-none");
    chat.classList.remove("d-flex");
  })
);
