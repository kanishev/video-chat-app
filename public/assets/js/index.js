import { MyApp } from "./app.js";

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const meeitingId = urlParams.get("meetingId");
  const meetingContainer = document.getElementById("meeting");

  const userId = window.prompt("Enter your username");

  if (!userId || !meeitingId) {
    alert("User or room is missing!");
    return (window.location.href = "/action.html");
  }

  meetingContainer.style.display = "block";

  MyApp()._init(userId, meeitingId);
};
