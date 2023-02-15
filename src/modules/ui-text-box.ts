import { lightTheme } from "node_modules/@dcl/ui-scene-utils/dist/index"


export function createScrollBox(
    x:number, y:number, 
    width:number, height:number, 
    contents:string, canvas:UICanvas):UIContainerRect {

        const container = new UIContainerRect(canvas)
        const text_stack = getTextStackFromString(contents)

        const scroll_bar = renderScrollBar(container)
        
        scroll_bar.addComponent(new OnPointerDown(() => {

        }))

        return container
}

function renderScrollBar(container:UIContainerRect) {
    const bar = new UIImage(container, lightTheme)
    bar.vAlign = "top"

}

function getTextStackFromString(contents:String) {
    let stack = []
    let index = 0
    for (let i = 0; i < contents.length; i+=lineLength()) {
        stack[index] = contents.slice(i, i + lineLength())
        index++
    }
    return stack
}

const lineLength = () => {
    return 50
}