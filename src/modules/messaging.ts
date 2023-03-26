export const requestQueue = (bus:MessageBus) => {
  bus.emit("requestQueue", {})
}