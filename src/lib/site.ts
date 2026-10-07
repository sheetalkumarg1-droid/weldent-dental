import { getSmilesTreated, getYearsOfExperience } from "@/lib/dynamicStats";
export { clinic, nav } from "@/lib/site-core";
import { responsiveImageSet } from "@/lib/site-core";

export const photos = {
  front: "/images/clinic-front-480.webp",
  operatory: "/images/clinic-operatory.webp",
};

export const heroImages = [
  {
    src: "/images/clinic-front-480.webp",
    srcSet:
      "/images/clinic-front-480.webp 480w",
    alt: "Entrance of Weldent Multispeciality Dental Clinic in Kalena Agrahara, Bengaluru",
  },
  {
    src: "/images/hero/clinic-2.webp",
    srcSet:
      "/images/hero/clinic-2-480.webp 480w, /images/hero/clinic-2-768.webp 768w, /images/hero/clinic-2.webp 1200w",
    alt: "Reception and waiting area at Weldent Dental Clinic",
  },
  {
    src: "/images/hero/clinic-3.webp",
    srcSet:
      "/images/hero/clinic-3-480.webp 480w, /images/hero/clinic-3-768.webp 768w, /images/hero/clinic-3.webp 1200w",
    alt: "Modern dental treatment chair and equipment at Weldent Dental Clinic",
  },
  {
    src: "/images/hero/clinic-4.webp",
    srcSet:
      "/images/hero/clinic-4-480.webp 480w, /images/hero/clinic-4-768.webp 768w, /images/hero/clinic-4.webp 1200w",
    alt: "Consultation room and professional certificates at Weldent Dental Clinic",
  },
  {
    src: "/images/hero/clinic-5.webp",
    srcSet:
      "/images/hero/clinic-5-480.webp 480w, /images/hero/clinic-5-768.webp 768w, /images/hero/clinic-5.webp 1200w",
    alt: "Bright dental operatory at Weldent Dental Clinic in Bengaluru",
  },
] as const;

export const stats: Array<{
  value: number;
  suffix: string;
  label: string;
  detail?: string;
}> = [
  { value: getYearsOfExperience(), suffix: "+", label: "Years of clinical experience" },
  { value: getSmilesTreated(), suffix: "+", label: "Smiles treated" },
  { value: 20, suffix: "+", label: "Clinical cases shown" },
  {
    value: 7,
    suffix: "",
    label: "Days open each week",
    detail: "Mon–Sat 10:30 AM–9 PM · Sun 10:30 AM–3:30 PM",
  },
];

export type Service = {
  slug: string;
  dateModified: string;
  title: string;
  category: string;
  short: string;
  who: string;
  duration: string;
  steps: string[];
  aftercare: string[];
  faqs: { q: string; a: string }[];
  guidance?: { title: string; body: string }[];
  sources?: { label: string; url: string }[];
  doctors: string[];
};

export { services } from "@/lib/services";

export type Doctor = {
  slug: string;
  name: string;
  role: string;
  qualifications: string;
  specialties: string[];
  photo: string;
  bio: string[];
  memberships: string[];
  philosophy: string;
  registration?: string;
};

