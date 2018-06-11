const boxPesel = document.querySelector(".pesel"); // input box for PESELnumber
const btnCalculate = document.querySelector(".calculate"); // button "Oblicz wiek" - launch calculate function
const btnClear = document.querySelector(".clear"); // button "Wyczyść dane" - launch clear function

// function allows to enter only number characters
function isNumberKey(e) {
    let charCode = e.which || event.keyCode;
    if (charCode > 31 && (charCode <
            48 || charCode > 57)) return false;
    return true;
}
boxPesel.onkeypress = isNumberKey;

// function checks if the PESEL number is correct
function isValidPesel() {

    const pesel = boxPesel.value;
    let arr = [];
    for (i = 0; i < pesel.length; i++) {
        arr.push(pesel[i]);
    };

    const factor = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3, 1];
    let sum = 0;
    for (i = 0; i < 11; i++)
        sum += factor[i] * arr[i];
    if ((sum % 10) != 0)
        return false;
    return true;
};

isValidPesel();

// function checks if the PESEL number has exactly 11 digits
const pattern = /^[0-9]{11}$/,
    codeMessage = document.querySelector(".message");

const pushMessage = () => {
    const pesel = boxPesel.value;
    if (pesel == "" || pesel == null) {
        codeMessage.innerHTML = "Brak numeru";
    } else
    if ((pattern.test(pesel)) && isValidPesel()) {
        codeMessage.innerHTML = "Kod poprawny";
    } else {
        codeMessage.innerHTML = "Kod niepoprawny";
    };
};
btnCalculate.addEventListener("click", pushMessage, false);

// button launch the function to calculate age and gender if PESEL number is correctly entered
btnCalculate.addEventListener("click", function () {

    if (codeMessage.innerHTML == "Kod poprawny") {

        const calculate = () => {
            const pesel = boxPesel.value;
            let monthFromPesel = pesel.substr(2, 1);

            if ((monthFromPesel == 0) || (monthFromPesel == 1)) {
                var century = 1900,
                    append = 0;
            } else if ((monthFromPesel == 2) || (monthFromPesel == 3)) {
                var century = 2000,
                    append = 20;
            } else if ((monthFromPesel == 8) || (monthFromPesel == 9)) {
                var century = 1800,
                    append = 80;
            };

            let birthYear = (parseInt((pesel.substr(0, 2)), 10) + century),
                birthMonth = (parseInt((pesel.substr(2, 2)), 10) - append),
                birthDay = parseInt((pesel.substr(4, 2)), 10),
                currentDate = new Date(),
                currentYear = currentDate.getFullYear(),
                currentMonth = (currentDate.getMonth() + 1),
                currentDay = currentDate.getDate(),
                previousMonth = currentDate.getMonth(),
                gender = parseInt((pesel.substr(9, 1)), 10);

            // function exchanges Arabic numerals into Roman numerals
            function rome(N, s, b, a, o) {
                for (s = b = '', a = 5; N; b++, a ^= 7)
                    for (o = N % a, N = N / a ^ 0; o--;)
                        s = 'IVXLCDM'.charAt(o > 2 ? b + N - (N &= ~1) + (o = 1) : b) + s;
                return s
            };

            // calculate year
            const y = () => {
                if ((birthMonth > currentMonth) || ((birthMonth == currentMonth) && (birthDay > currentDay))) {
                    return currentYear - birthYear - 1;
                } else if ((birthMonth < currentMonth) || ((birthMonth == currentMonth) && (birthDay <= currentDay))) {
                    return currentYear - birthYear;
                };
            };

            // calculate month
            const m = () => {
                if ((birthMonth >= currentMonth) && (birthDay > currentDay)) {
                    return 11 - birthMonth + currentMonth;
                } else if ((birthMonth > currentMonth) && (birthDay <= currentDay)) {
                    return 12 - birthMonth + currentMonth;
                } else if ((birthMonth < currentMonth) && (birthDay > currentDay)) {
                    return currentMonth - birthMonth - 1;
                } else if ((birthMonth <= currentMonth) && (birthDay <= currentDay)) {
                    return currentMonth - birthMonth;
                };

            };

            // calculate day
            const d = () => {
                if (((currentYear % 4 == 0) && (currentYear % 100 != 0)) || (currentYear % 400 == 0)) {
                    var febDay = 29
                } else {
                    var febDay = 28
                };
                if (birthDay > currentDay) {
                    if ((previousMonth == 0) || (previousMonth == 1) || (previousMonth == 3) || (previousMonth == 5) || (previousMonth == 7) || (previousMonth == 8) || (previousMonth == 10)) {
                        return 31 - birthDay + currentDay;
                    } else
                    if ((previousMonth == 4) || (previousMonth == 6) || (previousMonth == 9) || (previousMonth == 11)) {
                        return 30 - birthDay + currentDay;
                    } else if (previousMonth == 2) {
                        return (febDay - birthDay + currentDay);
                    }
                } else if (birthDay <= currentDay) {
                    return currentDay - birthDay;
                };
            };

            // calculate gender
            const getGender = () => {
                let genderCode = (gender % 2 == 0) ? "K \u2640" : "M \u2642";
                return genderCode;
            };
            getGender();
            document.querySelector(".bornDay").innerHTML = birthDay + ".";
            document.querySelector(".bornMonth").innerHTML = rome(birthMonth) + ".";
            document.querySelector(".bornYear").innerHTML = birthYear + "r.";

            document.querySelector(".age").innerHTML = "lat: " + y() + ", miesięcy: " + m() + " i dni: " + d() + ".";
            document.querySelector(".gender").innerHTML = getGender();
        };
        calculate();
    };
}, false);

// function clears data
btnClear.addEventListener("click", function () {
    boxPesel.value = "";
    codeMessage.innerHTML = "format: 11-cyfr";
    document.querySelector(".bornYear").innerHTML = "";
    document.querySelector(".bornMonth").innerHTML = "";
    document.querySelector(".bornDay").innerHTML = "";
    document.querySelector(".age").innerHTML = "";
    document.querySelector(".gender").innerHTML = "";
}, false);