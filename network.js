class NeuralNetwork {
    constructor(neuronCounts) {  //cantidad de neuronas en cada nivel

        this.levels = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]))//input y output
        }

    }

    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(givenInputs, network.levels[0]);//el primer nivel, produce sus outputs
        for (let i = 1; i < network.levels.length; i++) {//el resto de niveles
            outputs = Level.feedForward(outputs, network.levels[i])   //actualizo el output, pero ahora con los outputs del nivel anterior al nivel que le sigue como input
        }
        return outputs;
    }
    //agarra los valores y los varia un porcentaje que esta en la variable amount
    static mutate(network, amount = 1) {
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount)
            }
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount)
                }
            }
        });
    }

}

//Aca empieza la clase de un nivel de la red neuronal
class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this); //un "cerebro" aleatorio
    }

    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs, level) {  //resive los valores de los sensores
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }
            if (sum > level.biases[i]) {    //si la suma de lo que recibe multiplicado por los valores de las distintas neuronas es mayor a su bias, "activa" la neurona de salida
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    }

}