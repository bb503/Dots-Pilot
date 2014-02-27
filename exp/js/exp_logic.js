/*global $, document, console, alert */
var subjectID;
var condition;
var demographics = [];

// experimental variables 
var currTrainTrial = 0;
var maxTrainTrial = 5;

// PILOT condition

// canvas variables
var context;
var canvas;


// timing variables
var base_time, rt;

// SLIDER
// slider variables
var default_slider_value = 50;

// are we in debug mode?
var debug = true;




// draw experimental stimuli using canvas functions
function drawDots() {
    function Object(position, radius) {
        this.draw = function (context) {
            context.beginPath();
            context.arc(position.x + .5, position.y + .5, radius, 0, 2 * Math.PI, false);
            context.fillStyle = "black";
            context.strokeStyle = "black";
            context.lineWidth = "2";
            context.stroke();
            context.fill();
        };
    }

    // invisible grid
    var width = canvas.width,
        height = canvas.height,
        random_number = Math.floor(Math.random() * 781 + 19);
    objectWidth = 6,
    objectHeight = 6,
    radius = objectWidth / 4;
    objects = [],
    hash = {};

    if (random_number % 2 == 0)
        random_number++; // can subtract half the time also

    for (var i = 0; i < random_number; i++) {
        var positionX = radius + 1 + Math.floor(Math.random() * (width - objectWidth) / objectWidth) * objectWidth,
            positionY = radius + 1 + Math.floor(Math.random() * (height - objectHeight) / objectHeight) * objectHeight;

        while (hash[positionX + 'x' + positionY]) {
            positionX = radius + 1 + Math.floor(Math.random() * width / objectWidth) * objectWidth;
            positionY = radius + 1 + Math.floor(Math.random() * height / objectHeight) * objectHeight;
        }

        hash[positionX + 'x' + positionY] = 1;
        objects.push(new Object({
            x: positionX,
            y: positionY,
        }, radius));
    }

    for (var i = 0; i < objects.length; i++) {
        objects[i].draw(context);
        //document.getElementById("actual_num_of_dots").value ++;  //want to get the actual number of dots for feedback, but when I use this line, the dots disappear.
    }


}




/*function saveTrainTrial() {
    rt = new Date().getTime() - base_time;

    // all of the data from this trial will go into this object
    var exp_data = {};

    // add demographics data to trial output
    for (var i = 0; i < demographics.length; i++) {
        exp_data[demographics[i].name] = demographics[i].value;
    }
    exp_data.age = parseInt(exp_data.age, 10);

    // add trial data to trial output
    exp_data.subjectID = subjectID;
    exp_data.trainTrial = currTrainTrial;
    exp_data.rt = rt;
    exp_data.experiment = "test_experiment_v1";
    exp_data.button_value = response;
    // SLIDER
    exp_data.slider_value = $('#slider').slider('value');

    console.log(exp_data);

    // save trial data
    saveData(exp_data);*/




//have problem with the above code. Experiment crashes when it is used.



function trainTrial() {
    hideElements();

    // display training trial instructions
    $('#trainingInstructions').show();
    $('#trainingInstructions').load('html/instruction-train.html');

    // draw training stimuli in canvas
    $('#imageSpace').show();
    drawDots();

    // increment training trial counter
    currTrainTrial++;



    // get time of beginning of trial
    base_time = new Date().getTime();


    // SLIDER
    $('#slider').slider('value', default_slider_value);
    $('#buttons2').show();
    $('#next2').show();
    //get participant's most likely estimate

    $('#estimate').show();
    $('#estimate').load('html/input-estimate.html');
    $('#next2').click(validateEstimate);
}

//check estimate is a number
function validateEstimate() {
    estimate = $('form').serializeArray();
    if (estimate.length != 1) {
        alert('You did not enter an estimate.'); //this alert does not appear when text box is left blank.  
    } else {
        if (/[^0-9]/.test(estimate[0].value)) {
            alert('Please enter your estimate in numeric characters.');
        } else {
            showSliderInstructions(); //Slider still appears if click next without entering an estimate. This needs to be changed so slider only appears after estimate is validated.
        }
    }
}


//slider
function showSliderInstructions() {
    $('#next2').hide();
    $('#trainingInstructions').load('html/instruction-test-slider.html');
    $("#sliderStuff").show();
    $("#slider-info").html($('#slider').slider('value') + "%");
    $('#getFeedback').show(); //would like feedback button to appear after slider is used.
    $('#getFeedback').click(giveFeedback);
}




//feedback
function giveFeedback() {
    $('#getFeedback').hide();
    $('#feedback').load('html/feedback-number.html'); //doesn't appear. 
    $('#tryAgain').show(); 
    if (currTrainTrial < maxTrainTrial)
        $('#tryAgain').click(trainTrial);
    else
        finishExperiment();
}