export const doctors: Doctor[] = [
  {
    slug: "dr-sheetal-kumar-g",
    name: "Dr. Sheetal Kumar G",
    role: "Principal Dental Surgeon",
    qualifications:
      "BDS (Bangalore Institute of Dental Sciences, RGUHS) · Certified Laser Practitioner · Conscious Sedation trained",
    specialties: [
      "General dentistry",
      "Root canal and restorative care",
      "Laser-assisted dental procedures",
    ],
    photo: "/images/doctors/dr-sheetal-kumar-g.webp",
    bio: [
      "Dr. Sheetal Kumar G earned his Bachelor of Dental Surgery (BDS) from Bangalore Institute of Dental Sciences & Hospital under RGUHS, Karnataka in August 2023. He is registered with the Karnataka State Dental Council (KSDC Reg No: 59793 A, issued 19 November 2024).",
      "He served as Junior Resident Dental Surgeon at Sri Shirdi Sai Baba Anand Ashram Charitable Dental Clinic, Bengaluru from November 2023 to January 2025, gaining hands-on experience in diagnosis, extractions, fillings, dental X-rays, periodontal treatment, root canals, impactions and laser-assisted surgical procedures.",
      "His additional certifications include a Laser Dentistry Course as a Certified Laser Practitioner and a Conscious Sedation Workshop. He speaks English and believes in clear explanations, gentle treatment and doing only what each patient truly needs.",
    ],
    memberships: ["Karnataka State Dental Council (KSDC) — Reg No: 59793 A"],
    registration: "KSDC Reg No. 59793 A",
    philosophy:
      "Explain everything clearly, treat gently, and never recommend what a patient doesn't genuinely need.",
  },
  {
    slug: "dr-lakshmi-bhardawaj",
    name: "Dr. Lakshmi Bhardawaj",
    role: "Consultant Oral & Maxillofacial Surgeon",
    qualifications: "BDS · MDS in Oral and Maxillofacial Surgery",
    specialties: ["Oral and Maxillofacial Surgery"],
    photo: "/images/doctors/dr-lakshmi-bhardawaj.webp",
    bio: [
      "Dr. Lakshmi Bhardawaj is a consultant dental surgeon at Weldent Multispeciality Dental Clinic. Please contact the clinic to confirm consultation availability and treatment assignment.",
    ],
    memberships: [],
    philosophy:
      "Patient-centred consultation with clear explanations and an individual treatment plan.",
  },
  {
    slug: "dr-karthik-p",
    name: "Dr. Karthik P",
    role: "Consultant Orthodontist",
    qualifications: "BDS · MDS in Orthodontics and Dentofacial Orthopedics",
    specialties: ["Orthodontic braces and aligners"],
    photo: "/images/doctors/dr-karthik-p.webp",
    bio: [
      "Dr. Karthik P consults at Weldent Multispeciality Dental Clinic. Please contact the clinic to confirm consultation availability and treatment assignment.",
    ],
    memberships: [],
    philosophy:
      "Thoughtful assessment, clear communication and care planned around the individual patient.",
  },
  {
    slug: "dr-niharika-k-g",
    name: "Dr. Niharika K G",
    role: "Consultant Periodontist & Implantologist",
    qualifications: "BDS · MDS in Periodontology and Oral Implantology",
    specialties: ["Periodontal gum care", "Dental implants"],
    photo: "/images/doctors/dr-niharika-k-g.webp",
    bio: [
      "Dr. Niharika K G consults at Weldent Multispeciality Dental Clinic. Please contact the clinic to confirm consultation availability and treatment assignment.",
    ],
    memberships: [],
    philosophy: "Calm, attentive consultation with treatment options explained before care begins.",
  },
];

