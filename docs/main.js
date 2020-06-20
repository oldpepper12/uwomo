let markovGenerators = null;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function linkifyText(html) {
    let expr = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    return html.replace(expr, `<a href="$&">$&</a>`);
}

fetch("messages.json")
    .then((resp) => resp.json())
    .then((data) => {
        markovGenerators = {};
        for (let [username, messages] of Object.entries(data.messages)) {
            let markov = new MarkovTextGenerator(5);
            markov.digest(messages)
            markovGenerators[username] = markov;

            $("#user-select").append(`
                <option value="${username}">${realNames[username] || username}</option>
            `);
        }
    });

function getSelectedMarkov() {
    return markovGenerators[$("#user-select").val()];
}

const realNames = {
    "ianh": "Ian",
    "sparkilicious": "Andrea",
    "Jeppy": "Alice",
    "CC": "CC",
    "pure sarcasm": "Amelia",
    "meppydc": "Deon",
    "Lawrence The Cucumber": "Jackson",
    "coal aid": "David",
    "OmegaOak": "Chris",
    "Bear": "Barry",
    "Stonkbroker": "Michael",
    "ArcticGalaxy": "Kristina",
    "RaZeragon": "Kevin",
    "Sakura_Kitty": "Liana"
};

function seededRandomChoice (arr, rng) {
    return arr[Math.floor(rng.quick() * arr.length)];
};

function getUserRoleColor(username) {
    let rng = new Math.seedrandom(username);

    return seededRandomChoice([
        "#ffbe0b",
        "#fb5607",
        "#ff006e",
        "#8338ec",
        "3a86ff"
    ], rng);
}

function generate() {
    $("#generated").show();
    let numLines = getRandomInt(1, 4);
    let text = "";
    for (let i = 0; i < numLines; i++) {
        text += escapeHtml(getSelectedMarkov().spit())+"<br>";
    }
    
    let username = $("#user-select").val();

    $("#username").css("color", getUserRoleColor(username)).text(username+" bot");
    $("#generated-text").html(linkifyText(text));
}

