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
    toBeRepaired: [],
    rooms: ["W77S34", "W76S34", "W76S33"],
    /** @param {Creep} creep **/
    harvest: function(creep) {
        creep.say("RH");
        if (creep.memory.home != creep.room.name) {
            creep.moveTo(Game.flags['EastGate']);
            return;
        }  

        var sources = creep.room.find(FIND_SOURCES);
        if (creep.memory.source == undefined) { creep.memory.source = 0; }
        var source
        if (sources.length > 0) {
            source = sources[creep.memory.source];
            console.log(source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION &&
                        structure.energy >= 50);
                }
            });                   
            console.log("SOURCES ARE EMPTY BUT CAN PILLAGE " + targets.length + " EXTENSIOONS!")
        }
        
    },
    repair: function(creep) {
        creep.say("RR");

        var roomStructures = [];
        
        for (var i=0; i < this.rooms.length; i++) {
            var room = this.rooms[i];          
            console.log("checking rooom " + room);
            if (Game.rooms[room] != undefined) { roomStructures = Game.rooms[room].find(FIND_STRUCTURES, {filter:function(st){
                return (st.structureType == STRUCTURE_WALL || st.structureType == STRUCTURE_ROAD ||  st.my) && st.hits < 1000 && st.structureType != STRUCTURE_CONTROLLER;
            }})};
            console.log(roomStructures.length + " roads to repair");
            if (roomStructures.length > 0) { break; }
        }
                    
        var roomStructureIndex;
        var roomStructuresCount = roomStructures.length;
        if (roomStructuresCount > 0) {
            var roomStructure = roomStructures[0];
            var structId = roomStructure.id;
            console.log(roomStructure.pos.x + ":" + roomStructure.pos.y);
            if( creep.repair(roomStructure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(roomStructure);
            }
            return;
        }        
    },
    repairTarget(creep,target) {
        creep.say("RT");
        var status = creep.repair(target);
        if ( status == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    },
    run: function(creep) {
        if (creep.memory.repairing == undefined) { creep.memory.repairing = false; }
	    if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	        creep.say('repairing');
	    }
        
        if(creep.memory.repairing) {
            if (creep.memory.mark2 == true) {
                var target;
                if (creep.memory.target == undefined) {
                   target = this.toBeRepaired.pop();
                   creep.memory.target = target;
                } else {
                    target = creep.memory.target;
                }
                targetObj = Game.getObjectById(target);
                this.repairTarget(creep,targetObj);
                return;
            } else {
                this.repair(creep);
            }            
	    }
	    else {
            this.harvest(creep);
	    }
	},
    create: function(spawner, energy) {
        var body = [];
        body.push(WORK);
        body.push(MOVE);
        body.push(CARRY);
        energy -= 200;
        while (energy >= 200) {            
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
            energy -= 200;            
        }; 
        return spawner.createCreep( body, undefined, {role:'repair', state:'harvest'});
    },
    compileList: function() {
        var pending = [];   
        if (pending.length == 0) {    
            for (var i=0; i < this.rooms.length; i++) {
                var room = this.rooms[i];          
                if (Game.rooms[room] != undefined) { 
                    roomStructures = Game.rooms[room].find(FIND_STRUCTURES, {
                        filter:function(st){                            
                            return st.structureType == STRUCTURE_ROAD  && st.hits < st.hitsMax;
                        }
                    });
                };
                roomStructures.forEach(function (st) {
                    if (st.hits < st.hitsMax && st.hits < 2000) {
                        pending.push(st.id);                        
                    }
                });
                roleRepairer.toBeRepaired = pending;
                console.log(roleRepairer.toBeRepiared);
                break;
            }
        } 
    },
    repairersStatus: function() {
        console.log("[STATUS] " + this.toBeRepaired.length);
    }
};

module.exports = roleRepairer;