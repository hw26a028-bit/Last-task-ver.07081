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

      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.bgmGain.gain.setValueAtTime(0.3, this.ctx.currentTime); // ホラーBGMは環境音のように控えめかつ効果的に
      this.seGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

      this.bgmGain.connect(this.masterGain);
      this.seGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // ドローン用ゲインの初期化
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
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

  // --- 不気味な背景低音ドローン (Sub-low Horror Drone) ---
  private startDrone() {
    this.resume();
    if (!this.ctx || !this.droneGain) return;
    if (this.droneOsc1) return;

    const t = this.ctx.currentTime;

    // 脳を不穏に揺さぶる超低周波 (37Hz と 39Hz) の非調和うなり
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();

    this.droneOsc1.type = "sawtooth";
    this.droneOsc1.frequency.setValueAtTime(37, t);

    this.droneOsc2.type = "sawtooth";
    this.droneOsc2.frequency.setValueAtTime(39, t);

    // ドローンをゆっくりと怪しくうねらせるLFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.1, t); // 10秒に1回
    lfoGain.gain.setValueAtTime(0.05, t);

    lfo.connect(lfoGain);
    lfoGain.connect(this.droneGain.gain);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(65, t); // 低音のみ残す

    this.droneOsc1.connect(filter);
    this.droneOsc2.connect(filter);
    filter.connect(this.droneGain);

    this.droneGain.gain.setValueAtTime(0, t);
    this.droneGain.gain.linearRampToValueAtTime(0.12, t + 4.0); // じわじわ立ち上がる

    lfo.start(t);
    this.droneOsc1.start(t);
    this.droneOsc2.start(t);
  }

  private stopDrone() {
    if (!this.ctx || !this.droneGain) return;
    const t = this.ctx.currentTime;

    if (this.droneOsc1 && this.droneOsc2) {
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, t);
      this.droneGain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

      const o1 = this.droneOsc1;
      const o2 = this.droneOsc2;
      setTimeout(() => {
        try {
          o1.stop();
          o2.stop();
        } catch (e) {}
      }, 1600);

      this.droneOsc1 = null;
      this.droneOsc2 = null;
    }
  }



  // --- 効果音 (SE) ---

  // 不穏なボタン決定音（深く残響を伴う木魚とカチッ…）
  public playClick() {
    this.resume();
    if (!this.ctx || !this.seGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const oscEcho = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.1);

    oscEcho.type = "sine";
    oscEcho.frequency.setValueAtTime(1200, t);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    oscEcho.connect(gain);
    gain.connect(this.seGain);

    osc.start(t);
    oscEcho.start(t);
    osc.stop(t + 0.21);
    oscEcho.stop(t + 0.21);
  }

  // 不気味な木魚タイピング音（深く暗くこもったポクッ…）
  public playMokugyo() {
    this.resume();
    if (!this.ctx || !this.seGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(220, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.002, t + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.seGain);

    osc.start(t);
    osc.stop(t + 0.11);

    // 幽霊のような跳ね返り微小エコー
    const echoTime = t + 0.12;
    const oscEcho = this.ctx.createOscillator();
    const gainEcho = this.ctx.createGain();

    oscEcho.type = "sine";
    oscEcho.frequency.setValueAtTime(100, echoTime);
    oscEcho.frequency.exponentialRampToValueAtTime(70, echoTime + 0.05);

    gainEcho.gain.setValueAtTime(0.08, echoTime);
    gainEcho.gain.exponentialRampToValueAtTime(0.001, echoTime + 0.06);

    oscEcho.connect(filter);
    filter.connect(gainEcho);
    gainEcho.connect(this.seGain);

    oscEcho.start(echoTime);
    oscEcho.stop(echoTime + 0.07);
  }

  // タイピングミス音（背筋が凍りつく不協スライド風鳴り：ヒュゥゥ…）
  public playMiss() {
    this.resume();
    if (!this.ctx || !this.seGain) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(450, t);
    osc1.frequency.linearRampToValueAtTime(700, t + 0.25);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(458, t); // デチューンによる激しいうなり
    osc2.frequency.linearRampToValueAtTime(709, t + 0.25);

    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(16, t); // 高速な震え
    vibratoGain.gain.setValueAtTime(20, t);

    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc1.frequency);
    vibratoGain.connect(osc2.frequency);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(580, t);
    filter.Q.setValueAtTime(2.0, t);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.seGain);

    vibrato.start(t);
    osc1.start(t);
    osc2.start(t);

    vibrato.stop(t + 0.3);
    osc1.stop(t + 0.3);
    osc2.stop(t + 0.3);
  }

  // 妖怪への攻撃音（呪術的な切裂きと、不気味な高音キーンという倍音残響）
  public playAttack() {
    this.resume();
    if (!this.ctx || !this.seGain) return;

    const t = this.ctx.currentTime;

    // 呪われし不協和金属音スタック
    const frequencies = [666, 1066, 1466, 1966];
    frequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.seGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + idx * 0.015);

      gain.gain.setValueAtTime(0.045, t + idx * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.015 + 0.4); 

      osc.connect(gain);
      gain.connect(this.seGain);

      osc.start(t + idx * 0.015);
      osc.stop(t + idx * 0.015 + 0.42);
    });

    // 闇を切り裂くようなノイズ
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1000, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + 0.18); 
    filter.Q.setValueAtTime(4.0, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.1, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.seGain);

    noise.start(t);
    noise.stop(t + 0.19);
  }

  // ダメージ被弾音（奈落へ落ちる重低音地響き）
  public playDamage() {
    this.resume();
    if (!this.ctx || !this.seGain) return;

    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(10, t + 0.4); 

    const filterLow = this.ctx.createBiquadFilter();
    filterLow.type = "lowpass";
    filterLow.frequency.setValueAtTime(80, t);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(filterLow);
    filterLow.connect(gain);
    gain.connect(this.seGain);

    osc.start(t);
    osc.stop(t + 0.46);

    // ドサッというノイズ
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(70, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.seGain);

    noise.start(t);
    noise.stop(t + 0.31);
  }

  // --- BGM管理 (和風ホラー・ダークアンビエントへの一新) ---

  public playBgm(type: "normal" | "battle" | "none") {
    this.resume();
    if (this.currentBgm === type) return;

    this.stopBgm();
    this.currentBgm = type;

    if (type === "none") {
      this.stopDrone();
      return;
    }

    // 恐怖の低音ドローンを常時バックグラウンドで開始
    this.startDrone();

    // 拍子の概念を排除した、ゆっくりと息苦しいタイミング
    const stepDuration = 0.5; // 0.5秒刻みの環境シーケンス
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

    if (type === "normal") {
      // --- 通常（散策・図鑑）：極めて静かで、おどろおどろしい「和風恐怖空間」 ---
      // 拍は極めて緩慢で、メロディはありません

      // 1. 地鳴りのような不気味に遠くで響く和太鼓（16ステップに1回）
      if (step % 16 === 0) {
        this.synthTaiko(34, 0.25, t); // 超低音の深いドーーーン
      } else if (step % 16 === 7) {
        if (Math.random() > 0.4) {
          this.synthTaiko(30, 0.12, t); // かすかな地響き
        }
      }

      // 2. 錆びついた冷たい寺の半鐘（鉦）「キーーーーーン……」と不協和な響き（24ステップに1回）
      if (step % 24 === 4) {
        this.synthCursedKane(0.018, t);
      }

      // 3. すすり泣くような不気味な篠笛（不定期・長音・ピッチ揺らぎ）
      if (step % 24 === 10) {
        this.playSingleGhostFlute(t, "normal");
      }

    } else {
      // --- 戦闘（除霊）：緊迫し、焦り、発狂を誘う「ダークホラー戦闘曲」 ---
      // テンポは不規則で、不協和な音が幾重にも重なります

      // 1. 心拍数を表現した、不均等で重い太鼓「ドッ…ドクン…」
      const beat8 = step % 8;
      if (beat8 === 0 || beat8 === 3) {
        this.synthTaiko(42, 0.28, t);
      } else if (beat8 === 4) {
        this.synthTaiko(36, 0.18, t);
      } else if (beat8 === 6 && Math.random() > 0.5) {
        this.synthTaiko(75, 0.08, t); // コツッという乾いた音
      }

      // 2. 恐怖を駆り立てる耳障りな高速の鉦（4ステップに1回）
      if (step % 4 === 1) {
        this.synthCursedKane(0.012, t);
      }

      // 3. 三味線の低音「ベン……」という怪しげな非調和撥弦（12ステップに1回）
      if (step % 12 === 2) {
        this.synthShamisenLow(t);
      }

      // 4. 金切り声のような悲鳴に近い、不快に震える不協笛
      if (step % 16 === 8) {
        this.playSingleGhostFlute(t, "battle");
      }
    }

    this.bgmStep++;
  }

  // 地の底から響く太鼓
  private synthTaiko(freq: number, volume: number, startTime: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = freq > 60 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.35, startTime + 0.3);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(startTime);
    osc.stop(startTime + 0.5);
  }

  // 呪いの鉦（完全に非調和な高い金属共鳴で、頭を痛くするような不快なピッチ）
  private synthCursedKane(volume: number, startTime: number) {
    if (!this.ctx || !this.bgmGain) return;
    // 非調和で冷たく錆びた響き [1444, 1888, 2333Hz]
    const freqs = [1444, 1888, 2333];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.bgmGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // 尾をかなり長く引く
      const duration = 0.8;

      gain.gain.setValueAtTime(volume / freqs.length, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  // 三味線の不吉な低音ベン（低周波のこすれ・非調和ピッチと強烈なスライド）
  private synthShamisenLow(startTime: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const noiseOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(85, startTime);
    // 撥で力強く叩いて滑るスライド「ベーーーーン」
    osc.frequency.exponentialRampToValueAtTime(50, startTime + 0.4);

    // バズ音（不純物）を混ぜる
    noiseOsc.type = "triangle";
    noiseOsc.frequency.setValueAtTime(173, startTime);
    noiseOsc.frequency.exponentialRampToValueAtTime(95, startTime + 0.4);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(180, startTime);

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

    osc.connect(filter);
    noiseOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(startTime);
    noiseOsc.start(startTime);
    osc.stop(startTime + 0.55);
    noiseOsc.stop(startTime + 0.55);
  }

  // 幽霊笛：すすり泣くような持続音（不穏なヨナ抜き短音階・陰旋法）
  private playSingleGhostFlute(startTime: number, mood: "normal" | "battle") {
    if (!this.ctx || !this.bgmGain) return;

    // 陰旋法（ラ、シb、レ、ミ、ファ）の怪しげなピッチ
    const notes = [440, 466, 587, 659, 698];
    const baseFreq = notes[Math.floor(Math.random() * notes.length)] * (mood === "battle" ? 1.5 : 1.0);
    const duration = mood === "battle" ? 1.8 : 3.0; // 通常時はおそろしく長く息絶えるように

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(baseFreq, startTime);

    // 笛が震えるピッチ揺らぎ (ビブラートLFO) をかなり不安定に
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(4.2, startTime); // おそろしく遅い震え
    lfoGain.gain.setValueAtTime(baseFreq * 0.035, startTime); 

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    // 音量フェード（虚空からふっと立ち上がり、ゆっくり消え失せる）
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.035, startTime + 0.6);
    gain.gain.setValueAtTime(0.035, startTime + duration - 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    lfo.start(startTime);
    osc.start(startTime);

    lfo.stop(startTime + duration);
    osc.stop(startTime + duration + 0.05);

    // 息漏れの不気味なすきま風を重ねる
    this.synthGhostFluteBreath(startTime, duration);
  }

  private synthGhostFluteBreath(startTime: number, duration: number) {
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
    filter.frequency.setValueAtTime(950, startTime);
    filter.Q.setValueAtTime(6.0, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.01, startTime + 0.5);
    gain.gain.setValueAtTime(0.01, startTime + duration - 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }
}

export const audio = new SoundManager();
