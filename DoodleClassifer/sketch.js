let book_data;
let rainbow_data;
let bicycle_data;
let bowtie_data;
let smiley_data;

let book_training;
let rainbow_training;
let bicycle_training;
let bowtie_training;
let smiley_training;

function preload()
{
  book_data = loadBytes('QuickDrawData/book1000.bin');
  rainbow_data = loadBytes('QuickDrawData/rainbow1000.bin');
  bicycle_data = loadBytes('QuickDrawData/bicycle1000.bin');
  bowtie_data = loadBytes('QuickDrawData/bowtie1000.bin');
  smiley_data = loadBytes('QuickDrawData/smiley1000.bin');
}

function viewbooks() {
  let total = 100;
  for(let n = 0 ; n < total ; n++)
  {
    let offset = n * 784
    let img = createImage(28,28);
    img.loadPixels();
    for(let i = 0; i < 784 ; i++)
    {
      let val = 255 - book_data.bytes[i + offset];
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

function setup() {
  createCanvas(280, 280);
  background(0);

  

}


