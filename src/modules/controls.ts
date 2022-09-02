import * as api from 'api';
var screenEntity:Entity

const setupPropTest = async () => {
  const propTest = await api.proposalItem(1)
  screenEntity = propTest
  engine.addEntity(propTest)
}

setupPropTest()

// test for swapping screen proposal to random proposal
const ball = new Entity()
ball.addComponent(new SphereShape())
ball.getComponent(SphereShape).withCollisions = false
ball.addComponent(new Transform({position: new Vector3(37, 40, 26), scale: new Vector3(.5,.5,.5)}))
// ball.addComponent(
//   new OnPointerDown(async () => {
//     const propTest = await api.proposalItem(Math.round(Math.random()*10))
//     api.swapScreen(screenEntity,propTest)
//     screenEntity = propTest
//   })
// )
engine.addEntity(ball)

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
  api.swapScreen(screenEntity, nextScreenEntity)
  screenEntity = nextScreenEntity
})