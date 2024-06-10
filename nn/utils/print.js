// print the number that the model guesses
export function printGuess(output) {
    let max = 0;
    let number = -1;
    for (let i = 0; i < output.length; i++) {
        if (output[i] > max) {
            max = output[i];
            number = i;
        }
    }

    console.log(number);
}

// print the percent likeleyhood that the image was each number
export function printPercent(output) {
    for (let i = 0; i < output.length; i++) {
        let percent = Math.round(10000000 * output[i]) / 100000;
        console.log(i + ": " + percent + "%");
    }
}

export function printSum(output) {
    sum = 0;
    for (let i = 0; i < output.length; i++) {
        let percent = Math.round(10000000 * output[i]) / 100000;
        sum += percent;
    }
}
