import { IShape } from "./Shape.interface"

export interface IShapeInstance extends IShape {
    isSelected: boolean
    onSelect: (event: any) => void
    onChange: (event: any) => void
}