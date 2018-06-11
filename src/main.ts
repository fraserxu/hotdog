import * as tf from '@tensorflow/tfjs'

const model = tf.sequential()

const hiddenLayer = tf.layers.dense({
  units: 4,
  inputShape: [2],
  activation: 'sigmoid'
})
model.add(hiddenLayer)

const outputLayer = tf.layers.dense({
  units: 1,
  activation: 'sigmoid'
})
model.add(outputLayer)

const sgdOpt = tf.train.sgd(0.5)
model.compile({
  optimizer: sgdOpt,
  loss: tf.losses.meanSquaredError
})

const xs = tf.tensor2d([[0, 0], [0.5, 0.5], [1, 1]])

const ys = tf.tensor2d([[0], [0.5], [1]])

const train = async (iteration: number) => {
  for (let i = 0; i < iteration; i++) {
    const response = await model.fit(xs, ys, { epochs: 1, shuffle: true })
    console.log(response.history.loss[0])
  }
}

const inputs = tf.tensor2d([[1, 1]])

const main = async () => {
  await train(500)
  const predictions = await model.predict(inputs)
  predictions.print()
}

main()
