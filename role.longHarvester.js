var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        creep.say("lh");
        var targetRoom;
        var targetSource;
        if (typeof(creep.memory.targetRoom) == 'undefined') { 
            console.log("ERROR - room missing");
            creep.memory.targetRoom = 'W76S33';
            return;
        } else {
            targetRoom = creep.memory.targetRoom;
        }
        if (typeof(creep.memory.targetSource) == 'undefined') {
            console.log("ERROR - source missing");
            creep.memory.targetSource = 'W76S33';
            return;
        } else {
            targetSource = creep.memory.targetSource;
        }

      
        if (creep.memory.state == 'harvest') { 
            if (creep.room.name == targetRoom) {
                // harvest from target room
                if(creep.carry.energy < creep.carryCapacity) {
                    var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                } else {
                    creep.memory.state = 'deliver';
                    creep.memory.deliverStart = Game.time;                    
                }
                return;                
            } else {
                // move to target room
                var exit = creep.room.findExitTo(targetRoom);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            return;
        }
        
        if (creep.memory.state == 'deliver') {     
            if (creep.room.name == creep.memory.home) {
                // harvest from target room`                
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
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
                    if (creep.ticksToLive < 1000) {
                        if (Game.spawns['Spawn1'].renewCreep(creep) == ERR_NOT_IN_RANGE) {
                             creep.moveTo(Game.spawns['Spawn1']);
                        }
                       
                    }
                    creep.moveTo(Game.spawns['Spawn1']);
                }
                if (creep.carry.energy == 0) {
                    if (creep.ticksToLive < 750) {
                        creep.memory.state = 'renew';
                    } else {
                        creep.memory.state = 'harvest';
                        creep.memory.harvestStart = Game.time;
                    }
                }
                return;                
            } else {
                // move to target room
                var exit = creep.room.findExitTo(creep.memory.home);
                //console.log(creep.moveTo(creep.pos.findClosestByRange(exit)));
                creep.moveTo(Game.spawns['Spawn1']);
            }
            return;
        }
        
        if (creep.memory.state == 'renew') {
            creep.moveTo(Game.spawns['Spawn1']);
            Game.spawns['Spawn1'].renewCreep(creep);
            creep.say("renewing");
            if (creep.ticksToLive > 1200) {
                if (creep.carry.energy == 0) {
                    creep.memory.state = 'harvest';
                    creep.memory.harvestStart = Game.time;
                } else {
                    creep.memory.state = 'deliver';
                }
            }
        }

	},
    create: function(spawner, energy) {
        var body = [];
        body.push(WORK);
        body.push(MOVE);
        body.push(CARRY);
        body.push(MOVE);
        energy -= 250;
        if (energy >= 250) {
            body.push(WORK);
            body.push(MOVE);
            body.push(CARRY);
            body.push(MOVE);
            energy -= 250;            
        }
        while (energy >= 150) {            
            body.push(CARRY);
            body.push(CARRY);
            body.push(MOVE);
            energy -= 100;            
        }; 
        return spawner.createCreep( body, undefined, {role:'longharvest', state:'harvest', home: 'W77S34' });
    }
};

module.exports = roleHarvester;