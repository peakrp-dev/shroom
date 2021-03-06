export interface IRoomGeometry {
  getPosition(
    roomX: number,
    roomY: number,
    roomZ: number,
    type: "plane" | "object" | "none"
  ): { x: number; y: number };
}
