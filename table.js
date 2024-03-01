const MDCTextField = mdc.textField.MDCTextField;
const foos = [].map.call(
  document.querySelectorAll(".mdc-text-field"),
  function (el) {
    return new MDCTextField(el);
  }
);

let deckId;

function getShoe(callback) {
  fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle?deck_count=6`)
    .then((res) => res.json())
    .then((data) => {
      callback(data);
    });
}
getShoe((data) => (deckId = data.deck_id));
let wager;

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
standButton.addEventListener("click", dealersTurn);

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
  wager = parseInt(wagerInput.value);
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
  startPlayerActionTimeout();
}

function drawFourCards(callback) {
  fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw?count=4`)
    .then((res) => res.json())
    .then((data) => {
      callback(data.cards);
    });
}
function drawOneCard(callback) {
  return fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw?count=1`)
    .then((res) => res.json())
    .then((data) => {
      callback(data.cards[0]);
    });
}

function dealFourCards(fourCards) {
  const [first, second, third, fourth] = fourCards;
  dealCard(first);
  dealCard(second, false, false);
  dealCard(third);
  dealCard(fourth, false);
}

const backOfCardImageSrc =
  "https://previews.123rf.com/images/rlmf/rlmf1512/rlmf151200171/49319432-playing-cards-back.jpg";
let dealersDownCard;
function dealCard(card, isToPlayer = true, isFaceUp = true) {
  const newCard = document.createElement("li");
  const image = document.createElement("img");
  image.setAttribute("src", isFaceUp ? card.image : backOfCardImageSrc);
  if (!isFaceUp) dealersDownCard = card;
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
function flipDownCard() {
  const downCard = dealersCardList.children[0].children[0];
  downCard.setAttribute("src", dealersDownCard.image);
  downCard.setAttribute(
    "alt",
    `${rankToWord(dealersDownCard.value)} of ${suitToWord(
      dealersDownCard.suit
    )}`
  );
  downCard.setAttribute(
    "data-blackjack-value",
    rankToValue(dealersDownCard.value)
  );
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

function getPlayerTotal(getDealerTotal = false) {
  const playersCards = getDealerTotal
    ? dealersCardList.children
    : playersCardList.children;
  let total = 0;
  let aceCount = 0;
  for (const card of playersCards) {
    if (card.dataset.blackjackValue == "?") {
      total += parseInt(rankToValue(dealersDownCard.value));
    } else if (card.dataset.blackjackValue == "11/1") {
      total += 11;
      aceCount++;
    } else {
      total += parseInt(card.dataset["blackjackValue"]);
    }
  }
  if (total > 21) {
    while (aceCount > 0) {
      total -= 10;
      aceCount--;
    }
  }
  return total;
}

function getDealerTotal() {
  return getPlayerTotal(true);
}

async function dealersTurn() {
  flipDownCard();
  while (getDealerTotal() < 17) {
    await hitDealer();
  }
  if (getDealerTotal() > 21) {
    console.log("dealer busted");
    takeStakes(true);
  } else {
    evalutateWinner();
  }
}
function evalutateWinner() {
  if (getPlayerTotal() > getDealerTotal()) {
    console.log("player won");
    takeStakes(true);
  } else if (getPlayerTotal() == getDealerTotal()) {
    console.log("push");
    takeStakes(false, true);
  } else {
    console.log("dealer won");
    takeStakes();
  }
}

function hitPlayer() {
  drawOneCard(dealCard).then(() => {
    if (getPlayerTotal() > 21) bustPlayer();
  });
}
function bustPlayer() {
  console.log("player busted");
  takeStakes();
}
function hitDealer() {
  return drawOneCard((card) => dealCard(card, false));
}

function takeStakes(playerWon = false, wasPush = false, withANatural = false) {
  if (!wasPush)
    setBankroll(
      getBankroll() +
        (playerWon ? (withANatural ? wager * 1.5 : wager) : -wager)
    );
  setTimeout(timeToBet, 3000);
}
let playerActionTimeout;
function startPlayerActionTimeout() {
  playerActionTimeout = setTimeout(timeOutPlayer, 10000);
}
function timeOutPlayer() {
  console.log("player timeout");
  dealersTurn();
}
function cancelPlayerActionTimeout() {
  clearTimeout(playerActionTimeout);
}
hitButton.addEventListener("click", cancelPlayerActionTimeout);
standButton.addEventListener("click", cancelPlayerActionTimeout);
