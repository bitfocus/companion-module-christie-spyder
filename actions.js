import { Regex } from '@companion-module/base'

export function compileActionDefinitions(self) {
	const sendCmd = self.sendCmd

	return {
		
		'air': {
			name: 'AIR // Aspect Insensitive Resize',
			options: [
				{
					type: 'dropdown',
					label: 'Sizing Type',
					id: 'type',
					default: '0',
					choices: [
						{ id: '0', label: 'Absolute' },
						{ id: '1', label: 'Relative' },
					],
				},
				{
					type: 'dropdown',
					label: 'X / Y',
					id: 'xy',
					default: '0',
					choices: [
						{ id: '0', label: 'X (Horizontal)' },
						{ id: '1', label: 'Y (Vertical)' },
					],
				},
				{
					type: 'textinput',
					label: 'New Size (Pixels)',
					id: 'size',
					useVariables: true,
					default: 1920,
				},
				{
					type: 'textinput',
					label: 'Layer ID (#+1)', // Check formatting of layers argument (%20 needed?)
					id: 'lid',
					useVariables: true,
					default: '2',
				},
			],
			callback: async (action, context) => {
				const type = action.options.type
				const xy = action.options.xy
				const size = await self.parseVariablesInString(action.options.size)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`AIR ${type} ${xy} ${size} ${lid}`)
			},
		},

		'arl': {
			name: 'ARL // Apply Register to Layer',
			options: [
				{
					type: 'dropdown',
					label: 'Register Type',
					id: 'reg',
					default: '5',
					choices: [
						{ id: '0', label: 'Effect' },
						{ id: '1', label: 'Play Item' },
						{ id: '4', label: 'Command Key (Script)' },
						{ id: '5', label: 'Treatment' },
						{ id: '6', label: 'Source' },
						{ id: '7', label: 'Function Key' },
						{ id: '10', label: 'Still Image' },
					],
				},
				{
					type: 'textinput',
					label: 'Register ID',
					id: 'rid',
					useVariables: true,
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Layer ID (#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},
			],
			callback: async (action, context) => {
				const reg = action.options.reg
				const rid = await self.parseVariablesInString(action.options.rid)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`ARL ${reg} ${rid} ${lid}`)
			},
		},

		'aro': {
			name: 'ARO // Aspect Ratio Offset',
			options: [
				{
					type: 'dropdown',
					label: 'Type',
					id: 'type',
					default: 't',
					choices: [
						{ id: 't', label: 'Set Total Aspect Ratio' },
						{ id: 'o', label: 'Set Keyframe Aspect Ratio Offset' },
						{ id: 'a', label: 'Adjust Keyframe Aspect Ratio Offset' },
					],
				},
				{
					type: 'textinput',
					label: 'Floating Point',
					id: 'fp',
					useVariables: true,
					default: '1.7777777',
				},
				{
					type: 'textinput',
					label: 'Layer ID (#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},
			],
			callback: async (action, context) => {
				const type = action.options.type
				const fp = await self.parseVariablesInString(action.options.fp)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`ARO ${type} ${fp} ${lid}`)
			},
		},

		'asc': {
			name: 'ASC // Advance Script Cue',
			options: [
				{
					type: 'textinput',
					label: 'Number of Steps',
					id: 'step',
					default: '1',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const step = await self.parseVariablesInString(action.options.step)
				await sendCmd(`ASC ${step}`)
			},
		},
		
		'bld': {
			name: 'BLD // Load Still in Background',
			options: [
				{
					type: 'textinput',
					label: 'File Name',
					id: 'file',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'PixelSpace ID',
					id: 'psid',
					default: '100',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Layer',
					id: 'lay',
					default: '1',
					choices: [
						{ id: '1', label: 'Current' },
						{ id: '0', label: 'Next' },
					],
				},
			],
			callback: async (action, context) => {
				const file = await self.parseVariablesInString(action.options.file)
				const psid = await self.parseVariablesInString(action.options.psid)
				const lay = action.options.lay
				await sendCmd(`BLD ${file} ${psid} ${lay}`)
			},
		},

		'bpl': {
			name: 'BPL // Basic Preset Learn',
			options: [
				{
					type: 'textinput',
					label: 'Preset Index',
					id: 'idx',
					useVariables: true,
					default: 1,
				},
				{
					type: 'textinput',
					label: 'Duration (Optional)',
					id: 'dur',
					useVariables: true,
					default: 60,
				},
			],
			callback: async (action, context) => {
				const idx = await self.parseVariablesInString(action.options.idx)
				const dur = await self.parseVariablesInString(action.options.dur)
				await sendCmd(`BPL ${idx} ${dur}`)
			},
		},

		'bpr': {
			name: 'BPR // Basic Preset Recall',
			options: [
				{
					type: 'textinput',
					label: 'Preset Index',
					id: 'idx',
					default: 1,
					useVariables: true,

				},
				{
					type: 'textinput',
					label: 'Duration (Optional)',
					id: 'dur',
					useVariables: true,
					default: 60,
				},
			],
			callback: async (action, context) => {
				const idx = await self.parseVariablesInString(action.options.idx)
				const dur = await self.parseVariablesInString(action.options.dur)
				await sendCmd(`BPR ${idx} ${dur}`)
			},
		},

		'btr': {
			name: 'BTR // Background Transition',
			options: [
				{
					type: 'textinput',
					label: 'duration',
					id: 'dur',
					useVariables: true,
					default: 60,
				},
			],
			callback: async (action, context) => {
				const dur = await self.parseVariablesInString(action.options.dur)
				await sendCmd(`BTR ${dur}`)
			},
		},

		'cii': {
			name: 'CII // Capture Input Image',
			options: [
				{
					type: 'textinput',
					label: 'Input ID',
					id: 'inp',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'File Name',
					id: 'file',
					default: 'companioncapture.png',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const inp = await self.parseVariablesInString(action.options.inp)
				const file = await self.parseVariablesInString(action.options.file)
				await sendCmd(`CII ${inp} ${file}`)
			},
		},

		'coi': {
			name: 'COI // Capture Output Image',
			options: [
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'File Name',
					id: 'file',
					default: 'companioncapture.png',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const file = await self.parseVariablesInString(action.options.file)
				await sendCmd(`COI ${out} ${file}`)
			},
		},

		'cli': {
			name: 'CLI // Capture Layer Image',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID(#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},
				{
					type: 'textinput',
					label: 'File Name',
					id: 'file',
					useVariables: true,
					default: 'companioncapture.png',
				},
			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const file = await self.parseVariablesInString(action.options.file)
				await sendCmd(`CLI ${lid} ${file}`)
			},
		},

		'crp': {
			name: 'CRP // Crop Layer',
			options: [
				{
					type: 'textinput',
					label: 'Left',
					id: 'left',
					default: '0',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Right',
					id: 'right',
					default: '0',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Top',
					id: 'top',
					default: '0',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Bottom',
					id: 'bottom',
					default: '0',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Layer ID (#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},
			],
			callback: async (action, context) => {
				const left = await self.parseVariablesInString(action.options.left)
				const right = await self.parseVariablesInString(action.options.right)
				const top = await self.parseVariablesInString(action.options.top)
				const bottom = await self.parseVariablesInString(action.options.bottom)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`CRP ${left} ${right} ${top} ${bottom} ${lid}`)
			},
		},

		'cso': {
			name: 'CSO // Clear Still on Output',
			options: [
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					default: 0,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				await sendCmd(`CSO ${out}`)
			},
		},

		'dck': {
			name: 'DCK // Delete Command Key',
			options: [
				{
					type: 'textinput',
					label: 'Command Key ID',
					id: 'id',
					default: 0,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const id = await self.parseVariablesInString(action.options.id)
				await sendCmd(`DCK ${id}`)
			},
		},

		'dmb': {
			name: 'DMB // Device Mixer Bus Apply',
			options: [
				{
					type: 'textinput',
					label: 'Duration',
					id: 'dur',
					useVariables: true,
					default: 60,
				},
				{
					type: 'dropdown',
					label: 'Bus',
					id: 'bus',
					default: 'OFF',
					choices: [
						{ id: 'OFF', label: 'Off' },
						{ id: 'PVW', label: 'PVW' },
						{ id: 'PGM', label: 'PGM' },
					],
				},
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'dev',
					useVariables: true,
					default: '0 1 2 3 4',
				},
			],
			callback: async (action, context) => {
				const dur = await self.parseVariablesInString(action.options.dur)
				const bus = action.options.bus
				const dev = await self.parseVariablesInString(action.options.dev)
				await sendCmd(`DMB ${dur} ${bus} ${dev}`)
			},
		},

		'dmt': {
			name: 'DMT // Device Mixer Transition',
			options: [
				{
					type: 'textinput',
					label: 'duration',
					id: 'dur',
					useVariables: true,
					default: 60,
				},
				{
					type: 'textinput',
					label: 'Device ID',
					id: 'dev',
					default: '0 1 2 3 4',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const dur = await self.parseVariablesInString(action.options.dur)
				const dev = await self.parseVariablesInString(action.options.dev)
				await sendCmd(`DMT ${dur} ${dev}`)
			},
		},

		'fkr': {
			name: 'FKR // Function Key Recall',
			options: [
				{
					type: 'textinput',
					label: 'Function Key ID',
					id: 'fkid',
					useVariables: true,
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Layer ID(#+1) (Optional)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},
			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const fkid = await self.parseVariablesInString(action.options.fkid)
				if(lid != "") {await sendCmd(`FKR ${fkid} ${lid} F`)}
				else {await sendCmd(`FKR ${fkid} F`)}
			},
		},

		'frz': {
			name: 'FRZ // Freeze Layer',
			options: [
				{
					type: 'dropdown',
					label: 'Freeze On/Off',
					id: 'frzonoff',
					default: '1',
					choices: [
						{ id: 1, label: 'Freeze On' },
						{ id: 0, label: 'Freeze Off' },
					],
				},
				{
					type: 'textinput',
					label: 'Layer ID(#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},
			],
			callback: async (action, context) => {
				const onoff = action.options.frzonoff
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`FRZ ${onoff} ${lid}`)
			},
		},

		'ick': {
			name: 'ICK // Input Colour Key',
			options: [
				{
					type: 'dropdown',
					label: 'Enabled?',
					id: 'onoff',
					default: '0',
					choices: [
						{ id: 1, label: 'Enabled' },
						{ id: 0, label: 'Disabled' },
					],
				},
				{
					type: 'textinput',
					label: 'Colour-Red (0-255)',
					id: 'red',
					default: '0',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Colour-Green (0-255)',
					id: 'green',
					default: '0',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Colour-Blue (0-255)',
					id: 'blue',
					default: '0',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Range-Red (0-255)',
					id: 'rred',
					default: '10',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Range-Green (0-255)',
					id: 'rgreen',
					default: '10',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Range-Blue (0-255)',
					id: 'rblue',
					default: '10',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Colour Gain (0-512)',
					id: 'gain',
					default: '255',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Layer ID (#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},
			],
			callback: async (action, context) => {
				const onoff = await self.parseVariablesInString(action.options.onoff)
				const red = await self.parseVariablesInString(action.options.red)
				const green = await self.parseVariablesInString(action.options.green)
				const blue = await self.parseVariablesInString(action.options.blue)
				const rred = await self.parseVariablesInString(action.options.rred)
				const rgreen = await self.parseVariablesInString(action.options.rgreen)
				const rblue = await self.parseVariablesInString(action.options.rblue)
				const gain = await self.parseVariablesInString(action.options.gain)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`ICK ${onoff} ${red} ${green} ${blue} ${rred} ${rgreen} ${rblue} ${rred} ${lid}`)
			},
		},

		'icl': {
			name: 'ICL // Input Config Learn',
			options: [
				{
					type: 'textinput',
					label: 'Input Config ID',
					id: 'inp',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},

			],
			callback: async (action, context) => {
				const inp = await self.parseVariablesInString(action.options.inp)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`ICL ${inp} ${lid}`)
			},
		},

		'icr': {
			name: 'ICR // Input Config Recall',
			options: [
				{
					type: 'textinput',
					label: 'Input Config ID (-1 to Auto-Sync)',
					id: 'cfg',
					default: -1,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Input from Layer ID(#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},
				{
					type: 'dropdown',
					label: 'Auto-Sync Connector',
					id: 'con',
					choices: [
						{ id: 0, label: 'HDMI' },
						{ id: 1, label: 'DP' },
						{ id: 2, label: 'SDI' },
					],
				},

			],
			callback: async (action, context) => {
				const cfg = await self.parseVariablesInString(action.options.cfg)
				const lid = await self.parseVariablesInString(action.options.lid)
				const con = action.options.con
				await sendCmd(`ICR ${cfg} ${lid} ${con}`)
			},
		},

		'ics': {
			name: 'ICS // Input Config Raster Size',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},
				{
					type: 'dropdown',
					label: 'Edge',
					id: 'edge',
					choices: [
						{ id: 'Left', label: 'Left' },
						{ id: 'Right', label: 'Right' },
						{ id: 'Top', label: 'Top' },
						{ id: 'Bottom', label: 'Bottom' },
					],
				},
				{
					type: 'textinput',
					label: 'Pixels',
					id: 'pix',
					default: 0,
					useVariables: true,
				},

			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const edge = action.options.edge
				const pix = await self.parseVariablesInString(action.options.pix)
				await sendCmd(`ICS ${lid} ${edge} ${pix}`)
			},
		},

		'ila': {
			name: 'ILA // Input Level Adjust',
			options: [
				{
					type: 'textinput',
					label: 'Brightness (0 - 2)',
					id: 'bright',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Contrast (0 - 2.5)',
					id: 'cont',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Hue (-180 - 180)',
					id: 'hue',
					default: '0',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Saturation (0 - 2)',
					id: 'sat',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Gamma (0.0 - 3.0) [must include decimal]',
					id: 'gam',
					default: '1.0',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Layer ID (#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},
			],
			callback: async (action, context) => {
				const bright = await self.parseVariablesInString(action.options.bright)
				const cont = await self.parseVariablesInString(action.options.cont)
				const hue = await self.parseVariablesInString(action.options.hue)
				const sat = await self.parseVariablesInString(action.options.sat)
				const gam = await self.parseVariablesInString(action.options.gam)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`ILA ${bright} ${cont} ${hue} ${sat} ${gam} ${lid}`)
			},
		},

		'ilk': {
			name: 'ILK // Input Luminance Key',
			options: [
				{
					type: 'dropdown',
					label: 'Key Enabled',
					id: 'key',
					default: 0,
					choices: [
						{ id: 0, label: 'Disabled' },
						{ id: 1, label: 'Enabled' },
					],
				},
				{
					type: 'textinput',
					label: 'Clip (0-512)',
					id: 'clip',
					default: '0',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Gain (0-512)',
					id: 'gain',
					useVariables: true,
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Layer ID (#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},
			],
			callback: async (action, context) => {
				const key = action.options.key
				const clip = await self.parseVariablesInString(action.options.clip)
				const gain = await self.parseVariablesInString(action.options.gain)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`ILK ${key} ${clip} ${gain} ${lid}`)
			},
		},

		'ira': {
			name: 'IRA // Input Raster Adjust',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},
				{
					type: 'dropdown',
					label: 'Edge',
					id: 'edge',
					choices: [
						{ id: 'L', label: 'Left' },
						{ id: 'R', label: 'Right' },
						{ id: 'T', label: 'Top' },
						{ id: 'B', label: 'Bottom' },
					],
				},
				{
					type: 'textinput',
					label: 'Pixels (Negative=In, Positive=Out)',
					id: 'pix',
					useVariables: true,
					default: 0,
				},

			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const edge = action.options.edge
				const pix = await self.parseVariablesInString(action.options.pix)
				await sendCmd(`IRA ${lid} ${edge} ${pix}`)
			},
		},
	
		'isp': { // Not sure if this actually works??
			name: 'ISP // Input Set Properties',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},
				{
					type: 'textinput',
					label: 'Properties [Name Value]',
					id: 'prop',
					useVariables: true,
					default: 'Name Value',
				},

			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const prop = await self.parseVariablesInString(action.options.prop)
				await sendCmd(`ISP ${lid} ${prop}`)
			},
		},

		'kbd': {
			name: 'KBD // Border Adjust',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},
				{
					type: 'textinput',
					label: 'Thickness (-255 to 255)',
					id: 'thick',
					useVariables: true,
					default: 0,
				},
				{
					type: 'textinput',
					label: 'Red (0-255)',
					id: 'red',
					default: 255,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Green (0-255)',
					id: 'green',
					default: 255,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Blue (0-255)',
					id: 'blue',
					default: 255,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Horizontal Bevel Offset (0-255)',
					id: 'hbev',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Vertical Bevel Offset (0-255)',
					id: 'vbev',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Inside Softness (0-255)',
					id: 'soft',
					default: 0,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const thick = await self.parseVariablesInString(action.options.thick)
				const red = await self.parseVariablesInString(action.options.red)
				const green = await self.parseVariablesInString(action.options.green)
				const blue = await self.parseVariablesInString(action.options.blue)
				const hbev = await self.parseVariablesInString(action.options.hbev)
				const vbev = await self.parseVariablesInString(action.options.vbev)
				const soft = await self.parseVariablesInString(action.options.soft)
				await sendCmd(`KBD ${lid} ${thick} ${red} ${green} ${blue} ${hbev} ${vbev} ${soft}`)
			},
		},

		'kps': {
			name: 'KPS // Layer Position Change',
			options: [
				{
					type: 'dropdown',
					label: 'Absolute/Relative',
					id: 'pos',
					default: 1,
					choices: [
						{ id: 0, label: 'Absolute' },
						{ id: 1, label: 'Relative' },
					],
				},
				{
					type: 'textinput',
					label: 'X Pos',
					id: 'hor',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Y Pos',
					id: 'ver',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},

			],
			callback: async (action, context) => {
				const pos = action.options.pos
				const hor = await self.parseVariablesInString(action.options.hor)
				const ver = await self.parseVariablesInString(action.options.ver)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`KPS ${pos} ${hor} ${ver} ${lid}`)
			},
		},

		'ksh': {
			name: 'KSH // Shadow Adjust',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID (#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},
				{
					type: 'textinput',
					label: 'Horizontal Pos (0-255)',
					id: 'hor',
					useVariables: true,
					default: 0,
				},
				{
					type: 'textinput',
					label: 'Vertical Pos (0-255)',
					id: 'ver',
					useVariables: true,
					default: 0,
				},
				{
					type: 'textinput',
					label: 'Size (0-255)',
					id: 'size',
					useVariables: true,
					default: 0,
				},
				{
					type: 'textinput',
					label: 'Transparency (0-255)',
					id: 'trans',
					useVariables: true,
					default: 0,
				},
				{
					type: 'textinput',
					label: 'Softness (0-255)',
					id: 'soft',
					useVariables: true,
					default: 0,
				},
			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const hor = await self.parseVariablesInString(action.options.hor)
				const ver = await self.parseVariablesInString(action.options.ver)
				const size = await self.parseVariablesInString(action.options.size)
				const trans = await self.parseVariablesInString(action.options.trans)
				const soft = await self.parseVariablesInString(action.options.soft)

				await sendCmd(`KSH ${lid} ${hor} ${ver} ${size} ${trans} ${soft}`)
			},
		},

		'ksp': {
			name: 'KSP // Keyframe Set Properties', // Not sure if this actually works??
			options: [
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},
				{
					type: 'textinput',
					label: 'Property Name + Value',
					id: 'prop',
					useVariables: true,
					default: 'Name Value',
				},

			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const prop = await self.parseVariablesInString(action.options.prop)
				await sendCmd(`KSP ${lid} ${prop}`)
			},
		},

		'ksz': {
			name: 'KSZ // Layer Size Change (Keep Aspect)',
			options: [
				{
					type: 'textinput',
					label: 'Horizontal Size in Pixels',
					id: 'size',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},

			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const size = await self.parseVariablesInString(action.options.size)
				await sendCmd(`KSZ ${size} ${lid}`)
			},
		},

		'ktl': {
			name: 'KTL // Treatment Learn',
			options: [
				{
					type: 'textinput',
					label: 'Treatment ID (-1 = Next Available)',
					id: 'tid',
					useVariables: true,
					default: '-1',
				},
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},
				{
					type: 'textinput',
					label: 'Name',
					id: 'name',
				},
				{
					type: 'checkbox',
					label: 'Position',
					id: 'pos',
				},
				{
					type: 'checkbox',
					label: 'Crop',
					id: 'crop',
				},
				{
					type: 'checkbox',
					label: 'Clone',
					id: 'clone',
				},
				{
					type: 'checkbox',
					label: 'Border',
					id: 'bor',
				},
				{
					type: 'checkbox',
					label: 'Shadow',
					id: 'shad',
				},
				{
					type: 'checkbox',
					label: 'A/R',
					id: 'ar',
				},
				{
					type: 'checkbox',
					label: 'Pan/Zoom',
					id: 'pz',
				},
				{
					type: 'checkbox',
					label: 'Duration',
					id: 'dur',
				},
				{
					type: 'checkbox',
					label: 'Transparency',
					id: 'trans',
				},
				{
					type: 'checkbox',
					label: 'Size',
					id: 'size',
				},
			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const tid = await self.parseVariablesInString(action.options.tid)
				const name = await self.parseVariablesInString(action.options.name)
				let pos = ""
				let crop = ""
				let clone = ""
				let bor = ""
				let shad = ""
				let ar = ""
				let pz = ""
				let dur = ""
				let trans = ""
				let size = ""
				if (action.options.pos){pos = " 1"}
				if (action.options.crop){crop = " 1"}
				if (action.options.clone){clone = " 1"}
				if (action.options.bor){bor = " 1"}
				if (action.options.shad){shad = " 1"}
				if (action.options.ar){ar = " 1"}
				if (action.options.pz){pz = " 1"}
				if (action.options.dur){dur = " 1"}
				if (action.options.trans){trans = " 1"}
				if (action.options.size){size = " 1"}
				await sendCmd(`KTL ${tid} ${lid} ${name}${pos}${crop}${clone}${bor}${shad}${ar}${pz}${dur}${trans}${size}`)
			},
		},

		'ktp': {
			name: 'KTP // Keyframe Transparency Apply',
			options: [
				{
					type: 'textinput',
					label: 'Transparency (0-255)',
					id: 'trans',
					useVariables: true,
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2', // Check formatting of layers argument (%20 needed?)
				},

			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const trans = await self.parseVariablesInString(action.options.trans)
				await sendCmd(`KTP ${trans} ${lid}`)
			},
		},

		'ktr': {
			name: 'KTR // Treatment Recall',
			options: [
				{
					type: 'textinput',
					label: 'Treatment ID',
					id: 'tid',
					useVariables: true,
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},

			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const tid = await self.parseVariablesInString(action.options.tid)
				await sendCmd(`KTR ${tid} ${lid}`)
			},
		},

		'lac': {
			name: 'LAC // Layer Alignment Control',
			options: [
				{
					type: 'dropdown',
					label: 'Alignment [Minimum Layers]',
					id: 'eid',
					default: '1',
					choices: [
						{ id: 0, label: 'Align Bottom [2]' },
						{ id: 1, label: 'Align Center [2]' },
						{ id: 2, label: 'Align Left [2]' },
						{ id: 3, label: 'Align Middle [2]' },
						{ id: 4, label: 'Align Right [2]' },
						{ id: 5, label: 'Align Top [2]' },
						{ id: 6, label: 'Center X [1]' },
						{ id: 7, label: 'Center Y [1]' },
						{ id: 8, label: '-X Spacing [2]' },
						{ id: 9, label: '+X Spacing [2]' },
						{ id: 10, label: '=X Spacing [3]' },
						{ id: 11, label: 'Make Same Height [2]' },
						{ id: 12, label: 'Make Same Width [2]' },
						{ id: 13, label: '=Y Spacing [3]' },
						{ id: 14, label: 'Remove X Spacing [2]' },
						{ id: 15, label: 'Remove Y Spacing [2]' },
						{ id: 16, label: 'Fill Y [1]' },
						{ id: 17, label: 'Fill X [1]' },
						{ id: 18, label: 'Snap Bottom [1]' },
						{ id: 19, label: 'Snap Left [1]' },
						{ id: 20, label: 'Snap Right [1]' },
						{ id: 21, label: 'Snap Top [1]' },
						{ id: 22, label: 'Stack X [2]' },
						{ id: 23, label: 'Stack Y [2]' },
						{ id: 24, label: 'Swap Windows [2]' },
					],
				},
				{
					type: 'textinput',
					label: 'Duration',
					id: 'dur',
					useVariables: true,
					default: 60,
				},
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
					
				},
				
			],
			callback: async (action, context) => {
				const eid = action.options.eid
				const dur = await self.parseVariablesInString(action.options.dur)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`LAC ${eid} ${dur} ${lid}`)
			},
		},

