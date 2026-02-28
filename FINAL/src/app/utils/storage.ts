export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  domain: string;
  year: string;
  skills: string[];
  alignmentScore: number;
}

export interface TrendingSkill {
  skill: string;
  growth: number;
}

export interface Roadmaps {
  [domain: string]: string[];
}

export interface AutomationRisk {
  [domain: string]: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  videoType?: 'youtube' | 'local';
  skillTags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  domain: string;
  documents?: CourseDocument[];
}

export interface CourseDocument {
  id: number;
  name: string;
  type: string;
  data: string; // base64
  size: number;
}

export interface Certificate {
  id: number;
  userEmail: string;
  userName: string;
  courseId: number;
  courseTitle: string;
  courseDomain: string;
  courseDifficulty: string;
  completedDate: string;
  issuedDate: string;
}

export interface Question {
  id: number;
  text: string;
  type: 'mcq' | 'coding' | 'case';
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  domain: string;
  explanation: string;
}

export interface AssessmentResult {
  id: number;
  userEmail: string;
  domain: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  timeTaken: number;
}

export interface InterviewResult {
  id: number;
  userEmail: string;
  jobRole: string;
  communicationScore: number;
  confidenceScore: number;
  technicalScore: number;
  overallScore: number;
  date: string;
  suggestions: string[];
}

export interface Enrollment {
  courseId: number;
  enrolled: boolean;
  progress: number;
  completed: boolean;
  enrolledDate: string;
  completedDate?: string;
}

const DEFAULT_TRENDING_SKILLS: TrendingSkill[] = [
  { skill: "Python", growth: 35 },
  { skill: "AI/ML", growth: 50 },
  { skill: "React", growth: 40 },
  { skill: "Cloud Computing", growth: 45 },
  { skill: "Data Science", growth: 38 },
  { skill: "Cybersecurity", growth: 42 },
  { skill: "DevOps", growth: 30 },
  { skill: "Blockchain", growth: 25 },
  { skill: "TypeScript", growth: 36 },
  { skill: "Kubernetes", growth: 28 },
];

const DEFAULT_DOMAINS: string[] = [
  "AI/ML",
  "Web Development",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "Mobile Development",
  "DevOps",
  "Blockchain",
  "Data Entry",
  "UI/UX Design",
];

const DEFAULT_ROADMAPS: Roadmaps = {
  "AI/ML": [
    "Learn Python Programming",
    "Study Mathematics & Statistics",
    "Learn ML Basics with Scikit-learn",
    "Build Real ML Projects",
    "Learn Deep Learning (TensorFlow/PyTorch)",
    "Study NLP & Computer Vision",
    "Deploy Models to Production",
    "Contribute to Open Source AI",
  ],
  "Web Development": [
    "Master HTML & CSS Fundamentals",
    "Learn JavaScript & ES6+",
    "Learn React.js Framework",
    "Study Node.js & Express",
    "Learn Database Design (SQL + NoSQL)",
    "Build Full-Stack Projects",
    "Learn DevOps & CI/CD Basics",
    "Master System Design",
  ],
  "Data Science": [
    "Learn Python for Data Science",
    "Study Statistics & Probability",
    "Master Data Wrangling (Pandas/NumPy)",
    "Learn Data Visualization (Matplotlib/Seaborn)",
    "Study Machine Learning Algorithms",
    "Learn SQL for Data Analysis",
    "Build End-to-End Data Projects",
    "Learn Big Data Tools (Spark)",
  ],
  "Cybersecurity": [
    "Learn Networking Fundamentals",
    "Master Linux & Command Line",
    "Study Security Concepts & CIA Triad",
    "Learn Ethical Hacking Basics",
    "Practice CTF Challenges",
    "Study Cryptography",
    "Get Certified (CEH / CompTIA Security+)",
    "Learn Incident Response & Forensics",
  ],
  "Cloud Computing": [
    "Learn Cloud Fundamentals",
    "Study AWS / Azure / GCP Core Services",
    "Learn Networking in Cloud",
    "Study Infrastructure as Code (Terraform)",
    "Get Cloud Certified (AWS SAA / Azure AZ-900)",
    "Learn Serverless Architecture",
    "Master Cloud Security",
    "Build Cloud-Native Applications",
  ],
  "Mobile Development": [
    "Learn Programming Fundamentals",
    "Study React Native or Flutter",
    "Learn Mobile UI/UX Design Principles",
    "Build Mobile Applications",
    "Learn State Management",
    "Study App Performance Optimization",
    "Learn Mobile Backend Integration",
    "Deploy Apps to Play Store / App Store",
  ],
  "DevOps": [
    "Master Linux & Shell Scripting",
    "Learn Git & Version Control",
    "Study CI/CD Pipelines (Jenkins / GitHub Actions)",
    "Learn Docker & Containerization",
    "Master Kubernetes Orchestration",
    "Study Monitoring & Logging (Prometheus/Grafana)",
    "Learn Cloud Services (AWS/GCP/Azure)",
    "Implement Infrastructure as Code",
  ],
  "Blockchain": [
    "Learn Cryptography Basics",
    "Understand Blockchain Architecture",
    "Study Smart Contracts",
    "Learn Solidity Programming",
    "Build Decentralized Applications (DApps)",
    "Study DeFi & Web3 Concepts",
    "Learn NFT Development",
    "Contribute to Blockchain Projects",
  ],
  "Data Entry": [
    "Master Microsoft Excel & Google Sheets",
    "Learn Data Processing & Validation",
    "Study Basic Database Management",
    "Learn Python for Data Automation",
    "Consider Upskilling to Data Analysis",
    "Learn SQL Fundamentals",
    "Study Power BI / Tableau",
    "Transition to Data Analyst Role",
  ],
  "UI/UX Design": [
    "Study Design Principles & Color Theory",
    "Master Figma / Adobe XD",
    "Learn User Research Methods",
    "Study Interaction Design",
    "Create a Design Portfolio",
    "Learn HTML & CSS Basics",
    "Study Accessibility (WCAG)",
    "Practice Design Systems",
  ],
};

