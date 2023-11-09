import { SidebarLink } from "@/types";

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgURL: "/assets/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: "/assets/icons/suitcase.svg",
    route: "/jobs",
    label: "Find Jobs",
  },
  {
    imgURL: "/assets/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/assets/icons/question.svg",
    route: "/ask-question",
    label: "Ask a question",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};

// Below are temporary defined data or objects
// export const topQuestions: Question[] = [
//   { _id: "1",
//     title: "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?"
//   },
//   { _id: "2",
//     title: "Can I get the course for free?"
//   },
//   { _id: "3",
//     title: "Redux Toolkit Not Updating State as Expected"
//   },
//   { _id: "4",
//     title: "Async/Await Function Not Handling Errors Properly"
//   },
//   { _id: "5",
//     title: "How do I use express as a custom server in NextJS?"
//   },
// ];

// export const popularTags: Tags[] = [
//   { _id: "1", name: "nextjs", totalQuestions: 10 },
//   { _id: "2", name: "react", totalQuestions: 7 },
//   { _id: "3", name: "vue", totalQuestions: 3 },
//   { _id: "4", name: "redux", totalQuestions: 4 },
//   { _id: "5", name: "CSS", totalQuestions: 3 },
// ];
