/*global $, document, console, alert */
// canvas functions
function initializeCanvas() {
    canvas = document.getElementById("drawing");
    canvas.width = $('#imageSpace').width();
    canvas.height = $('#imageSpace').height();
    context = canvas.getContext("2d");
}

// clears the whole canvas area
function imageClear() {
    context.fillStyle = '#ffffff'; // work around for Chrome
    context.fillRect(0, 0, canvas.width, canvas.height); // fill in the canvas with white
    canvas.width = canvas.width; // clears the canvas 
}

// hides all DOM elements from the screen and clears the canvas
function hideElements() {
    hideButtons();
    hideCanvas();
    hideSlider();
    hideText();
}

function hideText() {
    // hides all text divs
    $('.text').hide();
}

function hideButtons() {
    // hides all buttons
    $(':button').hide();

    // unbinds all buttons
    $(':button').unbind();
}

function hideCanvas() {
    imageClear();

    // hides the canvas drawing
    $('#imageSpace').hide();
}

function hideSlider() {
    $('#sliderStuff').hide();
}

function showInputOptions() {
    // first present the input options for the experiment (for debugging purposes)
    $('#input-options').show();
    $('#input-options').load('html/input-options.html');

    $('#buttons').show();
    $('#next').show();
    $('#next').click(function () {



        // which section to start with:
        switch ($('#section').val()) {
        case "intro":
            showIntro();
            break;
        case "demographics":
            showDemographics();
            break;
        case "instructions":
            showInstructions();
            break;
        case "training":
            trainTrial();
            break;
        case "testing":
            testTrial();
            break;
        }
    });

}

function showIntro() {
    hideElements();

    $('#experimentIntro').show();
    $('#experimentIntro').load('html/intro.html');

    $('#buttons').show();
    $('#next').show();
    $('#next').click(showDemographics);
}

function showDemographics() {
    hideElements();

    // modify here if you want to get different demographic information
    // DEFAULT: subjectID, age, gender, country
    $('#demographics').show();
    $('#demographics').load('html/demographics.html');

    $('#buttons').show();
    $('#next').show();
    $('#next').click(validateDemographics);
}

function validateDemographics() {
    demographics = $('form').serializeArray();

    var ok = true,
        gender_exists = false;
    for (var i = 0; i < demographics.length; i++) {
        // validate age
        if ((demographics[i].name == "age") & (/[^0-9]/.test(demographics[i].value))) {
            alert('Please only use numbers in age.');
            ok = false;
            break;
        } else {
            // test to only include alphanumeric characters
            if ((demographics[i].name != "country") & (/[^a-zA-Z0-9]/.test(demographics[i].value))) {
                alert('Please only use alphanumeric characters.');
                ok = false;
                break;
            }
        }

        // test for empty answers
        if (demographics[i].value === "") {
            alert('Please fill out all fields.');
            ok = false;
            break;
        }

        if (demographics[i].name === "gender") {
            gender_exists = true;
        }
    }

    if ((gender_exists === false) && ok) {
        alert('Please select a gender.');
        ok = false;
    }

    if (!ok) {
        showDemographics();
    } else {
        // remove demographics form
        $('#demographics').html('');
        showInstructions();
    }
}

// displays experiment instructions
function showInstructions() {
    hideElements();

    $('#pilotInstructions').show();

    // CONDITION 
    //if(colourCondition == 'red') {
    $('#pilotInstructions').load('html/instructions-pilot.html');
    $('#buttons').show();
    $('#next').show();
    $('#next').click(trainTrial);
}



// save experiment data with ajax
function saveData(args) {
    (function (d) {
        $.post('submit', {
            "content": JSON.stringify(d)
        });
    })(args);
}

function finishExperiment() {
    hideElements();

    $('#trainingInstructions').show();
    $('#trainingInstructions').load('html/instruction-finish.html');
}