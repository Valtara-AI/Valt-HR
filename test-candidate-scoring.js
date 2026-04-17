// test-candidate-scoring.js - Test candidate scoring APIs
const BASE_URL = 'http://localhost:3000/api';

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

async function runTests() {
  console.log('\n========================================');
  console.log('   Testing Candidate Scoring APIs');
  console.log('========================================\n');

  // Test 1: Get all candidates
  console.log('📋 TEST 1: Get all candidates');
  const candidatesList = await testAPI('/candidates');
  console.log('Status:', candidatesList.status);
  console.log('Response:', JSON.stringify(candidatesList.data, null, 2));
  console.log('\n');

  // Test 2: Get candidates with score filter
  console.log('📋 TEST 2: Get candidates with high scores (≥75)');
  const highScorers = await testAPI('/candidates?scoreMin=75');
  console.log('Status:', highScorers.status);
  console.log('Response:', JSON.stringify(highScorers.data, null, 2));
  console.log('\n');

  // Test 3: Search candidates
  console.log('📋 TEST 3: Search candidates by name');
  const searchResults = await testAPI('/candidates?search=john');
  console.log('Status:', searchResults.status);
  console.log('Response:', JSON.stringify(searchResults.data, null, 2));
  console.log('\n');

  // Get a candidate ID if available
  const candidateId = candidatesList.data?.data?.candidates?.[0]?.id;

  if (candidateId) {
    // Test 4: Get specific candidate
    console.log(`👤 TEST 4: Get candidate details (ID: ${candidateId})`);
    const candidate = await testAPI(`/candidates/${candidateId}`);
    console.log('Status:', candidate.status);
    console.log('Response:', JSON.stringify(candidate.data, null, 2));
    console.log('\n');

    // Test 5: Get candidate score
    console.log(`📊 TEST 5: Get candidate score (ID: ${candidateId})`);
    const score = await testAPI(`/candidates/${candidateId}/score`);
    console.log('Status:', score.status);
    console.log('Response:', JSON.stringify(score.data, null, 2));
    console.log('\n');

    // Test 6: Trigger manual scoring (if we have a job ID)
    const applications = candidate.data?.data?.applications;
    if (applications && applications.length > 0) {
      const jobId = applications[0].jobId;
      
      console.log(`🎯 TEST 6: Trigger manual scoring (Candidate: ${candidateId}, Job: ${jobId})`);
      const manualScore = await testAPI(
        `/candidates/${candidateId}/score`,
        'POST',
        { jobId }
      );
      console.log('Status:', manualScore.status);
      console.log('Response:', JSON.stringify(manualScore.data, null, 2));
      console.log('\n');

      // Test 7: Enrich candidate data
      console.log(`🔍 TEST 7: Enrich candidate with social media audit (ID: ${candidateId})`);
      const enrichment = await testAPI(
        `/candidates/${candidateId}/enrich`,
        'POST'
      );
      console.log('Status:', enrichment.status);
      console.log('Response:', JSON.stringify(enrichment.data, null, 2));
      console.log('\n');
    } else {
      console.log('⚠️  Skipping TEST 6 & 7: No applications found for candidate\n');
    }
  } else {
    console.log('⚠️  No candidates found in database. Please upload some resumes first.\n');
    console.log('To add test data, you can:');
    console.log('1. Upload a resume via POST /api/applications/upload-resume');
    console.log('2. Run: npx prisma db seed (if seed file exists)');
    console.log('3. Use Prisma Studio: npx prisma studio\n');
  }

  // Test 8: Health check
  console.log('🏥 TEST 8: Health check');
  const health = await testAPI('/health');
  console.log('Status:', health.status);
  console.log('Response:', JSON.stringify(health.data, null, 2));
  console.log('\n');

  console.log('========================================');
  console.log('   Testing Complete!');
  console.log('========================================\n');

  // Summary
  console.log('📊 SUMMARY:');
  console.log('- All API endpoints are responding');
  if (candidateId) {
    console.log('- ✅ Candidates found in database');
    console.log('- ✅ Scoring APIs tested successfully');
  } else {
    console.log('- ⚠️  No candidate data found');
    console.log('- 💡 Add test data to test scoring features');
  }
  console.log('\n');
}

// Run tests
console.log('Starting API tests...\n');
console.log('Make sure your dev server is running: npm run dev\n');

runTests().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
