const MDCTextField = mdc.textField.MDCTextField;
const textFields = [].map.call(
  document.querySelectorAll(".mdc-text-field"),
  function (el) {
    return new MDCTextField(el);
  }
  );
  
  let deckId;

  // Function to get 6 decks of cards to start
  function getShoe(callback) {
    return fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle?deck_count=6`)
      .then((res) => res.json())
      .then((data) => {
        deckId = data.deck_id; // Set deckId here
        callback(data);
      })
      .catch((error) => {
        console.error("Error fetching the shoe:", error);
      });
  }
  
  // Start a shoe of Blackjack
  getShoe((data) => {
    deckId = data.deck_id; // Set deckId here
    timeToBet(); // Move this line inside the callback to ensure deckId is set
  });

  const backOfCardImageSrc = "assets/backs/blue.svg"
  const suits = ["SPADES", "HEARTS", "DIAMONDS", "CLUBS"];
  const ranks = ["ACE", 2, 3, 4, 5, 6, 7, 8, 9, 10, "JACK", "QUEEN", "KING"];
  const mapRanksToWords = { 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten", ACE: "Ace", JACK: "Jack", QUEEN: "Queen", KING: "King",};
  
// Create a function to convert a rank to number word
function rankToWord(rank) {
  return mapRanksToWords[rank];
}

const mapSuitsToWords = {SPADES: "Spades", HEARTS: "Hearts", DIAMONDS: "Diamonds", CLUBS: "Clubs", "": "Mystery",};

// Create a function to convert a suit to a word
function suitToWord(suit) {
  return mapSuitsToWords[suit];
}

const mapRanksToValues = {
  ACE: "11/1", KING: "10", QUEEN: "10", JACK: "10", "Face Down": "?"
}

// Create a function to convert ranks to data-blackjack-value
function rankToValue(rank) {
  if (rank in mapRanksToValues) {
    return mapRanksToValues[rank];
  } else {
    return rank.toString();
  }
}

// Function to deal a new card to the dealer
function hitDealer() {
  drawOneCard((card) => dealCard(card, false));
}

const playersActions = document.getElementById("playersActions");
const betting = document.getElementById("betting");
const bankrollSpan = document.querySelector("#player-bankroll");
const wager = 0;

const playersCardList = document.querySelector("#player-card-list");
const dealersCardList = document.querySelector("#dealer-card-list");

// Add an event listener for the "Hit" button
const hitButton = document.querySelector("#hit-button");
hitButton.addEventListener("click", () => {
  hitPlayer().then(() => {
    if (getPlayerTotal() > 21) bustPlayer();
  });
});

// add an event listner to the stand button and call timeToBet
const standButton = document.querySelector("#stand-button");
standButton.addEventListener("click", () => {
  standPlayer();
});

function standPlayer() {
  console.log("Player chose to stand");
  dealersTurn();
}

// add an event listner to the bet button and call MakeWager on click
document.getElementById("bet-button").addEventListener("click", () => {
  makeWager();
})

let bankroll = parseInt(localStorage.getItem("bankroll")) || 2022;

// Function that gets the value of bankroll
function getBankroll() {
  return bankroll;
}

// Function that addigns the value of newBalance to bankroll
function setBankroll(newBalance) {
  bankroll = newBalance;
  localStorage.setItem("bankroll", bankroll);
}

// Function that hides playersActions section, and displays the betting section
function timeToBet(){
  clearCards();
  playersActions.classList.add("hidden-item");
  betting.classList.remove("hidden-item");
  bankrollSpan.innerText = `Bankroll: $${getBankroll()}`;
}

// Function that displays the playersActions section and hides the betting section
function timeToPlay() {
  clearCards();
  playersActions.classList.remove("hidden-item");
  betting.classList.add("hidden-item");
  drawFourCards(dealFourCards);
}

// Function that logs the amount in the users-wager input and calls timeToPlay
function makeWager() {
  const wager = document.getElementById("users-wager").value;
  console.log(wager);
  timeToPlay();
}

// Draw four cards from the shoe
function drawFourCards(callback) {
  console.log(deckId)
  fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw?count=4`)
    .then((res) => res.json())
    .then((data) => {
      callback(data.cards);
    });
}

// Draw one card from shoe
async function drawOneCard(callback) {
  const data = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw?count=1`).then((res) => res.json());
  callback(data.cards[0]);
}

let dealersHoleCard

// Function to deal a card to the player or dealer
function dealCard(card, isToPlayer = true, isFaceUp = true) {
  const newCard = document.createElement("li");
  const image = document.createElement("img");
  image.setAttribute("src", isFaceUp ? card.image : backOfCardImageSrc);
  if (!isFaceUp) dealersHoleCard = card;
  image.setAttribute(
    "alt",
    isFaceUp
      ? `${rankToWord(card.value)} of ${suitToWord(card.suit)}`
      : "Face Down"
  );
  //image.style.height = `210px`;
  //image.style.height = `150px`;
  newCard.setAttribute(
    "data-blackjack-value",
    rankToValue(isFaceUp ? card.value : "Face Down")
  );
  newCard.classList.add("mdc-card");
  newCard.appendChild(image);
  (isToPlayer ? playersCardList : dealersCardList).appendChild(newCard);
}

function dealFourCards(fourCards) {
  const [first, second, third, fourth] = fourCards;
  dealCard(first);
  dealCard(second, false, false);
  dealCard(third);
  dealCard(fourth, false);
}

// Function to flip the dealer's hole card face up
function flipHoleCard() {
  const holeCard = dealersCardList.children[0].children[0];
  holeCard.setAttribute("src", dealersHoleCard.image);
  holeCard.setAttribute(
    "alt",
    `${rankToWord(dealersHoleCard.value)} of ${suitToWord(
      dealersHoleCard.suit
    )}`
  );
  holeCard.setAttribute(
    "data-blackjack-value",
    rankToValue(dealersHoleCard.value)
  );


}

// Function to remove all children from a node
function removeChildren(domNode) {
  while (domNode.firstChild) {
    domNode.removeChild(domNode.firstChild);
  }
}

// Function to remove the cards from the Dealers list and Players list
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
    if (card.dataset.blackjackValue === "?") {
      total += parseInt(rankToValue(dealersHoleCard.value));
    } else if (card.dataset.blackjackValue === "11/1") {
      total += 11;
      aceCount++;
    } else {
      total += parseInt(card.dataset.blackjackValue);
    }
  }

  // Adjust for aces
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }

  return total;
}

function getDealerTotal() {
  return getPlayerTotal(true);
}

// Function to handle the dealer's turn
async function dealersTurn() {
  flipHoleCard();

  // Include the hole card value in the total
  let total = getDealerTotal();
  
  // Check if the dealer already has a natural blackjack (Ace + 10-value card)
  const hasNaturalBlackjack = total === 21 && dealersCardList.children.length === 2;

  while (total < 17 || (total === 17 && hasNaturalBlackjack)) {
    // If the dealer has a soft 17 (Ace + 6), continue hitting
    if (total === 17 && hasNaturalBlackjack) {
      total += 10; // Treat Ace as 11 in this case
      hasNaturalBlackjack = false; // Reset the flag
    } else {
      await hitDealer();
      total = getDealerTotal();
    }
  }

  if (total > 21) {
    console.log("dealer busted");
    takeStakes(true);
  } else {
    evaluateWinner();
  }
}

function evaluateWinner() {
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
  return drawOneCard((card) => dealCard(card)).then(() => {
    if (getPlayerTotal() > 21) {
      bustPlayer();
    } else {
      // Continue the game logic after dealing the card
      // You can add additional logic here if needed
    }
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

