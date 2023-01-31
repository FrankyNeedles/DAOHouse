import { hud } from '@dcl/builder-hud'
import * as api from 'api'
var screenEntity:Entity
var presentationBandEntity:Entity

const setupPropTest = async () => {
  const propTest = await api.proposalItem(1)
  screenEntity = propTest
  engine.addEntity(propTest)
}

const setupBandTest = async () => {
  const bandTest = await api.presentationBand(1)
  presentationBandEntity = bandTest
  engine.addEntity(presentationBandEntity)
}

setupPropTest()
setupBandTest()

// test for swapping screen proposal to random proposal
const ball = new Entity()
ball.addComponent(new SphereShape())
ball.getComponent(SphereShape).withCollisions = false
ball.addComponent(new Transform({position: new Vector3(27,36,20), scale: new Vector3(.5,.5,.5)}))
engine.addEntity(ball)
hud.attachToEntity(ball)

//message test
const sceneMessageBus = new MessageBus()

ball.addComponent(
  new OnPointerDown(async (e) => {
    const propTestData = await api.proposalItemData(Math.round(Math.random()*10))
    sceneMessageBus.emit("ballClicked", { proposal: propTestData})
  })
)

sceneMessageBus.on("ballClicked", (data) => {
  log(data)
  let nextScreenEntity = api.proposalItem(data.proposal)
  let nextPresentationBandEntity = api.presentationBand(data.proposal)
  api.swapEntity(screenEntity, nextScreenEntity)
  screenEntity = nextScreenEntity
  api.swapEntity(presentationBandEntity, nextPresentationBandEntity)
  presentationBandEntity = nextPresentationBandEntity
})

export async function setUpPresentationBand() {
    const propTestData = await api.proposalItemData(Math.round(Math.random()*10))
    let nextPresentationBandEntity = api.presentationBand(propTestData.title)
    api.swapEntity(presentationBandEntity, nextPresentationBandEntity)
    presentationBandEntity = nextPresentationBandEntity
    log(propTestData)
}

setUpPresentationBand()