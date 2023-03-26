export const makeAddButton = (canvas:UICanvas, lightTheme:Texture, globalX: number) => {
  const addButton = new UIImage(canvas, lightTheme)
  addButton.sourceLeft = 512
  addButton.sourceTop = 612
  addButton.sourceWidth = 180
  addButton.sourceHeight = 50
  addButton.positionX = 220 + globalX
  addButton.positionY = -200
  addButton.width = 100
  addButton.height = 35
  return addButton
}

export const makeExitButton = (canvas:UICanvas, lightTheme:Texture, globalX?: number) => {
  const exitButton = new UIImage(canvas, lightTheme)
  exitButton.sourceLeft = 583
  exitButton.sourceTop = 381
  exitButton.sourceWidth = 64
  exitButton.sourceHeight = 64
  exitButton.positionX = 180
  exitButton.positionY = 210
  exitButton.width = 35
  exitButton.height = 35
  return exitButton
}