import React from 'react';

export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@700;800&display=swap');

      :root {
        --bg: #f5f7fb;
        --surface: #ffffff;
        --surface-soft: #f8fafc;
        --surface-tint: #fff7ed;
        --text: #111827;
        --muted: #64748b;
        --subtle: #94a3b8;
        --line: #e2e8f0;
        --line-strong: #cbd5e1;
        --accent: #e97125;
        --accent-soft: #fff1e7;
        --green: #15956d;
        --blue: #2563eb;
        --danger: #b42318;
        --radius: 10px;
        --shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        --shadow-soft: 0 8px 20px rgba(15, 23, 42, .06);
      }

      *, *::before, *::after { box-sizing: border-box; }
      html { min-height: 100%; background: var(--bg); }
      body {
        margin: 0;
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        font-family: 'Inter', Arial, sans-serif;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
      }

      body,
      button,
      input,
      select,
      textarea {
        font: 500 15px/1.5 'Inter', Arial, sans-serif;
      }

      button,
      input,
      select,
      textarea { color: inherit; }
      button { border: 0; cursor: pointer; }
      button:disabled { cursor: not-allowed; opacity: .62; }
      select { appearance: none; }

      .app-wrap {
        width: 100%;
        min-height: 100dvh;
        background:
          radial-gradient(circle at top left, rgba(233, 113, 37, .16), transparent 30rem),
          radial-gradient(circle at bottom right, rgba(21, 149, 109, .12), transparent 28rem),
          var(--bg);
      }

      .profile-fab {
        position: fixed;
        top: 16px;
        right: 18px;
        z-index: 100;
      }

      .profile-trigger {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(255, 255, 255, .56);
        border-radius: 16px;
        background: rgba(255, 255, 255, .82);
        box-shadow: 0 12px 30px rgba(15, 23, 42, .16);
        backdrop-filter: blur(14px);
        color: #24160f;
        transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
      }

      .profile-trigger:hover {
        transform: translateY(-2px);
        background: #fff;
        box-shadow: 0 18px 36px rgba(15, 23, 42, .2);
      }

      .profile-trigger span,
      .profile-avatar {
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-weight: 800;
      }

      .profile-dropdown {
        position: absolute;
        top: 58px;
        right: 0;
        width: min(300px, calc(100vw - 32px));
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: 16px;
        background: rgba(255, 255, 255, .96);
        box-shadow: var(--shadow);
        backdrop-filter: blur(18px);
      }

      .profile-summary {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--line);
      }

      .profile-avatar {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: #24160f;
        color: #fff;
      }

      .profile-name {
        color: var(--text);
        font-size: 14px;
        font-weight: 900;
      }

      .profile-role {
        margin-top: 1px;
        color: var(--accent);
        font-size: 12px;
        font-weight: 900;
      }

      .profile-email {
        margin: 12px 0;
        color: var(--muted);
        font-size: 12px;
        font-weight: 700;
        overflow-wrap: anywhere;
      }

      .profile-logout {
        width: 100%;
        min-height: 42px;
        border-radius: 12px;
        background: #fee2e2;
        color: #b91c1c;
        font-weight: 900;
      }

      .home,
      .auth-page {
        width: 100%;
        min-height: 100vh;
        display: flex;
        align-items: stretch;
      }

      .landing-auth {
        position: relative;
        min-height: 100dvh;
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(340px, .85fr);
        gap: clamp(24px, 5vw, 76px);
        padding: clamp(24px, 5vw, 72px);
        overflow: hidden;
        background:
          linear-gradient(180deg, rgba(255, 246, 223, .96), rgba(255, 255, 255, .86) 48%, rgba(233, 247, 239, .9)),
          radial-gradient(circle at 18% 20%, rgba(233, 113, 37, .28), transparent 20rem),
          radial-gradient(circle at 82% 16%, rgba(37, 99, 235, .18), transparent 22rem),
          radial-gradient(circle at 52% 82%, rgba(21, 149, 109, .14), transparent 22rem),
          #fff5df;
      }

      .festive-sky {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }

      .flag-line {
        position: absolute;
        left: -5vw;
        right: -5vw;
        top: 28px;
        height: 32px;
        display: flex;
        justify-content: center;
        gap: 13px;
        transform: rotate(-2deg);
        opacity: .86;
      }

      .flag-line-b {
        top: 92px;
        transform: rotate(2deg);
        opacity: .58;
      }

      .flag-line span {
        width: 23px;
        height: 28px;
        clip-path: polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%);
        box-shadow: 0 7px 18px rgba(15, 23, 42, .12);
        animation: flagwave 2.8s ease-in-out infinite alternate;
      }

      .flag-line span:nth-child(2n) { animation-delay: .28s; }
      @keyframes flagwave {
        from { transform: translateY(0) rotate(-2deg); }
        to { transform: translateY(5px) rotate(2deg); }
      }

      .rocket {
        position: absolute;
        width: 3px;
        height: 42px;
        border-radius: 999px;
        background: linear-gradient(#ef4444, #facc15, transparent);
        color: transparent;
        filter: drop-shadow(0 0 10px rgba(239, 68, 68, .45));
        animation: rocketlaunch 5s ease-in-out infinite;
      }

      .rocket-a { left: 18%; bottom: -70px; animation-delay: .4s; }
      .rocket-b { right: 26%; bottom: -90px; animation-delay: 2.1s; }
      @keyframes rocketlaunch {
        0%, 45% { transform: translateY(0) scaleY(.8); opacity: 0; }
        58% { opacity: 1; }
        100% { transform: translateY(-118vh) scaleY(1.1); opacity: 0; }
      }

      .spark {
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 999px;
        border: 2px solid rgba(233, 113, 37, .78);
        animation: sparkle 3.8s ease-in-out infinite;
      }

      .spark-a { left: 16%; top: 28%; }
      .spark-b { left: 48%; top: 18%; border-color: rgba(37, 99, 235, .72); animation-delay: .9s; }
      .spark-c { right: 15%; top: 38%; border-color: rgba(21, 149, 109, .72); animation-delay: 1.8s; }
      @keyframes sparkle {
        0%, 100% { transform: scale(.45); opacity: .1; }
        45% { transform: scale(1.55); opacity: .75; }
      }

      .arraial-scene {
        position: relative;
        width: min(760px, 100%);
        min-height: 230px;
        margin: 30px auto 0;
        border: 1px solid rgba(120, 84, 56, .14);
        border-radius: 20px;
        overflow: hidden;
        background:
          linear-gradient(180deg, rgba(54, 33, 21, .9), rgba(92, 49, 31, .78) 58%, rgba(37, 83, 55, .84)),
          #3b2418;
        box-shadow: 0 24px 50px rgba(36, 22, 15, .18);
      }

      .arraial-scene::before {
        content: '';
        position: absolute;
        left: -8%;
        right: -8%;
        bottom: -34px;
        height: 92px;
        border-radius: 50%;
        background: linear-gradient(90deg, #244c35, #3d6b3e, #244c35);
      }

      .moon {
        position: absolute;
        top: 26px;
        right: 42px;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: #ffe8a3;
        box-shadow: 0 0 38px rgba(255, 232, 163, .54);
      }

      .string-lights {
        position: absolute;
        left: 5%;
        right: 5%;
        top: 32px;
        display: flex;
        justify-content: space-between;
        transform: rotate(-2deg);
      }

      .string-lights::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 5px;
        height: 2px;
        background: rgba(255, 255, 255, .34);
      }

      .string-lights span {
        width: 12px;
        height: 18px;
        position: relative;
        border-radius: 999px;
        background: #facc15;
        box-shadow: 0 0 18px rgba(250, 204, 21, .84);
        animation: lightblink 2.6s ease-in-out infinite;
      }

      .string-lights span:nth-child(2n) { background: #fb7185; box-shadow: 0 0 18px rgba(251, 113, 133, .78); animation-delay: .35s; }
      .string-lights span:nth-child(3n) { background: #60a5fa; box-shadow: 0 0 18px rgba(96, 165, 250, .78); animation-delay: .7s; }
      @keyframes lightblink {
        0%, 100% { opacity: .62; transform: translateY(0); }
        50% { opacity: 1; transform: translateY(4px); }
      }

      .bonfire {
        position: absolute;
        left: 50%;
        bottom: 42px;
        width: 110px;
        height: 126px;
        transform: translateX(-50%);
      }

      .flame {
        position: absolute;
        left: 50%;
        bottom: 24px;
        border-radius: 55% 55% 48% 48%;
        transform: translateX(-50%) rotate(45deg);
        transform-origin: bottom center;
        animation: flame 1.2s ease-in-out infinite alternate;
      }

      .flame-a { width: 64px; height: 64px; background: #ef4444; box-shadow: 0 0 32px rgba(239, 68, 68, .58); }
      .flame-b { width: 46px; height: 46px; bottom: 28px; background: #f97316; animation-delay: .18s; }
      .flame-c { width: 28px; height: 28px; bottom: 33px; background: #fde68a; animation-delay: .32s; }
      @keyframes flame {
        from { transform: translateX(-50%) rotate(39deg) scale(.96); }
        to { transform: translateX(-50%) rotate(49deg) scale(1.05); }
      }

      .wood {
        position: absolute;
        left: 50%;
        bottom: 16px;
        width: 92px;
        height: 12px;
        border-radius: 999px;
        background: #6b341b;
      }

      .wood-a { transform: translateX(-50%) rotate(18deg); }
      .wood-b { transform: translateX(-50%) rotate(-18deg); }

      .scene-card {
        position: absolute;
        min-width: 168px;
        padding: 12px 14px;
        border: 1px solid rgba(255, 255, 255, .24);
        border-radius: 14px;
        background: rgba(255, 255, 255, .16);
        backdrop-filter: blur(10px);
        text-align: left;
        color: #fff;
      }

      .scene-card strong,
      .scene-card span {
        display: block;
      }

      .scene-card strong {
        font-size: 13px;
        font-weight: 900;
      }

      .scene-card span {
        margin-top: 3px;
        color: rgba(255, 255, 255, .78);
        font-size: 12px;
        font-weight: 700;
      }

      .scene-card-a { left: 26px; bottom: 32px; }
      .scene-card-b { right: 26px; bottom: 32px; }

      .arraial-picker {
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin-top: 18px;
        padding: 6px;
        border: 1px solid rgba(120, 84, 56, .14);
        border-radius: 14px;
        background: rgba(255, 255, 255, .62);
        backdrop-filter: blur(12px);
      }

      .arraial-picker button {
        min-height: 38px;
        padding: 8px 13px;
        border-radius: 10px;
        background: transparent;
        color: #6b5548;
        font-size: 12px;
        font-weight: 900;
        transition: background .18s ease, color .18s ease, transform .18s ease;
      }

      .arraial-picker button:hover {
        transform: translateY(-1px);
        background: rgba(255, 255, 255, .72);
      }

      .arraial-picker button.active {
        background: #24160f;
        color: #fff;
      }

      .landing-hero,
      .landing-panel {
        position: relative;
        z-index: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .landing-hero {
        align-items: center;
        text-align: center;
        padding-top: 52px;
      }

      .landing-kicker {
        display: inline-flex;
        align-items: center;
        min-height: 34px;
        margin-bottom: 18px;
        padding: 7px 13px;
        border: 1px solid rgba(217, 119, 6, .24);
        border-radius: 999px;
        background: rgba(255, 255, 255, .66);
        color: #9a3412;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .landing-hero h1 {
        margin: 0;
        max-width: 780px;
        color: #24160f;
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: clamp(56px, 10vw, 128px);
        line-height: .88;
        font-weight: 800;
        letter-spacing: 0;
      }

      .landing-hero p {
        max-width: 680px;
        margin: 24px auto 0;
        color: #5d4032;
        font-size: clamp(16px, 1.8vw, 21px);
        font-weight: 600;
      }

      .landing-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 12px;
        margin-top: 28px;
      }

      .landing-primary {
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 20px;
        border-radius: 12px;
        background: #24160f;
        color: #fff;
        text-decoration: none;
        font-weight: 900;
        box-shadow: 0 14px 30px rgba(36, 22, 15, .18);
        transition: transform .18s ease, box-shadow .18s ease;
      }

      .landing-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 36px rgba(36, 22, 15, .24);
      }

      .landing-live {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border: 1px solid rgba(21, 149, 109, .2);
        border-radius: 12px;
        background: rgba(255, 255, 255, .72);
        color: #0f6e56;
        font-weight: 900;
      }

      .landing-metrics {
        width: min(760px, 100%);
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-top: 36px;
      }

      .landing-metrics div {
        min-width: 0;
        padding: 16px;
        border: 1px solid rgba(120, 84, 56, .12);
        border-radius: 14px;
        background: rgba(255, 255, 255, .58);
        backdrop-filter: blur(12px);
        transition: transform .18s ease, background .18s ease;
      }

      .landing-metrics div:hover {
        transform: translateY(-3px);
        background: rgba(255, 255, 255, .84);
      }

      .landing-metrics strong,
      .landing-metrics span {
        display: block;
      }

      .landing-metrics strong {
        color: #24160f;
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: 18px;
        font-weight: 800;
      }

      .landing-metrics span {
        margin-top: 4px;
        color: #6b5548;
        font-size: 12px;
        font-weight: 700;
      }

      .landing-panel {
        align-items: center;
      }

      .auth-card-polished {
        max-width: 430px;
        border-radius: 18px;
        background: rgba(255, 255, 255, .9);
        backdrop-filter: blur(18px);
        box-shadow: 0 22px 54px rgba(36, 22, 15, .12);
      }

      .auth-heading {
        display: flex;
        align-items: center;
        gap: 13px;
        margin-bottom: 22px;
      }

      .auth-icon {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: #24160f;
        color: #fff;
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-weight: 800;
      }

      .auth-heading h2 {
        margin: 0;
        color: var(--text);
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: 25px;
        line-height: 1.05;
      }

      .auth-heading p {
        margin: 3px 0 0;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
      }

      .icon-field-btn {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        min-width: 36px;
        min-height: 34px;
        border-radius: 9px;
        background: var(--surface-soft);
        color: var(--muted);
        font-size: 11px;
        font-weight: 900;
      }

      .password-meter {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 7px;
      }

      .password-meter-track {
        flex: 1;
        height: 5px;
        overflow: hidden;
        border-radius: 999px;
        background: #e2e8f0;
      }

      .password-meter-track div {
        height: 100%;
        border-radius: inherit;
        transition: width .25s ease;
      }

      .password-meter span {
        min-width: 54px;
        font-size: 11px;
        font-weight: 900;
        text-align: right;
      }

      .landing-submit {
        background: linear-gradient(135deg, #e97125, #15956d);
      }

      @media (max-width: 968px) {
        .auth-page {
          flex-direction: column;
        }
      }

      .home-logo {
        min-width: 0;
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 720px;
        color: var(--text);
      }

      .home-kicker {
        width: fit-content;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 18px;
        padding: 8px 12px;
        border: 1px solid #fed7aa;
        border-radius: 999px;
        background: rgba(255, 247, 237, .86);
        color: #b45309;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .04em;
        text-transform: uppercase;
      }

      .home-logo h1 {
        margin: 0;
        color: var(--text);
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: clamp(48px, 7vw, 96px);
        line-height: .98;
        font-weight: 800;
        letter-spacing: 0;
      }

      .home-logo p {
        margin: 18px 0 0;
        max-width: 620px;
        color: var(--muted);
        font-size: clamp(16px, 1.6vw, 20px);
        font-weight: 500;
      }

      .home-footnote {
        color: var(--subtle) !important;
        font-size: 14px !important;
      }

      .home-cards {
        min-width: 0;
        align-self: center;
        display: grid;
        gap: 14px;
      }

      .home-card {
        width: 100%;
        min-height: 148px;
        position: relative;
        display: grid;
        grid-template-columns: 58px minmax(0, 1fr) 34px;
        align-items: center;
        gap: 18px;
        padding: clamp(20px, 2.4vw, 30px);
        border: 1px solid var(--line);
        border-radius: 14px;
        background: rgba(255, 255, 255, .88);
        box-shadow: var(--shadow-soft);
        text-align: left;
        overflow: hidden;
        transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;
      }

      .home-card::before {
        content: '';
        position: absolute;
        inset: 0 auto 0 0;
        width: 5px;
        background: currentColor;
        opacity: .9;
      }

      .home-card:hover {
        transform: translateY(-4px);
        border-color: var(--line-strong);
        background: #fff;
        box-shadow: var(--shadow);
      }

      .home-card-icon {
        width: 58px;
        height: 58px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: color-mix(in srgb, currentColor 12%, white);
        font-size: 22px;
        font-weight: 900;
      }

      .home-card h2 {
        margin: 0;
        color: var(--text) !important;
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: clamp(22px, 2.1vw, 30px);
        line-height: 1.05;
        font-weight: 800;
      }

      .home-card p {
        margin: 8px 0 0;
        color: var(--muted);
        font-size: 15px;
        font-weight: 500;
      }

      .home-card-arrow {
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: var(--surface-soft);
        color: var(--muted);
        font-size: 18px;
        font-weight: 900;
        transition: transform .2s ease, color .2s ease;
      }

      .home-card:hover .home-card-arrow { transform: translateX(4px); color: currentColor; }

      .auth-card {
        width: 100%;
        background: #fff;
        border: 1px solid var(--line);
        border-radius: 24px;
        padding: clamp(22px, 3vw, 34px);
        box-shadow: var(--shadow);
      }

      .mode-tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        padding: 5px;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: var(--surface-soft);
        margin-bottom: 22px;
      }

      .mode-tab {
        min-height: 44px;
        border-radius: 9px;
        background: transparent;
        color: var(--muted);
        font-weight: 800;
        transition: background .18s ease, color .18s ease, box-shadow .18s ease;
      }

      .mode-tab.active {
        background: var(--text);
        color: #fff;
        box-shadow: 0 8px 18px rgba(17, 24, 39, .18);
      }

      .phone {
        width: 100%;
        min-height: 100dvh;
        display: grid;
        grid-template-columns: 268px minmax(0, 1fr);
        grid-template-rows: auto minmax(0, 1fr);
        background: var(--bg);
        overflow: hidden;
      }

      .statusbar { display: none; }

      .topbar {
        grid-column: 2;
        grid-row: 1;
        min-height: 86px;
        display: grid;
        grid-template-columns: 46px minmax(0, 1fr) 46px;
        align-items: center;
        gap: 14px;
        padding: 18px clamp(20px, 3vw, 34px);
        border-bottom: 1px solid rgba(255, 255, 255, .18);
      }

      .topbar-heading { min-width: 0; text-align: left; }
      .topbar-title {
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: clamp(23px, 2.5vw, 34px);
        line-height: 1.05;
        font-weight: 800;
        letter-spacing: 0;
      }

      .topbar-subtitle {
        margin-top: 5px;
        max-width: 100%;
        opacity: .84;
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .back-btn {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: rgba(255, 255, 255, .18);
        font-size: 18px;
        font-weight: 900;
        transition: transform .18s ease, background .18s ease;
      }

      .back-btn:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, .28);
      }

      .screen-body {
        grid-column: 2;
        grid-row: 2;
        min-height: 0;
        overflow: auto;
        padding: clamp(18px, 3vw, 34px);
        background: var(--bg);
      }

      .screen-body-compact { min-height: auto; }

      .navbar {
        grid-column: 1;
        grid-row: 1 / 3;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 22px 14px;
        background: #0f172a;
        border-right: 1px solid rgba(255, 255, 255, .08);
        box-shadow: 10px 0 34px rgba(15, 23, 42, .09);
      }

      .navbar::before {
        content: 'Arraia Show';
        display: block;
        margin: 6px 10px 20px;
        color: #fff;
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: 23px;
        line-height: 1;
        font-weight: 800;
      }

      .nav-item {
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 11px;
        padding: 0 12px;
        border-radius: 12px;
        background: transparent;
        color: #cbd5e1;
        font-size: 13px;
        font-weight: 800;
        text-align: left;
        transition: background .18s ease, color .18s ease, transform .18s ease;
      }

      .nav-item:hover {
        transform: translateX(2px);
        background: rgba(255, 255, 255, .08);
        color: #fff;
      }

      .nav-item.active {
        background: rgba(255, 255, 255, .12);
        color: #fff !important;
      }

      .nav-icon {
        width: 26px;
        min-width: 26px;
        height: 26px;
        display: grid;
        place-items: center;
        border-radius: 8px;
        background: rgba(255, 255, 255, .09);
        font-size: 13px;
        line-height: 1;
      }

      .nav-item span:last-child {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .card,
      .stat-card,
      .barraca-card,
      .section-head {
        background: rgba(255, 255, 255, .96);
        border: 1px solid var(--line);
        border-radius: 14px;
        box-shadow: var(--shadow-soft);
      }

      .card {
        padding: clamp(16px, 2vw, 22px);
        margin-bottom: 16px;
      }

      .card-title,
      .eyebrow {
        margin: 0 0 12px;
        color: var(--muted);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .06em;
        text-transform: uppercase;
      }

      .hero-card {
        margin-bottom: 16px;
        padding: clamp(20px, 2.6vw, 30px);
        border-radius: 16px;
        border: 1px solid var(--line);
        box-shadow: var(--shadow-soft);
        color: var(--text);
      }

      .org-hero {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 18px;
        background: linear-gradient(135deg, #fff7ed, #ffffff 68%);
      }

      .hero-card h2,
      .section-head h2 {
        margin: 0;
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: clamp(25px, 3vw, 40px);
        line-height: 1.05;
        font-weight: 800;
      }

      .hero-card p {
        margin: 9px 0 0;
        color: var(--muted);
        font-weight: 500;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 14px;
        margin-bottom: 16px;
      }

      .stat-card {
        min-width: 0;
        padding: clamp(16px, 2vw, 22px);
        transition: transform .18s ease, box-shadow .18s ease;
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow);
      }

      .stat-label {
        margin: 0 0 8px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 800;
      }

      .stat-value {
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: clamp(25px, 3vw, 38px);
        line-height: 1;
        font-weight: 800;
        letter-spacing: 0;
        overflow-wrap: anywhere;
      }

      .stat-sub {
        margin-top: 8px;
        color: var(--subtle);
        font-size: 12px;
        font-weight: 600;
      }

      .stat-sub.up { color: var(--green); }

      .row,
      .item-row,
      .toggle-row,
      .user-row,
      .status-row,
      .report-card {
        display: flex;
        align-items: center;
        gap: 13px;
        padding: 12px 0;
        border-bottom: 1px solid var(--line);
      }

      .row { justify-content: space-between; }
      .row:last-child,
      .item-row:last-child,
      .toggle-row:last-child,
      .user-row:last-child,
      .status-row:last-child,
      .report-card:last-child { border-bottom: none; }

      .row-label { color: var(--muted); font-weight: 600; }
      .row-value,
      .money-value {
        color: var(--text);
        font-weight: 800;
        text-align: right;
      }

      .item-icon,
      .avatar,
      .barraca-icon,
      .report-icon {
        width: 42px;
        height: 42px;
        flex: 0 0 auto;
        display: grid;
        place-items: center;
        border-radius: 12px;
        font-weight: 900;
      }

      .item-info,
      .user-info,
      .report-info,
      .barraca-info,
      .toggle-info {
        flex: 1;
        min-width: 0;
      }

      .item-name,
      .user-name,
      .report-name,
      .barraca-name,
      .toggle-name {
        color: var(--text);
        font-size: 14px;
        font-weight: 800;
        overflow-wrap: anywhere;
      }

      .item-meta,
      .user-meta,
      .report-desc,
      .barraca-owner,
      .toggle-sub {
        margin-top: 2px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 500;
        overflow-wrap: anywhere;
      }

      .badge {
        min-height: 26px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
        white-space: nowrap;
      }

      .badge-ok { background: #dcfce7; color: #166534; }
      .badge-warn { background: #fef3c7; color: #92400e; }
      .badge-info { background: #dbeafe; color: #1d4ed8; }
      .badge-purple { background: #ede9fe; color: #5b21b6; }

      .btn {
        min-height: 36px;
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 10px;
        background: var(--text);
        color: #fff;
        font-weight: 800;
        font-size: 13px;
        transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 24px rgba(15, 23, 42, .16);
        filter: brightness(1.03);
      }

      .btn:active { transform: translateY(0); }
      .btn-secondary {
        min-height: 34px;
        padding: 9px 12px;
        border-radius: 10px;
        font-size: 13px;
        background: #fff;
        border: 1px solid var(--line-strong);
        color: var(--text);
      }

      .btn-sm {
        min-height: 30px;
        padding: 8px 12px;
        border-radius: 10px;
        font-size: 12px;
        width: auto;
      }

      .field { margin-bottom: 14px; }
      .field label {
        display: block;
        margin-bottom: 7px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 800;
      }

      .field input,
      .field select {
        width: 100%;
        min-height: 48px;
        padding: 11px 13px;
        border: 1px solid var(--line-strong);
        border-radius: 12px;
        outline: none;
        background: #fff;
        color: var(--text);
        font-weight: 600;
        transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
      }

      .field input:focus,
      .field select:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 4px rgba(233, 113, 37, .14);
        background: #fff;
      }

      .field-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .qr-box {
        display: inline-block;
        padding: 18px;
        border-radius: 14px;
        background: #fff;
        border: 1px solid var(--line);
        box-shadow: var(--shadow-soft);
      }

      .bar-row {
        display: grid;
        grid-template-columns: minmax(100px, .9fr) minmax(0, 1.4fr) auto;
        gap: 12px;
        align-items: center;
        padding: 8px 0;
      }

      .bar-label {
        min-width: 0;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .bar-bg {
        height: 10px;
        border-radius: 999px;
        overflow: hidden;
        background: #e2e8f0;
      }

      .bar-fill {
        height: 100%;
        border-radius: 999px;
        animation: growbar .5s ease both;
      }

      @keyframes growbar {
        from { transform: scaleX(.25); transform-origin: left; opacity: .5; }
        to { transform: scaleX(1); transform-origin: left; opacity: 1; }
      }

      .bar-val {
        color: var(--text);
        font-size: 12px;
        font-weight: 800;
        text-align: right;
      }

      .qty-ctrl { display: flex; align-items: center; gap: 10px; }
      .qty-btn {
        width: 34px;
        height: 34px;
        display: inline-grid;
        place-items: center;
        border: 1px solid var(--line-strong);
        border-radius: 10px;
        background: #fff;
        font-size: 18px;
        font-weight: 900;
      }

      .qty-num {
        min-width: 24px;
        text-align: center;
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: 20px;
        font-weight: 800;
      }

      .scan-cam {
        min-height: 240px;
        margin-bottom: 14px;
        border-radius: 16px;
        background:
          linear-gradient(135deg, rgba(15, 23, 42, .96), rgba(17, 24, 39, .88)),
          #111827;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        overflow: hidden;
        box-shadow: var(--shadow-soft);
      }

      .scan-frame { width: 148px; height: 148px; position: relative; }
      .sc { position: absolute; width: 24px; height: 24px; border-style: solid; }
      .sc.tl { top: 0; left: 0; border-width: 3px 0 0 3px; }
      .sc.tr { top: 0; right: 0; border-width: 3px 3px 0 0; }
      .sc.bl { bottom: 0; left: 0; border-width: 0 0 3px 3px; }
      .sc.br { bottom: 0; right: 0; border-width: 0 3px 3px 0; }
      .scan-line { position: absolute; left: 4px; right: 4px; height: 2px; animation: scan 2s ease-in-out infinite; }
      @keyframes scan { 0%, 100% { top: 8%; } 50% { top: 88%; } }
      .scan-hint { color: #d1fae5; font-size: 13px; text-align: center; padding: 0 18px; }

      .chips,
      .tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 14px;
      }

      .chip,
      .tab {
        min-height: 38px;
        border: 1px solid var(--line-strong);
        border-radius: 999px;
        background: #fff;
        padding: 8px 13px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 800;
      }

      .tab { flex: 1; border-radius: 12px; text-align: center; }
      .chip.active,
      .tab.active { background: var(--text); color: #fff; border-color: var(--text); }

      .barraca-card {
        padding: clamp(16px, 2vw, 22px);
        margin-bottom: 16px;
      }

      .barraca-header {
        display: flex;
        align-items: center;
        gap: 13px;
        margin-bottom: 15px;
      }

      .barraca-stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }

      .bstat {
        min-width: 0;
        padding: 12px;
        border-radius: 12px;
        background: var(--surface-soft);
        border: 1px solid var(--line);
      }

      .bstat-label {
        margin: 0 0 5px;
        color: var(--muted);
        font-size: 11px;
        font-weight: 800;
      }

      .bstat-val {
        color: var(--text);
        font-size: 14px;
        font-weight: 800;
        overflow-wrap: anywhere;
      }

      .tog {
        position: relative;
        width: 44px;
        height: 26px;
        flex: 0 0 auto;
      }

      .tog input { position: absolute; opacity: 0; width: 0; height: 0; }
      .tog-sl {
        position: absolute;
        inset: 0;
        border-radius: 999px;
        background: #cbd5e1;
        transition: background .18s ease;
      }

      .tog-sl::before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 3px;
        left: 3px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0,0,0,.18);
        transition: transform .18s ease;
      }

      .tog input:checked + .tog-sl { background: var(--green); }
      .tog input:checked + .tog-sl::before { transform: translateX(18px); }

      .sdot,
      .dot-pulse,
      .alert-dot {
        width: 9px;
        height: 9px;
        border-radius: 999px;
        flex: 0 0 auto;
      }

      .sdot-ok { background: var(--green); }
      .sdot-warn { background: #f59e0b; }
      .dot-pulse { animation: pulse 1.5s ease-in-out infinite; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }

      .alert-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 0;
        border-bottom: 1px solid var(--line);
      }

      .alert-row:last-child { border-bottom: none; }
      .alert-text { flex: 1; color: var(--text); font-size: 13px; }
      .alert-time { color: var(--muted); font-size: 11px; white-space: nowrap; }

      .finance-summary {
        display: grid;
        gap: 9px;
      }

      .finance-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 11px 12px;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: var(--surface-soft);
      }

      .finance-line span {
        color: var(--muted);
        font-size: 12px;
        font-weight: 800;
      }

      .finance-line strong {
        color: var(--text);
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-weight: 800;
        text-align: right;
      }

      .settlement-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 16px;
        align-items: center;
        padding: 14px 0;
        border-bottom: 1px solid var(--line);
      }

      .settlement-row:last-child {
        border-bottom: 0;
      }

      .settlement-main {
        min-width: 0;
      }

      .settlement-name {
        color: var(--text);
        font-size: 14px;
        font-weight: 900;
      }

      .settlement-meta {
        margin-top: 3px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 700;
      }

      .settlement-bar {
        height: 9px;
        margin-top: 10px;
        overflow: hidden;
        border-radius: 999px;
        background: #e2e8f0;
      }

      .settlement-bar span {
        display: block;
        min-width: 3px;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, #D85A30, #15956d);
      }

      .settlement-value {
        min-width: 116px;
        text-align: right;
      }

      .settlement-value span,
      .report-breakdown span {
        display: block;
        color: var(--muted);
        font-size: 11px;
        font-weight: 800;
      }

      .settlement-value strong,
      .report-breakdown strong {
        display: block;
        color: var(--text);
        font-size: 14px;
        font-weight: 900;
      }

      .report-breakdown {
        display: grid;
        grid-template-columns: minmax(160px, 1.4fr) repeat(3, minmax(90px, .6fr));
        gap: 12px;
        align-items: center;
        padding: 13px 0;
        border-bottom: 1px solid var(--line);
      }

      .report-breakdown:last-child {
        border-bottom: 0;
      }

      .report-breakdown > div {
        min-width: 0;
      }

      .section-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 16px;
        padding: 20px;
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }

      .admin-hero {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        background: linear-gradient(135deg, #f5f3ff, #ffffff 70%);
      }

      .inline-editor {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        margin-top: 12px;
        padding: 12px;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: var(--surface-soft);
      }

      .inline-editor-title {
        grid-column: 1 / -1;
        color: var(--muted);
        font-size: 12px;
        font-weight: 900;
      }

      .role-avatar {
        width: 48px;
        padding: 0 5px;
        font-size: 11px;
        line-height: 1;
      }

      .permission-chip {
        border-radius: 10px;
        white-space: nowrap;
      }

      .role-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
      }

      .role-option,
      .role-card {
        min-height: 46px;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: #fff;
        font-weight: 900;
        transition: transform .18s ease, box-shadow .18s ease;
      }

      .role-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
      }

      .role-option small {
        color: currentColor;
        font-size: 10px;
        font-weight: 900;
        opacity: .78;
      }

      .role-card {
        min-height: 72px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
      }

      .role-card span {
        width: 30px;
        height: 30px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: rgba(15, 23, 42, .06);
      }

      .role-option:hover,
      .role-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-soft);
      }

      .menu-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        margin-bottom: 16px;
      }

      .menu-card {
        min-width: 0;
        display: grid;
        grid-template-columns: 54px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: 14px;
        background: rgba(255, 255, 255, .96);
        box-shadow: var(--shadow-soft);
        transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
      }

      .menu-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow);
      }

      .menu-card.is-off {
        opacity: .72;
      }

      .menu-thumb {
        width: 54px;
        height: 54px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: 22px;
        font-weight: 800;
      }

      .menu-info {
        min-width: 0;
      }

      .menu-name {
        color: var(--text);
        font-weight: 900;
        overflow-wrap: anywhere;
      }

      .action-menu-trigger {
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        border: 1px solid var(--line);
        background: #ffffff;
        color: var(--text);
        cursor: pointer;
        transition: background .18s ease, box-shadow .18s ease;
      }

      .action-menu-trigger:hover {
        background: rgba(15, 23, 42, .04);
      }

      .action-menu-dropdown {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        min-width: 160px;
        border-radius: 16px;
        background: #ffffff;
        border: 1px solid var(--line);
        box-shadow: var(--shadow-soft);
        z-index: 5;
        overflow: hidden;
      }

      .action-menu-item {
        width: 100%;
        padding: 12px 14px;
        border: none;
        background: transparent;
        text-align: left;
        font-size: 14px;
        color: var(--text);
        cursor: pointer;
        transition: background .12s ease;
      }

      .action-menu-item:hover {
        background: rgba(15, 23, 42, .04);
      }

      .action-menu-item.toggle {
        color: #f97316;
      }

      .action-menu-item.danger {
        color: #dc2626;
      }

      .menu-price {
        margin-top: 2px;
        color: var(--green);
        font-family: 'Manrope', 'Inter', Arial, sans-serif;
        font-size: 18px;
        font-weight: 800;
      }

      .menu-meta {
        margin-top: 2px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 700;
      }

      .stock-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 14px;
        align-items: center;
        padding: 14px 0;
        border-bottom: 1px solid var(--line);
      }

      .stock-row:last-child {
        border-bottom: 0;
      }

      .stock-main {
        min-width: 0;
      }

      .stock-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
      }

      .empty-state {
        color: var(--muted);
        font-size: 14px;
        line-height: 1.55;
      }

      .inline-alert {
        margin: 14px 0;
        padding: 12px 14px;
        border-radius: 12px;
        background: #fff7ed;
        border: 1px solid #fed7aa;
        color: #9a3412;
        font-size: 13px;
        font-weight: 800;
      }

      @media (max-width: 1100px) {
        .landing-auth {
          grid-template-columns: 1fr;
          gap: 28px;
          padding-top: 88px;
        }

        .landing-panel {
          justify-content: flex-start;
        }

        .landing-metrics {
          grid-template-columns: 1fr;
        }

        .home,
        .auth-page {
          grid-template-columns: 1fr;
          align-content: start;
        }

        .home-logo {
          max-width: none;
          justify-content: flex-end;
          min-height: auto;
          padding-top: clamp(10px, 5vw, 42px);
        }

        .home-cards,
        .auth-card { align-self: start; }

        .phone { grid-template-columns: 228px minmax(0, 1fr); }
        .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }

      @media (max-width: 820px) {
        .landing-auth {
          padding: 18px;
          padding-top: 84px;
        }

        .landing-hero {
          padding-top: 14px;
        }

        .flag-line-b {
          display: none;
        }

        .home,
        .auth-page {
          padding: 18px;
          gap: 22px;
        }

        .home-card {
          min-height: auto;
          grid-template-columns: 50px minmax(0, 1fr);
          padding: 18px;
        }

        .home-card-arrow { display: none; }

        .phone {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          min-height: 78px;
          grid-template-columns: 42px minmax(0, 1fr) 18px;
          padding: 14px 16px;
        }

        .topbar-heading { text-align: left; }
        .topbar-title { font-size: 22px; }
        .topbar-subtitle { font-size: 12px; }

        .screen-body {
          flex: 1;
          min-height: 0;
          padding: 16px;
          padding-bottom: 88px;
        }

        .navbar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 20;
          min-height: 72px;
          flex-direction: row;
          gap: 2px;
          padding: 8px 8px max(8px, env(safe-area-inset-bottom));
          background: rgba(15, 23, 42, .96);
          border-right: 0;
          border-top: 1px solid rgba(255, 255, 255, .08);
          box-shadow: 0 -10px 26px rgba(15, 23, 42, .18);
        }

        .navbar::before { display: none; }
        .nav-item {
          flex: 1;
          min-width: 0;
          min-height: 54px;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          padding: 5px;
          font-size: 10px;
          text-align: center;
        }

        .nav-item:hover { transform: none; }
        .nav-icon {
          width: 24px;
          height: 24px;
          font-size: 12px;
        }

        .field-row,
        .barraca-stats,
        .dashboard-grid,
        .menu-grid,
        .inline-editor,
        .role-grid,
        .settlement-row,
        .report-breakdown { grid-template-columns: 1fr; }

        .menu-card {
          grid-template-columns: 48px minmax(0, 1fr);
        }

        .menu-card .badge {
          grid-column: 1 / -1;
          justify-self: start;
        }

        .stock-row {
          grid-template-columns: 1fr;
        }

        .stock-actions {
          justify-content: flex-start;
          flex-wrap: wrap;
        }

        .settlement-value {
          min-width: 0;
          text-align: left;
        }

        .row { align-items: flex-start; }
        .bar-row {
          grid-template-columns: minmax(90px, .9fr) minmax(0, 1fr);
        }

        .bar-val {
          grid-column: 2;
          text-align: left;
        }
      }

      @media (max-width: 520px) {
        body,
        button,
        input,
        select,
        textarea { font-size: 14px; }

        .landing-hero h1 { font-size: clamp(52px, 18vw, 78px); }
        .landing-hero p { font-size: 15px; }
        .arraial-scene { min-height: 210px; }
        .scene-card {
          min-width: 136px;
          padding: 10px;
        }
        .scene-card-a { left: 12px; bottom: 18px; }
        .scene-card-b { right: 12px; bottom: 18px; }
        .moon { right: 22px; }
        .landing-actions { align-items: stretch; flex-direction: column; width: 100%; }
        .landing-primary,
        .landing-live { width: 100%; }
        .auth-heading { align-items: flex-start; }
        .home-logo h1 { font-size: clamp(38px, 14vw, 58px); }
        .home-logo p { font-size: 15px; }
        .home-card h2 { font-size: 20px; }
        .home-card p { font-size: 13px; }
        .auth-card { padding: 18px; border-radius: 14px; }
        .stats-grid { grid-template-columns: 1fr; }
        .stat-card { padding: 16px; }
        .item-row,
        .user-row,
        .report-card {
          align-items: flex-start;
        }
      }
    `}</style>
  );
}
