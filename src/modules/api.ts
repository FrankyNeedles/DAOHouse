import * as utils from '@dcl/ecs-scene-utils'

export const getData = async () => {
    let json = await utils.sendRequest(
        'https://governance.decentraland.org/api/proposals?limit=25'
      )
    const { data } = json
    return data
}

interface ProposalSummary {
    title:String,
    type:String,
    votes:Array<Number>
}

export const proposalItem = async (location:Vector3, proposalSummary:ProposalSummary) => {
    let proposal = await getData()

    const { title, status, type } = proposal[0]
    const choices = proposal[0].snapshot_proposal.choices
    log(title,status, type)
    log(choices)

    const box = new Entity()
    box.addComponent(new BoxShape())
    box.getComponent(BoxShape).withCollisions = false
    box.addComponent(new Transform({ position: location }))
    const titleText = new TextShape(title)
    titleText.textWrapping = true
    titleText.lineCount = Math.floor(title.length % 30)
    box.addComponent(titleText)
    return box
}
