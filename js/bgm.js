/* 背景配樂「薰衣草微風」 G大調五聲 · 76 BPM · 8小節無縫循環(使用者核可版) */
(function () {
  'use strict';
  var CDN = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js';
  var PREF_KEY = 'hokkaido-bgm-on';
  var btn = document.getElementById('bgmToggle');
  if (!btn) return;

  var BPM = 76;
  var CHORDS = [
    { time: '0:0:0', notes: ['G3','B3','D4','A4'] },
    { time: '1:0:0', notes: ['F#3','A3','D4','A4'] },
    { time: '2:0:0', notes: ['E3','G3','D4','B4'] },
    { time: '3:0:0', notes: ['C3','E4','G4','D5'] },
    { time: '4:0:0', notes: ['G3','B3','D4','A4'] },
    { time: '5:0:0', notes: ['F#3','A3','D4','A4'] },
    { time: '6:0:0', notes: ['C3','E4','G4','D5'] },
    { time: '7:0:0', notes: ['D3','A3','D4','F#4'] }
  ];
  var BASS = ['G2','F#2','E2','C2','G2','F#2','C2','D2'];
  var ARP_POOLS = [
    ['G3','D4','A4','B4'], ['F#3','D4','F#4','A4'],
    ['E3','B3','G4','B4'], ['C3','G3','E4','D5'],
    ['G3','D4','A4','B4'], ['F#3','D4','F#4','A4'],
    ['C3','G3','E4','D5'], ['D3','A3','F#4','A4']
  ];
  var ARP_PATTERN = [0,1,2,3,2,3,1,2];
  var MELODY_A = [
    { time: '4:0:0', note: 'D5', dur: '4n.' },
    { time: '4:1:2', note: 'E5', dur: '8n' },
    { time: '4:2:0', note: 'D5', dur: '4n' },
    { time: '4:3:0', note: 'B4', dur: '4n' },
    { time: '5:0:0', note: 'A4', dur: '2n' },
    { time: '5:2:0', note: 'D5', dur: '4n' },
    { time: '5:3:0', note: 'E5', dur: '4n' },
    { time: '6:0:0', note: 'E5', dur: '4n.' },
    { time: '6:1:2', note: 'D5', dur: '8n' },
    { time: '6:2:0', note: 'B4', dur: '2n' },
    { time: '7:0:0', note: 'A4', dur: '2n' },
    { time: '7:2:0', note: 'B4', dur: '2n' }
  ];
  var MELODY_B = [
    { time: '4:0:0', note: 'B4', dur: '2n' },
    { time: '4:2:0', note: 'A4', dur: '4n' },
    { time: '4:3:0', note: 'G4', dur: '4n' },
    { time: '5:0:0', note: 'A4', dur: '2n.' },
    { time: '6:0:0', note: 'G4', dur: '4n' },
    { time: '6:1:0', note: 'E4', dur: '4n' },
    { time: '6:2:0', note: 'D4', dur: '2n' },
    { time: '7:0:0', note: 'E4', dur: '2n' },
    { time: '7:2:0', note: 'A4', dur: '2n' }
  ];
  var CHIME_NOTES = ['D6','E6','G6','A6','B6'];

  var g = null, playing = false, cycle = 0, loading = false, pausedByHide = false;
  var gestureArmed = false;

  function loadTone() {
    return new Promise(function (resolve, reject) {
      if (window.Tone) return resolve();
      var s = document.createElement('script');
      s.src = CDN; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function applyMelodyPhase(c) {
    if (!g) return;
    var phase = c % 4; /* 0:A句 1:B句 2:A句 3:休息 */
    g.melodyA.mute = !(phase === 0 || phase === 2);
    g.melodyB.mute = (phase !== 1);
  }

  function build() {
    if (g) return Promise.resolve();
    Tone.Transport.bpm.value = BPM;
    Tone.Destination.volume.value = -12;

    var reverb = new Tone.Reverb({ decay: 5.2, preDelay: 0.02, wet: 0.35 });
    var ready = reverb.generate();
    reverb.toDestination();

    var vols = {
      pad: new Tone.Volume(-17).connect(reverb),
      arp: new Tone.Volume(-19).connect(reverb),
      melody: new Tone.Volume(-15).connect(reverb),
      chime: new Tone.Volume(-21).connect(reverb),
      wind: new Tone.Volume(-33).connect(reverb)
    };

    var chorus = new Tone.Chorus(0.15, 3.5, 0.18).start().connect(vols.pad);
    var padFilter = new Tone.Filter(1300, 'lowpass').connect(chorus);
    var pad = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 16,
      oscillator: { type: 'fatsine', count: 3, spread: 8 },
      envelope: { attack: 3.2, decay: 0.8, sustain: 0.7, release: 5.5 }
    }).connect(padFilter);

    var bass = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.4, decay: 0.3, sustain: 0.8, release: 2 }
    }).connect(vols.pad);

    var arp = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 12,
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.006, decay: 0.35, sustain: 0.12, release: 1.4 }
    }).connect(vols.arp);

    var mDelay = new Tone.FeedbackDelay('8n.', 0.28).connect(vols.melody);
    mDelay.wet.value = 0.18;
    var melody = new Tone.PolySynth(Tone.FMSynth, {
      maxPolyphony: 8, harmonicity: 2, modulationIndex: 6,
      oscillator: { type: 'sine' }, modulation: { type: 'sine' },
      envelope: { attack: 0.004, decay: 0.9, sustain: 0.08, release: 1.8 },
      modulationEnvelope: { attack: 0.004, decay: 0.4, sustain: 0.05, release: 1 }
    }).connect(mDelay);

    var chime = new Tone.PolySynth(Tone.FMSynth, {
      maxPolyphony: 8, harmonicity: 5.07, modulationIndex: 16,
      oscillator: { type: 'sine' }, modulation: { type: 'sine' },
      envelope: { attack: 0.002, decay: 1.6, sustain: 0, release: 2.5 },
      modulationEnvelope: { attack: 0.002, decay: 0.8, sustain: 0, release: 1 }
    }).connect(vols.chime);

    var wind = new Tone.Noise('pink');
    var windFilter = new Tone.AutoFilter('0.08hz', 160, 2.5).start().connect(vols.wind);
    wind.connect(windFilter);

    function loopAll(p) { p.loop = true; p.loopEnd = '8m'; p.start(0); return p; }

    loopAll(new Tone.Part(function (time, ev) {
      pad.triggerAttackRelease(ev.notes, '1m', time, 0.45);
    }, CHORDS));

    loopAll(new Tone.Part(function (time, ev) {
      bass.triggerAttackRelease(ev.note, '1m', time, 0.5);
    }, BASS.map(function (n, i) { return { time: i + ':0:0', note: n }; })));

    var arpEvents = [];
    ARP_POOLS.forEach(function (pool, bar) {
      ARP_PATTERN.forEach(function (idx, step) {
        arpEvents.push({
          time: bar + ':' + Math.floor(step / 2) + ':' + ((step % 2) * 2),
          note: pool[idx]
        });
      });
    });
    loopAll(new Tone.Part(function (time, ev) {
      arp.triggerAttackRelease(ev.note, '8n', time + (Math.random() - 0.5) * 0.015, 0.3 + Math.random() * 0.18);
    }, arpEvents));

    function mkMelody(events) {
      return loopAll(new Tone.Part(function (time, ev) {
        melody.triggerAttackRelease(ev.note, ev.dur, time, 0.5);
      }, events));
    }
    var melodyA = mkMelody(MELODY_A);
    var melodyB = mkMelody(MELODY_B);
    melodyB.mute = true;

    new Tone.Loop(function (time) {
      if (Math.random() < 0.5) {
        var n = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)];
        chime.triggerAttackRelease(n, '2n', time + Math.random() * 1.4, 0.12 + Math.random() * 0.15);
      }
    }, '1m').start(0);

    Tone.Transport.scheduleRepeat(function () {
      cycle += 1; applyMelodyPhase(cycle);
    }, '8m', '8m');

    g = { wind: wind, melodyA: melodyA, melodyB: melodyB };
    return ready;
  }

  function setBtn(on, busy) {
    playing = on;
    btn.classList.toggle('is-on', on);
    btn.classList.toggle('is-busy', !!busy);
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? '關閉背景音樂' : '播放背景音樂');
  }

  function startMusic() {
    cycle = 0; applyMelodyPhase(0);
    if (g.wind.state !== 'started') g.wind.start();
    Tone.Transport.start('+0.05');
    setBtn(true);
    try { localStorage.setItem(PREF_KEY, '1'); } catch (e) {}
  }

  function stopMusic(remember) {
    Tone.Transport.stop();
    if (g && g.wind.state === 'started') g.wind.stop();
    setBtn(false);
    if (remember) { try { localStorage.setItem(PREF_KEY, '0'); } catch (e) {} }
  }

  function armFirstGesture() {
    if (gestureArmed || !window.Tone) return;
    gestureArmed = true;

    function cleanup() {
      gestureArmed = false;
      document.removeEventListener('pointerdown', resume, true);
      document.removeEventListener('keydown', resume, true);
    }

    function resume(e) {
      if (e.target === btn || btn.contains(e.target)) { cleanup(); return; }
      cleanup();
      requestStart(false);
    }

    document.addEventListener('pointerdown', resume, true);
    document.addEventListener('keydown', resume, true);
  }

  function requestStart(isAutomatic) {
    if (loading || playing) return;
    loading = true; setBtn(false, true);
    loadTone()
      .then(function () { return Tone.start(); })
      .then(function () { return build(); })
      .then(function () {
        loading = false; setBtn(false, false);
        btn.classList.remove('had-on'); btn.removeAttribute('title');
        startMusic();
      })
      .catch(function () {
        loading = false; setBtn(false, false);
        btn.classList.add('had-on');
        if (isAutomatic && window.Tone) {
          btn.title = '背景音樂會在首次互動後播放';
          armFirstGesture();
        } else {
          btn.title = '音樂載入失敗，請確認網路後再試';
        }
      });
  }

  btn.addEventListener('click', function () {
    if (loading) return;
    btn.classList.remove('had-on');
    if (playing) { stopMusic(true); return; }
    requestStart(false);
  });

  /* 切到背景暫停、回前景續播(僅限原本就在播放時) */
  document.addEventListener('visibilitychange', function () {
    if (!g) return;
    if (document.hidden && playing) {
      Tone.Transport.pause();
      if (g.wind.state === 'started') g.wind.stop();
      setBtn(false); pausedByHide = true;
    } else if (!document.hidden && pausedByHide) {
      pausedByHide = false;
      if (g.wind.state !== 'started') g.wind.start();
      Tone.Transport.start();
      setBtn(true);
    }
  });

  /* 預設開啟；使用者曾明確關閉時維持關閉。瀏覽器若攔截，首次互動後播放。 */
  var savedPref = null;
  try { savedPref = localStorage.getItem(PREF_KEY); } catch (e) {}
  if (savedPref !== '0') {
    btn.classList.add('had-on');
    requestStart(true);
  }
})();
