const vscode = require('vscode');
const path = require('path');
const vbspretty = require('./src/vbspretty');

const supportedLanguages = ['vb', 'vba', 'vbs'];
const breakLineCharValue = '\n';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const formatFunction = vscode.languages.registerDocumentFormattingEditProvider(supportedLanguages, {
        provideDocumentFormattingEdits: (document, options) => {
            return getFormattingEdits(document, options);
        }
    });

    context.subscriptions.push(formatFunction);
}

/**
 * @param {vscode.TextDocument} document
 * @param {vscode.FormattingOptions} formatOptions
 * @returns {vscode.TextEdit[]}
 */
function getFormattingEdits(document, formatOptions) {
    const documentText = document.getText();
    const fileExtension = getFileExtension(document.fileName);
    const contributions = vscode.workspace.getConfiguration('vbsFormatter');
    const levelValue = contributions.get('level');
    const breakOnSeparatorValue = contributions.get('breakOnSeparator');
    const removeCommentsValue = contributions.get('removeComments');

    // Skip the module/class header (Attribute lines) in VBA files
    const startLine = Math.min(
        getStartLine(documentText, fileExtension),
        document.lineCount - 1
    );
    const start = new vscode.Position(startLine, 0);
    const end = document.lineAt(document.lineCount - 1).range.end;
    const range = new vscode.Range(start, end);
    const sourceFile = document.getText(range);
    const indentChar = getIndentChar(formatOptions);

    const formatted = vbspretty({
        level: levelValue,
        indentChar,
        breakLineChar: breakLineCharValue,
        breakOnSeparator: breakOnSeparatorValue,
        removeComments: removeCommentsValue,
        source: sourceFile,
    });

    if (typeof formatted !== 'string') {
        return [];
    }

    return [vscode.TextEdit.replace(range, formatted)];
}

function getIndentChar(formatOptions) {
    if (!formatOptions.insertSpaces) {
        return '\t';
    }

    return ' '.repeat(formatOptions.tabSize);
}

function getStartLine(text, fileExtension) {
    if (fileExtension === '.cls') {
        return findLineNumber(text, 'Attribute VB_Exposed');
    }
    if (fileExtension === '.bas') {
        return findLineNumber(text, 'Attribute VB_Name');
    }
    return 0;
}

function findLineNumber(text, searchText) {
    const lines = text.split('\n');
    return lines.findIndex(line => line.includes(searchText)) + 1;
}

function getFileExtension(fileName) {
    return path.extname(fileName).toLowerCase();
}

module.exports = {
    activate
}
