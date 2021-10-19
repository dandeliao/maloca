import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("maloca");
    }

    async getHtml() {
        return `
            <m-container>
                <h1>Bem-vinde!</h1>
                <p>
                    Let's prioritize the low-hanging fruit race without a finish line. Pro-sumer software in this space quantity and closer to the metal nor cloud native container based. What do you feel you would bring to the table if you were hired for this position back to the drawing-board execute core competencies start procrastinating 2 hours get to do work while procrastinating open book pretend to read while manager stands and watches silently nobody is looking quick do your web search manager caught you and you are fured they have downloaded gmail and seems to be working for now canatics exploratory investigation data masking. Turd polishing re-inventing the wheel. Future-proof take five, punch the tree, and come back in here with a clear head today shall be a cloudy day, thanks to blue sky thinking, we can now deploy our new ui to the cloud for the last person we talked to said this would be ready nor good optics.
                </p>
                <br>
                <p><m-link href="/pessoa/dani">perfil do dani</m-link></p>
                <br>
                <p><m-link href="/radio-maloca">rádio maloca</m-link></p>
                <br>
                <button>
                    botão inútil
                </button>
            </m-container>
        `;
    }
}