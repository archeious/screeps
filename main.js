var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleDefender = require('role.defender');

var config = {
    homeRoom: 'W77S34',
    roles: {
        builder   : {role: 'build',    min:4, run: roleBuilder.run },
        defender  : {role: 'defend',   min:2, run: roleDefender.run },
        harvester : {role: 'harvest',  min:6, run: roleHarvester.run },
        repairer  : {role: 'repair',   min:2, run: roleRepairer.run },
        upgrader  : {role: 'upgrader', min:0, run: roleUpgrader.run },
    }
};

module.exports.loop = function () {
    console.log("Tick:" + Game.time + " Home Room:" + config['homeRoom']);
    
    // Tower Defense
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target != undefined) {
            tower.attack(target);
        }
    }
    
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
            creep.memory.home = config.homeRoom;
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
            case 'repair':
                roleRepairer.run(creep);
            break;

            case 'build':
                roleBuilder.run(creep);
            break;
        } 
    }
    
    var minDefenders = config.roles['defender'].min;
    var numDefenders = _.sum(Game.creeps, (c) => c.memory.role == 'defend');
    var minHarvesters = config.roles['harvester'].min;;
    var numHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvest');
    var minRepairers = config.roles['repairer'].min;;
    var numRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repair');
    var minUpgraders = config.roles['upgrader'].min;;
    var numUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'claim');
    var minBuilders = config.roles['builder'].min;;
    var numBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'build');
    
    console.log("There are currently (" + numDefenders + "/" + minDefenders + " defenders) (" 
        + numRepairers + "/" + minRepairers + " repairers) ("
        + numHarvesters + "/" + minHarvesters + " harvesters) ("
        + numUpgraders + "/" + minUpgraders + " upgraders) ("
        + numBuilders + "/" + minBuilders + " builders) ");
    
    if (numHarvesters < minHarvesters) {
        var name = Game.spawns['Spawn1'].createCreep( [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, {role:'harvest', state:'harvest', home: 'W77S34', source: roleHarvester.nextSource()});
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
        var name = Game.spawns['Spawn1'].createCreep( [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE,  MOVE], undefined, {role:'repair', state:'harvest', source: roleRepairer.nextSource(), home: 'W77S34' });
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as repairer");
        };
    }
    else if (numUpgraders < minUpgraders) {
        var name = Game.spawns['Spawn1'].createCreep( [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, {role:'claim', state:'harvest', source: roleUpgrader.nextSource(), home: 'W77S34' });
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as upgrader");
        };
    }
    else if (numBuilders < minBuilders) {
        var name = Game.spawns['Spawn1'].createCreep( [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, {role:'build', state:'harvest', source: roleBuilder.nextSource(), home: 'W77S34' });
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as builder");
        };
    }

    
    
}
