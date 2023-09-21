// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/Dmqhy3Ml6/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

let foodApi;
let foodUrl = "https://api.edamam.com/api/recipes/v2?type=public&app_id=b526305b&app_key=%205b42b866bd86293457e4661406c68e1a%09&q=";

function setup() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  createCanvas(320, 260);
  //Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  //Start classifying
  classifyVideo();
  setInterval(loadRecipes, 5000);
}

function loadRecipes() {
  var url = foodUrl + label;
  print(url);
  foodApi = loadJSON(url, resultRecipes);
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  
  // Classifiy again!
  classifyVideo();
}


// food list
function resultRecipes(recipe) {
  // https://stackoverflow.com/questions/4967289/dynamically-adding-removing-a-div-to-html
  var div = document.getElementById('card');
  while (div) {
    div.parentNode.removeChild(div);
    div = document.getElementById('card');
  }
  for (i = 0; i < recipe.hits.length; i++) {    
    food = recipe.hits[i].recipe;
    table.append(createCard(food.image, food.label, food.calories.toFixed(2), food.url))
  }
}


const table = document.getElementsByClassName("table")[0];
function createCard(img, title, description, link) {
  const card = document.createElement("a");
  card.className = "card sponsor-section-card w-800 mw-full m-sm-20 p-0 d-flex ";
  card.href = link;
  card.target = "_blank";
  card.id = "card";
  
  const innerCard = document.createElement("div");
  innerCard.className = "w-100 h-100 m-10 align-self-center";
  
  const cardImage = document.createElement("img");
  cardImage.className = "d-block w-100 h-100 rounded";
  cardImage.src = img;
  
  const outerTextBox = document.createElement("div");
  outerTextBox.className = "flex-grow-1 overflow-y-hidden d-flex align-items-center position-relative h-120";
  
  const innerTextBox = document.createElement("div");
  innerTextBox.className = "p-10 w-full m-auto";
  
  const cardTitle = document.createElement("h6");
  cardTitle.className = "font-size-10 text-dark-lm text-light-dm m-0 mb-5 text-truncate font-weight-medium";
  cardTitle.innerText = title;
  
  const cardDescription = document.createElement("p");
  cardDescription.className = "font-size-12 mt-5 mb-0";
  cardDescription.innerText = "Calories: " + description;
  
  const clickButton = document.createElement("span");
  clickButton.className = "font-size-12 text-primary text-smoothing-auto-dm d-inline-block";
  clickButton.innerText = "Click here";
  
  card.append(innerCard);
  innerCard.append(cardImage);
  card.append(outerTextBox);
  outerTextBox.append(innerTextBox);
  innerTextBox.append(cardTitle);
  innerTextBox.append(cardDescription);
  innerTextBox.append(clickButton);
  
  return card;
}

function keyReleased() {
  if (key == 'f') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}