const MDCTextField = mdc.textField.MDCTextField;
const foos = [].map.call(
  document.querySelectorAll(".mdc-text-field"),
  function (el) {
    return new MDCTextField(el);
  }
);

const suits = ["♠", "♡", "♢", "♣"];
const ranks = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Knave", "Queen", "King"];

const deck = [];
for (const suit of suits) {
  for (const rank of ranks) {
    deck.push({
      suit, // object literal syntax: short for `suit: suit`
      rank,
    });
  }
}

function getDeck() {
  return deck;
}
function getRandomCard() {
  return deck[Math.floor(Math.random() * deck.length)];
}
function dealRandomCard() {
  dealToDisplay(getRandomCard());
}
const playersActionsSection = document.querySelector("#playersActions");
const bettingSection = document.querySelector("#betting");
const bettingForm = document.forms[0];
const bankrollSpan = document.querySelector("#player-bankroll");
const wagerInput = bettingForm[0];
const wagerButton = bettingForm[1];
wagerButton.addEventListener("click", makeWager);

const hitButton = document.querySelector("#hit-button");
hitButton.addEventListener("click", dealRandomCard);

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
};
function rankToWord(rank) {
  if (typeof rank === "number") {
    return mapRanksToWords[rank];
  } else {
    return rank;
  }
}

const mapSuitsToWords = {
  "♠": "Spades",
  "♡": "Hearts",
  "♢": "Diamonds",
  "♣": "Clubs",
  "": "Mystery",
};
function suitToWord(suit) {
  return mapSuitsToWords[suit];
}

const mapRanksToValues = {
  Ace: "11/1",
  King: "10",
  Queen: "10",
  Knave: "10",
  "Face Down": "?",
};
function rankToValue(rank) {
  if (typeof rank === "number") {
    return rank.toString();
  } else {
    return mapRanksToValues[rank];
  }
}

function dealToDisplay(card) {
  const newCard = document.createElement("li");
  newCard.setAttribute("data-blackjack-value", rankToValue(card.rank));
  newCard.innerText = `${rankToWord(card.rank)} of ${suitToWord(card.suit)}`;

  const playersCardList = document.querySelector("#playersCards ol");
  playersCardList.appendChild(newCard);
}

let playerBankroll = 2022;

function getBankroll() {
  return playerBankroll;
}

function setBankroll(newBalance) {
  playerBankroll = newBalance;
}

function makeWager(e) {
  e.preventDefault();
  console.log(wagerInput.value);
  timeToPlay();
}

function timeToBet() {
  playersActionsSection.classList.add("hidden");
  bettingSection.classList.remove("hidden");
  bankrollSpan.innerText = `Bankroll: $${getBankroll()}`;
}
function timeToPlay() {
  bettingSection.classList.add("hidden");
  playersActionsSection.classList.remove("hidden");
}
timeToPlay();
