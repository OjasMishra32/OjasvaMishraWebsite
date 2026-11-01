const config = {
  title: "Ojasva Mishra | AI & Robotics Engineer",
  description: {
    long: "Ojasva Mishra studies Computer Engineering and Finance at the University of Florida. Founding AI/software engineer at Drift, research intern at the CMU Robotics Institute with three first-author papers on robot joint control, and co-founder and CEO of Twinly.",
    short:
      "Founding engineer at Drift, researcher at the CMU Robotics Institute, co-founder and CEO of Twinly.",
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
