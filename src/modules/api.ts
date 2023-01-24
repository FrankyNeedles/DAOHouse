import * as utils from '@dcl/ecs-scene-utils'

export const getData = async () => {
    let json = await utils.sendRequest(
        'https://purple-fog-56ac.twaldorf.workers.dev/proxy/?route=proposals?limit=14'
      )
    const { data } = json
    return data
}

export interface ProposalSummary {
    title:String,
    type:String,
    votes:Array<Number>
}

export interface ProposalItem {
    id:string,
    title:string,
    status:string,
    type:string,
}

export const swapScreen = (current:Entity, next:Entity) => {
    engine.removeEntity(current)
    engine.addEntity(next)
}

export const proposalItemData = async (proposalNumber:number) => {
    let proposals = await getData()
    const { title, status, type } = proposals[proposalNumber]
    const choices = proposals[proposalNumber].snapshot_proposal.choices
    return { title, status, type, choices }
}

export const proposalItemDataSet = async ():Promise<Array<ProposalItem>> => {
    let proposals = await getData()
    const propData = proposals.map((proposal:any) => {
        const { id, title, status, type } = proposal
        return { id, title, status, type }
    })
    return propData
}

export const proposalItem = (proposalData:any) => {

    const { title, status, type, choices } = proposalData

    const propScreen = new Entity()
    propScreen.addComponent(new CylinderShape())
    propScreen.getComponent(CylinderShape).visible = false

    const ringTop = new Entity()
    const ringBot = new Entity()

    ringTop.addComponent(new CylinderShape())
    ringTop.setParent(propScreen)
    
    ringBot.addComponent(new CylinderShape())
    ringBot.setParent(propScreen)

    ringTop.addComponent(new Transform({scale: new Vector3(3,0.1,3), position: new Vector3(0, 1, 0)}))
    ringBot.addComponent(new Transform({scale: new Vector3(3,0.1,3), position: new Vector3(0, -3.5, 0)}))
    const textContainer = new Entity()
    textContainer.setParent(propScreen)

    const titleText = genText(title,3)
    titleText.setParent(textContainer)

    const proposalType = genText(type, 2, .5)
    proposalType.setParent(textContainer)

    const proposalStatus = genText(status, 2, 1)
    proposalStatus.setParent(textContainer)
    
    textContainer.addComponent(new Transform({position: new Vector3(0,-.5,3), rotation: Quaternion.Euler(0,180,0)}))

    propScreen.addComponent(new Transform({position: new Vector3(28.2,37,27.65)}))
    propScreen.addComponent(new Billboard(false, true, false))

    return propScreen
}

function genText(str:string, size:number, vDist?:number):Entity {
    const textContainer = new Entity()
    const text = new TextShape(str)
    text.fontSize = size
    text.width = 4
    text.textWrapping = true
    textContainer.addComponent(text)
    if (vDist) {
        textContainer.addComponent(new Transform({position: new Vector3(0, -vDist*2, 0)}))
    }
    
    return textContainer
}
