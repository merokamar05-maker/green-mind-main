class Dialogues {
    static #CURRENT = null
    static #CURRENT_INIT_BY = null
    static HAS_KNOCKED_TODAY = false
    static LAST_CURED_DAY = -10 // Starts sick at day 0
    static MIMO_INTERACTION_COUNT = 0
    static SOSO_GENEROSITY_LEVEL = 0
    static Mohamed_INTERACTION_COUNT = 0
    static SEBAEY_INTERACTION_COUNT = 0
    static ZOZO_INTERACTION_COUNT = 0
    static MARIO_INTERACTION_COUNT = 0
    static JANNAH_INTERACTION_COUNT = 0
    static HAZO_INTERACTION_COUNT = 0;
    static RECYCLER_INTERACTION_COUNT = 0;




    static #SCRIPTS = {
        FarmHouse_Door: {
            contents: ["You are at the farmhouse door.", "What would you like to do?"],
            options: [{
                text: "*Knock Knock*",
                act: "$knock_door"
            }, {
                text: "Enter the house",
                act: "$enter_farmhouse"
            }]
        },
        FarmHouse_Knock_First: {
            contents: ["You should knock before entering!", "It is only polite."],
            options: [{
                text: "You are right, let me knock.",
                act: "FarmHouse_Door"
            }]
        },
        FarmHouse_Knock_First_Reward: {
            contents: ["*Knock Knock*", "Welcome back! Here is $20 as a daily reward for keeping up the farm!"],
            options: [{
                text: "Enter the house",
                act: "$enter_farmhouse"
            }, {
                text: "Not yet, I am still outside.",
                act: "$close"
            }]
        },
        FarmHouse_Knock_Repeat: {
            contents: ["*Knock Knock*", "You knocked again and found $5 on the doorstep!"],
            options: [{
                text: "Enter the house",
                act: "$enter_farmhouse"
            }, {
                text: "Not yet, I am still outside.",
                act: "$close"
            }]
        },
        Recycler_interact1: {
            contents: ["Hello! I'm Tawfiq.", "People leave their trash everywhere.", "If you find any, bring it to me!"],
            options: [{
                text: "Here, I found some trash!",
                act: "$give_trash"
            }, {
                text: "I will keep an eye out.",
                act: "$close"
            }]
        },
        Recycler_trash_success: {
            contents: [
                "Excellent! Thank you for cleaning up the whole town.", 
                "Here is your reward for all the bags you brought!"
            ]
        },
        Recycler_trash_fail: {
            contents: [
                "Hmm... I don't see any trash in your pockets.", 
                "Come back when you find some green trash bags!"
            ]
        },
        Recycler_interact_repeat1: {
            contents: [
                "Thanks for coming back! I really appreciate the help.",
                "Did you know that recycling one ton of paper can save 17 trees?",
                "Every bag you bring makes Sundew Valley more beautiful!"
            ],
            options: [{
                text: "I have some trash for you!",
                act: "$give_trash"
            }, {
                text: "I'll keep looking.",
                act: "$close"
            }]
        },
        Recycler_interact_repeat2: {
            contents: [
                "Welcome back, friend. You're becoming a real pro at this.",
                "Pro tip: Rinsing your containers makes them much easier to recycle.",
                "It's the small habits that change the world!"
            ],
            options: [{
                text: "Here's more trash!",
                act: "$give_trash"
            }, {
                text: "Got it, thanks!",
                act: "$close"
            }]
        },
        Recycler_interact_repeat3: {
            contents: [
                "Ah, my favorite environmentalist! How's the farm?",
                "Did you know that glass can be recycled infinitely without losing quality?",
                "You're doing a great job keeping this place green!"
            ],
            options: [{
                text: "I found some more bags!",
                act: "$give_trash"
            }, {
                text: "See you later!",
                act: "$close"
            }]
        },
        Grandmother_interact1: {
            contents: ["*Cough* *Cough*", "Oh my dear... I'm feeling so weak today..."],
            options: [{
                text: "Here, I brought the special medicinal juice!",
                act: "$give_juice"
            }, {
                text: "Rest well, grandma.",
                act: "$close"
            }]
        },
        Grandmother_juice_success: {
            contents: [
                "Oh... this smells wonderful.", 
                "(Drinks the juice)",
                "Thank you so much! I feel my strength returning already!"
            ]
        },
        Grandmother_juice_fail: {
            contents: [
                "You don't seem to have the juice... *Cough*"
            ]
        },
        Grandmother_scold: {
            contents: [
                "*adjusts glasses*",
                "You walk into MY house without knocking?!",
                "When I was young, we respected the house we live in!"
            ],
            next: "Grandmother_advice"
        },
        Grandmother_advice: {
            contents: [
                "Listen to me, my dear.",
                "Go work hard, earn money, and ALWAYS knock first!",
                "Now come in, since you are already here..."
            ],
            options: [{
                text: "Enter the house",
                act: "$enter_farmhouse"
            }]
        },
        Grandmother_fine: {
            contents: [
                "RUDE! No knock?!",
                "I am taking $15 from your pocket as a fine!",
                "Next time KNOCK first, you hear me?!"
            ],
            options: [{
                text: "Sorry grandma, I will knock next time.",
                act: "$enter_farmhouse"
            }]
        },
        Grandmother_healthy_start: {
            contents: ["Hello my dear! I feel so much better thanks to you.", "You know, your grandfather always said the secret to a good farm is in the timing."],
            next: "Grandmother_planting_tip1"
        },
        Grandmother_planting_tip1: {
            contents: ["Always check the season before you plant.", "Some seeds love the spring, while others need the summer sun.", "Check the guide if you are ever unsure!"],
            next: "Grandmother_planting_tip2"
        },
        Grandmother_planting_tip2: {
            contents: ["And don't forget to water them!", "Plants are like us, they need a drink to stay strong.", "If they turn yellow, they are thirsty!"],
            next: "Grandmother_healthy_end"
        },
        Grandmother_healthy_end: {
            contents: ["I'm so proud of you for taking care of this land.", "Go on now, the earth is waiting for you!"]
        },

        Maya_interact1: {
            contents: ["Hello my Name is Maya", "What can I do for you, my dear customer?"],
            options: [{
                text: "I want to see what you have",
                act: "$trade"
            }, {
                text: "Nothing, have a nice day",
                act: "$close"
            }]
        },
        Zozo_interact1: {
            contents: ["Hey, I am Zozo. Looking for some animals for your farm?", "I have some fine livestock today."],
            options: [{
                text: "Show me the animals",
                act: "$trade"
            }, {
                text: "Not today",
                act: "$close"
            }]
        },
        Maryoma_interact1: {
            contents: ["Greeting! We serve only water and fresh natural juices here.", "What can I get you today?"],
            options: [{
                text: "I'll have a Water ($5)",
                act: "$buy_water"
            }, {
                text: "I'll have an Orange Juice ($15)",
                act: "$buy_orange_juice"
            }, {
                text: "Can you make the special juice for my grandmother?",
                act: "Maryoma_juice_info"
            }, {
                text: "No thanks, thank you!",
                act: "$close"
            }]
        },
        Maryoma_interact2: {
            contents: ["We have... water.", "And some fresh fruit juices too!"],
            options: [{
                text: "And...??",
                act: "Maryoma_interact3"
            }]
        },
        Maryoma_interact3: {
            contents: ["And that is it, for now."],
            options: [{
                text: "What kinds of bar only serves water and juice?",
                act: "Maryoma_interact4"
            }]
        },
        Maryoma_interact4: {
            contents: ["A healthy one! We take care of our customers."],
            options: [{
                text: "Never mind, have a nice day",
                act: "$close"
            }, {
                text: "Ok, I will have some water",
                act: "Maryoma_interact5"
            }]
        },
        Maryoma_interact5: {
            contents: ["Here you go, have a nice day"],
        },
        Maryoma_juice_info: {
            contents: [
                "Of course! I've heard your grandmother isn't feeling well.", 
                "If you bring me 1 Pumpkin and 1 Strawberry,", 
                "I can brew a special medicinal juice for her."
            ],
            options: [{
                text: "I have them right here!",
                act: "$make_juice"
            }, {
                text: "I'll be back later.",
                act: "$close"
            }]
        },
        Maryoma_juice_success: {
            contents: [
                "Perfect! Just a moment...", 
                "...here it is! A fresh medicinal juice.", 
                "Give this to your grandmother, it should help."
            ]
        },
        Maryoma_juice_fail: {
            contents: [
                "Oh, it seems you're missing some ingredients.", 
                "I need 1 Pumpkin and 1 Strawberry to make it."
            ]
        },
        Bar_buy_success: {
            contents: ["Perfect! Here is your drink.", "Enjoy and have a great day!"]
        },
        Bar_buy_fail: {
            contents: ["Oh, it seems you don't have enough money for that.", "Water and juice are cheap, but not free!"]
        },
        Mohamed_interact1: {
            contents: ["Hello there, stranger!", "First time I have seen you around here."],
            next: "Mohamed_interact1_2"
        },
        Mohamed_interact1_2: {
            contents: ["So tell me... what brings you to Sundew Valley?"],
            options: [
                { text: "I inherited the old farm nearby.", act: "Mohamed_reply_farm" },
                { text: "I am just exploring the area.", act: "Mohamed_reply_explore" }
            ]
        },
        Mohamed_reply_farm: {
            contents: ["The old farm?!", "That place used to be the heart of this whole village."],
            next: "Mohamed_reply_farm_2"
        },
        Mohamed_reply_farm_2: {
            contents: ["Are you planning to bring it back to life?"],
            options: [
                { text: "Absolutely! That is my goal.", act: "Mohamed_farm_yes" },
                { text: "I am still figuring things out.", act: "Mohamed_farm_maybe" }
            ]
        },
        Mohamed_farm_yes: {
            contents: ["Ha! I love that confidence.", "This village needs someone with that spirit."],
            next: "Mohamed_health_topic",
            act: "$Mohamed_karma"
        },
        Mohamed_farm_maybe: {
            contents: ["Do not worry, the land is patient.", "Take your time and you will find your way."],
            next: "Mohamed_health_topic"
        },
        Mohamed_reply_explore: {
            contents: ["Exploring, you say?", "Well Sundew Valley is a beautiful place.", "But I will tell you a little secret..."],
            next: "Mohamed_reply_explore_2"
        },
        Mohamed_reply_explore_2: {
            contents: ["Nobody just passes through here.", "This place has a way of keeping people."],
            next: "Mohamed_health_topic"
        },
        Mohamed_health_topic: {
            contents: ["By the way, I love that this bar only serves water and juice.", "It's refreshing to see people caring for their bodies."],
        },
        Mohamed_stage2_1: {
            contents: ["I've been thinking... failure is just a different kind of harvest.", "Don't you agree, farmer?"],
            options: [{
                text: "I agree! It's a lesson for the next season.",
                act: "Mohamed_stage2_optimist"
            }, {
                text: "Maybe, but it still hurts the pocket!",
                act: "Mohamed_stage2_realist"
            }]
        },
        Mohamed_stage2_optimist: {
            contents: ["Spoken like a true farmer.", "Patience is your greatest tool, even more than your hoe."],
        },
        Mohamed_stage2_realist: {
            contents: ["Haha, very true. The soil doesn't pay the bills directly.", "But a lesson learned today saves a crop tomorrow."],
        },
        Mohamed_stage3_1: {
            contents: ["SunDew Valley feels warmer lately. Not just the weather...", "Is it the season, or is it your influence on the village?"],
            options: [{
                text: "It's the spirit of the people here.",
                act: "Mohamed_stage3_humble"
            }, {
                text: "I'm doing my best to bring it back!",
                act: "Mohamed_stage3_proud"
            }]
        },
        Mohamed_stage3_humble: {
            contents: ["A modest answer. I like that.", "True change always starts from the community, but it needs a spark."],
        },
        Mohamed_stage3_proud: {
            contents: ["And it shows. That fire in your eyes is what this valley needed.", "Keep that passion alive, kid."],
        },
        Mohamed_stage4_1: {
            contents: ["Every plant has its own time to bloom. You can't rush the spring.", "Do you ever feel like you're rushing life too much?"],
            options: [{
                text: "Sometimes, there's so much to do!",
                act: "Mohamed_stage4_busy"
            }, {
                text: "I try to take it one day at a time.",
                act: "$Mohamed_karma"
            }]
        },
        Mohamed_stage4_busy: {
            contents: ["Slow down for a moment. Take a breath.", "The crops can wait 5 minutes. Your soul needs the rest more."],
        },
        Mohamed_stage4_calm: {
            contents: ["That is wisdom right there.", "The farmer who walks slowly sees the weeds before they take root."],
        },
        Mohamed_stage5_1: {
            contents: ["The rain makes the soil soft, but it makes the soul quiet.", "Do you find peace in the rain, farmer?"],
            options: [{
                text: "Yes, I really love the rain.",
                act: "Mohamed_stage5_rain"
            }, {
                text: "No, I prefer sunny days.",
                act: "Mohamed_stage5_sun"
            }]
        },
        Mohamed_stage5_rain: {
            contents: ["Ah, a kindred spirit. The rain washes away the dust of the past."]
        },
        Mohamed_stage5_sun: {
            contents: ["I understand. The sun brings energy and life back to the valley."]
        },
        Mohamed_stage6_1: {
            contents: ["I walked by your farm the other day.", "You can really see the results of your hard work paying off."],
            options: [{
                text: "Thank you! I'm proud of it.",
                act: "Mohamed_stage6_proud"
            }, {
                text: "Thanks, but it's exhausting though!",
                act: "Mohamed_stage6_tired"
            }]
        },
        Mohamed_stage6_proud: {
            contents: ["As you should be. Pride in honest work is the best kind of pride."]
        },
        Mohamed_stage6_tired: {
            contents: ["Rest is just as important as work. Even the soil needs time to recover."]
        },
        Mohamed_stage7_1: {
            contents: ["Many years ago, the village used to host a great Harvest Festival.", "It brought everyone together. I hope we can revive that tradition."],
            options: [{
                text: "I'll do my best to bring it back!",
                act: "Mohamed_stage7_eager"
            }, {
                text: "That sounds like a lot of pressure...",
                act: "Mohamed_stage7_scared"
            }]
        },
        Mohamed_stage7_eager: {
            contents: ["I believe you will, farmer. The valley responds to your energy.", "Here's something for your journey."],
            act: "$Mohamed_karma"
        },
        Mohamed_stage7_scared: {
            contents: ["No pressure, friend. Traditions return when the time is right, not when forced."]
        },
        Mohamed_stage8_1: {
            contents: ["Everyone chases money these days, running in circles.", "They miss out on the joy of the simple things right in front of them."],
            options: [{
                text: "Both are important in a balanced way.",
                act: "Mohamed_stage8_balance"
            }, {
                text: "Happiness is definitely more important.",
                act: "Mohamed_stage8_happy"
            }]
        },
        Mohamed_stage8_balance: {
            contents: ["A practical approach. You need gold for seeds, and joy for the harvest."]
        },
        Mohamed_stage8_happy: {
            contents: ["A rich heart makes the simplest meal a feast. Keep that mindset, friend.", "Here's a small boost to your good vibes."],
            act: "$Mohamed_karma"
        },

        Bar_TV1_1: {
            contents: ["The TV is airing the latest weather report"],
            next: "Bar_TV1_2"
        },
        Bar_TV1_2: {
            contents: ["It seems like tomorrow will be another sunny day"],
        },
        Bar_TV2_1: {
            contents: ["An old TV", "Do you want to turn it on?"],
            options: [{
                text: "Yes",
                act: "Bar_TV2_2"
            }, {
                text: "No",
                act: "$close"
            }]
        },
        Bar_TV2_2: {
            contents: ["The screen is still black", "The TV seems to be broken"],
        },
        Mimo_interact1: {
            contents: ["Hello! I'm Mimo.", "Welcome to Sundew Valley!", "It's so good to have you here."],
            next: "Mimo_interact1_2"
        },
        Mimo_interact1_2: {
            contents: ["This farm has a long history.", "It was once the heart of the village."],
            next: "Mimo_interact2"
        },
        Mimo_interact2: {
            contents: ["Your grandfather loved this land.", "But over time, it became neglected."],
            next: "Mimo_interact2_2"
        },
        Mimo_interact2_2: {
            contents: ["The farm was filled with trash.", "We need your help to bring it back!"],
            next: "Mimo_interact3"
        },
        Mimo_interact3: {
            contents: ["To start, you can plant seeds", "and sell your crops."],
            next: "Mimo_interact3_2"
        },
        Mimo_interact3_2: {
            contents: ["You can also raise animals", "and sell its products.", "That's how you'll earn money."],
            next: "Mimo_interact4"
        },
        Mimo_interact4: {
            contents: ["One more thing! Please keep it clean.", "If you leave trash around,"],
            next: "Mimo_interact4_2"
        },
        Mimo_interact4_2: {
            contents: ["It will cause pollution.", "Nature is precious, let's protect it!"],
        },
        Mimo_stage2_1: {
            contents: ["Ah, I see you are getting the hang of things!", "The farm already looks much more alive."],
            next: "Mimo_stage2_2"
        },
        Mimo_stage2_2: {
            contents: ["Have you visited the shops in town yet?", "Maya at the crop shop has all the seasonal seeds you need."],
            next: "Mimo_stage2_3"
        },
        Mimo_stage2_3: {
            contents: ["And don't be shy with the other villagers!", "Mohamed at the bar is a bit of a philosopher, but he tells great stories."],
        },
        Mimo_stage3_1: {
            contents: ["Did you know that SunDew Valley has its little secrets?", "Always keep an eye on the weather report!"],
            next: "Mimo_stage3_2"
        },
        Mimo_stage3_2: {
            contents: ["The TV in Maryoma's bar is old, but the forecast is usually right.", "Rainy days are perfect for visiting the mines or the forest!"],
            next: "Mimo_stage3_3"
        },
        Mimo_stage3_3: {
            contents: ["One more tip: Tawfiq at the recycler is a good friend to have.", "He'll pay you for any trash you find. It's a win-win for everyone!"],
        },
        Mimo_stage4_1: {
            contents: ["Every time I look at this land, I'm reminded of your grandfather.", "He would be so happy to see what you are doing here."],
            next: "Mimo_stage4_2"
        },
        Mimo_stage4_2: {
            contents: ["You aren't just planting crops, you are planting hope.", "The whole valley is beginning to bloom because of you."],
            next: "Mimo_stage4_3"
        },
        Mimo_stage4_3: {
            contents: ["I'm proud of you, kid. Keep that spirit alive!", "Sundew Valley is truly your home now."],
        },

        Sebaey_interact1: {
            contents: [
                "Hey kid! Come here.", 
                "Why are there no energy drinks in this place?"
            ],
            next: "Sebaey_interact1_2"
        },
        Sebaey_interact1_2: {
            contents: ["And why is smoking prohibited here?!"],
            options: [{
                text: "Because they are bad for your health.",
                act: "Sebaey_interact2"
            }, {
                text: "It's just the bar's rules.",
                act: "Sebaey_interact3"
            }]
        },
        Sebaey_interact2: {
            contents: ["Bad for my health? Nonsense!", "But I guess I have no choice...", "Guess I'll just drink water."]
        },
        Sebaey_interact3: {
            contents: ["Rules? What a boring place...", "Whatever, I'll just drink water."]
        },
        Sebaey_stage2_1: {
            contents: ["Man, I am craving some fast food.", "Where can a guy get a double cheeseburger around here?!"],
            options: [{
                text: "Healthy food comes from the farm!",
                act: "Sebaey_stage2_healthy"
            }, {
                text: "Yeah, I really miss burgers too.",
                act: "Sebaey_stage2_burger"
            }]
        },
        Sebaey_stage2_healthy: {
            contents: ["Ugh, grass and carrots. You sound just like Maryoma!"]
        },
        Sebaey_stage2_burger: {
            contents: ["Right?! Finally, someone who understands me!", "Maybe I should open a burger stand myself."]
        },
        Sebaey_stage3_1: {
            contents: ["It's so quiet here at night... too quiet.", "I feel like I'm going to fall asleep standing up."],
            options: [{
                text: "The peacefulness is the best part!",
                act: "Sebaey_stage3_peace"
            }, {
                text: "It definitely needs more action.",
                act: "Sebaey_stage3_action"
            }]
        },
        Sebaey_stage3_peace: {
            contents: ["Peaceful? More like a ghost town.", "I need loud music and neon lights!"]
        },
        Sebaey_stage3_action: {
            contents: ["Exactly! We need some electric energy around here.", "I'm going crazy!"]
        },
        Sebaey_stage4_1: {
            contents: ["I've got so much pent up energy.", "I think I might start lifting weights to pass the time."],
            options: [{
                text: "You should! Youssef is opening a gym.",
                act: "Sebaey_stage4_gym"
            }, {
                text: "Try farming, it's a great workout!",
                act: "Sebaey_stage4_farm"
            }]
        },
        Sebaey_stage4_gym: {
            contents: ["A gym? Really? Now you are talking!", "I'll go check it out right away!"]
        },
        Sebaey_stage4_farm: {
            contents: ["Farming? Digging in the dirt?", "No thanks, I don't want to get my hands messy!"]
        },

        Soso_interact1: {
            contents: ["Help me please, I am very sick and hungry."],
            next: "Soso_interact1_2"
        },
        Soso_interact1_2: {
            contents: ["Could you spare some money?"],
            options: [{
                text: "Give $10",
                act: "$give_money_10"
            }, {
                text: "Give $50",
                act: "$give_money_50"
            }, {
                text: "Sorry, I don't have any money",
                act: "Soso_no_money_response"
            }]
        },
        Soso_give_10_success: {
            contents: ["Thank you so much!", "This will buy me some bread to eat today."],
        },
        Soso_give_50_success: {
            contents: ["Oh! You are so generous!", "Now I can buy both medicine and a good meal.", "May God bless you!"],
        },
        Soso_give_fail: {
            contents: ["You don't even have that much...", "It's okay, I'll ask someone else."],
        },
        Soso_no_money_response: {
            contents: ["I understand... things are hard for everyone.", "Thank you anyway. Have a nice day."],
        },
        Soso_spy_stage_1: {
            contents: ["You are so kind to me...", "Wait, let me tell you something I saw."],
            next: "Soso_spy_stage_2"
        },
        Soso_spy_stage_2: {
            contents: ["I saw Tawfiq the recycler hiding a shiny bag behind the shops last night.", "Maybe there is something valuable inside!"],
        },
        Soso_reward_stage_1: {
            contents: ["God bless you! Because of your help, I bought my medicine.", "I feel so much better now."],
            next: "Soso_reward_stage_2"
        },
        Soso_reward_stage_2: {
            contents: ["I found this item while walking by the farm.", "It looks like a special seed. Please, take it as a gift from me."],
            options: [{
                text: "Thank you, Soso!",
                act: "$soso_gift"
            }]
        },
        Soso_reward_success: {
            contents: ["It's the least I can do.", "You have a heart of gold, my friend."],
        },
        Soso_grateful_1: {
            contents: ["Ah, my favorite person!", "How is the farm today?"],
            next: "Soso_grateful_2"
        },
        Soso_grateful_2: {
            contents: ["The sunshine today reminds me of your kindness.", "May your crops grow tall and strong!"],
        },

        // ── 7azo ──────────────────────────────────────────────────
        "7azo_interact1": {
            contents: ["Yo! Ready for some action?", "I've been walking around all day looking for something exciting to do!"],
            options: [
                { text: "What kind of action are you looking for?", act: "7azo_s1_curious" },
                { text: "Come help me on the farm!", act: "7azo_s1_farm" }
            ]
        },
        "7azo_s1_curious": {
            contents: ["I don't know, man... races? challenges? anything!", "This town is chill but I need some energy in my life!"]
        },
        "7azo_s1_farm": {
            contents: ["The farm?! Digging and watering??", "...Actually, you know what, fine. Show me what you got!"]
        },
        "7azo_stage2_1": {
            contents: ["Okay farmer, I've been watching you work.", "Let's settle this with a challenge — who can harvest more crops today?"],
            options: [
                { text: "You're on! I won't go easy on you.", act: "7azo_s2_accept" },
                { text: "Haha I'm already ahead of you!", act: "7azo_s2_brag" }
            ]
        },
        "7azo_s2_accept": { contents: ["THAT'S what I'm talking about!", "May the best farmer win!"] },
        "7azo_s2_brag":   { contents: ["Pfft! That's big talk for someone with dirt on their shoes.", "Prove it, farmer!"] },
        "7azo_stage3_1": {
            contents: ["Bro, did you hear about the animals that escaped into town?", "I tried to catch one earlier... it was WAY faster than it looked."],
            options: [
                { text: "Ha! I've caught a few myself.", act: "7azo_s3_caught" },
                { text: "Those things are slippery!", act: "7azo_s3_agree" }
            ]
        },
        "7azo_s3_caught": { contents: ["No way! Teach me your ways!", "I'm going back out there, this time I'm ready."] },
        "7azo_s3_agree":  { contents: ["RIGHT?! I thought it would be easy.", "Respect to you if you caught any."] },
        "7azo_stage4_1": {
            contents: ["You know what makes a perfect day?", "Waking up with a plan, crushing it, and ending with something to be proud of."],
            options: [
                { text: "That's actually a solid life motto.", act: "7azo_s4_agree" },
                { text: "What if the plan fails?", act: "7azo_s4_fail" }
            ]
        },
        "7azo_s4_agree": { contents: ["Exactly! That's why I love it here.", "This farm life is actually teaching me a lot."] },
        "7azo_s4_fail":  { contents: ["Then you make a better plan tomorrow.", "Every failed harvest is just tomorrow's lesson."] },
        "7azo_stage5_1": {
            contents: ["Hey, real talk for a second.", "I came to Sundew Valley because I was tired of the noise back home."],
            next: "7azo_stage5_2"
        },
        "7azo_stage5_2": {
            contents: ["This place is different.", "People here actually care about what they build together.", "I think I found what I was looking for."]
        },

        // ── Jannah ────────────────────────────────────────────────
        Jannah_interact1: {
            contents: ["Hi there! Have you seen my friends around?", "I feel like everyone's always somewhere else in this big village!"],
            options: [
                { text: "I think I saw them near the farm.", act: "Jannah_s1_farm" },
                { text: "Maybe they're at the bar?", act: "Jannah_s1_bar" }
            ]
        },
        Jannah_s1_farm: { contents: ["Oh! I'll go check. Thank you so much!", "You're so helpful, I love that about you!"] },
        Jannah_s1_bar:  { contents: ["Maryoma's place? Good idea!", "She probably gave them a free juice and now they won't leave."] },
        Jannah_stage2_1: {
            contents: ["You know, this village has such a warm spirit.", "Everyone looks out for each other here."],
            options: [
                { text: "I've noticed that too. It's special.", act: "Jannah_s2_agree" },
                { text: "I'm still getting to know everyone.", act: "Jannah_s2_new" }
            ]
        },
        Jannah_s2_agree: { contents: ["Right?! It's the people that make a place feel like home.", "I'm glad you feel it too!"] },
        Jannah_s2_new:   { contents: ["That's okay, take your time!", "They'll all love you once they see how hard you work."] },
        Jannah_stage3_1: {
            contents: ["I've been helping Mimo coordinate a little community cleanup!", "If everyone picks up a little trash, the village stays beautiful."],
            next: "Jannah_stage3_2"
        },
        Jannah_stage3_2: {
            contents: ["Tawfiq the recycler was so happy to see us bring all those bags.", "It felt really good to do something together!"]
        },
        Jannah_stage4_1: {
            contents: ["I heard you have daily tasks you try to finish?", "That's such a good habit! I should try that too."],
            options: [
                { text: "It keeps me productive!", act: "Jannah_s4_productive" },
                { text: "It's hard to finish them all!", act: "Jannah_s4_hard" }
            ]
        },
        Jannah_s4_productive: { contents: ["I knew it! You always seem so focused.", "I'm going to start writing my tasks down every morning."] },
        Jannah_s4_hard:       { contents: ["Ha, even trying counts!", "Progress over perfection, that's what I always say."] },
        Jannah_stage5_1: {
            contents: ["You know, I didn't expect to feel this attached to Sundew Valley.", "But every person I meet here leaves a little mark on my heart."],
            next: "Jannah_stage5_2"
        },
        Jannah_stage5_2: {
            contents: ["I hope you know that includes you.", "Thank you for always being kind when we cross paths."]
        },

        // ── Mario ─────────────────────────────────────────────────
        Mario_interact1: {
            contents: ["Hey! I'm Mario. Nice to meet you!", "I've heard a lot about the farmer who's been reviving this valley!"],
            options: [
                { text: "Nice to meet you! Hope it's all good things.", act: "Mario_s1_good" },
                { text: "Word travels fast around here!", act: "Mario_s1_fast" }
            ]
        },
        Mario_s1_good: { contents: ["All good, I promise!", "I can already see the farm is in great hands."] },
        Mario_s1_fast: { contents: ["Ha! In a small town? News flies!", "But seriously, the work you're doing is impressive."] },
        Mario_stage2_1: {
            contents: ["I went for a walk past your farm this morning.", "I could see new crops growing — what are you planting this season?"],
            options: [
                { text: "Lots of things! Come see for yourself.", act: "Mario_s2_invite" },
                { text: "Still experimenting with the seasons.", act: "Mario_s2_season" }
            ]
        },
        Mario_s2_invite: { contents: ["Really?! I'd love that!", "I'll stop by soon, just don't put me to work!"] },
        Mario_s2_season: { contents: ["The seasons here are fascinating.", "Spring crops taste completely different from autumn ones, I'm told!"] },
        Mario_stage3_1: {
            contents: ["I explored the edge of town near the old fields earlier.", "There's so much of Sundew Valley still left to discover!"],
            next: "Mario_stage3_2"
        },
        Mario_stage3_2: {
            contents: ["I found a quiet little spot by some old fence posts.", "The view of your farm from there at sunset is honestly stunning."]
        },
        Mario_stage4_1: {
            contents: ["Look at you now compared to when you first arrived!", "The farm, the animals, the crops... this place has truly come alive."],
            options: [
                { text: "It hasn't been easy, but it's worth it!", act: "Mario_s4_worth" },
                { text: "There's still so much more to do.", act: "Mario_s4_more" }
            ]
        },
        Mario_s4_worth: { contents: ["That's the spirit!", "Hard work and pride in what you build — that's everything."] },
        Mario_s4_more:  { contents: ["I love that drive in you.", "Keep pushing. The best version of this farm is still ahead."] },
        Mario_stage5_1: {
            contents: ["You know, I've traveled to a lot of places.", "But nowhere felt quite like it needed me the way this valley does."],
            next: "Mario_stage5_2"
        },
        Mario_stage5_2: {
            contents: ["I think I'm going to stay here for a long, long time.", "And honestly? A big part of that is because of you, friend."]
        },

        Kinzy_interact1: {
            contents: ["Hello! What a beautiful day to be in the town square!"],
            options: [
                { text: "Yes, the weather is perfect.", act: "Kinzy_good" },
                { text: "It's a bit too hot for me.", act: "Kinzy_hot" }
            ]
        },
        Kinzy_good: { contents: ["I couldn't agree more! Enjoy your day!"] },
        Kinzy_hot: { contents: ["Haha, make sure you drink plenty of cold water then!"] },
        Mario_interact1: {
            contents: ["Hey! I'm Mario. Nice to meet you!"],
            options: [
                { text: "Nice to meet you too Mario!", act: "Mario_nice" },
                { text: "What do you do around here?", act: "Mario_work" }
            ]
        },
        Mario_nice: { contents: ["Let's be great friends!"] },
        Mario_work: { contents: ["I just love exploring the town and hanging out!"] },
        Youssef_interact1: {
            contents: ["Hello! Have you seen these buildings? They are going to become a big gym!"],
            next: "Youssef_interact1_2"
        },
        Youssef_interact1_2: {
            contents: ["Each building will be dedicated to a specific type of training."],
            next: "Youssef_interact2"
        },
        Youssef_interact2: {
            contents: ["Always remember the importance of sports.", "Staying active keeps both your body and mind strong!"],
            next: "Youssef_interact3"
        },
        Youssef_interact3: {
            contents: ["Will you do your best to stay active?"],
            options: [
                { text: "I totally agree! I love sports.", act: "Youssef_agree" },
                { text: "I will try my best to be active.", act: "Youssef_try" }
            ]
        },
        Youssef_agree: { contents: ["That's the spirit! Keep it up!"] },
        Youssef_try: { contents: ["A little effort every day goes a long way!"] },
        Beko_interact1: {
            contents: ["Hey! I'm Beko. I just arrived in Sundew Valley.", "I've been looking for the perfect spot for my new project."],
            next: "Beko_interact2"
        },
        Beko_interact2: {
            contents: ["I'm going to open the village's first luxury clothing store right here!", "Everyone needs to look their best, even on a farm, don't you think?"],
            options: [
                { text: "That sounds amazing! We need some style.", act: "Beko_choice_yes" },
                { text: "Luxury clothes? On a farm? Good luck...", act: "Beko_choice_no" }
            ]
        },
        Beko_choice_yes: {
            contents: ["Exactly! I knew you'd understand.", "I'll have some high-end fabrics arriving soon. Stay tuned!"],
        },
        Beko_choice_no: {
            contents: ["Haha, I like a challenge!", "Once people see my designs, they won't want to wear anything else!"],
        },
        Nader_interact1: {
            contents: ["Hey, I'm Nader!", "I'm checking out the new gym that Youssef is building.", "It's going to be awesome!"]
        },
        Omar_interact1: {
            contents: ["I can't wait for the gym to open.", "I need to get some gains!"]
        },
        Ramy_interact1: {
            contents: ["Hello there! I love hanging around the crop shop.", "Maya always has the freshest seeds and vegetables."]
        }
    }


    static #PORTRAIT_CONFIG = {
        maya: { scale: 1.0, yOffset: 0.5 },
        Mohamed: { scale: 1.4, yOffset: 0.5 },
        mimo: { scale: 1.0, yOffset: 0.5 },
        maryoma: { scale: 1.0, yOffset: 0.45 },
        zozo: { scale: 1.0, yOffset: 0.5 },
        recycler: { scale: 1.0, yOffset: 0.5 },
        sebaey: { scale: 1.1, yOffset: 0.3 },
        soso: { scale: 1.0, yOffset: 0.3 },
        grandmother: { scale: 1.0, yOffset: 0.25 },
        "7azo": { scale: 1.0, yOffset: 0.4 },
        jannah: { scale: 1.0, yOffset: 0.45 },
        kinzy: { scale: 1.0, yOffset: 0.5 },
        mario: { scale: 1.2, yOffset: 0.45 },
        youssef: { scale: 1.0, yOffset: 0.4 },
        beko: { scale: 1.0, yOffset: 0.3 }
    }

    static isAnyDialoguePlaying() {
        return this.#CURRENT != null
    }

    static isGrandmotherSick() {
        // She gets sick every 5 days.
        const currentDay = DateTimeSystem.getTotalDays()
        return currentDay - this.LAST_CURED_DAY >= 5
    }


    static getInitBy() {
        return this.#CURRENT_INIT_BY
    }

    static update(key, initBy) {
        // ── Stage routing for multi-stage NPCs ──────────────────────
        if (key === "7azo_interact1") {
            Dialogues.HAZO_INTERACTION_COUNT++;
            const s = Math.floor((Dialogues.HAZO_INTERACTION_COUNT - 1) / 2);
            key = s === 0 ? "7azo_interact1" :
                  s === 1 ? "7azo_stage2_1" :
                  s === 2 ? "7azo_stage3_1" :
                  s === 3 ? "7azo_stage4_1" : "7azo_stage5_1";
        } else if (key === "Jannah_interact1") {
            Dialogues.JANNAH_INTERACTION_COUNT++;
            const s = Math.floor((Dialogues.JANNAH_INTERACTION_COUNT - 1) / 2);
            key = s === 0 ? "Jannah_interact1" :
                  s === 1 ? "Jannah_stage2_1" :
                  s === 2 ? "Jannah_stage3_1" :
                  s === 3 ? "Jannah_stage4_1" : "Jannah_stage5_1";
        } else if (key === "Mario_interact1") {
            Dialogues.MARIO_INTERACTION_COUNT++;
            const s = Math.floor((Dialogues.MARIO_INTERACTION_COUNT - 1) / 2);
            key = s === 0 ? "Mario_interact1" :
                  s === 1 ? "Mario_stage2_1" :
                  s === 2 ? "Mario_stage3_1" :
                  s === 3 ? "Mario_stage4_1" : "Mario_stage5_1";
        }
        // ─────────────────────────────────────────────────────────────
        if (key === "Soso_interact1" && !SaveManager.hasSeenVideo("soso")) {
            SaveManager.markVideoAsSeen("soso");
            StoryIntroUI.play("./images/story/stoery_time5.mp4", () => {
                Dialogues.update(key, initBy);
            });
            return;
        }
        if (key === "Recycler_interact1" && !SaveManager.hasSeenVideo("recycler")) {
            SaveManager.markVideoAsSeen("recycler");
            StoryIntroUI.play("./images/story/story_time6.mp4", () => {
                Dialogues.update(key, initBy);
            });
            return;
        }
        this.#CURRENT = this.#SCRIPTS[key]
        this.#CURRENT_INIT_BY = initBy
    }

    static draw(ctx) {
        if (this.isAnyDialoguePlaying()) {
            ctx.save();
            
            const marginX = ctx.canvas.width * 0.05;
            const marginY = ctx.canvas.height * 0.05;
            const boxWidth = ctx.canvas.width - marginX * 2;
            const boxHeight = ctx.canvas.height * 0.22;
            const boxX = marginX;
            const boxY = ctx.canvas.height - boxHeight - marginY;

            // 1. Draw Dialogue Box (No Shadows, Creamy Amber Theme)
            ctx.save();
            ctx.shadowBlur = 0;
            const bgGradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
            bgGradient.addColorStop(0, "rgba(255, 252, 235, 0.96)");
            bgGradient.addColorStop(1, "rgba(255, 235, 170, 0.96)");
            ctx.fillStyle = bgGradient;
            
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 20);
            else ctx.rect(boxX, boxY, boxWidth, boxHeight);
            ctx.fill();
            
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(255, 180, 0, 0.5)"; // Amber Border
            ctx.stroke();
            ctx.restore();

            // 2. 3D Speaker Portrait Bubble (Popping out of the top edge)
            const portraitSize = boxHeight * 1.1; 
            const portraitX = boxX + portraitSize * 0.1;
            const portraitCenterY = boxY - portraitSize * 0.4; // Centered on the top edge (popping out)
            
            if (Dialogues.#CURRENT_INIT_BY && (Dialogues.#CURRENT_INIT_BY.getName || Dialogues.#CURRENT_INIT_BY.getType)) {
                // Use visual type for assets (like portraits), identity name for labels
                const charVisualType = Dialogues.#CURRENT_INIT_BY.getType ? Dialogues.#CURRENT_INIT_BY.getType() : Dialogues.#CURRENT_INIT_BY.getName().toLowerCase();
                const config = Dialogues.#PORTRAIT_CONFIG[charVisualType] || { scale: 1.1, yOffset: 0.5 };
                
                // Prioritize HD portrait, fallback to standard spritesheet
                const hdImg = ASSET_MANAGER.getImage("characters", "portraits", charVisualType + "_hd.png");
                const charImg = hdImg || ASSET_MANAGER.getImage("characters", charVisualType + ".png");
                
                if (charImg) {
                    ctx.save();
                    // Draw Bubble Background (Soft depth)
                    ctx.beginPath();
                    ctx.arc(portraitX + portraitSize / 2, portraitCenterY + portraitSize / 2, portraitSize / 2, 0, Math.PI * 2);
                    const bgGrad = ctx.createRadialGradient(portraitX + portraitSize / 2, portraitCenterY + portraitSize / 2, 0, portraitX + portraitSize / 2, portraitCenterY + portraitSize / 2, portraitSize / 2);
                    bgGrad.addColorStop(0, "rgba(255, 245, 200, 0.4)");
                    bgGrad.addColorStop(1, "rgba(255, 200, 100, 0.2)");
                    ctx.fillStyle = bgGrad;
                    ctx.fill();

                    // Draw Bubble Glow
                    ctx.beginPath();
                    ctx.arc(portraitX + portraitSize / 2, portraitCenterY + portraitSize / 2, portraitSize / 1.8, 0, Math.PI * 2);
                    const bubbleGrad = ctx.createRadialGradient(portraitX + portraitSize * 0.4, portraitCenterY + portraitSize * 0.4, 0, portraitX + portraitSize / 2, portraitCenterY + portraitSize / 2, portraitSize / 2);
                    bubbleGrad.addColorStop(0, "rgba(255, 255, 255, 0.3)");
                    bubbleGrad.addColorStop(0.8, "rgba(255, 215, 0, 0.1)");
                    bubbleGrad.addColorStop(1, "rgba(255, 180, 0, 0.3)");
                    ctx.fillStyle = bubbleGrad;
                    ctx.fill();
                    
                    // Clip and Draw Character
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(portraitX + portraitSize / 2, portraitCenterY + portraitSize / 2, portraitSize / 2.1, 0, Math.PI * 2);
                    ctx.clip();
                    
                    if (hdImg) {
                        // HD Portrait (Single frame, high res)
                        ctx.imageSmoothingEnabled = true;

                        // Use custom config to frame the image perfectly filling the circle
                        const drawW = portraitSize * config.scale; 
                        const drawH = drawW * (charImg.height / charImg.width);
                        const drawX = (portraitX + portraitSize / 2) - drawW / 2;
                        const drawY = (portraitCenterY + portraitSize / 2) - drawH * config.yOffset;
                        
                        ctx.drawImage(charImg, drawX, drawY, drawW, drawH);
                    } else {
                        // Spritesheet Fallback (Pixel art)
                        const frameW = charImg.width / 4; 
                        const frameH = charImg.height / 4;
                        const drawW = portraitSize * 1.8;
                        const drawH = drawW * (frameH / frameW);
                        const drawX = (portraitX + portraitSize / 2) - drawW / 2;
                        const drawY = (portraitCenterY + portraitSize / 2) - drawH * 0.38; // Shifted down slightly (from 0.45)
                        ctx.imageSmoothingEnabled = false;
                        ctx.drawImage(charImg, 0, 0, frameW, frameH, drawX, drawY, drawW, drawH);
                    }
                    ctx.restore();
                    
                    // 3D Glassy Rim
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
                    ctx.beginPath();
                    ctx.arc(portraitX + portraitSize / 2, portraitCenterY + portraitSize / 2, portraitSize / 2.1, -Math.PI * 0.8, -Math.PI * 0.2);
                    ctx.stroke();
                    
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = "rgba(255, 180, 0, 0.8)";
                    ctx.beginPath();
                    ctx.arc(portraitX + portraitSize / 2, portraitCenterY + portraitSize / 2, portraitSize / 2.1, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            // 3. Dialogue Content Layout (Increased padding and line height)
            const portraitExists = (Dialogues.#CURRENT_INIT_BY && Dialogues.#CURRENT_INIT_BY.getName);
            const contentOffsetX = portraitExists ? portraitSize * 1.3 : marginX * 1.5;
            const textFontSize = Math.floor(ctx.canvas.height / 28);
            const labelColor = "#5d4037"; // Warmer Rich Brown

            // Draw character name label + friendship hearts
            if (Dialogues.#CURRENT_INIT_BY) {
                const _DISPLAY_NAMES = { "Mohamed": "Mohamed", "mohamed": "Mohamed" };
                const _rawName = typeof Dialogues.#CURRENT_INIT_BY === "string" ? Dialogues.#CURRENT_INIT_BY : Dialogues.#CURRENT_INIT_BY.getName();
                const nameStr = _DISPLAY_NAMES[_rawName] || _DISPLAY_NAMES[_rawName.toLowerCase()] || _rawName;
                const namePx = boxX + contentOffsetX;
                const namePy = boxY + textFontSize * 0.8;
                
                Font.draw(ctx, nameStr, textFontSize * 1.0, namePx, namePy, labelColor, "rgba(0,0,0,0.05)", "Segoe UI", "bold", false);

                // Draw friendship hearts (up to 5 shown, rest indicated by number)
                if (typeof FriendshipManager !== "undefined") {
                    const hearts = FriendshipManager.getHearts(nameStr);
                    if (hearts > 0) {
                        const hSize = textFontSize * 0.75;
                        const shown = Math.min(hearts, 5);
                        const hasTrophy = hearts >= 5;
                        
                        // Calculate start X from the right edge
                        const heartsTotalWidth = shown * (hSize + 2) + (hasTrophy ? textFontSize * 1.2 : 0);
                        const hStartX = boxX + boxWidth - marginX * 1.5 - heartsTotalWidth;
                        const hStartY = namePy; 
                        
                        ctx.font = `${hSize}px serif`;
                        ctx.textBaseline = "middle";
                        for (let h = 0; h < shown; h++) {
                            ctx.fillStyle = "#ff5252";
                            ctx.fillText("♥", hStartX + h * (hSize + 2), hStartY);
                        }
                        
                        // Show Trophy for Max Friendship (5+ hearts)
                        if (hasTrophy) {
                            const iconSize = textFontSize * 0.8;
                            const tx = hStartX + shown * (hSize + 2) + 5;
                            ctx.font = `${iconSize}px Segoe UI Emoji`;
                            ctx.fillStyle = "#ffd700";
                            ctx.fillText("🏆", tx, hStartY);
                        }
                        ctx.restore();
                    }
                }
            }

            // Draw dialogue lines with Auto-Wrap wrapping — clipped to box so text never overflows
            ctx.save();
            ctx.beginPath();
            ctx.rect(boxX + contentOffsetX, boxY + textFontSize * 1.2, boxWidth - contentOffsetX - marginX, boxHeight - textFontSize * 1.5);
            ctx.clip();

            let lineIndex = 0;
            const maxLineWidth = boxWidth - contentOffsetX - textFontSize * 2;
            Font.update(ctx, textFontSize); 
            
            Dialogues.#CURRENT.contents.forEach(_l => {
                const words = _l.split(' ');
                let currentLine = '';
                
                for (let i = 0; i < words.length; i++) {
                    const testLine = currentLine + words[i] + ' ';
                    const testWidth = Font.measure(ctx, testLine).width;
                    
                    if (testWidth > maxLineWidth && i > 0) {
                        Font.draw(
                            ctx, currentLine, textFontSize, 
                            boxX + contentOffsetX, 
                            boxY + textFontSize * (2.6 + lineIndex), 
                            "#3e2723", "rgba(255,255,255,0.1)", "Segoe UI", "bold", false
                        );
                        currentLine = words[i] + ' ';
                        lineIndex += 1.5;
                    } else {
                        currentLine = testLine;
                    }
                }
                
                Font.draw(
                    ctx, currentLine, textFontSize, 
                    boxX + contentOffsetX, 
                    boxY + textFontSize * (2.6 + lineIndex), 
                    "#3e2723", "rgba(255,255,255,0.1)", "Segoe UI", "bold", false
                );
                lineIndex += 1.5;
            });
            ctx.restore(); // end text clip region

            // Handle Next Indicator / Options
            const hasNoOption = this.#CURRENT["options"] == null || this.#CURRENT["options"].length <= 0;
            let currentHover = -1;
            
            if (hasNoOption) {
                // Interactive Next/End Button
                const isLastSegment = this.#CURRENT.next == null;
                const buttonText = isLastSegment ? "End" : "Next";
                const btnPaddingX = textFontSize * 1.5;
                const btnPaddingY = textFontSize * 0.6;
                const btnX = boxX + boxWidth - textFontSize * 6; // Sufficient width for text
                const btnY = boxY + boxHeight - textFontSize * 2.6;
                
                if (MessageButton.draw(ctx, buttonText, textFontSize, btnX, btnY, btnPaddingX, btnPaddingY, true)) {
                    currentHover = 999; // Arbitrary ID for Next/End button
                }
            } else {
                // Draw Options
                for (let i = 0, l = this.#CURRENT["options"].length; i < l; i++) {
                    const optionText = this.#CURRENT["options"][i]["text"];
                    Font.update(ctx, textFontSize);
                    const textWidth = Font.measure(ctx, optionText).width;
                    const optX = boxX + boxWidth - textWidth - textFontSize * 3;
                    const optY = boxY - textFontSize * (l - i) * 2.2 - textFontSize;
                    
                    if (MessageButton.draw(ctx, optionText, textFontSize, optX, optY)) {
                        currentHover = i;
                    }
                }
            }

            ctx.restore();

            // Mouse Click Handling
            if (!Controller.mouse_prev.leftClick && Controller.mouse.leftClick) {
                if (hasNoOption) {
                    if (this.#CURRENT.next == null) {
                        this.#CURRENT = null;
                        setTimeout(() => Controller.keys["KeyV"] = false, 50); // consume key buffer fast
                    } else {
                        this.update(this.#CURRENT.next, this.#CURRENT_INIT_BY)
                    }
                } else if (currentHover >= 0) {
                    if (this.#CURRENT["options"][currentHover].act.startsWith("$")) {
                        if (this.#CURRENT["options"][currentHover].act.localeCompare("$close") === 0) {
                            this.#CURRENT = null;
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$trade") === 0) {
                            this.#CURRENT = null;
                            GAME_ENGINE.getPlayerUi().startATrade(this.#CURRENT_INIT_BY);
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$make_juice") === 0) {
                            if (Level.PLAYER.tryUseItem("pumpkin", 1) && Level.PLAYER.tryUseItem("strawberry", 1)) {
                                Level.PLAYER.obtainItem("medicinal_juice", 1);
                                this.update("Maryoma_juice_success", this.#CURRENT_INIT_BY);
                            } else {
                                this.update("Maryoma_juice_fail", this.#CURRENT_INIT_BY);
                            }
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$give_juice") === 0) {
                            if (Level.PLAYER.tryUseItem("medicinal_juice", 1)) {
                                this.LAST_CURED_DAY = DateTimeSystem.getTotalDays()
                                Level.PLAYER.addKarma(40); // Large karma boost for helping Grandma
                                FriendshipManager.addPoints("Grandmother", 15);
                                this.update("Grandmother_juice_success", this.#CURRENT_INIT_BY);

                            } else {
                                this.update("Grandmother_juice_fail", this.#CURRENT_INIT_BY);
                            }

                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$give_trash") === 0) {
                            // Calculate total trash from both inventory and item bar
                            const invTrash = Level.PLAYER.getInventory()["trash"] ? Level.PLAYER.getInventory()["trash"].amount : 0;
                            const barTrash = Level.PLAYER.getItemBar()["trash"] ? Level.PLAYER.getItemBar()["trash"].amount : 0;
                            const totalTrash = invTrash + barTrash;

                            if (totalTrash > 0) {
                                Level.PLAYER.earnMoney(totalTrash * 15);
                                // Remove from inventory if exists
                                if (invTrash > 0) Level.PLAYER.tryUseItem("trash", invTrash);
                                // Remove from bar if exists
                                if (barTrash > 0) Level.PLAYER.tryUseItem("trash", barTrash);
                                
                                // Each bag of trash recycled adds to the Good Deed bar
                                Level.PLAYER.addKarma(totalTrash * 3);
                                QuestManager.notifyTrash(totalTrash);
                                if (typeof AchievementManager !== "undefined") {
                                    AchievementManager.notifyRecycle(totalTrash);
                                }
                                FriendshipManager.addPoints("Recycler", Math.min(totalTrash * 3, 15));

                                this.update("Recycler_trash_success", this.#CURRENT_INIT_BY);

                            } else {
                                this.update("Recycler_trash_fail", this.#CURRENT_INIT_BY);
                            }
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$knock_door") === 0) {
                            ASSET_MANAGER.playSound("knock.mp3");
                            ASSET_MANAGER.playSound("knock.mp3");
                            ASSET_MANAGER.playSound("knock.mp3");
                            if (!Dialogues.HAS_KNOCKED_TODAY) {
                                Dialogues.HAS_KNOCKED_TODAY = true;
                                Level.PLAYER.earnMoney(20);
                                this.update("FarmHouse_Knock_First_Reward", null);
                            } else {
                                Level.PLAYER.earnMoney(5);
                                this.update("FarmHouse_Knock_Repeat", null);
                            }
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$enter_farmhouse") === 0) {
                            if (!Dialogues.HAS_KNOCKED_TODAY) {
                                // Penalty for not knocking!
                                if (Level.PLAYER.getMoney() >= 15) {
                                    Level.PLAYER.setMoney(Level.PLAYER.getMoney() - 15);
                                    Dialogues.HAS_KNOCKED_TODAY = true; // allow entry after fine
                                    this.update("Grandmother_fine", null);
                                } else {
                                    Dialogues.HAS_KNOCKED_TODAY = true; // allow entry after scold
                                    this.update("Grandmother_scold", null);
                                }
                            } else {
                                this.#CURRENT = null;
                                Transition.start(() => {
                                    GAME_ENGINE.enterLevel("bedroom");
                                    Level.PLAYER.setMapReference(GAME_ENGINE.getCurrentLevel());
                                    Level.teleportPlayer(24.5, 25.9);
                                });
                            }
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$give_money_10") === 0) {
                            if (Level.PLAYER.getMoney() >= 10) {
                                Level.PLAYER.setMoney(Level.PLAYER.getMoney() - 10);
                                Dialogues.SOSO_GENEROSITY_LEVEL++;
                                Level.PLAYER.addKarma(10);
                                FriendshipManager.addPoints("Soso", 10);
                                this.update("Soso_give_10_success", this.#CURRENT_INIT_BY);


                            } else {
                                this.update("Soso_give_fail", this.#CURRENT_INIT_BY);
                            }
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$give_money_50") === 0) {
                            if (Level.PLAYER.getMoney() >= 50) {
                                Level.PLAYER.setMoney(Level.PLAYER.getMoney() - 50);
                                Dialogues.SOSO_GENEROSITY_LEVEL += 2; // Giving more builds trust faster
                                Level.PLAYER.addKarma(35);
                                FriendshipManager.addPoints("Soso", 20);
                                this.update("Soso_give_50_success", this.#CURRENT_INIT_BY);


                            } else {
                                this.update("Soso_give_fail", this.#CURRENT_INIT_BY);
                            }
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$buy_water") === 0) {
                            if (Level.PLAYER.getMoney() >= 5) {
                                Level.PLAYER.setMoney(Level.PLAYER.getMoney() - 5);
                                Level.PLAYER.obtainItem("water", 1);
                                this.update("Bar_buy_success", this.#CURRENT_INIT_BY);
                            } else {
                                this.update("Bar_buy_fail", this.#CURRENT_INIT_BY);
                            }
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$buy_orange_juice") === 0) {
                            if (Level.PLAYER.getMoney() >= 15) {
                                Level.PLAYER.setMoney(Level.PLAYER.getMoney() - 15);
                                Level.PLAYER.obtainItem("orange_juice", 1);
                                this.update("Bar_buy_success", this.#CURRENT_INIT_BY);
                            } else {
                                this.update("Bar_buy_fail", this.#CURRENT_INIT_BY);
                            }
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$buy_apple_juice") === 0) {
                            if (Level.PLAYER.getMoney() >= 15) {
                                Level.PLAYER.setMoney(Level.PLAYER.getMoney() - 15);
                                Level.PLAYER.obtainItem("apple_juice", 1);
                                this.update("Bar_buy_success", this.#CURRENT_INIT_BY);
                            } else {
                                this.update("Bar_buy_fail", this.#CURRENT_INIT_BY);
                            }
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$soso_gift") === 0) {

                            Level.PLAYER.obtainItem("strawberry_seed", 5);
                            this.update("Soso_reward_success", this.#CURRENT_INIT_BY);
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$Mohamed_karma") === 0) {
                            Level.PLAYER.addKarma(15);
                            this.#CURRENT = null;
                        } else if (this.#CURRENT["options"][currentHover].act.localeCompare("$open_bar_shop") === 0) {
                            GAME_ENGINE.addUI(new TradeUI(Level.PLAYER, this.#CURRENT_INIT_BY));
                            this.#CURRENT = null;
                        }

                    } else {
                        this.update(this.#CURRENT["options"][currentHover].act, this.#CURRENT_INIT_BY)
                    }
                }
            }
        }
    }
}
