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
                const key = config.key;
                const text = document.getText();
                const updatedText = text.split('\n').map(line => {
                    const index = line.indexOf(key);
                    if (index !== -1) {
                        return line.substring(0, index + key.length) + '*'.repeat(line.length - index - key.length);
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
                const key = config.key;
                const text = document.getText();
                const updatedText = text.split('\n').map(line => {
                    const index = line.indexOf(key);
                    if (index !== -1) {
                        return line.substring(0, index + key.length) + '*'.repeat(line.length - index - key.length);
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




// import * as vscode from 'vscode';

// export function activate(context: vscode.ExtensionContext) {
//     let disposable = vscode.commands.registerCommand('extension.maskSensitiveInfo', () => {
//         const editor = vscode.window.activeTextEditor;
//         if (editor) {
//             const document = editor.document;
//             const text = document.getText();
//             let sensitiveWords = ["key", "pass"]; // 初期の指定文字列

//             // JSONファイルから指定文字列を読み込む
//             // ここでは、"sensitiveWords.json"というファイル名を仮定しています
//             const fs = require('fs');
//             if (fs.existsSync('sensitiveWords.json')) {
//                 let rawdata = fs.readFileSync('sensitiveWords.json');
//                 sensitiveWords = JSON.parse(rawdata);
//             }

//             sensitiveWords.forEach(word => {
//                 const regex = new RegExp(`(${word})(.*)`, 'g');
//                 const maskedText = text.replace(regex, (match, p1, p2) => {
//                     return p1 + p2.replace(/\S/g, '*');
//                 });

//                 fs.writeFileSync('maskedText.txt', maskedText);
//             });

//             vscode.window.showInformationMessage('Sensitive information has been masked!');
//         }
//     });

//     context.subscriptions.push(disposable);
// }

// export function deactivate() {}