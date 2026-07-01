🏙️ CITISENSE: A Geo-Spatial AI Platform for Automated Classification, Cluster Detection, and Prioritization of Urban Concerns

👨‍💻 Proponents
- Joseph James Pinote
- Tricia Hyne Dungog
- Mary Jennyrose Bracero
- Zach Jimenez

🎯 Project Purpose

CitiSense is an AI-powered complaint management platform designed to help Local Government Units (LGUs) efficiently process, classify, prioritize, and monitor citizen complaints.

Many LGUs face challenges such as delayed responses, misclassified reports, lack of systematic prioritization, and limited transparency in complaint handling. CitiSense addresses these issues by leveraging Artificial Intelligence (AI), Natural Language Processing (NLP), Computer Vision, geospatial analysis, and real-time monitoring to improve the speed, accuracy, and organization of complaint resolution.

✨ Key Features
- 🤖 Automated complaint classification
- 📸 AI-assisted verification of complaint data and images
- 🚨 Smart prioritization based on urgency and severity
- 📍 Geospatial cluster detection of similar complaints
- 📊 Real-time dashboards and analytics
- 🔔 Automated notification system
- ✅ Complaint validation and resolution tracking


⚙️ Setup Instructions

📋 Prerequisites

Before running the project, ensure the following are installed:

- 🟢 Node.js (LTS Version)
- 📦 npm or Yarn
- 🌿 Git
- 📱 Expo CLI
- 🗄️ Supabase Project Configuration

🚀 Installation

1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd CitiSense
```

2️⃣ Install Dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

3️⃣ Configure Environment Variables

Create a `.env` file in the project's root directory and add the required environment variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Add any additional API keys or service credentials required by the project.

4️⃣ Start the Development Server

```bash
npx expo start
```

5️⃣ Run the Application

For Android:

```bash
npx expo run:android
```

For iOS:

```bash
npx expo run:ios
```


📖 Usage Details

👤 Citizen

Citizens can:

- 📝 Register and log in
- 📢 Submit complaints with descriptions and image evidence
- 🎙️ Use voice input when filing complaints
- 📍 Automatically attach location and timestamp information
- 🔍 Track complaint status updates
- 📸 Validate resolved complaints by submitting photo evidence
- 💬 Provide feedback regarding complaint resolution

🏢 Department Moderator

Department Moderators can:

- 📋 View assigned complaints
- 🔄 Update complaint statuses
- 🛠️ Manage and monitor department concerns
- ↔️ Reassign incorrectly classified complaints
- ✅ Handle complaint resolution workflows

👨‍💼 Admin

Administrators can:

- 🌐 Monitor all complaints across departments
- 📊 Access analytical dashboards and reports
- 📸 Review citizen-submitted validation evidence
- 💬 Review citizen feedback
- ✅ Confirm and finalize complaint resolutions

 🔄 Complaint Workflow

1. 📝 Citizen submits a complaint.
2. 🤖 AI verifies and classifies the complaint.
3. 🏢 The complaint is assigned to the appropriate department.
4. 🚨 AI determines the complaint's priority level.
5. 🛠️ Department Moderators process and resolve the complaint.
6. 📸 Citizens validate the resolution and provide feedback.
7. 👨‍💼 Administrators review the validation and finalize the complaint status.


🛠️ Technology Stack

- ⚛️ React Native
- 📱 Expo
- 🗄️ Supabase
- 🐘 PostgreSQL
- 🔄 n8n
- 🤖 Artificial Intelligence (AI)
- 🧠 Natural Language Processing (NLP)
- 👁️ Computer Vision
- 📍 Geospatial Analysis
- 🔔 Push Notifications

