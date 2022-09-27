import { map } from '@dcl/ecs-scene-utils'
import * as ui from '@dcl/ui-scene-utils'
import * as api from './api'

const sceneMessageBus = new MessageBus()

interface PropList<T> {
    [index: string]: T
}

export let lightTheme = new Texture('https://decentraland.org/images/ui/light-atlas-v3.png')

export const displayQueue = async (xOffset:number, canvas:UICanvas) => {
    let queue:PropList<api.ProposalItem> = {}
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

    let renderedMaterial:Array<UIText> = []

    const renderQueue = (queue:PropList<api.ProposalItem>) => {

        const clearRendered = () => {
            renderedMaterial.map((entity) => {
                entity.visible = false
            })
        }

        clearRendered()

        let yOffset = 0
        Object.keys(queue).map((id) => {
            const item = queue[id]
            const titleText = new UIText(canvas)
            titleText.color = Color4.Black()
            titleText.value = item.title
            titleText.fontSize = 12
            titleText.positionX = xOffset + 20
            titleText.positionY = 200 - yOffset
            yOffset += 20
            renderedMaterial.push(titleText)
        })
    }

    const addToQueue = (props:PropList<api.ProposalItem>):PropList<api.ProposalItem> => {
        let newQueue:PropList<api.ProposalItem> = {}
        Object.keys(props).map((propId) => {
            newQueue[propId] = props[propId]
        })
        renderQueue(newQueue)
        return newQueue
    }

    sceneMessageBus.on("propsAdded", (data) => {
        queue = addToQueue(data.props)
      })
}

export const setupUi = async () => {
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
    titleText.value = 'Town Hall Discussion Queue'
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
    
    const props = await api.proposalItemDataSet()

    let spacer = -125

    let propsForQueue:PropList<api.ProposalItem> = {}
    let propsQueue:Array<string>

    props.map((proposalItem) => {
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

        rect.onClick = new OnPointerDown(() => {
            propsForQueue[proposalItem.id] = proposalItem
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
        sceneMessageBus.emit("propsAdded", { props: propsForQueue})
    })

    displayQueue(400, canvas)
}
