
export enum ShapeType {

}

abstract class RenderObject {
  private type: ShapeType;
  private shape: number;

  constructor({ type, shape }: { type: ShapeType; shape: number }) {
    this.type = type;
    this.shape = shape;
  }
}

export default RenderObject;
