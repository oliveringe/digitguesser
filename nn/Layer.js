import Neuron from './Neuron.js'
import { getRandomNumber } from './utils/math.js'
// import { sigmoid, getRandomNumber } from "../utils/math.js";

// ================================================================================
// Layer
// ================================================================================

// Creates a new neural network layer with the given number of neurons. Assigns each
// neuron the given number of weights.
export default class Layer {
    constructor(neuronCount, weightCount) {
        this.neurons = []

        for (let i = 0; i < neuronCount; i++) {
            this.neurons.push(
                new Neuron(weightCount, getRandomNumber(-0.1, 0.1))
            )
        }
    }

    feedForward(X) {
        const outputs = []

        for (let i = 0; i < this.neurons.length; i++) {
            let neuron = this.neurons[i]
            outputs.push(neuron.getFinalOutput(X))
        }

        return outputs
    }
}
