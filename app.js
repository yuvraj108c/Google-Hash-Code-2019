// Open file
get("b_lovely_landscapes.txt")
    .then(file => {
        let imagesArray = populateImageArray(file);
        // console.log(imagesArray);

        let slides = createSlides(imagesArray);
        // console.log(slides);

        // let slidecombinations = getCombinationOfSlidesWithScore(slides);
        console.log(slideshow);

        // let slideshow = createslideshow(slidecombinations);
        // console.log(slideshow);

        // console.log(slideshow.length);

        // slideshow.forEach(function (item) {
        //     console.log(item.getid());
        // });
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
        let slideObj = new Slide(img.getid() + "", [img], img.getTagsArr());
        slides.push(slideObj);
    });

    // verticals image
    for (let i = 0; i < verticals.length; i += 2) {

        // Get rnd num between 0 and 1
        let rnd = getRandomInt(3);

        // Combine tags of 2 images
        let slideObj;
        let slideid = verticals[i].getid() + " " + verticals[i + 1].getid();

        if (rnd == 0) {
            // Tags of first image
            slideObj = new Slide(slideid, [verticals[i], verticals[i + 1]], verticals[i].getTagsArr());
        } else if (rnd == 1) {
            // Tags of 2nd image
            slideObj = new Slide(slideid, [verticals[i], verticals[i + 1]], verticals[i + 1].getTagsArr());
        } else if (rnd == 2) {
            // Tags of both image
            let tags = verticals[i].getTagsArr().concat(verticals[i + 1].getTagsArr());
            let unique = [...new Set(tags)];
            slideObj = new Slide(slideid, [verticals[i], verticals[i + 1]], Array.from(unique));
        }

        slides.push(slideObj);

    }

    return slides;

}

function getCombinationOfSlidesWithScore(arr) {
    let size = arr.length;
    let slideshow = [];

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {

            if (x !== y) {

                // Get tags array of each slide
                let tagsx = arr[x].getTagsArr();
                let tagsy = arr[y].getTagsArr();


                for (let z = 0; z < tagsx.length; z++) {
                    // Count number of similar tags between 2 img
                    let countSimilar = 0;

                    // Compare each tags
                    for (let w = 0; w < tagsy.length; w++) {
                        if (tagsx[z] == tagsy[w]) {
                            countSimilar++;
                        }
                    }
                    let countDiffx = tagsx.length - countSimilar;
                    let countDiffy = tagsy.length - countSimilar;

                    let score = findMinimum(countSimilar, countDiffx, countDiffy);

                    let slideShowObj = new Slideshow(arr[x], arr[y], score)

                    slideshow.push(slideShowObj);

                }
            }

        }

    }
    // sort array in descending order of similar tags
    return slideshow.sort((a, b) => b.getscore() - a.getscore());
}

// Arrange slides into slideshow
function createslideshow(arr) {

    let finalslideshow = new Set();

    for (let z = 0; z < arr.length; z++) {
        const element = arr[z];

        finalslideshow.add(element.getslide1());
        finalslideshow.add(element.getslide2());
    }
    return Array.from(finalslideshow);
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

