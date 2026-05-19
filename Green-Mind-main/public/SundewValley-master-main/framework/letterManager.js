class LetterManager {
    // ── NPC letter configs ────────────────────────────────────────────────
    static #CONFIGS = [
        {
            npc: "Mimo",
            tiers: [
                {
                    minHearts: 3,
                    chance: 0.30,
                    messages: [
                        "الصباح عليك بالخير يا صديقي!\nوجدتُ بذور إضافية في مخزني وأردتُ مشاركتها معك.\nاهتم بها جيداً! — ميمو",
                        "أتمنى أن تكون بخير.\nتذكّر أن تسقي محاصيلك كل يوم!\n— ميمو"
                    ],
                    gifts: [["tomato_seed", 3], ["potato_seed", 3]]
                },
                {
                    minHearts: 7,
                    chance: 0.50,
                    messages: [
                        "رأيتك تعمل بجهد كبير.\nخذ هذه المحاصيل الطازجة، إنتاج مزرعتي!\n— ميمو"
                    ],
                    gifts: [["tomato", 5], ["pumpkin", 3]]
                }
            ]
        },
        {
            npc: "Jannah",
            tiers: [
                {
                    minHearts: 3,
                    chance: 0.25,
                    messages: [
                        "مرحباً! فكّرتُ فيك كثيراً هذا الأسبوع.\nأتمنى لك يوماً مليئاً بالفرح! — جنّة",
                        "أنت دائماً مشغول، لكن لا تنسَ تأكل!\nخذ هذا معك. — جنّة"
                    ],
                    gifts: [["strawberry", 4], ["carrot", 3]]
                },
                {
                    minHearts: 7,
                    chance: 0.55,
                    messages: [
                        "صديقي العزيز،\nطبختُ هذا الطبق خصيصاً لك.\nآمل أن تستمتع به! — جنّة"
                    ],
                    gifts: [["jam", 1], ["soup", 1]]
                }
            ]
        },
        {
            npc: "Mario",
            tiers: [
                {
                    minHearts: 3,
                    chance: 0.25,
                    messages: [
                        "يا صاحبي! استمر في العمل الجيد!\nهذا لك كتذكار صغير. — ماريو",
                        "سمعتُ أنك تعمل بجد.\nأنت تُلهمني يومياً! — ماريو"
                    ],
                    gifts: [["corn", 4], ["pea", 3]]
                },
                {
                    minHearts: 10,
                    chance: 1.0,
                    messages: [
                        "يا صديقي العزيز،\nلم أتوقع أن أجد هنا من يفهمني هكذا.\nهذا المبلغ من مغامراتي القديمة، خذه! — ماريو"
                    ],
                    gifts: [["_money_", 500]]
                }
            ]
        },
        {
            npc: "Grandmother",
            tiers: [
                {
                    minHearts: 3,
                    chance: 0.35,
                    messages: [
                        "حبيبي، الجدة تفتقدك!\nخذ هذا العصير، يعطيك نشاطاً. — الجدة",
                        "كيف حالك يا ابني؟\nاشرب هذا وابقَ بصحة جيدة! — الجدة"
                    ],
                    gifts: [["medicinal_juice", 1], ["water", 3]]
                },
                {
                    minHearts: 7,
                    chance: 0.60,
                    messages: [
                        "يا نور عيني،\nطبختُ لك شيئاً لذيذاً.\nلا تنسَ تأتيني للعشاء! — الجدة"
                    ],
                    gifts: [["stew", 1], ["medicinal_juice", 1]]
                }
            ]
        },
        {
            npc: "Soso",
            tiers: [
                {
                    minHearts: 5,
                    chance: 0.30,
                    messages: [
                        "شكراً جزيلاً على مساعدتك!\nأنت إنسان طيب القلب. — سوسو",
                        "لن أنسى لطفك أبداً.\nهذا رمز صغير للامتنان. — سوسو"
                    ],
                    gifts: [["lavender", 3], ["lavender_seed", 5]]
                }
            ]
        }
    ];

    static #lastLetterDay = {}; // npc → last day a letter was sent
    static #pendingLetters = [];

    // ── Called each new day ───────────────────────────────────────────────
    static generateDailyLetters() {
        const today = DateTimeSystem.getTotalDays();

        this.#CONFIGS.forEach(cfg => {
            if (this.#lastLetterDay[cfg.npc] === today) return; // already sent today

            const hearts = FriendshipManager.getHearts(cfg.npc);
            // Find the best tier the player qualifies for
            let bestTier = null;
            cfg.tiers.forEach(t => {
                if (hearts >= t.minHearts) bestTier = t;
            });
            if (!bestTier) return;

            if (Math.random() < bestTier.chance) {
                this.#lastLetterDay[cfg.npc] = today;
                const msg  = bestTier.messages[Math.floor(Math.random() * bestTier.messages.length)];
                const gift = bestTier.gifts[Math.floor(Math.random() * bestTier.gifts.length)];
                this.#pendingLetters.push({ from: cfg.npc, message: msg, gift });
            }
        });
    }

    static hasPendingLetters()  { return this.#pendingLetters.length > 0; }
    static getNextLetter()      { return this.#pendingLetters.shift(); }
    static getAllPending()       { return [...this.#pendingLetters]; }
}
