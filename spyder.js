import { combineRgb, Regex, UDPHelper } from '@companion-module/base'
import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'
import { compileActionDefinitions } from './actions.js'
import { GetFeedbackDefinitions } from './feedbacks.js'

const Upgradereg = []

class SpyderInstance extends InstanceBase {
	constructor(internal) {
		// super-constructor
		super(internal)

		this.devMode = process.env.DEVELOPER
		this.hasError = false
	}

	cueCmd = async (cmd) => {
		if (cmd !== undefined) {
			if (this.pending.length) {
				this.nextCmd.push(cmd)
			} else {
				await this.sendCmd(cmd)
			}
		}
	}

	sendCmd = async (cmd) => {
		const now = Date.now()
		let c = cmd.split(' ')
		if (c[2] != '-1') {
			c = c.slice(0, 3)
		} else {
			c = c.slice(0, 2)
		}
		c = c.join(' ')
		this.log('info', `Sending ${cmd} to ${this.config.host}`)

		if (this.udp !== undefined) {
			await this.udp.send('spyder\x00\x00\x00\x00' + cmd)
			// save cmd for to store with next incoming response
			this.pending.push({ cmd: c, sent: now })
			this.lastCmd = cmd
		}
	}

	async init(config) {
		this.hasError = false
		this.config = config
		this.start('Initializing')
	}

	async configUpdated(config) {
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
		this.setFeedbackDefinitions(GetFeedbackDefinitions(this))
		this.pending = []
		this.nextCmd = []
		this.status = {}
		this.init_udp()
	}
	
