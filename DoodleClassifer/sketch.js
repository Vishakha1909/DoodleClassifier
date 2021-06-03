const len = 784;
const total_data = 5000;
let book_data;
let rainbow_data;
let bicycle_data;
let bowtie_data;
let smiley_data;

const BOOK = 0;
const RAINBOW = 1;
const BICYCLE = 2;
const BOWTIE = 3;
const SMILEY = 4;

let nn;

let book = {};
let rainbow = {};
let bicycle = {};
let bowtie = {};
let smiley = {};

function preload()
{
  book_data = loadBytes('QuickDrawData/book5000.bin');
  rainbow_data = loadBytes('QuickDrawData/rainbow5000.bin');
  bicycle_data = loadBytes('QuickDrawData/bicycle5000.bin');
  bowtie_data = loadBytes('QuickDrawData/bowtie5000.bin');
  smiley_data = loadBytes('QuickDrawData/smiley5000.bin');
}

function viewData(data) {
  let total = 100;
  for(let n = 0 ; n < total ; n++)
  {
    let offset = n * 784
    let img = createImage(28,28);
    img.loadPixels();
    for(let i = 0; i < 784 ; i++)
    {
      let val = 255 - data.bytes[i + offset];
      img.pixels[i * 4 + 0] = val;
      img.pixels[i * 4 + 1] = val;
      img.pixels[i * 4 + 2] = val;
      img.pixels[i * 4 + 3] = 255;
    }
    img.updatePixels();
    let x = 28 * (n % 10);
    let y = 28 * floor(n / 10);
    image(img,x,y);
  }
}

function prepareData(category,data, label) {
  category.training= [];
  category.testing = [];
  for(let i = 0 ; i < total_data ; i++)
  {
    let offset = i * len;
    let threshold = floor(0.9 * total_data);
    if(i < threshold) {
      category.training[i] = data.bytes.subarray(offset, offset+len);
      category.training[i].label = label;
    }
    else {
      category.testing[i - threshold] = data.bytes.subarray(offset, offset+len);
      category.testing[i - threshold].label = label;
    }
  }
}

function trainEpoch(training)
{
  shuffle(training,true);
  for(let i = 0 ; i < training.length; i++)
  {
    let data = training[i];
    let inputs = Array.from(data).map(x => x / 255);
    let label = training[i].label;
    let targets = [0,0,0,0,0];
    targets[label] = 1;
    nn.train(inputs,targets);
  }
}

function testingData(testing)
{
  let correct = 0;
  for(let i = 0 ; i < testing.length; i++)
  {
    let data = testing[i];
    let inputs = data.map(x => x / 255);
    let label = testing[i].label;
    let guess = nn.predict(inputs);
    let m = max(guess);
    let classification = guess.indexOf(m);
    if(classification == label)
    {
    correct++;
    }
  }
  let percent = 100 * correct / testing.length;
  return percent;
}
let cnv;
function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y+ 20);
}
function windowResized() {
  centerCanvas();
}

function setup() {
  cnv = createCanvas(280, 280);
  centerCanvas();
  background(255);

  //preparing the data
  prepareData(book,book_data, BOOK);
  prepareData(rainbow,rainbow_data, RAINBOW);
  prepareData(bicycle,bicycle_data, BICYCLE);
  prepareData(bowtie,bowtie_data, BOWTIE);
  prepareData(smiley,smiley_data, SMILEY);

  //making the neural network
  //784 inputs, 64 hidden nodes, 5 outputs
  nn = new NeuralNetwork(784,64,5);

  //randomizing the data
  let training = []
  training = training.concat(book.training);
  training = training.concat(rainbow.training);
  training = training.concat(bicycle.training);
  training = training.concat(bowtie.training);
  training = training.concat(smiley.training);

  let testing = []
  testing = testing.concat(book.testing);
  testing = testing.concat(rainbow.testing);
  testing = testing.concat(bicycle.testing);
  testing = testing.concat(bowtie.testing);
  testing = testing.concat(smiley.testing);


  // for(let i = 0 ; i < 5 ; i++)
  // {
  //   trainEpoch(training);
  //   console.log("Epoch: " + (i+1));
  //   let percent = testingData(testing);
  //   console.log("Correct percentage: " + percent);
  // }
  let epochCounter = 0;
  let trainButton = select('#train');
  trainButton.mousePressed(function() {
    trainEpoch(training);
    epochCounter++;
    window.alert("Epoch: " + epochCounter + " trained");
  });
  let testButton = select('#test');
  testButton.mousePressed(function() {
    let percent = testingData(testing);
    window.alert("Percent: " + nf(percent,2,2) + "%");
  });
  let guessButton = select('#guess');
  guessButton.mousePressed(function() {
    let inputs = [];
    let img = get();
    img.resize(28,28);
    img.loadPixels();
    for(let i = 0 ; i < len; i++)
    {
      let brightness = img.pixels[i * 4];
      inputs[i] = brightness / 255.0;
    }
    let guess = nn.predict(inputs);
    let m = max(guess);
    let final;
    let classification = guess.indexOf(m);
    if(classification === BOOK)
    {
      final = "BOOK";
      console.log("BOOK");
    }
    else if(classification === RAINBOW)
    {
      final = "RAINBOW";
      console.log("RAINBOW");
    }
    else if(classification === BICYCLE)
    {
      final = "BICYCLE";
      console.log("BICYCLE");
    }
    else if(classification === BOWTIE)
    {
      final = "BOWTIE";
      console.log("BOWTIE");
    }
    else if(classification === SMILEY)
    {
      final = "SMILEY FACE";
      console.log("SMILEY FACE")
    }
    else
    {
      final = "NOT SURE";
    }
    window.alert(final);
  });

  let clearButton = select('#clear');
  clearButton.mousePressed(function() {
    background(255);
  });

}

function draw() {
  strokeWeight(8);
  stroke(0);
  if(mouseIsPressed)
  {
    line(pmouseX,pmouseY,mouseX,mouseY);
  }
}