const galleryCases = [
  {
    id: "add-5",
    title: "Orthodontic Braces Treatment",
    category: "Orthodontics",
    note: "Alignment of crowded front teeth through a planned orthodontic braces treatment. Individual treatment plans and outcomes vary.",
  },
  {
    id: "14p",
    title: "Upper Anterior Dental Bridge",
    category: "Restorative",
    note: "Complex rehabilitation of severely compromised and missing upper front teeth using a custom fixed ceramic bridge.",
  },
  {
    id: "add-2",
    title: "Deep Scaling and Gum Care",
    category: "Gum Care",
    note: "Deep professional cleaning and gum-care treatment planned to remove deposits and support healthier gums.",
    beforeImageClassName: "origin-center rotate-90 scale-[1.35]",
    afterImageClassName: "origin-center rotate-90 scale-[1.35]",
  },
  {
    id: "add-3",
    title: "Wisdom Tooth Extraction",
    category: "Surgical",
    note: "Clinical removal of a wisdom tooth, followed by post-operative care instructions and review as required.",
  },
  {
    id: "add-1",
    title: "Anterior Dental Restoration",
    category: "Restorative",
    note: "Restorative treatment focused on the appearance and function of the front teeth after clinical assessment.",
  },
  {
    id: "add-4",
    title: "Laser Crown Exposure",
    category: "Restorative",
    note: "A minimally invasive laser procedure performed to safely expose a submerged front tooth, facilitating proper eruption and clinical function.",
    swapImages: true,
  },
  {
    id: "1p",
    title: "Removable Partial Denture",
    category: "Restorative",
    note: "Replacement of missing lower teeth with a custom removable appliance featuring metal clasps.",
  },
  {
    id: "2p",
    title: "Tooth Extraction",
    category: "Surgical",
    note: "Surgical removal of a severely decayed and structurally compromised lower molar.",
    beforeImageClassName: "origin-[72%_55%] scale-[1.85]",
    afterImageClassName: "origin-[68%_55%] scale-[1.85]",
  },
  {
    id: "3p",
    title: "Teeth Scaling and Polishing",
    category: "Gum Care",
    note: "Professional cleaning to remove heavy tartar buildup and treat inflamed, bleeding gums.",
  },
  {
    id: "4p",
    title: "Lower Dental Bridge",
    category: "Restorative",
    note: "Placement of a fixed ceramic bridge to replace missing lower posterior teeth.",
  },
  {
    id: "5p",
    title: "Cosmetic Dental Bonding",
    category: "Cosmetic",
    note: "Aesthetic repair of chipped and worn upper front teeth using tooth-coloured composite resin.",
  },
  {
    id: "6p",
    title: "Upper Dental Bridge",
    category: "Restorative",
    note: "Restoration of missing upper side teeth with a custom-fitted fixed ceramic bridge.",
  },
  {
    id: "7p",
    title: "Posterior Ceramic Bridge",
    category: "Restorative",
    note: "Replacement of missing lower back teeth utilising a multi-unit fixed dental bridge.",
  },
  {
    id: "8p",
    title: "Anterior Tooth Restoration",
    category: "Cosmetic",
    note: "Cosmetic reshaping and repair of a chipped upper central incisor to restore natural contours.",
  },
  {
    id: "9p",
    title: "Deep Dental Cleaning",
    category: "Gum Care",
    note: "Periodontal treatment to remove plaque and tartar, significantly reducing gum inflammation.",
  },
  {
    id: "10p",
    title: "Composite Cavity Filling",
    category: "Restorative",
    note: "Application of a tooth-coloured resin restoration to treat localised decay on an upper front tooth.",
  },
  {
    id: "11p",
    title: "Cosmetic Anterior Crowns",
    category: "Cosmetic",
    note: "Restoration of broken upper front teeth using custom-matched ceramic crowns to improve smile aesthetics.",
    swapImages: true,
  },
  {
    id: "12p",
    title: "Lower Anterior Ceramic Bridge",
    category: "Restorative",
    note: "Extensive replacement of missing and damaged lower front teeth with a multi-unit fixed dental bridge.",
  },
  {
    id: "13p",
    title: "Cosmetic Dental Bonding",
    category: "Cosmetic",
    note: "Direct composite resin application to repair a chipped upper central incisor and restore its natural shape.",
  },
  {
    id: "15p",
    title: "Professional Teeth Scaling",
    category: "Gum Care",
    note: "Thorough removal of heavy calculus and plaque buildup from the lower teeth to treat inflammation and restore gum health.",
  },
];

