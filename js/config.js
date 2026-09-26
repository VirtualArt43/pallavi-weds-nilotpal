/* ==========================================================================
   WEDDING DETAILS — the only file you need to edit.
   Every name, date, venue and number on the website is generated from here.
   Anything marked PLACEHOLDER is still waiting for the real value.
   ========================================================================== */

window.WEDDING = {

  /* ---------- The couple ---------- */
  bride: {
    name: "Pallavi",
    fullName: "Pallavi Sinha",
    parents: "Mr. Vinod Sinha & Mrs. Sangeeta Sinha",
    about: "Warm, witty and forever the first one on the dance floor. Loves chai at sunset, old Kishore Kumar songs and planning trips she will absolutely take one day.", // PLACEHOLDER
  },
  groom: {
    name: "Nilotpal",
    fullName: "Nilotpal Kumar",
    parents: "Mr. Narendra Kumar & Mrs. Renuka Kumari",
    about: "Calm, kind and quietly hilarious. Believes every problem can be solved with a long drive, a good playlist and a plate of hot jalebis.", // PLACEHOLDER
  },

  hashtag: "#PallaviWedsNilotpal",                    // or "" to hide
  tagline: "दो दिलों का मिलन",                          // "the union of two hearts"

  /* ---------- The portrait ----------
     portrait: the paper-cut portrait of the two of them (made with Codex from their photo, transparent
               background). .webp is tried first, then .png / .jpg.
     Preview a numbered option in place with  …/v2/?portrait=3  (loads assets/photos/portrait-3.*) */
  portrait: "assets/photos/portrait",
  photo: "assets/photos/portrait.png",               // fallback if the portrait above can't load
  photoIsPlaceholder: false,
  backdrop: {                                         // the paper-cut scene behind the couple (made with Codex)
    wide: "assets/photos/background-landscape.webp",  // computers
    tall: "assets/photos/background-portrait.webp",   // phones
    frontWide: "assets/photos/foreground-landscape.webp", // paper flowers in front of the couple (computers)
    frontTall: "assets/photos/foreground-portrait.webp",  // … and on phones
  },

  /* ---------- The big day ---------- */
  wedding: {
    date: "2026-11-26",
    time: "18:00",                                    // PLACEHOLDER — when guests should arrive
    city: "Patna, Bihar",
  },

  /* ---------- Venue (all celebrations are here) ---------- */
  venue: {
    name: "The Red Velvet Hotel Samarpan",
    address: "Income Tax Chauraha, near Round About, Kidwaipuri, Patna, Bihar 800001",
    mapQuery: "The Red Velvet Hotel Samarpan, Kidwaipuri, Patna, Bihar",   // what the embedded map searches for
    mapLink: "https://maps.app.goo.gl/72uXSQ9RzUtwkaZM9",                  // where "Get Directions" goes
    note: "",                                         // optional line for guests (parking etc.) — "" hides it
  },

  travel: [                                           // PLACEHOLDER — general Patna info, please verify
    { icon: "plane", title: "By Air",   text: "Jay Prakash Narayan International Airport (PAT), Patna, is about 20 minutes from the venue by cab." },
    { icon: "train", title: "By Train", text: "Patna Junction is about 15 minutes away. Autos and cabs are easy to find outside the station." },
  ],

  /* ---------- Celebrations, in order ----------
     icon: shiv | satyanarayan | haldi | devpoojan | mehendi | wedding | sangeet | reception
           (anything else → a kalash scene)
     end:  leave out for "… onwards"
     Optional per event: schedule: [["6:00 PM", "Something"], …], dress: "…", dressColors: ["#hex", …] */
  events: [
    {
      icon: "mehendi", title: "Mehendi", hindi: "मेहंदी",
      date: "2026-11-25", start: "16:00",
      venue: "The Red Velvet Hotel Samarpan", address: "Kidwaipuri, Patna", mapLink: "https://maps.app.goo.gl/72uXSQ9RzUtwkaZM9",
      description: "An evening of henna, folk songs and laughter as intricate patterns bloom on the bride's hands — followed by dinner.",
    },
    {
      icon: "wedding", title: "Vivah", hindi: "विवाह", subtitle: "The Wedding Ceremony",
      date: "2026-11-26", start: "18:00",             // PLACEHOLDER time
      venue: "The Red Velvet Hotel Samarpan", address: "Kidwaipuri, Patna", mapLink: "https://maps.app.goo.gl/72uXSQ9RzUtwkaZM9",
      description: "Two families become one as Pallavi and Nilotpal take the seven sacred vows around the holy fire.",
      schedule: [                                     // PLACEHOLDER timings
        ["6:00 PM", "Baraat & Swagat"],
        ["8:00 PM", "Jaimala"],
        ["9:00 PM", "Dinner"],
        ["10:30 PM", "Pheras"],
      ],
    },
  ],

  /* ---------- Families ---------- */
  families: {
    blessings: [],                                    // e.g. ["Late Shri … & Late Smt. …"] — empty hides the line
    bride: { title: "Pallavi's Family", members: ["Mr. Vinod Sinha", "Mrs. Sangeeta Sinha"] },
    groom: { title: "Nilotpal's Family", members: ["Mr. Narendra Kumar", "Mrs. Renuka Kumari"] },
    manuhar: "दीदी की शादी में ज़रूर-ज़रूर आना!",        // the little ones' request ("do come to didi's wedding!") — or "" to hide
    manuharFrom: "The little ones of the family",
  },

  /* ---------- For any details ---------- */
  contacts: [
    { name: "Piyush Sinha", relation: "Brother of the bride", phone: "+91 83938 20860" },
  ],

  /* ---------- Blessing verse on the invitation scroll ---------- */
  shloka: {
    lines: ["मंगलम् भगवान विष्णुः, मंगलम् गरुड़ध्वजः ।", "मंगलम् पुण्डरीकाक्षः, मंगलाय तनो हरिः ॥"],
    meaning: "May Lord Vishnu bless this union with auspiciousness and joy.",
  },

  /* ---------- Sound ---------- */
  bell: true,                                         // a soft temple bell as the doors open
  music: "assets/music/shehnai.mp3",                  // optional — the music button appears only if this file exists
};
