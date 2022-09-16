import * as ui from '@dcl/ui-scene-utils'
import * as api from './api'

export let lightTheme = new Texture('https://decentraland.org/images/ui/light-atlas-v3.png')

export const setupUi = async () => {
    const canvas = new UICanvas()
    
    const background = new UIImage(canvas, lightTheme)
    background.sourceWidth = 416
    background.sourceHeight = 356
    background.sourceLeft = 500
    background.sourceTop = 11
    background.width = 600
    background.height = 500


    const propListContainer = new UIContainerRect(canvas)

    propListContainer.hAlign = "left"
    propListContainer.vAlign = "top"
    propListContainer.width = '80%'
    // propListContainer.stackOrientation = UIStackOrientation.VERTICAL
    propListContainer.positionX = 260
    propListContainer.positionY = -140
    // propListContainer.spacing = .25
    // propListContainer.adaptHeight = true

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
    addText.value = 'Add +'
    addText.color = Color4.White()
    addText.fontSize = 18
    addText.positionX = "23%"
    addText.positionY = "45%"
    
    const props = await api.proposalItemDataSet()

    let spacer = -125

    props.map((pit) => {
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
        myText.color = Color4.Black()
        myText.value = pit.title
        myText.fontSize = 12
        myText.positionX = -210
        myText.positionY = 18

        rect.onClick = new OnPointerDown(() => {
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
}
