import { sigmoid, getRandomNumber } from './utils/math.js'

// ================================================================================
// Neuron
// ================================================================================

// Creates a new neuron with a given number of weights and a bias. The number of weights depends
// on the number of neurons in the previous layer. Weights are initialized to random numbers.
export default class Neuron {
    constructor(weightCount, bias) {
        this.weights = []
        this.bias = bias

        for (let i = 0; i < weightCount; i++) {
            this.weights.push(getRandomNumber(-0.1, 0.1))
        }
    }

    // Calculate the output of the neuron given the inputs
    getNetOutput(X) {
        let total = 0

        for (let i = 0; i < X.length; i++) {
            total += X[i] * this.weights[i]
        }

        // save outputs without sigmoid here if needed in the future

        return total + this.bias
    }

    // Take the output and apply the sigmoid function to squash it between 0 and 1
    getFinalOutput(X) {
        this.inputs = X
        this.output = sigmoid(this.getNetOutput(X))
        return this.output
    }

    // Return the partial derivative of the error with repspect to the output
    get_PdError_Output(targetOutput) {
        return -(targetOutput - this.output)
    }

    // (Unsquash)
    // Return the partial derivative of the total net input with respect to the input
    get_PdTotalNetInput_Input() {
        return this.output * (1 - this.output)
    }

    // Return the partial derivative of the error with respect to the total net input
    get_PdError_TotalNetInput(targetOutput) {
        return (
            this.get_PdError_Output(targetOutput) *
            this.get_PdTotalNetInput_Input()
        )
    }

    // Return the partial derivatice of the total net input with respect to the weight
    get_PdTotalNetInput_Weight(index) {
        return this.inputs[index]
    }

    // Return the partial derivative of the total net input with respect to the bias
    // (this will always be 1 because the bias only shifts the curve up and down,
    // it doesn't affect the slope)
    get_PdTotalNetInput_Bias() {
        return 1
    }
}
