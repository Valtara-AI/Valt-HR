// test/test-candidate-scoring.ts - Test candidate scoring APIs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestData() {
  console.log('🧪 Creating test data...\n');

  // Create a test job
  const job = await prisma.job.create({
    data: {
      title: 'Senior Software Engineer',
      description: 'Looking for an experienced software engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'full_time',
      status: 'open',
      requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      preferredSkills: ['Next.js', 'PostgreSQL', 'AWS'],
      minExperience: 5,
      minEducation: 'Bachelor',
      hiringManagerEmail: 'manager@company.com',
      hiringManagerName: 'John Manager',
    },
  });

  console.log(`✅ Created job: ${job.title} (ID: ${job.id})`);

  // Create test candidate 1 - Exceptional
  const candidate1 = await prisma.candidate.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1234567890',
      resumeParsedData: {
        personalInfo: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@example.com',
          phone: '+1234567890',
          linkedinUrl: 'https://linkedin.com/in/sarah-johnson',
        },
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL', 'AWS', 'Docker'],
        experience: [
          {
            company: 'Tech Corp',
            title: 'Senior Software Engineer',
            startDate: '2018-01-01',
            endDate: '2024-11-01',
            description: 'Led development team',
          },
          {
            company: 'Startup Inc',
            title: 'Software Engineer',
            startDate: '2015-06-01',
            endDate: '2017-12-01',
            description: 'Full stack development',
          },
        ],
        education: [
          {
            institution: 'MIT',
            degree: 'Bachelor',
            field: 'Computer Science',
            startDate: '2011-09-01',
            endDate: '2015-05-01',
          },
        ],
        certifications: ['AWS Certified Developer', 'React Advanced'],
        summary: 'Experienced software engineer with 9+ years of experience in full-stack development',
      },
    },
  });

  console.log(`✅ Created candidate: ${candidate1.firstName} ${candidate1.lastName} (ID: ${candidate1.id})`);

  // Create application for candidate 1
  const app1 = await prisma.application.create({
    data: {
      candidateId: candidate1.id,
      jobId: job.id,
      stage: 'screening',
      status: 'pending',
      source: 'career_site',
    },
  });

  console.log(`✅ Created application: ${app1.id}\n`);

  // Create test candidate 2 - Strong
  const candidate2 = await prisma.candidate.create({
    data: {
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      phone: '+1234567891',
      resumeParsedData: {
        personalInfo: {
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael.chen@example.com',
          phone: '+1234567891',
          linkedinUrl: 'https://linkedin.com/in/michael-chen',
        },
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        experience: [
          {
            company: 'Web Solutions',
            title: 'Software Engineer',
            startDate: '2020-03-01',
            endDate: null,
            description: 'Full stack development',
          },
        ],
        education: [
          {
            institution: 'State University',
            degree: 'Bachelor',
            field: 'Computer Science',
            startDate: '2016-09-01',
            endDate: '2020-05-01',
          },
        ],
        certifications: [],
        summary: 'Software engineer with 4 years of experience',
      },
    },
  });

  console.log(`✅ Created candidate: ${candidate2.firstName} ${candidate2.lastName} (ID: ${candidate2.id})`);

  const app2 = await prisma.application.create({
    data: {
      candidateId: candidate2.id,
      jobId: job.id,
      stage: 'screening',
      status: 'pending',
      source: 'linkedin',
    },
  });

  console.log(`✅ Created application: ${app2.id}\n`);

  // Create test candidate 3 - Qualified with gaps
  const candidate3 = await prisma.candidate.create({
    data: {
      firstName: 'Emma',
      lastName: 'Davis',
      email: 'emma.davis@example.com',
      phone: '+1234567892',
      resumeParsedData: {
        personalInfo: {
          firstName: 'Emma',
          lastName: 'Davis',
          email: 'emma.davis@example.com',
          phone: '+1234567892',
        },
        skills: ['JavaScript', 'HTML', 'CSS'],
        experience: [
          {
            company: 'Small Agency',
            title: 'Junior Developer',
            startDate: '2021-01-01',
            endDate: '2023-06-01',
            description: 'Web development',
          },
          {
            company: 'Freelance',
            title: 'Web Developer',
            startDate: '2018-03-01',
            endDate: '2019-12-01',
            description: 'Various projects',
          },
        ],
        education: [
          {
            institution: 'Community College',
            degree: 'Associate',
            field: 'Web Development',
            startDate: '2016-09-01',
            endDate: '2018-05-01',
          },
        ],
        certifications: [],
        summary: 'Web developer looking for new opportunities',
      },
    },
  });

  console.log(`✅ Created candidate: ${candidate3.firstName} ${candidate3.lastName} (ID: ${candidate3.id})`);

  const app3 = await prisma.application.create({
    data: {
      candidateId: candidate3.id,
      jobId: job.id,
      stage: 'screening',
      status: 'pending',
      source: 'referral',
    },
  });

  console.log(`✅ Created application: ${app3.id}\n`);

  return {
    job,
    candidates: [candidate1, candidate2, candidate3],
    applications: [app1, app2, app3],
  };
}

