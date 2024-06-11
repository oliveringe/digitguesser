<template>
    <div class="app">
        <header>
            <div class="header-inner">
                <div class="header-left">
                    Oliver Ingebretsen<br />
                    Advanced Programming Topics Period 1<br />
                    June 2024
                </div>

                <div class="header-right">
                    <button class="sm" @click="aboutVisible = true">About</button>
                </div>
            </div>
        </header>
        <h1>DIGITGUESSER</h1>

        <section class="option-section train">
            <h2>Train</h2>
            <div>
                <div class="options">
                    <div class="option">
                        <strong>Sample Count</strong>
                        <span>{{ sampleCount }}</span>
                        <input
                            type="range"
                            min="100"
                            max="10000"
                            v-model="sampleCount"
                            step="100"
                        />
                        <p>
                            This is the total number of sample images that the network will review
                            during training.
                        </p>
                    </div>
                    <div class="option">
                        <strong>Neuron Count</strong>
                        <span>{{ neuronCount }}</span>
                        <input type="range" min="10" max="128" v-model="neuronCount" />
                        <p>
                            This is the total number of neurons that are created in the middle layer
                            of the network - the size of the network.
                        </p>
                    </div>
                    <div class="option">
                        <strong>Learning Rate</strong>
                        <span>{{ learningRate }}</span>
                        <input type="range" min="0.1" max="5" v-model="learningRate" step="0.1" />
                        <p>
                            How aggressively the network learns. Too high and it misses subtleties,
                            too low it might not learn enough.
                        </p>
                    </div>
                </div>
            </div>
            <button class="lg" @click="trainModel">
                <span v-if="!trainingComplete"> Train Network </span>
                <span v-else> Retrain Network </span>
            </button>
        </section>

        <section class="option-section">
            <h2>Test</h2>
            <p class="sh2">
                Use your mouse to draw a single numeric digit in the black square below and see
                whether the network you trained is able to recognize it.
            </p>
            <div :class="['draw', { 'draw-disabled': !trainingComplete }]">
                <CharacterDraw
                    class="draw-canvas"
                    ref="characterDraw"
                    @changed="onCharacterChanged"
                />
                <DigitChart class="draw-chart" :digits="digits" />
                <div class="draw-disabled-message" v-show="!trainingComplete">
                    Please train the network before testing.
                </div>
            </div>
        </section>

        <section class="text-section">
            <h2>Learn</h2>

            <div class="reading">
                <h3>What is a neural network?</h3>
                <p>
                    When you look at a “3”, you can instantly recognize that image as a three. When
                    trying to build a program to do the same, it is soon realized how nuanced and
                    convoluted that task actually is. There are subtleties that are unquantifiable
                    that allow you to recognize a number, that make hard coding a program to do it
                    an essentially impossible task.
                </p>

                <p>
                    In general, a neural network has a guiding question and then, by trial and
                    error, becomes better at answering that question in an attempt to generalize
                    itself to a vast number of test cases. This is why it lends itself well to
                    problems whose patterns can’t be broken down into a countable number of test
                    cases the way a traditional programming project can. Recognizing a number is a
                    great example of this. A 2 can be written in an infinite number of ways and
                    their differences aren’t realistically definable. The other 9 digits are the
                    same way.
                </p>

                <p>
                    <em>
                        A neural network attempts to model the brain's ability to recognize
                        patterns, allowing it to replicate the nuance and subtleties that a human
                        brain brings to problem solving.
                    </em>
                </p>

                <h3>What does this mean?</h3>

                <p>
                    While this idea seems like a great way to approach these types of problems, when
                    it comes to coding it feels more fantastical and picturesque than it does
                    practical. Let’s look at what this model actually is doing and how it works.
                </p>

                <p>
                    Look at the image below. This is the structure of a neural network. Data is fed
                    into it where each circle or, “neuron,” represents a single piece of the data.
                    Each of the green lines is a connection between neurons with a unique value
                    associated with it. These are called <strong>“weights”</strong>. After the input
                    layer, neurons in the other layers’ values are determined by computations
                    proportional to these weights. In the output layer, you can think of the neuron
                    with the largest value, or the “brightest” neuron, to be the answer to the
                    question.
                </p>

                <img :src="networkImg" />
                <p>
                    In short, data is fed through a series of connections and the output layer
                    represents possible answers to a question. The goal is to fine tune these
                    connections to guide the network to most reliably answer the question correctly.
                    This fine tuning is called training.
                </p>

                <h3>This network</h3>

                <p>The question that guides this neural network is:</p>
                <p>“What number, from 0-9 is this drawing?”</p>
                <p>
                    To answer this, we need to come up with a number of input neurons to accurately
                    represent our data.
                </p>

                <p>
                    Because our data comes in as a 28x28 image, 784 neurons seems like a good number
                    to represent that since 28 x 28 = 784 pixels. This lets each neuron represent a
                    pixel. The neuron's magnitude can be a number from 0-1, representing its
                    grayscale value.
                </p>
                <p>
                    Our output layer has 10 neurons because we have 10 possible answers to our
                    question: 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9. The brightest neuron at the end, is
                    the network's answer to the question.
                </p>
                <p>
                    The hidden layers are a little arbitrary. For the sake of simplicity, I chose to
                    have a single hidden layer. The more variables you have available to tune allows
                    for finer tuning of the network. More hidden layers gives you more variables to
                    tune, as does increasing the size of the hidden layers.
                </p>
                <p>
                    To make this even more complicated (sorry), each neuron also has a unique bias
                    associated with it. Think of this bias as an additional parameter that lets the
                    neuron represent how important it is in relation to solving the problem. Think
                    about a function, wf(x) + b. Increasing w, the weight, increases the steepness
                    of the function. Changing b however, moves it up and down. Weights and biases
                    serve different but important roles to the network which (you may be noticing a
                    common theme, here) allow for even more tuning of how the network solves
                    problems.
                </p>
                <h3>Training</h3>

                <p>
                    This network seems like an awesome way to replicate human abilities to recognize
                    indescribable, complex problems. But how do we get the computer to tune itself
                    so that its weights and biases can reflect these pattern matching abilities?
                    This is the problem in training a neural network, and the solution is
                    conceptually, actually pretty simple. All of the weights and biases in the
                    beginning are initialized to completely random values. This means, when you feed
                    an image through the network, you get completely random results. First, we need
                    a way of evaluating how the network did. This is called a cost function. The
                    cost function gets the difference between the network's actual output, and the
                    expected output.
                </p>
                <p>
                    When recognizing a “9”, the expected output of the network is [0, 0, 0, 0, 0, 0,
                    0, 0, 1]. Each element of that last represents the neuron that corresponds with
                    the number at its index. Because the network is not a 0, the zeroth index has a
                    value of 0. Because the network is not a 1, the first index has a value of zero,
                    and so on. Because the number IS a 9, the desired output at the ninth index is
                    1. This answer is what would be returned from a perfect network.
                </p>
                <p>
                    A network that hasn’t been trained makes random decisions. All the output
                    neurons will be random values. The closer the actual output is to the expected
                    output, the better the network, the lower the value of the cost function.
                </p>
                <p>Training is guiding the network to minimize the cost function.</p>
                <p>
                    This is where the math comes in. First, in English, here is how the weights are
                    updated: For each weight, we compute how much a change in that weight affects
                    the cost function. This determines how important that weight is in determining
                    the cost function.
                </p>
                <p>
                    The cost function is squared to make it always a value greater than 0. So, the
                    larger the effect of a given weight on the cost function, the more that weight
                    should be changed, because the goal is to minimize the cost function. The
                    “importance of that weight” is multiplied by a learning rate to slow the
                    training down to account for a large amount of data. Without a learning rate,
                    the network would fit itself to minimize the function for each number, but it
                    wouldn’t do very well at generalizing for any handwritten number.
                </p>
                <p>So this is our formula!</p>
                <p></p>
                <p>
                    Weight = weight - (learning rate)(how much the weight affects the cost function)
                </p>
                <p></p>
                <p>
                    Biases are updated by the same method, simply substitute “bias” for each
                    instance of “weight” in the equation above.
                </p>
                <p>
                    The helpful part of this method, (or the reason this method was chosen), is that
                    figuring out how much the weight affects the cost function is a question
                    answered in full by the partial derivative. (how much the weight affects the
                    cost function) is exactly the same as the partial derivative of the cost
                    function with respect to the weight. The chain rule is key in finding this
                    value.
                </p>
                <p>
                    If you are interested in more of the math, I highly recommend reading
                    <a
                        href="https://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example/"
                        target="_blank"
                        >this article about back propagation</a
                    >, the algorithm to update the weight and bias at each step.
                </p>

                <p>
                    So that is how a neural network is trained to solve problems! If a lot of that
                    went over your head, don’t fret. In fact, if this is your first introduction to
                    neural networks and you fully understand all of it, you are in the extreme
                    minority. It is an extremely confusing topic that, at least for me, took many
                    introductions to grasp.
                </p>

                <h3>How neurons are calculated</h3>
                <p>
                    I explained that the neuron's values are calculated by some computation with the
                    neuron's weight, but I didn’t explain the specifics. For a given neuron in the
                    hidden layer, its value is calculated by adding up the product of the value of
                    the neuron in the previous layer and the corresponding weight of that connection
                    and adding the bias. Finally this number is put through something called an
                    activation function, which I will explain later. This single value is called an
                    activation, and it is the activation for the given neuron. This activation is
                    then used for computations of neurons in the next layer! This is how the data
                    actually moves through the network.
                </p>
                <p></p>

                <h3>Activation function?</h3>

                <p>
                    The activation function is crucial to an accurate neural network, and here is
                    why. Imagine trying to fit a function to a line on a graph. Imagine that line is
                    a sine wave, bounded from 0 to 2pi. If the function is a single linear line, it
                    is very restricted in its ability to match the sine wave.
                </p>
                <p>
                    Think about a fourth degree polynomial. That could be well mapped to the sine
                    function in this example. Its nonlinearity gives it a great amount of
                    flexibility.
                </p>
                <p>
                    The problem of making a neural network is similar. We are trying to map the
                    network to fit the answer to a complicated question. If we can only do so
                    linearly, we are greatly restricted in our ability to map that network to answer
                    a question. If we add a function that non-linearizes the activation of each
                    neuron, we get way more control over the shape of the line that the network
                    draws.
                </p>

                <h3>Problems with the network</h3>

                <p>
                    My network uses a sigmoid function, which has been discredited as a productive
                    activation function since the discovery of better ones. I used sigmoid for the
                    sake of simplicity, but this is absolutely a potential reason for poor results
                    of my network.
                </p>
                <p>
                    Another area it could be improved is the number of hidden layers. To put it
                    simply, more hidden layers allows for a more nuanced network.
                </p>
                <p>
                    The biggest problem with the network, however, is the method by which the data
                    fed into it is processed after it is trained. In fact, this is such a big factor
                    that it warrants its own section.
                </p>
                <h3>Preprocessing data</h3>
                <p>
                    You can imagine that the network is only relevant to the data it is trained on.
                    That is, if a network is trained to recognize English digits with 99% accuracy,
                    it will be useless if you show it Arabic digits. This is obvious when the
                    difference between samples is as clear as that between English and Arabic, but
                    it becomes less so when the differences are less apparent.
                </p>
                <p>
                    The data that this network is trained on is called MNIST, and it is a famous
                    dataset for this problem because it contains 60,000 handwritten digits on a
                    28x28 grid, with tags representing what number they are. The MNIST data set,
                    however, is very consistent with how images are placed on that grid. The data
                    drawn on the website is less consistent. I believe that the difference between
                    how the MNIST data and website canvas data is processed accounts for all of the
                    errors in guessing networks.
                </p>
                <p>
                    On the website, I have tried my best to process the data the same. A rectangle
                    is drawn to surround each number drawn on the website, and that rectangle is
                    then scaled to become a square. That square is then placed into the 28x28 canvas
                    with a margin of a few pixels on every side. This brings each image drawn into
                    the center, before it is fed through the network. There are discrepancies in
                    this process that don’t account for commonalities in the MNIST data set. For
                    example, the nines in the MNIST data set have loops that start just above the
                    center and stems that run to the bottom.
                </p>
                <p>
                    My scaling method brings the entirety of the 9 to the center, which is different
                    from centering the loop. If I had more time, I would create a system that scales
                    the data based on where most of the image was drawn. This would allow it to pull
                    the most critical part of the number more to the middle. A nine drawn in the
                    center would be pulled down. A two drawn in the center would stay where it is.
                </p>
            </div>
        </section>

        <div class="about" v-if="aboutVisible">
            <div class="about-dialog">
                <h3>DIGITGUESSER</h3>

                <p>
                    This site showcases a simple neural network written entirely in JavaScript and
                    running completely in a web browser. It was created by Oliver Ingebretsen for
                    the Advanced Programming Topics course (Period 1) taught at Woodinville High
                    School. Project completed June 9, 2024.
                </p>

                <p>The following languages, resources, references were used:</p>

                <ul>
                    <li>
                        <a href="https://www.w3schools.com/howto/howto_website.asp"
                            >Javascript / CSS / HTML</a
                        >
                        - Basic website building blocks / langauge
                    </li>
                    <li>
                        <a href="https://vuejs.org/">VueJS</a> - Component framework for web
                        development
                    </li>
                    <li>
                        <a href="https://www.npmjs.com/package/mnist">mnist dataset</a> - Open
                        source numeric digit image training data
                    </li>
                    <li>
                        <a
                            href="https://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example/"
                            >A Step by Step Backpropagation Example by Matt Mazur</a
                        >
                        - Article explaining a simple technique for implementing back propagation in
                        a neural network
                    </li>
                    <li>
                        Multiple other books, videos, etc. explaining the complicated math that
                        produces the very simple code that runs the neural network on this site!
                    </li>
                </ul>

                <button class="sm" @click="aboutVisible = false">Close</button>
            </div>
        </div>

        <div class="training-message" v-show="trainingActive">
            <span>
                <strong>Training</strong><br />
                (please be patient...this could take a minute)
            </span>
        </div>
    </div>
