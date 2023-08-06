import { Regex } from '@companion-module/base'

export function compileActionDefinitions(self) {
	const sendCmd = self.sendCmd

	return {
		'asc': {
			name: 'Take (Advance Script Cue)',
			options: [
				{
					type: 'dropdown',
					label: 'Cues to advance / step Back',
					id: 'cueNum',
					default: '0',
					choices: [
						{ id: '-10', label: 'Step back 10 Cues' },
						{ id: '-1', label: 'Step back 1 Cue' },
						{ id: '0', label: 'None / Take' },
						{ id: '+1', label: 'Advance 1 Cue' },
						{ id: '+10', label: 'Advance 10 Cues' },
					],
				},
			],
			callback: async (action, context) => {
				const cue = action.options.cueNum
				await sendCmd('ASC' + (0 == cue ? '' : ' ' + cue))
			},
		},

		'bpr': {
			name: 'Basic Preset Recall (Index Nr)',
			options: [
				{
					type: 'textinput',
					label: 'Preset Index',
					id: 'idx',
					default: 1,
					regex: Regex.NUMBER,
				},
				{
					type: 'textinput',
					label: 'Duration (Optional)',
					id: 'dur',
					default: 1,
					regex: Regex.NUMBER,
				},
			],
			callback: async (action, context) => {
				const idx = action.options.idx
				const dur = action.options.dur
				await sendCmd(`BPR ${idx} ${dur}`)
			},
		},

		'rsc': {
			name: 'Recall Script Cue (Script, Cue)',
			options: [
				{
					type: 'textinput',
					label: 'Script ID/Register ID',
					id: 'sidx',
					default: 1,
					regex: Regex.NUMBER,
				},
				{
					type: 'textinput',
					label: 'Script Cue',
					id: 'cidx',
					default: 1,
					regex: Regex.NUMBER,
				},
				{
					type: 'dropdown',
					label: 'ID Type being recalled',
					id: 'type',
					default: 'S',
					choices: [
						{ id: 'S', label: 'ScriptID (default)' },
						{ id: 'R', label: 'RegisterID' },
					],
				},
			],
			callback: async (action, context) => {
				const sidx = action.options.sidx
				const cidx = action.options.cidx
				const type = action.options.type
				await sendCmd(`RSC ${sidx} ${cidx} ${type}`)
			},
		},

		'trn': {
			name: 'Transition layer(s)',
			options: [
				{
					type: 'dropdown',
					label: 'Transition Mix on/off',
					id: 'mix',
					default: '1',
					choices: [
						{ id: 1, label: 'Mix On' },
						{ id: 0, label: 'Mix Off' },
					],
				},
				{
					type: 'textinput',
					label: 'duration',
					id: 'dur',
					default: 60,
					regex: Regex.NUMBER,
				},
				{
					type: 'textinput',
					name: 'Layer(s) input multiple layers space delimited',
					id: 'lay',
					default: '',
				},
			],
			callback: async (action, context) => {
				const mix = action.options.mix
				const dur = action.options.dur
				const lay = action.options.lay
				await sendCmd(`TRN ${mix} ${dur} ${lay}`)
			},
		},

		'frz': {
			label: 'Freeze Layer(s)',
			options: [
				{
					type: 'dropdown',
					label: 'Freeze Layer on/off',
					id: 'frzonoff',
					default: '1',
					choices: [
						{ id: 1, label: 'Freeze On' },
						{ id: 0, label: 'Freeze Off' },
					],
				},
				{
					type: 'textinput',
					label: 'Layer(s) input multiple layers space delimited',
					id: 'lay',
					default: 1,
				},
			],
			callback: async (action, context) => {
				const onoff = action.options.frzonoff
				const lay = action.options.lay
				await sendCmd(`FRZ ${onoff} ${lay}`)
			},
		},

		'btr': {
			name: 'Background Transition',
			options: [
				{
					type: 'textinput',
					label: 'duration',
					id: 'dur',
					default: 60,
					regex: Regex.NUMBER,
				},
			],
			callback: async (action, context) => {
				const dur = action.options.dur
				await sendCmd(`BTR ${dur}`)
			},
		},

		'fkr': {
			name: 'Function Key Recall',
			options: [
				{
					type: 'textinput',
					label: 'Funktion key ID',
					id: 'fkrid',
					default: 1,
					regex: Regex.NUMBER,
				},
				{
					type: 'textinput',
					label: 'Layer(s) input multiple layers space delimited',
					id: 'lay',
					default: 1,
				},
			],
			callback: async (action, context) => {
				const fkrid = action.options.fkrid
				const lay = action.options.lay
				await sendCmd(`FKR ${fkrid} ${lay}`)
			},
		},

		'ofz': {
			name: 'Output Freeze',
			options: [
				{
					type: 'dropdown',
					label: 'Freeze Output on/off',
					id: 'frzonoff',
					default: '1',
					choices: [
						{ id: 1, label: 'Freeze On' },
						{ id: 0, label: 'Freeze Off' },
					],
				},
				{
					type: 'textinput',
					label: 'Output(s)input multiple outputs space delimited',
					id: 'output',
					default: 1,
				},
			],
			callback: async (action, context) => {
				const onoff = action.options.frzonoff
				const output = action.options.output
				await sendCmd(`OFZ ${onoff} ${output}`)
			},
		},

		'dmt': {
			name: 'Device Mixer Transition',
			options: [
				{
					type: 'textinput',
					label: 'duration',
					id: 'dur',
					default: 60,
					regex: Regex.NUMBER,
				},
				{
					type: 'textinput',
					label: 'Device(s)',
					id: 'dev',
					default: 1,
				},
			],
			callback: async (action, context) => {
				const dur = action.options.dur
				const dev = action.options.dev
				await sendCmd(`DMT ${dur} ${dev}`)
			},
		},
	}
}