	init_udp() {
		if (this.config.host !== undefined) {
			this.udp = new UDPHelper(this.config.host, 11116)

			this.udp.on('error', (error) => {
				if (!this.hasError) {
					this.log('debug', `Network error ${err}`)
					this.updateStatus(InstanceStatus.UnknownError, err.message)
					this.log('error', 'Network error: ' + err.message)
					this.hasError = true
				}
				if (this.pollTimer) {
					clearInterval(this.pollTimer)
					delete this.pollTimer
				}
			})

			this.udp.on('data', async (data) => {
				let msg = data.toString()
				let cmd = this.pending.shift()
				if (cmd == undefined || cmd.cmd.includes('NaN')) {
					return // unexpected response
				}
				this.log('info', `Rcvd: ${this.nextCmd.length}:(${cmd.cmd}) ${msg}`)

				switch (msg.slice(0, 1)) {
					case '0': // all good
						this.updateStatus(InstanceStatus.Ok, 'Connected')
						// TODO: expected data responses would be decoded and saved here
						this.status[cmd.cmd] = {
							resp: msg.slice(2),
							lag: Date.now() - cmd.sent,
						}
						const cmds = cmd.cmd.split(' ')
						let newReg = false
						let newNames = false

						switch (cmds[0]) {
							case 'RRL':
								switch (cmds[1]) {
									case '4':
										let r = msg.slice(2).split(' ')
										let c = r.shift()
										for (let i = 0; i < c; i++) {
											let id = parseInt(r[i * 2])
											let name = decodeURIComponent(r[i * 2 + 1])
											let rr = this.reg[-1]
											if (rr === undefined) {
												rr = { id, active: false, scriptId: null }
												this.variableDefs.push({ name: `Script ${id}`, variableId: `ck_${id}` })
												newReg = true
											}
											if (rr.name != name) {
												rr.name = decodeURIComponent(r[i * 2 + 1])
												this.variableValues[`ck_${id}`] = name
												newNames = true
											}
											this.reg[r[i * 2]] = rr
										}
										break
									
									case '5':
										let r5 = msg.slice(2).split(' ')
										let c5 = r5.shift()
										for (let i = 0; i < c5; i++) {
											let id5 = parseInt(r5[i * 2])
											let name5 = decodeURIComponent(r5[i * 2 + 1])
											let rr5 = this.reg[-1]
											if (rr5 === undefined) {
												rr5 = { id5, active: false, scriptId: null }
												this.variableDefs.push({ name: `Treatment ${id5}`, variableId: `trmt_${id5}` })
												newReg = true
											}
											if (rr5.name != name5) {
												rr5.name = decodeURIComponent(r5[i * 2 + 1])
												this.variableValues[`trmt_${id5}`] = name5
												newNames = true
											}
											this.reg[r5[i * 2]] = rr5
										}
										break

									case '6':
										let r6 = msg.slice(2).split(' ')
										let c6 = r6.shift()
										for (let i = 0; i < c6; i++) {
											let id6 = parseInt(r6[i * 2])
											let name6 = decodeURIComponent(r6[i * 2 + 1])
											let rr6 = this.reg[-1]
											if (rr6 === undefined) {
												rr6 = { id6, active: false, scriptId: null }
												this.variableDefs.push({ name: `Source ${id6 + 1}`, variableId: `src_${id6 + 1}` })
												newReg = true
											}
											if (rr6.name != name6) {
												rr6.name = decodeURIComponent(r6[i * 2 + 1])
												this.variableValues[`src_${id6 + 1}`] = name6
												newNames = true
											}
											this.reg[r6[i * 2]] = rr6
										}
										break

									case '7':
										let r7 = msg.slice(2).split(' ')
										let c7 = r7.shift()
										for (let i = 0; i < c7; i++) {
											let id7 = parseInt(r7[i * 2])
											let name7 = decodeURIComponent(r7[i * 2 + 1])
											let rr7 = this.reg[-1]
											if (rr7 === undefined) {
												rr7 = { id7, active: false, scriptId: null }
												this.variableDefs.push({ name: `Function Key ${id7}`, variableId: `fnk_${id7}` })
												newReg = true
											}
											if (rr7.name != name7) {
												rr7.name = decodeURIComponent(r7[i * 2 + 1])
												this.variableValues[`fnk_${id7}`] = name7
												newNames = true
											}
											this.reg[r7[i * 2]] = rr7
										}
										break	

									case '10':
										let r10 = msg.slice(2).split(' ')
										let c10 = r10.shift()
										for (let i = 0; i < c10; i++) {
											let id10 = parseInt(r10[i * 2])
											let name10 = decodeURIComponent(r10[i * 2 + 1])
											let rr10 = this.reg[-1]
											//if (rr10 === undefined) {
											//	rr10 = { id10, active: false, scriptId: null }
												this.variableDefs.push({ name: `Still ${id10 + 1}`, variableId: `still_${id10 + 1}` })
												newReg = true
											//}
											//if (rr10.name != name10) {
											//	rr10.name = decodeURIComponent(r10[i * 2 + 1])
												this.variableValues[`still_${id10 + 1}`] = name10
												newNames = true
											//}
											this.reg[r10[i * 2]] = rr10
										}
										break										
								}
								case 'RLK':
									for (let k = 2; k < 26; k++) {
										if(cmds[1] == k) {
											this.variableDefs.push({ name: `Layer${k - 1} // X Pos`, variableId: `layer${k - 1}_xpos` })
											this.variableDefs.push({ name: `Layer${k - 1} // Y Pos`, variableId: `layer${k - 1}_ypos` })
											this.variableDefs.push({ name: `Layer${k - 1} // X Size`, variableId: `layer${k - 1}_xsize` })
											this.variableDefs.push({ name: `Layer${k - 1} // Y Size`, variableId: `layer${k - 1}_ysize` })
											newReg = true
											let l = msg.slice(2).split(' ')
											this.variableValues[`layer${k - 1}_xpos`] = l[2]
											this.variableValues[`layer${k - 1}_ypos`] = l[3]
											this.variableValues[`layer${k - 1}_xsize`] = l[4]
											this.variableValues[`layer${k - 1}_ysize`] = l[5]
											newNames = true
											}
										}
									break
						}
						if (newReg) {
							this.setVariableDefinitions(this.variableDefs)
						}
						if (newNames) {
							this.setVariableValues(this.variableValues)
							this.variableValues = {}
						}

						break
				}
				if (this.nextCmd.length) {
					await this.cueCmd(this.nextCmd.shift())
				}
			})

			this.udp.on('listening', async () => {
				this.updateStatus(InstanceStatus.Ok, 'UDP Listening')
				this.reg = {}
				this.script2reg = {}
				this.variableDefs = []
				this.variableValues = {}
				this.poll()
				this.pollTimer = setInterval(async () => await this.poll(), 2500)
			})
		}
	}
	
	async poll() {
		if (this.nextCmd.length) {
			// command queue not empty
			if (!this.pending.length) {
				// no commands outstanding
				await this.cueCmd(this.nextCmd.shift())
				this.saveLast = this.lastCmd
				this.lastCount = 0
			} else {
				// count how many times 'pending' is the same
				// after a few ticks, we must have missed a response
				// resend the command
				if (this.saveLast == this.lastCmd) {
					if (this.lastCount++ >= 2) {
						// no response 5s, re-send
						this.pending.shift()
						await this.sendCmd(this.saveLast)
						this.lastCount = 0
					}
				} else {
					this.saveLast = this.lastCmd
					this.lastCount = 0
				}
			}
		} else {
			// grab register names
			for (let c of [0, 1, 4, 5, 6, 7, 10]) {
				let cmd = `RRL ${c} -1`
				await this.cueCmd(cmd)
				this.lastCount = 0
				this.saveLast = cmd
			}
			// grab layer keyframe values
			for (let c = 2; c < 26; c++) { 
				let cmd = `RLK ${c}`
				await this.cueCmd(cmd)
				this.lastCount = 0
				this.saveLast = cmd
			}
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

runEntrypoint(SpyderInstance, Upgradereg)
