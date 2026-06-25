/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Thin
        "poppins-thin": ["Poppins_100Thin"],
        "poppins-thin-italic": ["Poppins_100Thin_Italic"],

        // Extra Light
        "poppins-extralight": ["Poppins_200ExtraLight"],
        "poppins-extralight-italic": ["Poppins_200ExtraLight_Italic"],

        // Light
        "poppins-light": ["Poppins_300Light"],
        "poppins-light-italic": ["Poppins_300Light_Italic"],

        // Regular
        poppins: ["Poppins_400Regular"],
        "poppins-italic": ["Poppins_400Regular_Italic"],

        // Medium
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-medium-italic": ["Poppins_500Medium_Italic"],

        // Semi Bold
        "poppins-semibold": ["Poppins_600SemiBold"],
        "poppins-semibold-italic": ["Poppins_600SemiBold_Italic"],

        // Bold
        "poppins-bold": ["Poppins_700Bold"],
        "poppins-bold-italic": ["Poppins_700Bold_Italic"],

        // Extra Bold
        "poppins-extrabold": ["Poppins_800ExtraBold"],
        "poppins-extrabold-italic": ["Poppins_800ExtraBold_Italic"],

        // Black
        "poppins-black": ["Poppins_900Black"],
        "poppins-black-italic": ["Poppins_900Black_Italic"],
      },
    },
  },
  plugins: [],
};
