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
		// this.log('info', `Sending ${cmd} to ${this.config.host}`)

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

	addVariableDefIfNotExists(def) {
	if (!this.variableDefs.some(v => v.variableId === def.variableId)) {
		this.variableDefs.push(def)
		return true
	}
	return false
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
				// this.log('info', `Rcvd: ${this.nextCmd.length}:(${cmd.cmd}) ${msg}`)

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
										let r4 = msg.slice(2).split(' ')
										let c4 = r4.shift()
										for (let i = 0; i < c4; i++) {
											let id = parseInt(r4[i * 2])
											let name = decodeURIComponent(r4[i * 2 + 1])
											let rr = this.reg[id]
											if (rr === undefined) {
												rr = { id, active: false, scriptId: null }
												this.variableDefs.push({ name: `Register ${id + 1} Name`, variableId: `r_name_${id + 1}` })
												newReg = true
											}
											if (rr.name != name) {
												rr.name = decodeURIComponent(r4[i * 2 + 1])
												this.variableValues[`r_name_${id + 1}`] = name
												newNames = true
											}
											this.reg[r4[i * 2]] = rr
										}

										for (let s in this.reg) {
											await this.cueCmd(`RRD 4 ${this.reg[s].id}`)
											await this.cueCmd(`SCR ${this.reg[s].id} R`)
											if (this.reg[s].scriptId) {
													await this.cueCmd(`SCR ${this.reg[s].scriptId} S`)
											}
										}
										break
									
									case '5':
										let r5 = msg.slice(2).split(' ')
										let c5 = r5.shift()
										for (let i = 0; i < c5; i++) {
											let id = parseInt(r5[i * 2])
											let name = decodeURIComponent(r5[i * 2 + 1])
											if (this.addVariableDefIfNotExists({ name: `Treatment ${id}`, variableId: `trmt_${id}` })) {
											newReg = true
											}
											this.variableValues[`trmt_${id}`] = name
											newNames = true
										}
										break

									case '6':
										let r6 = msg.slice(2).split(' ')
										let c6 = r6.shift()
										for (let i = 0; i < c6; i++) {
											let id = parseInt(r6[i * 2])
											let name = decodeURIComponent(r6[i * 2 + 1])
											if (this.addVariableDefIfNotExists({ name: `Source ${id + 1}`, variableId: `src_${id + 1}` })) {
											newReg = true
											}
											this.variableValues[`src_${id + 1}`] = name
											newNames = true
										}
										break

									case '7':
										let r7 = msg.slice(2).split(' ')
										let c7 = r7.shift()
										for (let i = 0; i < c7; i++) {
											let id = parseInt(r7[i * 2])
											let name = decodeURIComponent(r7[i * 2 + 1])
											if (this.addVariableDefIfNotExists({ name: `Function Key ${id}`, variableId: `fnk_${id}` })) {
											newReg = true
											}
											this.variableValues[`fnk_${id}`] = name
											newNames = true
										}
										break	

									case '10':
										let r10 = msg.slice(2).split(' ')
										let c10 = r10.shift()
										for (let i = 0; i < c10; i++) {
											let id = parseInt(r10[i * 2])
											let name = decodeURIComponent(r10[i * 2 + 1])
											if (this.addVariableDefIfNotExists({ name: `Still ${id + 1}`, variableId: `still_${id + 1}` })) {
											newReg = true
											}
											this.variableValues[`still_${id + 1}`] = name
											newNames = true
										}
										break										
								}

								//case 'RLK':
								//	for (let k = 2; k < 26; k++) {
								//		if(cmds[1] == k) {																						
								//			if (this.addVariableDefIfNotExists({ name: `Layer ${k - 1} // X Pos`, variableId: `l${k - 1}_xpos` })) {
								//			newReg = true
								//			}
								//			if (this.addVariableDefIfNotExists({ name: `Layer ${k - 1} // Y Pos`, variableId: `l${k - 1}_ypos` })) {
								//			newReg = true
								//			}
								//			if (this.addVariableDefIfNotExists({ name: `Layer ${k - 1} // X Size`, variableId: `l${k - 1}_xsize` })) {
								//			newReg = true
								//			}
								//			if (this.addVariableDefIfNotExists({ name: `Layer ${k - 1} // Y Size`, variableId: `l${k - 1}_ysize` })) {
								//			newReg = true
								//			}
								//			let l = msg.slice(2).split(' ')
								//			this.variableValues[`l${k - 1}_xpos`] = l[2]
								//			this.variableValues[`l${k - 1}_ypos`] = l[3]
								//			this.variableValues[`l${k - 1}_xsize`] = l[4]
								//			this.variableValues[`l${k - 1}_ysize`] = l[5]
								//			newNames = true
								//			}
								//		}
								//	break

								case 'RRD':
									const val = msg.split(' ')
									if (val.length != 4 || cmds[2] == 'NaN') {
										return // bad response
									}
									let id = parseInt(val[1])

									this.reg[cmds[2]].scriptId = id
									this.reg[cmds[2]].relative = !!val[2]
									this.reg[cmds[2]].numCues = val[3]
									if (!this.script2reg[val[1]]) {
									this.variableDefs.push({ name: `Script ${id} name`, variableId: `s_name_${id}` })
									this.variableValues[`s_name_${id}`] = this.reg[cmds[2]].name
									this.script2reg[val[1]] = cmds[2]
									newReg = true
									newNames = true
									}
									break
									
								case 'SCR':
									let nv = !!(msg.split(' ')[1] == 1)
									let rr = cmds[2] == 'R' ? cmds[1] : this.script2reg[cmds[1]]
									if (nv != this.reg[rr].active) {
									this.reg[rr].active = nv
									this.checkFeedbacks('inp_ok')
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
			//for (let c = 2; c < 26; c++) { 
			//	let cmd = `RLK ${c}`
			//	await this.cueCmd(cmd)
			//	this.lastCount = 0
			//	this.saveLast = cmd
			//}
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
