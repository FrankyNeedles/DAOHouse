import { map } from '@dcl/ecs-scene-utils'
import * as ui from '@dcl/ui-scene-utils'
import * as api from './api'
import { createScrollBox } from './ui-text-box'

const sceneMessageBus = new MessageBus()

interface PropList<T> {
    [index: string]: T
}

interface PropUIItem extends api.ProposalItem {
    entity: UIText
}

const globalX = -80
const margin = 20

export let lightTheme = new Texture('https://decentraland.org/images/ui/light-atlas-v3.png')

let ui_elements:Array<UIImage> = []
let ui_texts:Array<UIText> = []

export const renderSingleProposalView = async () => {
    clearUi()
    const canvas = new UICanvas()
    
    const background = new UIImage(canvas, lightTheme)
    background.sourceWidth = 416
    background.sourceHeight = 356
    background.sourceLeft = 500
    background.sourceTop = 11
    background.width = 600
    background.height = 500
    background.positionX = globalX
    
    ui_elements.push(background)

    const titleText = new UIText(canvas)
    titleText.color = Color4.Black()
    titleText.value = 'Town Hall Discussion Queue!'
    titleText.fontSize = 24
    titleText.positionX = globalX - 70
    titleText.positionY = 200
    titleText.textWrapping = true
    titleText.fontAutoSize = true
    // titleText.vAlign = "top"
    titleText.width = 400

    ui_texts.push(titleText)

    const subtitleText = new UIText(canvas)
    subtitleText.color = Color4.Black()
    subtitleText.value = 'Active Proposals'
    subtitleText.fontSize = 16
    subtitleText.positionX = globalX - 220
    subtitleText.positionY = 160

    ui_texts.push(subtitleText)

    // const paragraphText = new UIText(canvas)
    // paragraphText.color = Color4.Black()
    // paragraphText.value = 'Active Proposals'
    // paragraphText.fontSize = 16
    // paragraphText.positionX = 0
    // paragraphText.positionY = -350
    // paragraphText.vAlign = "bottom"
    // paragraphText.textWrapping = false
    // paragraphText.adaptWidth = false
    // paragraphText.height = 300
    // paragraphText.adaptHeight = false
    // paragraphText.width = 500

    // ui_texts.push(paragraphText)

    // Exit  button
    const exitButton = new UIImage(canvas, lightTheme)
    exitButton.sourceLeft = 583
    exitButton.sourceTop = 381
    exitButton.sourceWidth = 64
    exitButton.sourceHeight = 64
    exitButton.positionX = 180
    exitButton.positionY = 210
    exitButton.width = 35
    exitButton.height = 35

    ui_elements.push(exitButton)

    exitButton.onClick = new OnPointerDown(() => {
        clearUi()
        // clearRendered(rendered_material)
    })

    let propData = await api.proposalItemData(Math.round(Math.random()*10))

    titleText.value = propData.title
    // titleText.fontAutoSize = true

    const status_formatted = propData.status.charAt(0).toUpperCase() + propData.status.slice(1)
    subtitleText.value = status_formatted

    // render the paragraph
    const paragraph = createScrollBox(
        0, 120,
        600,600,
        propData.description,
        canvas)
    ui_texts = [...ui_texts, ...paragraph]

}

const toggleUi = () => {
    ui_elements.map((element) => {
        element.visible = element.visible ? false : true
        element.isPointerBlocker = element.isPointerBlocker ? false : true
    })
    ui_texts.map((text) => {
        text.visible = text.visible ? false : true
        text.isPointerBlocker = text.isPointerBlocker ? false : true
    })
}

