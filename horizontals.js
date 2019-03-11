let threshold;
let leftovers = [];
let transitionsWithScores2 = [];
let slides;
let countExited = 0;
// get("a_example.txt")
// get("b_lovely_landscapes.txt")

get("c_memorable_moments.txt")
    // get("d_pet_pictures.txt")
    // get("e_shiny_selfies.txt")
    .then(file => {

        let images = populateImageArray(file);
        console.log("Number of images: " + images.length);
        // document.getElementById('images').textContent = images.length;
        // console.log(images);

        slides = convertImagesToSlides(images);
        console.log("Total Number of slides: " + slides.length);
        // document.getElementById('slides').textContent = slides.length;

        threshold = slides.length;
        if (slides.length % 2 == 0) {
        } else {
            threshold = slides.length - 1;
        }

        // console.log(slides);

        do {
            slides = getSlideTransitionsWithScores(slides);
        } while (slides.length > 25 && countExited < 5);

        slides.forEach(r => leftovers.push(r));

        // console.log(transitionsWithScores2);
        // console.log("Number of scoring transitions: " + transitionsWithScores2.length);
        // // document.getElementById('transition').textContent = transitionsWithScores.length;
        // // console.log(transitionsWithScores);

        let slideshow = finalSlideShow(transitionsWithScores2);
        console.log("Number of scoring slides : " + slideshow.length);
        console.log("Number of leftovers: " + leftovers.length);
        // // // document.getElementById('slideshow').textContent = slideshow.length;

        // // // console.log(slideshow);

        output(slideshow)

    });

async function get(filename) {
    let response = await fetch(filename);
    return response.text();
}


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


function convertImagesToSlides(imagesArray) {
    let horizontals = imagesArray.filter(a => a.getPosition() == "H");
    let verticals = imagesArray.filter(a => a.getPosition() == "V");

    let sizeV = verticals.length;
    let sizeH = horizontals.length

    // document.getElementById('vertical').textContent = sizeV;
    // document.getElementById('horizontal').textContent = sizeH;

    console.log("Number of vertical images: " + sizeV);
    console.log("Number of horizontals images: " + sizeH);

    let allSlides = [];

    if (sizeH > 0) {
        horizontals.forEach(img => {
            let slideObj = new Slide([img.getid()], img.getTagsArr());
            allSlides.push(slideObj);
        })
    }

    if (sizeV > 0) {
        let verticalSlides = [];
        let usedids = new Set();
        let target = sizeV / 1.001;

        // document.getElementById('target').textContent = target;

        do {
            let x = getRandomInt(sizeV);
            let y = getRandomInt(sizeV);

            let image1, image2;

            if (x !== y) {
                image1 = verticals[x];
                image2 = verticals[y];

                let usedImage1 = usedids.has(image1.getid().toString());
                let usedImage2 = usedids.has(image2.getid().toString());

                if (usedImage1 == false && usedImage2 == false) {

                    if (image1.getNooftags() <= image2.getNooftags()) {

                        let id = [image1.getid(), image2.getid()];
                        let tags = Array.from(new Set([...image1.getTagsArr(), ...image2.getTagsArr()]));

                        let slideObj = new Slide(id, tags);
                        verticalSlides.push(slideObj)

                        usedids.add(image1.getid().toString())
                        usedids.add(image2.getid().toString())
                    }
                }
            }
            // document.getElementById('generated').textContent = usedids.size;
        } while (usedids.size < target);

        allSlides.push(...verticalSlides);

        let remaining = verticals.filter(a => usedids.has(a.getid().toString()) == false);
        console.log("Number of vertical images without pairs: " + remaining.length);
        for (let z = 0; z < remaining.length - 1; z += 2) {
            let image1R = remaining[z];
            let image2R = remaining[z + 1];

            let idR = [image1R.getid(), image2R.getid()];
            let tagsR = Array.from(new Set([...image1R.getTagsArr(), ...image2R.getTagsArr()]));
            let slideObjR = new Slide(idR, tagsR);

            allSlides.push(slideObjR);

        }

    }

    return allSlides;
}


