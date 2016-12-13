var roleHarvester = {
    sourceCount: 2,
    lastSource: 1,
    nextSource: function() {
        this.lastSource += 1;
        if (this.lastSource >= this.sourceCount) {
            this.lastSource = 0;
        }
        return this.lastSource;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            if (typeof(creep.memory.source) == undefined) { 
                var newSource = this.nextSource();
                console.log("[CREEP]:"+ creep.name + " does not have a source.  Setting source to ");
                creep.memory.source = newSource; 
            }
            var sources = creep.room.find(FIND_SOURCES);
            if (sources[creep.memory.source] == undefined) {
                console.log("[CREEP] " + creep.name + "Source is empty, switching to new source");
                creep.memory.source = this.nextSource;
            }
            if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.source]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                var energyAvail = targets[0].energyCapacity - targets[0].energy;
                var transAmount = energyAvail;
                if (transAmount > creep.carry.energy) { transAmount= creep.carry.energy; }
                if(creep.transfer(targets[0], RESOURCE_ENERGY, transAmount) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
	}
};

module.exports = roleHarvester;