</template>

<script>
import CharacterDraw from './components/CharacterDraw.vue';
import DigitChart from './components/DigitChart.vue';
import NeuralNetwork from '../../nn/NeuralNetwork.js';
import mnist from 'mnist';
import networkImg from '@/assets/network.jpg';

export default {
    name: 'app',
    components: { CharacterDraw, DigitChart },
    data() {
        return {
            aboutVisible: false,
            neuronCount: 16,
            learningRate: 0.5,
            sampleCount: 6000,
            trainingActive: false,
            trainingComplete: false,
            digits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            networkImg
        };
    },

    methods: {
        trainModel() {
            this.trainingActive = true;
            this.trainingComplete = false;

            setTimeout(() => {
                const trainingData = mnist.get(this.sampleCount);
                const images = trainingData.map((data) => data.input);
                const labels = trainingData.map((data) => data.output);

                this.nn = new NeuralNetwork(this.neuronCount, this.learningRate);

                this.nn.trainSet(images, labels, this.trainProgress, this.trainComplete);
                this.trainingActive = false;
                this.trainingComplete = true;
            }, 10);
        },
        onCharacterChanged(characterData) {
            if (this.trainingComplete) {
                this.digits = this.nn.feedForward(characterData);
            }
        }
    }
};
</script>

<style lang="scss">
.app {
    text-align: center;
}

