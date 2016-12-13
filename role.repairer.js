var roleRepairer = {
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
	    if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	        creep.say('repairing');
	    }

	    if(creep.memory.repairing) {
	        var roomStructures = creep.room.find(FIND_STRUCTURES, {filter:function(st){
                return st.structureType == 'road' || st.my;
            }});
            
            var roomStructureIndex;
            var roomStructuresCount = roomStructures.length;
            for(roomStructureIndex = 0; roomStructureIndex < roomStructuresCount; roomStructureIndex++) {
                var roomStructure = roomStructures[roomStructureIndex];
                if(roomStructure.hits < roomStructure.hitsMax) {
                    if(creep.repair(roomStructure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(roomStructure);
                        console.log("Moving to " + roomStructure.name);
                        return;
                    } else {
                        console.log("repaired " + roomStructure.name);
                        return;
                    }
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if (typeof(creep.memory.source) == undefined) { creep.memory.source = 0; }
            if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.source]);
            }
	    }
	}
};

module.exports = roleRepairer;