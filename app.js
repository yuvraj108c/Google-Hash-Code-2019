// Open file
// a_example.txt
// b_lovely_landscapes.txt
// c_memorable_moments.txt
// d_pet_pictures.txt
// e_shiny_selfies.txt
get("c_memorable_moments.txt")
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
    let N = lines[0];
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
function createSlides(arr) {
    // Array to check if images exist in slide
    let slides = [];

    let horizontals = arr.filter(a => a.getPosition() == "H");
    let verticals = arr.filter(a => a.getPosition() == "V");

    // Push horizontal images to slide
    horizontals.forEach(function (img) {
        let slideObj = new Slide([img.getid()], [img], img.getTagsArr());
        slides.push(slideObj);
    });

    // verticals image

    let usedNum = [];

    for (let i = 0; i < verticals.length; i += 2) {
        let size = verticals.length;

        let rnd1 = getRandomInt(size - 1);
        let rnd2 = getRandomInt(size - 1);

        if (usedNum.indexOf(rnd1) == -1 && usedNum.indexOf(rnd2) == -1 && (rnd1 !== rnd2)) {

            // Get rnd num between 0 and 1
            let rnd = getRandomInt(3);

            // Combine tags of 2 images
            let slideObj;

            let slideid = [verticals[rnd1].getid(), verticals[rnd2].getid()];


            if (rnd == 0) {
                // Tags of first image
                slideObj = new Slide(slideid, [verticals[rnd1], verticals[rnd2]], verticals[rnd1].getTagsArr());
            } else if (rnd == 1) {
                // Tags of 2nd image
                slideObj = new Slide(slideid, [verticals[rnd1], verticals[rnd2]], verticals[rnd2].getTagsArr());
            } else if (rnd == 2) {
                // Tags of both image
                let tags = verticals[rnd1].getTagsArr().concat(verticals[rnd2].getTagsArr());
                let unique = [...new Set(tags)];
                slideObj = new Slide(slideid, [verticals[rnd1], verticals[rnd2]], Array.from(unique));
            }

            slides.push(slideObj);
            usedNum.push(rnd1);
            usedNum.push(rnd2);
        }


    }

    return slides;

}

function getCombinationOfSlidesWithScore(arr) {
    let size = arr.length;
    let slideshow = [];

    for (let x = 0; x < size; x++) {
        let rndx = getRandomInt(size - 1);
        let rndy = getRandomInt(size - 1);

        // Get tags array of each slide
        let tagsx = arr[rndx].getTagsArr();
        let tagsy = arr[rndy].getTagsArr();

        let setx = new Set([...tagsx]);

        // Count number of similar tags between 2 img
        let countSimilar = 0;

        // Compare each tags
        for (let w = 0; w < tagsy.length; w++) {
            if (setx.has(tagsy[w])) {
                countSimilar++;
            }
        }
        let countDiffx = tagsx.length - countSimilar;
        let countDiffy = tagsy.length - countSimilar;

        let score = findMinimum(countSimilar, countDiffx, countDiffy);

        let slideShowObj = new Slideshow(arr[rndx], arr[rndy], score)

        slideshow.push(slideShowObj);

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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