function getSlideTransitionsWithScores(slidesArray) {
    let size = slidesArray.length;
    let transitionSlides = [];
    let usedids = new Set();
    let transitionLookup = [];
    let outercount = 0;
    let swapped = 0;
    let compared = 0;
    let exited = false;

    do {

        if (outercount > 2) {
            exited = true;
            break;
        }

        let scoreBetweenSlides = 0;
        let slide1, slide2;

        let innercount = 0;
        let broken = false;
        let alreadyInTransition;

        do {
            if (innercount > 50) {
                broken = true;
                break;
            }

            let x = getRandomInt(size);
            let y = getRandomInt(size);

            if (x !== y) {

                slide1 = slidesArray[x];
                slide2 = slidesArray[y];

                scoreBetweenSlides = calculateScoreBetweenSlides(slide1, slide2);

                // console.log("Innercount: " + innercount);
            }
            innercount++;
        } while (scoreBetweenSlides == 0);

        if (broken == false) {

            let slideid1 = slide1.getid().toString();
            let slideid2 = slide2.getid().toString();

            if (usedids.has(slideid1)) {
                alreadyInTransition = slide1;
            } else if (usedids.has(slideid2)) {
                alreadyInTransition = slide2;
            }


            let slideObj = new Slideshow(slide1, slide2, scoreBetweenSlides);


            if (alreadyInTransition !== undefined) {

                let currentid = alreadyInTransition.getid().toString();

                let previousIndexOfTransition = transitionLookup[currentid];

                if (previousIndexOfTransition !== undefined) {

                    if (scoreBetweenSlides > transitionSlides[previousIndexOfTransition].getscore()) {
                        let previous = transitionSlides[previousIndexOfTransition];

                        delete transitionSlides[previousIndexOfTransition];
                        transitionSlides[previousIndexOfTransition] = slideObj;

                        let prevSlide1 = previous.getslide1().getid();
                        let prevSlide2 = previous.getslide2().getid();

                        delete transitionLookup[prevSlide1];
                        delete transitionLookup[prevSlide2];

                        usedids.delete(prevSlide1)
                        usedids.delete(prevSlide2)

                        usedids.add(slide1);
                        usedids.add(slide2);

                        transitionLookup[slideid1] = previousIndexOfTransition
                        transitionLookup[slideid2] = previousIndexOfTransition

                        swapped++;
                    }
                }

                compared++;
            } else {
                transitionSlides.push(slideObj);

                let slideid1 = slide1.getid().toString();
                let slideid2 = slide2.getid().toString();

                transitionLookup[slideid1] = transitionSlides.length - 1;
                transitionLookup[slideid2] = transitionSlides.length - 1;

                usedids.add(slide1);
                usedids.add(slide2);

            }
            outercount = 0;
        } else {
            outercount++;
        }

        // console.log("Size of usedId for transitions: " + usedids.size);
        // console.log("outercount : " + outercount);

    } while (usedids.size < threshold / 1.1);


    remaining = slidesArray.filter(a => usedids.has(a.getid().toString()) == false);
    // console.log("Number of remaining: " + remaining.length);
    // console.log("Number of comparison: " + compared);
    // console.log("Number of swapping: " + swapped);

    // console.log("Exited: " + exited);

    if (exited == true) {
        countExited++;
    }

    transitionsWithScores2.push(...transitionSlides);

    return remaining;
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


function finalSlideShow(transitions) {
    let slideshow = [];

    transitions.forEach(transition => {
        slideshow.push(transition.getslide1())
        slideshow.push(transition.getslide2())
    });

    return slideshow;
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


function output(slideshow) {
    let output = "";

    let total = slideshow.length + remaining.length;

    output += total + "</br>";

    slideshow.forEach(function (item) {
        let ids = item.getid();
        ids.forEach(id => output += id + "&nbsp;");
        output += "</br>";
    });

    leftovers.forEach(function (item) {
        let ids = item.getid();
        ids.forEach(id => output += id + "&nbsp;");
        output += "</br>";
    });

    document.getElementById('out').innerHTML = output;
}



