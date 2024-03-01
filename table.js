const MDCTextField = mdc.textField.MDCTextField;
const foos = [].map.call(
  document.querySelectorAll(".mdc-text-field"),
  function (el) {
    return new MDCTextField(el);
  }
);

// BJ HW
let deckId;

const suits = ["SPADES", "HEARTS", "DIAMONDS", "CLUBS"];
const ranks = [
  "ACE",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "JACK",
  "QUEEN",
  "KING",
];

const mapRanksToWords = {
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
  ACE: "Ace",
  JACK: "Jack",
  QUEEN: "Queen",
  KING: "King",
};
function rankToWord(rank) {
  return mapRanksToWords[rank];
}

const mapSuitsToWords = {
  SPADES: "Spades",
  HEARTS: "Hearts",
  DIAMONDS: "Diamonds",
  CLUBS: "Clubs",
  "": "Mystery",
};
function suitToWord(suit) {
  return mapSuitsToWords[suit];
}

const mapRanksToValues = {
  ACE: "11/1",
  KING: "10",
  QUEEN: "10",
  JACK: "10",
  "Face Down": "?",
};
function rankToValue(rank) {
  if (rank in mapRanksToValues) {
    return mapRanksToValues[rank];
  } else {
    return rank.toString();
  }
}
function hitPlayer() {
  drawOneCard(dealCard);
}
function hitDealer() {
  drawOneCard((card) => dealCard(card, false));
}

const playersActionsSection = document.querySelector("#playersActions");
const bettingSection = document.querySelector("#betting");
const bettingForm = document.forms[0];
const bankrollSpan = document.querySelector("#player-bankroll");
const wagerInput = bettingForm[0];
const wagerButton = bettingForm[1];
wagerButton.addEventListener("click", makeWager);

const playersCardList = document.querySelector("#playersCards ol");
const dealersCardList = document.querySelector("#dealersCards ol");

const hitButton = document.querySelector("#hit-button");
hitButton.addEventListener("click", hitPlayer);
const standButton = document.querySelector("#stand-button");
standButton.addEventListener("click", timeToBet);

function dealToDisplay(card) {
  const newCard = document.createElement("li");
  newCard.setAttribute("data-blackjack-value", rankToValue(card.rank));
  newCard.innerText = `${rankToWord(card.rank)} of ${suitToWord(card.suit)}`;

  const playersCardList = document.querySelector("#playersCards ol");
  playersCardList.appendChild(newCard);
}

let playerBankroll = parseInt(localStorage.getItem("bankroll")) || 2022;
function getBankroll() {
  return playerBankroll;
}
function setBankroll(newBalance) {
  playerBankroll = newBalance;
  localStorage.setItem("bankroll", playerBankroll);
}

function makeWager(e) {
  e.preventDefault();
  console.log(wagerInput.value);
  timeToPlay();
}

function timeToBet() {
  clearCards();
  playersActionsSection.classList.add("hidden");
  bettingSection.classList.remove("hidden");
  bankrollSpan.innerText = `Bankroll: $${getBankroll()}`;
}
function timeToPlay() {
  clearCards();
  bettingSection.classList.add("hidden");
  playersActionsSection.classList.remove("hidden");
  drawFourCards(dealFourCards);
}
//BJ ICP
function getShoe(callback) {
  fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle?deck_count=6`)
    .then((res) => res.json())
    .then((data) => {
      callback(data);
    });
}
getShoe((data) => (deckId = data.deck_id));
function drawFourCards(callback) {
  fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw?count=4`)
    .then((res) => res.json())
    .then((data) => {
      callback(data.cards);
    });
}
function drawOneCard(callback) {
  fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw?count=1`)
    .then((res) => res.json())
    .then((data) => {
      callback(data.cards[0]);
    });
}

function dealFourCards(fourCards) {
  console.log("You called me");
  const [first, second, third, fourth] = fourCards;
  dealCard(first);
  dealCard(second, false, false);
  dealCard(third);
  dealCard(fourth, false);
}

const backOfCardImageSrc =
  "https://previews.123rf.com/images/rlmf/rlmf1512/rlmf151200171/49319432-playing-cards-back.jpg";

function dealCard(card, isToPlayer = true, isFaceUp = true) {
  const newCard = document.createElement("li");
  const image = document.createElement("img");
  image.setAttribute("src", isFaceUp ? card.image : backOfCardImageSrc);
  image.setAttribute(
    "alt",
    isFaceUp
      ? `${rankToWord(card.value)} of ${suitToWord(card.suit)}`
      : "Face Down"
  );
  image.style.height = `210px`;
  image.style.height = `150px`;
  newCard.setAttribute(
    "data-blackjack-value",
    rankToValue(isFaceUp ? card.value : "Face Down")
  );
  newCard.appendChild(image);
  (isToPlayer ? playersCardList : dealersCardList).appendChild(newCard);
}

function removeChildren(domNode) {
  while (domNode.firstChild) {
    domNode.removeChild(domNode.firstChild);
  }
}
function clearCards() {
  removeChildren(dealersCardList);
  removeChildren(playersCardList);
}