export const cases = galleryCases.map((c) => {
  const before = `/images/gallery/${c.id}-before-768.webp`;
  const after = `/images/gallery/${c.id}-after-768.webp`;
  const beforeSrcSet = responsiveImageSet(`gallery/${c.id}-before`);
  const afterSrcSet = responsiveImageSet(`gallery/${c.id}-after`);

  return {
    ...c,
    doctor: "Dr. Sheetal Kumar G",
    before: c.swapImages ? after : before,
    after: c.swapImages ? before : after,
    beforeSrcSet: c.swapImages ? afterSrcSet : beforeSrcSet,
    afterSrcSet: c.swapImages ? beforeSrcSet : afterSrcSet,
  };
});

export const testimonials = [
  {
    name: "Puja Upadhyay",
    treatment: "General dental problems",
    rating: 5,
    quote:
      "One of best clinic I visited for dental problems I was having continuous problem for an year or 2 and the doctor advised solutions which felt right and effective. I recommend this clinic all nearby patient Thankyou doctor Sheetal",
  },
  {
    name: "Venkateswara Rao Kavala",
    treatment: "General treatment (adult & child)",
    rating: 5,
    quote:
      "Expert & Friendly Dentist...at reasonable level and I am very much satisfied with the treatment we recieved for my son and myself. Highly recommend this dentist",
  },
  {
    name: "Alisha Zakkir",
    treatment: "General procedure",
    rating: 5,
    quote:
      "This is my trusted dental clinic in Bangalore. Been visiting since last year and recent visit with Dr. Sheetal was very comfortable. He explained the procedure well and supported with doctor notes even after my visit.",
  },
  {
    name: "Dharshan G",
    treatment: "General procedure",
    rating: 5,
    quote:
      "I had a wonderful experience at this dental clinic. Dr. Sheetal is incredibly skilled, patient, and thorough. He took the time to explain the entire procedure and made sure I was completely comfortable throughout. The clinic is clean, hygienic, and well-maintained. Highly recommend Dr. Sheetal for anyone looking for gentle, top-tier dental care.",
  },
  {
    name: "Dhivyapriya KS",
    treatment: "Tooth filling",
    rating: 5,
    quote:
      "I randomly walked into Dr.Sheetal clinic today and explained about my tooth filling issue. He was kind in understanding, filled-in that exactly matches my tooth color. Best sevice by doctor and Clinic is very hygienic.",
  },
  {
    name: "Vani Saminathan",
    treatment: "Root canal treatment and dental caps",
    rating: 5,
    quote:
      "I had a very good experience with Dr. Sheetal Kumar. I visited him with pain in a molar and had a root canal treatment for the tooth. Dr. Sheetal was extremely patient, kind and thorough. He explained everything clearly and made sure I was comfortable during the treatment. He has also done an excellent job with the dental caps, - the fitting and finish are very good, and I am very happy with the result. The treatment was also quite affordable compared to the quality of care provided. The clinic is well maintained, clean and has a pleasant atmosphere. Overall, I am very satisfied with my experience and would definitely recommend Dr. Sheetal Kumar for his professionalism, attention to detail and caring approach.",
  },
];

