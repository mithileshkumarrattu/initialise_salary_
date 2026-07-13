async function testSignup() {
  const res = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test6@test.com",
      password: "password123",
      name: "Test User 6",
      orgName: "Test Org 6",
      orgType: "COLLEGE",
      role: "admin"
    })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}

testSignup();
