# Design QA — Cobrinhas 4.4.0

final result: passed

Compared all five user reference screenshots beside implementation captures in qa-extras.html: timed gifts, settings, controls, help and profile. Checked blue panels, tab selection, wallet, reward cards and statistics bars. Own snake renderer and licensed local Fluent icons remain intentional differences. Final close buttons sit at the viewport corner; earlier controls/profile captures precede that small positioning correction.

Desktop 1280×720 and mobile 390×844 reviewed. Mobile controls are readable, with document clientWidth and scrollWidth both 390. Gift claims changed 17→717 coins; reload preserved balance, disabled buttons and deadlines. Expiry made the five-minute gift available again. Saved following control and always-show-boost survive reload. Profile name persisted; an actual 12-second round updated survival, total time and game count. Existing best score preserved; historical time and kills are not fabricated.

Tests cover gift cooldowns, restore, invalid timestamps, profile accumulation, translations, four touch modes, audio toggles and camera toggle. Existing gameplay/progression/workshop/growth suites passed. No browser console errors. Physical touchscreen and listening to synthesized audio were not tested. Help credits original synthesized audio and actual project/licensed graphics.