const DEFAULT_AUTOMATION_RISK: AutomationRisk = {
  "AI/ML": "Low",
  "Web Development": "Low",
  "Data Science": "Low",
  "Cybersecurity": "Low",
  "Cloud Computing": "Low",
  "Mobile Development": "Low",
  "DevOps": "Low",
  "Blockchain": "Low",
  "Data Entry": "High",
  "UI/UX Design": "Medium",
};

const DEFAULT_COURSES: Course[] = [
  { id: 1, title: "Machine Learning Fundamentals", description: "Learn core ML concepts, supervised & unsupervised algorithms, and practical implementation with Python and Scikit-learn.", videoUrl: "https://www.youtube.com/embed/GwIo3gDZCVQ", skillTags: ["Python", "AI/ML", "Scikit-learn"], difficulty: "Beginner", duration: "12 hours", domain: "AI/ML" },
  { id: 2, title: "Deep Learning with TensorFlow", description: "Master neural networks, CNNs, RNNs, transformers and deploy production deep learning models at scale.", videoUrl: "https://www.youtube.com/embed/tPYj3fFJGjk", skillTags: ["Python", "AI/ML", "TensorFlow", "Deep Learning"], difficulty: "Advanced", duration: "20 hours", domain: "AI/ML" },
  { id: 3, title: "Natural Language Processing & LLMs", description: "Build NLP pipelines, fine-tune language models, and work with modern LLM APIs for real-world applications.", videoUrl: "https://www.youtube.com/embed/dIas0aC7FeY", skillTags: ["Python", "AI/ML", "NLP", "LLM"], difficulty: "Intermediate", duration: "16 hours", domain: "AI/ML" },
  { id: 4, title: "React.js Complete Guide 2025", description: "Build modern web applications with React hooks, context API, routing, and state management libraries.", videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk", skillTags: ["React", "JavaScript", "TypeScript"], difficulty: "Intermediate", duration: "15 hours", domain: "Web Development" },
  { id: 5, title: "Node.js & Express Backend Mastery", description: "Create RESTful APIs, authenticate users, manage databases, and deploy production Node.js applications.", videoUrl: "https://www.youtube.com/embed/Oe421EPjeBE", skillTags: ["Node.js", "Express", "JavaScript", "REST API"], difficulty: "Intermediate", duration: "10 hours", domain: "Web Development" },
  { id: 6, title: "HTML, CSS & JavaScript Bootcamp", description: "Complete beginner to intermediate guide covering HTML5, CSS3, flexbox, grid, and modern JavaScript.", videoUrl: "https://www.youtube.com/embed/G3e-cpL7ofc", skillTags: ["HTML", "CSS", "JavaScript"], difficulty: "Beginner", duration: "18 hours", domain: "Web Development" },
  { id: 7, title: "Python for Data Science & Analysis", description: "Master NumPy, Pandas, data visualization with Matplotlib and Seaborn for end-to-end data analysis.", videoUrl: "https://www.youtube.com/embed/LHBE6Q9XlzI", skillTags: ["Python", "Pandas", "Data Science"], difficulty: "Beginner", duration: "14 hours", domain: "Data Science" },
  { id: 8, title: "SQL for Data Scientists", description: "Advanced SQL querying, window functions, CTEs, and database optimization for data analytics.", videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY", skillTags: ["SQL", "Database", "Data Science"], difficulty: "Intermediate", duration: "8 hours", domain: "Data Science" },
  { id: 9, title: "Ethical Hacking & Penetration Testing", description: "Learn offensive security, vulnerability assessment, Metasploit, and ethical hacking techniques for real-world scenarios.", videoUrl: "https://www.youtube.com/embed/3Kq1MIfTWCE", skillTags: ["Cybersecurity", "Linux", "Networking", "Ethical Hacking"], difficulty: "Intermediate", duration: "18 hours", domain: "Cybersecurity" },
  { id: 10, title: "Network Security Fundamentals", description: "Understand firewalls, VPNs, IDS/IPS, cryptography and network defense strategies for organizations.", videoUrl: "https://www.youtube.com/embed/E03gh1zavyY", skillTags: ["Cybersecurity", "Networking"], difficulty: "Beginner", duration: "10 hours", domain: "Cybersecurity" },
  { id: 11, title: "AWS Cloud Practitioner Essentials", description: "Comprehensive AWS fundamentals covering EC2, S3, RDS, Lambda, and cloud architecture best practices.", videoUrl: "https://www.youtube.com/embed/SOTamWNgDKc", skillTags: ["AWS", "Cloud Computing"], difficulty: "Beginner", duration: "11 hours", domain: "Cloud Computing" },
  { id: 12, title: "Docker & Kubernetes Mastery", description: "Containerize applications, build Docker images, and orchestrate at scale with Kubernetes clusters.", videoUrl: "https://www.youtube.com/embed/3c-iBn73dDE", skillTags: ["Docker", "Kubernetes", "DevOps"], difficulty: "Intermediate", duration: "16 hours", domain: "DevOps" },
  { id: 13, title: "CI/CD Pipelines with GitHub Actions", description: "Automate your software delivery pipeline with GitHub Actions, Jenkins, and deployment best practices.", videoUrl: "https://www.youtube.com/embed/R8_veQiYBjI", skillTags: ["DevOps", "CI/CD", "GitHub Actions"], difficulty: "Intermediate", duration: "9 hours", domain: "DevOps" },
  { id: 14, title: "Solidity Smart Contracts Development", description: "Build, test, and deploy smart contracts on Ethereum blockchain using Solidity and Hardhat.", videoUrl: "https://www.youtube.com/embed/ipwxYa-F1uY", skillTags: ["Blockchain", "Solidity", "Web3"], difficulty: "Intermediate", duration: "12 hours", domain: "Blockchain" },
  { id: 15, title: "React Native Cross-Platform Development", description: "Build professional iOS and Android apps with React Native, Expo, and native device integrations.", videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc", skillTags: ["React Native", "JavaScript", "Mobile Development"], difficulty: "Intermediate", duration: "14 hours", domain: "Mobile Development" },
  { id: 16, title: "Figma UI/UX Design Masterclass", description: "Design stunning interfaces, create design systems, and build interactive prototypes in Figma.", videoUrl: "https://www.youtube.com/embed/FTFaQWZBqQ8", skillTags: ["Figma", "UI/UX Design", "Prototyping"], difficulty: "Beginner", duration: "8 hours", domain: "UI/UX Design" },
  { id: 17, title: "Excel & Data Management Pro", description: "Master Excel formulas, pivot tables, VLOOKUP, macros, and data analysis for professional use.", videoUrl: "https://www.youtube.com/embed/Vl0H-qTclOg", skillTags: ["Excel", "Data Entry", "Spreadsheets"], difficulty: "Beginner", duration: "6 hours", domain: "Data Entry" },
];

const DEFAULT_QUESTIONS: Question[] = [
  // AI/ML
  { id: 1, text: "Which algorithm is best suited for classification problems with non-linear decision boundaries?", type: "mcq", options: ["Linear Regression", "Random Forest", "K-Means Clustering", "PCA"], correctAnswer: "Random Forest", difficulty: "medium", domain: "AI/ML", explanation: "Random Forest is an ensemble method that handles non-linear boundaries well through multiple decision trees." },
  { id: 2, text: "What is the purpose of the activation function in a neural network?", type: "mcq", options: ["Initialize weights", "Introduce non-linearity", "Reduce dimensions", "Normalize data"], correctAnswer: "Introduce non-linearity", difficulty: "easy", domain: "AI/ML", explanation: "Activation functions add non-linearity, allowing neural networks to learn complex patterns beyond linear relationships." },
  { id: 3, text: "Which technique is used to prevent overfitting in deep learning?", type: "mcq", options: ["Increasing learning rate", "Adding more layers", "Dropout regularization", "Using larger batches"], correctAnswer: "Dropout regularization", difficulty: "medium", domain: "AI/ML", explanation: "Dropout randomly deactivates neurons during training, preventing the model from over-relying on specific neurons." },
  { id: 4, text: "What is the difference between supervised and unsupervised learning?", type: "mcq", options: ["Speed of training", "Supervised uses labeled data, unsupervised does not", "Number of features", "Model complexity"], correctAnswer: "Supervised uses labeled data, unsupervised does not", difficulty: "easy", domain: "AI/ML", explanation: "Supervised learning trains on labeled input-output pairs, while unsupervised learning finds patterns in unlabeled data." },
  { id: 5, text: "Which loss function is typically used for binary classification?", type: "mcq", options: ["Mean Squared Error", "Binary Cross-Entropy", "Categorical Cross-Entropy", "Hinge Loss"], correctAnswer: "Binary Cross-Entropy", difficulty: "medium", domain: "AI/ML", explanation: "Binary Cross-Entropy measures performance for binary classification where output is a probability value between 0 and 1." },
  // Web Development
  { id: 6, text: "What is the Virtual DOM in React?", type: "mcq", options: ["A real browser DOM", "A JavaScript representation of the real DOM", "A CSS rendering engine", "A server-side technology"], correctAnswer: "A JavaScript representation of the real DOM", difficulty: "easy", domain: "Web Development", explanation: "React's Virtual DOM is a lightweight JS copy of the real DOM that React uses to compute minimal updates needed." },
  { id: 7, text: "Which HTTP method is idempotent and should be used to retrieve data?", type: "mcq", options: ["POST", "PUT", "GET", "PATCH"], correctAnswer: "GET", difficulty: "easy", domain: "Web Development", explanation: "GET is idempotent (multiple identical requests have same effect as one) and semantically used to retrieve resources." },
  { id: 8, text: "What does CORS stand for?", type: "mcq", options: ["Cross-Origin Resource Sharing", "Client-Origin Resource Sharing", "Cross-Origin Resource Security", "Content-Origin Resource Sharing"], correctAnswer: "Cross-Origin Resource Sharing", difficulty: "medium", domain: "Web Development", explanation: "CORS allows or restricts web apps running at one origin to make requests to a different origin." },
  { id: 9, text: "What is the purpose of the useEffect hook in React?", type: "mcq", options: ["Create state variables", "Perform side effects", "Memoize computed values", "Create context providers"], correctAnswer: "Perform side effects", difficulty: "medium", domain: "Web Development", explanation: "useEffect handles side effects like data fetching, subscriptions, or DOM manipulation after rendering." },
  { id: 10, text: "What does the CSS 'box-model' consist of?", type: "mcq", options: ["Content, Padding, Border, Margin", "Width, Height, Color, Font", "Display, Position, Float, Clear", "Flex, Grid, Block, Inline"], correctAnswer: "Content, Padding, Border, Margin", difficulty: "easy", domain: "Web Development", explanation: "The CSS box model describes the rectangular boxes generated for elements: Content → Padding → Border → Margin." },
  // Data Science
  { id: 11, text: "What is the purpose of normalization in data preprocessing?", type: "mcq", options: ["Remove duplicates", "Scale features to a uniform range", "Fill missing values", "Encode categorical variables"], correctAnswer: "Scale features to a uniform range", difficulty: "easy", domain: "Data Science", explanation: "Normalization scales features to a standard range (0-1) so no single feature dominates due to its magnitude." },
  { id: 12, text: "What does a p-value less than 0.05 indicate in hypothesis testing?", type: "mcq", options: ["No statistical significance", "Strong statistical significance", "Weak correlation", "High variance"], correctAnswer: "Strong statistical significance", difficulty: "medium", domain: "Data Science", explanation: "A p-value < 0.05 means there's less than 5% probability the observed result occurred by chance (reject null hypothesis)." },
  { id: 13, text: "What is the bias-variance tradeoff in machine learning?", type: "mcq", options: ["Trade speed for accuracy", "Balance between underfitting and overfitting", "Trade model size for performance", "Balance precision and recall"], correctAnswer: "Balance between underfitting and overfitting", difficulty: "hard", domain: "Data Science", explanation: "High bias = underfitting (too simple model), High variance = overfitting (too complex). The tradeoff finds the sweet spot." },
  { id: 14, text: "Which Pandas function is used to handle missing values?", type: "mcq", options: ["df.clean()", "df.fillna()", "df.remove_null()", "df.replace_missing()"], correctAnswer: "df.fillna()", difficulty: "easy", domain: "Data Science", explanation: "df.fillna() fills NA/NaN values with a specified value or method like forward/backward fill." },
  // Cybersecurity
  { id: 15, text: "What is a SQL injection attack?", type: "mcq", options: ["A type of DDoS attack", "Inserting malicious SQL code into input fields", "Encrypting database contents", "A network scanning technique"], correctAnswer: "Inserting malicious SQL code into input fields", difficulty: "easy", domain: "Cybersecurity", explanation: "SQL injection injects malicious SQL into queries, allowing attackers to manipulate the database." },
  { id: 16, text: "What does the CIA Triad stand for in cybersecurity?", type: "mcq", options: ["Code, Integration, Authentication", "Confidentiality, Integrity, Availability", "Cybersecurity, Infrastructure, Access", "Control, Identity, Authorization"], correctAnswer: "Confidentiality, Integrity, Availability", difficulty: "easy", domain: "Cybersecurity", explanation: "CIA Triad: Confidentiality (limit access), Integrity (data accuracy), Availability (accessible when needed)." },
  { id: 17, text: "What type of attack overwhelms a server with requests to make it unavailable?", type: "mcq", options: ["Man-in-the-Middle", "Phishing", "DDoS (Distributed Denial of Service)", "Ransomware"], correctAnswer: "DDoS (Distributed Denial of Service)", difficulty: "easy", domain: "Cybersecurity", explanation: "DDoS floods a server with traffic from multiple sources to exhaust resources and deny service to legitimate users." },
  { id: 18, text: "What is a zero-day vulnerability?", type: "mcq", options: ["A bug found on day zero of deployment", "A vulnerability unknown to the vendor with no patch available", "A vulnerability in day-zero software", "A low-severity security flaw"], correctAnswer: "A vulnerability unknown to the vendor with no patch available", difficulty: "medium", domain: "Cybersecurity", explanation: "Zero-day vulnerabilities are security flaws not yet known to the software vendor, making them especially dangerous." },
  // Cloud Computing
  { id: 19, text: "What is serverless computing?", type: "mcq", options: ["Computing without any servers", "Cloud model where provider manages infrastructure, billed per execution", "Computing on local servers only", "A type of virtualization technology"], correctAnswer: "Cloud model where provider manages infrastructure, billed per execution", difficulty: "medium", domain: "Cloud Computing", explanation: "Serverless lets you run code without managing servers; the provider handles scaling and you pay only per invocation." },
  { id: 20, text: "What does the AWS S3 service primarily provide?", type: "mcq", options: ["Virtual machines", "Object storage", "Database hosting", "Content delivery network"], correctAnswer: "Object storage", difficulty: "easy", domain: "Cloud Computing", explanation: "AWS S3 (Simple Storage Service) provides scalable object storage for any type of data accessible from anywhere." },
  // DevOps
  { id: 21, text: "What is the primary purpose of a CI/CD pipeline?", type: "mcq", options: ["Create user interfaces", "Automate build, test, and deployment of software", "Configure network settings", "Monitor server performance metrics"], correctAnswer: "Automate build, test, and deployment of software", difficulty: "easy", domain: "DevOps", explanation: "CI/CD automates software delivery: Continuous Integration (build/test) and Continuous Deployment (automated release)." },
  { id: 22, text: "What is the key difference between Docker images and containers?", type: "mcq", options: ["Size difference", "Images are read-only templates; containers are running instances", "Images run code; containers store data", "No difference"], correctAnswer: "Images are read-only templates; containers are running instances", difficulty: "medium", domain: "DevOps", explanation: "Docker images are immutable blueprints, while containers are running instances created from those images." },
  // General Tech
  { id: 23, text: "What is the time complexity of binary search on a sorted array?", type: "mcq", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correctAnswer: "O(log n)", difficulty: "medium", domain: "General", explanation: "Binary search halves the search space with each step, giving O(log n) where n is the array size." },
  { id: 24, text: "What does REST stand for in API design?", type: "mcq", options: ["Remote Execution State Transfer", "Representational State Transfer", "Resource Endpoint Service Technology", "Reliable Exchange Server Technology"], correctAnswer: "Representational State Transfer", difficulty: "easy", domain: "General", explanation: "REST is an architectural style for designing networked applications using stateless, client-server communication over HTTP." },
  { id: 25, text: "What is the purpose of version control systems like Git?", type: "mcq", options: ["Speed up code execution", "Track changes, collaborate, and manage code history", "Optimize database queries", "Deploy applications automatically"], correctAnswer: "Track changes, collaborate, and manage code history", difficulty: "easy", domain: "General", explanation: "Git tracks file changes over time, enables multiple developers to collaborate, and allows reverting to previous states." },
];

const INTERVIEW_QUESTIONS_BY_ROLE: Record<string, string[]> = {
  "Software Engineer": [
    "Tell me about yourself and your software engineering experience.",
    "Describe a challenging technical problem you solved. What was your approach?",
    "How do you ensure code quality in your projects?",
    "Explain the concept of object-oriented programming with a real example.",
    "How do you handle version control in a team environment?",
    "What is your experience with testing — unit, integration, E2E?",
    "Describe the difference between synchronous and asynchronous programming.",
    "How do you approach system design for a scalable application?",
    "What design patterns have you used and why?",
    "How do you stay up to date with the latest technologies?",
    "Describe a time when you had to refactor legacy code.",
    "How do you handle code reviews — giving and receiving feedback?",
    "What is your experience with Agile or Scrum methodology?",
    "How do you prioritize tasks when working on multiple features?",
    "Where do you see yourself in 5 years as a software engineer?",
  ],
  "Data Scientist": [
    "Tell me about your background in data science and analytics.",
    "Walk me through a complete data science project you've worked on.",
    "How do you handle missing data in a dataset?",
    "Explain the difference between supervised and unsupervised learning.",
    "How do you evaluate a machine learning model's performance?",
    "Describe a time when your data analysis led to a business insight.",
    "What is overfitting and how do you prevent it?",
    "How do you communicate complex analytical findings to non-technical stakeholders?",
    "What is feature engineering and why is it important?",
    "Describe the bias-variance tradeoff in your own words.",
    "How do you select the right algorithm for a given problem?",
    "What is A/B testing and how have you used it?",
    "How do you validate the quality of a dataset?",
    "What tools and frameworks do you use for data visualization?",
    "How would you approach building a recommendation system?",
  ],
  "AI/ML Engineer": [
    "Describe your experience with machine learning frameworks like TensorFlow or PyTorch.",
    "How do you go from a research model to a production deployment?",
    "Explain how transformers and attention mechanisms work.",
    "What strategies do you use for hyperparameter tuning?",
    "How do you monitor model performance in production?",
    "Describe a project where you improved model accuracy significantly.",
    "What is transfer learning and when would you use it?",
    "How do you handle class imbalance in a classification problem?",
    "Explain the concept of explainable AI and why it matters.",
    "What is the difference between bagging and boosting?",
    "How do you approach data augmentation for limited datasets?",
    "Describe your experience with MLOps and model deployment pipelines.",
    "How do you ensure fairness and reduce bias in ML models?",
    "What is your approach to model versioning and experiment tracking?",
    "Where do you see AI/ML heading in the next 5 years?",
  ],
  "Web Developer": [
    "Tell me about your experience with frontend and backend technologies.",
    "How do you approach responsive web design?",
    "Explain the difference between REST and GraphQL APIs.",
    "How do you optimize website performance?",
    "Describe your workflow for building a new feature end-to-end.",
    "What is your experience with state management solutions like Redux?",
    "How do you handle cross-browser compatibility issues?",
    "Explain the concept of progressive web apps.",
    "How do you approach web accessibility (WCAG guidelines)?",
    "What security measures do you implement in web applications?",
    "How do you handle authentication and authorization?",
    "Describe your experience with database design and optimization.",
    "How do you approach SEO in web development?",
    "What is your process for debugging complex web issues?",
    "How do you stay current with evolving web standards?",
  ],
  "DevOps Engineer": [
    "Tell me about your experience with CI/CD pipelines.",
    "How do you approach infrastructure as code?",
    "Describe a complex deployment challenge you solved.",
    "What monitoring and alerting systems have you implemented?",
    "How do you ensure high availability and disaster recovery?",
    "Explain your experience with containerization and orchestration.",
    "How do you handle secrets management and security in pipelines?",
    "Describe your approach to capacity planning.",
    "What is your experience with cloud platforms (AWS/Azure/GCP)?",
    "How do you balance speed of deployment with stability?",
    "What is your approach to incident response and post-mortems?",
    "How do you manage configuration drift across environments?",
    "Describe your experience with logging and observability.",
    "How do you onboard developers to DevOps best practices?",
    "Where do you see the DevOps field evolving?",
  ],
  "Cybersecurity Analyst": [
    "Tell me about your background in cybersecurity.",
    "Describe a security incident you have responded to.",
    "How do you conduct a vulnerability assessment?",
    "What is your experience with penetration testing?",
    "How do you stay up to date with emerging threats?",
    "Explain the process of threat modeling.",
    "How do you prioritize security vulnerabilities for remediation?",
    "Describe your experience with SIEM tools.",
    "How do you handle a phishing attack in your organization?",
    "What frameworks (NIST, ISO 27001) have you worked with?",
    "How do you balance security requirements with user experience?",
    "Describe your experience with network security architecture.",
    "How do you conduct security awareness training?",
    "What is zero-trust architecture and how would you implement it?",
    "How would you secure a cloud-native application?",
  ],
};

export function getInterviewQuestions(jobRole: string): string[] {
  return INTERVIEW_QUESTIONS_BY_ROLE[jobRole] || INTERVIEW_QUESTIONS_BY_ROLE["Software Engineer"];
}

export function getJobRoles(): string[] {
  return Object.keys(INTERVIEW_QUESTIONS_BY_ROLE);
}

export function initializeStorage(): void {
  if (!localStorage.getItem("trendingSkills")) {
    localStorage.setItem("trendingSkills", JSON.stringify(DEFAULT_TRENDING_SKILLS));
  }
  if (!localStorage.getItem("domains")) {
    localStorage.setItem("domains", JSON.stringify(DEFAULT_DOMAINS));
  }
  if (!localStorage.getItem("roadmaps")) {
    localStorage.setItem("roadmaps", JSON.stringify(DEFAULT_ROADMAPS));
  }
  if (!localStorage.getItem("automationRisk")) {
    localStorage.setItem("automationRisk", JSON.stringify(DEFAULT_AUTOMATION_RISK));
  }
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
  }
  if (!localStorage.getItem("courses")) {
    localStorage.setItem("courses", JSON.stringify(DEFAULT_COURSES));
  }
  if (!localStorage.getItem("questions")) {
    localStorage.setItem("questions", JSON.stringify(DEFAULT_QUESTIONS));
  }
  if (!localStorage.getItem("assessmentResults")) {
    localStorage.setItem("assessmentResults", JSON.stringify([]));
  }
  if (!localStorage.getItem("interviewResults")) {
    localStorage.setItem("interviewResults", JSON.stringify([]));
  }
  if (!localStorage.getItem("certificates")) {
    localStorage.setItem("certificates", JSON.stringify([]));
  }
}

// Users
export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem("users") || "[]");
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem("users", JSON.stringify(users));
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

// Current User
export function getCurrentUser(): User | null {
  try {
    const data = localStorage.getItem("currentUser");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User): void {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function clearCurrentUser(): void {
  localStorage.removeItem("currentUser");
}

// Trending Skills
export function getTrendingSkills(): TrendingSkill[] {
  try {
    return JSON.parse(localStorage.getItem("trendingSkills") || "[]");
  } catch {
    return DEFAULT_TRENDING_SKILLS;
  }
}

export function saveTrendingSkills(skills: TrendingSkill[]): void {
  localStorage.setItem("trendingSkills", JSON.stringify(skills));
}

// Domains
export function getDomains(): string[] {
  try {
    return JSON.parse(localStorage.getItem("domains") || "[]");
  } catch {
    return DEFAULT_DOMAINS;
  }
}

export function saveDomains(domains: string[]): void {
  localStorage.setItem("domains", JSON.stringify(domains));
}

// Roadmaps
export function getRoadmaps(): Roadmaps {
  try {
    return JSON.parse(localStorage.getItem("roadmaps") || "{}");
  } catch {
    return DEFAULT_ROADMAPS;
  }
}

export function saveRoadmaps(roadmaps: Roadmaps): void {
  localStorage.setItem("roadmaps", JSON.stringify(roadmaps));
}

// Automation Risk
export function getAutomationRisk(): AutomationRisk {
  try {
    return JSON.parse(localStorage.getItem("automationRisk") || "{}");
  } catch {
    return DEFAULT_AUTOMATION_RISK;
  }
}

export function saveAutomationRisk(risk: AutomationRisk): void {
  localStorage.setItem("automationRisk", JSON.stringify(risk));
}

// Admin session
export function setAdminLoggedIn(): void {
  localStorage.setItem("adminLoggedIn", "true");
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem("adminLoggedIn") === "true";
}

export function clearAdminSession(): void {
  localStorage.removeItem("adminLoggedIn");
}

// Update user skills and alignment score
export function updateUserSkills(email: string, skills: string[]): User | null {
  const trendingSkills = getTrendingSkills();
  const matchCount = skills.filter((s) =>
    trendingSkills.some((ts) => ts.skill.toLowerCase() === s.toLowerCase())
  ).length;
  const alignmentScore =
    trendingSkills.length > 0
      ? Math.round((matchCount / trendingSkills.length) * 100)
      : 0;

  const users = getUsers();
  const idx = users.findIndex((u) => u.email === email);
  if (idx !== -1) {
    users[idx].skills = skills;
    users[idx].alignmentScore = alignmentScore;
    saveUsers(users);
    const updatedUser = { ...users[idx] };
    setCurrentUser(updatedUser);
    return updatedUser;
  }
  return null;
}

export function calculateAlignmentScore(skills: string[]): number {
  const trendingSkills = getTrendingSkills();
  if (trendingSkills.length === 0) return 0;
  const matchCount = skills.filter((s) =>
    trendingSkills.some((ts) => ts.skill.toLowerCase() === s.toLowerCase())
  ).length;
  return Math.round((matchCount / trendingSkills.length) * 100);
}

// ── COURSES ──────────────────────────────────────────────

export function getCourses(): Course[] {
  try {
    return JSON.parse(localStorage.getItem("courses") || "[]");
  } catch {
    return DEFAULT_COURSES;
  }
}

export function saveCourses(courses: Course[]): void {
  localStorage.setItem("courses", JSON.stringify(courses));
}

export function addCourse(course: Course): void {
  const courses = getCourses();
  courses.push(course);
  saveCourses(courses);
}

export function removeCourse(id: number): void {
  const courses = getCourses().filter((c) => c.id !== id);
  saveCourses(courses);
}

// ── QUESTIONS ────────────────────────────────────────────

export function getQuestions(): Question[] {
  try {
    return JSON.parse(localStorage.getItem("questions") || "[]");
  } catch {
    return DEFAULT_QUESTIONS;
  }
}

export function saveQuestions(questions: Question[]): void {
  localStorage.setItem("questions", JSON.stringify(questions));
}

export function addQuestion(question: Question): void {
  const questions = getQuestions();
  questions.push(question);
  saveQuestions(questions);
}

export function removeQuestion(id: number): void {
  const questions = getQuestions().filter((q) => q.id !== id);
  saveQuestions(questions);
}

export function getQuestionsByDomain(domain: string): Question[] {
  const all = getQuestions();
  const domainQ = all.filter((q) => q.domain === domain);
  const generalQ = all.filter((q) => q.domain === "General");
  if (domainQ.length >= 5) return domainQ;
  return [...domainQ, ...generalQ].slice(0, Math.max(10, domainQ.length));
}

// ── ASSESSMENT RESULTS ───────────────────────────────────

export function getAssessmentResults(): AssessmentResult[] {
  try {
    return JSON.parse(localStorage.getItem("assessmentResults") || "[]");
  } catch {
    return [];
  }
}

export function saveAssessmentResult(result: AssessmentResult): void {
  const results = getAssessmentResults();
  results.push(result);
  localStorage.setItem("assessmentResults", JSON.stringify(results));
}

export function getUserAssessmentResults(email: string): AssessmentResult[] {
  return getAssessmentResults().filter((r) => r.userEmail === email);
}

// ── INTERVIEW RESULTS ─────────────────────────────────────

export function getInterviewResults(): InterviewResult[] {
  try {
    return JSON.parse(localStorage.getItem("interviewResults") || "[]");
  } catch {
    return [];
  }
}

export function saveInterviewResult(result: InterviewResult): void {
  const results = getInterviewResults();
  results.push(result);
  localStorage.setItem("interviewResults", JSON.stringify(results));
}

export function getUserInterviewResults(email: string): InterviewResult[] {
  return getInterviewResults().filter((r) => r.userEmail === email);
}

// ── ENROLLMENTS ──────────────────────────────────────────

export function getEnrollments(email: string): Enrollment[] {
  try {
    return JSON.parse(localStorage.getItem(`enrollments_${email}`) || "[]");
  } catch {
    return [];
  }
}

export function saveEnrollments(email: string, enrollments: Enrollment[]): void {
  localStorage.setItem(`enrollments_${email}`, JSON.stringify(enrollments));
}

export function enrollCourse(email: string, courseId: number): Enrollment[] {
  const enrollments = getEnrollments(email);
  const existing = enrollments.find((e) => e.courseId === courseId);
  if (!existing) {
    enrollments.push({
      courseId,
      enrolled: true,
      progress: 0,
      completed: false,
      enrolledDate: new Date().toISOString().split("T")[0],
    });
    saveEnrollments(email, enrollments);
  }
  return enrollments;
}

export function updateCourseProgress(email: string, courseId: number, progress: number): Enrollment[] {
  const enrollments = getEnrollments(email);
  const idx = enrollments.findIndex((e) => e.courseId === courseId);
  if (idx !== -1) {
    enrollments[idx].progress = Math.min(100, progress);
    enrollments[idx].completed = enrollments[idx].progress >= 100;
    if (enrollments[idx].completed) {
      enrollments[idx].completedDate = new Date().toISOString().split("T")[0];
    }
    saveEnrollments(email, enrollments);
  }
  return enrollments;
}

export function unenrollCourse(email: string, courseId: number): Enrollment[] {
  const enrollments = getEnrollments(email).filter((e) => e.courseId !== courseId);
  saveEnrollments(email, enrollments);
  return enrollments;
}

// ── CERTIFICATES ─────────────────────────────────────────

export function getCertificates(): Certificate[] {
  try {
    return JSON.parse(localStorage.getItem("certificates") || "[]");
  } catch {
    return [];
  }
}

export function saveCertificates(certs: Certificate[]): void {
  localStorage.setItem("certificates", JSON.stringify(certs));
}

export function getUserCertificates(email: string): Certificate[] {
  return getCertificates().filter((c) => c.userEmail === email);
}

export function addCertificate(cert: Certificate): void {
  const certs = getCertificates();
  const exists = certs.find((c) => c.userEmail === cert.userEmail && c.courseId === cert.courseId);
  if (!exists) {
    certs.push(cert);
    saveCertificates(certs);
  }
}

export function hasCertificate(email: string, courseId: number): boolean {
  return getCertificates().some((c) => c.userEmail === email && c.courseId === courseId);
}

// ── COURSE DOCUMENTS (IndexedDB for large files) ─────────

const IDB_NAME = "skillsync_idb";
const IDB_VERSION = 1;
const IDB_VIDEO_STORE = "course_videos";

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IDB_VIDEO_STORE)) {
        db.createObjectStore(IDB_VIDEO_STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function storeVideoInIDB(courseId: number, file: File): Promise<string> {
  const db = await openIDB();
  const key = `video_${courseId}`;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_VIDEO_STORE, "readwrite");
    const store = tx.objectStore(IDB_VIDEO_STORE);
    store.put({ key, file, name: file.name, type: file.type });
    tx.oncomplete = () => resolve(key);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getVideoFromIDB(key: string): Promise<{ file: File; name: string; type: string } | null> {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_VIDEO_STORE, "readonly");
      const store = tx.objectStore(IDB_VIDEO_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function removeVideoFromIDB(key: string): Promise<void> {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_VIDEO_STORE, "readwrite");
      tx.objectStore(IDB_VIDEO_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

// Update course documents
export function updateCourseDocuments(courseId: number, documents: CourseDocument[]): void {
  const courses = getCourses();
  const idx = courses.findIndex((c) => c.id === courseId);
  if (idx !== -1) {
    courses[idx].documents = documents;
    saveCourses(courses);
  }
}

// YouTube URL helper
export function toYouTubeEmbed(url: string): string {
  if (!url) return "";
  // Already embed
  if (url.includes("youtube.com/embed/")) return url;
  // youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return url;
}

// ── PROFILE PICTURES ──────────────────────────────────────

export function saveProfilePic(email: string, base64: string): void {
  try {
    localStorage.setItem(`profilePic_${email}`, base64);
  } catch {
    // Storage might be full — ignore silently
  }
}

export function getProfilePic(email: string): string | null {
  return localStorage.getItem(`profilePic_${email}`);
}

export function removeProfilePic(email: string): void {
  localStorage.removeItem(`profilePic_${email}`);
}

// ── LIVE CLASSES ──────────────────────────────────────────

export interface LiveClass {
  id: string;
  courseName: string;
  facultyName: string;
  date: string;      // YYYY-MM-DD
  time: string;      // HH:MM (24h)
  meetLink: string;
  duration: number;  // minutes
  createdAt: string;
}

export function getLiveClasses(): LiveClass[] {
  try { return JSON.parse(localStorage.getItem("liveClasses") || "[]"); }
  catch { return []; }
}

export function saveLiveClasses(classes: LiveClass[]): void {
  localStorage.setItem("liveClasses", JSON.stringify(classes));
}

export function addLiveClass(lc: LiveClass): void {
  const all = getLiveClasses();
  all.push(lc);
  saveLiveClasses(all);
}

export function deleteLiveClass(id: string): void {
  saveLiveClasses(getLiveClasses().filter(c => c.id !== id));
}

export function getClassStatus(lc: LiveClass): "upcoming" | "live" | "completed" {
  const now = new Date();
  const start = new Date(`${lc.date}T${lc.time}`);
  const end   = new Date(start.getTime() + lc.duration * 60000);
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "live";
  return "completed";
}