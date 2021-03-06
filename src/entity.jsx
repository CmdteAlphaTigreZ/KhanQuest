var SpriteLoader = require('./sprites/sprite-loader.jsx');

/**
 * An Entity is the instantiation of a monster. It can have slightly tweaked
 * values for its stats from the base monster, to keep things interesting.
 */
class Entity {
    constructor(entityStats, tweaks) {
        tweaks = tweaks || {};

        _.each(entityStats, (val, key) => {
            switch (key) {
                case 'abilities':
                    this.abilities = {};
                    val.forEach((ability) => {
                        this.abilities[ability.id] = ability;
                    });
                    break;
                default:
                    if (key in tweaks) {
                        this[key] = val + tweaks;
                    } else {
                        this[key] = val;
                    }
                    break;
            }
        });

        this.heal();

        // cooldowns is a dictionary of ability id -> turns til usable
        this.cooldowns = {};
        _.each(this.abilities, (ability, id) => {
            // by default, everything starts ready to go
            this.cooldowns[id] = 0;
        });

        this.status = [];

        // What animation should we be showing?
        this.spriteState = 'idle';

        this.state = 'alive';
    }

    damage(damageAmount) {
        this.health -= damageAmount;
        if (this.health <= 0) {
            this.state = 'dead';
            this.spriteState = 'dead';
        }
    }

    isPlayer() {
        return this.id === 'player';
    }

    setSpriteState(spriteState) {
        this.spriteState = spriteState;
    }

    heal() {
        this.health = this.hp;
    }
}

var testPlayer = new Entity({
    id: "player",
    sprites: {
        idle: 'red-mage-idle-female',
        attack: 'red-mage-attack-staff-female',
        fizzle: 'default',
        damaged: 'red-mage-damaged-female',
        dead: 'red-mage-die-female',
        up: 'red-mage-up-female',
        down: 'red-mage-down-female',
        left: 'red-mage-left-female',
        right: 'red-mage-right-female',
        walkup: 'red-mage-walk-up-female',
        walkdown: 'red-mage-walk-down-female',
        walkleft: 'red-mage-walk-left-female',
        walkright: 'red-mage-walk-right-female'
    },
    hp: 200,
    fire_resist: 0,
    frost_resist: 0,
    arcane_resist: 0,
    magic_resist: 0,
    armor: 15,
    physical: 42
});

var nextIndex = 1;
var entities = {};
var EntityStore = {
    createEntity: function(entityStats) {
        var entity = new Entity(entityStats);
        var index = nextIndex++
        entities[index] = entity;
        return index;
    },

    getById: function(entityId) {
        return entities[entityId];
    },

    getPlayer: function() {
        return testPlayer;
    }
};

EntityStore.debug = entities;

module.exports = EntityStore;
