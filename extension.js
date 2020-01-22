const vscode = require('vscode');
const open = require('open');

/** @param {vscode.ExtensionContext} context */
function activate(context) {
	let disposable = vscode.commands.registerCommand('extension.openInBrowser', function () {
		if (!vscode.window.activeTextEditor) {
			vscode.window.showErrorMessage('Open a document before using this command');
			return;
		}
		if (vscode.window.activeTextEditor.document.isUntitled) {
			vscode.window.showErrorMessage('Document must be saved before Open in browser');
			return;
		}
		if (vscode.window.activeTextEditor.document.fileName.split('.').pop() !== 'html') {
			vscode.window.showErrorMessage('Document must be an HTML file');
			return;
		}

		// File paths
		const absoluteFilePath = vscode.window.activeTextEditor.document.fileName;
		const relativeFilePath = vscode.workspace.asRelativePath(absoluteFilePath);

		// Settings
		const configuration = vscode.workspace.getConfiguration();
		const config = {
			relativeBase: configuration.get('open-in-browser.relativeBase'),
			cutFolders: parseInt(configuration.get('open-in-browser.relativeBaseCutFolders')) || 0
		};

		let url = '';

		if (!config.relativeBase) {
			url = absoluteFilePath;
		} else {
			url = config.relativeBase + '/';

			const relativeFilePathArray = relativeFilePath.split('/');
			if (config.cutFolders && config.cutFolders < relativeFilePathArray.length) {
				const cuttedRelativeFilePath = relativeFilePathArray.splice(config.cutFolders).join('/');
				url += cuttedRelativeFilePath;
			} else {
				url += relativeFilePath;
			}
		}

		open(url);
	});

	context.subscriptions.push(disposable);
}


function deactivate() {}


module.exports = {
	activate,
	deactivate
};
