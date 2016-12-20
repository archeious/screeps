var roleHarvester = require('role.harvester');
var roleClaimer = require('role.claimer');
var roleLongHarvester = require('role.longHarvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleDefender = require('role.defender');

var config = {
    homeRoom: 'W77S34',
    roles: {
        builder       : {role: 'build',    min:4, run: roleBuilder.run },
        defender      : {role: 'defend',   min:1, run: roleDefender.run },
        harvester     : {role: 'harvest',  min:5, run: roleHarvester.run },
        longharvester : {role: 'longharvest',  min:3, run: roleLongHarvester.run },
        repairer      : {role: 'repair',   min:2, run: roleRepairer.run },
        upgrader      : {role: 'upgrader', min:6, run: roleUpgrader.run },
    }
};

module.exports.loop = function () {   
    // Tower Defense
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target != undefined) {
            tower.attack(target);
        }
    }
    
    roleRepairer.compileList();     
    roleRepairer.repairersStatus();
    
    
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        creep.memory.home = config.homeRoom;
        
        var poopRoads = false;
        
        if (poopRoads) {
            var ter = creep.room.lookAt(creep.pos);
            var foundRoad = false;
            ter.forEach(function(t) {
            if (t.type == 'structure' && t.structure.structureType == STRUCTURE_ROAD) {
                foundRoad = true;
            } 
            });
            if (!foundRoad) {
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
            }
        }
        
        switch (creep.memory.role) {
            case 'claim':
                roleUpgrader.run(creep);
                break;
            case 'defend':
                roleDefender.run(creep);
                break;
            case 'harvest':
                roleHarvester.run(creep);
                break;
            case 'longharvest':
                roleLongHarvester.run(creep);
                break;
            case 'repair':
                roleRepairer.run(creep);
                break;

            case 'build':
                roleBuilder.run(creep);
                break;
            case 'claimController':
                roleClaimer.run(creep);
                break;
        } 
    }
    
    var minDefenders = config.roles['defender'].min;
    var numDefenders = _.sum(Game.creeps, (c) => c.memory.role == 'defend');
    var minHarvesters = config.roles['harvester'].min;;
    var numHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvest');
    var minLongHarvesters = config.roles['longharvester'].min;;
    var numLongHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'longharvest');
    var minRepairers = config.roles['repairer'].min;;
    var numRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repair');
    var minUpgraders = config.roles['upgrader'].min;;
    var numUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'claim');
    var minBuilders = config.roles['builder'].min;;
    var numBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'build');
    
    if (Game.time % 10 == 0 ) {
        console.log("There are currently (" + numDefenders + "/" + minDefenders + " defenders) (" 
            + numRepairers + "/" + minRepairers + " repairers) ("
            + numLongHarvesters + "/" + minLongHarvesters + " long harvesters) ("
            + numHarvesters + "/" + minHarvesters + " harvesters) ("
            + numUpgraders + "/" + minUpgraders + " upgraders) ("
            + numBuilders + "/" + minBuilders + " builders) ");
    }
    
    if (numHarvesters < minHarvesters) {
        var name = Game.spawns['Spawn1'].createCreep( [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], undefined, {role:'harvest', state:'harvest', home: 'W77S34', source: roleHarvester.nextSource()});
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as harvester");
        };
    }
    else if (numDefenders < minDefenders) {
        var name = Game.spawns['Spawn1'].createCreep( [ATTACK, RANGED_ATTACK, MOVE,  MOVE], undefined, {role:'defend', state:'defend', source: roleDefender.nextSource(), home: 'W77S34' });
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as defender");
        };
    }
    else if (numRepairers < minRepairers) {
        var name = roleRepairer.create(Game.spawns['Spawn1'],1000);
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as repairer");
        };
    }
    else if (numUpgraders < minUpgraders) {
        var name = Game.spawns['Spawn1'].createCreep( [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE], undefined, {role:'claim', state:'harvest', source: roleUpgrader.nextSource(), home: 'W77S34' });
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as upgrader");
        };
    }
    else if (numBuilders < minBuilders) {
        var name = roleBuilder.create(Game.spawns['Spawn1'],1000);
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as long harvester");
        };
    }
    else if (numLongHarvesters < minLongHarvesters) {
        //var name = Game.spawns['Spawn1'].createCreep( [WORK, CARRY, MOVE, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, MOVE], undefined, {role:'longharvest', state:'harvest', source: roleBuilder.nextSource(), home: 'W77S34' });
        var name = roleLongHarvester.create(Game.spawns['Spawn1'],1000);
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as long harvester");
        };
    }

    
    
}
