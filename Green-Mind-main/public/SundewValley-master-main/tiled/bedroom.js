class Bedroom extends Level {
    constructor(_path) {
        super(_path);
    }

    processTriggers(_data) {
        if (_data.type.localeCompare("bed") === 0) {
            // ── Sleep button ──────────────────────────────────────────────
            if (Level.PLAYER.notDisablePlayerController()) {
                const _fontSize = Level.PLAYER.getMapReference().getTileSize() / 2;
                if (MessageButton.draw(
                    GAME_ENGINE.ctx, "Sleep", _fontSize,
                    Level.PLAYER.getMapReference().getPixelX() + Level.PLAYER.getPixelRight() - _fontSize / 3,
                    Level.PLAYER.getMapReference().getPixelY() + Level.PLAYER.getPixelY() + _fontSize
                )) {
                    if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                        // Achievement: early bird (before 22:00)
                        if (DateTimeSystem.getHour() < 22) {
                            AchievementManager.notifyEarlyBird();
                        }
                        Transition.start(() => {
                            // Restore energy fully on sleep
                            EnergyManager.restoreFull();
                            // Generate daily letters from NPCs
                            LetterManager.generateDailyLetters();
                            // Advance day
                            DateTimeSystem.toNextDay();
                            FarmLevel.dailyClosing();
                        });
                    }
                }
            }

        } else {
            super.processTriggers(_data);
        }
    }
}