import Layer from './Layer.js'

// ================================================================================
// NeuralNetwork
// ================================================================================

// A network has three properties: hiddenLayer, outputLayer, and LEARNING_RATE. HiddenLayer and outputLayer represent the number of neurons in the layer.
// The learning rate represents the rate at which the biases are updated during training.
export default class NeuralNetwork {
    constructor(hiddenLayerSize, LEARNING_RATE) {
        this.hiddenLayer = new Layer(hiddenLayerSize, 784)
        this.outputLayer = new Layer(10, hiddenLayerSize)

        this.LEARNING_RATE = LEARNING_RATE
    }

    // takes an array of inputs and feeds them through the network
    feedForward(X) {
        let outputs = []

        outputs = this.hiddenLayer.feedForward(X)
        outputs = this.outputLayer.feedForward(outputs)

        return outputs
    }

    // Train set takes an array of images and an array of labels and trains the network on each image
    trainSet(images, labels) {
        if (images.length !== labels.length) {
            console.log('Error: images and labels must be the same length')
        }

        images.forEach((image, index) => {
            console.log('Training image', index + 1)
            this.trainImage(image, labels[index])
        })
    }

    // Takes an array of inputs (length 784) and the expected output for that image (length 10) to train the network

    // X - is an array of mnist images where each item in the array is a float
    // expected - is the ideal output for the corresponding input in X (by index), e.g. [0, 0, 0, 0, 0, 0, 0, 0, 0, 1] for 9

    // Training basic outline:
    // 1. Feed the data through
    // 2. Calculate the error at the output layer
    // 3. Calculate the partial derivative of the error with respect to each given weight
    // 4. Use the chain rule to break that down into a series of partial derivatives that we can compute
    // 5. Update the wieghts by subtracting the current weight by a learning rate * the pd of the error with respect to the weight
    // 6. Repeat for the biases
    trainImage(X, expected) {
        this.feedForward(X)

        // #1 output layer deltas

        const pdErrors_OutputNeuronTotalNetInput = []

        for (let i = 0; i < this.outputLayer.neurons.length; i++) {
            pdErrors_OutputNeuronTotalNetInput.push(
                this.outputLayer.neurons[i].get_PdError_TotalNetInput(
                    expected[i]
                )
            )
        }

        // #2 hidden layer deltas

        const pdErrors_HiddenNeuronTotalNetInput = Array(
            this.hiddenLayer.neurons.length
        ).fill(0)

        for (let i = 0; i < this.hiddenLayer.neurons.length; i++) {
            // We need to calculate the derivative of the error with respect
            // to the output of each hidden layer neuron
            // dE/dyⱼ = Σ ∂E/∂zⱼ * ∂z/∂yⱼ = Σ ∂E/∂zⱼ * wᵢⱼ
            let dError_HiddenNeuronOutput = 0

            for (let j = 0; j < this.outputLayer.neurons.length; j++) {
                dError_HiddenNeuronOutput +=
                    pdErrors_OutputNeuronTotalNetInput[j] *
                    this.outputLayer.neurons[j].weights[i]
            }

            // ∂E/∂zⱼ = dE/dyⱼ * ∂zⱼ/∂
            pdErrors_HiddenNeuronTotalNetInput[i] =
                dError_HiddenNeuronOutput *
                this.hiddenLayer.neurons[i].get_PdTotalNetInput_Input()
        }

        // #3 Update output neuron weights
        // w_ho represents a weight in the output layer at an index i
        for (let i = 0; i < this.outputLayer.neurons.length; i++) {
            for (
                let w_ho = 0;
                w_ho < this.outputLayer.neurons[i].weights.length;
                w_ho++
            ) {
                const pdError_Weight =
                    pdErrors_OutputNeuronTotalNetInput[i] *
                    this.outputLayer.neurons[i].get_PdTotalNetInput_Weight(w_ho)

                this.outputLayer.neurons[i].weights[w_ho] -=
                    this.LEARNING_RATE * pdError_Weight
            }
        }

        // #4 Update hidden neuron weights
        // w_ih represents a weight in the hidden layer at index i
        for (let i = 0; i < this.hiddenLayer.neurons.length; i++) {
            for (
                let w_ih = 0;
                w_ih < this.hiddenLayer.neurons[i].weights.length;
                w_ih++
            ) {
                const pdError_Weight =
                    pdErrors_HiddenNeuronTotalNetInput[i] *
                    this.hiddenLayer.neurons[i].get_PdTotalNetInput_Weight(w_ih)
                this.hiddenLayer.neurons[i].weights[w_ih] -=
                    this.LEARNING_RATE * pdError_Weight
            }
        }

        // # 5. Update output neuron bias
        for (let i = 0; i < this.outputLayer.neurons.length; i++) {
            // ∂Eⱼ/∂wᵢⱼ = ∂E/∂zⱼ * ∂zⱼ/∂wᵢⱼ
            let pdError_Weight =
                pdErrors_OutputNeuronTotalNetInput[i] *
                this.outputLayer.neurons[i].get_PdTotalNetInput_Bias()

            this.outputLayer.neurons[i].bias -=
                this.LEARNING_RATE * pdError_Weight
        }

        // # 6. Update hidden neuron biases
        for (let i = 0; i < this.outputLayer.neurons.length; i++) {
            // ∂Eⱼ/∂wᵢⱼ = ∂E/∂zⱼ * ∂zⱼ/∂wᵢⱼ
            let pdError_Weight =
                pdErrors_HiddenNeuronTotalNetInput[i] *
                this.hiddenLayer.neurons[i].get_PdTotalNetInput_Bias()

            this.hiddenLayer.neurons[i].bias -=
                this.LEARNING_RATE * pdError_Weight
        }
    }
}
