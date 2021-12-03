let heightmap;
let terrain;
let terrain_2;
let terrain_3;

// function preload() {
//   heightmap = loadImage('/IMG_0977.jpg');

// }
function handleFileLaser() {
  let file = document.getElementById("file").files[0];
  console.log(file)
  var reader = new FileReader(); // Creating reader instance from FileReader() API
    reader.addEventListener("load", function () { // Setting up base64 URL on image
      console.log(reader.result)
      raw = new Image()
      raw.src = reader.result
      raw.onload = function() {
        img = createImage(raw.width, raw.height);
        img.drawingContext.drawImage(raw, 0, 0);
        img.loadPixels(); // loads image
        img.resize(windowWidth, 0); // resizes image to window size
        img.updatePixels(); // updates image
        img.filter(INVERT);
        make_terrains_laser( img );
      }
    }, false);

    reader.readAsDataURL(file); // Converting file into data URL
}
function handleFileEmboss() {
  let file = document.getElementById("file").files[0];
  console.log(file)
  var reader = new FileReader(); // Creating reader instance from FileReader() API
    reader.addEventListener("load", function () { // Setting up base64 URL on image
      console.log(reader.result)
      raw = new Image()
      raw.src = reader.result
      raw.onload = function() {
        img = createImage(raw.width, raw.height);
        img.drawingContext.drawImage(raw, 0, 0);
        img.loadPixels(); // loads image
        img.resize(windowWidth, 0); // resizes image to window size
        img.updatePixels(); // updates image
        img.filter(INVERT);
        make_terrains_emboss( img );
      }
    }, false);

    reader.readAsDataURL(file); // Converting file into data URL
}

function handleFile1() {
  let file = document.getElementById("file").files[0];
  console.log(file)
  var reader = new FileReader(); // Creating reader instance from FileReader() API
    reader.addEventListener("load", function () { // Setting up base64 URL on image
      console.log(reader.result)
      raw = new Image()
      raw.src = reader.result
      raw.onload = function() {
        img = createImage(raw.width, raw.height);
        img.drawingContext.drawImage(raw, 0, 0);
        img.loadPixels(); // loads image
        img.resize(windowWidth, 0); // resizes image to window size
        img.updatePixels(); // updates image
        img.filter(INVERT);
        make_terrains( img );
      }
    }, false);

    reader.readAsDataURL(file); // Converting file into data URL
}


function make_terrains( img ) {  
  terrain = meshFromHeightmap(img, 0.25);
  terrain_2 = meshFromHeightmap(img, 0.5);
  terrain_3 = meshFromHeightmap(img, 0.75);
}
function make_terrains_emboss( img ) {  
  terrain = meshFromHeightmap2(img);
}
function make_terrains_laser( img ) {  
  terrain = meshFromHeightmap3(img);
}


function setup() {
  createCanvas(windowWidth - 330, windowHeight/1.4, WEBGL);
  //   button = createButton('Print');
  // button.position(10, windowHeight-100);
  noStroke();
  camera(0, -850, 100);

}

function draw() {
  background(224);
 //  if (terrain){
 //   button.mousePressed(image(makeThresh(img, 0.75), 300, 0, 200, 200));
 // }
  // if (terrain_2){
  //       image(makeThresh(img, 0.25), -350, 0, 200, 200);
  //   image(makeThresh(img, 0.5), 300, 0, 200, 200);
  //   image(makeThresh(img, 0.75), 300, 0, 200, 200);
  // }
  // 

  orbitControl(2, 1, 0.05);

  directionalLight(255, 255, 255, 0.5, 1, -0.5);

  // meshFromHeightmap assumes 256x256 unit grid with altitudes from 0 to 255.
  // That results in excessively steap terrain for most use cases.
  rotateX(PI / 2);
  scale(1, 1, 50 / 255);
  
if (terrain) {
  if (terrain_2) {
    translate(-350, 0);
  }
    model(terrain);
  }
      if (terrain_2) {
    translate(300, 0);
    model(terrain_2);
    translate(300, 0);
    model(terrain_3);

  }
}

function makeThresh(img, n){
  let img2 = img;
  let num = n;
  img2.filter(THRESHOLD,num);
  return img2;
}

