import alex from './index.vue'
import AlexElement from './Element'
alex.install = app => {
	app.component(alex.name, alex)
}

export { AlexElement, alex, alex as default }
