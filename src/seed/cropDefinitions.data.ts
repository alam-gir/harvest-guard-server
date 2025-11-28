import { LocalizedString } from "../models/types/common";
import { ICropDefinition } from "../models/CropDefinition";

const ls = (bn: string, en: string): LocalizedString => ({ bn, en });

export const cropDefinitionSeeds: Partial<ICropDefinition>[] = [
  //
  // 1. Boro Paddy (ইরি-বোরো ধান)
  //
  {
    code: "paddy_boro",
    name: ls("বোরো ধান", "Boro paddy"),
    varieties: [
      ls("ব্রি ধান-২৮", "BRRI dhan-28"),
      ls("ব্রি ধান-২৯", "BRRI dhan-29"),
      ls("হাইব্রিড বোরো", "Hybrid Boro")
    ],
    isActive: true,
    stages: [
      {
        key: "seedling",
        order: 1,
        logicalPhase: "growing",
        minDayFromPlanting: 0,
        maxDayFromPlanting: 25,
        name: ls("চারা", "Seedling"),
        wateringAdvice: ls(
          "নার্সারির মাটি সবসময় একটু ভেজা রাখুন, কিন্তু পানি জমে থাকতে দেবেন না।",
          "Keep nursery soil slightly moist, but avoid standing water."
        ),
        fertilizerAdvice: ls(
          "হালকা ইউরিয়া ব্যবহার করা যায়, কিন্তু বেশি সার দিলে চারা পুড়ে যায়।",
          "Light urea may be used, but excess fertilizer can burn seedlings."
        ),
        generalAdvice: ls(
          "দুর্বল বা অসুস্থ চারা তুলে ফেলুন, সুস্থ চারা রেখে দিন।",
          "Remove weak or diseased seedlings and keep only healthy ones."
        ),
        commonIssues: [
          ls("চারা পচা বা পড়ে যাওয়া।", "Seedling rot or damping off."),
          ls("পাতা হালকা হলুদ হয়ে যাওয়া।", "Leaves turning pale yellow.")
        ]
      },
      {
        key: "tillering",
        order: 2,
        logicalPhase: "growing",
        minDayFromPlanting: 26,
        maxDayFromPlanting: 60,
        name: ls("গাছ বেড়া", "Tillering"),
        wateringAdvice: ls(
          "জমিতে ২–৫ সেমি পানি রাখুন। একেবারে শুকিয়ে গেলে গাছ ক্ষতি পায়।",
          "Maintain 2–5 cm water; do not let the field dry fully."
        ),
        fertilizerAdvice: ls(
          "এই সময় ইউরিয়া ও টিএসপি সুপারিশমতো দিন, এতে শীষ বেশি হবে।",
          "Apply urea and TSP as recommended to increase tillers."
        ),
        generalAdvice: ls(
          "আগাছা পরিষ্কার করুন, যাতে সারের সুফল গাছ পায়।",
          "Remove weeds so fertilizer benefits the crop, not weeds."
        ),
        commonIssues: [
          ls("আগাছা বেশি হওয়া।", "Heavy weed infestation."),
          ls("বাগডা পোকার আক্রমণ।", "Stem borer attack.")
        ],
        weatherRules: [
          {
            condition: { maxTempC: 22, maxHumidity: 95, minRainProb: 60 },
            advice: ls(
              "ঠান্ডা আর বেশি ভেজা আবহাওয়ায় ব্লাস্ট রোগের ঝুঁকি বাড়ে, পাতায় দাগ দেখলে দ্রুত ব্যবস্থা নিন।",
              "Cool and very humid weather increases blast risk; act quickly if you see leaf spots."
            )
          }
        ]
      },
      {
        key: "booting_flowering",
        order: 3,
        logicalPhase: "pre_harvest",
        minDayFromPlanting: 61,
        maxDayFromPlanting: 90,
        name: ls("ফুল আসা", "Booting & flowering"),
        wateringAdvice: ls(
          "এই সময় হঠাৎ পানি কমে গেলে ফলন কমে যায়, তাই পানি নিয়মিত রাখুন।",
          "Sudden water shortage now reduces yield, keep water regular."
        ),
        fertilizerAdvice: ls(
          "শেষ কিস্তির ইউরিয়া এই পর্যায়ের আগেই শেষ করে নিন।",
          "Finish the last urea dose before this stage."
        ),
        generalAdvice: ls(
          "জমিতে বেশি হাঁটাহাঁটি করবেন না, গাছের ওপর চাপ পড়লে শীষে প্রভাব পড়ে।",
          "Avoid walking in the field too much; it stresses the plants."
        ),
        commonIssues: [
          ls("শীষের ব্লাস্ট রোগ।", "Panicle blast."),
          ls("শীষ সম্পূর্ণ বের না হওয়া।", "Incomplete panicle emergence.")
        ]
      },
      {
        key: "grain_filling",
        order: 4,
        logicalPhase: "pre_harvest",
        minDayFromPlanting: 91,
        maxDayFromPlanting: 110,
        name: ls("ধান ভরা", "Grain filling"),
        wateringAdvice: ls(
          "গাছের গোড়ায় হালকা আর্দ্রতা রাখুন, হঠাৎ শুকিয়ে দিলে দানা ফাঁপা হয়।",
          "Keep soil slightly moist; sudden drying leads to empty grains."
        ),
        generalAdvice: ls(
          "ঝড়-বৃষ্টির সময় গাছ বেশি হেলে পড়লে প্রয়োজন হলে বাঁশ বা দড়ি দিয়ে আটকান।",
          "If plants lodge due to storms, support them with bamboo or rope."
        )
      },
      {
        key: "harvest_window",
        order: 5,
        logicalPhase: "harvest_window",
        minDayFromPlanting: 111,
        maxDayFromPlanting: 135,
        name: ls("ধান কাটা", "Harvest"),
        generalAdvice: ls(
          "প্রায় ৮০–৮৫% শীষ সোনালি হলে ধান কেটে ফেলুন, দেরি করলে বেশি ঝরে পড়ে।",
          "Harvest when about 80–85% of panicles are golden; delay increases shattering."
        ),
        weatherRules: [
          {
            condition: { minRainProb: 60 },
            advice: ls(
              "আগামী কিছুদিন বৃষ্টির সম্ভাবনা বেশি, সম্ভব হলে আজ-কালের মধ্যে ধান কেটে নিরাপদ জায়গায় আনুন।",
              "Rain risk is high in the next days; try to harvest and move paddy to a safe place soon."
            )
          }
        ]
      }
    ],
    storageProfile: {
      idealHumidity: 13,
      badHumidity: 16,
      idealTemperature: 25,
      badTemperature: 32,
      sensitiveToRain: true,
      recommendedStorageTypes: ["JUTE_BAG_STACK", "METAL_BIN"],
      storageHints: [
        ls(
          "ধান ভালোভাবে শুকিয়ে তারপর বস্তা বা বিনে তুলুন। দানা ভাঙা বা নরম থাকলে আরেকটু শুকিয়ে নিন।",
          "Dry paddy well before putting into bags or bins; if grains feel soft, dry a bit more."
        ),
        ls(
          "গুদাম ঘর শুকনো, বাতাস চলাচলযুক্ত এবং ইঁদুর-মুক্ত রাখুন।",
          "Keep the storage room dry, well-ventilated and rodent-free."
        )
      ],
      highHumidityMessageTemplate: ls(
        "এখন {cropName} দানার আর্দ্রতা প্রায় {currentMoisture}%। নিরাপদ রাখতে আর্দ্রতা {idealMoisture}% এর কাছাকাছি নামিয়ে রাখুন।",
        "Right now {cropName} grain moisture is about {currentMoisture}%. For safe storage, dry closer to {idealMoisture}%."
      ),
      highTemperatureMessageTemplate: ls(
        "গুদামের তাপমাত্রা প্রায় {currentTemp}°C। চেষ্টা করুন তাপমাত্রা {idealTemp}°C এর কাছাকাছি নামিয়ে রাখতে, না হলে পোকা আর ফাংগাসের ঝুঁকি বাড়বে।",
        "Store temperature is around {currentTemp}°C. Try to keep it near {idealTemp}°C to reduce insects and fungus."
      )
    }
  },

  //
  // 2. Aman Paddy
  //
  {
    code: "paddy_aman",
    name: ls("আমন ধান", "Aman paddy"),
    varieties: [
      ls("ব্রি ধান-৪৯", "BRRI dhan-49"),
      ls("ব্রি ধান-৫১", "BRRI dhan-51"),
      ls("স্থানীয় আমন", "Local Aman")
    ],
    isActive: true,
    stages: [
      {
        key: "transplant",
        order: 1,
        logicalPhase: "growing",
        minDayFromPlanting: 0,
        maxDayFromPlanting: 30,
        name: ls("রোপা", "Transplant"),
        generalAdvice: ls(
          "সম্ভব হলে একসাথে একই সময়ের মধ্যে রোপণ শেষ করুন, এতে জমি সমানভাবে বড় হয়।",
          "Try to finish transplanting in a short window so the field grows uniformly."
        ),
        wateringAdvice: ls(
          "রোপণের সময় জমিতে যথেষ্ট পানি থাকা জরুরি, পরে ধীরে ধীরে স্বাভাবিক উচ্চতায় আনুন।",
          "Ensure enough water at transplanting, then adjust to normal depth."
        )
      },
      {
        key: "rainfed_grow",
        order: 2,
        logicalPhase: "growing",
        minDayFromPlanting: 31,
        maxDayFromPlanting: 80,
        name: ls("বৃষ্টির বেড়া", "Rainfed growth"),
        wateringAdvice: ls(
          "দীর্ঘ খরা হলে সম্ভব হলে এক-দুইবার সেচ দিন, নাহলে ফলন কমে যাবে।",
          "During long dry spells, give 1–2 irrigations if possible to avoid yield loss."
        ),
        generalAdvice: ls(
          "আগাছা সময়মতো পরিষ্কার করলে সার ও পানির পুরো সুফল গাছ পায়।",
          "Timely weeding helps the crop use water and nutrients fully."
        )
      },
      {
        key: "pre_harvest",
        order: 3,
        logicalPhase: "harvest_window",
        minDayFromPlanting: 100,
        maxDayFromPlanting: 140,
        name: ls("কাটা সময়", "Harvest time"),
        generalAdvice: ls(
          "ঝড়-বৃষ্টি শুরু হওয়ার আগেই ধান কাটার চেষ্টা করুন, বিশেষ করে উপকূলীয় এলাকায়।",
          "Try to harvest before storms and heavy rain, especially in coastal areas."
        )
      }
    ],
    storageProfile: {
      idealHumidity: 13,
      badHumidity: 16,
      idealTemperature: 26,
      badTemperature: 32,
      sensitiveToRain: true,
      recommendedStorageTypes: ["JUTE_BAG_STACK", "BAMBOO_BIN"],
      storageHints: [
        ls(
          "ধান সংরক্ষণের আগে দিন-দুয়েক ভালো রোদে শুকিয়ে নিন, রাতে ভেজা কুয়াশা থেকে বাঁচিয়ে রাখুন।",
          "Before storage, sun-dry for 1–2 days and protect from night-time dew."
        )
      ],
      highHumidityMessageTemplate: ls(
        "{cropName} এখন বেশ ভেজা (প্রায় {currentMoisture}%) অবস্থায় আছে। নিরাপদ রাখার জন্য আর্দ্রতা {idealMoisture}% এর নিচে নামিয়ে তারপর গুদামে রাখুন।",
        "{cropName} is still quite moist (about {currentMoisture}%). For safe storage, dry below {idealMoisture}% before storing."
      ),
      highTemperatureMessageTemplate: ls(
        "আপনার গুদামের তাপমাত্রা {currentTemp}°C এর কাছাকাছি। যতটা সম্ভব {idealTemp}°C এর কাছাকাছি পরিবেশে রাখলে ধান অনেকদিন ভালো থাকবে।",
        "Your store is around {currentTemp}°C. Keeping closer to {idealTemp}°C will help the paddy last longer."
      )
    }
  },

  //
  // 3. Wheat (গম)
  //
  {
    code: "wheat",
    name: ls("গম", "Wheat"),
    varieties: [
      ls("ব্রি গম-২৬", "BARI Gom-26"),
      ls("ব্রি গম-২৮", "BARI Gom-28")
    ],
    isActive: true,
    stages: [
      {
        key: "seedling",
        order: 1,
        logicalPhase: "growing",
        minDayFromPlanting: 0,
        maxDayFromPlanting: 20,
        name: ls("চারা গম", "Seedling"),
        generalAdvice: ls(
          "বীজ সমানভাবে উঠছে কি না দেখে নিন, ফাঁকা জায়গায় প্রয়োজনে পুনরায় বপন করুন।",
          "Check if seedlings are uniform; re-sow patches if needed."
        )
      },
      {
        key: "tillering",
        order: 2,
        logicalPhase: "growing",
        minDayFromPlanting: 21,
        maxDayFromPlanting: 50,
        name: ls("গাছ বেড়া", "Tillering"),
        fertilizerAdvice: ls(
          "এই সময়ে ইউরিয়া টপ ড্রেস করলে শীষ বেশি হয়, তবে সুপারিশমতো দিন।",
          "Top-dress urea now for better heads, but follow recommended dose."
        )
      },
      {
        key: "flower_grain",
        order: 3,
        logicalPhase: "pre_harvest",
        minDayFromPlanting: 51,
        maxDayFromPlanting: 90,
        name: ls("ফুল ও শিষ", "Flower & grain"),
        generalAdvice: ls(
          "গমের শীষে কোনো দাগ বা রোগের লক্ষণ দেখলে দ্রুত পরামর্শ নিন।",
          "If you see spots or disease on wheat heads, get advice quickly."
        )
      },
      {
        key: "harvest_window",
        order: 4,
        logicalPhase: "harvest_window",
        minDayFromPlanting: 91,
        maxDayFromPlanting: 120,
        name: ls("গম কাটা", "Harvest"),
        generalAdvice: ls(
          "গমের শীষ ও দানা বেশ শক্ত হলে রোদ উঠেই কেটে নিন, বেশি ভিজা থাকলে রাতে মাঠে রাখবেন না।",
          "When heads and grains are firm, harvest in sun and avoid leaving wet crop in the field overnight."
        )
      }
    ],
    storageProfile: {
      idealHumidity: 12,
      badHumidity: 14,
      idealTemperature: 24,
      badTemperature: 30,
      sensitiveToRain: true,
      recommendedStorageTypes: ["JUTE_BAG_STACK", "METAL_BIN"],
      storageHints: [
        ls(
          "গম পরিষ্কার ও শুকনো বস্তায় ভরে মেঝে থেকে কিছুটা উঁচুতে রাখুন।",
          "Store wheat in clean, dry bags on raised platforms."
        )
      ],
      highHumidityMessageTemplate: ls(
        "{cropName} দানার আর্দ্রতা এখন {currentMoisture}% এর মতো। ফাংগাস এড়াতে আর্দ্রতা {idealMoisture}% এর কাছাকাছি নামিয়ে রাখুন।",
        "Current {cropName} moisture is about {currentMoisture}%. Keep it near {idealMoisture}% to avoid fungus."
      ),
      highTemperatureMessageTemplate: ls(
        "গুদামে তাপমাত্রা {currentTemp}°C থাকলে গম দ্রুত মান হারাতে পারে, চেষ্টা করুন {idealTemp}°C এর কাছাকাছি রাখতে।",
        "At {currentTemp}°C wheat loses quality faster; try to maintain around {idealTemp}°C."
      )
    }
  },

  //
  // 4. Potato (আলু)
  //
  {
    code: "potato",
    name: ls("আলু", "Potato"),
    varieties: [
      ls("ডায়মন্ড", "Diamond"),
      ls("লেডি রোসেটা", "Lady Rosetta")
    ],
    isActive: true,
    stages: [
      {
        key: "sprout",
        order: 1,
        logicalPhase: "growing",
        minDayFromPlanting: 0,
        maxDayFromPlanting: 20,
        name: ls("অঙ্কুর", "Sprout")
      },
      {
        key: "leaf_growth",
        order: 2,
        logicalPhase: "growing",
        minDayFromPlanting: 21,
        maxDayFromPlanting: 45,
        name: ls("পাতা বেড়া", "Leaf growth")
      },
      {
        key: "tuber_start",
        order: 3,
        logicalPhase: "growing",
        minDayFromPlanting: 46,
        maxDayFromPlanting: 65,
        name: ls("কন্দ ধরা", "Tuber start")
      },
      {
        key: "bulking",
        order: 4,
        logicalPhase: "pre_harvest",
        minDayFromPlanting: 66,
        maxDayFromPlanting: 90,
        name: ls("কন্দ ভরা", "Bulking"),
        generalAdvice: ls(
          "গাছের পাতা ধীরে ধীরে হলুদ আর শুকনো হলে বুঝবেন আলু তোলার সময় আসছে।",
          "When leaves slowly turn yellow and dry, harvest time is near."
        )
      },
      {
        key: "harvest_window",
        order: 5,
        logicalPhase: "harvest_window",
        minDayFromPlanting: 90,
        maxDayFromPlanting: 110,
        name: ls("আলু তোলা", "Harvest"),
        generalAdvice: ls(
          "শুকনা আবহাওয়ায় আলু তুলুন, কাদায় তুললে পরে পচে যাওয়ার ঝুঁকি বেশি।",
          "Harvest potatoes in dry weather; mud on tubers increases rotting risk."
        )
      }
    ],
    storageProfile: {
      idealHumidity: 90,
      badHumidity: 70,
      idealTemperature: 4,
      badTemperature: 15,
      sensitiveToRain: true,
      recommendedStorageTypes: ["COLD_STORAGE", "DARK_VENTILATED_ROOM"],
      storageHints: [
        ls(
          "আলু সরাসরি আলো থেকে দূরে রাখুন, আলো পেলে কন্দ সবুজ হয়ে বিষাক্ত হতে পারে।",
          "Keep potatoes away from direct light; exposure makes them green and toxic."
        )
      ],
      highHumidityMessageTemplate: ls(
        "গুদামে আর্দ্রতা কম হলে {cropName} শুকিয়ে যেতে পারে। হালকা আর্দ্র কিন্তু ঠান্ডা পরিবেশ রাখার চেষ্টা করুন।",
        "If air is too dry, {cropName} may shrivel; aim for slightly humid but cool storage."
      ),
      highTemperatureMessageTemplate: ls(
        "তাপমাত্রা {currentTemp}°C থাকলে আলু দ্রুত অঙ্কুরিত ও নষ্ট হয়, সম্ভব হলে {idealTemp}°C এর কাছাকাছি ঠান্ডা জায়গায় রাখুন।",
        "At {currentTemp}°C potatoes sprout and spoil faster; if possible, store near {idealTemp}°C."
      )
    }
  },

  //
  // 5. Tomato (টমেটো)
  //
  {
    code: "tomato",
    name: ls("টমেটো", "Tomato"),
    varieties: [
      ls("দেশি টমেটো", "Local tomato"),
      ls("হাইব্রিড টমেটো", "Hybrid tomato")
    ],
    isActive: true,
    stages: [
      {
        key: "seedling",
        order: 1,
        logicalPhase: "growing",
        minDayFromPlanting: 0,
        maxDayFromPlanting: 25,
        name: ls("চারা", "Seedling")
      },
      {
        key: "vegetative",
        order: 2,
        logicalPhase: "growing",
        minDayFromPlanting: 26,
        maxDayFromPlanting: 45,
        name: ls("গাছ বেড়া", "Vegetative")
      },
      {
        key: "flower_fruit",
        order: 3,
        logicalPhase: "pre_harvest",
        minDayFromPlanting: 46,
        maxDayFromPlanting: 75,
        name: ls("ফুল-ফল", "Flower & fruit")
      },
      {
        key: "harvest_window",
        order: 4,
        logicalPhase: "harvest_window",
        minDayFromPlanting: 76,
        maxDayFromPlanting: 110,
        name: ls("টমেটো তোলা", "Harvest"),
        generalAdvice: ls(
          "ফল পুরো লাল হওয়ার আগেই তুলুন, না হলে পরিবহনে সহজে চটে যেতে পারে।",
          "Harvest just before fully red to avoid damage during transport."
        )
      }
    ],
    storageProfile: {
      idealHumidity: 85,
      badHumidity: 60,
      idealTemperature: 12,
      badTemperature: 30,
      sensitiveToRain: true,
      recommendedStorageTypes: ["PLASTIC_CRATE_STACK", "VENTILATED_ROOM"],
      storageHints: [
        ls(
          "টমেটো একটির ওপর আরেকটি বেশি চাপ দিয়ে রাখবেন না, পাতলা স্তরে সাজিয়ে রাখুন।",
          "Don’t stack tomatoes too high; keep them in thin layers."
        )
      ],
      highHumidityMessageTemplate: ls(
        "গুদামে ভেজাভাব বেশি থাকলে {cropName} তাড়াতাড়ি পচে যায়। বাতাস চলাচল বাড়ান যাতে আর্দ্রতা কমে।",
        "High humidity makes {cropName} rot faster. Improve ventilation to reduce moisture."
      ),
      highTemperatureMessageTemplate: ls(
        "তাপমাত্রা {currentTemp}°C এর বেশি হলে টমেটো দ্রুত নরম হয়ে যায়, চেষ্টা করুন {idealTemp}°C এর কাছাকাছি ঠান্ডা জায়গায় রাখতে।",
        "Above {currentTemp}°C tomatoes soften quickly; aim for cooler storage near {idealTemp}°C."
      )
    }
  },

  //
  // 6. Onion (পেঁয়াজ)
  //
  {
    code: "onion",
    name: ls("পেঁয়াজ", "Onion"),
    varieties: [
      ls("দেশি পেঁয়াজ", "Local onion"),
      ls("হাইব্রিড পেঁয়াজ", "Hybrid onion")
    ],
    isActive: true,
    stages: [
      {
        key: "leaf_growth",
        order: 1,
        logicalPhase: "growing",
        minDayFromPlanting: 0,
        maxDayFromPlanting: 45,
        name: ls("পাতা বেড়া", "Leaf growth")
      },
      {
        key: "bulb_form",
        order: 2,
        logicalPhase: "pre_harvest",
        minDayFromPlanting: 46,
        maxDayFromPlanting: 90,
        name: ls("কন্দ ধরা", "Bulb forming"),
        generalAdvice: ls(
          "পাতার গোড়া মোটা আর কন্দ গোল হতে শুরু করলে বুঝবেন কন্দ ধরা শুরু হয়েছে।",
          "Thickening necks and round bulbs show bulb formation has started."
        )
      },
      {
        key: "harvest_window",
        order: 3,
        logicalPhase: "harvest_window",
        minDayFromPlanting: 90,
        maxDayFromPlanting: 120,
        name: ls("পেঁয়াজ তোলা", "Harvest"),
        generalAdvice: ls(
          "প্রায় ৫০–৭০% পাতা শুয়ে পড়লে পেঁয়াজ তুলুন, পরে শুকানোর জন্য রোদে বিছিয়ে দিন।",
          "Harvest when about 50–70% tops fall over, then sun-cure for drying."
        )
      }
    ],
    storageProfile: {
      idealHumidity: 65,
      badHumidity: 85,
      idealTemperature: 25,
      badTemperature: 35,
      sensitiveToRain: true,
      recommendedStorageTypes: ["NET_BAG_HANG", "BAMBOO_RACK"],
      storageHints: [
        ls(
          "পেঁয়াজ জাল ব্যাগে বা ঝুড়িতে ঝুলিয়ে রাখুন, যাতে চারদিকে বাতাস চলাচল করতে পারে।",
          "Hang onions in net bags or baskets so air can move around."
        )
      ],
      highHumidityMessageTemplate: ls(
        "গুদামে ভেজাভাব বেশি থাকলে {cropName} দ্রুত পচে যায়। যতটা সম্ভব শুকনা ও বাতাস চলাচলযুক্ত জায়গায় রাখুন।",
        "High humidity in storage makes {cropName} rot quickly. Keep them in a drier, airy place."
      ),
      highTemperatureMessageTemplate: ls(
        "{cropName} গরম জায়গায় বেশি দিন থাকলে কন্দ নরম হয়ে যায় ও অঙ্কুর গজায়, চেষ্টা করুন {idealTemp}°C এর আশপাশে রাখতে।",
        "If {cropName} stay in high heat, bulbs soften and sprout; aim for around {idealTemp}°C."
      )
    }
  },

  //
  // 7. Chili (মরিচ)
  //
  {
    code: "chili",
    name: ls("মরিচ", "Chili"),
    varieties: [
      ls("দেশি মরিচ", "Local chili"),
      ls("হাইব্রিড মরিচ", "Hybrid chili")
    ],
    isActive: true,
    stages: [
      {
        key: "seedling",
        order: 1,
        logicalPhase: "growing",
        minDayFromPlanting: 0,
        maxDayFromPlanting: 25,
        name: ls("চারা", "Seedling")
      },
      {
        key: "vegetative",
        order: 2,
        logicalPhase: "growing",
        minDayFromPlanting: 26,
        maxDayFromPlanting: 45,
        name: ls("গাছ বেড়া", "Vegetative")
      },
      {
        key: "flower_fruit",
        order: 3,
        logicalPhase: "pre_harvest",
        minDayFromPlanting: 46,
        maxDayFromPlanting: 90,
        name: ls("ফুল-ফল", "Flower & fruit"),
        generalAdvice: ls(
          "গাছের নিচের পাতা বেশি ঘন হলে হালকা ছাঁটাই করতে পারেন, এতে বাতাস চলাচল বাড়ে।",
          "If lower canopy is too dense, light pruning improves airflow."
        )
      },
      {
        key: "harvest_window",
        order: 4,
        logicalPhase: "harvest_window",
        minDayFromPlanting: 60,
        maxDayFromPlanting: 120,
        name: ls("মরিচ তোলা", "Harvest"),
        generalAdvice: ls(
          "সব সময় শুকনা আবহাওয়ায় মরিচ তুলুন, ভেজা অবস্থায় তুললে দ্রুত পচে যায়।",
          "Harvest chilies in dry weather; wet fruit rots quickly."
        )
      }
    ],
    storageProfile: {
      idealHumidity: 60,
      badHumidity: 80,
      idealTemperature: 20,
      badTemperature: 32,
      sensitiveToRain: true,
      recommendedStorageTypes: ["DRY_HANG", "JUTE_BAG_STACK"],
      storageHints: [
        ls(
          "শুকনা মরিচ কাপড়ের বস্তা বা কাগজের প্যাকেটে রেখে ঝুলিয়ে রাখুন, প্লাস্টিক ব্যাগে রাখা ভালো না।",
          "Store dried chili in cloth bags or paper packs and hang them; avoid plastic bags."
        )
      ],
      highHumidityMessageTemplate: ls(
        "আর্দ্রতা বেশি থাকলে শুকনা {cropName} ফাংগাস ধরে কালচে হয়ে যায়, যত দ্রুত সম্ভব শুকনা জায়গায় সরিয়ে নিন।",
        "High humidity causes dried {cropName} to mold and darken; move them to a drier place quickly."
      ),
      highTemperatureMessageTemplate: ls(
        "অতিরিক্ত গরমে শুকনা {cropName} এর রং ও ঝাঁজ কমে যায়, চেষ্টা করুন {idealTemp}°C এর মতো ঠান্ডা ও শুকনা ঘরে রাখতে।",
        "Excess heat fades color and pungency of dried {cropName}; aim for a cool, dry room around {idealTemp}°C."
      )
    }
  }
];
