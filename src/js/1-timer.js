import flatpickr from "flatpickr";
// Additional CSS import for flatpickr styles
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
// Additional CSS import for iziToast styles
import "izitoast/dist/css/iziToast.min.css";

// ---- DOM references ----
const refs = {
  input: document.querySelector("#datetime-picker"),
  startBtn: document.querySelector("[data-start]"),
  daysEl: document.querySelector("[data-days]"),
  hoursEl: document.querySelector("[data-hours]"),
  minutesEl: document.querySelector("[data-minutes]"),
  secondsEl: document.querySelector("[data-seconds]"),
};

// Start button is disabled until a valid future date is chosen
refs.startBtn.disabled = true;

// Holds the date picked by the user (Date object) once validated
let userSelectedDate = null;

// Holds the interval id so we can clear it when the timer finishes
let timerId = null;

// ---- flatpickr initialization ----
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate.getTime() <= Date.now()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      userSelectedDate = null;
      refs.startBtn.disabled = true;
      return;
    }

    userSelectedDate = selectedDate;
    refs.startBtn.disabled = false;
  },
};

flatpickr(refs.input, options);

// ---- Start button click handler ----
refs.startBtn.addEventListener("click", onStartClick);

function onStartClick() {
  if (!userSelectedDate) {
    return;
  }

  // Lock the UI while the countdown is running
  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  // Update the interface immediately, then every second
  tick();
  timerId = setInterval(tick, 1000);
}

function tick() {
  const deltaTime = userSelectedDate.getTime() - Date.now();

  if (deltaTime <= 0) {
    clearInterval(timerId);
    timerId = null;
    updateTimerFace({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    refs.input.disabled = false;
    userSelectedDate = null;
    return;
  }

  const time = convertMs(deltaTime);
  updateTimerFace(time);
}

// ---- Render helpers ----
function updateTimerFace({ days, hours, minutes, seconds }) {
  refs.daysEl.textContent = addLeadingZero(days);
  refs.hoursEl.textContent = addLeadingZero(hours);
  refs.minutesEl.textContent = addLeadingZero(minutes);
  refs.secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// ---- Time conversion ----
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}