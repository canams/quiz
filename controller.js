$(document).ready(function () {
  var questionNumber = 0;
  var questionBank = new Array();
  var stage = "#game1";
  var stage2 = new Object();
  var questionLock = false;
  var numberOfQuestions;
  var score = 0;

  $.getJSON("activity.json", function (data) {
    for (i = 0; i < data.quizlist.length; i++) {
      questionBank[i] = new Array();
      questionBank[i][0] = data.quizlist[i].question;
      questionBank[i][1] = data.quizlist[i].option1;
      questionBank[i][2] = data.quizlist[i].option2;
      questionBank[i][3] = data.quizlist[i].option3;
    }
    numberOfQuestions = questionBank.length;

    displayQuestion();
  }); //gtjson

  function displayQuestion() {
    var rnd = Math.random() * 3;
    rnd = Math.ceil(rnd);
    var q1;
    var q2;
    var q3;

    if (rnd == 1) {
      q1 = questionBank[questionNumber][1];
      q2 = questionBank[questionNumber][2];
      q3 = questionBank[questionNumber][3];
    }
    if (rnd == 2) {
      q2 = questionBank[questionNumber][1];
      q3 = questionBank[questionNumber][2];
      q1 = questionBank[questionNumber][3];
    }
    if (rnd == 3) {
      q3 = questionBank[questionNumber][1];
      q1 = questionBank[questionNumber][2];
      q2 = questionBank[questionNumber][3];
    }

    $(stage).append(
      '<div class="questionText">' +
        questionBank[questionNumber][0] +
        '</div><div id="1" class="option">' +
        q1 +
        '</div><div id="2" class="option">' +
        q2 +
        '</div><div id="3" class="option">' +
        q3 +
        "</div>"
    );

    $(".option").click(function (event) {
      if (questionLock == false) {
        questionLock = true;
        //correct answer
        if (this.id == rnd) {
          $(event.target).addClass("right");
          score++;
        }
        //wrong answer
        if (this.id != rnd) {
          correct = $("#" + rnd);
          $(correct).addClass("right");
          $(event.target).addClass("wrong");
        }

        setTimeout(function () {
          changeQuestion();
        }, 1000);
      }
    });
  } //display question

  function changeQuestion() {
    questionNumber++;

    if (stage == "#game1") {
      stage2 = "#game1";
      stage = "#game2";
    } else {
      stage2 = "#game2";
      stage = "#game1";
    }

    if (questionNumber < numberOfQuestions) {
      displayQuestion();
    } else {
      displayFinalSlide();
    }

    $(stage2).animate({ right: "+=800px" }, "slow", function () {
      $(stage2).css("right", "-800px");
      $(stage2).empty();
    });
    $(stage).animate({ right: "+=800px" }, "slow", function () {
      questionLock = false;
    });
  } //change question

  function displayFinalSlide() {
    var message = "";
    if (score == numberOfQuestions) {
      message = "Mum? Is that you?";
    } else if (score >= 8 && score < numberOfQuestions) {
      message = "You could pass as a good friend.";
    } else if (score >= 6 && score < 8) {
      message = "That was some good guess work.";
    } else if (score >= 3 && score < 6) {
      message = "Well, at least you know me better now?";
    } else {
      message =
        "I mean, it's probably harder to get a score this low so... glass half full, I guess?";
    }
    $(stage).append(
      '<div class="questionText">You have finished the quiz!<br><br>Total questions: ' +
        numberOfQuestions +
        "<br>Correct answers: " +
        score +
        "<br><br>" +
        message +
        "</div>"
    );
  } //display final slide
}); //doc ready
