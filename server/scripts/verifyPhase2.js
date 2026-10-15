const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Phase 2 Backend & Database End-to-End Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`).then((r) => r.json());
    assert(healthRes.status === 'ok', 'Health check returns status: ok');

    // 2. Fetch event
    const eventRes = await fetch(`${BASE_URL}/events`).then((r) => r.json());
    assert(eventRes && eventRes.title === 'ACET Dandiya Celebration', 'GET /api/events returns event document');

    // 3. Organizer login with WRONG password
    const badLoginRes = await fetch(`${BASE_URL}/organizer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong_password_test' }),
    });
    assert(badLoginRes.status === 401, 'POST /api/organizer/login with invalid password rejected with 401');

    // 4. Organizer login with CORRECT password ('acet_ca_26')
    const goodLoginRes = await fetch(`${BASE_URL}/organizer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'acet_ca_26' }),
    });
    assert(goodLoginRes.status === 200, 'POST /api/organizer/login with valid password accepted with 200');
    const loginData = await goodLoginRes.json();
    assert(Boolean(loginData.token), 'Organizer login returns signed session token');
    const token = loginData.token;

    // 5. Protected route rejection without token
    const unauthEventUpdate = await fetch(`${BASE_URL}/events`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hacked Title', college: 'Hacked College' }),
    });
    assert(unauthEventUpdate.status === 401, 'PUT /api/events without auth header rejected with 401');

    // 6. Update event settings with token
    const updateEventRes = await fetch(`${BASE_URL}/events`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'ACET Dandiya Celebration 2026',
        college: 'ACET College, Aligarh',
        date: '2026-10-24',
        time: '6:30 PM onwards',
        venue: 'ACET College Campus, Aligarh',
        hindiHeadline: 'रंगों की शाम,\nगरबा के नाम',
        hindiSubheading: 'संगीत, संस्कृति और खुशियों से सजी एक यादगार शाम।',
        invitationMessage: 'Respected Faculty Members,\n\nYou are cordially invited to Dandiya Celebration 2026.\n\nWith warm regards,\nACET College, Aligarh',
        thankYouMessage: 'Thank you for accepting our invitation.!',
      }),
    });
    assert(updateEventRes.status === 200, 'PUT /api/events with token succeeds with 200');
    const updatedEvent = await updateEventRes.json();
    assert(updatedEvent.event?.title === 'ACET Dandiya Celebration 2026', 'Updated event settings persist in MongoDB');

    // 7. Fetch Faculty list
    const facultyList = await fetch(`${BASE_URL}/faculty`).then((r) => r.json());
    assert(Array.isArray(facultyList) && facultyList.length > 0, `GET /api/faculty returns ${facultyList.length} members`);

    // 8. Add faculty member with token
    const uniqueTestName = `Test Faculty ${Date.now()}`;
    const addFacultyRes = await fetch(`${BASE_URL}/faculty`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: uniqueTestName,
        designation: 'Visiting Lecturer',
        customMessage: 'A special personalized note for this faculty member.',
        priority: 50,
      }),
    });
    assert(addFacultyRes.status === 201, 'POST /api/faculty with token creates new faculty member');
    const newFaculty = await addFacultyRes.json();
    assert(newFaculty.name === uniqueTestName, 'Created faculty has expected name');
    assert(newFaculty.customMessage === 'A special personalized note for this faculty member.', 'Custom message saved in database');

    // 9. Update faculty member details with token
    const updateFacultyRes = await fetch(`${BASE_URL}/faculty/${newFaculty._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        designation: 'Senior Visiting Lecturer',
        priority: 45,
      }),
    });
    assert(updateFacultyRes.status === 200, 'PUT /api/faculty/:id with token updates faculty details');
    const updatedMember = await updateFacultyRes.json();
    assert(updatedMember.faculty.designation === 'Senior Visiting Lecturer', 'Updated designation persisted');

    // 10. Fetch stats
    const statsRes = await fetch(`${BASE_URL}/invitations/stats`).then((r) => r.json());
    assert(statsRes && typeof statsRes.total === 'number' && typeof statsRes.signed === 'number', 'GET /api/invitations/stats returns real stats');

    // 11. Test duplicate signature prevention
    // Find an already signed faculty member
    const signedFaculty = facultyList.find((f) => f.invitation?.status === 'signed');
    if (signedFaculty) {
      // Create a dummy multipart form to attempt duplicate sign
      const boundary = '----WebKitFormBoundaryTest123';
      const body = `--${boundary}\r\nContent-Disposition: form-data; name="facultyId"\r\n\r\n${signedFaculty._id}\r\n--${boundary}\r\nContent-Disposition: form-data; name="signature"; filename="sig.png"\r\nContent-Type: image/png\r\n\r\nfakePNGdata\r\n--${boundary}--\r\n`;

      const dupRes = await fetch(`${BASE_URL}/invitations/sign`, {
        method: 'POST',
        headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
        body: Buffer.from(body),
      });
      assert(dupRes.status === 409, 'POST /api/invitations/sign rejects duplicate signature with 409 Conflict');
    }

    console.log(`\n📊 Test Summary: ${passed} Passed, ${failed} Failed`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Unexpected test error:', err);
    process.exit(1);
  }
}

runTests();
