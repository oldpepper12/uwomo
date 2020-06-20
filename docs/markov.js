Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

class MarkovTextGenerator {
    constructor(lookback = 4) {
        this.corpus = {};
        this.startingSeeds = [];
        this.endIndicator = "END";
        this.lookback = lookback;
    }
    digest(textSegments) {
        for (let segment of textSegments) {
            let chars = Array.from(segment).concat(this.endIndicator);
            let i = this.lookback;
            let startSeed = chars.slice(0, i);
            if (startSeed[startSeed.length - 1] !== this.endIndicator) {
                this.startingSeeds.push(startSeed.join(""));
            }
            while (i < chars.length) {
                let seed = chars.slice(i - this.lookback, i).join("");
                if (!this.corpus[seed]) {
                    this.corpus[seed] = [];
                }
                this.corpus[seed].push(chars[i]);
                i++;
            }
        }
    }
    spit() {
        let seed = this.startingSeeds.random();
        let text = seed;
        while (true) {
            let nextChar = this.corpus[seed].random();
            if (nextChar === this.endIndicator) {
                return text;
            }
            text += nextChar;
            seed =
                Array.from(seed)
                    .slice(1)
                    .join("") + nextChar;
        }
    }
}
