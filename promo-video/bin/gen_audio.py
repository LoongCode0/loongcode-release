#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LoongCode 宣传片配乐生成器（暗黑·鎏金·电影感）。

按视频四幕 + 关键节点定义「音频时段」，用 numpy 合成一段 47s 立体声配乐，
写出 out/loongcode-promo.wav。视频时间轴（30fps，1410 帧 = 47.0s）：

  幕              帧          秒            音乐处理
  ① 冷开场        0–210      0.00–7.00     低频 drone 渐入 + 小调 pad 涌起 + 龙觉醒微光
  ② 蜕变          210–450    7.00–15.00    终端炸开「冲击」(~10.5s) + 节拍进入
  ③ 界面一览      450–925    15.00–30.83   稳定律动，每屏切换有「点」(F→C 和声)
  ④ 特性卡        925–1210   30.83–40.33   推进感(G 和声)
  ⑤ CTA           1210–1410  40.33–47.00   抬升 + 解决(C) + 龙印收束 + 尾音

只依赖 numpy + 标准库 wave；改时段/和声只需编辑下方 SECTIONS / ACCENTS。
"""
import math
import wave
import numpy as np

SR = 44100
DUR = 47.0
N = int(DUR * SR)

# ---- 视频时间轴锚点（秒）----
T_COLD, T_TRANS, T_SHOW, T_FEAT, T_CTA, T_END = 0.0, 7.0, 15.0, 30.833, 40.333, 47.0
SLIDE = 95 / 30.0  # 每屏/每卡时长 ≈ 3.167s
# showcase 5 屏 + features 3 卡的切换时刻（用于「点」）
TICKS = [T_SHOW + i * SLIDE for i in range(5)] + [T_FEAT + i * SLIDE for i in range(3)]

# ---- 和声时段：(t0, t1, [chord root..] Hz) ----  Am→F→C→G→C 经典抬升
SECTIONS = [
    (0.0, 7.0, [110.00, 130.81, 164.81]),   # Am
    (7.0, 15.0, [110.00, 130.81, 164.81]),  # Am(延续，张力)
    (15.0, 23.0, [87.31, 110.00, 130.81]),  # F
    (23.0, 30.833, [130.81, 164.81, 196.00]),  # C
    (30.833, 40.333, [98.00, 123.47, 146.83]),  # G
    (40.333, 47.0, [130.81, 164.81, 196.00, 261.63]),  # C(解决)
]

# ---- 强拍/冲击时段：(time, kind) ----
ACCENTS = [
    (5.4, "riser"), (5.9, "boom_soft"),   # 龙/字标觉醒
    (9.6, "riser"), (10.5, "boom"),        # 终端炸开 → 界面揭示
    (39.6, "riser"), (40.4, "boom"),       # 进入 CTA
    (43.0, "boom_soft"),                   # 下载强调
]

rng = np.random.default_rng(20260609)  # 固定种子，结果可复现


def place(buf, t, sig):
    i = int(t * SR)
    if i >= len(buf) or i < 0:
        return
    n = min(len(sig), len(buf) - i)
    if n > 0:
        buf[i:i + n] += sig[:n]


def adsr(n, a, d, r, sl=0.7):
    """attack/decay/sustain/release 包络（秒），返回长度 n。"""
    env = np.zeros(n)
    ai, di, ri = int(a * SR), int(d * SR), int(r * SR)
    ai = min(ai, n)
    env[:ai] = np.linspace(0, 1, ai, endpoint=False) if ai else 0
    di = min(di, n - ai)
    if di > 0:
        env[ai:ai + di] = np.linspace(1, sl, di, endpoint=False)
    si = max(0, n - ai - di - ri)
    env[ai + di:ai + di + si] = sl
    if ri > 0:
        env[n - ri:] = np.linspace(sl, 0, ri)
    return env


def chord(freqs, dur, attack=0.9, release=1.2, detune=0.004, gain=0.18):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, f in enumerate(freqs):
        # 每个音用两条微失谐正弦 + 一条上方八度弱泛音，营造温暖 pad
        for dt in (-detune, detune):
            out += np.sin(2 * np.pi * f * (1 + dt) * t) * (0.6 / (k + 1))
        out += 0.18 * np.sin(2 * np.pi * 2 * f * t) / (k + 1)
    env = adsr(n, attack, 0.6, release, sl=0.82)
    # 缓慢颤动让 pad 更活
    lfo = 1 + 0.06 * np.sin(2 * np.pi * 0.18 * t)
    return out * env * lfo * gain


def sub(freq, dur, attack=0.8, release=1.0, gain=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * 2 * freq * t)
    return s * adsr(n, attack, 0.5, release, sl=0.9) * gain


def kick(gain=0.9):
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    pitch = 110 * np.exp(-t * 32) + 42      # 快速下滑
    body = np.sin(2 * np.pi * np.cumsum(pitch) / SR)
    env = np.exp(-t * 9)
    click = np.exp(-t * 200) * 0.4
    return (body * env + click) * gain


def boom(gain=1.0, length=2.4):
    n = int(length * SR)
    t = np.arange(n) / SR
    low = np.sin(2 * np.pi * 40 * t) + 0.6 * np.sin(2 * np.pi * 28 * t)
    env = np.exp(-t * 2.2)
    noise = rng.standard_normal(n) * np.exp(-t * 9) * 0.5  # 冲击瞬态
    tail = np.sin(2 * np.pi * 80 * t) * np.exp(-t * 1.2) * 0.3
    return (low * env + noise + tail) * gain


def riser(length=1.3, gain=0.5):
    n = int(length * SR)
    t = np.arange(n) / SR
    sweep = np.sin(2 * np.pi * (180 + (1800 - 180) * (t / length) ** 2) * t)
    noise = rng.standard_normal(n)
    noise = np.diff(noise, prepend=0.0)     # 简易高通 → 嘶声
    env = (t / length) ** 2                  # 渐强
    return (0.5 * sweep + 0.5 * noise) * env * gain


def tick(gain=0.32):
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    h = rng.standard_normal(n)
    h = np.diff(h, prepend=0.0)             # 高通噪声 → hat
    return h * np.exp(-t * 60) * gain


def shimmer(times, base=880.0, gain=0.16):
    """高音琶音微光（龙觉醒 / CTA）。"""
    sig = np.zeros(N)
    ratios = [1.0, 1.25, 1.5, 2.0, 2.5]
    for j, tt in enumerate(times):
        f = base * ratios[j % len(ratios)]
        n = int(1.1 * SR)
        t = np.arange(n) / SR
        bell = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 2 * f * t)
        place(sig, tt, bell * np.exp(-t * 3.5) * gain)
    return sig


def main():
    buf = np.zeros(N)

    # 1) 和声 pad + 跟随和声根音的 sub（带交叠淡变）
    for (t0, t1, freqs) in SECTIONS:
        dur = t1 - t0 + 1.0           # 多 1s 让 release 交叠到下一段
        place(buf, t0, chord(freqs, dur))
        place(buf, t0, sub(freqs[0] / 2.0, dur, gain=0.42))

    # 2) 节拍（律动）：四分音符网格，对齐到 15.0s 切屏点
    beat = SLIDE / 4.0               # ≈0.792s（76 BPM 的二倍细分感）
    phase0 = T_SHOW - math.floor((T_SHOW - 0.0) / beat) * beat
    t = phase0
    while t < T_CTA + 0.2:
        # 律动强度：蜕变淡入(10s) → 一览/特性满 → 进 CTA 淡出
        if t < 10.0:
            g = 0.0
        elif t < 15.0:
            g = 0.55 * (t - 10.0) / 5.0
        elif t < T_FEAT:
            g = 0.62
        elif t < 40.0:
            g = 0.62
        else:
            g = max(0.0, 0.62 * (40.4 - t) / 0.4)
        if g > 0.01:
            place(buf, t, kick(gain=g))
            place(buf, t + beat / 2, tick(gain=0.18 * g))  # 弱反拍 hat
        t += beat

    # 3) 切屏/换卡「点」
    for tt in TICKS:
        place(buf, tt, tick(gain=0.5))

    # 4) 冲击与渐强
    for (tt, kind) in ACCENTS:
        if kind == "riser":
            place(buf, tt, riser())
        elif kind == "boom":
            place(buf, tt, boom(gain=1.0))
        elif kind == "boom_soft":
            place(buf, tt, boom(gain=0.55, length=1.8))

    # 5) 微光琶音
    buf += shimmer([3.6, 4.2, 4.8, 5.4], base=880, gain=0.14)        # 龙觉醒
    buf += shimmer([41.0, 41.8, 42.6, 43.4, 44.2], base=1046, gain=0.13)  # CTA

    # ---- 母带：软限幅 + 整体淡入淡出 ----
    buf = np.tanh(buf * 1.05)
    peak = np.max(np.abs(buf)) or 1.0
    buf = buf / peak * 0.85  # 留 ~1.4dB 余量，避免削顶
    fi = int(0.8 * SR)
    buf[:fi] *= np.linspace(0, 1, fi)
    fo = int(1.6 * SR)
    buf[-fo:] *= np.linspace(1, 0, fo)

    # ---- 立体声（Haas 微展宽）----
    delay = int(0.006 * SR)
    right = np.concatenate([np.zeros(delay), buf[:-delay]]) * 0.96
    stereo = np.stack([buf, right], axis=1)
    pcm = (np.clip(stereo, -1, 1) * 32767).astype("<i2")

    out_path = "out/loongcode-promo.wav"
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"wrote {out_path}  ({DUR:.1f}s, {SR}Hz stereo)")


if __name__ == "__main__":
    main()
