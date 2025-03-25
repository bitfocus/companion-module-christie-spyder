import { combineRgb, Regex } from '@companion-module/base'

export function GetFeedbackDefinitions(self) {

	return {
		// Button Feedback not supported with v2.4.0 overhaul of this module. To be re-built in later version releases.
		//
		//inp_ok: {
		//	type: 'boolean',
		//	name: 'Script Active',
		//	description: 'Change button state when Script is Active',
		//	defaultStyle: {
		//		bgcolor: combineRgb(128, 0, 0),
		//		color: 16777215,
		//	},
		//	options: [
		//		{
		//			type: 'dropdown',
		//			label: 'ID Type being recalled',
		//			id: 'type',
		//			default: 'S',
		//			choices: [
		//				{ id: 'S', label: 'ScriptID (default)' },
		//				{ id: 'R', label: 'RegisterID' },
		//			],
		//		},
		//		{
		//			type: 'textinput',
		//			label: 'Script ID/Register ID',
		//			id: 'sidx',
		//			default: 1,
		//			regex: Regex.NUMBER,
		//		},
		//	],
		//	callback: (fb) => {
		//		let id = fb.options.sidx
		//		const reg = fb.options.type == 'R' ? self.reg[id-1] : self.reg[self.script2reg[id]]
		//		return reg?.active
		//	},
		//},
	}
}
