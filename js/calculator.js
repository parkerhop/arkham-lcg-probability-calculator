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
    {id: 'tablet', quantity: 1, value: 'lookup'},
    {id: 'skull', quantity: 2, value: 'lookup'},
    {id: 'elderThing', quantity: 1, value: 'lookup'},
    {id: 'star', quantity: 1, value: 'lookup'}
]

let players = [CHARACTERS.DAISY, CHARACTERS.ZOEY];

function init() {
    togglePlayers($("#playerCount").val());
    setCharacters(players);
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