export const posts = [
  {
    slug: "braces-treatment-guide",
    title: "Braces treatment: what to expect before you begin",
    category: "Orthodontics",
    date: "8 Sep 2026",
    datePublished: "2026-09-08",
    dateModified: "2026-09-08",
    serviceSlug: "braces-aligners",
    excerpt:
      "A practical guide to assessment, treatment planning, daily care and the questions to ask before starting braces.",
    sources: [
      {
        label: "American Association of Orthodontists: Braces",
        url: "https://aaoinfo.org/treatments/braces/",
      },
    ],
    body: [
      "Braces move teeth gradually and can be used to address crowding, spacing and some bite problems. The right plan depends on an examination and records such as photographs or X-rays when clinically indicated.",
      "Before treatment begins, ask who will provide the orthodontic care, what type of appliance is proposed, the expected treatment range and what is included in the quoted fee. A personalised assessment matters more than choosing an appliance from photographs alone.",
      "Appointments are required during treatment so progress can be reviewed and the appliance adjusted. The exact schedule and total duration vary with the complexity of the case and how the teeth respond.",
      "Cleaning around brackets takes extra care. Use fluoride toothpaste, clean around the gumline and brackets, and follow the treating clinician's advice about floss or interdental brushes.",
      "Hard or sticky foods can damage brackets and wires. If part of the appliance becomes loose or sharp, contact the treating clinic for advice rather than attempting a permanent repair at home.",
      "After active treatment, retainers are normally needed to help maintain the new tooth positions. The clinician will explain the appropriate retainer type and wear schedule for your case.",
    ],
  },
  {
    slug: "implant-aftercare",
    title: "Dental implant aftercare: the early healing period",
    category: "Implants",
    date: "28 May 2026",
    datePublished: "2026-05-28",
    dateModified: "2026-09-08",
    serviceSlug: "dental-implants",
    excerpt:
      "General guidance on early healing, oral hygiene and when to contact your treating dental team after implant treatment.",
    sources: [
      {
        label: "Guy's and St Thomas' NHS Foundation Trust: After having a dental implant",
        url: "https://www.guysandstthomas.nhs.uk/health-information/dental-implants/after-having-dental-implant",
      },
      {
        label: "Cambridge University Hospitals: Dental implants in restorative dentistry",
        url: "https://www.cuh.nhs.uk/patient-information/dental-implants-in-restorative-dentistry/",
      },
    ],
    body: [
      "Your treating clinician's written instructions take priority because implant procedures vary. Some swelling, bruising or discomfort can occur during early healing, but the pattern differs from person to person.",
      "Use any prescribed or recommended medicines only as directed by your treating clinician. Do not add or change medication based on general online advice.",
      "Keep the area clean using the method demonstrated by the clinic. Avoid disturbing the surgical site, and follow the specific guidance you receive about brushing, rinsing and food.",
      "Smoking can interfere with healing and is a recognised risk factor for implant complications. Tell your clinician about tobacco use so it can be considered in treatment planning and aftercare.",
      "Contact the treating clinic if bleeding does not settle, swelling or pain is worsening rather than improving, or you develop fever, an unpleasant discharge or another symptom that concerns you.",
      "Long-term implant care includes careful daily cleaning and regular professional review. An implant restoration can still develop problems in the surrounding gums and supporting tissues if plaque is not controlled.",
    ],
  },
  {
    slug: "bleeding-gums",
    title: "Bleeding gums: possible causes and when to see a dentist",
    category: "Gum Care",
    date: "9 May 2026",
    datePublished: "2026-05-09",
    dateModified: "2026-09-08",
    serviceSlug: "periodontal-gum-care",
    excerpt:
      "Bleeding while brushing can be a sign of gum inflammation and deserves attention when it persists or returns.",
    sources: [
      {
        label: "NHS: Gum disease",
        url: "https://www.nhs.uk/conditions/gum-disease/",
      },
    ],
    body: [
      "Gums that bleed during brushing are often inflamed, commonly because plaque has collected around the gumline. Redness, swelling, tenderness or persistent bad breath may occur at the same time.",
      "Bleeding can also have other causes, so a website cannot identify the reason in an individual case. Persistent, unexplained or heavy bleeding should be assessed rather than self-diagnosed.",
      "A dental visit may include an examination of the gums, measurement of gum pockets and X-rays when clinically needed. The findings determine whether routine cleaning, periodontal treatment or another approach is appropriate.",
      "Continue gentle daily cleaning unless your clinician advises otherwise. Stopping brushing completely can allow more plaque to collect, while aggressive scrubbing may irritate the tissues.",
      "Seek prompt dental advice if bleeding is accompanied by loose teeth, swelling, pus, severe pain or rapidly worsening symptoms. Mention any medical conditions or medicines that may affect bleeding.",
      "After treatment, consistent home care and review intervals based on your gum health help reduce the chance of the problem returning.",
    ],
  },
  {
    slug: "kids-first-visit",
    title: "Preparing your child for their first dental visit",
    category: "Children's Dental Care",
    date: "21 Apr 2026",
    datePublished: "2026-04-21",
    dateModified: "2026-09-08",
    serviceSlug: "pediatric-dentistry",
    excerpt:
      "Simple ways to make a child's first dental appointment calm, familiar and focused on prevention.",
    sources: [
      {
        label: "American Academy of Pediatric Dentistry: Parent FAQ",
        url: "https://www.aapd.org/resources/parent/faq/",
      },
    ],
    body: [
      "Early dental visits help parents receive guidance on cleaning, diet and tooth development before a problem becomes painful. Professional recommendations commonly support a first visit by the first birthday.",
      "Use simple, neutral language at home. You can say the dentist will count the teeth and help keep them clean. Avoid promising that nothing will happen, because the visit depends on what the clinician finds.",
      "Choose a time when your child is usually rested and bring information about medical conditions, medicines, allergies and any dental symptoms.",
      "A first visit may be mostly an introduction, conversation and gentle examination. The pace depends on the child's age, comfort and clinical needs.",
      "Parents can ask about brushing with fluoride toothpaste, snacks and drinks, thumb or pacifier habits, injury prevention and how often reviews are appropriate.",
      "If your child has facial swelling, dental trauma, uncontrolled bleeding or significant pain, call the clinic promptly rather than waiting for a routine first-visit appointment.",
    ],
  },
];

