import { sigmoid, getRandomNumber } from './utils/math.js'

export default class Neuron {
    constructor(weightCount, bias) {
        this.weights = []
        this.bias = bias

        for (let i = 0; i < weightCount; i++) {
            this.weights.push(getRandomNumber(-0.1, 0.1))
        }
    }

    getNetOutput(X) {
        let total = 0

        for (let i = 0; i < X.length; i++) {
            total += X[i] * this.weights[i]
        }

        // save outputs without sigmoid here if needed in the future

        return total + this.bias
    }

    getFinalOutput(X) {
        this.inputs = X
        this.output = sigmoid(this.getNetOutput(X))
        return this.output
    }

    get_PdError_Output(targetOutput) {
        return -(targetOutput - this.output)
    }

    // unsquash
    get_PdTotalNetInput_Input() {
        return this.output * (1 - this.output)
    }

    get_PdError_TotalNetInput(targetOutput) {
        return (
            this.get_PdError_Output(targetOutput) *
            this.get_PdTotalNetInput_Input()
        )
    }

    get_PdTotalNetInput_Weight(index) {
        return this.inputs[index]
    }

    get_PdTotalNetInput_Bias() {
        return 1
    }
}
