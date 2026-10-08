const clockElement = document.querySelector('.clock');
const dayElement = document.querySelector('.day');
const dateElement = document.querySelector('.date');
const themeButton = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeLabel = document.querySelector('.theme-label');

const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
});
const dayFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'long' });
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
});

function updateClock() {
    const now = new Date();
    clockElement.textContent = timeFormatter.format(now);
    dayElement.textContent = dayFormatter.format(now);
    dateElement.textContent = dateFormatter.format(now);
}

function setTheme(isLight) {
    document.body.classList.toggle('light-theme', isLight);
    themeButton.setAttribute('aria-pressed', String(isLight));
    themeButton.setAttribute('aria-label', isLight ? 'Ganti ke tema gelap' : 'Ganti ke tema terang');
    themeIcon.textContent = isLight ? '☾' : '☀';
    themeLabel.textContent = isLight ? 'Mode gelap' : 'Mode terang';
    localStorage.setItem('clock-theme', isLight ? 'light' : 'dark');
}

const savedTheme = localStorage.getItem('clock-theme');
setTheme(savedTheme === 'light');
themeButton.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('light-theme'));
});

updateClock();
setInterval(updateClock, 1000);
