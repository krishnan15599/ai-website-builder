import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_WEBSITE = {
  theme: "light",
  sections: [
    {
      id: "hero-1",
      type: "hero",
      title: "Welcome to your new website",
      subtitle: "Edit this site with AI in the chat panel.",
    },
  ],
};

const SAAS_TEMPLATE = {
  theme: "dark",
  sections: [
    {
      id: "hero-1",
      type: "hero",
      badge: "AI-Powered",
      title: "Build your SaaS site in minutes",
      subtitle: "Launch faster with an AI website builder.",
      primaryBtnText: "Start free",
      secondaryBtnText: "See demo",
    },
    {
      id: "features-1",
      type: "features",
      title: "Everything you need",
      featuresList: [
        {
          title: "AI Editor",
          description: "Edit sections with natural language.",
          iconName: "Zap",
        },
        {
          title: "Version history",
          description: "Restore any snapshot instantly.",
          iconName: "Shield",
        },
      ],
    },
    {
      id: "pricing-1",
      type: "pricing",
      title: "Simple pricing",
      plans: [
        {
          name: "Starter",
          price: "$0",
          period: "/mo",
          features: ["1 project", "AI edits"],
          btnText: "Get started",
        },
        {
          name: "Pro",
          price: "$29",
          period: "/mo",
          features: ["Unlimited projects", "Priority AI"],
          isPopular: true,
          btnText: "Go Pro",
        },
      ],
    },
  ],
};

const RESTAURANT_TEMPLATE = {
  theme: "light",
  sections: [
    {
      id: "hero-1",
      type: "hero",
      title: "Bella Cucina",
      subtitle: "Authentic Italian dining in the heart of the city.",
      primaryBtnText: "Reserve a table",
    },
    {
      id: "contact-1",
      type: "contact",
      title: "Visit us",
      email: "hello@bellacucina.com",
      supportText: "Open Tue–Sun, 5pm–11pm",
    },
  ],
};

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@aetheria.dev" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000099",
      email: "demo@aetheria.dev",
    },
  });

  const project = await prisma.project.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      userId: user.id,
      name: "Demo Website",
      description: "Sample project for local development",
      theme: "light",
      websiteJson: DEFAULT_WEBSITE,
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        projectId: project.id,
        role: "assistant",
        content:
          "Hi! I'm your AI website assistant. Try asking me to build or edit your site.",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.websiteVersion.create({
    data: {
      projectId: project.id,
      websiteJson: DEFAULT_WEBSITE,
    },
  });

  await prisma.projectSettings.upsert({
    where: { projectId: project.id },
    update: {},
    create: {
      projectId: project.id,
      seoTitle: "Demo Website",
      publishStatus: "draft",
    },
  });

  await prisma.template.upsert({
    where: { id: "00000000-0000-0000-0000-000000000010" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000010",
      name: "SaaS Landing",
      category: "saas",
      description: "Dark SaaS landing with hero, features, and pricing",
      websiteJson: SAAS_TEMPLATE,
      isPublic: true,
    },
  });

  await prisma.template.upsert({
    where: { id: "00000000-0000-0000-0000-000000000011" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000011",
      name: "Restaurant",
      category: "local",
      description: "Light restaurant site with hero and contact",
      websiteJson: RESTAURANT_TEMPLATE,
      isPublic: true,
    },
  });

  console.log("Seed complete:", { userId: user.id, projectId: project.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
