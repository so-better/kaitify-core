import { AlexPoint } from './Point'

export class AlexRange {
	/**
	 * 起点虚拟光标
	 */
	anchor: AlexPoint
	/**
	 * 终点虚拟光标
	 */
	focus: AlexPoint

	constructor(anchor: AlexPoint, focus: AlexPoint) {
		this.anchor = anchor
		this.focus = focus
	}
}
