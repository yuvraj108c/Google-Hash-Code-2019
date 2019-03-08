// Open file

// get("a_example.txt")
get("b_lovely_landscapes.txt")
    // get("c_memorable_moments.txt")
    // get("d_pet_pictures.txt")
    // get("e_shiny_selfies.txt")
    .then(file => {
        let imagesArray = populateImageArray(file);
        // console.log(imagesArray);

        let slides = createSlides(imagesArray);
        // console.log(slides);

        let slidecombinations = getCombinationOfSlidesWithScore(slides);
        // console.log(slidecombinations);

        let slideshow = createslideshow(slidecombinations);
        // console.log(slideshow);

        let output = "";

        output += slideshow.length + "</br>";

        slideshow.forEach(function (item) {
            item.getid().forEach(i => {
                output += i + "&nbsp";
            })
            output += "</br>";
        });

        document.getElementById('out').innerHTML = output;
    });

// Open file
async function get(filename) {
    let response = await fetch(filename);
    return response.text();
}

// Extract values from file
function populateImageArray(filename) {
    let images = [];

    let lines = filename.split('\n');
    let size = lines.length;

    for (let i = 1; i < size - 1; i++) {
        let imageData = lines[i].split(" ");

        // Get image details
        let position = imageData[0];
        let nooftags = imageData[1];
        let tags = imageData.slice(2, imageData.length);
        let id = i - 1;

        // Create image object
        let img = new ImageObj(id, position, nooftags, tags)
        images.push(img);
    }
    return images;
}

// Create slides from images
function createSlides(images) {
    let slides = [];

    let horizontalImages = images.filter(a => a.getPosition() == "H").sort((a, b) => b.getTagsArr().length - a.getTagsArr().length);
    let verticalImages = images.filter(a => a.getPosition() == "V").sort((a, b) => b.getTagsArr().length - a.getTagsArr().length);

    // Push horizontal images to slide
    horizontalImages.forEach(function (img) {
        let slideObj = new Slide([img.getid()], img.getTagsArr());
        slides.push(slideObj);
    });

    // verticalImages 
    for (let i = 0; i < verticalImages.length - 1; i += 2) {
        let img1 = verticalImages[i];
        let img2 = verticalImages[i + 1];
        let min;

        // if (img1.getTagsArr().length <= img1.getTagsArr().length) {
        //     min = img1;
        // } else {
        //     min = img2;
        // }
        let tags = Array.from(new Set(...img1.getTagsArr(), ...img2.getTagsArr()));
        let slideObj = new Slide([img1.getid(), img2.getid()], tags);
        slides.push(slideObj);
    }

    return slides.sort((a, b) => b.getTagsArr().length - a.getTagsArr().length)

}

function getCombinationOfSlidesWithScore(slides) {
    let size = slides.length;
    let slideshow = [];

    for (let x = 0; x < size - 1; x++) {

        let score = calculateScoreBetweenSlides(slides[x], slides[x + 1])

        if (score > 0) {

            let slideShowObj = new Slideshow(slides[x], slides[x + 1], score)
            slideshow.push(slideShowObj);

        }


    }
    // sort array in descending order of similar tags
    return slideshow.sort((a, b) => b.getscore() - a.getscore());
}

// Arrange slides into slideshow
function createslideshow(arr) {

    let finalslideshow = [];
    let usedId = new Set();

    for (let z = 0; z < arr.length; z++) {
        const element = arr[z];

        let id1 = element.getslide1().getid()
        let id2 = element.getslide2().getid()

        let intersection = Array.from(usedId).filter(x => id1.includes(x));
        let intersection2 = Array.from(usedId).filter(x => id2.includes(x));


        if (intersection.length == 0 && intersection2.length == 0) {
            // console.log(intersection);
            // console.log(intersection2);
            finalslideshow.push(element.getslide1());
            finalslideshow.push(element.getslide2());
            usedId.add(...id1);
            usedId.add(...id2);
        }
    }

    // console.log(usedId);
    return finalslideshow;
}

function findMinimum(a, b, c) {
    let min = 0;
    if (a < b) {
        if (a < c) {
            min = a;
        } else {
            min = c;
        }
    } else if (b < c) {
        min = b;
    }
    return min;
}

function finalSlideShow(arr) {

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function calculateScoreBetweenSlides(slide1, slide2) {

    let slide1Tags = slide1.getTagsArr();
    let slide2Tags = slide2.getTagsArr();

    let countSimilar = slide1Tags.filter(v => slide2Tags.indexOf(v) >= 0).length;
    let countDiffx = slide1Tags.length - countSimilar;
    let countDiffy = slide2Tags.length - countSimilar;

    let score = findMinimum(countSimilar, countDiffx, countDiffy);

    return score;
}
