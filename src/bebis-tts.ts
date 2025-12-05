import {SynthesisResult, UniversalEdgeTTS} from "edge-tts-universal";

export default class BebisTTS {
    private static model: String = 'tr-TR-EmelNeural';
    private static pitch: String = '+80Hz';
    private static rate: String = '+10%';

    static async generateSound(text: string): Promise<SynthesisResult> {
        const tts = new UniversalEdgeTTS(text, `${this.model}`, {
            pitch: `${this.pitch}`,
            rate: `${this.rate}`
        });

        return await tts.synthesize();
    }
}
