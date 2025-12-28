export async function loginApi(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "blocked@example.com") {
        reject({ status: 403, message: "User is blocked" });
      }
      else if (email === "server@example.com") {
        reject({ status: 500, message: "Server error" });
      }
      else if (email === "network@example.com") {
        reject({ status: 0, message: "Network error" });
      }
      else if (password !== "123456") {
        reject({ status: 401, message: "Wrong password or email" });
      }
      else {
        resolve({ success: true, userId: "user-1" });
      }
    }, 1000);
  });
}

export async function verifyCodeApi(code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code !== "123456") {
        reject({ status: 400, message: "Invalid verification code" });
      }
      else {
        resolve({ success: true });
      }
    }, 1000);
  });
}
