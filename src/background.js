'use strict'

import {app, protocol, Tray, Menu, nativeImage, BrowserWindow} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer'

const path = require('path')
const os = require('os')
const localConfig = require('electron-localstorage')
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
	{scheme: 'app', privileges: {secure: true, standard: true}}
])
let win
localConfig.setStoragePath(path.join(os.homedir(), './.genshinHelper.json'))

async function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		width: 1075,
		height: 750,
		webPreferences: {

			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
			preload: path.join(__dirname, 'preload.js')
		}
	})

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
		if (!process.env.IS_TEST) win.webContents.openDevTools()
	} else {
		createProtocol('app')
		// Load the index.html when not in development
		win.loadURL('app://./index.html')
	}
	win.on('close', (e) => {
		if (localConfig.getItem('hide') === 'true') {
			e.preventDefault()
			win.hide()
		}
	})
	// win.webContents.on('did-finish-load', () => {
	// 	win.show()
	// 	loadWin.close()
	// 	console.log('finish')
	// })
}

// async function createLoadWin() {
// 	loadWin = new BrowserWindow({
// 		center: true,
// 		parent: win,
// 		show: true,
// 		width: 400,
// 		height: 230,
// 		autoHideMenuBar: true,
// 		frame: false,
// 		icon: 'logo.png'
// 	})
// 	loadWin.loadURL('app://./assets/loading.html')
// 	loadWin.on('close', () => {
// 		loadWin.destroy()
// 		loadWin = null
// 	})
// }

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (tray)
		tray.destroy()
	app.quit()
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
let tray
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS3_DEVTOOLS)
		} catch (e) {
			console.error('Vue Devtools failed to install:', e.toString())
		}
	}
	if (localConfig.getItem('hide') === 'true') {
		const icon = nativeImage.createFromPath(path.join(__static, './32x32.png'))
		tray = new Tray(icon);
		const contextMenu = Menu.buildFromTemplate([
			{
				label: '显示/隐藏',
				click: () => {
					BrowserWindow.getAllWindows().forEach(i => {
						if (i.isVisible()) {
							i.hide()
						} else {
							i.show()
						}
					})
				}
			},
			{
				label: '退出',
				click: () => {
					BrowserWindow.getAllWindows().forEach(i => {
						i.close()
						i.destroy()
						i = null
					})
					app.quit()
				}
			}
		])

		tray.setContextMenu(contextMenu)
		tray.setToolTip('GenshinHelper')
		tray.on('click', () => {
			BrowserWindow.getAllWindows().forEach(i => {
				if (i.isVisible())
					i.hide()
				else
					i.show()
			})
		})
		tray.setTitle('This is my title')
	}
	createWindow()
})

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
	app.quit()
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		// Someone tried to run a second instance, we should focus our window.
		if (win) {
			if (win.isMinimized()) win.restore()
			win.focus()
		}
	})
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit()
			}
		})
	} else {
		process.on('SIGTERM', () => {
			app.quit()
		})
	}
}
