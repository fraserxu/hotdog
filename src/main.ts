import * as mobilenet from '@tensorflow-models/mobilenet'

const input: HTMLInputElement = document.querySelector('#input')
const img: HTMLImageElement = document.querySelector('#img')
const text: HTMLSpanElement = document.querySelector('#text')
const loading: HTMLDivElement = document.querySelector('#loading')
const cameraButton: HTMLButtonElement = document.querySelector('#camera')
const captureButton: HTMLButtonElement = document.querySelector('#capture')
const videoElement: HTMLVideoElement = document.querySelector('video')
const canvasElement: HTMLCanvasElement = document.querySelector('#canvas')

const width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth

let model: mobilenet.MobileNet | undefined
let mediaStream: MediaStream | undefined

const hideElement = (element: HTMLElement) => {
  element.setAttribute('style', 'display: none;')
}

const showElement = (element: HTMLElement) => {
  element.setAttribute('style', 'display: block;')
}

const load = async () => {
  loading.setAttribute('style', 'display: none;')
  loading.innerHTML = 'Loading models...'
  model = await mobilenet.load()
  loading.setAttribute('style', 'display: none;')
}

// load model
load()

const predict = async (img: HTMLImageElement) => {
  if (model) {
    const predictions = await model.classify(img)
    const bestPrediction = predictions[0]
    const classNames = bestPrediction.className.split(',')
    text.innerHTML = `It's probably a ${classNames[0]} or ${classNames[1]}.`
  }
}

const onSelectFiles = (event: Event) => {
  const files: FileList = input.files
  img.setAttribute('src', window.URL.createObjectURL(files[0]))
  img.onload = () => predict(img)
}

const onCamera = async () => {
  const constraints = {
    audio: false,
    video: { width },
    facingMode: 'user'
  }
  mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
  hideElement(cameraButton)
  videoElement.srcObject = mediaStream
  videoElement.onloadedmetadata = () => {
    videoElement.setAttribute('width', width.toString())
    videoElement.play()
  }
  showElement(captureButton)
}

const onCapture = () => {
  hideElement(videoElement)
  const context = canvasElement.getContext('2d')
  canvasElement.width = videoElement.videoWidth
  canvasElement.height = videoElement.videoHeight
  context.drawImage(
    videoElement,
    0,
    0,
    videoElement.videoWidth,
    videoElement.videoHeight
  )

  const imageData = canvasElement.toDataURL('image/png')
  img.setAttribute('src', imageData)
  img.onload = () => predict(img)

  // stop media stream
  if (mediaStream) {
    mediaStream.getTracks().forEach((track: MediaStreamTrack) => {
      track.stop()
      mediaStream.removeTrack(track)
    })
  }
  hideElement(captureButton)
}

cameraButton.addEventListener('click', onCamera, false)
captureButton.addEventListener('click', onCapture, false)
input.addEventListener('change', onSelectFiles, false)
