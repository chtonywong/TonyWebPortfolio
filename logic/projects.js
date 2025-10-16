const navbarToggle = document.querySelector(".navbar-toggle");
const navbarMenu = document.querySelector(".navbar-menu");
const full_nav = document.querySelector(".Full_nav");

navbarToggle.addEventListener("click", () => {
  navbarToggle.classList.toggle("active");
  navbarMenu.classList.toggle("active");
});

const track = document.getElementById("image-track");

// --- Slider Logic (unchanged) ---
const handleOnDown = (e) => (track.dataset.mouseDownAt = e.clientX);

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";
  // IMPORTANT: Save the slider position when the user lets go
  track.dataset.prevPercentage = track.dataset.percentage;
  localStorage.setItem("sliderPercentage", track.dataset.percentage);
};

const handleOnMove = (e) => {
  if (track.dataset.mouseDownAt === "0") return;

  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
    maxDelta = window.innerWidth / 2;

  const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained =
      parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  track.dataset.percentage = nextPercentage;

  applySliderPosition(nextPercentage);
};

// Extracted this into a function for reusability
function applySliderPosition(percentage, duration = 1200) {
  track.animate(
    { transform: `translate(${percentage}%, -50%)` },
    { duration, fill: "forwards" }
  );

  for (const image of track.getElementsByClassName("image")) {
    image.animate(
      { objectPosition: `${100 + parseFloat(percentage)}% center` },
      { duration, fill: "forwards" }
    );
  }
}

// --- Event Listeners ---
window.onmousedown = (e) => handleOnDown(e);
window.ontouchstart = (e) => handleOnDown(e.touches[0]);
window.onmouseup = (e) => handleOnUp(e);
window.ontouchend = (e) => handleOnUp(e.touches[0]);
window.onmousemove = (e) => handleOnMove(e);
window.ontouchmove = (e) => handleOnMove(e.touches[0]);

// --- NEW: State Restoration and Page Transitions ---

// 1. Restore slider position on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedPercentage = localStorage.getItem("sliderPercentage");

  // Check if we are coming back from the project page
  const urlParams = new URLSearchParams(window.location.search);
  const fromProject = urlParams.get("fromProject");
  const projectNum = localStorage.getItem("projectNumLocal");

  if (savedPercentage) {
    track.dataset.percentage = savedPercentage;
    track.dataset.prevPercentage = savedPercentage;

    // If we are returning, do a fast animation. Otherwise, just snap to position.
    const duration = fromProject ? 600 : 0;
    applySliderPosition(savedPercentage, duration);
  }

  // 2. Handle the "zoom-in" animation on return
  if (fromProject && projectNum) {
    const returningImage = document.getElementById(`projectPic${projectNum}`);
    if (returningImage) {
      // Start the image as fixed and full-screen
      returningImage.style.position = "fixed";
      returningImage.style.zIndex = "10000";
      returningImage.style.top = "0";
      returningImage.style.left = "0";
      returningImage.style.width = "100vw";
      returningImage.style.height = "100vh";
      returningImage.style.borderRadius = "0";
      returningImage.style.objectFit = "cover";

      // After a short delay to allow rendering, start the animation back to its original spot
      setTimeout(() => {
        returningImage.style.transition = "all 0.6s ease-in-out";
        // Reset styles so it returns to its CSS-defined state
        returningImage.style.position = "";
        returningImage.style.zIndex = "";
        returningImage.style.top = "";
        returningImage.style.left = "";
        returningImage.style.width = "";
        returningImage.style.height = "";
        returningImage.style.borderRadius = "";
        returningImage.style.objectFit = "";
      }, 50); // Small delay

      // Clean up the URL
      history.replaceState(null, "", window.location.pathname);
    }
  }
});

// 3. Handle the "zoom-out" navigation
function onclickButton(projectNum) {
  // Save project number and current slider position
  localStorage.setItem("projectNumLocal", projectNum);
  localStorage.setItem("sliderPercentage", track.dataset.percentage || "0");

  const imageToZoom = document.getElementById(`projectPic${projectNum}`);
  if (!imageToZoom) {
    // Fallback if image not found
    window.location.href = "pContainer.html";
    return;
  }

  // Get image position
  const rect = imageToZoom.getBoundingClientRect();

  // Apply the initial state for the animation
  imageToZoom.classList.add("zooming-out");
  imageToZoom.style.top = `${rect.top}px`;
  imageToZoom.style.left = `${rect.left}px`;
  imageToZoom.style.width = `${rect.width}px`;
  imageToZoom.style.height = `${rect.height}px`;

  // Animate the body fading out
  document.body.classList.add("is-transitioning");

  // Trigger the zoom animation
  setTimeout(() => {
    imageToZoom.style.top = "0";
    imageToZoom.style.left = "0";
    imageToZoom.style.width = "100vw";
    imageToZoom.style.height = "100vh";
  }, 10); // Short delay to ensure transition applies

  // Navigate after the animation has had time to play
  setTimeout(() => {
    window.location.href = "pContainer.html";
  }, 300); // 500ms delay
}
