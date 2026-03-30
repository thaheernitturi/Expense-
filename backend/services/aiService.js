const axios = require("axios");

exports.getCategory = async (description) => {
  try {
    // 🔥 REAL AI (if API key exists)
    if (process.env.OPENAI_API_KEY) {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `Categorize this expense into ONE word (Food, Travel, Shopping, Bills, Entertainment, Other): ${description}`,
            },
          ],
          max_tokens: 5,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      return format(res.data.choices[0].message.content);
    }

    // 🔥 FALLBACK (NO API KEY)
    return smartCategory(description);

  } catch (err) {
    console.log("AI ERROR:", err.message);
    return smartCategory(description);
  }
};

// 🎯 FORMAT OUTPUT
function format(cat) {
  cat = cat.toLowerCase();

  if (cat.includes("food")) return "Food 🍗";
  if (cat.includes("travel")) return "Travel ⛽";
  if (cat.includes("shop")) return "Shopping 🛍️";
  if (cat.includes("bill")) return "Bills 🏠";
  if (cat.includes("entertain")) return "Entertainment 🎬";

  return "Other 💸";
}

// 🔁 FALLBACK
function smartCategory(desc) {
  desc = desc.toLowerCase();

  // 🍔 FOOD
  if (
    desc.includes("food") ||
    desc.includes("biryani") ||
    desc.includes("pizza") ||
    desc.includes("burger") ||
    desc.includes("lunch") ||
    desc.includes("dinner") ||
    desc.includes("restaurant") ||
    desc.includes("hotel")
  )
    return "Food 🍗";

  // ⛽ TRAVEL
  if (
    desc.includes("petrol") ||
    desc.includes("fuel") ||
    desc.includes("uber") ||
    desc.includes("ola") ||
    desc.includes("bus") ||
    desc.includes("train") ||
    desc.includes("travel")
  )
    return "Travel ⛽";

  // 🎬 ENTERTAINMENT (🔥 FIX HERE)
  if (
    desc.includes("movie") ||
    desc.includes("cinema") ||
    desc.includes("netflix") ||
    desc.includes("amazon prime") ||
    desc.includes("youtube") ||
    desc.includes("game") ||
    desc.includes("spotify")
  )
    return "Entertainment 🎬";

  // 🛍️ SHOPPING
  if (
    desc.includes("amazon") ||
    desc.includes("flipkart") ||
    desc.includes("shopping") ||
    desc.includes("clothes")
  )
    return "Shopping 🛍️";

  // 🏠 BILLS
  if (
    desc.includes("rent") ||
    desc.includes("electricity") ||
    desc.includes("bill") ||
    desc.includes("recharge")
  )
    return "Bills 🏠";

  return "Other 💸";
}