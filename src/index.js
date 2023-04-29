import alex from './index.vue'
alex.install = app => {
	app.component(alex.name, alex)
}

export { alex, alex as default }