async function testScoringAPIs(testData: any) {
  console.log('🧪 Testing Scoring APIs...\n');

  const baseUrl = 'http://localhost:3000/api';
  const { candidates, job } = testData;

  // Test 1: Get all candidates
  console.log('📋 Test 1: GET /api/candidates');
  const listResponse = await fetch(`${baseUrl}/candidates`);
  const listData = await listResponse.json();
  console.log(`✅ Found ${listData.data?.candidates?.length || 0} candidates\n`);

  // Test 2: Score each candidate
  for (const candidate of candidates) {
    console.log(`🎯 Test 2: POST /api/candidates/${candidate.id}/score`);
    console.log(`   Scoring: ${candidate.firstName} ${candidate.lastName}`);
    
    const scoreResponse = await fetch(`${baseUrl}/candidates/${candidate.id}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: job.id }),
    });
    
    const scoreData = await scoreResponse.json();
    
    if (scoreData.success) {
      console.log(`   ✅ Score: ${scoreData.data.resumeScore}/100`);
      console.log(`   📊 Breakdown:`);
      console.log(`      - Skills: ${scoreData.data.breakdown.skillsScore}`);
      console.log(`      - Experience: ${scoreData.data.breakdown.experienceScore}`);
      console.log(`      - Education: ${scoreData.data.breakdown.educationScore}`);
      console.log(`      - Other: ${scoreData.data.breakdown.otherScore}`);
      console.log(`   🏆 Category: ${scoreData.data.category.category} - ${scoreData.data.category.description}`);
      
      if (scoreData.data.redFlags.length > 0) {
        console.log(`   🚩 Red Flags: ${scoreData.data.redFlags.join(', ')}`);
      }
    } else {
      console.log(`   ❌ Error: ${scoreData.error}`);
    }
    console.log('');
  }

  // Test 3: Get candidate score
  const candidate = candidates[0];
  console.log(`📊 Test 3: GET /api/candidates/${candidate.id}/score`);
  const getScoreResponse = await fetch(`${baseUrl}/candidates/${candidate.id}/score`);
  const getScoreData = await getScoreResponse.json();
  
  if (getScoreData.success) {
    console.log(`✅ Average Score: ${getScoreData.data.averageScore}/100`);
    console.log(`🏆 Category: ${getScoreData.data.category.category}\n`);
  } else {
    console.log(`❌ Error: ${getScoreData.error}\n`);
  }

  // Test 4: Enrich candidate
  console.log(`🔍 Test 4: POST /api/candidates/${candidate.id}/enrich`);
  const enrichResponse = await fetch(`${baseUrl}/candidates/${candidate.id}/enrich`, {
    method: 'POST',
  });
  const enrichData = await enrichResponse.json();
  
  if (enrichData.success) {
    console.log(`✅ LinkedIn Score: ${enrichData.data.linkedInProfile.professionalPresenceScore}/100`);
    console.log(`✅ Background Check: ${enrichData.data.backgroundCheck.employmentVerified ? 'Verified' : 'Issues Found'}`);
    console.log(`✅ Enrichment Score: ${enrichData.data.enrichmentScore}/100`);
    
    if (enrichData.data.redFlags.length > 0) {
      console.log(`🚩 Red Flags: ${enrichData.data.redFlags.join(', ')}`);
    }
  } else {
    console.log(`❌ Error: ${enrichData.error}`);
  }
  console.log('');

  // Test 5: Filter candidates by score
  console.log('🔍 Test 5: GET /api/candidates?scoreMin=75');
  const filterResponse = await fetch(`${baseUrl}/candidates?scoreMin=75`);
  const filterData = await filterResponse.json();
  
  if (filterData.success) {
    console.log(`✅ Found ${filterData.data?.candidates?.length || 0} candidates with score >= 75\n`);
  }

  // Test 6: Get candidate details
  console.log(`👤 Test 6: GET /api/candidates/${candidate.id}`);
  const detailResponse = await fetch(`${baseUrl}/candidates/${candidate.id}`);
  const detailData = await detailResponse.json();
  
  if (detailData.success) {
    console.log(`✅ Name: ${detailData.data.firstName} ${detailData.data.lastName}`);
    console.log(`📧 Email: ${detailData.data.email}`);
    console.log(`📱 Phone: ${detailData.data.phone}`);
    console.log(`📊 Applications: ${detailData.data.applications.length}`);
  } else {
    console.log(`❌ Error: ${detailData.error}`);
  }
  console.log('');
}

async function cleanup() {
  console.log('\n🧹 Cleaning up test data...');
  
  await prisma.application.deleteMany({
    where: {
      job: {
        title: 'Senior Software Engineer',
      },
    },
  });
  
  await prisma.candidate.deleteMany({
    where: {
      email: {
        endsWith: '@example.com',
      },
    },
  });
  
  await prisma.job.deleteMany({
    where: {
      title: 'Senior Software Engineer',
    },
  });
  
  console.log('✅ Cleanup complete\n');
}

async function main() {
  try {
    console.log('='.repeat(60));
    console.log('   🧪 CANDIDATE SCORING API TESTS');
    console.log('='.repeat(60));
    console.log('');

    const testData = await createTestData();
    await testScoringAPIs(testData);
    
    // Ask if user wants to cleanup
    console.log('='.repeat(60));
    console.log('   ✅ ALL TESTS COMPLETE!');
    console.log('='.repeat(60));
    console.log('\nTest data has been created. Run this script again with');
    console.log('cleanup to remove test data, or keep it for manual testing.\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
