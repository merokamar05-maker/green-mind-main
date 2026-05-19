class DateTimeSystem {
    static #data
    static #SCALE = 60000 * 2

    static init(yearStarted) {
        this.#data = new Date(yearStarted, 2, 1, 6, 0, 1, 0)
    }

    static getDateObject() {
        return this.#data
    }

    static now() {
        return new Date(this.#data.getTime());
    }

    static getDifferenceInMs(_date) {
        return this.#data.getTime() - _date.getTime();
    }

    static update(time_in_seconds) {
        this.#data.setTime(this.#data.getTime() + time_in_seconds * this.#SCALE)
    }

    static advanceTime(ms) {
        this.#data.setTime(this.#data.getTime() + ms);
    }

    static getHour() {
        return this.#data.getHours() + this.#data.getMinutes() / 60
    }

    static getMonth() {
        return this.#data.getMonth() + 1
    }

    static toLocaleString() {
        return this.#data.toLocaleString()
    }

    static toNextDay() {
        this.#data.setDate(this.#data.getDate() + 1)
        this.#data.setHours(6, 0, 1, 0)
    }

    static getSeason() {
        if (3 <= this.getMonth() && this.getMonth() <= 5) {
            return "spring"
        } else if (6 <= this.getMonth() && this.getMonth() <= 8) {
            return "summer"
        } else if (9 <= this.getMonth() && this.getMonth() <= 11) {
            return "autumn"
        } else {
            return "winter"
        }
    }

    static getTotalDays() {
        const start = new Date(this.#data.getFullYear(), 2, 1, 6, 0, 1, 0); // Match init date
        const diff = this.#data.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

}