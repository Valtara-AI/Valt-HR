import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample jobs
  const job1 = await prisma.job.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      description: 'We are looking for an experienced full-stack developer to join our growing engineering team. You will work on cutting-edge web applications using React, Node.js, and modern cloud technologies.',
      requirements: JSON.stringify({
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS', 'Docker'],
        experience: 5,
        education: "Bachelor's degree in Computer Science or related field",
        mustHave: ['React', 'Node.js', 'TypeScript'],
        niceToHave: ['AWS', 'Docker', 'Kubernetes'],
      }),
      status: 'open',
      postedAt: new Date(),
    },
  });

  const job2 = await prisma.job.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Product Manager',
      department: 'Product',
      description: 'Seeking a strategic and analytical product manager to drive product vision and roadmap. You will work closely with engineering, design, and business stakeholders.',
      requirements: JSON.stringify({
        skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research', 'Roadmapping'],
        experience: 3,
        education: "Bachelor's degree in Business, Computer Science, or related field",
        mustHave: ['Product Strategy', 'Agile', 'Analytics'],
        niceToHave: ['SQL', 'Technical Background'],
      }),
      status: 'open',
      postedAt: new Date(),
    },
  });

  const job3 = await prisma.job.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: 'Senior DevOps Engineer',
      department: 'Engineering',
      description: 'Join our infrastructure team to build and maintain scalable cloud infrastructure. Experience with Kubernetes, CI/CD, and monitoring tools required.',
      requirements: JSON.stringify({
        skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Python'],
        experience: 4,
        education: "Bachelor's degree in Computer Science or equivalent experience",
        mustHave: ['Kubernetes', 'Docker', 'AWS'],
        niceToHave: ['Terraform', 'Python', 'Monitoring Tools'],
      }),
      status: 'open',
      postedAt: new Date(),
    },
  });

  const job4 = await prisma.job.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: 'UX/UI Designer',
      department: 'Design',
      description: 'Creative and user-focused designer to craft beautiful and intuitive user experiences. You will work on web and mobile applications.',
      requirements: JSON.stringify({
        skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
        experience: 3,
        education: "Bachelor's degree in Design or related field",
        mustHave: ['Figma', 'UI Design', 'UX Research'],
        niceToHave: ['Design Systems', 'Animation', 'Front-end coding'],
      }),
      status: 'open',
      postedAt: new Date(),
    },
  });

  const job5 = await prisma.job.upsert({
    where: { id: 5 },
    update: {},
    create: {
      title: 'Data Scientist',
      department: 'Data',
      description: 'Experienced data scientist to build machine learning models and derive insights from large datasets. Strong background in Python and statistics required.',
      requirements: JSON.stringify({
        skills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow', 'PyTorch'],
        experience: 4,
        education: "Master's degree in Computer Science, Statistics, or related field",
        mustHave: ['Python', 'Machine Learning', 'Statistics'],
        niceToHave: ['TensorFlow', 'PyTorch', 'Big Data'],
      }),
      status: 'open',
      postedAt: new Date(),
    },
  });

  console.log('✅ Created jobs:', {
    job1: job1.title,
    job2: job2.title,
    job3: job3.title,
    job4: job4.title,
    job5: job5.title,
  });

  // Create sample candidates with applications
  const candidate1 = await prisma.candidate.upsert({
    where: { email: 'alice.smith@example.com' },
    update: {},
    create: {
      name: 'Alice Smith',
      email: 'alice.smith@example.com',
      phone: '+1234567890',
      resumeUrl: 'https://example.com/resumes/alice-smith.pdf',
      skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL']),
      experience: JSON.stringify([
        {
          company: 'Tech Corp',
          title: 'Senior Developer',
          duration: '3 years',
          description: 'Built scalable web applications',
        },
        {
          company: 'StartupXYZ',
          title: 'Full Stack Developer',
          duration: '2 years',
          description: 'Full-stack development with React and Node.js',
        },
      ]),
      education: JSON.stringify({
        degree: "Bachelor's in Computer Science",
        institution: 'State University',
        year: 2017,
      }),
    },
  });

  const application1 = await prisma.application.upsert({
    where: { id: 1 },
    update: {},
    create: {
      candidateId: candidate1.id,
      jobId: job1.id,
      stage: 'screening',
      status: 'under_review',
      score: 85,
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  const candidate2 = await prisma.candidate.upsert({
    where: { email: 'bob.jones@example.com' },
    update: {},
    create: {
      name: 'Bob Jones',
      email: 'bob.jones@example.com',
      phone: '+1234567891',
      resumeUrl: 'https://example.com/resumes/bob-jones.pdf',
      skills: JSON.stringify(['Product Management', 'Agile', 'Analytics', 'SQL']),
      experience: JSON.stringify([
        {
          company: 'BigCo',
          title: 'Product Manager',
          duration: '4 years',
          description: 'Led product development for enterprise software',
        },
      ]),
      education: JSON.stringify({
        degree: 'MBA',
        institution: 'Business School',
        year: 2018,
      }),
    },
  });

  const application2 = await prisma.application.upsert({
    where: { id: 2 },
    update: {},
    create: {
      candidateId: candidate2.id,
      jobId: job2.id,
      stage: 'assessment',
      status: 'under_review',
      score: 78,
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  const candidate3 = await prisma.candidate.upsert({
    where: { email: 'charlie.brown@example.com' },
    update: {},
    create: {
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      phone: '+1234567892',
      resumeUrl: 'https://example.com/resumes/charlie-brown.pdf',
      skills: JSON.stringify(['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Python']),
      experience: JSON.stringify([
        {
          company: 'Cloud Services Inc',
          title: 'DevOps Engineer',
          duration: '5 years',
          description: 'Infrastructure automation and cloud architecture',
        },
      ]),
      education: JSON.stringify({
        degree: "Bachelor's in Computer Engineering",
        institution: 'Tech University',
        year: 2015,
      }),
    },
  });

  const application3 = await prisma.application.upsert({
    where: { id: 3 },
    update: {},
    create: {
      candidateId: candidate3.id,
      jobId: job3.id,
      stage: 'interview',
      status: 'under_review',
      score: 92,
      appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
  });

  console.log('✅ Created candidates and applications:', {
    candidate1: candidate1.name,
    candidate2: candidate2.name,
    candidate3: candidate3.name,
  });

  console.log('\n✅ Database seeded successfully!');
  console.log('\nSummary:');
  console.log(`- ${5} jobs created`);
  console.log(`- ${3} candidates created`);
  console.log(`- ${3} applications created`);
  console.log('\nYou can view the data at: http://localhost:5555 (run: npx prisma studio)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
