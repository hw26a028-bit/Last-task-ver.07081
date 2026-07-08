// src/lib/audio.ts

class SoundManager {
  private ctx: AudioContext | null = null;
  private currentBgm: "none" | "normal" | "battle" = "none";
  private bgmInterval: any = null;
  private bgmStep = 0;
  
  // Gains
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private seGain: GainNode | null = null;

  // 不気味な持続音（低音ドローン）用ノード
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  constructor() {
    // ユーザーインタラクション時に初期化可能
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.bgmGain = this.ctx.createGain();
      this.seGain = this.ctx.createGain();

      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.bgmGain.gain.setValueAtTime(0.23, this.ctx.currentTime); // BGMは不気味な背景として控えめに
      this.seGain.gain.setValueAtTime(0.45, this.ctx.currentTime);   // 効果音ははっきりと聞こえるように

      this.bgmGain.connect(this.masterGain);
      this.seGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // ドローン用ゲインの初期化
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime); // 最初は消音
      this.droneGain.connect(this.masterGain);
    } catch (e) {
      console.error("Failed to initialize AudioContext", e);
    }
  }

  public resume() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // --- 不気味な背景低音ドローン（Yokai Presence Drone） ---
  private startDrone() {
    this.resume();
    if (!this.ctx || !this.droneGain) return;

    // すでに再生中ならスキップ
    if (this.droneOsc1) return;

    const t = this.ctx.currentTime;

    // 非常に低い不協和音（43Hz と 45Hz）によるうなり
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc2 = this.ctx.createOscillator();
    const droneFilter = this.ctx.createBiquadFilter();

    this.droneOsc1.type = "sawtooth";
    this.droneOsc1.frequency.setValueAtTime(43, t);

    this.droneOsc2.type = "sawtooth";
    this.droneOsc2.frequency.setValueAtTime(45, t);

    // LFOでドローン音量をゆっくり不規則にうねらせる
    const droneLfo = this.ctx.createOscillator();
    const droneLfoGain = this.ctx.createGain();
    droneLfo.type = "sine";
    droneLfo.frequency.setValueAtTime(0.15, t); // 非常にゆっくり
    droneLfoGain.gain.setValueAtTime(0.04, t);

    droneLfo.connect(droneLfoGain);
    droneLfoGain.connect(this.droneGain.gain);

    droneFilter.type = "lowpass";
    droneFilter.frequency.setValueAtTime(75, t); // 低音域のみを通す

    this.droneOsc1.connect(droneFilter);
    this.droneOsc2.connect(droneFilter);
    droneFilter.connect(this.droneGain);

    // フェードイン
    this.droneGain.gain.setValueAtTime(0, t);
    this.droneGain.gain.linearRampToValueAtTime(0.08, t + 3.0);

    droneLfo.start(t);
    this.droneOsc1.start(t);
    this.droneOsc2.start(t);
  }

  private stopDrone() {
    if (!this.ctx || !this.droneGain) return;
    const t = this.ctx.currentTime;

    // フェードアウトしてから停止
    if (this.droneOsc1 && this.droneOsc2) {
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, t);
      this.droneGain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);

      const o1 = this.droneOsc1;
      const o2 = this.droneOsc2;
      setTimeout(() => {
        try {
          o1.stop();
          o2.stop();
        } catch (e) {}
      }, 1100);

      this.droneOsc1 = null;
      this.droneOsc2 = null;
    }
  }

  // --- 効果音（SE） ---

  // 不穏なボタンクリック音（暗く響く決定音：カツッ…）
  public playClick() {
    this.resume();
    if (!this.ctx || !this.seGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const oscEcho = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // 暗く乾いた木製のクリック
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.08);

    // 金属的な不穏な残響（高音域の金属鳴り）
    oscEcho.type = "sine";
    oscEcho.frequency.setValueAtTime(1333, t);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.002, t + 0.15);

    osc.connect(gain);
    oscEcho.connect(gain);
    gain.connect(this.seGain);

    osc.start(t);
    oscEcho.start(t);
    osc.stop(t + 0.16);
    oscEcho.stop(t + 0.16);
  }

  // 不気味な木魚タイピング音（深くこもったポクッ…）
  public playMokugyo() {
    this.resume();
    if (!this.ctx || !this.seGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // 通常より低めの不穏な木魚
    osc.type = "sine";
    osc.frequency.setValueAtTime(170, t);
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.06);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(260, t);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.004, t + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.seGain);

    osc.start(t);
    osc.stop(t + 0.09);

    // 幽霊のようなごく微小な跳ね返りエコー（110ms後）
    const echoTime = t + 0.10;
    const oscEcho = this.ctx.createOscillator();
    const gainEcho = this.ctx.createGain();

    oscEcho.type = "sine";
    oscEcho.frequency.setValueAtTime(120, echoTime);
    oscEcho.frequency.exponentialRampToValueAtTime(80, echoTime + 0.04);

    gainEcho.gain.setValueAtTime(0.06, echoTime);
    gainEcho.gain.exponentialRampToValueAtTime(0.001, echoTime + 0.05);

    oscEcho.connect(filter);
    filter.connect(gainEcho);
    gainEcho.connect(this.seGain);

    oscEcho.start(echoTime);
    oscEcho.stop(echoTime + 0.06);
  }

  // タイピングミス音（背筋が凍るような不協スライド風鳴り：ヒュゥゥ…）
  public playMiss() {
    this.resume();
    if (!this.ctx || !this.seGain) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // 震える不協な高音
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(500, t);
    osc1.frequency.linearRampToValueAtTime(750, t + 0.22);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(507, t); // わずかにデチューンしてうなりを作る
    osc2.frequency.linearRampToValueAtTime(759, t + 0.22);

    // ピッチを小刻みに震わせるLFO
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(14, t); // 高速な震え
    vibratoGain.gain.setValueAtTime(15, t);

    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc1.frequency);
    vibratoGain.connect(osc2.frequency);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(650, t);
    filter.Q.setValueAtTime(1.5, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.seGain);

    vibrato.start(t);
    osc1.start(t);
    osc2.start(t);

    vibrato.stop(t + 0.25);
    osc1.stop(t + 0.25);
    osc2.stop(t + 0.25);
  }

  // 妖怪への攻撃音（呪術的な切裂きと、不気味な高音キーンという倍音残響）
  public playAttack() {
    this.resume();
    if (!this.ctx || !this.seGain) return;

    const t = this.ctx.currentTime;

    // 呪われし不協和金属音スタック [666, 1066, 1466, 1966Hz] (あえて非調和な悪魔的ピッチ)
    const frequencies = [666, 1066, 1466, 1966];
    frequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.seGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + idx * 0.015);

      gain.gain.setValueAtTime(0.04, t + idx * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.015 + 0.35); // やや長めに尾を引く

      osc.connect(gain);
      gain.connect(this.seGain);

      osc.start(t + idx * 0.015);
      osc.stop(t + idx * 0.015 + 0.38);
    });

    // 闇を切り裂くようなノイズ
    const bufferSize = this.ctx.sampleRate * 0.16;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1100, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.15); // 急激にこもらせる
    filter.Q.setValueAtTime(3.0, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.seGain);

    noise.start(t);
    noise.stop(t + 0.17);
  }

  // ダメージ被弾音（地響きのような奈落落下音 ＆ うめきを模した超低音）
  public playDamage() {
    this.resume();
    if (!this.ctx || !this.seGain) return;

    const t = this.ctx.currentTime;

    // 奈落へ落ちる超低音
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(15, t + 0.35); // 15Hzの心臓破りの低音へ

    const filterLow = this.ctx.createBiquadFilter();
    filterLow.type = "lowpass";
    filterLow.frequency.setValueAtTime(100, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(filterLow);
    filterLow.connect(gain);
    gain.connect(this.seGain);

    osc.start(t);
    osc.stop(t + 0.42);

    // ドサッという気味の悪い衝撃衝撃ノイズ
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(80, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.seGain);

    noise.start(t);
    noise.stop(t + 0.26);
  }

  // --- BGM管理 ---

  public playBgm(type: "normal" | "battle" | "none") {
    this.resume();
    if (this.currentBgm === type) return;

    this.stopBgm();
    this.currentBgm = type;

    if (type === "none") {
      this.stopDrone();
      return;
    }

    // 不気味な低音ドローンを常時始動
    this.startDrone();

    const tempo = type === "normal" ? 68 : 118; // 全体的にテンポを少し落としておどろおどろしさを強化
    const stepDuration = 60 / tempo / 2; // 8分音符間隔

    this.bgmStep = 0;
    
    this.bgmInterval = setInterval(() => {
      this.playBgmStep(type);
    }, stepDuration * 1000);
  }

  public stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentBgm = "none";
    this.stopDrone();
  }

  private playBgmStep(type: "normal" | "battle") {
    if (!this.ctx || !this.bgmGain) return;
    const t = this.ctx.currentTime;
    const step = this.bgmStep;

    // --- 1. 和太鼓（おどろおどろしい地の底から響く太鼓） ---
    let playTaiko = false;
    let taikoPitch = 48; // さらに低音
    let taikoVol = 0.22;

    if (type === "normal") {
      const beat8 = step % 8;
      // 緩慢だが不気味にズレた太鼓リズム
      if (beat8 === 0 || beat8 === 4) {
        playTaiko = true;
      } else if (beat8 === 5) {
        playTaiko = true;
        taikoPitch = 42;
        taikoVol = 0.12;
      }
    } else {
      const beat16 = step % 16;
      // 狂おしい焦燥のリズム（ド、ド、ド・コ、ドコドコ…）
      if ([0, 4, 8, 11, 12, 14].includes(beat16)) {
        playTaiko = true;
        taikoPitch = [11, 14].includes(beat16) ? 38 : 46;
      } else if ([2, 6, 9, 13].includes(beat16)) {
        playTaiko = true;
        taikoPitch = 70; // 乾いたコッ
        taikoVol = 0.08;
      }
    }

    if (playTaiko) {
      this.synthTaiko(taikoPitch, taikoVol, t);
    }

    // --- 2. 鉦（古ぼけた錆びた金属の音：不快な非調和ピッチ） ---
    let playKane = false;
    let kaneVol = 0.015;
    if (type === "normal") {
      if (step % 8 === 3 || step % 8 === 7) {
        playKane = true;
      }
    } else {
      const beat8 = step % 8;
      if ([1, 3, 5, 7].includes(beat8)) {
        playKane = true;
        kaneVol = (beat8 === 7) ? 0.008 : 0.018;
      }
    }

    if (playKane) {
      this.synthCursedKane(kaneVol, t);
    }

    // --- 3. 篠笛（不穏なヨナ抜き短音階・陰旋法での幽霊旋律） ---
    const phraseInterval = type === "normal" ? 32 : 16;
    if (step % phraseInterval === 0) {
      this.playGhostFlutePhrase(type, t);
    }

    this.bgmStep++;
  }

  private synthTaiko(freq: number, volume: number, startTime: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = freq > 60 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, startTime + 0.15);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(startTime);
    osc.stop(startTime + 0.25);
  }

  // 呪いの鉦（あえて非調和な高域を重ねて錆びついた冷たい不気味さを表現）
  private synthCursedKane(volume: number, startTime: number) {
    if (!this.ctx || !this.bgmGain) return;
    // 完全に不快にズラした3周波数 [1555, 2111, 2777Hz]
    const freqs = [1555, 2111, 2777];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.bgmGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // 尾を長くひいて怪しく響かせる
      const duration = 0.3;

      gain.gain.setValueAtTime(volume / freqs.length, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    });
  }

  // 幽霊笛（陰旋法：A(ラ) Bb(シb) D(レ) E(ミ) F(ファ) A(ラ) を用いたおどろおどろしい調べ）
  private playGhostFlutePhrase(type: "normal" | "battle", startTime: number) {
    if (!this.ctx || !this.bgmGain) return;

    // 陰旋法（ラ、シb、レ、ミ、ファ、ラ）
    const scale = [440, 466, 587, 659, 698, 880, 932, 1174];

    let melody: number[] = [];
    let noteDurations: number[] = [];

    if (type === "normal") {
      // 静かで冷たい旋律（ラ・シb・ファ・ミ・レ…）
      melody = [0, 1, 4, 3, 2, 1];
      noteDurations = [0.6, 0.3, 0.6, 0.3, 0.6, 0.9];
    } else {
      // 激しく焦らせる幽霊旋律（レ・ミ・ファ・ラ・シb・ファ・ミ）
      melody = [2, 3, 4, 5, 6, 4, 3];
      noteDurations = [0.18, 0.18, 0.18, 0.18, 0.18, 0.18, 0.6];
    }

    let noteTime = startTime;
    melody.forEach((scaleIdx, index) => {
      if (!this.ctx || !this.bgmGain) return;
      const freq = scale[scaleIdx];
      const duration = noteDurations[index];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // 三角波を交ぜて、少し息の抜けた、こもった笛の音色を作る
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, noteTime);

      // おどろおどろしい不安定な震え（強めのビブラートLFO）
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(5.8, noteTime); // 震えの速さ
      lfoGain.gain.setValueAtTime(freq * 0.022, noteTime); // 震えの強さ

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // 音量アタックとリリース（すぅーと入り、すぅーと消える）
      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.042, noteTime + 0.06);
      gain.gain.setValueAtTime(0.042, noteTime + duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      lfo.start(noteTime);
      osc.start(noteTime);

      lfo.stop(noteTime + duration);
      osc.stop(noteTime + duration + 0.02);

      // 幽霊笛の「息の漏れ」（ヒュゥーというすきま風ノイズ）を重ねる
      this.synthBreathingNoise(noteTime, duration);

      noteTime += duration;
    });
  }

  private synthBreathingNoise(startTime: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1050, startTime);
    filter.Q.setValueAtTime(5.0, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.012, startTime + 0.06);
    gain.gain.setValueAtTime(0.012, startTime + duration - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }
}

export const audio = new SoundManager();
