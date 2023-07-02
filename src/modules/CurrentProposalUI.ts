import { renderSingleProposalView } from "./ProposalItemUI"
import { ProposalListUI } from "./ProposalListUI"
import { ProposalItem } from "./api"
import { setCurrentBandProposal } from "./controls"
import { atlas } from "./resources"
import { EntityList } from "./ui_util"
import { lightTheme } from "@dcl/ui-scene-utils"

/*  
  Display a preview bar of the proposal currently at the top of the queue.
  In its empty state, the proposal shows that no proposals have been queued and invites
  the user to add proposals to the queue.
  The bar displays the proposal title (truncated), its rational index in the queue,
  and votes for, against, threshold met or not
*/

export class CurrentProposalUI {
  ui_elements:EntityList = new EntityList()
  canvas: UICanvas
  proposal: any
  globalX: number
  openbtn: UIImage
  container: UIContainerRect
  background_top: UIImage

  constructor(canvas:UICanvas, globalX: number) {
    this.canvas = canvas
    this.globalX = globalX
    this.proposal = null

    this.background_top = new UIImage(canvas, lightTheme)
    this.background_top.hAlign = "center"
    this.background_top.sourceWidth = 780
    this.background_top.sourceHeight = 95
    this.background_top.sourceLeft = 11
    this.background_top.sourceTop = 750
    this.background_top.width = 600
    this.background_top.height = 80
    this.background_top.positionY = -50
    this.background_top.vAlign = "bottom"
    
    this.container = new UIContainerRect(canvas)
    this.container.hAlign = "center"
    this.container.width = 580
    this.container.height = 50
    this.container.positionX = 20
    this.container.vAlign = "bottom"
    
    this.openbtn = new UIImage(this.container, atlas)
    this.openbtn.vAlign = "top"
    this.openbtn.hAlign = "right"
    this.openbtn.sourceLeft = 0
    this.openbtn.sourceTop = 0
    this.openbtn.sourceWidth = 128
    this.openbtn.sourceHeight = 128
    this.openbtn.positionX = -28
    this.openbtn.positionY = -36
    this.openbtn.width = 35
    this.openbtn.height = 35

    this.render(canvas, globalX)
  }

  render(canvas:UICanvas, globalX: number) {
    const labelText = new UIText(this.container)
    labelText.color = Color4.Black()
    labelText.value = 'CURRENT PROPOSAL'
    labelText.fontSize = 10
    labelText.positionX = 0
    labelText.hAlign = "left"
    labelText.vAlign = "bottom"
  }

  recieve(proposal:ProposalItem) {
    if (this.proposal == null) {
      this.proposal = proposal
      this.setProposal(proposal)
      setCurrentBandProposal(proposal)
    } else {
      this.ui_elements.delete()
      this.setProposal(proposal)
      setCurrentBandProposal(proposal)
    }
  }

  setProposal(proposal:ProposalItem) {
    this.ui_elements.delete()

    this.proposal = proposal

    const titleText = new UIText(this.container)
    titleText.color = Color4.Black()
    titleText.value = proposal.title
    titleText.fontSize = 14
    titleText.positionY = -20
    titleText.hAlign = "left"
    titleText.vAlign = "bottom"
    titleText.width = "80%"
    this.ui_elements.add(titleText)
  }
}