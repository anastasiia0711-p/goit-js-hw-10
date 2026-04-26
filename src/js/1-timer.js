import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const daysVal = document.querySelector('[data-days]');
const hoursVal = document.querySelector('[data-hours]');
const minutesVal = document.querySelector('[data-minutes]');
const secondsVal = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;


startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    
    
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr(input, options);

startBtn.addEventListener('click', () => {
  toggleInterface(true);
  
  timerId = setInterval(() => {
    const deltaTime = userSelectedDate - new Date();
    
    if (deltaTime <= 0) {
      clearInterval(timerId);
      updateTimerInterface(convertMs(0));
      
      
      input.disabled = false;
      startBtn.disabled = true; 
      return;
    }
    
    const timeComponents = convertMs(deltaTime);
    updateTimerInterface(timeComponents);
  }, 1000);
});

function toggleInterface(isActive) {
  startBtn.disabled = isActive;
  input.disabled = isActive;
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
  daysVal.textContent = addLeadingZero(days);
  hoursVal.textContent = addLeadingZero(hours);
  minutesVal.textContent = addLeadingZero(minutes);
  secondsVal.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}