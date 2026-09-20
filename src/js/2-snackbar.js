import iziToast from "izitoast";
// Additional CSS import for iziToast styles
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

form.addEventListener("submit", onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  const { delay, state } = event.target.elements;
  const delayValue = Number(delay.value);
  const stateValue = state.value;


  createPromise(delayValue, stateValue)
    .then((resolvedDelay) => {
      iziToast.success({
        title: "Success",
        message: `✅ Fulfilled promise in ${resolvedDelay}ms`,
        position: "topRight",
      });
    })
    .catch((rejectedDelay) => {
      iziToast.error({
        title: "Error",
        message: `❌ Rejected promise in ${rejectedDelay}ms`,
        position: "topRight",
      });
    });

  event.target.reset();
}

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}