export const clearUi = () => {
    ui_elements.map((element) => {
        element.visible = false
        element.isPointerBlocker = false 
    })
    ui_texts.map((text) => {
        text.visible = false
        text.isPointerBlocker = false
    })
}

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
    background.positionX = globalX
    
    ui_elements.push(background)

    // const exitText = new UIText(exitButton)
    // exitText.isPointerBlocker = false
    // exitText.value = 'X'
    // exitText.color = Color4.White()
    // exitText.fontSize = 18
    // exitText.positionX = "23%"
    // exitText.positionY = "45%"

    const titleText = new UIText(canvas)
    titleText.color = Color4.Black()
    titleText.value = 'Town Hall Discussion Queue!'
    titleText.fontSize = 24
    titleText.positionX = -220 + globalX
    titleText.positionY = 220

    ui_texts.push(titleText)

    const subtitleText = new UIText(canvas)
    subtitleText.color = Color4.Black()
    subtitleText.value = 'Active Proposals'
    subtitleText.fontSize = 16
    subtitleText.positionX = -220 + globalX
    subtitleText.positionY = 180

    ui_texts.push(subtitleText)

    const addButton = new UIImage(canvas, lightTheme)
    addButton.sourceLeft = 512
    addButton.sourceTop = 612
    addButton.sourceWidth = 180
    addButton.sourceHeight = 50
    addButton.positionX = 220 + globalX
    addButton.positionY = -200
    addButton.width = 100
    addButton.height = 35

    ui_elements.push(addButton)

    const addText = new UIText(addButton)
    addText.isPointerBlocker = false
    addText.value = 'Add +'
    addText.color = Color4.White()
    addText.fontSize = 18
    addText.positionX = "23%"
    addText.positionY = "45%"

    ui_texts.push(addText)

    // get all proposals
    const proposals = await api.proposalItemDataSet()

    const proposals_indexed:PropList<api.ProposalItem> = indexById(proposals);

    // these are proposals to send out, selected from the queue by the user
    let outgoing_proposals:Array<api.ProposalItem> = []

    // vertical spacer
    let spacer = -125

    // open button
    const openButton = new UIImage(canvas, lightTheme)
    openButton.sourceLeft = 583
    openButton.sourceTop = 381
    openButton.sourceWidth = 64
    openButton.sourceHeight = 64
    openButton.positionX = -10
    openButton.positionY = 210
    openButton.hAlign = "right"
    openButton.width = 35
    openButton.height = 35
    openButton.visible = false
    openButton.isPointerBlocker = false

    ui_elements.push(openButton)

    openButton.onClick = new OnPointerDown(() => {
        toggleUi()
        // clearRendered(rendered_material)
    })

    // Exit  button
    const exitButton = new UIImage(canvas, lightTheme)
    exitButton.sourceLeft = 583
    exitButton.sourceTop = 381
    exitButton.sourceWidth = 64
    exitButton.sourceHeight = 64
    exitButton.positionX = 180
    exitButton.positionY = 210
    exitButton.width = 35
    exitButton.height = 35

    ui_elements.push(exitButton)

    exitButton.onClick = new OnPointerDown(() => {
        clearUi()
        // clearRendered(rendered_material)
    })

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
        rect.positionX = globalX
        rect.positionY = spacer

        ui_elements.push(rect)
        
        const myText = new UIText(rect)
        myText.isPointerBlocker = false
        myText.color = Color4.Black()
        myText.value = proposalItem.title
        myText.fontSize = 12
        myText.positionX = -210
        myText.positionY = 18

        ui_texts.push(myText)

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
        log('sent', outgoing_proposals)
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

    ui_texts.push(titleText)
    return ui_proposal
}

const renderQueueItem = (xOffset: number, yOffset:number, canvas: UICanvas, proposal: api.ProposalItem):PropUIItem => {
    log(proposal.title)
    const titleText = new UIText(canvas)
    const ui_proposal:PropUIItem = {...proposal, entity: titleText}
    titleText.color = Color4.Black()
    titleText.value = proposal.title
    titleText.fontSize = 12
    titleText.positionX = xOffset
    titleText.positionY = yOffset
    titleText.width = 210
    titleText.textWrapping = true
    titleText.vAlign = "top"
    titleText.lineCount = 2

    ui_texts.push(titleText)
    return ui_proposal
}

// TODO: Move me to a utility lib
const clearRendered = (renderedMaterial:Array<PropUIItem>) => {
    renderedMaterial.map((propUIItem) => {
        propUIItem.entity.visible = false
    })
}

const addToQueue = (proposals:Array<api.ProposalItem>, proposal_queue:Array<api.ProposalItem>):Array<api.ProposalItem> => {
    // whaaaaaaat why doesn't this work?
    // const dedupe_incoming = proposals.filter((item: api.ProposalItem) => {
    //     if (proposal_queue.indexOf(item) == -1) {
    //         log(proposal_queue.indexOf(item), proposal_queue.length)
    //         return false
    //     } else {
    //         return true
    //     }
    // })
    // log(dedupe_incoming, proposals, proposal_queue)
    const new_queue = [...proposal_queue, ...proposals]
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
    queueBg.width = 250
    queueBg.height = 500
    queueBg.positionX = xOffset + globalX + margin * 2

    ui_elements.push(queueBg)

    const titleText = new UIText(canvas)
    titleText.color = Color4.Black()
    titleText.value = 'Active Queue'
    titleText.fontSize = 24
    titleText.positionX = xOffset + globalX - margin / 2
    titleText.positionY = 220

    ui_texts.push(titleText)

    sceneMessageBus.on("proposalsAdded", (data) => {
        proposal_queue = addToQueue(data.proposals, proposal_queue)
        let yOffset = -100
        proposal_queue.map((proposal:api.ProposalItem) => {
            const uiItem = renderQueueItem(xOffset - margin * 2 + 5, yOffset, canvas, proposal)
            yOffset -= 40
        })
    })

    updateUIQueue(xOffset, proposal_queue, proposals, canvas)

    return true
}

export const setupPodiums = (locations:Array<Array<any>>) => {
    locations.map((location:Array<any>) => {
        const box = new Entity()
        box.addComponent(new BoxShape())
        box.getComponent(BoxShape).withCollisions = false
        box.getComponent(BoxShape).visible = true
        box.getComponent(BoxShape).isPointerBlocker = true
        box.addComponent(new Transform({
            position: location[0], 
            scale: new Vector3(.8,.1,.8), 
            rotation: location[1]}))
        box.addComponent(new OnPointerDown(() => {
            clearUi()
            renderProposalUI()
        }))
        engine.addEntity(box)
    })
}

setupPodiums([
    [new Vector3(32,1.2,16), Quaternion.Euler(36, 180, 0)], 
    [new Vector3(32,1.2,32), Quaternion.Euler(36, 0, 0)]])