function meshFromHeightmap2(image, detailX = 100, detailY = 100) {
  return new p5.Geometry(
    detailX,
    detailY,
    function() {
      // Pixels per sample
      const xpps = (image.width - 1) / detailX;
      const ypps = (image.height - 1) / detailY;
      const xoff = -128;
      const yoff = -128;
      const unitX = 256 / detailX;
      const unitY = 256 / detailY;
      
      let values = [];
      for (let j = 0; j <= detailY; j++) {
        for (let i = 0; i <= detailX; i++) {
          // let v = gray(image.get(round(i * xpps), round(j * ypps)));
          let v = gray( image.get(round(i * xpps), round(j * ypps)) ) * 0.1;
          this.vertices.push(new p5.Vector(
            xoff + i * unitX,
            yoff + j * unitY,
            v
          ));
          values.push(v);
        }
      }
      
      this.computeFaces();
      this.computeNormals();
      
      this.gid = `terrain|${cyrb53(values)}`;
    }
  )
}


function meshFromHeightmap(img_0, threshold = 0.25, detailX = 100, detailY = 100) {
  return new p5.Geometry(detailX, detailY, function () {
    
    let image = createImage(img_0.width, img_0.height);
    image.copy( img_0, 0, 0, img_0.width, img_0.height, 0, 0, img_0.width, img_0.height );
    image.filter(THRESHOLD, threshold);
    
    // Pixels per sample
    const xpps = (image.width - 1) / detailX;
    const ypps = (image.height - 1) / detailY;
    const xoff = -128;
    const yoff = -128;
    const unitX = 256 / detailX;
    const unitY = 256 / detailY;

    let values = [];
    
    for (let j = 0; j <= detailY; j++) {
      for (let i = 0; i <= detailX; i++) {
        // let v = gray(image.get(round(i * xpps), round(j * ypps)));
        let v = gray(image.get(round(i * xpps), round(j * ypps))) * 0.1;
        this.vertices.push(
          new p5.Vector(xoff + i * unitX, yoff + j * unitY, v)
        );
        values.push(v);
      }
    }

    this.computeFaces();
    this.computeNormals();

    this.gid = `terrain|${cyrb53(values)}`;
  });
}
function meshFromHeightmap3(img_0, detailX = 100, detailY = 100) {
  return new p5.Geometry(detailX, detailY, function () {
    
    let image = createImage(img_0.width, img_0.height);
    image.copy( img_0, 0, 0, img_0.width, img_0.height, 0, 0, img_0.width, img_0.height );
    makeDithered(image, 1);
    // Pixels per sample
    const xpps = (image.width - 1) / detailX;
    const ypps = (image.height - 1) / detailY;
    const xoff = -128;
    const yoff = -128;
    const unitX = 256 / detailX;
    const unitY = 256 / detailY;

    let values = [];
    
    for (let j = 0; j <= detailY; j++) {
      for (let i = 0; i <= detailX; i++) {
        // let v = gray(image.get(round(i * xpps), round(j * ypps)));
        let v = gray(image.get(round(i * xpps), round(j * ypps))) * 0.1;
        this.vertices.push(
          new p5.Vector(xoff + i * unitX, yoff + j * unitY, v)
        );
        values.push(v);
      }
    }

    this.computeFaces();
    this.computeNormals();

    this.gid = `terrain|${cyrb53(values)}`;
  });
}

function meshFromHeightmap2(img_0, detailX = 100, detailY = 100) {
  return new p5.Geometry(detailX, detailY, function () {
    
    let image = createImage(img_0.width, img_0.height);
    image.copy( img_0, 0, 0, img_0.width, img_0.height, 0, 0, img_0.width, img_0.height );
    
    // Pixels per sample
    const xpps = (image.width - 1) / detailX;
    const ypps = (image.height - 1) / detailY;
    const xoff = -128;
    const yoff = -128;
    const unitX = 256 / detailX;
    const unitY = 256 / detailY;

    let values = [];
    
    for (let j = 0; j <= detailY; j++) {
      for (let i = 0; i <= detailX; i++) {
        // let v = gray(image.get(round(i * xpps), round(j * ypps)));
        let v = gray(image.get(round(i * xpps), round(j * ypps))) * 0.1;
        this.vertices.push(
          new p5.Vector(xoff + i * unitX, yoff + j * unitY, v)
        );
        values.push(v);
      }
    }

    this.computeFaces();
    this.computeNormals();

    this.gid = `terrain|${cyrb53(values)}`;
  });
}