'lap': {
			name: 'LAP // Layer Assign Pixelspace',
			options: [
				{
					type: 'textinput',
					label: 'Pixelspace ID',
					id: 'pid',
					default: 0,
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Hide/Visible',
					id: 'vis',
					default: '0',
					choices: [
						{ id: '0', label: 'Hide Layers' },
						{ id: '1', label: 'Make Layers Visible' },

					],
				},
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},

			],
			callback: async (action, context) => {
				const pid = await self.parseVariablesInString(action.options.pid)
				const vis = action.options.vis
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`LAP ${pid} ${vis} ${lid}`)
			},
		},

'lcc': {
			name: 'LCC // Layer Clone Control',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'Offset' },
						{ id: '2', label: 'Mirror' },

					],
				},
				{
					type: 'textinput',
					label: 'Offset',
					id: 'ofs',
					useVariables: true,
				},
				
				{
					type: 'dropdown',
					label: 'Offset Type',
					id: 'ofstype',
					choices: [
						{ id: '', label: 'None' },
						{ id: '0', label: 'Absolute' },
						{ id: '1', label: 'Relative' },


					],
				},


			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				const mode = action.options.mode
				const ofs = await self.parseVariablesInString(action.options.ofs)
				const ofstype = action.options.ofstype
				await sendCmd(`LCC ${lid} ${mode} ${ofs} ${ofstype}`)
			},
		},

