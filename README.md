# VBS Formatter
Formats VBS and VBA code.

This is a fork of VBA Formatter by threatcon (Antonio Turner), which is a fork of VBSPretty by lenilsondc (Lenilson de Castro).
You can check out the original code here:
1. https://github.com/threatcon/vba-formatter
2. https://www.npmjs.com/package/vbspretty

This fork was primarily intended to allow using the indent character and size configured globally for VS Code.

## Features
Formats VBS and VBA code. It uses global indentation settings (tab or space, indent size).

## Requirements
VS Code v.1.90.0

## Extension Settings
None

## Release Notes
### 0.0.4
- minor metadata changes

### 0.0.3
- fix the known issue of broken code when a method called Next (of a custom cursor) is called

### 0.0.2
- fix activation to cover code autodetected as vba
- minor code improvements

### 0.0.1
- initial release
