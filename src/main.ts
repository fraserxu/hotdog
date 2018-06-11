import * as mobilenet from '@tensorflow-models/mobilenet'

const input: HTMLInputElement = document.querySelector('#input')
const img: HTMLImageElement = document.querySelector('#img')
const text: HTMLSpanElement = document.querySelector('#text')

let model: mobilenet.MobileNet | undefined

const load = async () => {
  input.setAttribute('style', 'display: none;')
  text.innerHTML = 'loading models...'
  model = await mobilenet.load()
  text.innerHTML = 'Model loaded. Now you can select an image to predict...'
  input.setAttribute('style', 'display: block;')
}

const formatProbability = (probability: number) =>
  `${(probability * 100).toFixed(2)}%`

const predict = async (img: HTMLImageElement) => {
  if (model) {
    const predictions = await model.classify(img)
    const results = predictions.map(prediction => {
      return `There are ${formatProbability(
        prediction.probability
      )} of chance that you select an image of ${prediction.className}.`
    })

    text.innerHTML = results.join('<br />')
  }
}

const onSelectFiles = (event: Event) => {
  const files: FileList = input.files
  img.setAttribute('src', window.URL.createObjectURL(files[0]))
  img.onload = () => predict(img)
}

input.addEventListener('change', onSelectFiles, false)

// load model
load()
