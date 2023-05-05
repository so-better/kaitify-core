import alexEditor from './index.vue'
import AlexElement from './Element'
alexEditor.install = app => {
	app.component(alexEditor.name, alexEditor)
}

export { AlexElement, alexEditor, alexEditor as default }
