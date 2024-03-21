import { AlexPoint } from './Point'

export class AlexRange {
	anchor: AlexPoint
	focus: AlexPoint

	constructor(anchor: AlexPoint, focus: AlexPoint) {
		this.anchor = anchor
		this.focus = focus
	}
}
