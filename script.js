window.addEventListener("load", () => {
    if(!localStorage.getItem("memory-game")) {
        const data = {
            streak: 1,
        }
        localStorage.setItem("memory-game", JSON.stringify(data));
    }

    let storeData = JSON.parse(localStorage.getItem("memory-game"));
    let streakCount = storeData.streak;

    const streakDisplay = document.getElementById("streak-display");
    const numberDisplay = document.getElementById("number-display");
    const answerInput = document.getElementById("answer");
    let isPlaying = false;
    let answer = "";
    let randStr = "";

    streakDisplay.innerText = streakCount;

    numberDisplay.addEventListener("click", async () => {
        if(!isPlaying) {
            isPlaying = true;
            answerInput.disabled = true;
            numberDisplay.classList.remove("instructions");
            randStr = randomGenerator(streakCount);
            await displayRand(randStr);
            numberDisplay.classList.add("instructions");
            numberDisplay.innerText = "enter the sequence of numbers";
            answerInput.disabled = false;
            answerInput.focus();

            answerInput.addEventListener("keydown", updateAnswer);

        }
    })
    
    
    function updateAnswer(e) {
        if(e.key === "Enter") {
            answer = answerInput.value;
            answerInput.removeEventListener("keydown", updateAnswer);

            if(answer.trim() === randStr) {
                numberDisplay.innerText = "right, increasing streak counter by 1";
                streakCount++;
            }
            else {
                numberDisplay.innerText = "incorrect sequence, reducing streak counter by 2";
                streakCount = streakCount < 3 ? 1 : streakCount - 2;
            }
            localStorage.setItem("memory-game", JSON.stringify({streak: streakCount}));
            streakDisplay.innerText = streakCount;

            setTimeout(() => {
                isPlaying = false;
                answer = "";
                answerInput.value = "";
                numberDisplay.innerText = "click to begin";
            }, 2000);
        }
    }

    async function displayRand(str) {
        for(let i=0; i<str.length; i++) {
            numberDisplay.innerText = str[i];
            numberDisplay.classList.add("fade-out");
            await sleep(1000);
            numberDisplay.classList.remove("fade-out");
        }
    }
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomGenerator(length) {
    let rand = "";

    for(let i=0; i<length; i++) {
        rand += Math.floor(Math.random() * 10).toString();
    }

    return rand;
}