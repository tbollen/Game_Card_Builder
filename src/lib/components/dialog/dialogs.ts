import { dialogService as ds } from './dialogService';

class Dialog {
	static confirm(message?: string): Promise<boolean> {
		const _msg: string = message || 'Are you sure?';
		const options = [
			{ name: 'Yes', response: true },
			{ name: 'No', response: false }
		];
		return new Promise(async (resolve) => {
			try {
				const response = await ds.open(_msg, options);
				resolve(response === true); // Resolve with true if 'Yes' is clicked
			} catch {
				resolve(false); // Resolve with false if dialog is dismissed or an error occurs
			}
		});
	}

	// Other dialog methods can be added here
}

export default Dialog;
