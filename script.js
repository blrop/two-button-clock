const showElement = ($el) => {
    $el.classList.remove('hidden');
};

const hideElement = ($el) => {
    $el.classList.add('hidden');
};

class Element {
    constructor($el) {
        this.$el = $el;
        this.isShown = true;
    }

    show() {
        this.isShown = true;
        showElement(this.$el);
    }

    hide() {
        this.isShown = false;
        hideElement(this.$el);
    }

    toggle() {
        if (this.isShown) {
            this.hide();
        } else {
            this.show();
        }
    }

    setValue(value) {
        this.$el.innerText = value < 10 ? `0${value}` : value;
    }
}

class Time {
    constructor() {
        const date = new Date();
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.halfSeconds = date.getSeconds() * 2;
    }

    addHalfSecond() {
        this.halfSeconds++;
        if (this.halfSeconds >= 120) {
            this.halfSeconds = 0;
            this.addMinute();
        }
    }

    addMinute() {
        this.minutes++;
        if (this.minutes >= 60) {
            this.minutes = 0;
            this.addHour();
        }
    }

    addHour() {
        this.hours++;
        if (this.hours >= 23) {
            this.hours = 0;
        }
    }

    get seconds() {
        return Math.floor(this.halfSeconds / 2);
    }
}

const DEFAULT_STATE = 0;
const HOURS_EDIT = 1;
const MINUTES_EDIT = 2;
const SECONDS_SHOW = 3;

window.onload = () => {
    const $clockHours = document.getElementById('clock-hours');
    const $clockMinutes = document.getElementById('clock-minutes');
    const $clockColon = document.getElementById('clock-colon');
    const $buttonA = document.getElementById('button-a');
    const $buttonB = document.getElementById('button-b');

    const hours = new Element($clockHours);
    const minutes = new Element($clockMinutes);
    const colon = new Element($clockColon);

    const time = new Time();

    let uiState = 0;

    const setUIState = (state) => {
        uiState = state;

        switch(state) {
            case DEFAULT_STATE:
                hours.show();
                minutes.show();
                break;
            case HOURS_EDIT:
                colon.show();
                break;
            case MINUTES_EDIT:
                hours.show();
                break;
            case SECONDS_SHOW:
                hours.hide();
                colon.show();
                minutes.setValue(time.seconds);
                break;
        }
    };

    $buttonA.addEventListener('click', () => {
        switch (uiState) {
            case DEFAULT_STATE:
                setUIState(HOURS_EDIT);
                break;
            case HOURS_EDIT:
                setUIState(MINUTES_EDIT);
                break;
            case MINUTES_EDIT:
                setUIState(DEFAULT_STATE);
                break;
        }
    });

    $buttonB.addEventListener('click', () => {
        switch (uiState) {
            case DEFAULT_STATE:
                setUIState(SECONDS_SHOW);
                break;
            case SECONDS_SHOW:
                setUIState(DEFAULT_STATE);
                minutes.setValue(time.minutes)
                break;
            case HOURS_EDIT:
                hours.show();
                time.addHour();
                hours.setValue(time.hours);
                break;
            case MINUTES_EDIT:
                minutes.show();
                time.addMinute();
                minutes.setValue(time.minutes);
                break;
        }
    });

    const onInterval = () => {
        time.addHalfSecond();

        switch (uiState) {
            case DEFAULT_STATE:
                colon.toggle();
                hours.setValue(time.hours)
                minutes.setValue(time.minutes)
                break;
            case SECONDS_SHOW:
                minutes.setValue(time.seconds);
                break;
            case HOURS_EDIT:
                hours.toggle();
                break;
            case MINUTES_EDIT:
                minutes.toggle();
                break;
        }
    };

    setInterval(onInterval, 500);
    onInterval();
};