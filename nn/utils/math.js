// Class with various math functions that are helpful throughout the network

// The sigmoid funtion is an activation function. It is defined as 1 / (1 + e^-x)
export function sigmoid(x) {
    return 1 / (1 + Math.exp(-x))
}

// The reLU function is an activation function. It is defined as
// 0 if the input is less than 0, and the input if the input is greater than or equal to 0.
export function reLU(x) {
    return Math.max(0, x)
}

// The softmax function is another activation function that is used in the output layer of the neural network.
// The purpose is to convert the output values into a probability distribution, since the ouput values before
// being passed through aren't normalized. The softmax funtion is defined as softmax(x) = e^x / sum(e^(x - max(x))
// Subtracting max(x) is done to prevent overflow.
export function softmax(x) {
    let x_stabilized = [...x]
    for (let i = 0; i < x.length; i++) {
        x_stabilized[i] -= Math.max(...x)
    }

    let sum = 0
    for (let i = 0; i < x.length; i++) {
        sum += Math.exp(x_stabilized[i])
    }

    let result = []
    for (let i = 0; i < x.length; i++) {
        result.push(Math.exp(x_stabilized[i]) / sum)
    }

    return result
}

// This cost function is called a categorical crossentropy function. It is defined as the negative
// sum of the product of the target value and the log of the output value. The target value is a one-hot encoded
// array of the correct value. The output value is the output of the network. The cost function is defined as
// -sum(y * log(output)) where y is the target value and output is the output of the network.
export function softmaxLoss(output, y) {
    let sum = 0
    for (let i = 0; i < output.length; i++) {
        sum += y[i] * Math.log(output[i])
    }

    return -sum
}

// The mean squared error cost function is defined as the sum of the square of the difference between the target value.
export function meansSquaredError(output, y) {
    let sum = 0
    for (let i = 0; i < output.length; i++) {
        sum += Math.pow(y[i] - output[i], 2)
    }

    return sum / output.length
}

// Get a random number in a given range
export function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min
}

export function dot(a, b) {
    // Check if the arrays are of the same length
    if (a.length !== b.length) {
        throw new Error('Arrays must be of the same length')
    }

    // Calculate the dot product
    let product = 0
    for (let i = 0; i < a.length; i++) {
        product += a[i] * b[i]
    }

    return product
}