// The built in p5.js RGB -> lightness function leaves something to be desired.
// Credit: https://stackoverflow.com/a/13558570/229247

// sRGB luminance(Y) values
const rY = 0.212655;
const gY = 0.715158;
const bY = 0.072187;

// Inverse of sRGB "gamma" function. (approx 2.2)
function inv_gam_sRGB(ic) {
  const c = ic / 255.0;
  if (c <= 0.04045) {
    return c / 12.92;
  } else {
    return pow((c + 0.055) / 1.055, 2.4);
  }
}

// sRGB "gamma" function (approx 2.2)
function gam_sRGB(v) {
  if (v <= 0.0031308) {
    v *= 12.92;
  } else {
    v = 1.055 * pow(v, 1.0 / 2.4) - 0.055;
  }
  return int(v * 255 + 0.5);
}

// GRAY VALUE ("brightness")
function gray(c) {
  return gam_sRGB(
    rY * inv_gam_sRGB(red(c)) +
      gY * inv_gam_sRGB(green(c)) +
      bY * inv_gam_sRGB(blue(c))
  );
}

// Generate a hash code from an array of integers
const cyrb53 = function (ary) {
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  for (let i = 0, v; i < ary.length; i++) {
    v = ary[i];
    h1 = Math.imul(h1 ^ v, 2654435761);
    h2 = Math.imul(h2 ^ v, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

//dithered










function imageIndex(img, x, y) {
  return 4 * (x + y * img.width);
}

function getColorAtindex(img, x, y) {
  let idx = imageIndex(img, x, y);
  let pix = img.pixels;
  let red = pix[idx];
  let green = pix[idx + 1];
  let blue = pix[idx + 2];
  let alpha = pix[idx + 3];
  return color(red, green, blue, alpha);
}

function setColorAtIndex(img, x, y, clr) {
  let idx = imageIndex(img, x, y);

  let pix = img.pixels;
  pix[idx] = red(clr);
  pix[idx + 1] = green(clr);
  pix[idx + 2] = blue(clr);
  pix[idx + 3] = alpha(clr);
}

// Finds the closest step for a given value
// The step 0 is always included, so the number of steps
// is actually steps + 1
function closestStep(max, steps, value) {
  return round(steps * value / 255) * floor(255 / steps);
}

function makeDithered(img, steps) {
  img.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let clr = getColorAtindex(img, x, y);
      let oldR = red(clr);
      let oldG = green(clr);
      let oldB = blue(clr);
      let newR = closestStep(255, steps, oldR);
      let newG = closestStep(255, steps, oldG);
      let newB = closestStep(255, steps, oldB);

      let newClr = color(newR, newG, newB);
      setColorAtIndex(img, x, y, newClr);

      let errR = oldR - newR;
      let errG = oldG - newG;
      let errB = oldB - newB;

      distributeError(img, x, y, errR, errG, errB);
    }
  }

  img.updatePixels();
}

function distributeError(img, x, y, errR, errG, errB) {
  addError(img, 7 / 16.0, x + 1, y, errR, errG, errB);
  addError(img, 3 / 16.0, x - 1, y + 1, errR, errG, errB);
  addError(img, 5 / 16.0, x, y + 1, errR, errG, errB);
  addError(img, 1 / 16.0, x + 1, y + 1, errR, errG, errB);
}

function addError(img, factor, x, y, errR, errG, errB) {
  if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;
  let clr = getColorAtindex(img, x, y);
  let r = red(clr);
  let g = green(clr);
  let b = blue(clr);
  clr.setRed(r + errR * factor);
  clr.setGreen(g + errG * factor);
  clr.setBlue(b + errB * factor);

  setColorAtIndex(img, x, y, clr);
}
