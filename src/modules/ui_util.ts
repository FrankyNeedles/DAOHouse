import * as api from "./api"
import { PropList } from "./ui"

export const clearUi = (ui_elements:Array<UIImage>, ui_texts:Array<UIText>) => {
  ui_elements.map((element) => {
      element.visible = false
      element.isPointerBlocker = false 
  })
  ui_texts.map((text) => {
      text.visible = false
      text.isPointerBlocker = false
  })
}

export const toggleUi = (ui_elements:Array<UIImage>, ui_texts:Array<UIText>) => {
  ui_elements.map((element) => {
      element.visible = element.visible ? false : true
      element.isPointerBlocker = element.isPointerBlocker ? false : true
  })
  ui_texts.map((text) => {
      text.visible = text.visible ? false : true
      text.isPointerBlocker = text.isPointerBlocker ? false : true
  })
}

export const indexById = (proposals:Array<api.ProposalItem>):PropList<api.ProposalItem> => {
  let indexed = {}
  proposals.map((item:api.ProposalItem) => {
      indexed = { ...indexed, [item.id]:item }
  })
  return indexed
}

export class EntityList {
  list:Array<UIText | UIImage> = []
  hidden_list:Array<UIText | UIImage> = []
  deleted_list:Array<UIText | UIImage> = []
  visible:boolean = false
  
  constructor() {}

  add(e:UIText | UIImage) {
    this.list.push(e)
  }

  map(fnc:(value:UIText | UIImage) => boolean):Array<boolean> {
    return this.list.map(fnc)
  }

  mapHidden() {
    return this.hidden_list.map
  }

  // these both overwrite! make it so that these gracefully toggle
  hideAll() {
    // this.hidden_list = this.list 
    // this.list = []
    // this.hidden_list.map(e => e.visible = false)
    this.list.map(e => e.visible = false)
  }

  showAll() {
    // this.list = this.hidden_list
    // this.hidden_list = []
    this.list.map(e => e.visible = true)
  }

  toggle() {
    if (this.visible) {
      this.hideAll()
      this.visible = false
    } else {
      this.showAll()
      this.visible = true
    }
  }

  deleteByTextTitle(e:api.ProposalItem) {
    this.list = this.list.filter((ui_item) => {
      if ("value" in ui_item) {
        if (ui_item.value == e.title) {
            ui_item.visible = false
            return false
        } else {
            return true
        }
      } else {
        return true
      }
    })
  }
}