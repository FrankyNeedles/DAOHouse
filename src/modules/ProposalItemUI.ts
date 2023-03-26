import { lightTheme } from "@dcl/ui-scene-utils"
import { createScrollBox, renderDownBtn, renderUpBtn } from "./ui-text-box"
import { EntityList } from "./ui_util"
import { makeExitButton } from "./buttons"
import * as api from "./api"

export const renderSingleProposalView = async (globalX:number) => {
  // clearUi(ui_elements, ui_texts)
  const canvas = new UICanvas()

  const ui_elements = new EntityList()
  
  const background = new UIImage(canvas, lightTheme)
  background.sourceWidth = 416
  background.sourceHeight = 356
  background.sourceLeft = 500
  background.sourceTop = 11
  background.width = 600
  background.height = 500
  background.positionX = globalX
  
  ui_elements.add(background)

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

  ui_elements.add(titleText)

  const subtitleText = new UIText(canvas)
  subtitleText.color = Color4.Black()
  subtitleText.value = 'Active Proposals'
  subtitleText.fontSize = 16
  subtitleText.positionX = globalX - 220
  subtitleText.positionY = 160

  ui_elements.add(subtitleText)

  // Exit  button
  const exitButton = makeExitButton(canvas, lightTheme)

  ui_elements.add(exitButton)

  exitButton.onClick = new OnPointerDown(() => {
      ui_elements.hideAll()
  })

  let propData = await api.proposalItemData(Math.round(Math.random()*10))

  titleText.value = propData.title

  const status_formatted = propData.status.charAt(0).toUpperCase() + propData.status.slice(1)
  subtitleText.value = status_formatted

  // render the paragraph
  const paragraph = createScrollBox(
      0, 120,
      600,600,
      propData.description,
      canvas)

  // render a scroll bar the user can use to move through text
  const up_btn = renderUpBtn(canvas, 180, -280)
  const down_btn = renderDownBtn(canvas, 180, -240)
  
  up_btn.onClick = new OnPointerDown(() => {
      paragraph.scrollDown()
      paragraph.scrollDown()
  })
  
  down_btn.onClick = new OnPointerDown(() => {
      paragraph.scrollUp()
      paragraph.scrollUp()
  })

  ui_elements.add(down_btn)
  ui_elements.add(up_btn)

  paragraph.text_entities.map(e => ui_elements.add(e))

}