export const faqs = [
  {
    group: "Appointments",
    items: [
      {
        q: "Are appointments confirmed instantly?",
        a: "No. Appointment requests require manual follow-up — our team will contact you by phone or WhatsApp to confirm your slot, usually within clinic hours.",
      },
      {
        q: "Do you offer emergency services?",
        a: "We do not offer dedicated emergency services. For urgent concerns during clinic hours, please call the clinic directly.",
      },
      {
        q: "How early should I arrive?",
        a: "Ten minutes before your slot for first visits, five minutes for reviews.",
      },
      {
        q: "Can I book for a family member?",
        a: "Absolutely. Add their name in the notes field when you request an appointment.",
      },
    ],
  },
  {
    group: "Costs & Payment",
    items: [
      {
        q: "Will you tell me the cost before treatment?",
        a: "Always. You receive a written plan with itemised costs before anything begins. Consultation fees are discussed directly during your visit.",
      },
      {
        q: "Do you offer EMI or payment plans?",
        a: "Please call the clinic to discuss payment options for your specific treatment plan.",
      },
      {
        q: "Do you accept insurance?",
        a: "We provide all documentation needed for reimbursement claims.",
      },
    ],
  },
  {
    group: "Treatment & Safety",
    items: [
      {
        q: "Is treatment painful?",
        a: "Local anaesthesia and careful clinical techniques may help manage discomfort when appropriate. Individual experiences vary, so discuss any anxiety or previous difficulties with the treating clinician before care begins.",
      },
      {
        q: "How often should I have a check-up?",
        a: "The appropriate interval depends on your oral health, treatment needs and risk factors. Your dentist will recommend a review schedule after examining you.",
      },
      {
        q: "Do you follow sterilisation protocols?",
        a: "Yes — we use a Class N autoclave, UV chamber for disinfection, ultrasonic cleaning and single-use disposables for every patient.",
      },
      {
        q: "What equipment do you use?",
        a: "Complete dental chair setup, RVG digital X-ray, pneumatic suction, Class N autoclave, UV chamber, ultrasonic scaler, compressor unit and a professional dental lab setup.",
      },
    ],
  },
];

export const qualifications = [
  "Complete dental chair setup",
  "RVG digital X-ray imaging",
  "Pneumatic suction unit",
  "Class N autoclave sterilisation",
  "UV chamber for disinfection",
  "Ultrasonic scaler unit",
  "Compressor unit",
  "Professional dental lab setup",
];
