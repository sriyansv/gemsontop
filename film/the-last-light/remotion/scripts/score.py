"""Original score + sound design for THE LAST LIGHT, synthesised locally (numpy only).

Writes public/audio/score.wav: 45.000 s, 44.1 kHz, stereo, 16-bit.
Cue times are frame-locked to src/film (30 fps). The Scene 4 reveal (27.0–32.17 s) is digital silence.
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
DUR = 45.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)


def fr(frame):
    return frame / 30.0


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    L[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def env(n, a, r, sustain_to=None):
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na) ** 2
    e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def bell(freq, dur, amp=0.3):
    t = np.arange(int(dur * SR)) / SR
    s = (np.sin(2 * np.pi * freq * t) * np.exp(-t * 2.2)
         + 0.45 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * 4.5)
         + 0.2 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t * 8))
    return amp * s * env(len(t), 0.004, 0.2)


def pad(freqs, dur, amp=0.1, a=1.5, r=1.5, bright=6):
    t = np.arange(int(dur * SR)) / SR
    s = np.zeros_like(t)
    for f0 in freqs:
        for det in (-0.12, 0.0, 0.13):
            f = f0 * 2 ** (det / 12)
            for h in range(1, bright + 1):
                s += np.sin(2 * np.pi * f * h * t + rng.random() * 6.28) / (h ** 1.6)
    s *= 1 + 0.15 * np.sin(2 * np.pi * 0.23 * t)
    return amp * s / (len(freqs) * 3) * env(len(t), a, r)


def noise(dur, smooth=40):
    x = rng.standard_normal(int(dur * SR))
    k = np.ones(smooth) / smooth
    return np.convolve(x, k, mode="same")


def wind(dur, amp=0.05):
    x = noise(dur, 400) * 12
    t = np.arange(len(x)) / SR
    return amp * x * (0.6 + 0.4 * np.sin(2 * np.pi * 0.17 * t)) * env(len(x), 1.0, 1.0)


def tick(amp=0.05):
    t = np.arange(int(0.05 * SR)) / SR
    return amp * np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120)


def thud(amp=0.25):
    t = np.arange(int(0.25 * SR)) / SR
    return amp * (np.sin(2 * np.pi * 140 * t * (1 - t)) * np.exp(-t * 28) + 0.3 * noise(0.25, 8) * np.exp(-t * 40))


def flutter(dur, amp=0.035):
    t = np.arange(int(dur * SR)) / SR
    x = noise(dur, 6) - noise(dur, 30)
    return amp * x * (0.5 + 0.5 * np.sin(2 * np.pi * 38 * t)) ** 2 * env(len(t), 0.2, 0.3) * 6


def blip(freq, dur, amp=0.12):
    t = np.arange(int(dur * SR)) / SR
    return amp * np.sin(2 * np.pi * freq * t) * env(len(t), 0.01, 0.05)


def boom(amp=0.6):
    d = 3.5
    t = np.arange(int(d * SR)) / SR
    f = 30 + 70 * np.exp(-t * 3)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.2)
    whoosh = noise(d, 20) * 4 * np.exp(-((t - 0.5) ** 2) / 0.2)
    return amp * (s + 0.25 * whoosh) * env(len(t), 0.005, 0.8)


A4, Cs5, E5 = 440.0, 554.37, 659.25


def motif(start_frame, octave=1.0, amp=0.25, pan=0.0):
    # short – long – short, aligned with lib.ts motif(): beats at +0, +12 (long), +36 frames
    add(bell(A4 * octave, 1.6, amp), fr(start_frame), pan)
    add(bell(E5 * octave, 2.4, amp * 1.15), fr(start_frame + 12), pan)
    add(pad([E5 * octave], fr(18), amp * 0.35, 0.02, 0.25, 3), fr(start_frame + 12), pan)
    add(bell(Cs5 * octave, 2.0, amp), fr(start_frame + 36), pan)


# --- Scene 1: The Silence (0–8 s) ---------------------------------------------
motif(8, 1.0, 0.22)
am = [110.0, 164.81, 220.0, 261.63, 329.63]
for k, (f0, end) in enumerate(zip(am, [7.4, 7.0, 6.6, 6.2, 5.8])):
    add(pad([f0], end - 1.9, 0.11, 1.6, 0.6), 1.9, pan=(k - 2) * 0.25)
add(pad([659.25, 880.0], 3.6, 0.035, 1.2, 1.0, 3), 2.4)
add(blip(220, fr(6)), fr(206))
add(blip(220, fr(18) , 0.1), fr(218))  # second beat cut short; the third never comes

# --- Scene 2: The Frog Boss (8–16 s) -----------------------------------------
add(wind(8.0, 0.05), 8.0)
add(pad([55.0, 82.41], 8.0, 0.12, 1.5, 1.2, 4), 8.1)
for s in np.arange(8.5, 16.0, 1.0):
    add(tick(0.035), s, pan=0.3)
t = np.arange(int(2.6 * SR)) / SR
glide = 0.04 * np.sin(2 * np.pi * np.cumsum(220 + 110 * t / 2.6) / SR) * env(len(t), 0.8, 0.8)
add(glide, 12.6, pan=-0.2)

# --- Scene 3: The Signal (16–25 s) -------------------------------------------
add(pad([73.42, 110.0], 9.2, 0.1, 1.0, 1.6, 4), 16.0)
add(wind(9.0, 0.03), 16.0)
add(flutter(5.0), 16.2, pan=0.4)
add(thud(0.22), fr(480 + 30), pan=0.15)
add(thud(0.18), fr(480 + 55), pan=0.1)
motif(480 + 58, 2.0, 0.07, pan=0.2)
add(pad([220.0, 277.18, 329.63], 4.4, 0.06, 1.4, 1.8), fr(480 + 140))
motif(480 + 180 + 14, 2.0, 0.06, pan=0.4)
motif(480 + 180 + 58, 2.0, 0.03, pan=0.4)

# --- Scene 4: The Awakening (25–38 s) ----------------------------------------
# 4A: everything thins out and is gone by 27.0 s (frame 810).
# 4B: 27.0 – 32.17 s total silence (enforced below).
s4 = 750 + 210  # 4C start, frame 960
motif(s4 + 5, 1.0, 0.3)
amaj = [110.0, 164.81, 220.0, 277.18, 329.63]
add(pad(amaj, 38.6 - fr(s4 + 40), 0.16, 3.5, 0.4, 6), fr(s4 + 40))
arp = [220.0, 277.18, 329.63, 440.0]
step = 60 / 100 / 2
for k, s in enumerate(np.arange(fr(s4 + 60), 38.0, step)):
    g = 0.04 + 0.1 * (s - fr(s4 + 60)) / (38.0 - fr(s4 + 60))
    add(bell(arp[k % 4] * 2, 0.7, g), s, pan=0.35 * np.sin(k))
penta = [880.0, 987.77, 1108.73, 1318.51, 1479.98]
for k in range(26):
    s = fr(s4 + 40) + rng.random() * (38.0 - fr(s4 + 40))
    add(bell(penta[rng.integers(5)], 0.9, 0.025), s, pan=rng.uniform(-0.8, 0.8))

# --- Scene 5: The Last Light (38–45 s) ---------------------------------------
ign = fr(1140 + 4)
add(boom(0.55), ign)
add(pad([55.0, 110.0, 164.81, 220.0, 277.18, 329.63, 440.0], 5.4, 0.22, 0.25, 2.6, 7), ign)
add(pad([659.25, 880.0, 1108.73], 4.8, 0.05, 0.8, 2.4, 3), ign + 0.6)
motif(1140 + 120, 1.0, 0.22)

# --- Mix: space, silence rule, master ----------------------------------------
ir_t = np.arange(int(2.4 * SR)) / SR
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 2.6)
ir[0] = 6.0
nfft = 1 << int(np.ceil(np.log2(N + len(ir))))
IR = np.fft.rfft(ir, nfft)
L = np.fft.irfft(np.fft.rfft(L, nfft) * IR, nfft)[:N]
R = np.fft.irfft(np.fft.rfft(R, nfft) * np.fft.rfft(np.roll(ir, 37), nfft), nfft)[:N]

t = np.arange(N) / SR
gate = np.ones(N)
gate[(t >= 25.0) & (t < 27.0)] = np.linspace(1, 0, np.sum((t >= 25.0) & (t < 27.0))) ** 2
silence = (t >= 27.0) & (t < fr(s4 + 5))
gate[silence] = 0.0
gate[t >= 44.2] *= np.linspace(1, 0, np.sum(t >= 44.2))
L *= gate
R *= gate

peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.89, R / peak * 0.89
L[silence] = 0.0
R[silence] = 0.0

out = Path(sys.argv[1] if len(sys.argv) > 1 else "public/audio/score.wav")
out.parent.mkdir(parents=True, exist_ok=True)
pcm = (np.stack([L, R], axis=1) * 32767).astype("<i2")
with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"wrote {out} · {N / SR:.3f} s · silence {27.0:.2f}–{fr(s4 + 5):.2f} s")
