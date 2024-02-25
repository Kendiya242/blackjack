const suits = ["♠", "♡", "♢", "♣"];
const ranks = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Knave","Queen", "King"];
const deck = [];
function createDeck(){
    for (let i = 0; i < suits.length; i++){
        for (let j = 0; j < ranks.length; j++){
            let card = {
                suit: suits[i],
                rank: ranks[j]
            };
            deck.push(card);
        }
    }
    return deck;
}
createDeck();
// function for getting the deck
function getDeck(){
    return deck;
}
// function for getting random card
function getRandomCard(){
    let randomValue = Math.random() * deck.length;
    let randomIndex = Math.floor(randomValue); //  0 - 51
    return deck[randomIndex];
}
// module.exports = {
//     getRandomCard
// };

const hit_button = document.getElementById("hit-button");
hit_button.addEventListener("click", function() {
    let randomCard = getRandomCard();
    // console.log(random_card)
    let card_value_str = `did you bust? Your card is ${randomCard.rank} of ${randomCard.suit}.`
    console.log(card_value_str,randomCard);
    // console.log(randomCard);
});