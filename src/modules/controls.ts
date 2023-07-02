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

export function setCurrentBandProposal(proposal:api.ProposalItem) {
  let nextScreenEntity = api.proposalItem(proposal)

  let nextPresentationBandEntity = api.presentationBand(proposal)
  api.swapEntity(screenEntity, nextScreenEntity)
  screenEntity = nextScreenEntity

  api.swapEntity(presentationBandEntity, nextPresentationBandEntity)
  presentationBandEntity = nextPresentationBandEntity
}

export async function setUpPresentationBand() {
    const propTestData = await api.proposalItemData(Math.round(Math.random()*10))
    let nextPresentationBandEntity = api.presentationBand(propTestData.title)
    api.swapEntity(presentationBandEntity, nextPresentationBandEntity)
    presentationBandEntity = nextPresentationBandEntity
    log(propTestData)
}

setUpPresentationBand()