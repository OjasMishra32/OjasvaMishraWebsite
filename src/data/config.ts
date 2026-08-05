const config = {
  title: "Ojasva Mishra | AI & Robotics Engineer",
  description: {
    long: "Ojasva Mishra — founding AI Platform Engineer at Drift (godrift.ai), research intern at the CMU Robotics Institute, and founder of Twinly. First-author on IEEE TRO and IROS submissions in robotic joint control and safety filtering. Building robotics simulation tooling, autonomous systems, and AI products that ship.",
    short:
      "AI & robotics engineer. Founding engineer at Drift, researcher at the CMU Robotics Institute, founder of Twinly.",
  },
  keywords: [
    "Ojasva Mishra",
    "AI engineer",
    "robotics engineer",
    "Drift",
    "godrift.ai",
    "Twinly",
    "CMU Robotics Institute",
    "ROS2",
    "Gazebo",
    "robotic joint control",
    "conformal safety filtering",
    "PID optimization",
    "computer vision",
    "University of Florida",
    "portfolio",
  ],
  author: "Ojasva Mishra",
  email: "ojasvamishra32@gmail.com",
  site: "https://www.ojasvamishra.me",

  // for github stars button — blank keeps the header button hidden
  githubUsername: "",
  githubRepo: "",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    twitter: "",
    linkedin: "https://www.linkedin.com/in/ojasva-mishra-657b89352/",
    instagram: "https://www.instagram.com/ojas_mishra32/",
    facebook: "",
    github: "https://github.com/OjasMishra32",
  },
};
export { config };
