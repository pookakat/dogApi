//everyone can use these.. make sure the variables are unique
var daApiKey = '8caa0b90-fa26-4fb2-aa58-a8839c55fb4a';
var daWeightArray = [];
var daAverageWeight = 0;
var daBreed="";
var currentWeight = 0;

//starting the widget
$(window).on('load', function(){
    let url = 'https://api.TheDogAPI.com/v1/breeds?&api_key='+daApiKey;
    daAjax(url);
    amazonCall('default');
});

//calling the dogApi
function daAjax(url){
  $.ajax({
      url: url,
      method: "GET"
    }).then(function(breeds) {
     $('select').append(`<option value="-1">Choose a breed:</option>`);
      breeds.map(function(breed){
        $('select').append(`<option value="${breed.id}" data-weight="${breed.weight.imperial}">${breed.name}</option>`);
        });
    });
};

//code for events
$('select').on('change', function(event){
    var daWeight = $('option:selected').attr('data-weight');
    var breed = $('option:selected').text();
    breedStuff(breed);
    daWeightArray = getWeights(daWeight);
    daAverageWeight = averageWeight(daWeightArray);
    $('.question').hide();
});

$('.red').click(function(event){
    $('#breed-verification').hide();
    $('#selected-breed').html();
    $('select').show();
    $('.question').show();
    $('.question').prepend('Sorry! ');
});

$('.green').click(function(event){
    $('#breed-verification').hide();
    $('#selected-breed').html();
    weightStuff();
});

$('#record-weight').on('click', function(event){
    currentWeight = $('#weight').val();
    $('#weight-compare').hide();
    $('#current-weight').show();
    daOverweightMath();
    return currentWeight;
})

$('#weight').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        currentWeight = $('#weight').val();
    $('#weight-compare').hide();
    $('#current-weight').show();
    daOverweightMath();
    return currentWeight;
    }
})

$('#dog-info-weight').on("mouseover", function(event){
    $('#body-condition-score').show();
})

$('#body-condition-score').on("mouseleave", function(event){
    $('#body-condition-score').hide();
})

//calculating functions
function getWeights(daWeight){
    var range = daWeight.split("-");
    range[0] = parseInt(range[0].trim());
    range[1] = parseInt(range[1].trim());
    console.log(range[0], range[1]);
    return range;
}

function averageWeight(daWeightArray){
    var averageWeight = (daWeightArray[1] + daWeightArray[0])/2;
    return averageWeight;
}

function decideCategory(){
    var category = '';
    if (daAverageWeight <= 12){
        category='toy';
    }
    else if (daAverageWeight < 25){
        category = 'small';
    }
    else if (daAverageWeight < 50){
        category = 'medium';
    }
    else if (daAverageWeight < 100){
        category = 'large';
    }
    else{
        category = 'giant';
    }
    amazonCall(category);
    return category;    
}


//window altering stuff
function breedStuff(breed){
    $('select').hide();
    $('#breed-verification').show();
    $('#selected-breed').html('<p>You picked ' + breed + ' . Is this right?</p>');
    daBreed = breed;
}

function weightStuff(){
    $('#weight-verification').show();
    $('#average-weight').html('<p>The average weight for a(n) ' + daBreed + ' is ' + daAverageWeight + '.</p>');
}

function daOverweightMath(){
    console.log(currentWeight, daWeightArray);
    if (currentWeight <= daWeightArray[1]){
        if (currentWeight >= daWeightArray[0]){
            $('#dog-info-weight').addClass('green');
        }
        else{
            $('#dog-info-weight').addClass('orange');
        }
    }
    else{
        $('#dog-info-weight').addClass('red');
    }
    petSpecific()
}

function petSpecific(){
    var breedCategory = decideCategory();
    $('#dog-info-breed').prepend('Your dog is a '+ daBreed + ', and your dog weighs ');
    $('#dog-info-weight').html(currentWeight);
    $('#dog-info-breed').append(' pounds.');
    $('#dog-info-breed').append('This makes your dog a ' + breedCategory + ' breed!');
}

function amazonCall(value){
    console.log(value);
    if (value === 'default'){        
        adNumber = "cb16da6f-a242-41e1-b8b6-27ccbbf85082"
    }
    else if (value === 'toy'){
        adNumber = "bb002f23-2c42-410b-bb77-3bd9a43fcff5"
    }
    else if (value === 'small'){
        adNumber = "6b183ca8-fca7-48ef-b527-b0ff3e77c060";
    }
    else if (value === 'medium'){
        adNumber = "93405050-3b68-4b29-b656-39f17da1c256";
    }
    else if (value === 'large'){
        adNumber = "0c90518e-e974-440f-8b1f-655456df68fe";
    }
    else{
        adNumber = "3148660e-e283-4315-ab35-fea0d8bcc2ac";
    }

    renderScript(adNumber)
}

function renderScript(adNumber){
    $('body').append('<script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=' + adNumber + '"></script>');
    $('#amazon-stuff').html('<div id="amzn-assoc-ad-' + adNumber + '"></div>');
}