'lck': {
			name: 'LCK // Learn Command Key',
			options: [
				{
					type: 'dropdown',
					label: 'Learn As',
					id: 'as',
					default: '0',
					choices: [
						{ id: '0', label: 'Absolute' },
						{ id: '1', label: 'Relative' },
					],
				},
				{
					type: 'textinput',
					label: 'Name',
					id: 'name',
					useVariables: true,
					default: 'Companion',
				},
				{
					type: 'textinput',
					label: 'Register ID (CK Slot)',
					id: 'rid',
					useVariables: true,
					default: 1,
				},
				{
					type: 'dropdown',
					label: 'Learn From',
					id: 'from',
					default: '2',
					choices: [
						{ id: '1', label: 'PVW Only' },
						{ id: '2', label: 'PGM Only' },
						{ id: '3', label: 'Both' },
					],
				},
				{
					type: 'dropdown',
					label: 'Learn as Mixer?',
					id: 'mix',
					choices: [
						{ id: '0', label: 'No' },
						{ id: '1', label: 'Yes' },
					],
				},
			],
			callback: async (action, context) => {
				const as = action.options.as
				const name = await self.parseVariablesInString(action.options.name)
				const rid = await self.parseVariablesInString(action.options.rid) 
				const from = action.options.from
				const mix = action.options.mix
				await sendCmd(`LCK ${as} ${name} ${rid} ${from} ${mix}`)
			},
		},
		'lso': {
			name: 'LSO // Load Still on Output',
			options: [
				{
					type: 'textinput',
					label: 'File Name',
					id: 'name',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					default: 0,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const name = await self.parseVariablesInString(action.options.name)
				const out = await self.parseVariablesInString(action.options.out)
				await sendCmd(`LSO ${name} ${out}`)
			},
		},
		'lsp': {
			name: 'LSP // Layer Size + Position Change',
			options: [
				{
					type: 'dropdown',
					label: 'Absolute/Relative',
					id: 'pos',
					default: 1,
					choices: [
						{ id: 0, label: 'Absolute' },
						{ id: 1, label: 'Relative' },
					],
				},
				{
					type: 'textinput',
					label: 'X Pos',
					id: 'hor',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Y Pos',
					id: 'ver',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Size (X)',
					id: 'size',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},

			],
			callback: async (action, context) => {
				const pos = action.options.pos
				const hor = await self.parseVariablesInString(action.options.hor)
				const ver = await self.parseVariablesInString(action.options.ver)
				const size = await self.parseVariablesInString(action.options.size)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`LSP ${pos} ${hor} ${ver} ${size} ${lid}`)
			},
		},

		'mvac': {
			name: 'MVAC // MultiViewer Assign Content (Input)',
			options: [
				{
					type: 'textinput',
					label: 'MV Output ID(3/7/11/15)',
					id: 'out',
					default: 3,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'View ID',
					id: 'vid',
					useVariables: true,
					default: 0,
				},
				{
					type: 'textinput',
					label: 'Input ID',
					id: 'inp',
					useVariables: true,
					default: 0,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const vid = await self.parseVariablesInString(action.options.vid)
				const inp = await self.parseVariablesInString(action.options.inp)
				await sendCmd(`MVAC ${out} ${vid} ${inp}`)
			},
		},

		'mvas': {
			name: 'MVAS // MultiViewer Add View',
			options: [
				{
					type: 'textinput',
					label: 'MV Output ID(3/7/11/15)',
					id: 'out',
					default: 3,
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'View Type',
					id: 'vtyp',
					default: 0,
					choices: [
						{ id: 0, label: 'PGM' },
						{ id: 1, label: 'PVW' },
						{ id: 2, label: 'Input' },
						{ id: 3, label: 'Output' },
					],
				},
				{
					type: 'textinput',
					label: 'Content ID',
					id: 'cid',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Position X (Left)',
					id: 'posx',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Position Y (Top)',
					id: 'posy',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'X Size',
					id: 'sizex',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Y Size',
					id: 'sizey',
					default: 0,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const vtyp = action.options.vtyp
				const cid = await self.parseVariablesInString(action.options.cid)
				const posx = await self.parseVariablesInString(action.options.posx)
				const posy = await self.parseVariablesInString(action.options.posy)
				const sizex = await self.parseVariablesInString(action.options.sizex)
				const sizey = await self.parseVariablesInString(action.options.sizey)
				await sendCmd(`MVAS ${out} ${vtyp} ${cid} ${posx} ${posy} ${sizex} ${sizey}`)
			},
		},

		'mvca': {
			name: 'MVCA // MultiViewer Clear All',
			options: [
				{
					type: 'textinput',
					label: 'MV Output ID(3/7/11/15)',
					id: 'out',
					default: 3,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				await sendCmd(`MVCA ${out}`)
			},
		},

		'mvkf': {
			name: 'MVKF // MultiViewer Set Keyframe Properties',
			options: [
				{
					type: 'textinput',
					label: 'MV Output ID(3/7/11/15)',
					id: 'out',
					default: 3,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'View ID',
					id: 'vid',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Position X (Left)',
					id: 'posx',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Position Y (Top)',
					id: 'posy',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'X Size',
					id: 'sizex',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Y Size',
					id: 'sizey',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Border Thickness (0-100)',
					id: 'bor',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Border Red (0-255)',
					id: 'rbor',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Border Green (0-255)',
					id: 'gbor',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Border Blue (0-255)',
					id: 'bbor',
					default: 0,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const vid = await self.parseVariablesInString(action.options.vid)
				const posx = await self.parseVariablesInString(action.options.posx)
				const posy = await self.parseVariablesInString(action.options.posy)
				const sizex = await self.parseVariablesInString(action.options.sizex)
				const sizey = await self.parseVariablesInString(action.options.sizey)
				const bor = await self.parseVariablesInString(action.options.bor)
				const rbor = await self.parseVariablesInString(action.options.rbor)
				const gbor = await self.parseVariablesInString(action.options.gbor)
				const bbor = await self.parseVariablesInString(action.options.bbor)
				await sendCmd(`MVKF ${out} ${vid} ${posx} ${posy} ${sizex} ${sizey} ${bor} ${rbor} ${gbor} ${bbor}`)
			},
		},

		'mvpl': {
			name: 'MVPL // MultiViewer Preset Learn',
			options: [
				{
					type: 'textinput',
					label: 'MV Output ID(3/7/11/15)',
					id: 'out',
					default: 3,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Preset Name',
					id: 'name',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const name = await self.parseVariablesInString(action.options.name)
				await sendCmd(`MVPL ${out} ${name}`)
			},
		},

		'mvpr': {
			name: 'MVPR // MultiViewer Preset Recall',
			options: [
				{
					type: 'textinput',
					label: 'MV Output ID(3/7/11/15)',
					id: 'out',
					default: 3,
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Type',
					id: 'type',
					default: 0,
					choices: [
						{ id: 0, label: 'OpMon' },
						{ id: 1, label: 'SourceMon' },
						{ id: 2, label: 'Custom' },
					],
				},
				{
					type: 'textinput',
					label: 'Preset Name',
					id: 'name',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const type = action.options.type
				const name = await self.parseVariablesInString(action.options.name)
				await sendCmd(`MVPR ${out} ${type} ${name}`)
			},
		},

		'ocb': {
			name: 'OCB // Output Config Blending',
			options: [
				
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					default: 0,
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Edge',
					id: 'edge',
					default: 'L',
					choices: [
						{ id: 'L', label: 'Left' },
						{ id: 'R', label: 'Right' },
					],
				},
				{
					type: 'dropdown',
					label: 'Enabled?',
					id: 'ena',
					default: '0',
					choices: [
						{ id: '0', label: 'Disabled' },
						{ id: '1', label: 'Enabled' },
					],
				},
				{
					type: 'textinput',
					label: 'Blend Width (Pixels)',
					id: 'width',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 'Bezier',
					choices: [
						{ id: 'Bezier', label: 'Bezier' },
						{ id: 'Gamma', label: 'Gamma' },
						{ id: 'Velocity', label: 'Velocity' },
					],
				},
				{
					type: 'textinput',
					label: 'Curve Parameter 1 (0.000-1.000)',
					id: 'curv1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Curve Parameter 2 (0.000-1.000)',
					id: 'curv2',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const edge = action.options.edge
				const ena = action.options.ena
				const width = await self.parseVariablesInString(action.options.width)
				const mode = action.options.mode
				const curv1 = await self.parseVariablesInString(action.options.curv1)
				const curv2 = await self.parseVariablesInString(action.options.curv2)
				await sendCmd(`OCB ${out} ${edge} ${ena} ${width} ${mode} ${curv1} ${curv2}`)
			},
		},

		'ocf': {
			name: 'OCF // Output Config Format',
			options: [
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'H Active Resolution',
					id: 'hact',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'V Active Resolution',
					id: 'vact',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Refresh Rate',
					id: 'rate',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Interlaced?',
					id: 'int',
					default: 0,
					choices: [
						{ id: '0', label: 'Progressive' },
						{ id: '1', label: 'Interlaced' },
					],
				},
				{
					type: 'dropdown',
					label: 'Reduced Blanking Timing (Optional)',
					id: 'rbt',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'Reduced Level 1' },
						{ id: '2', label: 'Reduced Level 2' },
					],
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const hact = await self.parseVariablesInString(action.options.hact)
				const vact = await self.parseVariablesInString(action.options.vact)
				const rate = await self.parseVariablesInString(action.options.rate)
				const int = action.options.int
				const rbt = action.options.rbt
				await sendCmd(`OCF ${out} ${hact} ${vact} ${rate} ${int} ${rbt}`)
			},
		},

		'ocmn': {
			name: 'OCM // Output Config Mode: Normal',
			options: [
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'X Position',
					id: 'hstart',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Y Position',
					id: 'vstart',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const hstart = await self.parseVariablesInString(action.options.hstart)
				const vstart = await self.parseVariablesInString(action.options.vstart)
				await sendCmd(`OCM ${out} Normal ${hstart} ${vstart}`)
			},
		},

		'ocmmv': {
			name: 'OCM // Output Config Mode: MultiViewer',
			options: [
				{
					type: 'textinput',
					label: 'Output ID (3/7/11/15)',
					id: 'out',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Preset Name (Optional)',
					id: 'pre',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const pre = await self.parseVariablesInString(action.options.pre)
				if (pre) {await sendCmd(`OCM ${out} Multiviewer ${pre}`)}
				else {await sendCmd(`OCM ${out} Multiviewer`)}
			},
		},

		'ocms': {
			name: 'OCM // Output Config Mode: Scaled',
			options: [
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'PixelSpace ID',
					id: 'pid',
					default: 100,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const pid = await self.parseVariablesInString(action.options.pid)
				await sendCmd(`OCM ${out} Scaled ${pid}`)
			},
		},

		'ocma': {
			name: 'OCM // Output Config Mode: Aux',
			options: [
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Source Name',
					useVariables: true,
					id: 'src',
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const src = await self.parseVariablesInString(action.options.src)
				await sendCmd(`OCM ${out} Aux ${src}`)
			},
		},

		'ocs': {
			name: 'OCS // Output Config Save',
			options: [
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					default: 0,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				await sendCmd(`OCS ${out}`)
			},
		},

		'ocu': {
			name: 'OCU // Output Config Undo/Cancel',
			options: [
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					default: 0,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				await sendCmd(`OCU ${out}`)
			},
		},

		'ofz': {
			name: 'OFZ // Output Freeze',
			options: [
				{
					type: 'dropdown',
					label: 'Freeze On/Off',
					id: 'frzonoff',
					default: '1',
					choices: [
						{ id: 1, label: 'Freeze On' },
						{ id: 0, label: 'Freeze Off' },
					],
				},
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					default: 0,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const onoff = action.options.frzonoff
				const out = await self.parseVariablesInString(action.options.out)
				await sendCmd(`OFZ ${onoff} ${out}`)
			},
		},

		'osp': {
			name: 'OSP // Output Set Properties', // Not sure if this actually works??
			options: [
				{
					type: 'textinput',
					label: 'Output ID',
					id: 'out',
					useVariables: true,
					default: '0',
				},
				{
					type: 'textinput',
					label: 'Property Name + Value',
					id: 'prop',
					default: 'Name Value',
					useVariables: true,
				},

			],
			callback: async (action, context) => {
				const out = await self.parseVariablesInString(action.options.out)
				const prop = await self.parseVariablesInString(action.options.prop)
				await sendCmd(`OSP ${out} ${prop}`)
			},
		},

		'rcr': {
			name: 'RCR // Router Crosspoint Recall',
			options: [
				{
					type: 'textinput',
					label: 'Router ID',
					id: 'rid',
					default: '0',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Switch Type',
					id: 'swty',
					default: 'L',
					choices: [
						{ id: 'L', label: 'Logical Output (Default)' },
						{ id: 'P', label: 'Physical Output' },
					],
				},
				{
					type: 'textinput',
					label: 'Output',
					id: 'out',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Input',
					id: 'inp',
					useVariables: true,
				},

			],
			callback: async (action, context) => {
				const rid = await self.parseVariablesInString(action.options.rid)
				const swty = action.options.swty
				const out = await self.parseVariablesInString(action.options.out)
				const inp = await self.parseVariablesInString(action.options.inp)
				await sendCmd(`RCR ${rid} ${swty} ${out} ${inp}`)
			},
		},

		'rsc': {
			name: 'RSC // Recall Script Cue (Command Key)',
			options: [
				{
					type: 'textinput',
					label: 'ID',
					id: 'sid',
					default: 0,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Script Cue (0=PVW, 1=PGM)',
					id: 'cid',
					default: 1,
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Script ID / Register ID?',
					id: 'opt',
					default: '1',
					choices: [
						{ id: 'S', label: 'Script ID' },
						{ id: 'R', label: 'Register ID' },
					],
				},
			],
			callback: async (action, context) => {
				const sid = await self.parseVariablesInString(action.options.sid)
				const cid = await self.parseVariablesInString(action.options.cid)
				const opt = action.options.opt
				await sendCmd(`RSC ${sid} ${cid} ${opt}`)
			},
		},

		'sav': {
			name: 'SAV // Force Server Save',
			options: [
			],
			callback: async (action, context) => {
				await sendCmd(`SAV`)
			},
		},

		'scl': {
			name: 'SCL // Clear Still on Layer',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},	
			],
			callback: async (action, context) => {
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`SCL ${lid}`)
			},
		},

		'sdn': {
			name: 'SDN // Shut Down / Restart Spyder',
			options: [
				{
					type: 'dropdown',
					label: 'Shut Down / Restart?',
					id: 'opt',
					default: '1',
					choices: [
						{ id: 0, label: 'Shut Down' }, // This doesn't seem to work?
						{ id: 1, label: 'Restart' },
					],
				},
			],
			callback: async (action, context) => {
				const opt = action.options.opt
				await sendCmd(`SDN ${opt}`)
			},
		},

		'sld': {
			name: 'SLD // Load Still on Layer',
			options: [
				{
					type: 'textinput',
					label: 'File Name',
					id: 'file',
					useVariables: true,
				},	
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},	
			],
			callback: async (action, context) => {
				const file = await self.parseVariablesInString(action.options.file)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`SLD ${file} ${lid}`)
			},
		},

		'srs': {
			name: 'SRS // Stop Running Scripts',
			options: [
				{
					type: 'dropdown',
					label: 'Operation Type',
					id: 'opt',
					default: '1',
					choices: [
						{ id: 'D', label: 'Disconnect Layers from Scripts' },
						{ id: 'S', label: 'Cancel Pending Cue Triggers' },
					],
				},
			],
			callback: async (action, context) => {
				const opt = action.options.opt
				await sendCmd(`SRS ${opt}`)
			},
		},

		'sra': {
			name: 'SRA // Source Apply (Layer)',
			options: [
				{
					type: 'textinput',
					label: 'Source Name',
					useVariables: true,
					id: 'src',
				},	
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},	
			],
			callback: async (action, context) => {
				const src = await self.parseVariablesInString(action.options.src)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`SRA ${src} ${lid}`)
			},
		},

		'swa': {
			name: 'SWA // Swap Layers',
			options: [
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid1',
					useVariables: true,
					default: '2'
				},	
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid2',
					useVariables: true,
					default: '3'
				},
			],
			callback: async (action, context) => {
				const lid1 = await self.parseVariablesInString(action.options.lid1)
				const lid2 = await self.parseVariablesInString(action.options.lid2)
				await sendCmd(`SWA ${lid1} ${lid2}`)
			},
		},

		'tpc': {
			name: 'TPC // Test Pattern Clear',
			options: [
				{
					type: 'dropdown',
					label: 'Target',
					id: 'tar',
					default: '1',
					choices: [
						{ id: 0, label: 'PixelSpace' },
						{ id: 1, label: 'Layer' },
						{ id: 2, label: 'Output' },
					],
				},
				{
					type: 'textinput',
					label: 'Target ID',
					id: 'id',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const tar = action.options.tar
				const id = await self.parseVariablesInString(action.options.id)
				await sendCmd(`TPC ${tar} ${id}`)
			},
		},

		'tpl': {
			name: 'TPL // Test Pattern Load',
			options: [
				{
					type: 'dropdown',
					label: 'Target',
					id: 'tar',
					default: '1',
					choices: [
						{ id: 0, label: 'PixelSpace' },
						{ id: 1, label: 'Layer' },
						{ id: 2, label: 'Output' },
					],
				},
				{
					type: 'textinput',
					label: 'Target ID',
					id: 'id',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Pattern',
					id: 'pat',
					default: 1,
					choices: [
						{ id: 0, label: 'Color Bars Gray' },
						{ id: 1, label: 'Color Bars Horizontal' },
						{ id: 2, label: 'Color Bars Pluge' },
						{ id: 3, label: 'Single Color' },
						{ id: 4, label: 'Color Ramp 8Bit' },
						{ id: 5, label: 'RGB Color Gradeint 8Bit' },
						{ id: 6, label: 'Grid 32' },
						{ id: 7, label: 'Grid 64' },
						{ id: 8, label: 'Grid 128' },
						{ id: 9, label: 'Gray Gamma' },
						{ id: 10, label: 'Gray Top to Bottom 16 Steps' },
						{ id: 11, label: 'Gray Bottom to Top 16 Steps' },
						{ id: 12, label: 'Gray Top to Bottom 32 Steps' },
						{ id: 13, label: 'Gray Bottom to Top 32 Steps' },
						{ id: 14, label: 'Gray Split 16 Steps' },
						{ id: 15, label: 'Gray Split 32 Steps' },
						{ id: 16, label: 'Grill H' },
						{ id: 17, label: 'Grill V' },
						{ id: 18, label: 'Sweep Left to Right' },
						{ id: 19, label: 'Sweep Right to Left' },
						{ id: 20, label: 'Sweep Top to Bottom' },
						{ id: 21, label: 'Sweep Bottom to Top' },
					],
				},
				{
					type: 'dropdown',
					label: 'Outline',
					id: 'oln',
					default: 0,
					choices: [
						{ id: 0, label: 'Disabled' },
						{ id: 1, label: 'Enabled' },
					],
				},
				{
					type: 'dropdown',
					label: 'Center Circle',
					id: 'cir',
					default: 0,
					choices: [
						{ id: 0, label: 'Disabled' },
						{ id: 1, label: 'Enabled' },
					],
				},
				{
					type: 'dropdown',
					label: 'Center X',
					id: 'ctx',
					default: 0,
					choices: [
						{ id: 0, label: 'Disabled' },
						{ id: 1, label: 'Enabled' },
					],
				},
				{
					type: 'dropdown',
					label: 'Grid',
					id: 'grd',
					default: 0,
					choices: [
						{ id: 0, label: 'Disabled' },
						{ id: 1, label: 'Enabled' },
					],
				},
				{
					type: 'textinput',
					label: 'Background R (0-255)',
					id: 'br',
					default: 255,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Background G (0-255)',
					id: 'bg',
					default: 255,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Background B (0-255)',
					id: 'bb',
					default: 255,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Foreground R (0-255)',
					id: 'fr',
					default: 255,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Foreground G (0-255)',
					id: 'fg',
					default: 255,
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Foreground B (0-255)',
					id: 'fb',
					default: 255,
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const tar = action.options.tar
				const id = await self.parseVariablesInString(action.options.id)
				const pat = action.options.pat
				const oln = action.options.oln
				const cir = action.options.cir
				const ctx = action.options.ctx
				const grd = action.options.grd
				const br = await self.parseVariablesInString(action.options.br)
				const bg = await self.parseVariablesInString(action.options.bg)
				const bb = await self.parseVariablesInString(action.options.bb)
				const fr = await self.parseVariablesInString(action.options.fr)
				const fg = await self.parseVariablesInString(action.options.fg)
				const fb = await self.parseVariablesInString(action.options.fb)
				await sendCmd(`TPL ${tar} ${id} ${pat} ${oln} ${cir} ${ctx} ${grd} ${br} ${bg} ${bb} ${fr} ${fg} ${fb}`)
			},
		},

		'trn': {
			name: 'TRN // Transition Layers',
			options: [
				{
					type: 'dropdown',
					label: 'Mix On/Off',
					id: 'mix',
					default: 1,
					choices: [
						{ id: 1, label: 'Mix On' },
						{ id: 0, label: 'Mix Off' },
					],
				},
				{
					type: 'textinput',
					label: 'duration',
					id: 'dur',
					useVariables: true,
					default: 60,
				},
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2 3 4 5 6',
				},	
			],
			callback: async (action, context) => {
				const mix = action.options.mix
				const dur = await self.parseVariablesInString(action.options.dur)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`TRN ${mix} ${dur} ${lid}`)
			},
		},

		'ZPA': {
			name: 'ZPA // Zoom/Pan Adjust',
			options: [
				{
					type: 'dropdown',
					label: 'Recall Mode',
					id: 'rec',
					default: 1,
					choices: [
						{ id: 0, label: 'Absolute Values' },
						{ id: 2, label: 'Relative Adjustment' },
					],
				},
				{
					type: 'textinput',
					label: 'Zoom (0-20)',
					id: 'zoom',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'X Pan (-2048 to 2048)',
					id: 'xpan',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Y Pan (-2048 to 2048)',
					id: 'ypan',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Layer ID (Layer#+1)',
					id: 'lid',
					useVariables: true,
					default: '2',
				},	
			],
			callback: async (action, context) => {
				const rec = await self.parseVariablesInString(action.options.rec)
				const zoom = await self.parseVariablesInString(action.options.zoom)
				const xpan = await self.parseVariablesInString(action.options.xpan)
				const ypan = await self.parseVariablesInString(action.options.ypan)
				const lid = await self.parseVariablesInString(action.options.lid)
				await sendCmd(`ZPA ${rec} ${zoom} ${xpan} ${ypan} ${lid}`)
			},
		},

	}
}
