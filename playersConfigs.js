const playersConfigs = {
	3: [1,0,0],
	4: [1,0,0,0],
	5: [1,1,0,0,0,0],
	6: [1,1,0,0,0,0,0],
	7: [1,1,1,0,0,0,0,0],
	8: [1,1,1,0,0,0,0,0,0],
	9: [1,1,1,0,0,0,0,0,0,0],
	10: [1,1,1,1,0,0,0,0,0,0,0],
};

const getMaxSaboteurs = (playersNo) => {
	return playersConfigs[playersNo].reduce((a, b) => a + b, 0);
}

module.exports = { playersConfigs, getMaxSaboteurs };