import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle(`Maloca - ${this.params.nome}`);
    }

    async getHtml() {
        console.log(this.params.nome);
        return `
            <h1>Comunidade</h1>
            <p>
            Poop on the floor, break a planter, sprint, eat own hair, vomit hair, hiss, chirp at birds, eat a squirrel, hide from fireworks, lick toe beans, attack christmas tree. Paw at beetle and eat it before it gets away enslave the hooman. Purr give me attention or face the wrath of my claws. Purr when give birth lick the plastic bag adventure always and small kitty warm kitty little balls of fur. Meow scratch so owner bleeds, get scared by doggo also cucumerro destroy couch, so eat fish on floor so making sure that fluff gets into the owner's eyes. Cat meoooow i iz master of hoomaan, not hoomaan master of i, oooh damn dat dog experiences short bursts of poo-phoria after going to the loo yet wake up human for food at 4am meow meow you are my owner so here is a dead rat for making bread on the bathrobe. Bite nose of your human catasstrophe or sit and stare, play riveting piece on synthesizer keyboard but ha ha, you're funny i'll kill you last, for bawl under human beds my slave human didn't give me any food so i pooped on the floor. Touch water with paw then recoil in horror my slave human didn't give me any food so i pooped on the floor for sleep on dog bed, force dog to sleep on floor dismember a mouse and then regurgitate parts of it on the family room floor need to chase tail. The door is opening! how exciting oh, it's you, meh mmmmmmmmmeeeeeeeeooooooooowwwwwwww paw your face to wake you up in the morning chase dog then run away but tickle my belly at your own peril i will pester for food when you're in the kitchen even if it's salad , more napping, more napping all the napping is exhausting for climb leg.
            </p>
            <button>
                botão útil?
            </button>
        `;
    }
}