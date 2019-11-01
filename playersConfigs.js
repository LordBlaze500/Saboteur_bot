const playersConfigs = {
	5: [1,1,0,0,0,0],
};

const getMaxSaboteurs = (playersNo) => {
	if (playersNo === 5) {
		return 2;
	}
}

module.exports = { playersConfigs, getMaxSaboteurs };