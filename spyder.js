import { combineRgb, Regex, UDPHelper } from '@companion-module/base'
import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'
import { compileActionDefinitions } from './actions.js'

const UpgradeScripts = []

class SpyderInstance extends InstanceBase {
	constructor(internal) {
		// super-constructor
		super(internal)

		this.devMode = process.env.DEVELOPER
		this.hasError = false
	}

	sendCmd = async (cmd) => {
		if (cmd !== undefined) {
			let c = cmd.slice(0, 3)
			this.log('info', `Sending ${cmd} to ${this.config.host}`)

			if (this.udp !== undefined) {
				this.udp.send('spyder\x00\x00\x00\x00' + cmd)

			// TODO: save c for later response validation
			}
		}
	}

	async init(config) {
		this.hasError = false
		this.config = config

		this.start('Initializing')
	}

	async updateConfig(config) {
		await this.destroy()
		this.config = config
		this.start('Restarting')
	}

	// When module gets deleted
	async destroy() {
		this.updateStatus(InstanceStatus.Disconnected, 'Closed')
		if (this.udp !== undefined) {
			this.udp.destroy()
		}
	}

	start(msg) {
		this.updateStatus(InstanceStatus.Connecting, msg)
		this.setActionDefinitions(compileActionDefinitions(this))
		this.init_udp()
	}

	init_udp() {
		if (this.config.host !== undefined) {
			this.udp = new UDPHelper(this.config.host, 11116)

			// this.udp.on('status_change', (status, message) => {
			// 	this.updateStatus(status, message)
			// })

			this.udp.on('error', (error) => {
				if (!this.hasError) {
					this.log('debug', `Network error ${err}`)
					this.updateStatus(InstanceStatus.UnknownError, err.message)
					this.log('error', 'Network error: ' + err.message)
					this.hasError = true
				}
			})

			this.udp.on('data', (data) => {
				let msg = data.toString()

				switch (msg.slice(0,1)) {
					case '0':   // all good
						this.updateStatus(InstanceStatus.Ok,'Connected')
						// TODO: expected data responses would be decoded and saved here
						break
				}

			})

			this.udp.on('listening',() => {
				this.updateStatus(InstanceStatus.Ok,'UDP Listening')
				// send a simple query (layers)
				this.sendCmd('RLC')
			})
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: Regex.IP,
			},
		]
	}
}

runEntrypoint(SpyderInstance, UpgradeScripts)
