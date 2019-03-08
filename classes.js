class ImageObj {
    constructor(id, position, nooftags, tagsArr) {
        this.id = id;
        this.position = position;
        this.nooftags = nooftags;
        this.tagsArr = tagsArr;
    }
    getid() {
        return this.id;
    }
    getPosition() {
        return this.position;
    }
    getNooftags() {
        return this.nooftags;
    }
    getTagsArr() {
        return this.tagsArr;
    }
}

class Slide {
    constructor(id, tags) {
        this.id = id;
        this.tags = tags;
    }
    getid() {
        return this.id;
    }
    getTagsArr() {
        return this.tags;
    }
}

class Slideshow {
    constructor(slide1, slide2, score) {
        this.slide1 = slide1;
        this.slide2 = slide2;
        this.score = score;
    }
    getslide1() {
        return this.slide1;
    }
    getslide2() {
        return this.slide2;
    }
    getscore() {
        return this.score;
    }
}



