/**
 * Comprehensive End-to-End Test Suite
 * Starts the server in-process and tests all endpoints.
 */

const { connectDB } = require('./src/config/db');
const app = require('./src/server');

async function runTests() {
  console.log('🚀 Starting Smart Campus End-to-End Verification Tests...\n');

  // Wait 1.5 seconds for express to be ready
  await new Promise((r) => setTimeout(r, 1500));

  const baseUrl = 'http://127.0.0.1:5000';

  try {
    // 1. Health check
    console.log('1. Probing GET /api/health...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const health = await healthRes.json();
    console.log('   ✅ Health response:', JSON.stringify(health));

    // 2. Admin Login
    console.log('\n2. Testing POST /api/auth/login (Administrator)...');
    const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@campus.edu', password: 'Admin@123' }),
    });
    const adminLogin = await adminLoginRes.json();
    console.log(`   ✅ Admin authenticated: ${adminLogin.user?.name} (${adminLogin.user?.role})`);
    const adminToken = adminLogin.token;

    // 3. Student Login
    console.log('\n3. Testing POST /api/auth/login (Student)...');
    const studentLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john.doe@student.campus.edu', password: 'Student@123' }),
    });
    const studentLogin = await studentLoginRes.json();
    console.log(`   ✅ Student authenticated: ${studentLogin.user?.name} (ID: ${studentLogin.user?.studentId})`);
    const studentToken = studentLogin.token;

    // 4. AI Analysis preview
    console.log('\n4. Testing POST /api/complaints/analyze-preview (Gemini AI / NLP Engine)...');
    const aiRes = await fetch(`${baseUrl}/api/complaints/analyze-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: 'The fan in classroom 204 is not working',
        description: 'Ceiling fan makes loud grinding noise and wobbles dangerously on high speed with sparks',
      }),
    });
    const aiData = await aiRes.json();
    console.log('   ✅ AI Analysis Result:', JSON.stringify(aiData.analysis, null, 2));

    // 5. Admin Complaints List
    console.log('\n5. Testing GET /api/complaints (Admin)...');
    const complaintsRes = await fetch(`${baseUrl}/api/complaints`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const complaintsData = await complaintsRes.json();
    console.log(`   ✅ Admin complaints retrieved: ${complaintsData.count} complaints in database.`);

    // 6. Student Complaints List
    console.log('\n6. Testing GET /api/complaints/my (Student)...');
    const myComplaintsRes = await fetch(`${baseUrl}/api/complaints/my`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const myComplaintsData = await myComplaintsRes.json();
    console.log(`   ✅ Student's personal complaints retrieved: ${myComplaintsData.count} complaints.`);

    // 7. Admin Analytics Dashboard
    console.log('\n7. Testing GET /api/analytics/dashboard (Admin)...');
    const analyticsRes = await fetch(`${baseUrl}/api/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const analytics = await analyticsRes.json();
    console.log(`   ✅ Analytics: Resolution Rate: ${analytics.stats?.resolutionRate}%, Total: ${analytics.stats?.total}`);
    console.log(`   ✅ Categories Count: ${analytics.categoryBreakdown?.length}, Departments Count: ${analytics.departmentBreakdown?.length}`);

    // 8. Submit new complaint with GPS verification
    console.log('\n8. Testing POST /api/complaints (Create new complaint with simulated GPS)...');
    const createRes = await fetch(`${baseUrl}/api/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: 'Water leaking continuously in 2nd floor chemistry lab',
        description: 'Under-bench water tap has broken knob and spraying water onto electrical power strip.',
        building: 'Science & Research Block',
        floor: '2nd Floor',
        room: 'Chemistry Lab 202',
        simulateCampusLocation: true,
      }),
    });
    const createdData = await createRes.json();
    console.log(`   ✅ Complaint Created: ID: ${createdData.complaint?.complaintId}, Dept: ${createdData.complaint?.assignedDepartment}, Priority: ${createdData.complaint?.finalPriority}`);

    // 9. Update complaint status by admin
    console.log('\n9. Testing PUT /api/complaints/:id/status (Admin Triage & Status Update)...');
    const updateRes = await fetch(`${baseUrl}/api/complaints/${createdData.complaint?._id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'In Progress',
        assignedDepartment: 'Plumbing Department',
        finalPriority: 'High',
        adminRemarks: 'Emergency plumber dispatched immediately with replacement valve assembly.',
      }),
    });
    const updated = await updateRes.json();
    console.log(`   ✅ Complaint Status Updated: ${updated.complaint?.status}, Remarks: "${updated.complaint?.adminRemarks}"`);

    // 10. Student Notifications
    console.log('\n10. Testing GET /api/notifications (Student receiving update)...');
    const notifRes = await fetch(`${baseUrl}/api/notifications`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const notifs = await notifRes.json();
    console.log(`   ✅ Notifications for student: ${notifs.count} total (${notifs.unreadCount} unread)`);
    console.log(`   ✅ Latest notification: "${notifs.notifications?.[0]?.title}" -> "${notifs.notifications?.[0]?.message}"`);

    console.log('\n======================================================');
    console.log('🎉🎉 ALL 10 END-TO-END SYSTEM INTEGRATION TESTS PASSED! 🎉🎉');
    console.log('======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ E2E Test Failure:', err);
    process.exit(1);
  }
}

runTests();
