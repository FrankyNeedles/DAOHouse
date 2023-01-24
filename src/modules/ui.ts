import { map } from '@dcl/ecs-scene-utils'
import * as ui from '@dcl/ui-scene-utils'
import * as api from './api'

const sceneMessageBus = new MessageBus()

interface PropList<T> {
    [index: string]: T
}

interface PropUIItem extends api.ProposalItem {
    entity: UIText
}

export let lightTheme = new Texture('https://decentraland.org/images/ui/light-atlas-v3.png')

// Set up the main UI canvas and list of current proposals, then the queue
// This is `main`
export const renderProposalUI = async () => {
    const canvas = new UICanvas()

    const background = new UIImage(canvas, lightTheme)
    background.sourceWidth = 416
    background.sourceHeight = 356
    background.sourceLeft = 500
    background.sourceTop = 11
    background.width = 600
    background.height = 500

    const titleText = new UIText(canvas)
    titleText.color = Color4.Black()
    titleText.value = 'Town Hall Discussion Queue!'
    titleText.fontSize = 24
    titleText.positionX = -220
    titleText.positionY = 220

    const subtitleText = new UIText(canvas)
    subtitleText.color = Color4.Black()
    subtitleText.value = 'Active Proposals'
    subtitleText.fontSize = 16
    subtitleText.positionX = -220
    subtitleText.positionY = 180

    const addButton = new UIImage(canvas, lightTheme)
    addButton.sourceLeft = 512
    addButton.sourceTop = 612
    addButton.sourceWidth = 180
    addButton.sourceHeight = 50
    addButton.positionX = 220
    addButton.positionY = -200
    addButton.width = 100
    addButton.height = 35

    const addText = new UIText(addButton)
    addText.isPointerBlocker = false
    addText.value = 'Add +'
    addText.color = Color4.White()
    addText.fontSize = 18
    addText.positionX = "23%"
    addText.positionY = "45%"

    // get all proposals
    const proposals = await api.proposalItemDataSet()

    const proposals_indexed:PropList<api.ProposalItem> = indexById(proposals);

    // these are proposals to send out, selected from the queue by the user
    let outgoing_proposals:Array<api.ProposalItem> = []

    // vertical spacer
    let spacer = -125

    // render list of all proposals and set up message send
    proposals.map((proposalItem:api.ProposalItem) => {
        
        // draw the UI for each proposal
        const rect = new UIImage(canvas, lightTheme)
        rect.sourceWidth = 200
        rect.sourceHeight = 5
        rect.sourceLeft = 35
        rect.sourceTop = 398
        rect.width = 540
        rect.height = 16
        rect.positionX = 0
        rect.positionY = spacer
        
        const myText = new UIText(rect)
        myText.isPointerBlocker = false
        myText.color = Color4.Black()
        myText.value = proposalItem.title
        myText.fontSize = 12
        myText.positionX = -210
        myText.positionY = 18

        // set up selection UI behavior
        rect.onClick = new OnPointerDown(() => {
            outgoing_proposals.push(proposalItem)

            rect.sourceLeft = 530
            rect.sourceTop = 670
            rect.sourceWidth = 1
            rect.sourceHeight = 1
            rect.opacity = 1

            myText.color = Color4.White()

            addButton.sourceLeft = 512
            addButton.sourceTop = 662
            addButton.sourceWidth = 180
            addButton.sourceHeight = 50
        })

        spacer += 20
    })

    addButton.onClick = new OnPointerDown(() => {
        sceneMessageBus.emit("proposalsAdded", {proposals: outgoing_proposals})
    })

    //display the queue on the right
    const queueStatus = await renderProposalQueue(400, canvas, proposals_indexed)
    if (!queueStatus) {
        //renderQueueError()
    }
}

//TODO put this in the global ui state object
let rendered_material:Array<PropUIItem> = []

const updateUIQueue = (xOffset:number, render_queue:Array<api.ProposalItem>, fullPropList:PropList<api.ProposalItem>, canvas:UICanvas):void => {
    //list of currently rendered proposal ui items
    clearRendered(rendered_material)

    // reset vertical spacing
    let yOffset = 0

    // Render each item of the render queue
    render_queue.map((item:api.ProposalItem) => {
        const ui_prop:PropUIItem = renderProposal(xOffset, yOffset, canvas, item)
        rendered_material.push(ui_prop)
    })
}

const renderProposal = (xOffset: number, yOffset:number, canvas: UICanvas, proposal: api.ProposalItem):PropUIItem => {
    const titleText = new UIText(canvas)
    const ui_proposal:PropUIItem = {...proposal, entity: titleText}
    titleText.color = Color4.Black()
    titleText.value = proposal.title
    titleText.fontSize = 12
    titleText.positionX = xOffset + 20
    titleText.positionY = 200 - yOffset
    yOffset += 20
    return ui_proposal
}

// TODO: Move me to a utility lib
const clearRendered = (renderedMaterial:Array<PropUIItem>) => {
    renderedMaterial.map((propUIItem) => {
        propUIItem.entity.visible = false
    })
}

const addToQueue = (proposal:api.ProposalItem, proposal_queue:Array<api.ProposalItem>):Array<api.ProposalItem> => {
    const new_queue = [...proposal_queue, proposal]
    return new_queue
}

const indexById = (proposals:Array<api.ProposalItem>):PropList<api.ProposalItem> => {
    let indexed = {}
    proposals.map((item:api.ProposalItem) => {
        indexed = { ...indexed, [item.id]:item }
    })
    return indexed
}

export const renderProposalQueue = async (
        xOffset:number, 
        canvas:UICanvas, 
        proposals:PropList<api.ProposalItem>
    ) : Promise<Boolean> => {

    let proposal_queue:Array<api.ProposalItem> = []

    const queueBg = new UIImage(canvas, lightTheme)
    queueBg.sourceWidth = 416
    queueBg.sourceHeight = 356
    queueBg.sourceLeft = 500
    queueBg.sourceTop = 11
    queueBg.width = 150
    queueBg.height = 500
    queueBg.positionX = xOffset

    const titleText = new UIText(canvas)
    titleText.color = Color4.Black()
    titleText.value = 'Active Queue'
    titleText.fontSize = 24
    titleText.positionX = xOffset + 20
    titleText.positionY = 220

    sceneMessageBus.on("proposalsAdded", (data) => {
        proposal_queue = addToQueue(data.proposals, proposal_queue)
    })

    updateUIQueue(xOffset, proposal_queue, proposals, canvas)

    return true
}
