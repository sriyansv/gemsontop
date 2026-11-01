"""Original royal score for ELYZIUMA: THE ROYAL ARRIVAL, synthesised locally (numpy only).

120 BPM (one beat = 15 frames at 30 fps). Every hit is frame-locked to src/royal/World.tsx.
Writes public/audio/royal-score.wav: 45.000 s, 44.1 kHz, stereo, 16-bit.
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
N = SR * 45
rng = np.random.default_rng(3)
L = np.zeros(N)
R = np.zeros(N)
BEAT = 0.5


def fr(frame):
    return frame / 30.0


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i] * gain
    L[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def tvec(d):
    return np.arange(int(d * SR)) / SR


def env(n, a, r):
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def note(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def saw(f, t, n=10):
    return sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, n + 1))


def lp(x, k=8):
    return np.convolve(x, np.ones(k) / k, mode="same")


def pad(ms, d, amp=0.08, a=1.0, r=1.0):
    t = tvec(d)
    s = sum(saw(note(m) * 2 ** (det / 1200), t, 6) for m in ms for det in (-8, 8))
    return amp * lp(s, 12) / (2 * len(ms)) * env(len(t), a, r)


def brass(ms, d=0.45, amp=0.22):
    t = tvec(d)
    bright = np.minimum(1, t / 0.04) * np.exp(-t * 3)
    s = sum(saw(note(m), t, 4 + int(8 * bright.mean())) for m in ms)
    return amp * lp(s, 5) / len(ms) * env(len(t), 0.015, 0.18) * (0.6 + 0.4 * bright)


def pluck(m, d=0.35, amp=0.09):
    t = tvec(d)
    return amp * saw(note(m), t, 7) * np.exp(-t * 11) * env(len(t), 0.002, 0.05)


def bell(m, d=1.8, amp=0.18):
    t = tvec(d)
    f = note(m)
    return amp * (np.sin(2 * np.pi * f * t) * np.exp(-t * 2.5) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 5)) * env(len(t), 0.003, 0.2)


def noise(d):
    return rng.standard_normal(int(d * SR))


def kick(amp=0.5):
    t = tvec(0.35)
    f = 45 + 110 * np.exp(-t * 30)
    return amp * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def timpani(m=38, amp=0.55):
    t = tvec(1.4)
    f = note(m) * (1 + 0.08 * np.exp(-t * 20))
    return amp * (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3) + 0.15 * lp(noise(1.4), 30) * np.exp(-t * 18))


def clap(amp=0.18):
    t = tvec(0.2)
    x = noise(0.2) - lp(noise(0.2), 6)
    return amp * x * (np.exp(-t * 35) + 0.5 * np.exp(-((t - 0.012) * 40) ** 2))


def hat(amp=0.05):
    t = tvec(0.06)
    x = noise(0.06) - lp(noise(0.06), 3)
    return amp * x * np.exp(-t * 80)


def crash(amp=0.22, d=2.2):
    t = tvec(d)
    x = noise(d) - lp(noise(d), 4)
    return amp * x * np.exp(-t * 2.2)


def snare(amp=0.15):
    t = tvec(0.22)
    return amp * ((noise(0.22) - lp(noise(0.22), 4)) * np.exp(-t * 22) + 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30))


def step(amp=0.09):
    t = tvec(0.12)
    return amp * (np.sin(2 * np.pi * 120 * t) * np.exp(-t * 45) + 0.3 * lp(noise(0.12), 6) * np.exp(-t * 60))


def riser(d, amp=0.12):
    t = tvec(d)
    f = 200 * (4 ** (t / d))
    return amp * (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5 + (noise(d) - lp(noise(d), 3)) * 0.5) * (t / d) ** 2


def sizzle(d=1.0, amp=0.1):
    t = tvec(d)
    return amp * (noise(d) - lp(noise(d), 2)) * np.exp(-t * 2.5) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t))


def whoosh(d=0.8, amp=0.18):
    t = tvec(d)
    return amp * lp(noise(d), 10) * 3 * np.sin(np.pi * t / d) ** 2


def zap(amp=0.12):
    t = tvec(0.35)
    f = 2200 * np.exp(-t * 9) + 150
    return amp * np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 6) * 0.5


D, Fs, A, B, G = 62, 66, 69, 71, 67  # D major palette

# 0–7 s: mysterious royal hall (D minor colour), footsteps on the walk
add(pad([38, 45, 50, 53], 7.4, 0.11, 2.0, 0.5), 0.0)
add(pad([62, 65, 69], 5.0, 0.03, 2.5, 1.5), 1.5)
for k in range(10):
    add(step(), fr(30 + 15 * k), pan=-0.3 + 0.06 * k)
add(whoosh(1.2, 0.1), fr(4))

# 7 s: harp gliss up, 8 s: timpani + bell — crown lands
for k, m in enumerate([62, 66, 69, 74, 78, 81, 86, 90]):
    add(pluck(m, 0.6, 0.07), 7.0 + k * 0.06, pan=-0.5 + k * 0.13)
add(timpani(38, 0.6), fr(240))
add(bell(86, 2.4, 0.2), fr(240))
add(crash(0.12, 2.0), fr(240))
add(pad([50, 57, 62, 66], 2.2, 0.06, 0.2, 1.0), fr(240))

# 10–14 s: transformation riser + swirling arpeggio
add(riser(4.0, 0.12), 10.0)
arp = [62, 66, 69, 74, 69, 66]
for k in range(32):
    add(pluck(arp[k % 6] + 12 * (k // 16), 0.3, 0.05 + 0.002 * k), 10.0 + k * 0.125, pan=np.sin(k * 0.7) * 0.6)

# 14 s: fanfare reveal
FAN = [50, 62, 66, 69, 74]
add(brass(FAN, 0.9, 0.32), fr(420))
add(timpani(38, 0.55), fr(420))
add(crash(0.2), fr(420))
# 14–19 s: royal march
for k in range(10):
    s = 14.0 + k * BEAT
    if k % 2:
        add(snare(0.08), s)
    add(pluck([62, 66, 69, 66][k % 4], 0.4, 0.06), s, pan=0.3)
    add(pluck([74, 78, 81, 78][k % 4], 0.3, 0.035), s + 0.25, pan=-0.3)
add(pad([50, 57, 62, 66], 5.0, 0.07, 0.5, 0.5), 14.0)

# 19 s: sits — downbeat, groove begins
add(brass([50, 62, 66, 69], 0.5, 0.25), fr(570))
add(timpani(38, 0.45), fr(570))
CH = [[50, 62, 66, 69], [47, 59, 62, 66], [43, 55, 59, 62], [45, 57, 61, 64]]  # D Bm G A
BASS = [[38, 38, 45, 38], [35, 35, 42, 35], [31, 31, 38, 31], [33, 33, 40, 33]]


def groove(t0, t1, full=1.0, skip=None):
    bars = int(round((t1 - t0) / 2.0))
    for bar in range(bars):
        ch = CH[bar % 4]
        add(pad(ch[1:], 2.0, 0.045 * full, 0.05, 0.3), t0 + bar * 2.0)
        for b in range(4):
            s = t0 + bar * 2.0 + b * BEAT
            if skip and skip[0] <= s < skip[1]:
                continue
            add(kick(0.42 * full), s)
            if b % 2:
                add(clap(0.16 * full), s)
            add(hat(0.05), s + 0.25, pan=0.4)
            if full > 1.0:
                add(hat(0.04), s + 0.125, pan=-0.4)
                add(hat(0.04), s + 0.375, pan=-0.4)
            bm = BASS[bar % 4][b]
            t = tvec(0.42)
            add(0.2 * np.sin(2 * np.pi * note(bm) * t) * np.exp(-t * 5) + 0.06 * saw(note(bm), t, 4) * np.exp(-t * 8), s)
            add(pluck(ch[(b + 1) % 4] + 12, 0.25, 0.04), s + 0.25, pan=-0.2)


groove(20.0, 28.0)
# entrances
add(brass([50, 62, 66, 69], 0.4, 0.22), fr(600))
add(sizzle(1.4, 0.11), fr(600), pan=-0.5)
add(whoosh(0.5, 0.12), fr(600) - 0.25)
add(brass([47, 59, 62, 66], 0.4, 0.2), fr(690))
add(whoosh(1.4, 0.16), fr(690), pan=-0.4)
add(bell(83, 1.5, 0.08), fr(735))
add(brass([43, 55, 59, 62], 0.4, 0.22), fr(780))
add(zap(0.13), fr(840), pan=0.3)
add(brass([55, 67, 71, 74], 0.25, 0.18), fr(840))
# 28.7 s: everything drops out, a riser into the Boss
add(riser(1.2, 0.14), fr(862) - 1.2)
# 29 s: THE DROP — Frog Boss
add(brass([38, 50, 62, 66, 69, 74], 1.2, 0.36), fr(870))
add(kick(0.7), fr(870))
add(timpani(26, 0.6), fr(870))
add(crash(0.25, 2.6), fr(870))
for k in range(3):
    add(step(0.16), fr(870 + 20 * k + 10), pan=-0.2)
add(bell(93, 1.2, 0.12), fr(930), pan=0.4)
add(brass([45, 57, 61, 64, 69], 0.5, 0.25), fr(930))
groove(29.0, 32.0, 1.0, skip=(29.0, 29.6))
# 32–40 s: the dance — peak energy
groove(32.0, 40.0, 1.25)
for bar in range(4):
    add(brass(CH[bar % 4], 0.3, 0.16), 32.0 + bar * 2.0)
for k in range(8):
    add(snare(0.06 + 0.012 * k), 39.5 + k * 0.0625)
# 40 s: final pose hit, ring-out, button chime
add(brass([38, 50, 62, 66, 69, 74, 78], 2.6, 0.38), fr(1200))
add(timpani(38, 0.6), fr(1200))
add(kick(0.6), fr(1200))
add(crash(0.28, 3.5), fr(1200))
add(pad([50, 57, 62, 66, 69, 74], 4.5, 0.09, 0.05, 2.0), fr(1200))
for k, m in enumerate([86, 90, 93, 98]):
    add(bell(m, 1.6, 0.08), 40.5 + k * 0.12, pan=-0.4 + k * 0.25)
add(bell(86, 2.5, 0.16), 44.0)
add(bell(81, 2.5, 0.1), 44.0)

# space + master
ir_t = tvec(1.6)
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 4.0) * 0.25
ir[0] = 1.0
nfft = 1 << int(np.ceil(np.log2(N + len(ir))))
IR = np.fft.rfft(ir, nfft)
L = np.fft.irfft(np.fft.rfft(L, nfft) * IR, nfft)[:N]
R = np.fft.irfft(np.fft.rfft(R, nfft) * np.fft.rfft(np.roll(ir, 29), nfft), nfft)[:N]
t = np.arange(N) / SR
gate = np.ones(N)
drop = (t >= fr(862)) & (t < fr(870))
gate[drop] = 0.08
fade = t >= 44.4
gate[fade] = np.linspace(1, 0, fade.sum())
L *= gate
R *= gate
L = np.tanh(L * 1.4) / 1.4
R = np.tanh(R * 1.4) / 1.4
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.9, R / peak * 0.9

out = Path(sys.argv[1] if len(sys.argv) > 1 else "public/audio/royal-score.wav")
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.stack([L, R], 1) * 32767).astype("<i2").tobytes())
print(f"wrote {out} · {N / SR:.3f} s · 120 BPM")
