const input = document.getElementById("label1");
input.addEventListener("click", function () {
    this.style.transitionProperty = "top, font-size, line-height";
    this.style.transitionDuration = "250ms";
    this.style.transitionTimingFunction = "cubic-bezier(0.9, 0, 0.51, 1)";
    this.style.top = "0.5rem"
    this.style.fontSize = "0.75rem"
    this.style.lineHeight = "1.125rem"


});

for (var i = 0; i <= 5; i++) {
    const question = document.getElementById("answer-" + i);
    const button = document.getElementById("button-" + i);
    const plusButtons = button.querySelector(".plus-button");

    button.addEventListener("click", function () {

        if (question.className == "ques-ans") {
            question.className = "answer";
            plusButtons.style.transform = "rotate(-45deg)";
        }
        else {
            question.className = "ques-ans";
            plusButtons.style.transform = "rotate(0deg)";
        }
    })

}
