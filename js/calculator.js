const CHARACTERS = window.characterList;

let chaosBagTokens = [
    {id: 'plusOne', quantity: 1, value: 1},
    {id: 'zero', quantity: 2, value: 0},
    {id: 'minusOne', quantity: 3, value: -1},
    {id: 'minusTwo', quantity: 2, value: -2},
    {id: 'minusThree', quantity: 1, value: -3},
    {id: 'minusFour', quantity: 1, value: -4},
    {id: 'cultist', quantity: 1, value: 'lookup'},
    {id: 'autoFail', quantity: 1, value: -99},
    {id: 'tablet', quantity: 2, value: 'lookup'},
    {id: 'skull', quantity: 2, value: 'lookup'},
    {id: 'elderThing', quantity: 1, value: 'lookup'},
    // Use different value for star modifier since its lookup value is unique to each character
    {id: 'star', quantity: 1, value: 'starModifier'}
]

let players = [CHARACTERS.DAISY, CHARACTERS.ZOEY];

function init() {
    // Initialize player inputs
    togglePlayers($("#playerCount").val());
    setCharacters(players);

    // Add onsubmit handler to calculate odds
    let form = document.getElementById('calculatorForm');
    form.onsubmit = calculate;
}

function togglePlayers(playerCount) {
    // Parse to int, otherwise playerCount is treated as a string, and addition becomes concatenation
    let playerCountNum = parseInt(playerCount);

    // Show active players
    for (let index = 1; index <= playerCountNum; index++) {
        $("div[data-index='" + index + "']").show();
    }

    // Hide inactive players
    for (let index = playerCountNum + 1; index <= 4; index++) {
        $("div[data-index='" + index + "']").hide();
    }
}

function setCharacters(characterList) {
    for (let index = 1; index <= characterList.length; index++) {
        var currentCharacter = characterList[index - 1];
        $("input[name='characterName']").filter("input[data-index='" + index + "']").val(currentCharacter.characterName);
        $("input[name='baseSkillValue']").filter("input[data-index='" + index + "']").val(currentCharacter.baseSkillValue);
        $("input[name='starModifier']").filter("input[data-index='" + index + "']").val(currentCharacter.starModifier);
    }
}

function calculate(event) {
    // If the form is valid, call preventDefault() to prevent page reloading
    // Otherwise, allow default behavior, which will display any validation errors
    let form = document.getElementById('calculatorForm');
    if(form.checkValidity()){
        event.preventDefault();
    }

    let playerCount = $("#playerCount").val();
    let successThreshold = $("#successThreshold").val();
    let failureOdds = 1.0;
    for (let index = 1; index <= playerCount; index++) {
        let attempts = parseFloat($("input[name='skillCheckAttempts']").filter("input[data-index='" + index + "']").val());
        if (attempts > 0) {
            failureOdds = failureOdds * calculateFailureOddsForPlayer(index, successThreshold, attempts);
        }
        console.log("Failure odds: " + failureOdds);
    }
    let finalOdds = (100* (1.0 - failureOdds));
    $("#results").text((Math.round(finalOdds * 100) / 100.0).toString() + "%");
}

function calculateFailureOddsForPlayer(playerIndex, successThreshold, attempts) {
    console.log('Player index: ' + playerIndex);
    let totalChaosTokens = 0.0;
    let successChaosTokens = 0.0;
    let baseSkillValue = $("input[name='baseSkillValue']").filter("input[data-index='" + playerIndex + "']").val();
    chaosBagTokens.forEach(function (token) {
        totalChaosTokens += token.quantity;
        let modifier = 0;
        if (token.value === 'starModifier') {
            modifier = $("input[name='starModifier']").filter("input[data-index='" + playerIndex + "']").val();
        } else if (token.value === 'lookup') {
            modifier = $("#" + token.id + "Value").val();
        } else {
            modifier = token.value;
        }
        successChaosTokens += token.quantity * (isSuccess(successThreshold, baseSkillValue, modifier) ? 1 : 0);
    });
    console.log('Total chaos tokens: ' + totalChaosTokens);
    console.log('Total success totkens: ' + successChaosTokens);
    console.log('Attempts: ' + attempts);
    let failureOddsPerAttempt = (totalChaosTokens - successChaosTokens) / totalChaosTokens;
    console.log('Failure odds per attempt: ' + failureOddsPerAttempt);
    console.log('The final odds: ' + Math.pow(failureOddsPerAttempt, attempts));
    return Math.pow(failureOddsPerAttempt, attempts);
}

function isSuccess(successThreshold, baseSkillValue, modifier) {
    console.log("Success threshold: " + successThreshold + "; Base skill value: " + baseSkillValue + "; Modifier: " + modifier);
    return parseInt(successThreshold) <= parseInt(baseSkillValue) + parseInt(modifier);
}