const deck = [
	{ 
		id: 0, 
		type: 0, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: true, 
		outUp: false, 
		outDown: false, 
		outLeft: false, 
		outRight: false, 
		flippable: false 
	},
	{ 
		id: 1, 
		type: 1, 
		inUp: true,
		inDown: false, 
		inLeft: true, 
		inRight: true, 
		outUp: false, 
		outDown: false, 
		outLeft: false, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 2, 
		type: 2, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: false, 
		outUp: false, 
		outDown: false, 
		outLeft: false, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 3, 
		type: 12, 
		inUp: true,
		inDown: false, 
		inLeft: true, 
		inRight: false, 
		outUp: false, 
		outDown: false, 
		outLeft: false, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 4, 
		type: 3, 
		inUp: true,
		inDown: true, 
		inLeft: false, 
		inRight: false, 
		outUp: false, 
		outDown: false, 
		outLeft: false, 
		outRight: false, 
		flippable: false 
	},
	{ 
		id: 5, 
		type: 4, 
		inUp: false,
		inDown: true, 
		inLeft: false, 
		inRight: false, 
		outUp: false, 
		outDown: false, 
		outLeft: false, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 6, 
		type: 5, 
		inUp: true,
		inDown: true, 
		inLeft: false, 
		inRight: false, 
		outUp: true, 
		outDown: true, 
		outLeft: false, 
		outRight: false, 
		flippable: false 
	},
	{ 
		id: 7, 
		type: 5, 
		inUp: true,
		inDown: true, 
		inLeft: false, 
		inRight: false, 
		outUp: true, 
		outDown: true, 
		outLeft: false, 
		outRight: false, 
		flippable: false 
	},
	{ 
		id: 8, 
		type: 5, 
		inUp: true,
		inDown: true, 
		inLeft: false, 
		inRight: false, 
		outUp: true, 
		outDown: true, 
		outLeft: false, 
		outRight: false, 
		flippable: false 
	},
	{ 
		id: 9, 
		type: 5, 
		inUp: true,
		inDown: true, 
		inLeft: false, 
		inRight: false, 
		outUp: true, 
		outDown: true, 
		outLeft: false, 
		outRight: false, 
		flippable: false 
	},
	{ 
		id: 10, 
		type: 6, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: true, 
		outUp: true, 
		outDown: true, 
		outLeft: true, 
		outRight: true, 
		flippable: false 
	},
	{ 
		id: 11, 
		type: 6, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: true, 
		outUp: true, 
		outDown: true, 
		outLeft: true, 
		outRight: true, 
		flippable: false 
	},
	{ 
		id: 12, 
		type: 6, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: true, 
		outUp: true, 
		outDown: true, 
		outLeft: true, 
		outRight: true, 
		flippable: false 
	},
	{ 
		id: 13, 
		type: 6, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: true, 
		outUp: true, 
		outDown: true, 
		outLeft: true, 
		outRight: true, 
		flippable: false 
	},
	{ 
		id: 14, 
		type: 6, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: true, 
		outUp: true, 
		outDown: true, 
		outLeft: true, 
		outRight: true, 
		flippable: false 
	},
	{ 
		id: 15, 
		type: 7, 
		inUp: true,
		inDown: false, 
		inLeft: true, 
		inRight: true, 
		outUp: true, 
		outDown: false, 
		outLeft: true, 
		outRight: true, 
		flippable: true 
	},
	{ 
		id: 16, 
		type: 7, 
		inUp: true,
		inDown: false, 
		inLeft: true, 
		inRight: true, 
		outUp: true, 
		outDown: false, 
		outLeft: true, 
		outRight: true, 
		flippable: true 
	},
	{ 
		id: 17, 
		type: 7, 
		inUp: true,
		inDown: false, 
		inLeft: true, 
		inRight: true, 
		outUp: true, 
		outDown: false, 
		outLeft: true, 
		outRight: true, 
		flippable: true 
	},
	{ 
		id: 18, 
		type: 7, 
		inUp: true,
		inDown: false, 
		inLeft: true, 
		inRight: true, 
		outUp: true, 
		outDown: false, 
		outLeft: true, 
		outRight: true, 
		flippable: true 
	},
	{ 
		id: 19, 
		type: 7, 
		inUp: true,
		inDown: false, 
		inLeft: true, 
		inRight: true, 
		outUp: true, 
		outDown: false, 
		outLeft: true, 
		outRight: true, 
		flippable: true 
	},
	{ 
		id: 20, 
		type: 8, 
		inUp: false,
		inDown: false, 
		inLeft: true, 
		inRight: true, 
		outUp: false, 
		outDown: false, 
		outLeft: true, 
		outRight: true, 
		flippable: false 
	},
	{ 
		id: 21, 
		type: 8, 
		inUp: false,
		inDown: false, 
		inLeft: true, 
		inRight: true, 
		outUp: false, 
		outDown: false, 
		outLeft: true, 
		outRight: true, 
		flippable: false 
	},
	{ 
		id: 22, 
		type: 8, 
		inUp: false,
		inDown: false, 
		inLeft: true, 
		inRight: true, 
		outUp: false, 
		outDown: false, 
		outLeft: true, 
		outRight: true, 
		flippable: false 
	},
	{ 
		id: 23, 
		type: 9, 
		inUp: false,
		inDown: false, 
		inLeft: true, 
		inRight: true, 
		outUp: false, 
		outDown: false, 
		outLeft: false, 
		outRight: false, 
		flippable: false 
	},
	{ 
		id: 24, 
		type: 10, 
		inUp: false,
		inDown: false, 
		inLeft: true, 
		inRight: false, 
		outUp: false, 
		outDown: false, 
		outLeft: false, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 25, 
		type: 11, 
		inUp: true,
		inDown: false, 
		inLeft: false, 
		inRight: true, 
		outUp: true, 
		outDown: false, 
		outLeft: false, 
		outRight: true, 
		flippable: true 
	},
	{ 
		id: 26, 
		type: 11, 
		inUp: true,
		inDown: false, 
		inLeft: false, 
		inRight: true, 
		outUp: true, 
		outDown: false, 
		outLeft: false, 
		outRight: true, 
		flippable: true 
	},
	{ 
		id: 27, 
		type: 11, 
		inUp: true,
		inDown: false, 
		inLeft: false, 
		inRight: true, 
		outUp: true, 
		outDown: false, 
		outLeft: false, 
		outRight: true, 
		flippable: true 
	},
	{ 
		id: 28, 
		type: 11, 
		inUp: true,
		inDown: false, 
		inLeft: false, 
		inRight: true, 
		outUp: true, 
		outDown: false, 
		outLeft: false, 
		outRight: true, 
		flippable: true 
	},
	{ 
		id: 29, 
		type: 11, 
		inUp: true,
		inDown: false, 
		inLeft: false, 
		inRight: true, 
		outUp: true, 
		outDown: false, 
		outLeft: false, 
		outRight: true, 
		flippable: true 
	},
	{ 
		id: 30, 
		type: 13, 
		inUp: true,
		inDown: false, 
		inLeft: false, 
		inRight: true, 
		outUp: false, 
		outDown: false, 
		outLeft: false, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 31, 
		type: 14, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: false, 
		outUp: true, 
		outDown: true, 
		outLeft: true, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 32, 
		type: 14, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: false, 
		outUp: true, 
		outDown: true, 
		outLeft: true, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 33, 
		type: 14, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: false, 
		outUp: true, 
		outDown: true, 
		outLeft: true, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 34, 
		type: 14, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: false, 
		outUp: true, 
		outDown: true, 
		outLeft: true, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 35, 
		type: 14, 
		inUp: true,
		inDown: true, 
		inLeft: true, 
		inRight: false, 
		outUp: true, 
		outDown: true, 
		outLeft: true, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 36, 
		type: 15, 
		inUp: true,
		inDown: false, 
		inLeft: true, 
		inRight: false, 
		outUp: true, 
		outDown: false, 
		outLeft: true, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 37, 
		type: 15, 
		inUp: true,
		inDown: false, 
		inLeft: true, 
		inRight: false, 
		outUp: true, 
		outDown: false, 
		outLeft: true, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 38, 
		type: 15, 
		inUp: true,
		inDown: false, 
		inLeft: true, 
		inRight: false, 
		outUp: true, 
		outDown: false, 
		outLeft: true, 
		outRight: false, 
		flippable: true 
	},
	{ 
		id: 39, 
		type: 15, 
		inUp: true,
		inDown: false, 
		inLeft: true, 
		inRight: false, 
		outUp: true, 
		outDown: false, 
		outLeft: true, 
		outRight: false, 
		flippable: true 
	},
	// {
	// 	id: 40,
	// 	type: 16,
	// 	special: 'map'
	// },
	// {
	// 	id: 41,
	// 	type: 16,
	// 	special: 'map'
	// },
	// {
	// 	id: 42,
	// 	type: 16,
	// 	special: 'map'
	// },
	// {
	// 	id: 43,
	// 	type: 16,
	// 	special: 'map'
	// },
	// {
	// 	id: 44,
	// 	type: 16,
	// 	special: 'map'
	// },
	// {
	// 	id: 45,
	// 	type: 16,
	// 	special: 'map'
	// },
	{
		id: 46,
		type: 17,
		special: 'rockfall'
	},
	{
		id: 47,
		type: 17,
		special: 'rockfall'
	},
	{
		id: 48,
		type: 17,
		special: 'rockfall'
	},
	// {
	// 	id: 49,
	// 	type: 18,
	// 	special: 'break_pickaxe'
	// },
	// {
	// 	id: 50,
	// 	type: 18,
	// 	special: 'break_pickaxe'
	// },
	// {
	// 	id: 51,
	// 	type: 18,
	// 	special: 'break_pickaxe'
	// },
	// {
	// 	id: 52,
	// 	type: 19,
	// 	special: 'break_truck'
	// },
	// {
	// 	id: 53,
	// 	type: 19,
	// 	special: 'break_truck'
	// },
	// {
	// 	id: 54,
	// 	type: 19,
	// 	special: 'break_truck'
	// },
	// {
	// 	id: 55,
	// 	type: 20,
	// 	special: 'break_lamp'
	// },
	// {
	// 	id: 56,
	// 	type: 20,
	// 	special: 'break_lamp'
	// },
	// {
	// 	id: 57,
	// 	type: 20,
	// 	special: 'break_lamp'
	// },
	// {
	// 	id: 58,
	// 	type: 21,
	// 	special: 'fix_pickaxe'
	// },
	// {
	// 	id: 59,
	// 	type: 21,
	// 	special: 'fix_pickaxe'
	// },
	// {
	// 	id: 60,
	// 	type: 22,
	// 	special: 'fix_truck'
	// },
	// {
	// 	id: 61,
	// 	type: 22,
	// 	special: 'fix_truck'
	// },
	// {
	// 	id: 62,
	// 	type: 23,
	// 	special: 'fix_lamp'
	// },
	// {
	// 	id: 63,
	// 	type: 23,
	// 	special: 'fix_lamp'
	// },
	// {
	// 	id: 64,
	// 	type: 24,
	// 	special: 'fix_truck_lamp'
	// },
	// {
	// 	id: 65,
	// 	type: 25,
	// 	special: 'fix_pickaxe_truck'
	// },
	// {
	// 	id: 66,
	// 	type: 26,
	// 	special: 'fix_pickaxe_lamp'
	// },
];

module.exports = { deck };