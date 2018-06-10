import * as tf from '@tensorflow/tfjs'

const model = tf.sequential()

const hiddenLayer = tf.layers.dense({
  units: 4,
  inputShape: [2],
  activation: 'sigmoid'
})
model.add(hiddenLayer)

const outputLayer = tf.layers.dense({
  units: 3,
  activation: 'sigmoid'
})
model.add(outputLayer)

const sgdOpt = tf.train.sgd(0.1)
model.compile({
  optimizer: sgdOpt,
  loss: tf.losses.meanSquaredError
})
