
// ========== ECS Core ==========
class Entity {
    constructor(id) {
        this.id = id;
        this.components = {};
    }
    addComponent(component) {
        this.components[component.constructor.name] = component;
        return this;
    }
    getComponent(name) {
        return this.components[name];
    }
}

// ========== Components ==========
class DeckComponent { constructor(cards) { this.cards = cards; } }
class HandComponent { constructor(cards = []) { this.cards = cards; } }
class PileComponent { constructor() { this.cards = []; } }
class PlayerComponent { constructor(name, isCPU = false) { this.name = name; this.isCPU = isCPU; } }
class ReactionComponent { constructor(speed = 500) { this.speed = speed; this.calledSnap = false; } }

// ========== Helpers ==========
function createDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const deck = [];
    for (let s of suits) for (let r of ranks) deck.push({ rank: r, suit: s });
    return deck.sort(() => Math.random() - 0.5);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========== Entities ==========
const player = new Entity("player")
    .addComponent(new PlayerComponent("You"))
    .addComponent(new HandComponent());

const cpu = new Entity("cpu")
    .addComponent(new PlayerComponent("CPU", true))
    .addComponent(new HandComponent())
    .addComponent(new ReactionComponent(700));

const pile = new Entity("pile").addComponent(new PileComponent());

// ========== Systems ==========
function dealSystem(deckEntity, playerEntity, cpuEntity) {
    const deck = deckEntity.getComponent("DeckComponent").cards;
    playerEntity.getComponent("HandComponent").cards = deck.slice(0, 26);
    cpuEntity.getComponent("HandComponent").cards = deck.slice(26);
}

function turnSystem(current, pileEntity) {
    const hand = current.getComponent("HandComponent").cards;
    if (hand.length > 0) {
        const card = hand.shift();
        pileEntity.getComponent("PileComponent").cards.push(card);
        return card;
    }
    return null;
}

function snapCheckSystem(pileEntity) {
    const cards = pileEntity.getComponent("PileComponent").cards;
    if (cards.length >= 2) {
        const top = cards[cards.length - 1];
        const prev = cards[cards.length - 2];
        return top.rank === prev.rank;
    }
    return false;
}

function collectPileSystem(winner, pileEntity) {
    const pileCards = pileEntity.getComponent("PileComponent").cards;
    const hand = winner.getComponent("HandComponent").cards;
    hand.push(...pileCards);
    pileEntity.getComponent("PileComponent").cards = [];
    console.log(`${winner.getComponent("PlayerComponent").name} wins the pile!`);
}

function winConditionSystem(playerEntity, cpuEntity) {
    if (playerEntity.getComponent("HandComponent").cards.length === 0) {
        console.log("CPU wins the game!");
        return true;
    }
    if (cpuEntity.getComponent("HandComponent").cards.length === 0) {
        console.log("You win the game!");
        return true;
    }
    return false;
}

// ========== Input Handling ==========
function waitForKeypress() {
    return new Promise(resolve => {
        process.stdin.setRawMode(true);   // send keystrokes immediately
        process.stdin.resume();
        process.stdin.once("data", () => {
            process.stdin.setRawMode(false); // restore normal mode
            resolve(true);
        });
    });
}


// ========== Game Loop ==========
async function gameLoop() {
    const deck = new Entity("deck").addComponent(new DeckComponent(createDeck()));
    dealSystem(deck, player, cpu);

    let turn = 0;
    while (true) {
        const current = turn % 2 === 0 ? player : cpu;
        const card = turnSystem(current, pile);
        if (!card) break;

        console.log(`${current.getComponent("PlayerComponent").name} plays ${card.rank}${card.suit}`);

        if (snapCheckSystem(pile)) {
            console.log("SNAP opportunity! (Press Enter!)");

            // CPU tries snap
            const cpuReact = delay(cpu.getComponent("ReactionComponent").speed).then(() => {
                cpu.getComponent("ReactionComponent").calledSnap = true;
            });

            // Player waits for input
            const playerReact = waitForKeypress().then(() => {
                player.addComponent(new ReactionComponent(0));
                player.getComponent("ReactionComponent").calledSnap = true;
            });

            await Promise.race([cpuReact, playerReact]);

            if (player.getComponent("ReactionComponent")?.calledSnap) {
                collectPileSystem(player, pile);
                player.getComponent("ReactionComponent").calledSnap = false;
            } else {
                collectPileSystem(cpu, pile);
                cpu.getComponent("ReactionComponent").calledSnap = false;
            }
        }

        if (winConditionSystem(player, cpu)) {
            rl.close();
            break;
        }

        turn++;
        await delay(500); // small pause between turns
    }
}

gameLoop();
