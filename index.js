'use strict';

const Promise = require("bluebird");
const neeoapi = require('neeo-sdk');
const controller = require('./controller');



//----------------------------------------------------------------------------------------------------
// Start script
//----------------------------------------------------------------------------------------------------

console.log('---------------------------------------------');
console.log(' UPC Horizon adapter');
console.log('---------------------------------------------');

var horizon;

const neeoTimeout = setTimeout(() => {
	console.log('   - FAILED!');
	process.exit(1);
}, 15000);

console.log(' - Searching for NEEO Brain (max 15 sec.)');
neeoapi.discoverOneBrain().then((brain) => {
	console.log('   - FOUND! -> ', brain.name);
	clearTimeout(neeoTimeout);

	// initiate horizon object
	horizon = new controller("192.168.10.120");

	// Set the device info, used to identify it on the Brain
	const neeoDevice = neeoapi.buildDevice('UPC Horizon')
		.setManufacturer('JLF')
		.addAdditionalSearchToken('horizon')
		.setType('DVB')
		.addButtonGroup('POWER')
		.addButtonGroup('Menu and Back')
		.addButtonGroup('Controlpad')
		.addButtonGroup('Channel Zapper')
		.addButtonGroup('Numpad')
		.addButtonGroup('Transport')
		.addButtonGroup('Transport Search')
		.addButtonGroup('Record')
		.addButton({ name: 'GUIDE', label: 'TV Gids' })
		.addButton({ name: 'ONDEMAND', label: 'On Demand' })
		.addButton({ name: 'HELP', label: 'Help' })
		.addButton({ name: 'INFO', label: 'Informatie' })
		.addButton({ name: 'TEXT', label: 'Teletekst' })
		.addButtonHander((btn) => { horizon.onButtonPressed(btn); });

	console.log(' - Starting "UPC Horizon" driver ...');
	return neeoapi.startServer({
		brain,
		port: 6336,
		name: 'upcHhorizon',
		devices: [neeoDevice]
	});
})
.then(() => {
	console.log('   - READY! use the NEEO app to search for "UPC Horizon".');
})
.catch((err) => {
	console.error('ERROR!', err);
	process.exit(1);
});

