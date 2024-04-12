import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.secret-masking', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const configPath = path.join(vscode.workspace.rootPath || '', 'mask-keyword.json');
            fs.readFile(configPath, 'utf8', (err, data) => {
                if (err) {
                    vscode.window.showErrorMessage('Can not read a file, mask-keyword.json');
                    return;
                }
                const config = JSON.parse(data);
                const keys = config.keys;
                const text = document.getText();
                const updatedText = text.split('\n').map(line => {
                    for (const key of keys) {
                        const index = line.indexOf(key);
                        if (index !== -1) {
                            return line.substring(0, index + key.length) + '*'.repeat(line.length - index - key.length);
                        }
                    }
                    return line;
                }).join('\n');
                editor.edit(editBuilder => {
                    const fullRange = new vscode.Range(
                        document.positionAt(0),
                        document.positionAt(text.length)
                    );
                    editBuilder.replace(fullRange, updatedText);
                });
            });
        }
    });
    context.subscriptions.push(disposable);


    let disposable2 = vscode.commands.registerCommand('extension.secret-masking-new', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const configPath = path.join(vscode.workspace.rootPath || '', 'mask-keyword.json');
            fs.readFile(configPath, 'utf8', (err, data) => {
                if (err) {
                    vscode.window.showErrorMessage('Can not read a file, mask-keyword.json');
                    return;
                }
                const config = JSON.parse(data);
                const keys = config.keys;
                const text = document.getText();
                const updatedText = text.split('\n').map(line => {
                    for (const key of keys) {
                        const index = line.indexOf(key);
                        if (index !== -1) {
                            return line.substring(0, index + key.length) + '*'.repeat(line.length - index - key.length);
                        }
                    }
                    return line;
                }).join('\n');
                
                const maskedFilePath = document.fileName + '.mask';
                fs.writeFile(maskedFilePath, updatedText, 'utf8', (err) => {
                    if (err) {
                        vscode.window.showErrorMessage('マスクされたファイルを書き込むことができませんでした');
                        return;
                    }
                    vscode.window.showInformationMessage('マスクされたファイルが正常に作成されました');
                });
            });
        }
    });
    context.subscriptions.push(disposable2);

}

export function deactivate() {}