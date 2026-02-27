import { combineRgb, Regex } from '@companion-module/base'

export function GetFeedbackDefinitions(self) {

	return {
		
		inp_ok: {
			type: 'boolean',
			name: 'Script Active',
			description: 'Change button state when Script is Active',
			defaultStyle: {
				bgcolor: combineRgb(128, 0, 0),
				color: 16777215,
			},
			options: [
				{
					type: 'dropdown',
					label: 'ID Type',
					id: 'type',
					default: 'S',
					choices: [
						{ id: 'S', label: 'Script ID' },
						{ id: 'R', label: 'Register ID (CK Slot)' },
					],
				},
				{
					type: 'textinput',
					label: 'ID',
					id: 'sidx',
					default: 0,
				},
			],
			callback: (fb) => {
				let id = fb.options.sidx
				const reg = fb.options.type == 'R' ? self.reg[id-1] : self.reg[self.script2reg[id]]
				return reg?.active
			},
		},
	}
}