h1,
h2,
h3 {
    text-transform: uppercase;
    margin: 0;
    padding: 0;
    line-height: 1.1;
}

h1 {
    font-size: 12vw;
    font-weight: 300;
}

h2 {
    font-size: 6vw;
    font-weight: 300;
}

h3 {
    font-size: 2vw;
    font-weight: 400;
}

.sh2 {
    font-size: 18px;
    max-width: 800px;
    margin-bottom: 30px;
}

header {
    background-color: black;
    color: var(--yellow);
}

.header-inner {
    width: 100%;
    max-width: 920px;
    margin: 0 auto 20px;
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    align-items: center;
}

.header-left {
    text-align: left;
}

.header-right {
    text-align: right;
}

section {
    position: relative;
    margin: 50px 0 150px;
}

.option-section {
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
}

.options {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.option {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    max-width: 300px;
    gap: 10px;
}

.option span {
    background-color: black;
    color: var(--yellow);
    min-width: 70px;
    padding: 4px;
    border-radius: 4px;
    margin-top: 0px;
    margin-bottom: 4px;
}

.option p {
    margin-top: 10px;
    line-height: 1.5;
}

.option strong {
    font-weight: 500;
}

.draw {
    display: flex;
    gap: 30px;
    align-items: center;
    width: 90%;
    max-width: 800px;
    position: relative;
}

.draw-chart {
    flex: 1;
}

.draw-disabled .draw-chart,
.draw-disabled .draw-canvas {
    opacity: 0.2;
    pointer-events: none;
}

.draw-disabled-message {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    max-width: 400px;
    border-radius: 6px;
    transform: translate(-50%, -50%);
    background-color: black;
    color: var(--yellow);
    padding: 10px 5px;
}

.text-section {
    margin: 0 auto;
}

.reading {
    background-color: #999;
    border-radius: 12px;
    font-size: 17px;
    width: 100%;
    max-width: 920px;
    padding: 40px;
    margin: 40px auto;

    h3 {
        margin-top: 2em;
        margin-bottom: 1em;
    }
    h3:first-child {
        margin-top: 1em;
    }

    p {
        text-align: left;
        margin-bottom: 1em;
    }

    img {
        width: 100%;
        margin: 1.5em auto;
        border-radius: 12px;
    }
    a {
        color: inherit;
    }
}

.training-message,
.about {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background-color: rgba(#444, 0.5);
    backdrop-filter: blur(50px);

    p {
        text-align: left;
    }

    ul,
    li {
        text-align: left;
    }

    h3,
    p,
    ul {
        margin-bottom: 1em;
    }

    a {
        color: var(--yellow);
    }
}

.about-dialog {
    background-color: black;
    color: #ccc;
    width: 100%;
    position: absolute;
    top: 45%;
    left: 50%;
    max-width: 640px;
    transform: translate(-50%, -45%);
    padding: 30px;
    border-radius: 12px;
}

.training-message {
    font-size: 13px;

    span {
        display: inline-block;
        background-color: var(--yellow);
        position: absolute;
        top: 45%;
        left: 50%;
        max-width: 380px;
        transform: translate(-50%, -45%);
        padding: 10px 20px;
        border-radius: 3px;
    }
    strong {
        font-size: 15px;
        font-weight: 500;
    }
}

button {
    font-size: 15px;
    font-family: inherit;
    appearance: none;
    box-sizing: border-box;
    position: relative;
    outline: none;
    border: none;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.8em 1.5em;
    min-width: 5em;
    border-radius: 0.33em;
    color: black;
    background-color: var(--yellow);
    cursor: pointer;
}

button:active {
    background-color: #555;
    color: white;
}

button.lg {
    font-size: 18px;
}

button.sm {
    font-size: 14px;
    padding: 0.6em 1em;
}

input[type='range'] {
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 200px;
    padding: 0;
    margin: 0;
}

input[type='range']:focus {
    outline: none;
}

input[type='range']::-webkit-slider-runnable-track {
    background-color: var(--yellow);
    border-radius: 3px;
    height: 4px;
}

input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -6px; /* Centers thumb on the track */
    background-color: white;
    height: 16px;
    width: 16px;
    border-radius: 50%;
}
</style>
