export const getTrimesterData = (id: number) => {
  const data: Record<number, any> = {
    1: {
      title: "First Trimester",
      description: "Weeks 1-12. A critical time of development.",
      babyDevelopment: "Your baby is growing rapidly. The brain, spinal cord, and other organs are forming. By week 12, the baby's heartbeat might be heard.",
      bodyChanges: "You may experience morning sickness, severe fatigue, swollen and tender breasts, and frequent urination as your body adjusts.",
      dosAndDonts: [
        "Do take your daily prenatal vitamins containing folic acid.",
        "Do drink plenty of water and eat small, frequent meals.",
        "Don't smoke or consume alcohol.",
        "Don't consume unpasteurized dairy or raw meats.",
        "Do book your first antenatal visit early."
      ]
    },
    2: {
      title: "Second Trimester",
      description: "Weeks 13-26. Often called the 'golden period' of pregnancy.",
      babyDevelopment: "Your baby is growing larger and stronger. You will likely start feeling their first movements (quickening) between weeks 16-20. Hair and fingerprints are forming.",
      bodyChanges: "Nausea usually subsides. You might experience backaches, stretch marks, and a noticeable 'bump'. Your energy levels should improve.",
      dosAndDonts: [
        "Do continue taking your prenatal vitamins.",
        "Do start doing pelvic floor exercises (Kegels).",
        "Do sleep on your side, preferably your left side.",
        "Don't lie flat on your back for extended periods.",
        "Do attend your anomaly scan (around week 20)."
      ]
    },
    3: {
      title: "Third Trimester",
      description: "Weeks 27-end. Preparing for childbirth and meeting your baby.",
      babyDevelopment: "Your baby is gaining weight rapidly and their lungs are maturing. They will move into a head-down position in preparation for birth.",
      bodyChanges: "You may experience shortness of breath, heartburn, Braxton Hicks contractions, and difficulty sleeping as your bump grows very large.",
      dosAndDonts: [
        "Do monitor your baby's movements daily.",
        "Do pack your hospital bag and finalize your birth plan.",
        "Do rest as much as possible.",
        "Don't ignore any signs of reduced baby movement or heavy bleeding.",
        "Do attend antenatal classes and frequent clinic visits."
      ]
    }
  };

  return data[id] || null;
};
